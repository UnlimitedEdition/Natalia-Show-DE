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

async function checkFooterLabels() {
  try {
    console.log('Checking emailLabel and phoneLabel translations in footer section...')
    
    const { data, error } = await supabase
      .from('content')
      .select('language_code, content_key, content_value')
      .eq('section_key', 'footer')
      .in('content_key', ['emailLabel', 'phoneLabel'])
    
    if (error) {
      console.error('Error fetching footer label translations:', error)
      return
    }
    
    console.log('Email and phone label translations in footer section:')
    if (data.length === 0) {
      console.log('  No emailLabel or phoneLabel translations found in footer section')
    } else {
      data.forEach(item => {
        console.log(`  [${item.language_code}] ${item.content_key}: ${item.content_value}`)
      })
    }
    
  } catch (error) {
    console.error('Error:', error)
  }
}

// Run the check
checkFooterLabels()