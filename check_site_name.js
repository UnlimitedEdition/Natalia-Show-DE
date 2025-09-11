import { createClient } from '@supabase/supabase-js'

// Supabase configuration
const SUPABASE_URL = 'https://ykixjxocfbcczvkjgwts.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlraXhqeG9jZmJjY3p2a2pnd3RzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcxNjA4MjYsImV4cCI6MjA3MjczNjgyNn0.oI57oJXfm7QEwfIbred6XeRiEcRJ1Xu9rO42Ta8hTSU'

// Create a Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

async function checkSiteName() {
  try {
    console.log('Checking how site name is stored...')
    
    // Check for hero section title
    const { data: heroData, error: heroError } = await supabase
      .from('content')
      .select('*')
      .eq('section_key', 'hero')
      .eq('content_key', 'title')
    
    if (heroError) {
      console.error('Error fetching hero title:', heroError)
      return
    }
    
    console.log('Hero section title records:')
    console.log(JSON.stringify(heroData, null, 2))
    
  } catch (error) {
    console.error('Error:', error)
  }
}

// Run the check
checkSiteName()