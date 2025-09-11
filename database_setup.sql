-- Complete database setup script
-- This script creates all necessary tables and relationships for the application

-- Create languages table if it doesn't exist
CREATE TABLE IF NOT EXISTS languages (
    code VARCHAR(10) PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    is_active BOOLEAN DEFAULT true,
    is_default BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create page_sections table if it doesn't exist
CREATE TABLE IF NOT EXISTS page_sections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    section_key VARCHAR(50) UNIQUE NOT NULL,
    section_name VARCHAR(100) NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create media table with proper structure
CREATE TABLE IF NOT EXISTS media (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    section_key VARCHAR(50) NOT NULL,
    media_type VARCHAR(50) NOT NULL,
    file_url TEXT,
    social_url TEXT,
    thumbnail_url TEXT,
    display_order INTEGER,
    is_active BOOLEAN DEFAULT true,
    language_code VARCHAR(10) REFERENCES languages(code),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    FOREIGN KEY (section_key) REFERENCES page_sections(section_key)
);

-- Create content table for storing text content with language support
CREATE TABLE IF NOT EXISTS content (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    media_id UUID REFERENCES media(id) ON DELETE CASCADE,
    language_code VARCHAR(10) REFERENCES languages(code),
    content_key VARCHAR(100) NOT NULL, -- e.g., 'title', 'description'
    content_value TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(media_id, language_code, content_key)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_media_section_key ON media(section_key);
CREATE INDEX IF NOT EXISTS idx_media_is_active ON media(is_active);
CREATE INDEX IF NOT EXISTS idx_media_language_code ON media(language_code);
CREATE INDEX IF NOT EXISTS idx_media_display_order ON media(display_order);
CREATE INDEX IF NOT EXISTS idx_content_media_id ON content(media_id);
CREATE INDEX IF NOT EXISTS idx_content_language_code ON content(language_code);
CREATE INDEX IF NOT EXISTS idx_content_content_key ON content(content_key);

-- Insert default languages if they don't exist
INSERT INTO languages (code, name, is_active, is_default) VALUES 
    ('sr', 'Serbian', true, true),
    ('de', 'German', true, false),
    ('en', 'English', true, false)
ON CONFLICT (code) DO NOTHING;

-- Insert default page sections if they don't exist
INSERT INTO page_sections (section_key, section_name, is_active) VALUES 
    ('hero', 'Hero Section', true),
    ('kitchen', 'Kitchen Talk Show', true),
    ('cultural', 'Cultural Section', true),
    ('diaspora', 'Diaspora Section', true),
    ('podcast', 'Podcast Section', true),
    ('posts', 'Posts Section', true)
ON CONFLICT (section_key) DO NOTHING;

-- Add comments to describe the tables and columns
COMMENT ON TABLE media IS 'Stores media items like images and videos for different sections';
COMMENT ON TABLE content IS 'Stores text content for media items in different languages';
COMMENT ON COLUMN media.section_key IS 'References the section this media belongs to';
COMMENT ON COLUMN media.media_type IS 'Type of media (image, social_video, etc.)';
COMMENT ON COLUMN media.file_url IS 'URL for image files';
COMMENT ON COLUMN media.social_url IS 'URL for social media embeds (e.g., YouTube videos)';
COMMENT ON COLUMN media.thumbnail_url IS 'Thumbnail image for videos';
COMMENT ON COLUMN media.display_order IS 'Order in which media should be displayed';
COMMENT ON COLUMN media.language_code IS 'Language of this media item (if language-specific)';
COMMENT ON COLUMN content.media_id IS 'Reference to the media item this content belongs to';
COMMENT ON COLUMN content.language_code IS 'Language of this content';
COMMENT ON COLUMN content.content_key IS 'Key identifying the type of content (e.g., title, description)';
COMMENT ON COLUMN content.content_value IS 'Actual content text';