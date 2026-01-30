# ⚠️ URGENT: Run Database Schema

## 🔴 Error You're Seeing:
```
"Could not find the table 'public.users' in the schema cache"
```

**This means:** The database tables don't exist yet in Supabase!

---

## ✅ Quick Fix (2 minutes):

### Step 1: Open Supabase Dashboard
1. Go to https://supabase.com/dashboard
2. Click on your project: `aauhslzeeibhnykiqzja`

### Step 2: Open SQL Editor
1. Click **"SQL Editor"** in the left sidebar
2. Click **"New Query"** button (top right)

### Step 3: Copy & Run Schema
1. Open `supabase/schema.sql` file from your project
2. **Copy the ENTIRE contents** (all lines)
3. **Paste** into the SQL Editor in Supabase
4. Click **"Run"** button (or press Ctrl+Enter)

### Step 4: Verify Tables Created
1. Click **"Table Editor"** in left sidebar
2. You should see:
   - ✅ `users` table
   - ✅ `lawyer_profiles` table

---

## 📋 What the Schema Creates:

- ✅ `users` table - Stores all users (clients, lawyers, admins)
- ✅ `lawyer_profiles` table - Stores lawyer details
- ✅ Indexes for performance
- ✅ Row Level Security policies
- ✅ Auto-update triggers

---

## 🎯 After Running Schema:

1. **Try registration again** - Should work now!
2. **Check Supabase** - Tables should appear in Table Editor

---

## 🆘 Still Getting Error?

If you still see the error after running schema:

1. **Check SQL Editor** - Look for any red error messages
2. **Verify tables exist** - Go to Table Editor, check if `users` table appears
3. **Check project** - Make sure you're in the correct Supabase project
4. **Restart dev server** - Sometimes helps: `npm run dev`

---

**Run the schema SQL now and try again!** 🚀
