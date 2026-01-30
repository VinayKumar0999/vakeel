# Safe Migrations - Working with Existing Tables

## 🎯 Your Concern is Valid!

When you run migrations on existing tables, you need to be careful:
- ✅ **Don't break existing data**
- ✅ **Don't duplicate tables/columns**
- ✅ **Handle existing records properly**

---

## 🛡️ Safe Migration Patterns

### Pattern 1: **IF NOT EXISTS** (Safe for New Tables)

**Use when:** Creating new tables that might not exist

```sql
-- ✅ SAFE: Won't error if table already exists
CREATE TABLE IF NOT EXISTS bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ...
);

-- ✅ SAFE: Won't error if index already exists
CREATE INDEX IF NOT EXISTS idx_bookings_client_id ON bookings(client_id);
```

**What happens:**
- If table exists → Does nothing (safe)
- If table doesn't exist → Creates it

---

### Pattern 2: **ALTER TABLE ADD COLUMN IF NOT EXISTS** (Safe for New Columns)

**Use when:** Adding columns to existing tables

```sql
-- ✅ SAFE: Add column only if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'users' AND column_name = 'avatar_url'
    ) THEN
        ALTER TABLE users ADD COLUMN avatar_url TEXT;
    END IF;
END $$;
```

**Or simpler approach:**
```sql
-- Check if column exists, then add
ALTER TABLE users 
  ADD COLUMN IF NOT EXISTS avatar_url TEXT,
  ADD COLUMN IF NOT EXISTS bio TEXT;
```

**Note:** PostgreSQL doesn't have native `ADD COLUMN IF NOT EXISTS`, so use the DO block above.

---

### Pattern 3: **DROP IF EXISTS** (Safe for Cleanup)

**Use when:** Removing tables/columns/indexes

```sql
-- ✅ SAFE: Won't error if doesn't exist
DROP TABLE IF EXISTS old_table CASCADE;
DROP INDEX IF EXISTS old_index;
DROP POLICY IF EXISTS "policy_name" ON table_name;
```

---

### Pattern 4: **Modify Existing Columns** (Requires Care)

**Use when:** Changing column types or constraints

```sql
-- ⚠️ CAREFUL: Changing column type
-- Step 1: Add new column
ALTER TABLE users ADD COLUMN email_new TEXT;

-- Step 2: Migrate data
UPDATE users SET email_new = email;

-- Step 3: Drop old column
ALTER TABLE users DROP COLUMN email;

-- Step 4: Rename new column
ALTER TABLE users RENAME COLUMN email_new TO email;
```

---

## 📋 Migration Scenarios

### Scenario 1: Adding New Table (Safest)

**Migration:** `002_add_bookings.sql`

```sql
-- ✅ SAFE: Uses IF NOT EXISTS
CREATE TABLE IF NOT EXISTS bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id UUID NOT NULL REFERENCES users(id),
  lawyer_id UUID NOT NULL REFERENCES users(id),
  scheduled_at TIMESTAMP WITH TIME ZONE NOT NULL,
  status TEXT DEFAULT 'PENDING',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Safe to run multiple times
CREATE INDEX IF NOT EXISTS idx_bookings_client_id ON bookings(client_id);
```

**Result:**
- ✅ Safe to run even if table exists
- ✅ Won't duplicate data
- ✅ Won't break existing data

---

### Scenario 2: Adding Column to Existing Table

**Migration:** `003_add_avatar_to_users.sql`

```sql
-- ✅ SAFE: Check before adding
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'users' AND column_name = 'avatar_url'
    ) THEN
        ALTER TABLE users ADD COLUMN avatar_url TEXT;
    END IF;
END $$;

-- Or add with default value for existing rows
ALTER TABLE users 
  ADD COLUMN IF NOT EXISTS avatar_url TEXT DEFAULT NULL;
```

**Result:**
- ✅ Existing rows get `NULL` for new column
- ✅ New rows can set avatar_url
- ✅ No data loss

---

### Scenario 3: Modifying Existing Column

**Migration:** `004_make_consultation_fee_optional.sql`

```sql
-- ⚠️ CAREFUL: Changing NOT NULL constraint
-- Step 1: Make column nullable
ALTER TABLE lawyer_profiles 
  ALTER COLUMN consultation_fee DROP NOT NULL;

-- Step 2: Set default for existing NULL values (if needed)
UPDATE lawyer_profiles 
SET consultation_fee = 0 
WHERE consultation_fee IS NULL;
```

**Result:**
- ✅ Existing data preserved
- ✅ New rows can have NULL fee
- ✅ No data loss

---

### Scenario 4: Adding Foreign Key to Existing Table

**Migration:** `005_add_booking_foreign_keys.sql`

```sql
-- ✅ SAFE: Check if constraint exists
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'fk_bookings_client'
    ) THEN
        ALTER TABLE bookings
          ADD CONSTRAINT fk_bookings_client
          FOREIGN KEY (client_id) REFERENCES users(id);
    END IF;
END $$;
```

---

## 🔄 Re-Running Migrations Safely

### Your Current Schema Uses Safe Patterns:

Looking at `001_initial_schema.sql`:

```sql
-- ✅ SAFE: Uses IF NOT EXISTS
CREATE TABLE IF NOT EXISTS users (...);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- ✅ SAFE: Uses DROP IF EXISTS before creating
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at ...;

-- ✅ SAFE: Uses DROP IF EXISTS for policies
DROP POLICY IF EXISTS "Users can view own profile" ON users;
CREATE POLICY "Users can view own profile" ...;
```

**This means:** You can re-run `001_initial_schema.sql` safely! ✅

---

## 🎯 Best Practices for Future Migrations

### 1. **Always Use IF NOT EXISTS for New Tables**

```sql
-- ✅ GOOD
CREATE TABLE IF NOT EXISTS new_table (...);

-- ❌ BAD (will error if table exists)
CREATE TABLE new_table (...);
```

### 2. **Check Before Adding Columns**

```sql
-- ✅ GOOD
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'users' AND column_name = 'new_column'
    ) THEN
        ALTER TABLE users ADD COLUMN new_column TEXT;
    END IF;
END $$;
```

### 3. **Use DROP IF EXISTS for Cleanup**

```sql
-- ✅ GOOD
DROP POLICY IF EXISTS "old_policy" ON table_name;
CREATE POLICY "new_policy" ON table_name ...;
```

### 4. **Test Migrations First**

```sql
-- Test in development Supabase project first
-- Then run in production
```

### 5. **Backup Before Major Changes**

- Export data from Supabase Dashboard
- Or use Supabase backup feature

---

## 📊 Migration Execution Flow

### When You Run a Migration:

```
Migration File (002_add_bookings.sql)
    ↓
Copy SQL
    ↓
Paste in Supabase SQL Editor
    ↓
Click "Run"
    ↓
Supabase Checks:
    ├─ Table exists? → Skip (IF NOT EXISTS)
    ├─ Column exists? → Skip (IF NOT EXISTS check)
    ├─ Index exists? → Skip (IF NOT EXISTS)
    └─ New items? → Create them
    ↓
Migration Complete ✅
```

---

## 🔍 Checking What Exists

### Before Running Migration, Check:

```sql
-- Check if table exists
SELECT EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_name = 'bookings'
);

-- Check if column exists
SELECT EXISTS (
    SELECT FROM information_schema.columns 
    WHERE table_name = 'users' AND column_name = 'avatar_url'
);

-- Check if index exists
SELECT EXISTS (
    SELECT FROM pg_indexes 
    WHERE tablename = 'bookings' AND indexname = 'idx_bookings_client_id'
);
```

---

## ✅ Safe Migration Template

Use this template for all new migrations:

```sql
-- Migration: XXX_feature_name
-- Date: YYYY-MM-DD
-- Description: What this migration does
-- Safe to re-run: YES/NO

-- Enable extension if needed
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create new table (safe)
CREATE TABLE IF NOT EXISTS new_table (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ...
);

-- Add indexes (safe)
CREATE INDEX IF NOT EXISTS idx_name ON new_table(column_name);

-- Add columns to existing table (safe)
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'users' AND column_name = 'new_column'
    ) THEN
        ALTER TABLE users ADD COLUMN new_column TEXT;
    END IF;
END $$;

-- Add triggers (safe)
DROP TRIGGER IF EXISTS trigger_name ON table_name;
CREATE TRIGGER trigger_name ...;

-- Add RLS policies (safe)
ALTER TABLE new_table ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "policy_name" ON new_table;
CREATE POLICY "policy_name" ON new_table ...;
```

---

## 🚨 What to Avoid

### ❌ Don't Do This:

```sql
-- ❌ BAD: Will error if table exists
CREATE TABLE bookings (...);

-- ❌ BAD: Will error if column exists
ALTER TABLE users ADD COLUMN avatar_url TEXT;

-- ❌ BAD: Will delete data if table exists
DROP TABLE bookings;
```

### ✅ Do This Instead:

```sql
-- ✅ GOOD: Safe to re-run
CREATE TABLE IF NOT EXISTS bookings (...);

-- ✅ GOOD: Check before adding
DO $$ BEGIN ... END $$;

-- ✅ GOOD: Safe deletion
DROP TABLE IF EXISTS old_table;
```

---

## 🎯 Summary

### Your Current Setup:
- ✅ `001_initial_schema.sql` uses safe patterns (IF NOT EXISTS)
- ✅ Can be re-run safely
- ✅ Won't break existing data

### For Future Migrations:
1. ✅ **Always use IF NOT EXISTS** for new tables/indexes
2. ✅ **Check before adding columns** to existing tables
3. ✅ **Use DROP IF EXISTS** before recreating triggers/policies
4. ✅ **Test in development first**
5. ✅ **Backup before major changes**

### Result:
- ✅ **Existing tables**: Safe, won't be affected
- ✅ **Existing data**: Preserved
- ✅ **New features**: Added safely
- ✅ **Re-running migrations**: Safe (won't duplicate)

---

## 💡 Quick Answer

**Q: What happens to existing tables when I run migrations?**

**A:** 
- ✅ **New tables**: Created safely (IF NOT EXISTS)
- ✅ **Existing tables**: Not affected (unless you modify them)
- ✅ **Existing data**: Preserved
- ✅ **New columns**: Added safely (with checks)
- ✅ **Re-running**: Safe (won't duplicate)

**Your migrations are designed to be safe!** Just follow the patterns in `SAFE_MIGRATIONS.md` and you'll be fine! 🚀
