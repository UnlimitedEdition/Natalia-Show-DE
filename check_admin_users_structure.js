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

import { createClient } from '@supabase/supabase-js'

// Supabase configuration
const SUPABASE_URL = 'https://ykixjxocfbcczvkjgwts.supabase.co'

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