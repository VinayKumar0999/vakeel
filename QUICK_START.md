# Quick Start Guide - Supabase Integration

## ✅ Setup Complete!

All Supabase integration code has been added to your project. Follow these steps to get started:

## Step 1: Install Dependencies

```bash
npm install
```

This installs:
- `@supabase/supabase-js` - Supabase client
- `bcryptjs` - Password hashing
- `jsonwebtoken` - JWT tokens

## Step 2: Create Supabase Account & Project

1. Go to https://supabase.com and sign up
2. Create a new project
3. Wait 2-3 minutes for initialization

## Step 3: Run Database Schema

1. In Supabase dashboard → **SQL Editor**
2. Open `supabase/schema.sql` from your project
3. Copy entire contents
4. Paste into SQL Editor
5. Click **Run**

## Step 4: Create Storage Bucket

1. In Supabase dashboard → **Storage**
2. Click **New bucket**
3. Name: `lawyer-documents`
4. ✅ Check **Public bucket**
5. Click **Create**

## Step 5: Get Credentials

1. Go to **Project Settings** → **API**
2. Copy:
   - Project URL
   - anon/public key
   - service_role key

## Step 6: Configure Environment

Create `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

## Step 7: Test It!

```bash
npm run dev
```

1. Go to http://localhost:3000/signup/lawyer
2. Fill in the form
3. Submit registration
4. Check Supabase dashboard:
   - **Table Editor** → `users` table (should see new user)
   - **Storage** → `lawyer-documents` (should see uploaded files)

## 📁 Files Created

- ✅ `lib/supabase.ts` - Supabase client setup
- ✅ `lib/db-helpers.ts` - Database helper functions
- ✅ `lib/storage-helpers.ts` - File upload helpers
- ✅ `supabase/schema.sql` - Database schema
- ✅ `app/api/auth/register/route.ts` - Updated to use Supabase
- ✅ `SUPABASE_SETUP.md` - Detailed setup guide

## 🎯 What's Working Now

✅ **Lawyer Registration**
- Creates user in database
- Uploads documents to Supabase Storage
- Creates lawyer profile
- Returns proper response

✅ **Client Registration**
- Creates user in database
- Validates all fields
- Returns proper response

✅ **File Storage**
- Bar Certificates → Supabase Storage
- ID Proofs → Supabase Storage
- Profile Photos → Supabase Storage

## 🔍 Verify Setup

After registration, check:

1. **Database** (Supabase → Table Editor):
   - `users` table should have new row
   - `lawyer_profiles` table should have new row (for lawyers)

2. **Storage** (Supabase → Storage):
   - `lawyer-documents` bucket should have files
   - Files should have public URLs

3. **Console** (Browser DevTools):
   - No errors
   - Success message displayed

## 🐛 Troubleshooting

**Error: "Missing Supabase environment variables"**
- Check `.env.local` exists
- Verify all 3 variables are set
- Restart dev server

**Error: "Failed to upload file"**
- Verify `lawyer-documents` bucket exists
- Check bucket is public
- Verify file size < 5MB

**Error: "relation does not exist"**
- Run `supabase/schema.sql` in SQL Editor
- Check for SQL errors

## 📚 Next Steps

1. ✅ Complete Supabase setup (Steps 1-6 above)
2. ✅ Test registration flow
3. 🔄 Add login functionality (can use Supabase Auth)
4. 🔄 Add admin verification panel
5. 🔄 Add lawyer search/listing page

## 💡 Tips

- Keep `SUPABASE_SERVICE_ROLE_KEY` secret (never commit to git)
- Use service role key only in API routes (server-side)
- Use anon key in client components
- Check Supabase dashboard regularly to monitor usage

## 📖 Documentation

- **Full Setup**: See `SUPABASE_SETUP.md`
- **Database Info**: See `DATABASE_SETUP.md`
- **What is Supabase**: See `WHAT_IS_SUPABASE.md`
- **API Integration**: See `API_INTEGRATION.md`

---

**Ready to go!** Once you complete Steps 1-6, your app will be fully connected to Supabase! 🚀
