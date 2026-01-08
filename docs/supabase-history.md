# Supabase History

## 2025-12-05: Video Upload Schema

### Changes
- Created `visibility_type` ENUM ('public', 'pals_only', 'private').
- Created Storage Buckets: `public_videos` (public: true) and `secure_videos` (public: false).
- Added RLS policies for `public_videos` and `secure_videos` allowing authenticated users to manage their own files.
- Altered `training_videos` and `competition_videos` tables:
  - Added `bucket_id` (text).
  - Added `visibility` (visibility_type).
  - Added `storage_path` (text).

### SQL
```sql
-- Create ENUM for visibility type
CREATE TYPE visibility_type AS ENUM ('public', 'pals_only', 'private');

-- Create Storage Buckets
INSERT INTO storage.buckets (id, name, public) VALUES ('public_videos', 'public_videos', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('secure_videos', 'secure_videos', false) ON CONFLICT (id) DO NOTHING;

-- RLS Policies for Storage
CREATE POLICY "Give users access to own folder 1ax23a_0" ON storage.objects FOR SELECT TO authenticated USING (((bucket_id = 'public_videos'::text) AND ((storage.foldername(name))[1] = (auth.uid())::text)));
CREATE POLICY "Give users access to own folder 1ax23a_1" ON storage.objects FOR INSERT TO authenticated WITH CHECK (((bucket_id = 'public_videos'::text) AND ((storage.foldername(name))[1] = (auth.uid())::text)));
CREATE POLICY "Give users access to own folder 1ax23a_2" ON storage.objects FOR DELETE TO authenticated USING (((bucket_id = 'public_videos'::text) AND ((storage.foldername(name))[1] = (auth.uid())::text)));

CREATE POLICY "Give users access to own folder 1ax23a_3" ON storage.objects FOR SELECT TO authenticated USING (((bucket_id = 'secure_videos'::text) AND ((storage.foldername(name))[1] = (auth.uid())::text)));
CREATE POLICY "Give users access to own folder 1ax23a_4" ON storage.objects FOR INSERT TO authenticated WITH CHECK (((bucket_id = 'secure_videos'::text) AND ((storage.foldername(name))[1] = (auth.uid())::text)));
CREATE POLICY "Give users access to own folder 1ax23a_5" ON storage.objects FOR DELETE TO authenticated USING (((bucket_id = 'secure_videos'::text) AND ((storage.foldername(name))[1] = (auth.uid())::text)));

-- Update existing tables
ALTER TABLE training_videos 
ADD COLUMN IF NOT EXISTS bucket_id text,
ADD COLUMN IF NOT EXISTS visibility visibility_type DEFAULT 'private',
ADD COLUMN IF NOT EXISTS storage_path text;

ALTER TABLE competition_videos
ADD COLUMN IF NOT EXISTS bucket_id text,
ADD COLUMN IF NOT EXISTS visibility visibility_type DEFAULT 'private',
ADD COLUMN IF NOT EXISTS storage_path text;
```
