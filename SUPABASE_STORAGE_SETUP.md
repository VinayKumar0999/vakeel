# Supabase Storage Setup – Fix "Bucket not found"

The lawyer signup uploads files to a Supabase Storage bucket named **`lawyer-documents`**. You need to create this bucket in your Supabase project.

## Option 1: Create bucket in Supabase Dashboard (recommended)

1. Open your project: [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Select your **Vakeel** project.
3. In the left sidebar, go to **Storage**.
4. Click **New bucket**.
5. Set:
   - **Name:** `lawyer-documents`
   - **Public bucket:** Turn **ON** (so lawyer documents can be viewed via public URLs).
   - **File size limit:** Leave default or set (e.g. 5 MB).
   - **Allowed MIME types:** Leave empty to allow all, or add: `image/*,application/pdf`.
6. Click **Create bucket**.

## Option 2: Create bucket with SQL (Storage is backed by Postgres)

Storage bucket metadata can be inserted via SQL. Run this in **SQL Editor** in Supabase:

```sql
-- Create the lawyer-documents bucket (public)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'lawyer-documents',
  'lawyer-documents',
  true,
  5242880,
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'application/pdf']
)
ON CONFLICT (id) DO NOTHING;

-- Allow public read access to the bucket
CREATE POLICY "Public read access for lawyer documents"
ON storage.objects FOR SELECT
USING (bucket_id = 'lawyer-documents');

-- Allow authenticated uploads (your app uses service role, so this is for extra safety)
CREATE POLICY "Allow uploads to lawyer-documents"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'lawyer-documents');

CREATE POLICY "Allow updates to lawyer-documents"
ON storage.objects FOR UPDATE
USING (bucket_id = 'lawyer-documents');
```

If you get "relation storage.buckets does not exist", use **Option 1** (Dashboard) instead.

## After creating the bucket

1. Save the bucket (Dashboard or SQL).
2. Try lawyer signup again and upload Bar Certificate + ID Proof.

The app uses the bucket name **`lawyer-documents`** in `lib/storage-helpers.ts`. If you create a bucket with a different name, either rename it to `lawyer-documents` or update that file to use your bucket name.
