import { createClient } from '@supabase/supabase-js'

// Supabase configuration
const SUPABASE_URL = 'https://ykixjxocfbcczvkjgwts.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlraXhqeG9jZmJjY3p2a2pnd3RzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcxNjA4MjYsImV4cCI6MjA3MjczNjgyNn0.oI57oJXfm7QEwfIbred6XeRiEcRJ1Xu9rO42Ta8hTSU'

// Create a Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

async function testFetchContactInfo() {
  try {
    console.log('Testing fetching contact information...')
    
    const currentLanguage = 'sr'; // Test with Serbian language
    
    // Fetch contact email and phone
    const { data: contactData, error: contactError } = await supabase
      .from('content')
      .select('content_key, content_value')
      .eq('section_key', 'contact')
      .eq('language_code', currentLanguage)
      .in('content_key', ['contactEmail', 'contactPhone'])

    if (contactError) throw contactError

    console.log('Contact data fetched:')
    console.log(JSON.stringify(contactData, null, 2))

    // Fetch site name
    const { data: siteData, error: siteError } = await supabase
      .from('content')
      .select('content_value')
      .eq('section_key', 'hero')
      .eq('language_code', currentLanguage)
      .eq('content_key', 'title')
      .maybeSingle()

    if (siteError && siteError.code !== 'PGRST116') throw siteError

    console.log('Site data fetched:')
    console.log(JSON.stringify(siteData, null, 2))

    // Process contact data
    const contactInfoData = {}
    contactData?.forEach(item => {
      contactInfoData[item.content_key] = item.content_value
    })

    console.log('Processed contact info:')
    console.log(JSON.stringify(contactInfoData, null, 2))

  } catch (error) {
    console.error('Error:', error)
  }
}

// Run the test
testFetchContactInfo()