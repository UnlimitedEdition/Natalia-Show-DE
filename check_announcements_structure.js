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

async function checkAnnouncementsStructure() {
  try {
    console.log('=== CHECKING ANNOUNCEMENTS TABLE STRUCTURE ===\n')
    
    // Try to insert a minimal record to understand required fields
    const minimalRecord = {
      title: 'Test',
      content: 'Test',
      language_code: 'en' // This seems to be required
    }
    
    const { data, error } = await supabase
      .from('announcements')
      .insert([minimalRecord])
      .select()
    
    if (error) {
      console.log('Error with minimal insert:', error.message)
      console.log('Error details:', error)
    } else {
      console.log('Successfully inserted minimal record')
      console.log('Record structure:', Object.keys(data[0]))
      
      // Clean up
      await supabase
        .from('announcements')
        .delete()
        .eq('id', data[0].id)
    }
    
    console.log('\n=== STRUCTURE CHECK COMPLETE ===')
    
  } catch (error) {
    console.error('Unexpected error:', error)
  }
}

// Run the check
checkAnnouncementsStructure()