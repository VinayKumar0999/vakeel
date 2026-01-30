# Redirects After Signup

## 📍 Current Redirect Flow

### ✅ Client Signup
- **After successful registration** → `/dashboard/client`
- **Page**: `app/dashboard/client/page.tsx`
- **Shows**: Client dashboard with consultations, documents, etc.

### ✅ Lawyer Signup
- **After successful registration** → `/lawyer/verification-pending`
- **Page**: `app/lawyer/verification-pending/page.tsx`
- **Shows**: Verification pending message with next steps

---

## 🔄 Redirect Logic

### Client Registration Flow:
```
Signup Form → API Call → Success → Redirect to /dashboard/client
```

### Lawyer Registration Flow:
```
5-Step Form → API Call → Success → Redirect to /lawyer/verification-pending
```

---

## 🎯 What Users See

### After Client Signup:
- ✅ Success toast: "Account created successfully! Welcome to Vakeel Kutami!"
- ✅ Redirected to: `/dashboard/client`
- ✅ Client dashboard with:
  - Overview tab
  - Consultations
  - Documents
  - Payments
  - Messages
  - Settings

### After Lawyer Signup:
- ✅ Success toast: "Registration successful! Your account is pending verification."
- ✅ Redirected to: `/lawyer/verification-pending`
- ✅ Verification pending page with:
  - Email verification instructions
  - Document review timeline
  - Next steps information
  - Links to login/home

---

## 🔧 Future Enhancements

### After Lawyer Verification:
Once a lawyer is approved (verification_status = "APPROVED"), they should be redirected to:
- `/dashboard/lawyer` - Lawyer dashboard

### Role-Based Redirects:
You might want to add a main `/dashboard` route that:
1. Checks user role
2. Redirects accordingly:
   - `CLIENT` → `/dashboard/client`
   - `LAWYER` → `/dashboard/lawyer`
   - `ADMIN` → `/admin`

---

## 📝 Summary

| User Type | Redirect After Signup | Page Location |
|-----------|----------------------|---------------|
| **Client** | `/dashboard/client` | `app/dashboard/client/page.tsx` |
| **Lawyer** | `/lawyer/verification-pending` | `app/lawyer/verification-pending/page.tsx` |

Both redirects are now properly configured! ✅
