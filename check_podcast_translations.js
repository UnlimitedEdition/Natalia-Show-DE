import { createClient } from '@supabase/supabase-js'

// Supabase configuration
const SUPABASE_URL = 'https://ykixjxocfbcczvkjgwts.supabase.co'
const SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlraXhqeG9jZmJjY3p2a2pnd3RzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NzE2MDgyNiwiZXhwIjoyMDcyNzM2ODI2fQ.yVm112ou5zHIZnvDq2kZY4t_BRTiP0wNWHTuLyjY3lw'

// Create a Supabase client with full access
const supabase = createClient(SUPABASE_URL, SERVICE_KEY, {
  auth: {
    persistSession: false,
    autoRefreshToken: false
  }
})

async function checkPodcastTranslations() {
  try {
    console.log('Checking podcast translations...')
    
    const { data, error } = await supabase
      .from('content')
      .select('language_code, content_key, content_value')
      .eq('section_key', 'podcast')
    
    if (error) {
      console.error('Error fetching podcast translations:', error)
      return
    }
    
    console.log('Podcast translations:')
    if (data && data.length > 0) {
      const grouped = {}
      data.forEach(item => {
        if (!grouped[item.language_code]) {
          grouped[item.language_code] = {}
        }
        grouped[item.language_code][item.content_key] = item.content_value
      })
      console.log(JSON.stringify(grouped, null, 2))
    } else {
      console.log('No podcast translations found')
    }
  } catch (error) {
    console.error('Error:', error)
  }
}

// Run the check
checkPodcastTranslations()