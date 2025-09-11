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

async function checkContactMessagesTable() {
  try {
    console.log('Checking if contact_messages table exists...')
    
    // Try to query the table
    const { data, error } = await supabase
      .from('contact_messages')
      .select('*')
      .limit(1)
    
    if (error) {
      console.log('Contact messages table does not exist or is not accessible')
      console.log('Error:', error.message)
    } else {
      console.log('Contact messages table exists and is accessible')
    }
  } catch (error) {
    console.error('Error:', error)
  }
}

// Run the check
checkContactMessagesTable()