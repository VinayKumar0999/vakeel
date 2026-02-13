-- Migration: 005_admin_agencies_system
-- Date: 2026-01-29
-- Description: Add agencies, super admin support, and approval tracking
-- Safe to re-run: YES (uses IF NOT EXISTS)

-- Update users table to support SUPER_ADMIN and AGENCY_ADMIN roles
DO $$ 
BEGIN
    -- Update role constraint to include new roles
    IF EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'users_role_check'
    ) THEN
        ALTER TABLE users DROP CONSTRAINT users_role_check;
    END IF;
    
    ALTER TABLE users 
      ADD CONSTRAINT users_role_check 
      CHECK (role IN ('CLIENT', 'LAWYER', 'ADMIN', 'SUPER_ADMIN', 'AGENCY_ADMIN'));
END $$;

-- Add fields for approval tracking
DO $$ 
BEGIN
    -- Add approved_by field to track who approved the lawyer
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'users' AND column_name = 'approved_by'
    ) THEN
        ALTER TABLE users ADD COLUMN approved_by UUID REFERENCES users(id);
    END IF;

    -- Add approval notes/reason
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'users' AND column_name = 'approval_notes'
    ) THEN
        ALTER TABLE users ADD COLUMN approval_notes TEXT;
    END IF;

    -- Add approval timestamp
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'users' AND column_name = 'approved_at'
    ) THEN
        ALTER TABLE users ADD COLUMN approved_at TIMESTAMP WITH TIME ZONE;
    END IF;
END $$;

-- Create agencies table
CREATE TABLE IF NOT EXISTS agencies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  email TEXT UNIQUE NOT NULL,
  phone TEXT NOT NULL,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  pincode TEXT NOT NULL,
  website TEXT,
  logo_path TEXT,
  agency_admin_id UUID UNIQUE REFERENCES users(id) ON DELETE SET NULL,
  verification_status TEXT DEFAULT 'PENDING' CHECK (verification_status IN ('PENDING', 'APPROVED', 'REJECTED')),
  approved_by UUID REFERENCES users(id),
  approval_notes TEXT,
  approved_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add agency_id to lawyer_profiles
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'lawyer_profiles' AND column_name = 'agency_id'
    ) THEN
        ALTER TABLE lawyer_profiles 
          ADD COLUMN agency_id UUID REFERENCES agencies(id) ON DELETE SET NULL;
    END IF;
END $$;

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_users_approved_by ON users(approved_by);
CREATE INDEX IF NOT EXISTS idx_users_verification_status_role ON users(verification_status, role);
CREATE INDEX IF NOT EXISTS idx_agencies_admin_id ON agencies(agency_admin_id);
CREATE INDEX IF NOT EXISTS idx_agencies_verification_status ON agencies(verification_status);
CREATE INDEX IF NOT EXISTS idx_lawyer_profiles_agency_id ON lawyer_profiles(agency_id);

-- Add trigger for agencies updated_at
DROP TRIGGER IF EXISTS update_agencies_updated_at ON agencies;
CREATE TRIGGER update_agencies_updated_at BEFORE UPDATE ON agencies
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS on agencies
ALTER TABLE agencies ENABLE ROW LEVEL SECURITY;

-- RLS Policies for agencies
DROP POLICY IF EXISTS "Admins can view all agencies" ON agencies;
CREATE POLICY "Admins can view all agencies" ON agencies
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id::text = auth.uid()::text 
            AND users.role IN ('ADMIN', 'SUPER_ADMIN')
        )
    );

DROP POLICY IF EXISTS "Agency admins can view own agency" ON agencies;
CREATE POLICY "Agency admins can view own agency" ON agencies
    FOR SELECT USING (agency_admin_id::text = auth.uid()::text);

DROP POLICY IF EXISTS "Admins can update agencies" ON agencies;
CREATE POLICY "Admins can update agencies" ON agencies
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id::text = auth.uid()::text 
            AND users.role IN ('ADMIN', 'SUPER_ADMIN')
        )
    );

-- Comments
COMMENT ON TABLE agencies IS 'Legal agencies/firms that can have multiple lawyers';
COMMENT ON COLUMN users.approved_by IS 'ID of admin who approved this user';
COMMENT ON COLUMN users.approval_notes IS 'Notes/reason for approval or rejection';
COMMENT ON COLUMN lawyer_profiles.agency_id IS 'Optional: Lawyer belongs to an agency';
