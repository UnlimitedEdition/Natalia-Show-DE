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

async function fixAnnouncementsTable() {
  try {
    console.log('=== CHECKING AND FIXING ANNOUNCEMENTS TABLE ===\n')
    
    // Check if is_active column exists by trying to query it
    console.log('1. Checking if is_active column exists...')
    try {
      const { data, error } = await supabase
        .from('announcements')
        .select('is_active')
        .limit(1)
      
      if (error) {
        console.log('  ✗ is_active column does not exist')
        console.log('    Error:', error.message)
        
        // Since we can't add columns directly via the client,
        // we'll work with what we have and update the application code
        console.log('  → Will use is_published column instead')
      } else {
        console.log('  ✓ is_active column exists')
      }
    } catch (e) {
      console.log('  ✗ is_active column does not exist')
      console.log('    Error:', e.message)
      console.log('  → Will use is_published column instead')
    }
    
    // Check the structure of the announcements table
    console.log('\n2. Checking announcements table structure...')
    const { data: sampleData, error: sampleError } = await supabase
      .from('announcements')
      .select('*')
      .limit(1)
    
    if (sampleError) {
      console.log('  Error querying announcements table:', sampleError.message)
    } else {
      if (sampleData && sampleData.length > 0) {
        console.log('  ✓ Announcements table accessible')
        console.log('  Columns:', Object.keys(sampleData[0]))
      } else {
        console.log('  ✓ Announcements table accessible (empty)')
        console.log('  Table is empty')
      }
    }
    
    console.log('\n=== FIX ATTEMPT COMPLETE ===')
    console.log('\nRecommendation:')
    console.log('If you see "column announcements.is_active does not exist" errors,')
    console.log('you need to run the SQL script add_is_active_to_announcements.sql')
    console.log('directly in the Supabase dashboard.')
    
  } catch (error) {
    console.error('Unexpected error:', error)
  }
}

// Run the fix attempt
fixAnnouncementsTable()