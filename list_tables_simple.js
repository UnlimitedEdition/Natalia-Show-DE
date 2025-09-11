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

async function listTables() {
  try {
    console.log('=== LISTING AVAILABLE TABLES ===\n')
    
    // List of tables we know should exist
    const tables = [
      'page_sections',
      'media',
      'content',
      'languages',
      'advertisements',
      'announcements',
      'admin_users',
      'posts',
      'contact_links'
    ]
    
    console.log('Checking table existence:')
    for (const table of tables) {
      try {
        const { data, error } = await supabase
          .from(table)
          .select('*')
          .limit(1)
        
        if (error) {
          console.log(`  ✗ ${table}: ${error.message}`)
        } else {
          console.log(`  ✓ ${table}: Accessible`)
        }
      } catch (e) {
        console.log(`  ✗ ${table}: Error - ${e.message}`)
      }
    }
    
    console.log('\n=== LISTING COMPLETE ===')
    
  } catch (error) {
    console.error('Unexpected error:', error)
  }
}

// Run the listing
listTables()