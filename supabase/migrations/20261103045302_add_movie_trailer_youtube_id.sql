/*
# Add trailer support to movies

1. Modified Tables
- `movies`: new nullable column `trailer_youtube_id` (text). Stores only the YouTube video ID (11 characters), not a full URL.

2. Security
- No policy or grant changes. The existing table-level SELECT grants for anon and authenticated already cover the new column.
- A CHECK constraint restricts the value to the YouTube ID format, so the frontend can only ever embed YouTube videos.

3. Notes
- Existing rows keep NULL, and the movie page shows a "Trailer coming soon" message for them.
*/

ALTER TABLE movies ADD COLUMN IF NOT EXISTS trailer_youtube_id text;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'movies_trailer_youtube_id_format'
  ) THEN
    ALTER TABLE movies ADD CONSTRAINT movies_trailer_youtube_id_format
      CHECK (trailer_youtube_id IS NULL OR trailer_youtube_id ~ '^[A-Za-z0-9_-]{11}$');
  END IF;
END $$;
