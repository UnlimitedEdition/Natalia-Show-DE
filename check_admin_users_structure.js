import { createClient } from '@supabase/supabase-js'

// Supabase configuration
const SUPABASE_URL = 'https://ykixjxocfbcczvkjgwts.supabase.co'
const SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlraXhqeG9jZmJjY3p2a2pnd3RzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NzE2MDgyNiwiZXhwIjoyMDcyNzM2ODI2fQ.yVm112ou5zHIZnvDq2kZY4t_BRTiP0wNWHTuLyjY3lw'

// Create a Supabase client with full access
const supabase = createClient(SUPABASE_URL, SERVICE_KEY, {
  auth: {
    persistSession: false,
    autoRefreshToken: false
  }
})

async function checkAdminUsersStructure() {
  try {
    console.log('=== CHECKING ADMIN_USERS TABLE STRUCTURE ===\n')
    
    // Try to insert a minimal record to understand required fields
    const { data, error } = await supabase
      .from('admin_users')
      .select('*')
      .limit(1)
    
    if (error) {
      console.log('Error querying admin_users:', error.message)
    } else {
      console.log('admin_users table structure:')
      if (data && data.length > 0) {
        console.log('Columns:', Object.keys(data[0]))
        console.log('Sample record:', data[0])
      } else {
        console.log('Table is empty')
      }
    }
    
    // Check if is_super_admin column exists
    console.log('\nChecking for is_super_admin column:')
    try {
      const { data: superAdminData, error: superAdminError } = await supabase
        .from('admin_users')
        .select('is_super_admin')
        .limit(1)
      
      if (superAdminError) {
        console.log('  ✗ is_super_admin column does not exist')
        console.log('    Error:', superAdminError.message)
      } else {
        console.log('  ✓ is_super_admin column exists')
      }
    } catch (e) {
      console.log('  ✗ is_super_admin column does not exist')
      console.log('    Error:', e.message)
    }
    
    console.log('\n=== STRUCTURE CHECK COMPLETE ===')
    
  } catch (error) {
    console.error('Unexpected error:', error)
  }
}

// Run the check
checkAdminUsersStructure()