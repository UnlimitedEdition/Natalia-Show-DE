-- Add is_active column to announcements table for consistency with other tables
ALTER TABLE announcements 
ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;

-- Add index for better performance
CREATE INDEX IF NOT EXISTS idx_announcements_is_active ON announcements(is_active);

-- Set existing records to active
UPDATE announcements 
SET is_active = true 
WHERE is_active IS NULL;

-- Add comment to describe the column
COMMENT ON COLUMN announcements.is_active IS 'Indicates if the announcement is active and should be displayed';

-- Update the RLS policy to use is_active column
DROP POLICY IF EXISTS "announcements are viewable by everyone" ON announcements;

CREATE POLICY "announcements are viewable by everyone" 
ON announcements FOR SELECT 
TO anon, authenticated 
USING (is_active = true AND (expire_date IS NULL OR expire_date > NOW()));