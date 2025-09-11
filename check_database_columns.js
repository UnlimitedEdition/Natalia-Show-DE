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

async function checkDatabaseColumns() {
  try {
    console.log('=== CHECKING DATABASE COLUMNS ===\n')
    
    // Check content table structure
    console.log('1. CONTENT TABLE:')
    const { data: contentData, error: contentError } = await supabase
      .from('content')
      .select('*')
      .limit(1)
    
    if (contentError) {
      console.log('  Error querying content table:', contentError.message)
    } else {
      console.log('  ✓ Content table accessible')
      if (contentData && contentData.length > 0) {
        console.log('  Sample record keys:', Object.keys(contentData[0]))
      }
    }
    
    // Check if is_active column exists by trying to query it
    console.log('\n2. CHECKING is_active COLUMN:')
    try {
      const { data: isActiveData, error: isActiveError } = await supabase
        .from('content')
        .select('is_active')
        .limit(1)
      
      if (isActiveError) {
        console.log('  ✗ is_active column does not exist')
        console.log('    Error:', isActiveError.message)
      } else {
        console.log('  ✓ is_active column exists')
      }
    } catch (e) {
      console.log('  ✗ is_active column does not exist')
      console.log('    Error:', e.message)
    }
    
    // Check announcements table structure
    console.log('\n3. ANNOUNCEMENTS TABLE:')
    try {
      const { data: announcementsData, error: announcementsError } = await supabase
        .from('announcements')
        .select('*')
        .limit(1)
      
      if (announcementsError) {
        console.log('  Error querying announcements table:', announcementsError.message)
      } else {
        console.log('  ✓ Announcements table accessible')
        if (announcementsData && announcementsData.length > 0) {
          console.log('  Sample record keys:', Object.keys(announcementsData[0]))
        }
      }
    } catch (e) {
      console.log('  Announcements table does not exist or is not accessible')
    }
    
    // Check if announcements table has is_active column
    console.log('\n4. CHECKING announcements is_active COLUMN:')
    try {
      const { data: announcementsActiveData, error: announcementsActiveError } = await supabase
        .from('announcements')
        .select('is_active')
        .limit(1)
      
      if (announcementsActiveError) {
        console.log('  ✗ announcements is_active column does not exist')
        console.log('    Error:', announcementsActiveError.message)
      } else {
        console.log('  ✓ announcements is_active column exists')
      }
    } catch (e) {
      console.log('  ✗ announcements is_active column does not exist')
      console.log('    Error:', e.message)
    }
    
    console.log('\n=== COLUMN CHECK COMPLETE ===')
    
  } catch (error) {
    console.error('Unexpected error:', error)
  }
}

// Run the column check
checkDatabaseColumns()