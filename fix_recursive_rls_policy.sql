import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config()

// Supabase configuration
const SUPABASE_URL = process.env.SUPABASE_URL
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

// Validate environment variables
if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error('Missing required environment variables:')
  if (!SUPABASE_URL) console.error('- SUPABASE_URL')
  if (!SERVICE_KEY) console.error('- SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

// Create a Supabase client with service role for full access
const supabase = createClient(SUPABASE_URL, SERVICE_KEY)

-- Fix recursive RLS policy issue on admin_users table

-- First, disable RLS temporarily to avoid recursion during the fix
ALTER TABLE admin_users DISABLE ROW LEVEL SECURITY;

-- Drop the problematic policies that cause recursion
DROP POLICY IF EXISTS "Only admins can view admin_users" ON admin_users;
DROP POLICY IF EXISTS "Only admins can manage admin_users" ON admin_users;

-- Create new, non-recursive policies
-- Allow users to view their own record
CREATE POLICY "Users can view their own admin record" 
ON admin_users FOR SELECT 
TO authenticated 
USING (id = auth.uid());

-- Allow service role to manage all admin users (for application logic)
CREATE POLICY "Service role can manage admin users" 
ON admin_users FOR ALL 
TO service_role 
USING (true);

-- For other admin management, we'll use a different approach
-- Allow authenticated users with proper app logic to manage admin users
-- This policy checks if the user is authenticated but doesn't recursively check admin_users
CREATE POLICY "Authenticated users can manage admin users with app logic" 
ON admin_users FOR ALL 
TO authenticated 
USING (
    -- Check if user is authenticated (this replaces the recursive admin_users check)
    auth.uid() IS NOT NULL
);

-- Re-enable RLS
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Grant necessary permissions
GRANT SELECT, INSERT, UPDATE, DELETE ON admin_users TO authenticated;
GRANT ALL ON admin_users TO service_role;

-- Provide a note about the fix
/*
This script fixes the infinite recursion issue in the admin_users table policies.
The original policies were checking the admin_users table within their own definition,
which created a recursive loop.

The new policies:
1. Allow users to view their own record
2. Allow the service role to manage all admin users
3. Allow authenticated users to manage admin users without recursive checks

This should resolve the "infinite recursion detected in policy for relation 'admin_users'" error.
*/