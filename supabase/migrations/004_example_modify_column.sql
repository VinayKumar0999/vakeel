-- Migration: 004_example_modify_column
-- Date: 2024-01-27
-- Description: Example - How to safely modify existing columns
-- Status: EXAMPLE ONLY - Shows safe modification patterns

-- ⚠️ CAREFUL: Modifying existing columns requires data migration
-- Always backup first!

-- Example 1: Making a column nullable (safe if no data conflicts)
DO $$ 
BEGIN
    -- Check if column is currently NOT NULL
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'lawyer_profiles' 
        AND column_name = 'consultation_fee'
        AND is_nullable = 'NO'
    ) THEN
        -- Make it nullable
        ALTER TABLE lawyer_profiles 
          ALTER COLUMN consultation_fee DROP NOT NULL;
        RAISE NOTICE 'Made consultation_fee nullable';
    END IF;
END $$;

-- Example 2: Adding default value to existing column
DO $$ 
BEGIN
    -- Check if default doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'users' 
        AND column_name = 'verification_status'
        AND column_default IS NOT NULL
    ) THEN
        ALTER TABLE users 
          ALTER COLUMN verification_status SET DEFAULT 'PENDING';
        RAISE NOTICE 'Added default value to verification_status';
    END IF;
END $$;

-- Example 3: Changing column type (requires data migration)
-- Step 1: Add new column with new type
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'users' AND column_name = 'phone_new'
    ) THEN
        -- Add temporary column
        ALTER TABLE users ADD COLUMN phone_new TEXT;
        
        -- Migrate data (convert to new format if needed)
        UPDATE users SET phone_new = phone;
        
        -- Drop old column
        ALTER TABLE users DROP COLUMN phone;
        
        -- Rename new column
        ALTER TABLE users RENAME COLUMN phone_new TO phone;
        
        -- Add constraints back
        ALTER TABLE users ADD CONSTRAINT users_phone_unique UNIQUE (phone);
        
        RAISE NOTICE 'Migrated phone column type';
    END IF;
END $$;
