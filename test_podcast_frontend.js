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

async function testPodcastFrontend() {
  try {
    console.log('Testing podcast section frontend display...')
    
    // Check if podcast section exists in page_sections
    const { data: sectionData, error: sectionError } = await supabase
      .from('page_sections')
      .select('*')
      .eq('section_key', 'podcast')
    
    if (sectionError) {
      console.error('Error fetching podcast section:', sectionError)
      return
    }
    
    console.log('Podcast section data:')
    console.log(JSON.stringify(sectionData, null, 2))
    
    if (!sectionData || sectionData.length === 0) {
      console.log('Podcast section does not exist')
      return
    }
    
    // Check podcast media items
    const { data: mediaData, error: mediaError } = await supabase
      .from('media')
      .select('*')
      .eq('section_key', 'podcast')
      .eq('is_active', true)
      .limit(6)
    
    if (mediaError) {
      console.error('Error fetching podcast media:', mediaError)
      return
    }
    
    console.log('\nPodcast media data:')
    console.log(JSON.stringify(mediaData, null, 2))
    
    // Check podcast content translations
    const languages = ['sr', 'en', 'de']
    for (const lang of languages) {
      const { data: contentData, error: contentError } = await supabase
        .from('content')
        .select('*')
        .eq('section_key', 'podcast')
        .eq('language_code', lang)
      
      if (contentError) {
        console.error(`Error fetching podcast content for ${lang}:`, contentError)
        return
      }
      
      console.log(`\nPodcast content for ${lang}:`)
      console.log(JSON.stringify(contentData, null, 2))
    }
    
    console.log('\nPodcast section is properly configured for frontend display')
    
  } catch (error) {
    console.error('Error:', error)
  }
}

// Run the test
testPodcastFrontend()