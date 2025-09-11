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

async function checkContentStructure() {
  try {
    console.log('Checking content table structure...')
    
    // Get a few sample records
    const { data, error } = await supabase
      .from('content')
      .select('*')
      .limit(5)
    
    if (error) {
      console.error('Error fetching content:', error)
      return
    }
    
    console.log('Sample content records:')
    console.log(JSON.stringify(data, null, 2))
    
    // Check for contact-related content
    const { data: contactData, error: contactError } = await supabase
      .from('content')
      .select('*')
      .eq('section_key', 'contact')
      .limit(5)
    
    if (contactError) {
      console.error('Error fetching contact content:', contactError)
      return
    }
    
    console.log('\nContact-related content:')
    console.log(JSON.stringify(contactData, null, 2))
    
  } catch (error) {
    console.error('Error:', error)
  }
}

// Run the check
checkContentStructure()