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

async function checkFooterTranslations() {
  try {
    console.log('Checking footer translations in database...')
    
    const { data, error } = await supabase
      .from('content')
      .select('language_code, content_key, content_value')
      .eq('section_key', 'footer')
    
    if (error) {
      console.error('Error fetching footer translations:', error)
      return
    }
    
    console.log('Footer translations in database:')
    data.forEach(item => {
      console.log(`  [${item.language_code}] ${item.content_key}: ${item.content_value}`)
    })
    
  } catch (error) {
    console.error('Error:', error)
  }
}

// Run the check
checkFooterTranslations()