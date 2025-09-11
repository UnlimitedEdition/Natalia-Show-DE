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
// Using the Service Key which has full access to the database

// Create a Supabase client with full access
const supabase = createClient(SUPABASE_URL, SERVICE_KEY, {
  auth: {
    persistSession: false,
    autoRefreshToken: false
  }
})

async function testDirectConnection() {
  try {
    console.log('Testing direct database connection with Service Key...')
    
    // Test querying the media table
    const { data: mediaData, error: mediaError } = await supabase
      .from('media')
      .select('*')
      .limit(5)
    
    if (mediaError) {
      console.error('Error querying media table:', mediaError)
    } else {
      console.log('Successfully queried media table:')
      console.log('Found', mediaData.length, 'records')
      if (mediaData.length > 0) {
        console.log('Sample record:', mediaData[0])
      }
    }
    
    // Test querying the content table
    const { data: contentData, error: contentError } = await supabase
      .from('content')
      .select('*')
      .limit(5)
    
    if (contentError) {
      console.error('Error querying content table:', contentError)
    } else {
      console.log('\nSuccessfully queried content table:')
      console.log('Found', contentData.length, 'records')
      if (contentData.length > 0) {
        console.log('Sample record:', contentData[0])
      }
    }
    
    // Test querying the page_sections table
    const { data: sectionsData, error: sectionsError } = await supabase
      .from('page_sections')
      .select('*')
    
    if (sectionsError) {
      console.error('Error querying page_sections table:', sectionsError)
    } else {
      console.log('\nSuccessfully queried page_sections table:')
      console.log('Found', sectionsData.length, 'records')
      sectionsData.forEach(section => {
        console.log('-', section.section_key, ':', section.section_name)
      })
    }
    
    console.log('\nDirect database connection test completed.')
  } catch (error) {
    console.error('Unexpected error:', error)
  }
}

// Run the test
testDirectConnection()