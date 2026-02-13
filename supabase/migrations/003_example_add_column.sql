-- Migration: 003_example_add_column
-- Date: 2024-01-27
-- Description: Example - How to safely add columns to existing tables
-- Status: EXAMPLE ONLY - Shows safe patterns

-- Example: Adding avatar_url and bio to users table
-- This is SAFE to run even if columns already exist

DO $$ 
BEGIN
    -- Add avatar_url column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'users' AND column_name = 'avatar_url'
    ) THEN
        ALTER TABLE users ADD COLUMN avatar_url TEXT;
        RAISE NOTICE 'Added avatar_url column to users table';
    ELSE
        RAISE NOTICE 'avatar_url column already exists, skipping';
    END IF;

    -- Add bio column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'users' AND column_name = 'bio'
    ) THEN
        ALTER TABLE users ADD COLUMN bio TEXT;
        RAISE NOTICE 'Added bio column to users table';
    ELSE
        RAISE NOTICE 'bio column already exists, skipping';
    END IF;

    -- Add date_of_birth column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'users' AND column_name = 'date_of_birth'
    ) THEN
        ALTER TABLE users ADD COLUMN date_of_birth DATE;
        RAISE NOTICE 'Added date_of_birth column to users table';
    ELSE
        RAISE NOTICE 'date_of_birth column already exists, skipping';
    END IF;
END $$;

-- Example: Adding new column to lawyer_profiles
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'lawyer_profiles' AND column_name = 'rating'
    ) THEN
        ALTER TABLE lawyer_profiles ADD COLUMN rating DECIMAL(3,2) DEFAULT 0.0;
        RAISE NOTICE 'Added rating column to lawyer_profiles table';
    END IF;
END $$;
