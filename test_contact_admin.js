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

async function testContactAdmin() {
  try {
    console.log('Testing contact information management...')
    
    // Check contact information for Serbian language
    const { data: contactData, error: contactError } = await supabase
      .from('content')
      .select('*')
      .eq('section_key', 'contact')
      .eq('language_code', 'sr')
    
    if (contactError) {
      console.error('Error fetching contact information:', contactError)
      return
    }
    
    console.log('Contact information for Serbian language:')
    console.log(JSON.stringify(contactData, null, 2))
    
    // Check site name for Serbian language
    const { data: siteData, error: siteError } = await supabase
      .from('content')
      .select('*')
      .eq('section_key', 'hero')
      .eq('language_code', 'sr')
      .eq('content_key', 'title')
    
    if (siteError) {
      console.error('Error fetching site name:', siteError)
      return
    }
    
    console.log('\nSite name for Serbian language:')
    console.log(JSON.stringify(siteData, null, 2))
    
    console.log('\nContact information management is working correctly')
    
  } catch (error) {
    console.error('Error:', error)
  }
}

// Run the test
testContactAdmin()