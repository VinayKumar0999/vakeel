# Supabase Setup Guide

## Step 1: Create Supabase Account

1. Go to https://supabase.com
2. Click "Start your project" or "Sign up"
3. Sign up with GitHub, Google, or Email
4. Create a new organization (if prompted)

## Step 2: Create a New Project

1. Click "New Project"
2. Fill in:
   - **Name**: `vakeel-kutami` (or your preferred name)
   - **Database Password**: Create a strong password (save it!)
   - **Region**: Choose closest to your users (e.g., `Southeast Asia (Singapore)`)
   - **Pricing Plan**: Select "Free"
3. Click "Create new project"
4. Wait 2-3 minutes for project to initialize

## Step 3: Get Your Credentials

1. Go to **Project Settings** (gear icon in sidebar)
2. Click **API** in the left menu
3. Copy these values:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon/public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role key** → `SUPABASE_SERVICE_ROLE_KEY` (keep this secret!)

## Step 4: Set Up Database Schema

1. In Supabase dashboard, click **SQL Editor** in the left sidebar
2. Click **New Query**
3. Copy the entire contents of `supabase/schema.sql`
4. Paste into the SQL Editor
5. Click **Run** (or press Ctrl+Enter)
6. You should see "Success. No rows returned"

## Step 5: Set Up File Storage

1. Click **Storage** in the left sidebar
2. Click **New bucket**
3. Create bucket with:
   - **Name**: `lawyer-documents`
   - **Public bucket**: ✅ **Checked** (so files can be accessed via URL)
   - **File size limit**: `5242880` (5MB)
   - **Allowed MIME types**: Leave empty (allows all types)
4. Click **Create bucket**

### Set Storage Policies (Optional but Recommended)

1. Click on `lawyer-documents` bucket
2. Go to **Policies** tab
3. Click **New Policy**
4. Create policy:
   - **Policy name**: `Allow authenticated uploads`
   - **Allowed operation**: `INSERT`
   - **Policy definition**: 
     ```sql
     (bucket_id = 'lawyer-documents'::text) AND (auth.role() = 'authenticated'::text)
     ```
5. Click **Save**

## Step 6: Configure Environment Variables

1. In your project root, create `.env.local` (if not exists):
   ```bash
   cp .env.example .env.local
   ```

2. Edit `.env.local` and add:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
   ```

3. Replace the placeholder values with your actual credentials from Step 3

## Step 7: Install Dependencies

```bash
npm install
# or
yarn install
```

This will install:
- `@supabase/supabase-js` - Supabase client
- `bcryptjs` - Password hashing
- `jsonwebtoken` - JWT token generation

## Step 8: Test the Setup

1. Start your dev server:
   ```bash
   npm run dev
   ```

2. Try registering a lawyer:
   - Go to http://localhost:3000/signup/lawyer
   - Fill in the form
   - Submit

3. Check Supabase:
   - Go to **Table Editor** → `users` table
   - You should see the new user
   - Go to **Storage** → `lawyer-documents` bucket
   - You should see uploaded files

## Troubleshooting

### Error: "Missing Supabase environment variables"
- Make sure `.env.local` exists and has all three variables
- Restart your dev server after adding env variables

### Error: "Failed to upload file"
- Check that `lawyer-documents` bucket exists
- Verify bucket is public
- Check file size (should be < 5MB)

### Error: "relation does not exist"
- Make sure you ran the SQL schema in Step 4
- Check SQL Editor for any errors

### Files not showing in Storage
- Check bucket name matches exactly: `lawyer-documents`
- Verify files were uploaded successfully (check browser console)

## Next Steps

After setup is complete:
1. ✅ Test lawyer registration
2. ✅ Test client registration
3. ✅ Verify files are uploaded to Supabase Storage
4. ✅ Check data appears in database tables

## Security Notes

- ⚠️ **Never commit** `.env.local` to git (already in `.gitignore`)
- ⚠️ **Never expose** `SUPABASE_SERVICE_ROLE_KEY` in client-side code
- ⚠️ Use `SUPABASE_SERVICE_ROLE_KEY` only in API routes (server-side)
- ✅ Use `NEXT_PUBLIC_SUPABASE_ANON_KEY` in client components

## Need Help?

- Supabase Docs: https://supabase.com/docs
- Supabase Discord: https://discord.supabase.com
- Check `DATABASE_SETUP.md` for more database options
