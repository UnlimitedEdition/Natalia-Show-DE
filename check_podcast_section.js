import { createClient } from '@supabase/supabase-js'

// Supabase configuration
const SUPABASE_URL = 'https://ykixjxocfbcczvkjgwts.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlraXhqeG9jZmJjY3p2a2pnd3RzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcxNjA4MjYsImV4cCI6MjA3MjczNjgyNn0.oI57oJXfm7QEwfIbred6XeRiEcRJ1Xu9rO42Ta8hTSU'

// Create a Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

async function checkPodcastSection() {
  try {
    console.log('Checking if podcast section exists...')
    
    const { data, error } = await supabase
      .from('page_sections')
      .select('*')
      .eq('section_key', 'podcast')
    
    if (error) {
      console.error('Error fetching podcast section:', error)
      return
    }
    
    console.log('Podcast section data:')
    console.log(JSON.stringify(data, null, 2))
    
    if (data && data.length > 0) {
      console.log('Podcast section exists')
    } else {
      console.log('Podcast section does not exist')
    }
  } catch (error) {
    console.error('Error:', error)
  }
}

// Run the check
checkPodcastSection()