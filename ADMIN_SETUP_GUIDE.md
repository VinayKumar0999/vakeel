# Admin Approval System - Setup Guide

## 🎯 Overview

A comprehensive admin approval system with support for:
- **SUPER_ADMIN**: Can approve everything, manage admins
- **ADMIN**: Can approve lawyers and agencies
- **AGENCY_ADMIN**: Can approve lawyers in their agency only
- **Agencies**: Future support for legal agencies/firms

## 📋 Setup Steps

### 1. Run Database Migration

Run the migration file in Supabase SQL Editor:

```bash
supabase/migrations/005_admin_agencies_system.sql
```

Or copy-paste the SQL from the file into Supabase Dashboard → SQL Editor → Run.

**What it does:**
- Adds `SUPER_ADMIN` and `AGENCY_ADMIN` roles
- Creates `agencies` table
- Adds approval tracking fields (`approved_by`, `approval_notes`, `approved_at`)
- Adds `agency_id` to lawyer_profiles

### 2. Create Your First Admin User

**Option A: Via Supabase Dashboard**
1. Go to Supabase Dashboard → Table Editor → `users`
2. Find your user (or create one)
3. Update:
   - `role`: `ADMIN` or `SUPER_ADMIN`
   - `verification_status`: `APPROVED`

**Option B: Via SQL**
```sql
-- Update existing user to ADMIN
UPDATE users 
SET role = 'ADMIN', verification_status = 'APPROVED'
WHERE email = 'your-email@example.com';

-- Or create new admin user
INSERT INTO users (full_name, email, phone, password_hash, role, verification_status)
VALUES (
  'Admin User',
  'admin@vakeel.com',
  '9999999999',
  '$2a$10$...', -- Use bcrypt hash of password
  'ADMIN',
  'APPROVED'
);
```

### 3. Test the System

1. **Login as Admin**
   - Go to `/login`
   - Login with admin credentials
   - Should redirect to `/admin/approvals` (or create admin dashboard)

2. **View Pending Approvals**
   - Go to `/admin/approvals`
   - See list of pending lawyers
   - Click "Approve" or "Reject"

3. **Test Lawyer Approval**
   - Sign up as a lawyer (or use existing pending lawyer)
   - Login as admin
   - Go to `/admin/approvals`
   - Approve/reject the lawyer

## 🔐 Role Permissions

| Feature | SUPER_ADMIN | ADMIN | AGENCY_ADMIN |
|---------|-------------|-------|--------------|
| Approve Individual Lawyer | ✅ | ✅ | ✅ (own agency) |
| Approve Agency | ✅ | ✅ | ❌ |
| Reject Lawyer | ✅ | ✅ | ✅ (own agency) |
| Reject Agency | ✅ | ✅ | ❌ |
| Create Admin Users | ✅ | ❌ | ❌ |
| View All Lawyers | ✅ | ✅ | ❌ (own agency) |
| View All Agencies | ✅ | ✅ | ❌ |

## 📁 Files Created

### Database
- `supabase/migrations/005_admin_agencies_system.sql` - Database schema

### Backend Helpers
- `lib/admin-helpers.ts` - Admin helper functions

### API Routes
- `app/api/admin/pending-lawyers/route.ts` - Get pending lawyers
- `app/api/admin/pending-agencies/route.ts` - Get pending agencies
- `app/api/admin/approve-lawyer/route.ts` - Approve/reject lawyer
- `app/api/admin/approve-agency/route.ts` - Approve/reject agency

### Frontend Pages
- `app/admin/approvals/page.tsx` - Main approval page

### Documentation
- `ADMIN_APPROVAL_SYSTEM.md` - Architecture documentation
- `ADMIN_SETUP_GUIDE.md` - This file

## 🚀 Next Steps (Future)

1. **Agency Signup Flow**
   - Create `/signup/agency` page
   - Agency admin registration
   - Agency profile setup

2. **Agency Admin Dashboard**
   - `/agency/dashboard` - Agency admin view
   - Manage agency lawyers
   - Agency settings

3. **Admin Dashboard**
   - `/admin/dashboard` - Overview stats
   - User management
   - System settings

4. **Email Notifications**
   - Send email when lawyer is approved/rejected
   - Notify agency admin when lawyer joins

5. **Audit Log**
   - Track all approval actions
   - Who approved what and when

## 🐛 Troubleshooting

### "Access denied" error
- Check user role is `ADMIN`, `SUPER_ADMIN`, or `AGENCY_ADMIN`
- Verify `verification_status` is `APPROVED` for admin user

### No pending lawyers showing
- Check if lawyers have `verification_status = 'PENDING'`
- Verify lawyer_profiles exist for lawyers
- Check browser console for API errors

### Can't approve lawyer
- Verify admin has correct role
- Check `canApproveLawyer()` function logic
- Agency admins can only approve lawyers in their agency

## 📞 Support

See `ADMIN_APPROVAL_SYSTEM.md` for detailed architecture and flow.
