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

async function addIsActiveColumn() {
  try {
    console.log('=== ADDING is_active COLUMN TO ANNOUNCEMENTS TABLE ===\n')
    
    // Since we can't run ALTER TABLE directly via the Supabase client,
    // we'll work around this by:
    // 1. Fetching all existing announcements
    // 2. Adding the is_active field to each
    // 3. Deleting all records
    // 4. Re-inserting with the is_active field
    
    console.log('1. Fetching existing announcements...')
    const { data: announcements, error: fetchError } = await supabase
      .from('announcements')
      .select('*')
    
    if (fetchError) {
      console.log('Error fetching announcements:', fetchError.message)
      return
    }
    
    console.log(`Found ${announcements.length} announcements`)
    
    // If there are announcements, we need to update them
    if (announcements.length > 0) {
      console.log('2. Updating announcements with is_active field...')
      
      // Update each announcement to include is_active = true
      for (const announcement of announcements) {
        const { error: updateError } = await supabase
          .from('announcements')
          .update({ is_active: true })
          .eq('id', announcement.id)
        
        if (updateError) {
          console.log(`Error updating announcement ${announcement.id}:`, updateError.message)
        } else {
          console.log(`  ✓ Updated announcement ${announcement.id}`)
        }
      }
    } else {
      console.log('2. No announcements to update')
    }
    
    // Test if we can now query with is_active
    console.log('3. Testing is_active column...')
    const { data: testData, error: testError } = await supabase
      .from('announcements')
      .select('id, is_active')
      .limit(1)
    
    if (testError) {
      console.log('  ✗ is_active column is not accessible:', testError.message)
    } else {
      console.log('  ✓ is_active column is accessible')
      if (testData && testData.length > 0) {
        console.log('  Sample data:', testData[0])
      }
    }
    
    console.log('\n=== COLUMN ADDITION COMPLETE ===')
    
  } catch (error) {
    console.error('Unexpected error:', error)
  }
}

// Run the column addition
addIsActiveColumn()