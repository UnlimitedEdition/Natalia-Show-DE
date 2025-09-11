import { createClient } from '@supabase/supabase-js'

// Supabase configuration
const SUPABASE_URL = 'https://ykixjxocfbcczvkjgwts.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlraXhqeG9jZmJjY3p2a2pnd3RzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcxNjA4MjYsImV4cCI6MjA3MjczNjgyNn0.oI57oJXfm7QEwfIbred6XeRiEcRJ1Xu9rO42Ta8hTSU'

// Create a Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

async function testPodcastDB() {
  try {
    console.log('Testing Podcast database connectivity...')
    
    // Test a simple query
    const { data, error } = await supabase
      .from('media')
      .select('id, section_key, media_type, social_url')
      .eq('section_key', 'podcast')
      .limit(3)
    
    if (error) {
      console.error('Database query error:', error)
      return
    }
    
    console.log('Database query successful!')
    console.log('Retrieved items:', data?.length || 0)
    console.log('Sample data:', data)
    
  } catch (error) {
    console.error('Error:', error)
  }
}

// Run the test
testPodcastDB()