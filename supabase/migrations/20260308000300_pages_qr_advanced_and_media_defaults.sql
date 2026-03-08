ALTER TABLE pages
  ADD COLUMN IF NOT EXISTS memorial_photo_fit text NOT NULL DEFAULT 'cover',
  ADD COLUMN IF NOT EXISTS memorial_caption_style text NOT NULL DEFAULT 'classic',
  ADD COLUMN IF NOT EXISTS qr_foreground_color text NOT NULL DEFAULT '#111827',
  ADD COLUMN IF NOT EXISTS qr_background_color text NOT NULL DEFAULT '#ffffff',
  ADD COLUMN IF NOT EXISTS qr_frame_style text NOT NULL DEFAULT 'line',
  ADD COLUMN IF NOT EXISTS qr_caption_font text NOT NULL DEFAULT 'serif',
  ADD COLUMN IF NOT EXISTS qr_show_logo boolean NOT NULL DEFAULT false;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'pages_memorial_photo_fit_check'
  ) THEN
    ALTER TABLE pages
      ADD CONSTRAINT pages_memorial_photo_fit_check
      CHECK (memorial_photo_fit IN ('cover', 'contain'));
  END IF;
END
$$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'pages_memorial_caption_style_check'
  ) THEN
    ALTER TABLE pages
      ADD CONSTRAINT pages_memorial_caption_style_check
      CHECK (memorial_caption_style IN ('classic', 'minimal'));
  END IF;
END
$$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'pages_qr_foreground_color_check'
  ) THEN
    ALTER TABLE pages
      ADD CONSTRAINT pages_qr_foreground_color_check
      CHECK (qr_foreground_color IN ('#111827', '#14532d', '#7c2d12'));
  END IF;
END
$$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'pages_qr_background_color_check'
  ) THEN
    ALTER TABLE pages
      ADD CONSTRAINT pages_qr_background_color_check
      CHECK (qr_background_color IN ('#ffffff', '#f8fafc', '#fffaf2'));
  END IF;
END
$$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'pages_qr_frame_style_check'
  ) THEN
    ALTER TABLE pages
      ADD CONSTRAINT pages_qr_frame_style_check
      CHECK (qr_frame_style IN ('line', 'rounded', 'double'));
  END IF;
END
$$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'pages_qr_caption_font_check'
  ) THEN
    ALTER TABLE pages
      ADD CONSTRAINT pages_qr_caption_font_check
      CHECK (qr_caption_font IN ('serif', 'sans'));
  END IF;
END
$$;

UPDATE pages
SET
  memorial_slideshow_enabled = COALESCE(memorial_slideshow_enabled, site.memorial_slideshow_enabled, true),
  memorial_slideshow_interval_ms = COALESCE(memorial_slideshow_interval_ms, site.memorial_slideshow_interval_ms, 4500),
  memorial_video_layout = COALESCE(memorial_video_layout, site.memorial_video_layout, 'grid')
FROM (
  SELECT
    memorial_slideshow_enabled,
    memorial_slideshow_interval_ms,
    memorial_video_layout
  FROM site_settings
  WHERE id = 1
) AS site
WHERE
  memorial_slideshow_enabled IS NULL
  OR memorial_slideshow_interval_ms IS NULL
  OR memorial_video_layout IS NULL;
