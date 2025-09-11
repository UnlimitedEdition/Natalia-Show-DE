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

async function checkContactInfo() {
  try {
    console.log('Checking contact information in database...')
    
    const { data, error } = await supabase
      .from('content')
      .select('content_key, content_value')
      .eq('section_key', 'contact')
    
    if (error) {
      console.error('Error fetching contact content:', error)
      return
    }
    
    console.log('Contact section content:')
    data.forEach(item => {
      console.log(`  ${item.content_key}: ${item.content_value}`)
    })
    
  } catch (error) {
    console.error('Error:', error)
  }
}

// Run the check
checkContactInfo()