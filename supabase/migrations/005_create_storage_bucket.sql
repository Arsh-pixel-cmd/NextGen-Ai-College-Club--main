-- Migration 005: Create Storage Bucket for Team Images with Size Restrictions
-- Run this in Supabase SQL Editor (Dashboard > SQL Editor > New Query)

-- 1. Create the team-images bucket (public, with 2MB file size limit and image mime-types)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'team-images',
  'team-images',
  true,
  2097152, -- 2 MB limit (in bytes)
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 2097152,
  allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

-- 2. Allow public access to view images
DROP POLICY IF EXISTS "Public read for team-images" ON storage.objects;
CREATE POLICY "Public read for team-images"
  ON storage.objects FOR SELECT
  TO public
  USING (bucket_id = 'team-images');

-- 3. Allow public/anon uploads for admin panel
DROP POLICY IF EXISTS "Public upload for team-images" ON storage.objects;
CREATE POLICY "Public upload for team-images"
  ON storage.objects FOR INSERT
  TO public
  WITH CHECK (bucket_id = 'team-images');

DROP POLICY IF EXISTS "Public update for team-images" ON storage.objects;
CREATE POLICY "Public update for team-images"
  ON storage.objects FOR UPDATE
  TO public
  USING (bucket_id = 'team-images');

DROP POLICY IF EXISTS "Public delete for team-images" ON storage.objects;
CREATE POLICY "Public delete for team-images"
  ON storage.objects FOR DELETE
  TO public
  USING (bucket_id = 'team-images');
