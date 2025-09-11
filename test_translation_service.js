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