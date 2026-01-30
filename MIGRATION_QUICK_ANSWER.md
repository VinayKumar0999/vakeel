# Quick Answer: What Happens to Existing Tables?

## 🎯 Your Question
> "When I run migrations, how do existing tables behave? We might run migrations on existing tables also, right?"

## ✅ Short Answer

**Yes, you can run migrations on existing tables safely!** Your current schema uses safe patterns that won't break existing data.

---

## 🔍 What Happens When You Run a Migration?

### Scenario 1: Adding NEW Table (e.g., `bookings`)

**Migration runs:**
```sql
CREATE TABLE IF NOT EXISTS bookings (...);
```

**Result:**
- ✅ `bookings` table created (if doesn't exist)
- ✅ `users` table → **UNCHANGED** (no effect)
- ✅ `lawyer_profiles` table → **UNCHANGED** (no effect)
- ✅ All existing data → **PRESERVED**

---

### Scenario 2: Adding Column to EXISTING Table

**Migration runs:**
```sql
-- Add avatar_url to users table
ALTER TABLE users ADD COLUMN avatar_url TEXT;
```

**Result:**
- ✅ New column `avatar_url` added to `users`
- ✅ Existing rows → Get `NULL` for `avatar_url` (no data loss)
- ✅ Existing columns → **UNCHANGED**
- ✅ All existing data → **PRESERVED**

---

### Scenario 3: Re-Running Initial Schema

**You run `001_initial_schema.sql` again:**

**Result:**
- ✅ `CREATE TABLE IF NOT EXISTS users` → **SKIPS** (table exists)
- ✅ `CREATE TABLE IF NOT EXISTS lawyer_profiles` → **SKIPS** (table exists)
- ✅ Existing data → **PRESERVED**
- ✅ Only missing items get created

---

## 🛡️ Why It's Safe

Your `001_initial_schema.sql` uses these safe patterns:

```sql
-- ✅ Safe: Won't create duplicate table
CREATE TABLE IF NOT EXISTS users (...);

-- ✅ Safe: Won't create duplicate index
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- ✅ Safe: Drops old trigger before creating new one
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at ...;

-- ✅ Safe: Drops old policy before creating new one
DROP POLICY IF EXISTS "Users can view own profile" ON users;
CREATE POLICY "Users can view own profile" ...;
```

---

## 📊 Migration Execution Flow

```
You run migration SQL in Supabase
    ↓
PostgreSQL checks each statement:
    ├─ CREATE TABLE IF NOT EXISTS?
    │   ├─ Table exists? → SKIP ✅
    │   └─ Table missing? → CREATE ✅
    │
    ├─ ALTER TABLE ADD COLUMN?
    │   ├─ Column exists? → ERROR (need check first)
    │   └─ Column missing? → ADD ✅
    │
    └─ DROP IF EXISTS?
        ├─ Exists? → DROP ✅
        └─ Missing? → SKIP ✅
    ↓
Migration Complete
    ↓
Existing tables: UNCHANGED ✅
Existing data: PRESERVED ✅
New features: ADDED ✅
```

---

## ✅ Safe Migration Checklist

When creating new migrations:

- [ ] Use `CREATE TABLE IF NOT EXISTS` for new tables
- [ ] Use `CREATE INDEX IF NOT EXISTS` for new indexes
- [ ] Use `DROP IF EXISTS` before recreating triggers/policies
- [ ] Check before adding columns to existing tables
- [ ] Test in development first
- [ ] Backup before major changes

---

## 🚨 What to Avoid

### ❌ Don't Do This:
```sql
-- ❌ Will error if table exists
CREATE TABLE bookings (...);

-- ❌ Will error if column exists
ALTER TABLE users ADD COLUMN avatar_url TEXT;
```

### ✅ Do This Instead:
```sql
-- ✅ Safe to re-run
CREATE TABLE IF NOT EXISTS bookings (...);

-- ✅ Check first, then add
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

---

## 💡 Real Example

**You have:**
- `users` table with 100 records
- `lawyer_profiles` table with 50 records

**You run migration to add `bookings` table:**

**Before:**
- `users`: 100 records ✅
- `lawyer_profiles`: 50 records ✅
- `bookings`: Doesn't exist

**After:**
- `users`: 100 records ✅ (unchanged)
- `lawyer_profiles`: 50 records ✅ (unchanged)
- `bookings`: 0 records ✅ (new table created)

**Result:** Existing tables and data are completely safe! 🎉

---

## 🎯 Summary

| Question | Answer |
|----------|--------|
| Can I run migrations on existing tables? | ✅ Yes, safely |
| Will existing data be lost? | ❌ No, preserved |
| Will existing tables be modified? | ⚠️ Only if you explicitly modify them |
| Can I re-run migrations? | ✅ Yes, if using safe patterns |
| Is your current schema safe? | ✅ Yes, uses IF NOT EXISTS |

---

## 📚 Next Steps

1. ✅ Your current schema is safe to re-run
2. ✅ Use the patterns in `SAFE_MIGRATIONS.md` for future migrations
3. ✅ Test migrations in development first
4. ✅ Always backup before major changes

**You're all set!** Your migrations are designed to be safe. 🚀
