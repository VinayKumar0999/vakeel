# Database Migrations

## 📁 Migration Files

Store all database schema changes here as numbered migration files.

## 📋 Migration Naming Convention

Format: `XXX_description.sql`

Examples:
- `001_initial_schema.sql` - Initial database setup
- `002_add_bookings_table.sql` - Add bookings feature
- `003_add_reviews_table.sql` - Add reviews feature
- `004_add_payments_table.sql` - Add payments feature

## 🚀 How to Add a New Migration

1. **Create new file**: `supabase/migrations/XXX_feature_name.sql`
2. **Write SQL**: Add CREATE TABLE, ALTER TABLE, etc.
3. **Run in Supabase**: Copy SQL → Supabase SQL Editor → Run
4. **Update code**: Update TypeScript types and helper functions
5. **Test**: Verify everything works

## ✅ Migration Checklist

- [ ] Migration file created
- [ ] SQL tested in Supabase SQL Editor
- [ ] Tables/columns created successfully
- [ ] Indexes added (if needed)
- [ ] RLS policies added (if needed)
- [ ] TypeScript types updated
- [ ] Helper functions updated
- [ ] Application tested

## 📝 Example Migration

```sql
-- Migration: 002_add_bookings_table
-- Date: 2024-01-27
-- Description: Add booking system for consultations

CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id UUID NOT NULL REFERENCES users(id),
  lawyer_id UUID NOT NULL REFERENCES users(id),
  scheduled_at TIMESTAMP WITH TIME ZONE NOT NULL,
  status TEXT DEFAULT 'PENDING',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_bookings_client_id ON bookings(client_id);
CREATE INDEX idx_bookings_lawyer_id ON bookings(lawyer_id);

ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
```

---

**Keep migrations organized and documented!** 📚
