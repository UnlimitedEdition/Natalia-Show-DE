-- Setup audit logging and RLS policies

-- Create audit log table for tracking changes
CREATE TABLE IF NOT EXISTS audit_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    table_name VARCHAR(100) NOT NULL,
    operation VARCHAR(10) NOT NULL, -- INSERT, UPDATE, DELETE
    record_id UUID,
    old_values JSONB,
    new_values JSONB,
    user_id UUID,
    user_email VARCHAR(255),
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_audit_log_table_name ON audit_log(table_name);
CREATE INDEX IF NOT EXISTS idx_audit_log_operation ON audit_log(operation);
CREATE INDEX IF NOT EXISTS idx_audit_log_user_id ON audit_log(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_log_created_at ON audit_log(created_at);

-- Add comments to describe the audit log table
COMMENT ON TABLE audit_log IS 'Stores audit trail of all database changes';
COMMENT ON COLUMN audit_log.table_name IS 'Name of the table that was modified';
COMMENT ON COLUMN audit_log.operation IS 'Type of operation performed (INSERT, UPDATE, DELETE)';
COMMENT ON COLUMN audit_log.record_id IS 'ID of the record that was modified';
COMMENT ON COLUMN audit_log.old_values IS 'JSON representation of the record before modification';
COMMENT ON COLUMN audit_log.new_values IS 'JSON representation of the record after modification';
COMMENT ON COLUMN audit_log.user_id IS 'ID of the user who performed the operation';
COMMENT ON COLUMN audit_log.user_email IS 'Email of the user who performed the operation';
COMMENT ON COLUMN audit_log.ip_address IS 'IP address of the user who performed the operation';
COMMENT ON COLUMN audit_log.user_agent IS 'User agent of the client who performed the operation';

-- Create function to automatically log changes
CREATE OR REPLACE FUNCTION log_audit_change()
RETURNS TRIGGER AS $$
BEGIN
    IF (TG_OP = 'DELETE') THEN
        INSERT INTO audit_log (
            table_name, operation, record_id, old_values, user_id, user_email
        ) VALUES (
            TG_TABLE_NAME, 'DELETE', OLD.id, row_to_json(OLD), 
            NULL, -- In a real implementation, you would get the current user
            NULL
        );
        RETURN OLD;
    ELSIF (TG_OP = 'INSERT') THEN
        INSERT INTO audit_log (
            table_name, operation, record_id, new_values, user_id, user_email
        ) VALUES (
            TG_TABLE_NAME, 'INSERT', NEW.id, row_to_json(NEW),
            NULL, -- In a real implementation, you would get the current user
            NULL
        );
        RETURN NEW;
    ELSIF (TG_OP = 'UPDATE') THEN
        INSERT INTO audit_log (
            table_name, operation, record_id, old_values, new_values, user_id, user_email
        ) VALUES (
            TG_TABLE_NAME, 'UPDATE', NEW.id, row_to_json(OLD), row_to_json(NEW),
            NULL, -- In a real implementation, you would get the current user
            NULL
        );
        RETURN NEW;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Enable RLS on all tables
ALTER TABLE page_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE media ENABLE ROW LEVEL SECURITY;
ALTER TABLE content ENABLE ROW LEVEL SECURITY;
ALTER TABLE languages ENABLE ROW LEVEL SECURITY;
ALTER TABLE advertisements ENABLE ROW LEVEL SECURITY;
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for page_sections
CREATE POLICY "page_sections are viewable by everyone" 
ON page_sections FOR SELECT 
TO anon, authenticated 
USING (is_active = true);

CREATE POLICY "Only admins can manage page_sections" 
ON page_sections FOR ALL 
TO authenticated 
USING (
    EXISTS (
        SELECT 1 FROM admin_users 
        WHERE admin_users.id = (SELECT auth.uid()) 
        AND admin_users.is_active = true
    )
);

-- Create RLS policies for media
CREATE POLICY "media is viewable by everyone" 
ON media FOR SELECT 
TO anon, authenticated 
USING (is_active = true);

CREATE POLICY "Only admins can manage media" 
ON media FOR ALL 
TO authenticated 
USING (
    EXISTS (
        SELECT 1 FROM admin_users 
        WHERE admin_users.id = (SELECT auth.uid()) 
        AND admin_users.is_active = true
    )
);

-- Create RLS policies for content
CREATE POLICY "content is viewable by everyone" 
ON content FOR SELECT 
TO anon, authenticated 
USING (is_active = true);

CREATE POLICY "Only admins can manage content" 
ON content FOR ALL 
TO authenticated 
USING (
    EXISTS (
        SELECT 1 FROM admin_users 
        WHERE admin_users.id = (SELECT auth.uid()) 
        AND admin_users.is_active = true
    )
);

-- Create RLS policies for languages
CREATE POLICY "languages are viewable by everyone" 
ON languages FOR SELECT 
TO anon, authenticated 
USING (is_active = true);

CREATE POLICY "Only admins can manage languages" 
ON languages FOR ALL 
TO authenticated 
USING (
    EXISTS (
        SELECT 1 FROM admin_users 
        WHERE admin_users.id = (SELECT auth.uid()) 
        AND admin_users.is_active = true
    )
);

-- Create RLS policies for advertisements
CREATE POLICY "advertisements are viewable by everyone" 
ON advertisements FOR SELECT 
TO anon, authenticated 
USING (is_active = true);

CREATE POLICY "Only admins can manage advertisements" 
ON advertisements FOR ALL 
TO authenticated 
USING (
    EXISTS (
        SELECT 1 FROM admin_users 
        WHERE admin_users.id = (SELECT auth.uid()) 
        AND admin_users.is_active = true
    )
);

-- Create RLS policies for announcements
CREATE POLICY "announcements are viewable by everyone" 
ON announcements FOR SELECT 
TO anon, authenticated 
USING (is_active = true AND (expire_date IS NULL OR expire_date > NOW()));

CREATE POLICY "Only admins can manage announcements" 
ON announcements FOR ALL 
TO authenticated 
USING (
    EXISTS (
        SELECT 1 FROM admin_users 
        WHERE admin_users.id = (SELECT auth.uid()) 
        AND admin_users.is_active = true
    )
);

-- Create RLS policies for admin_users
CREATE POLICY "Only admins can view admin_users" 
ON admin_users FOR SELECT 
TO authenticated 
USING (
    EXISTS (
        SELECT 1 FROM admin_users au 
        WHERE au.id = (SELECT auth.uid()) 
        AND au.is_active = true
    )
);

CREATE POLICY "Only admins can manage admin_users" 
ON admin_users FOR ALL 
TO authenticated 
USING (
    EXISTS (
        SELECT 1 FROM admin_users 
        WHERE admin_users.id = (SELECT auth.uid()) 
        AND admin_users.is_active = true
    )
);

-- Create RLS policies for audit_log
CREATE POLICY "Only admins can view audit_log" 
ON audit_log FOR SELECT 
TO authenticated 
USING (
    EXISTS (
        SELECT 1 FROM admin_users 
        WHERE admin_users.id = (SELECT auth.uid()) 
        AND admin_users.is_active = true
    )
);

CREATE POLICY "No one can modify audit_log" 
ON audit_log FOR ALL 
TO authenticated 
USING (false);

-- Grant necessary permissions
GRANT SELECT ON page_sections TO anon, authenticated;
GRANT SELECT ON media TO anon, authenticated;
GRANT SELECT ON content TO anon, authenticated;
GRANT SELECT ON languages TO anon, authenticated;
GRANT SELECT ON advertisements TO anon, authenticated;
GRANT SELECT ON announcements TO anon, authenticated;
GRANT SELECT ON admin_users TO authenticated;
GRANT SELECT ON audit_log TO authenticated;

-- Grant all permissions to admin role for management
GRANT ALL ON page_sections TO authenticated;
GRANT ALL ON media TO authenticated;
GRANT ALL ON content TO authenticated;
GRANT ALL ON languages TO authenticated;
GRANT ALL ON advertisements TO authenticated;
GRANT ALL ON announcements TO authenticated;
GRANT ALL ON admin_users TO authenticated;
GRANT ALL ON audit_log TO authenticated;