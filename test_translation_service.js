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

async function testTranslationService() {
  try {
    console.log('Testing translation service...')
    
    // Test querying content directly
    const { data, error } = await supabase
      .from('content')
      .select('content_key, content_value')
      .eq('section_key', 'hero')
      .eq('language_code', 'sr')
      .eq('is_active', true)
    
    if (error) {
      console.error('Error querying content:', error)
      return
    }
    
    console.log('Hero section content in Serbian:')
    const contentMap = {}
    data.forEach(item => {
      contentMap[item.content_key] = item.content_value
      console.log(`  ${item.content_key}: ${item.content_value}`)
    })
    
    console.log('\nContent map:', contentMap)
    
  } catch (error) {
    console.error('Unexpected error:', error)
  }
}

// Run the test
testTranslationService()