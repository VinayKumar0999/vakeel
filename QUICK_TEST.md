# 🧪 Quick Test Guide - Registration

## ✅ Pre-Flight Check

Before testing, verify:

1. **Dependencies installed?**
   ```bash
   npm install
   ```

2. **Database schema run?**
   - Go to Supabase Dashboard → SQL Editor
   - Run `supabase/schema.sql`
   - Should see "Success"

3. **Storage bucket created?**
   - Supabase Dashboard → Storage
   - Bucket name: `lawyer-documents`
   - Make it **public**

4. **Environment variables set?**
   - Check `.env.local` has all 3 Supabase variables ✅

---

## 🚀 Start Testing

### Step 1: Start Dev Server
```bash
npm run dev
```

Wait for: `✓ Ready in X seconds`

### Step 2: Test Client Registration

1. **Open**: http://localhost:3000/signup
2. **Click**: "Sign Up as Client"
3. **Fill form**:
   - Name: `Test Client`
   - Email: `testclient@test.com`
   - Phone: `9876543210`
   - Password: `testpass123`
   - Confirm: `testpass123`
   - ✅ Agree to terms
4. **Click**: "Create Account"

**Expected:**
- ✅ Success toast
- ✅ Redirects to dashboard
- ✅ Check Supabase → `users` table → Should see new user

---

### Step 3: Test Lawyer Registration

1. **Open**: http://localhost:3000/signup/lawyer

2. **Step 1 - Basic Info**:
   - Name: `Dr. Test Lawyer`
   - Email: `testlawyer@test.com`
   - Phone: `9876543211`
   - Password: `testpass123`
   - Confirm: `testpass123`
   - Click **Next**

3. **Step 2 - Professional**:
   - Bar Council: `BCN123456`
   - State: `Maharashtra`
   - Practice Areas: Select `Criminal Law`
   - Experience: `5-10`
   - Education: `LLB Test University`
   - Languages: Select `English`
   - Click **Next**

4. **Step 3 - Documents**:
   - Bar Certificate: Upload any file
   - ID Proof: Upload any file
   - Profile Photo: Optional
   - Click **Next**

5. **Step 4 - Profile**:
   - Bio: `Experienced lawyer with 10 years of practice in criminal law. Specialized in bail matters and property disputes.`
   - Fee: `1500`
   - Specializations: Add `Bail matters`
   - Address: `123 Test St`
   - City: `Mumbai`
   - State: `Maharashtra`
   - Pincode: `400001`
   - Click **Next**

6. **Step 5 - Review**:
   - Review all info
   - Click **Submit Registration**

**Expected:**
- ✅ Success toast
- ✅ Redirects to verification-pending page
- ✅ Check Supabase:
  - `users` table → New lawyer user (status: PENDING)
  - `lawyer_profiles` table → New profile
  - `lawyer-documents` storage → Uploaded files

---

## 🐛 Common Issues & Fixes

### Issue: "Missing Supabase environment variables"
**Fix:**
- Check `.env.local` exists
- Restart dev server: `npm run dev`

### Issue: "Failed to upload file"
**Fix:**
- Verify `lawyer-documents` bucket exists
- Make sure bucket is **public**
- Check file size < 5MB

### Issue: "relation does not exist"
**Fix:**
- Run `supabase/schema.sql` in Supabase SQL Editor

### Issue: Registration works but no data in Supabase
**Fix:**
- Check browser console (F12) for errors
- Check terminal for server errors
- Verify API keys are correct

---

## ✅ Success Checklist

After testing, verify:

- [ ] Client registration creates user in `users` table
- [ ] Lawyer registration creates user in `users` table
- [ ] Lawyer registration creates profile in `lawyer_profiles` table
- [ ] Files uploaded to `lawyer-documents` storage
- [ ] No errors in browser console
- [ ] No errors in terminal

---

## 🎯 What to Check in Supabase

### After Client Registration:
**Table Editor → users**
- Should see row with:
  - `email`: testclient@test.com
  - `role`: CLIENT
  - `verification_status`: null

### After Lawyer Registration:
**Table Editor → users**
- Should see row with:
  - `email`: testlawyer@test.com
  - `role`: LAWYER
  - `verification_status`: PENDING

**Table Editor → lawyer_profiles**
- Should see row with:
  - `bar_council_number`: BCN123456
  - `consultation_fee`: 1500
  - All fields populated

**Storage → lawyer-documents**
- Should see files in:
  - `bar-certificates/` folder
  - `id-proofs/` folder

---

**Ready to test!** Follow the steps above and let me know what happens! 🚀
