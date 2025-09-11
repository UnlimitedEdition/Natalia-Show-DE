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