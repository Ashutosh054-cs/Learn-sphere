# Supabase Storage Setup for Profile Images

## Create Storage Bucket

You need to create a storage bucket in Supabase to allow users to upload profile images.

### Steps:

1. **Go to Supabase Dashboard**: https://supabase.com/dashboard
2. **Select your project**: `lrnbfmafelgcdyqvvzas`
3. **Navigate to**: Storage (in left sidebar)
4. **Click**: "New bucket"
5. **Enter bucket name**: `user-uploads`
6. **Make it PUBLIC**: Toggle "Public bucket" to ON
7. **Click**: "Create bucket"

### Set Storage Policies (Important!)

After creating the bucket, you need to set up policies to allow users to upload and view images:

1. Click on the `user-uploads` bucket
2. Go to "Policies" tab
3. Click "New Policy"

#### Policy 1: Allow users to upload their own files
```sql
-- Allow authenticated users to upload files
CREATE POLICY "Users can upload their own files"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'user-uploads');
```

#### Policy 2: Allow users to update their own files
```sql
-- Allow authenticated users to update their own files
CREATE POLICY "Users can update their own files"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'user-uploads');
```

#### Policy 3: Allow everyone to view files (public access)
```sql
-- Allow public access to view files
CREATE POLICY "Public can view files"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'user-uploads');
```

## Alternative: Quick Setup via SQL

Or you can run this SQL in the Supabase SQL Editor:

```sql
-- Create the storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('user-uploads', 'user-uploads', true);

-- Allow authenticated users to upload
CREATE POLICY "Users can upload files"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'user-uploads');

-- Allow authenticated users to update
CREATE POLICY "Users can update files"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'user-uploads');

-- Allow public to view
CREATE POLICY "Public can view files"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'user-uploads');
```

## Test the Setup

1. Go to your app: http://localhost:5173
2. Login to your account
3. Click on "View Profile" in the navbar
4. Upload a profile picture
5. Click "Save Changes"
6. Your profile image should now appear in the navbar!

## Troubleshooting

If image upload fails:
- Check browser console for errors
- Verify bucket name is exactly `user-uploads`
- Ensure bucket is set to PUBLIC
- Verify storage policies are created correctly
- Check that you're logged in (authenticated)
