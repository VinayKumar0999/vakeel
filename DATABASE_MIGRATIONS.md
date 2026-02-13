# Database Migrations & Schema Evolution Guide

## 🎯 How to Add New Features (Database Changes)

When you add new features, you'll need to update your database schema. Here's how to do it safely:

---

## 📋 Migration Strategy

### Option 1: Direct SQL Updates (Simple - Good for Small Projects)

**When to use:** Small changes, MVP, early development

**How it works:**
1. Write SQL to add new tables/columns
2. Run in Supabase SQL Editor
3. Update your code to use new schema

**Example:**
```sql
-- Add new table for bookings
CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id UUID REFERENCES users(id),
  lawyer_id UUID REFERENCES users(id),
  scheduled_at TIMESTAMP WITH TIME ZONE,
  status TEXT DEFAULT 'PENDING',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add new column to existing table
ALTER TABLE users ADD COLUMN avatar_url TEXT;
```

---

### Option 2: Migration Files (Recommended - Production Ready)

**When to use:** Production apps, team projects, version control

**How it works:**
1. Create migration files (numbered sequentially)
2. Store in `supabase/migrations/` folder
3. Run migrations in order
4. Track which migrations have been run

**Structure:**
```
supabase/
  migrations/
    001_initial_schema.sql
    002_add_bookings_table.sql
    003_add_avatar_to_users.sql
    004_add_reviews_table.sql
```

---

## 🚀 Step-by-Step: Adding a New Feature

### Example: Adding a "Bookings" Feature

### Step 1: Create Migration File

Create `supabase/migrations/002_add_bookings.sql`:

```sql
-- Migration: Add bookings table
-- Date: 2024-01-27
-- Description: Add booking system for consultations

-- Create bookings table
CREATE TABLE bookings (
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

-- Create indexes
CREATE INDEX idx_bookings_client_id ON bookings(client_id);
CREATE INDEX idx_bookings_lawyer_id ON bookings(lawyer_id);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_bookings_scheduled_at ON bookings(scheduled_at);

-- Add trigger for updated_at
CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON bookings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Add RLS policies
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Clients can view own bookings" ON bookings
    FOR SELECT USING (client_id::text = auth.uid()::text);

CREATE POLICY "Lawyers can view own bookings" ON bookings
    FOR SELECT USING (lawyer_id::text = auth.uid()::text);
```

### Step 2: Run Migration in Supabase

1. Go to Supabase Dashboard → SQL Editor
2. Copy migration SQL
3. Paste and Run
4. Verify table created in Table Editor

### Step 3: Update Your Code

**Update TypeScript types:**
```typescript
// lib/types.ts
export interface Booking {
  id: string;
  client_id: string;
  lawyer_id: string;
  scheduled_at: string;
  duration_minutes: number;
  status: 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';
  consultation_fee: number;
  meeting_link?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}
```

**Add helper functions:**
```typescript
// lib/db-helpers.ts
export async function createBooking(bookingData: CreateBookingData) {
  const { data, error } = await supabase
    .from('bookings')
    .insert(bookingData)
    .select()
    .single();
  
  if (error) throw new Error(error.message);
  return data;
}
```

---

## 📁 Recommended Folder Structure

```
supabase/
  schema.sql              # Initial schema (already created)
  migrations/
    001_initial_schema.sql
    002_add_bookings.sql
    003_add_reviews.sql
    004_add_payments.sql
    005_add_messages.sql
  seeds/                  # Optional: Sample data
    sample_users.sql
```

---

## 🔄 Migration Best Practices

### 1. **Always Backup First**
Before running migrations in production:
```sql
-- Export current data (in Supabase Dashboard)
-- Go to Table Editor → Export data
```

### 2. **Test Migrations Locally First**
- Run migration in development Supabase project
- Test your code changes
- Then run in production

### 3. **Use Transactions**
Wrap migrations in transactions:
```sql
BEGIN;

-- Your migration SQL here
CREATE TABLE new_table (...);

-- If something fails, rollback
COMMIT;
```

### 4. **Version Your Migrations**
Name files with timestamps or numbers:
- `001_initial_schema.sql`
- `002_add_bookings_20240127.sql`
- `003_add_reviews_20240128.sql`

### 5. **Document Changes**
Add comments to migrations:
```sql
-- Migration: Add bookings table
-- Author: Your Name
-- Date: 2024-01-27
-- Related Issue: #123
-- Description: Adds booking system for consultations
```

---

## 🎯 Common Migration Scenarios

### Adding a New Table

```sql
-- Migration: Add reviews table
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id UUID REFERENCES bookings(id),
  client_id UUID REFERENCES users(id),
  lawyer_id UUID REFERENCES users(id),
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Adding Columns to Existing Table

```sql
-- Migration: Add avatar and bio to users
ALTER TABLE users 
  ADD COLUMN avatar_url TEXT,
  ADD COLUMN bio TEXT,
  ADD COLUMN date_of_birth DATE;
```

### Modifying Columns

```sql
-- Migration: Change consultation_fee to allow NULL
ALTER TABLE lawyer_profiles 
  ALTER COLUMN consultation_fee DROP NOT NULL;
```

### Adding Indexes

```sql
-- Migration: Add index for faster searches
CREATE INDEX idx_users_full_name ON users(full_name);
CREATE INDEX idx_bookings_date_range ON bookings(scheduled_at) 
  WHERE scheduled_at > NOW();
```

### Adding Foreign Keys

```sql
-- Migration: Add foreign key constraint
ALTER TABLE bookings
  ADD CONSTRAINT fk_lawyer_profile 
  FOREIGN KEY (lawyer_id) 
  REFERENCES lawyer_profiles(user_id);
```

---

## 🔧 Supabase-Specific Tips

### 1. **Use Supabase Migrations (Advanced)**

For production, Supabase CLI supports migrations:

```bash
# Install Supabase CLI
npm install -g supabase

# Initialize migrations
supabase init

# Create new migration
supabase migration new add_bookings_table

# Apply migrations
supabase db push
```

### 2. **Track Migrations Manually**

Create a `migrations_log` table:

```sql
CREATE TABLE IF NOT EXISTS migrations_log (
  id SERIAL PRIMARY KEY,
  migration_name TEXT UNIQUE NOT NULL,
  applied_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 3. **Use Supabase Dashboard**

- **SQL Editor**: Run migrations directly
- **Table Editor**: Visual schema management
- **Database**: View schema, indexes, relationships

---

## 📊 Example: Adding Multiple Features

### Feature 1: Bookings
```sql
-- supabase/migrations/002_add_bookings.sql
CREATE TABLE bookings (...);
```

### Feature 2: Reviews
```sql
-- supabase/migrations/003_add_reviews.sql
CREATE TABLE reviews (...);
```

### Feature 3: Payments
```sql
-- supabase/migrations/004_add_payments.sql
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id UUID REFERENCES bookings(id),
  amount DECIMAL(10,2),
  status TEXT,
  payment_method TEXT,
  transaction_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Feature 4: Messages
```sql
-- supabase/migrations/005_add_messages.sql
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sender_id UUID REFERENCES users(id),
  receiver_id UUID REFERENCES users(id),
  content TEXT NOT NULL,
  read_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

---

## ✅ Migration Checklist

Before running a migration:

- [ ] Backup current database
- [ ] Test migration in development
- [ ] Write migration SQL
- [ ] Add comments/documentation
- [ ] Test rollback plan (if needed)
- [ ] Update TypeScript types
- [ ] Update helper functions
- [ ] Update API routes
- [ ] Test application
- [ ] Run in production

---

## 🚨 Important Notes

### 1. **Breaking Changes**
If you modify existing columns:
- Check if data needs migration
- May need data transformation
- Test thoroughly

### 2. **Downtime**
- Most migrations run instantly
- Large data migrations might take time
- Plan for maintenance window if needed

### 3. **Rollback Plan**
Keep rollback SQL ready:
```sql
-- Rollback: Remove bookings table
DROP TABLE IF EXISTS bookings CASCADE;
```

### 4. **RLS Policies**
Don't forget to add RLS policies for new tables:
```sql
ALTER TABLE new_table ENABLE ROW LEVEL SECURITY;
CREATE POLICY "..." ON new_table FOR ...;
```

---

## 🎯 Summary

**For Now (MVP/Early Development):**
- ✅ Use SQL Editor directly
- ✅ Create migration files in `supabase/migrations/`
- ✅ Document changes
- ✅ Test before production

**For Later (Production):**
- ✅ Use Supabase CLI migrations
- ✅ Version control migrations
- ✅ Automated testing
- ✅ Staging environment

**Your Current Setup:**
- ✅ Initial schema: `supabase/schema.sql` ✅
- ✅ Ready for new migrations
- ✅ Just create new SQL files and run them!

---

## 📝 Quick Reference

**Add new table:**
```sql
CREATE TABLE table_name (...);
```

**Add column:**
```sql
ALTER TABLE table_name ADD COLUMN column_name TYPE;
```

**Add index:**
```sql
CREATE INDEX idx_name ON table_name(column_name);
```

**Add foreign key:**
```sql
ALTER TABLE table_name 
  ADD CONSTRAINT fk_name 
  FOREIGN KEY (column) REFERENCES other_table(id);
```

**Enable RLS:**
```sql
ALTER TABLE table_name ENABLE ROW LEVEL SECURITY;
CREATE POLICY "policy_name" ON table_name FOR ...;
```

---

**You're all set!** Just create new migration files as you add features! 🚀
