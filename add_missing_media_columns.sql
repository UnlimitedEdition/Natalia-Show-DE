-- Add missing columns to the existing media table
-- These columns are referenced in the TypeScript types but missing from the actual database

-- Add title column for media titles
ALTER TABLE media 
ADD COLUMN IF NOT EXISTS title VARCHAR(255) NULL;

-- Add description column for media descriptions
ALTER TABLE media 
ADD COLUMN IF NOT EXISTS description TEXT NULL;

-- Add language_code column for language identification
ALTER TABLE media 
ADD COLUMN IF NOT EXISTS language_code VARCHAR(10) NULL;

-- Add indexes for better performance on commonly queried columns
CREATE INDEX IF NOT EXISTS idx_media_section_key ON media(section_key);
CREATE INDEX IF NOT EXISTS idx_media_is_active ON media(is_active);
CREATE INDEX IF NOT EXISTS idx_media_language_code ON media(language_code);
CREATE INDEX IF NOT EXISTS idx_media_display_order ON media(display_order);

-- Add comments to describe the purpose of these columns
COMMENT ON COLUMN media.title IS 'Title of the media item';
COMMENT ON COLUMN media.description IS 'Description of the media item';
COMMENT ON COLUMN media.language_code IS 'Language code for this media item (sr, en, de)';