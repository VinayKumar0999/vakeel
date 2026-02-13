# 🧪 Testing Registration - Step by Step Guide

## ✅ Pre-Testing Checklist

Before testing, make sure:

- [ ] **Dependencies installed**: `npm install` completed
- [ ] **Supabase account created**: You have project URL
- [ ] **Database schema run**: SQL schema executed in Supabase
- [ ] **Storage bucket created**: `lawyer-documents` bucket exists
- [ ] **API keys added**: `.env.local` has all 3 Supabase variables
- [ ] **Dev server running**: `npm run dev` is running

---

## 🚀 Step 1: Start Dev Server

```bash
cd C:\Users\vinay\Documents\WORK\vakeel
npm run dev
```

You should see:
```
✓ Ready in X seconds
○ Local: http://localhost:3000
```

---

## 🧪 Step 2: Test Client Registration

### 2.1 Navigate to Signup Page
1. Open browser: http://localhost:3000/signup
2. You should see two cards: "I'm a Client" and "I'm a Lawyer"

### 2.2 Click "Sign Up as Client"
1. Click the **"Sign Up as Client"** button
2. Should redirect to: http://localhost:3000/signup/client

### 2.3 Fill Client Registration Form
Fill in:
- **Full Name**: `Test Client`
- **Email**: `testclient@example.com`
- **Phone**: `9876543210`
- **Password**: `testpass123` (min 8 chars)
- **Confirm Password**: `testpass123`
- ✅ Check "I agree to terms"

### 2.4 Submit Form
1. Click **"Create Account"**
2. Should see success toast: "Account created successfully!"
3. Should redirect to `/dashboard`

### 2.5 Verify in Supabase
1. Go to Supabase Dashboard
2. **Table Editor** → `users` table
3. You should see new row with:
   - `full_name`: "Test Client"
   - `email`: "testclient@example.com"
   - `role`: "CLIENT"
   - `verification_status`: null

---

## 🧪 Step 3: Test Lawyer Registration

### 3.1 Navigate to Lawyer Signup
1. Go to: http://localhost:3000/signup/lawyer
2. Should see 5-step wizard

### 3.2 Step 1: Basic Information
Fill in:
- **Full Name**: `Dr. Test Lawyer`
- **Email**: `testlawyer@example.com`
- **Phone**: `9876543211`
- **Password**: `testpass123`
- **Confirm Password**: `testpass123`

Click **"Next"**

### 3.3 Step 2: Professional Details
Fill in:
- **Bar Council Number**: `BCN123456`
- **Bar Council State**: Select any state (e.g., "Maharashtra")
- **Practice Areas**: Select at least one (e.g., "Criminal Law", "Family Law")
- **Years of Experience**: Select (e.g., "5-10")
- **Education**: `LLB from Test University`
- **Languages**: Select at least one (e.g., "English", "Hindi")

Click **"Next"**

### 3.4 Step 3: Documents
Upload files:
- **Bar Certificate**: Upload any PDF or image file
- **ID Proof**: Upload any PDF or image file
- **Profile Photo**: Optional - upload image

Click **"Next"**

### 3.5 Step 4: Profile Setup
Fill in:
- **Bio**: Write at least 50 characters:
  ```
  Experienced lawyer with 10 years of practice in criminal and family law. 
  Specialized in bail matters and property disputes.
  ```
- **Consultation Fee**: `1500`
- **Specializations**: Add at least one (e.g., "Bail matters")
- **Office Address**: `123 Test Street, Test Area`
- **City**: `Mumbai`
- **State**: `Maharashtra`
- **Pincode**: `400001`

Click **"Next"**

### 3.6 Step 5: Review & Submit
1. Review all information
2. Click **"Submit Registration"**
3. Should see: "Registration successful! Your account is pending verification."
4. Should redirect to `/lawyer/verification-pending`

### 3.7 Verify in Supabase

**Check Users Table:**
1. Supabase Dashboard → **Table Editor** → `users`
2. Find row with email `testlawyer@example.com`
3. Verify:
   - `role`: "LAWYER"
   - `verification_status`: "PENDING"

**Check Lawyer Profiles Table:**
1. **Table Editor** → `lawyer_profiles`
2. Find row with matching `user_id`
3. Verify all fields are populated:
   - `bar_council_number`: "BCN123456"
   - `practice_areas`: ["Criminal Law", "Family Law"]
   - `consultation_fee`: 1500
   - etc.

**Check Storage:**
1. **Storage** → `lawyer-documents` bucket
2. Should see folders:
   - `bar-certificates/` (with uploaded file)
   - `id-proofs/` (with uploaded file)
   - `profile-photos/` (if uploaded)

---

## 🐛 Troubleshooting

### Error: "Missing Supabase environment variables"
**Solution:**
1. Check `.env.local` exists
2. Verify all 3 variables are set:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
3. **Restart dev server** after adding variables

### Error: "Failed to upload file"
**Solution:**
1. Check `lawyer-documents` bucket exists in Supabase
2. Verify bucket is **public**
3. Check file size < 5MB
4. Check browser console for detailed error

### Error: "relation does not exist"
**Solution:**
1. Go to Supabase SQL Editor
2. Run `supabase/schema.sql` again
3. Check for any SQL errors

### Error: "Email already registered"
**Solution:**
- This is correct behavior
- Use a different email for testing
- Or delete the test user from Supabase dashboard

### Registration succeeds but no data in Supabase
**Solution:**
1. Check browser console (F12) for errors
2. Check terminal/console where `npm run dev` is running
3. Verify API keys are correct
4. Check Supabase project is active (not paused)

### Files uploaded but URLs are wrong
**Solution:**
1. Check storage bucket is **public**
2. Verify file paths in `lawyer_profiles` table
3. URLs should start with: `https://aauhslzeeibhnykiqzja.supabase.co/storage/v1/object/public/...`

---

## 🔍 Debug Checklist

### Check Browser Console (F12)
- Look for any red errors
- Check Network tab → API calls → `/api/auth/register`
- Verify request/response

### Check Terminal/Console
- Look for server errors
- Check for Supabase connection errors
- Verify environment variables loaded

### Check Supabase Dashboard
- **Table Editor**: Verify data appears
- **Storage**: Verify files uploaded
- **Logs**: Check for any errors (Project Settings → Logs)

---

## ✅ Success Indicators

### Client Registration Success:
- ✅ Success toast appears
- ✅ Redirects to dashboard
- ✅ User appears in `users` table
- ✅ No errors in console

### Lawyer Registration Success:
- ✅ Success toast appears
- ✅ Redirects to verification-pending page
- ✅ User appears in `users` table with `verification_status: PENDING`
- ✅ Lawyer profile appears in `lawyer_profiles` table
- ✅ Files appear in `lawyer-documents` storage bucket
- ✅ No errors in console

---

## 📝 Test Data Examples

### Test Client:
```
Full Name: Test Client
Email: testclient@example.com
Phone: 9876543210
Password: testpass123
```

### Test Lawyer:
```
Full Name: Dr. Test Lawyer
Email: testlawyer@example.com
Phone: 9876543211
Password: testpass123
Bar Council: BCN123456
State: Maharashtra
Practice Areas: Criminal Law, Family Law
Experience: 5-10 years
Education: LLB from Test University
Languages: English, Hindi
Bio: Experienced lawyer with 10 years of practice...
Fee: 1500
Specializations: Bail matters
Address: 123 Test Street, Mumbai, Maharashtra, 400001
```

---

## 🎯 Quick Test Commands

### Test API Directly (Optional):
```bash
# Test client registration
curl -X POST http://localhost:3000/api/auth/register \
  -F "role=CLIENT" \
  -F "fullName=Test Client" \
  -F "email=test@example.com" \
  -F "phone=9876543210" \
  -F "password=testpass123"
```

---

## 📊 Expected Results

### After Client Registration:
- **Database**: 1 row in `users` table
- **Response**: `{ data: { user: {...}, token: "...", message: "Account created successfully!" } }`

### After Lawyer Registration:
- **Database**: 
  - 1 row in `users` table (role: LAWYER, verification_status: PENDING)
  - 1 row in `lawyer_profiles` table
- **Storage**: 2-3 files in `lawyer-documents` bucket
- **Response**: `{ data: { user: {...}, lawyerProfile: {...}, token: "...", message: "Registration successful..." } }`

---

**Ready to test!** Follow the steps above and let me know if you encounter any issues! 🚀
