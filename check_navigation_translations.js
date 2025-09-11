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

// Create a Supabase client with full access
const supabase = createClient(SUPABASE_URL, SERVICE_KEY, {
  auth: {
    persistSession: false,
    autoRefreshToken: false
  }
})

async function checkNavigationTranslations() {
  try {
    console.log('Checking navigation translations...')
    
    const { data, error } = await supabase
      .from('content')
      .select('language_code, content_key, content_value')
      .eq('section_key', 'navigation')
    
    if (error) {
      console.error('Error fetching navigation translations:', error)
      return
    }
    
    console.log('Navigation translations:')
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
      console.log('No navigation translations found')
    }
  } catch (error) {
    console.error('Error:', error)
  }
}

// Run the check
checkNavigationTranslations()