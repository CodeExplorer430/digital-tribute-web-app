CREATE TABLE IF NOT EXISTS video_upload_jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  page_id uuid NOT NULL REFERENCES pages(id) ON DELETE CASCADE,
  created_by uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'queued' CHECK (status IN ('queued', 'uploading', 'processing', 'completed', 'fallback_required', 'failed', 'attached')),
  title text,
  source_filename text NOT NULL,
  source_mime text NOT NULL,
  source_bytes bigint NOT NULL CHECK (source_bytes > 0),
  upload_url text,
  upload_method text,
  output_public_id text,
  output_url text,
  output_bytes bigint,
  cloud_job_id text,
  error_message text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS video_upload_jobs_page_id_idx ON video_upload_jobs (page_id);
CREATE INDEX IF NOT EXISTS video_upload_jobs_created_by_idx ON video_upload_jobs (created_by);
CREATE INDEX IF NOT EXISTS video_upload_jobs_status_idx ON video_upload_jobs (status);
CREATE INDEX IF NOT EXISTS video_upload_jobs_created_at_idx ON video_upload_jobs (created_at DESC);

CREATE OR REPLACE FUNCTION set_video_upload_jobs_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_video_upload_jobs_updated_at ON video_upload_jobs;
CREATE TRIGGER trg_video_upload_jobs_updated_at
BEFORE UPDATE ON video_upload_jobs
FOR EACH ROW EXECUTE FUNCTION set_video_upload_jobs_updated_at();

ALTER TABLE video_upload_jobs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Owners can view own video upload jobs." ON video_upload_jobs;
CREATE POLICY "Owners can view own video upload jobs." ON video_upload_jobs
  FOR SELECT USING (
    created_by = auth.uid()
    OR EXISTS (
      SELECT 1
      FROM profiles
      WHERE profiles.id = auth.uid()
        AND profiles.role = 'admin'
        AND profiles.is_active = true
    )
  );

DROP POLICY IF EXISTS "Active editors/admins can create own video upload jobs." ON video_upload_jobs;
CREATE POLICY "Active editors/admins can create own video upload jobs." ON video_upload_jobs
  FOR INSERT WITH CHECK (
    created_by = auth.uid()
    AND EXISTS (
      SELECT 1
      FROM profiles
      WHERE profiles.id = auth.uid()
        AND profiles.role IN ('admin', 'editor')
        AND profiles.is_active = true
    )
    AND EXISTS (
      SELECT 1
      FROM pages
      WHERE pages.id = page_id
        AND (
          pages.owner_id = auth.uid()
          OR EXISTS (
            SELECT 1
            FROM profiles p2
            WHERE p2.id = auth.uid()
              AND p2.role = 'admin'
              AND p2.is_active = true
          )
        )
    )
  );

DROP POLICY IF EXISTS "Owners can update own video upload jobs." ON video_upload_jobs;
CREATE POLICY "Owners can update own video upload jobs." ON video_upload_jobs
  FOR UPDATE USING (
    created_by = auth.uid()
    OR EXISTS (
      SELECT 1
      FROM profiles
      WHERE profiles.id = auth.uid()
        AND profiles.role = 'admin'
        AND profiles.is_active = true
    )
  )
  WITH CHECK (
    created_by = auth.uid()
    OR EXISTS (
      SELECT 1
      FROM profiles
      WHERE profiles.id = auth.uid()
        AND profiles.role = 'admin'
        AND profiles.is_active = true
    )
  );
