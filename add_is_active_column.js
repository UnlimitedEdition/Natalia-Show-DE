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