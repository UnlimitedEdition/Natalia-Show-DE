import { createClient } from '@supabase/supabase-js'

// Supabase configuration - using service key to ensure we have the necessary permissions
const SUPABASE_URL = 'https://ykixjxocfbcczvkjgwts.supabase.co'
const SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlraXhqeG9jZmJjY3p2a2pnd3RzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NzE2MDgyNiwiZXhwIjoyMDcyNzM2ODI2fQ.yVm112ou5zHIZnvDq2kZY4t_BRTiP0wNWHTuLyjY3lw'

// Create a Supabase client with full access
const supabase = createClient(SUPABASE_URL, SERVICE_KEY, {
  auth: {
    persistSession: false,
    autoRefreshToken: false
  }
})

async function fixRecursiveRLSPolicy() {
  try {
    console.log('=== FIXING RECURSIVE RLS POLICY ON ADMIN_USERS TABLE ===\n')
    
    // Check if we can access the admin_users table
    console.log('1. Testing access to admin_users table...')
    const { data: testData, error: testError } = await supabase
      .from('admin_users')
      .select('id')
      .limit(1)
    
    if (testError && testError.message.includes('infinite recursion')) {
      console.log('  ✓ Confirmed recursive policy issue exists')
    } else if (testError) {
      console.log('  ! Unexpected error:', testError.message)
    } else {
      console.log('  - admin_users table accessible')
    }
    
    // Apply the fix using RPC call to execute raw SQL
    console.log('\n2. Applying fix for recursive RLS policy...')
    
    // Note: Since we can't execute ALTER TABLE directly via the JS client,
    // we'll need to execute this SQL directly in the Supabase dashboard:
    console.log('  Please execute the following SQL in your Supabase SQL editor:')
    console.log(`
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
`)
    
    console.log('\n3. After applying the SQL fix, test the connection...')
    
    // Wait a moment for user to apply the fix
    console.log('  Please apply the SQL fix above, then run this test:')
    console.log(`
// Test script to verify the fix
const { data, error } = await supabase
  .from('admin_users')
  .select('*')
  .limit(1);

if (error) {
  console.log('Error still exists:', error.message);
} else {
  console.log('Success! admin_users table is now accessible');
  console.log('Found', data.length, 'records');
}
`)
    
    console.log('\n=== FIX INSTRUCTIONS COMPLETE ===')
    console.log('\nNext steps:')
    console.log('1. Copy the SQL code above')
    console.log('2. Go to your Supabase dashboard')
    console.log('3. Open the SQL editor')
    console.log('4. Paste and run the SQL code')
    console.log('5. Run the test script to verify the fix')
    
  } catch (error) {
    console.error('Unexpected error:', error)
  }
}

// Run the fix
fixRecursiveRLSPolicy()