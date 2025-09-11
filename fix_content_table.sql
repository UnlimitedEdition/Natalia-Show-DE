-- Fix content table structure to resolve issues with MediaManager component
-- Make section_key nullable since it's not always provided by the application

ALTER TABLE content 
ALTER COLUMN section_key DROP NOT NULL;

-- Add a trigger or function to automatically populate section_key from media table if needed
-- This would help maintain data consistency without requiring application changes

-- Add comment to explain the purpose of section_key
COMMENT ON COLUMN content.section_key IS 'Section key for this content (can reference page_sections, nullable for content linked to media)';