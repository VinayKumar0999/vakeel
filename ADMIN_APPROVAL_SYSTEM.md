# Admin Approval System Architecture

## 🎯 Role Hierarchy

```
SUPER_ADMIN (Top Level)
    ↓
    ├─ Can approve/reject everything
    ├─ Can create/manage ADMIN users
    ├─ Can approve/reject agencies
    └─ Can approve/reject individual lawyers
    
ADMIN (Platform Admin)
    ↓
    ├─ Can approve/reject individual lawyers
    ├─ Can approve/reject agencies
    └─ Cannot manage SUPER_ADMIN users
    
AGENCY_ADMIN (Agency Manager)
    ↓
    ├─ Can approve/reject lawyers in their agency only
    ├─ Can view/manage their agency lawyers
    └─ Cannot approve agencies or other agency lawyers
    
LAWYER (Individual Lawyer)
    ↓
    └─ Needs approval from ADMIN or AGENCY_ADMIN
    
CLIENT (Regular User)
    ↓
    └─ No approval needed
```

## 📊 Database Schema

### Users Table (Updated)
- `role`: Now supports `SUPER_ADMIN`, `ADMIN`, `AGENCY_ADMIN`, `LAWYER`, `CLIENT`
- `approved_by`: UUID of admin who approved
- `approval_notes`: Reason/notes for approval/rejection
- `approved_at`: Timestamp of approval

### Agencies Table (New)
- `name`, `description`, `email`, `phone`
- `address`, `city`, `state`, `pincode`
- `agency_admin_id`: User who manages this agency
- `verification_status`: PENDING/APPROVED/REJECTED
- `approved_by`, `approval_notes`, `approved_at`

### Lawyer Profiles (Updated)
- `agency_id`: Optional - lawyer belongs to an agency

## 🔐 Approval Flow

### Individual Lawyer Approval
1. Lawyer signs up → `verification_status = PENDING`
2. **ADMIN** or **SUPER_ADMIN** reviews:
   - Bar Certificate
   - ID Proof
   - Profile details
3. Admin approves/rejects → Updates `verification_status`, `approved_by`, `approval_notes`

### Agency Lawyer Approval
1. Lawyer signs up → Selects agency → `agency_id` set
2. **AGENCY_ADMIN** reviews and approves lawyers in their agency
3. OR **ADMIN/SUPER_ADMIN** can approve any lawyer

### Agency Approval
1. Agency signs up → `verification_status = PENDING`
2. **ADMIN** or **SUPER_ADMIN** reviews agency details
3. Admin approves agency → Agency can now have lawyers

## 🎨 Admin Pages Structure

```
/admin
  ├─ /dashboard              # Admin dashboard overview
  ├─ /approvals              # Main approvals page
  │   ├─ /lawyers           # Pending lawyer approvals
  │   └─ /agencies          # Pending agency approvals
  ├─ /lawyers                # All lawyers (approved + pending)
  │   └─ /[id]              # Lawyer detail & approve/reject
  ├─ /agencies               # All agencies
  │   └─ /[id]              # Agency detail & approve/reject
  └─ /users                  # User management
```

## 🔑 Permission Matrix

| Action | SUPER_ADMIN | ADMIN | AGENCY_ADMIN |
|--------|-------------|-------|--------------|
| Approve Individual Lawyer | ✅ | ✅ | ✅ (own agency only) |
| Approve Agency | ✅ | ✅ | ❌ |
| Reject Lawyer | ✅ | ✅ | ✅ (own agency only) |
| Reject Agency | ✅ | ✅ | ❌ |
| Create Admin | ✅ | ❌ | ❌ |
| View All Lawyers | ✅ | ✅ | ❌ (own agency) |
| View All Agencies | ✅ | ✅ | ❌ |

## 📝 Implementation Steps

1. ✅ Database migration (005_admin_agencies_system.sql)
2. ✅ Admin approval page (`/admin/approvals`)
3. ✅ API routes for approvals (`/api/admin/approve-lawyer`, etc.)
4. ✅ Helper functions (`lib/admin-helpers.ts`)
5. ⏳ Agency signup flow
6. ⏳ Agency admin dashboard

## 🚀 Next Steps

1. Run migration: `005_admin_agencies_system.sql`
2. Create admin user manually in Supabase (set role = 'ADMIN' or 'SUPER_ADMIN')
3. Test approval flow
