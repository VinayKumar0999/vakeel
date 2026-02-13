# Feature Flags

## Admin approval flow (hidden by default)

- **Flag:** `NEXT_PUBLIC_ENABLE_ADMIN_APPROVALS`
- **Default:** not set / false → **auto-approve all users**, admin UI hidden
- **When `true`:** admin approval required for lawyers, `/admin/approvals` visible to admins

### Current behavior (flag off)

- All new **lawyers** are created with `verification_status = 'APPROVED'`.
- Lawyer signup redirects to **Dashboard** (`/dashboard/lawyer`).
- Login for lawyers goes to **Dashboard**.
- **Admin** users: Dashboard link goes to `/dashboard/client` (no admin link).
- Visiting `/admin/*` redirects to `/dashboard/client`.

### To enable admin approval later

1. In `.env.local` add:
   ```env
   NEXT_PUBLIC_ENABLE_ADMIN_APPROVALS=true
   ```
2. In `lib/db-helpers.ts`, in `createUser`, set lawyers to `'PENDING'` again:
   ```ts
   const verificationStatus = role === 'LAWYER' ? 'PENDING' : null;
   ```
3. Restart the dev server.
4. Admin users will see Dashboard → `/admin/approvals`, and can approve/reject lawyers.

### Reverting to auto-approve

- Remove `NEXT_PUBLIC_ENABLE_ADMIN_APPROVALS` or set it to `false`.
- In `lib/db-helpers.ts`, set lawyers to `'APPROVED'`:
  ```ts
  const verificationStatus = role === 'LAWYER' ? 'APPROVED' : null;
  ```
