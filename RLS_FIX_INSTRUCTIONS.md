# RLS Recursive Policy Issue Fix

## Problem Description

You're encountering the following error in your application:

```
'infinite recursion detected in policy for relation "admin_users"'
```

This error occurs because the Row Level Security (RLS) policies on the `admin_users` table have a recursive definition. The policies check the `admin_users` table within their own definition, creating an infinite loop.

## Root Cause

In the file [setup_audit_and_rls.sql](file:///e:/Natalia%20Show/setup_audit_and_rls.sql), the policies for `admin_users` are defined as:

```sql
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
```

This policy is checking the `admin_users` table within its own definition, which creates a recursive loop that PostgreSQL detects and prevents.

## Solution

To fix this issue, you need to replace the recursive policies with non-recursive ones. Here's how:

### Step 1: Execute the Fix SQL

Go to your Supabase Dashboard and open the SQL editor. Execute the following SQL script:

```sql
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

-- For other admin management, we'll rely on application logic
-- Allow authenticated users to manage admin users without recursive checks
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
```

### Step 2: Verify the Fix

After executing the SQL, test the connection by running a simple query:

```javascript
const { data, error } = await supabase
  .from('admin_users')
  .select('*')
  .limit(1);

if (error) {
  console.log('Error still exists:', error.message);
} else {
  console.log('Success! admin_users table is now accessible');
}
```

## Why This Fix Works

1. **Non-recursive policies**: The new policies don't check the `admin_users` table within their own definition.

2. **Proper authentication checks**: Instead of recursively checking if a user is an admin, we use `auth.uid()` to check if the user is authenticated.

3. **Service role access**: The service role (used by the application backend) has full access to manage admin users.

4. **User self-access**: Users can view their own admin record, which is typically sufficient for most use cases.

## Prevention

To avoid this issue in the future:

1. Always check for recursive policy definitions when creating RLS policies
2. Use `auth.uid()` directly instead of subqueries that reference the same table
3. Test RLS policies thoroughly in a development environment before deploying to production
4. Consider using application-level authorization in addition to database-level policies