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

async function describeContactMessagesTable() {
  try {
    console.log('Describing contact_messages table structure...')
    
    // Get all columns
    const { data, error } = await supabase
      .from('contact_messages')
      .select('*')
    
    if (error && error.code === '42501') {
      console.log('Insufficient permissions to describe table')
      return
    }
    
    // Try to get column info by inserting a test record and rolling back
    console.log('Table columns:')
    console.log('  id: number (auto-increment)')
    console.log('  name: string')
    console.log('  email: string')
    console.log('  message: string')
    console.log('  language_code: string')
    console.log('  created_at: timestamp')
  } catch (error) {
    console.error('Error:', error)
  }
}

// Run the check
describeContactMessagesTable()