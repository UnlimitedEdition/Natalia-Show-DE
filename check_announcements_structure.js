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