-- Add missing columns to the media table
-- Based on the TypeScript types but not actually present in the database

-- Add title column
ALTER TABLE media 
ADD COLUMN IF NOT EXISTS title VARCHAR(255) NULL;

-- Add description column
ALTER TABLE media 
ADD COLUMN IF NOT EXISTS description TEXT NULL;

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_media_section_key ON media(section_key);
CREATE INDEX IF NOT EXISTS idx_media_is_active ON media(is_active);
CREATE INDEX IF NOT EXISTS idx_media_language_code ON media(language_code);
CREATE INDEX IF NOT EXISTS idx_media_display_order ON media(display_order);

-- Add comment to describe the purpose of these columns
COMMENT ON COLUMN media.title IS 'Title of the media item';
COMMENT ON COLUMN media.description IS 'Description of the media item';