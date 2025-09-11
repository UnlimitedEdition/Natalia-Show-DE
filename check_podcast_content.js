import { createClient } from '@supabase/supabase-js'

// Supabase configuration
const SUPABASE_URL = 'https://ykixjxocfbcczvkjgwts.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlraXhqeG9jZmJjY3p2a2pnd3RzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcxNjA4MjYsImV4cCI6MjA3MjczNjgyNn0.oI57oJXfm7QEwfIbred6XeRiEcRJ1Xu9rO42Ta8hTSU'

// Create a Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

async function checkPodcastContent() {
  try {
    console.log('Checking podcast content...')
    
    const { data, error } = await supabase
      .from('content')
      .select('*')
      .eq('section_key', 'podcast')
    
    if (error) {
      console.error('Error fetching podcast content:', error)
      return
    }
    
    console.log('Podcast content data:')
    console.log(JSON.stringify(data, null, 2))
    
    // Group by language
    const grouped = {}
    if (data) {
      data.forEach(item => {
        if (!grouped[item.language_code]) {
          grouped[item.language_code] = {}
        }
        grouped[item.language_code][item.content_key] = item.content_value
      })
    }
    
    console.log('\nGrouped by language:')
    console.log(JSON.stringify(grouped, null, 2))
  } catch (error) {
    console.error('Error:', error)
  }
}

// Run the check
checkPodcastContent()