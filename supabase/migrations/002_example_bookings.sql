-- Migration: 002_example_bookings
-- Date: 2024-01-27
-- Description: Example migration - Add bookings table
-- Status: EXAMPLE ONLY - Not run yet
-- 
-- This is an example of how to add a new feature.
-- When you're ready to add bookings, uncomment and run this SQL.

/*
-- ✅ SAFE PATTERN: Uses IF NOT EXISTS - Safe to re-run
-- Create bookings table
CREATE TABLE IF NOT EXISTS bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  lawyer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  scheduled_at TIMESTAMP WITH TIME ZONE NOT NULL,
  duration_minutes INTEGER DEFAULT 30,
  status TEXT NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED')),
  consultation_fee DECIMAL(10,2) NOT NULL,
  meeting_link TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ✅ SAFE: Uses IF NOT EXISTS for indexes
CREATE INDEX IF NOT EXISTS idx_bookings_client_id ON bookings(client_id);
CREATE INDEX IF NOT EXISTS idx_bookings_lawyer_id ON bookings(lawyer_id);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_scheduled_at ON bookings(scheduled_at);

-- ✅ SAFE: Uses DROP IF EXISTS before creating trigger
DROP TRIGGER IF EXISTS update_bookings_updated_at ON bookings;
CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON bookings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS (safe to run multiple times)
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- ✅ SAFE: Uses DROP IF EXISTS before creating policies
DROP POLICY IF EXISTS "Clients can view own bookings" ON bookings;
CREATE POLICY "Clients can view own bookings" ON bookings
    FOR SELECT USING (client_id::text = auth.uid()::text);

DROP POLICY IF EXISTS "Lawyers can view own bookings" ON bookings;
CREATE POLICY "Lawyers can view own bookings" ON bookings
    FOR SELECT USING (lawyer_id::text = auth.uid()::text);

DROP POLICY IF EXISTS "Clients can create bookings" ON bookings;
CREATE POLICY "Clients can create bookings" ON bookings
    FOR INSERT WITH CHECK (client_id::text = auth.uid()::text);

DROP POLICY IF EXISTS "Lawyers can update own bookings" ON bookings;
CREATE POLICY "Lawyers can update own bookings" ON bookings
    FOR UPDATE USING (lawyer_id::text = auth.uid()::text);
*/
