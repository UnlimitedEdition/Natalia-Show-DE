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

async function checkAnnouncementsTable() {
  try {
    console.log('=== CHECKING ANNOUNCEMENTS TABLE ===\n')
    
    // Try to get table structure by selecting all columns from a sample record
    const { data, error } = await supabase
      .from('announcements')
      .select('*')
      .limit(1)
    
    if (error) {
      console.log('Error querying announcements table:', error.message)
      return
    }
    
    console.log('Announcements table structure:')
    if (data && data.length > 0) {
      console.log('Columns:', Object.keys(data[0]))
      console.log('Sample record:', data[0])
    } else {
      console.log('Table is empty')
      
      // Try to get column info by inserting a test record
      const testRecord = {
        title: 'Test Announcement',
        content: 'Test content'
      }
      
      const { data: insertData, error: insertError } = await supabase
        .from('announcements')
        .insert([testRecord])
        .select()
      
      if (insertError) {
        console.log('Error inserting test record:', insertError.message)
      } else {
        console.log('Successfully inserted test record')
        console.log('Columns:', Object.keys(insertData[0]))
        console.log('Sample record:', insertData[0])
        
        // Clean up test record
        await supabase
          .from('announcements')
          .delete()
          .eq('id', insertData[0].id)
      }
    }
    
    console.log('\n=== ANNOUNCEMENTS TABLE CHECK COMPLETE ===')
    
  } catch (error) {
    console.error('Unexpected error:', error)
  }
}

// Run the check
checkAnnouncementsTable()