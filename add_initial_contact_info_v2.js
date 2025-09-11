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

async function addInitialContactInfo() {
  try {
    console.log('Adding initial contact information...')
    
    // First, check if the content already exists
    const { data: existingContactEmail, error: emailError } = await supabase
      .from('content')
      .select('id')
      .eq('section_key', 'contact')
      .eq('language_code', 'sr')
      .eq('content_key', 'contactEmail')
      .single()

    if (!existingContactEmail && !emailError) {
      // Insert contact email for Serbian
      const { error } = await supabase
        .from('content')
        .insert({
          section_key: 'contact',
          language_code: 'sr',
          content_key: 'contactEmail',
          content_value: 'info@nasemisije.com',
          is_active: true
        })
      
      if (error) {
        console.error('Error inserting contact email for sr:', error)
      } else {
        console.log('✓ Added contact email for sr: info@nasemisije.com')
      }
    } else {
      console.log('Contact email for sr already exists')
    }
    
    // Check if contact phone already exists
    const { data: existingContactPhone, error: phoneError } = await supabase
      .from('content')
      .select('id')
      .eq('section_key', 'contact')
      .eq('language_code', 'sr')
      .eq('content_key', 'contactPhone')
      .single()

    if (!existingContactPhone && !phoneError) {
      // Insert contact phone for Serbian
      const { error } = await supabase
        .from('content')
        .insert({
          section_key: 'contact',
          language_code: 'sr',
          content_key: 'contactPhone',
          content_value: '+381 11 123 4567',
          is_active: true
        })
      
      if (error) {
        console.error('Error inserting contact phone for sr:', error)
      } else {
        console.log('✓ Added contact phone for sr: +381 11 123 4567')
      }
    } else {
      console.log('Contact phone for sr already exists')
    }
    
    console.log('\nInitial contact information added successfully!')
    
  } catch (error) {
    console.error('Error:', error)
  }
}

// Run the script
addInitialContactInfo()