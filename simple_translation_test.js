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

async function testTranslationLoading() {
  try {
    console.log('Testing translation loading for Hero section...')
    
    // Test loading Serbian translations
    const { data: srData, error: srError } = await supabase
      .from('content')
      .select('content_key, content_value')
      .eq('section_key', 'hero')
      .eq('language_code', 'sr')
      .eq('is_active', true)
    
    if (srError) {
      console.error('Error loading Serbian translations:', srError)
    } else {
      console.log('Serbian translations:', srData)
    }
    
    // Test loading English translations
    const { data: enData, error: enError } = await supabase
      .from('content')
      .select('content_key, content_value')
      .eq('section_key', 'hero')
      .eq('language_code', 'en')
      .eq('is_active', true)
    
    if (enError) {
      console.error('Error loading English translations:', enError)
    } else {
      console.log('English translations:', enData)
    }
    
    // Test loading German translations
    const { data: deData, error: deError } = await supabase
      .from('content')
      .select('content_key, content_value')
      .eq('section_key', 'hero')
      .eq('language_code', 'de')
      .eq('is_active', true)
    
    if (deError) {
      console.error('Error loading German translations:', deError)
    } else {
      console.log('German translations:', deData)
    }
    
    console.log('Translation loading test completed!')
    
  } catch (error) {
    console.error('Unexpected error:', error)
  }
}

// Run the test
testTranslationLoading()