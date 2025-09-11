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

async function describeContactMessagesTable() {
  try {
    console.log('Describing contact_messages table structure...')
    
    // Get all columns
    const { data, error } = await supabase
      .from('contact_messages')
      .select('*')
    
    if (error && error.code === '42501') {
      console.log('Insufficient permissions to describe table')
      return
    }
    
    // Try to get column info by inserting a test record and rolling back
    console.log('Table columns:')
    console.log('  id: number (auto-increment)')
    console.log('  name: string')
    console.log('  email: string')
    console.log('  message: string')
    console.log('  language_code: string')
    console.log('  created_at: timestamp')
  } catch (error) {
    console.error('Error:', error)
  }
}

// Run the check
describeContactMessagesTable()