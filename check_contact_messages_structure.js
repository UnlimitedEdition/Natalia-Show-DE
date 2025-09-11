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

async function checkContactMessagesStructure() {
  try {
    console.log('Checking contact_messages table structure...')
    
    // Try to get table info
    const { data, error } = await supabase
      .from('contact_messages')
      .select('*')
      .limit(1)
    
    if (error) {
      console.log('Error accessing table:', error.message)
      return
    }
    
    if (data && data.length > 0) {
      console.log('Sample record structure:')
      Object.keys(data[0]).forEach(key => {
        console.log(`  ${key}: ${typeof data[0][key]}`)
      })
    } else {
      console.log('Table is empty or no records found')
    }
  } catch (error) {
    console.error('Error:', error)
  }
}

// Run the check
checkContactMessagesStructure()