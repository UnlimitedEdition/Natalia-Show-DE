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
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlraXhqeG9jZmJjY3p2a2pnd3RzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcxNjA4MjYsImV4cCI6MjA3MjczNjgyNn0.oI57oJXfm7QEwfIbred6XeRiEcRJ1Xu9rO42Ta8hTSU'

// Create a Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

async function checkContactFields() {
  try {
    console.log('Checking for contactEmail and contactPhone fields...')
    
    // Check for contactEmail
    const { data: emailData, error: emailError } = await supabase
      .from('content')
      .select('*')
      .eq('section_key', 'contact')
      .eq('content_key', 'contactEmail')
    
    if (emailError) {
      console.error('Error fetching contactEmail:', emailError)
      return
    }
    
    console.log('contactEmail records:')
    console.log(JSON.stringify(emailData, null, 2))
    
    // Check for contactPhone
    const { data: phoneData, error: phoneError } = await supabase
      .from('content')
      .select('*')
      .eq('section_key', 'contact')
      .eq('content_key', 'contactPhone')
    
    if (phoneError) {
      console.error('Error fetching contactPhone:', phoneError)
      return
    }
    
    console.log('\ncontactPhone records:')
    console.log(JSON.stringify(phoneData, null, 2))
    
  } catch (error) {
    console.error('Error:', error)
  }
}

// Run the check
checkContactFields()