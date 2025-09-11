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

async function checkContactMessagesStructure() {
  try {
    console.log('Checking contact_messages table structure...')
    
    // Try to get table info
    const { data, error } = await supabase
      .from('contact_messages')
      .select('*')
      .limit(1)
    
    if (error) {
      console.log('Error accessing table:', error.message)
      return
    }
    
    if (data && data.length > 0) {
      console.log('Sample record structure:')
      Object.keys(data[0]).forEach(key => {
        console.log(`  ${key}: ${typeof data[0][key]}`)
      })
    } else {
      console.log('Table is empty or no records found')
    }
  } catch (error) {
    console.error('Error:', error)
  }
}

// Run the check
checkContactMessagesStructure()