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
const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlraXhqeG9jZmJjY3p2a2pnd3RzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NzE2MDgyNiwiZXhwIjoyMDcyNzM2ODI2fQ.yVm112ou5zHIZnvDq2kZY4t_BRTiP0wNWHTuLyjY3lw'

// Create a Supabase client with service role for full access
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)

async function testUpdateContactInfo() {
  try {
    console.log('Testing contact information update...')
    
    // Test updating contact email for Serbian language
    const { data: emailData, error: emailError } = await supabase
      .from('content')
      .upsert({
        section_key: 'contact',
        language_code: 'sr',
        content_key: 'contactEmail',
        content_value: 'test@nasemisije.com',
        is_active: true
      }, {
        onConflict: 'section_key,language_code,content_key'
      })
    
    if (emailError) {
      console.error('Error updating contact email:', emailError)
      return
    }
    
    console.log('Contact email updated successfully')
    console.log(JSON.stringify(emailData, null, 2))
    
    // Test updating contact phone for Serbian language
    const { data: phoneData, error: phoneError } = await supabase
      .from('content')
      .upsert({
        section_key: 'contact',
        language_code: 'sr',
        content_key: 'contactPhone',
        content_value: '+381 11 987 6543',
        is_active: true
      }, {
        onConflict: 'section_key,language_code,content_key'
      })
    
    if (phoneError) {
      console.error('Error updating contact phone:', phoneError)
      return
    }
    
    console.log('Contact phone updated successfully')
    console.log(JSON.stringify(phoneData, null, 2))
    
    // Test updating site name for Serbian language
    const { data: siteData, error: siteError } = await supabase
      .from('content')
      .upsert({
        section_key: 'hero',
        language_code: 'sr',
        content_key: 'title',
        content_value: 'Ново име сајта',
        is_active: true
      }, {
        onConflict: 'section_key,language_code,content_key'
      })
    
    if (siteError) {
      console.error('Error updating site name:', siteError)
      return
    }
    
    console.log('Site name updated successfully')
    console.log(JSON.stringify(siteData, null, 2))
    
    console.log('\nAll contact information updated successfully!')
    
  } catch (error) {
    console.error('Error:', error)
  }
}

// Run the test
testUpdateContactInfo()