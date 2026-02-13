-- Migration: 001_initial_schema
-- Date: 2024-01-27
-- Description: Initial database schema for Vakeel Kutami
-- This is the base schema - all future migrations build on this

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  full_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('CLIENT', 'LAWYER', 'ADMIN')),
  verification_status TEXT DEFAULT 'PENDING' CHECK (verification_status IN ('PENDING', 'APPROVED', 'REJECTED')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Lawyer profiles table
CREATE TABLE IF NOT EXISTS lawyer_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  bar_council_number TEXT NOT NULL,
  bar_council_state TEXT NOT NULL,
  practice_areas TEXT[] NOT NULL DEFAULT '{}',
  years_of_experience TEXT NOT NULL,
  education TEXT NOT NULL,
  languages TEXT[] NOT NULL DEFAULT '{}',
  bio TEXT NOT NULL,
  consultation_fee DECIMAL(10,2) NOT NULL,
  specializations TEXT[] NOT NULL DEFAULT '{}',
  office_address TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  pincode TEXT NOT NULL,
  bar_certificate_path TEXT,
  id_proof_path TEXT,
  profile_photo_path TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_phone ON users(phone);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_verification_status ON users(verification_status);
CREATE INDEX IF NOT EXISTS idx_lawyer_profiles_user_id ON lawyer_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_lawyer_profiles_city ON lawyer_profiles(city);
CREATE INDEX IF NOT EXISTS idx_lawyer_profiles_state ON lawyer_profiles(state);
CREATE INDEX IF NOT EXISTS idx_lawyer_profiles_verification ON users(verification_status) WHERE role = 'LAWYER';

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers to auto-update updated_at
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_lawyer_profiles_updated_at ON lawyer_profiles;
CREATE TRIGGER update_lawyer_profiles_updated_at BEFORE UPDATE ON lawyer_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) Policies
-- Enable RLS on tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE lawyer_profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (for re-running)
DROP POLICY IF EXISTS "Users can view own profile" ON users;
DROP POLICY IF EXISTS "Users can update own profile" ON users;
DROP POLICY IF EXISTS "Public can view approved lawyers" ON lawyer_profiles;
DROP POLICY IF EXISTS "Lawyers can view own profile" ON lawyer_profiles;
DROP POLICY IF EXISTS "Lawyers can update own profile" ON lawyer_profiles;

-- Policy: Users can read their own data
CREATE POLICY "Users can view own profile" ON users
    FOR SELECT USING (auth.uid()::text = id::text);

-- Policy: Users can update their own data
CREATE POLICY "Users can update own profile" ON users
    FOR UPDATE USING (auth.uid()::text = id::text);

-- Policy: Anyone can read approved lawyer profiles (for public lawyer listings)
CREATE POLICY "Public can view approved lawyers" ON lawyer_profiles
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = lawyer_profiles.user_id 
            AND users.verification_status = 'APPROVED'
        )
    );

-- Policy: Lawyers can view their own profile
CREATE POLICY "Lawyers can view own profile" ON lawyer_profiles
    FOR SELECT USING (auth.uid()::text = user_id::text);

-- Policy: Lawyers can update their own profile
CREATE POLICY "Lawyers can update own profile" ON lawyer_profiles
    FOR UPDATE USING (auth.uid()::text = user_id::text);

-- Comments for documentation
COMMENT ON TABLE users IS 'Stores all users (clients, lawyers, admins)';
COMMENT ON TABLE lawyer_profiles IS 'Stores detailed information for lawyer accounts';
COMMENT ON COLUMN users.verification_status IS 'PENDING: Awaiting verification, APPROVED: Verified and active, REJECTED: Verification failed';
COMMENT ON COLUMN lawyer_profiles.practice_areas IS 'Array of practice areas the lawyer specializes in';
COMMENT ON COLUMN lawyer_profiles.languages IS 'Array of languages the lawyer can communicate in';
COMMENT ON COLUMN lawyer_profiles.specializations IS 'Array of specific specializations within practice areas';
