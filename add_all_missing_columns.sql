-- Add all missing columns to fix database errors

-- Add media_id column to content table
-- This column is needed to establish relationship between content and media tables
ALTER TABLE content 
ADD COLUMN IF NOT EXISTS media_id UUID REFERENCES media(id) ON DELETE CASCADE;

-- Add foreign key constraint if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'content_media_id_fkey' 
    AND table_name = 'content'
  ) THEN
    ALTER TABLE content 
    ADD CONSTRAINT content_media_id_fkey 
    FOREIGN KEY (media_id) REFERENCES media(id) ON DELETE CASCADE;
  END IF;
END $$;

-- Ensure language_code column exists in content table
ALTER TABLE content 
ADD COLUMN IF NOT EXISTS language_code VARCHAR(10) REFERENCES languages(code);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_content_media_id ON content(media_id);
CREATE INDEX IF NOT EXISTS idx_content_language_code ON content(language_code);
CREATE INDEX IF NOT EXISTS idx_content_content_key ON content(content_key);

-- Add comments to describe the purpose of these columns
COMMENT ON COLUMN content.media_id IS 'Foreign key referencing the media item this content belongs to';
COMMENT ON COLUMN content.language_code IS 'Language code for this content (sr, en, de)';