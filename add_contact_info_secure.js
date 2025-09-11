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

// Contact information to be added
const contactInfo = [
  // Serbian language
  { section_key: 'contact', language_code: 'sr', content_key: 'contactEmail', content_value: 'info@nasemisije.com' },
  { section_key: 'contact', language_code: 'sr', content_key: 'contactPhone', content_value: '+381 11 123 4567' },
  { section_key: 'hero', language_code: 'sr', content_key: 'title', content_value: 'Добродошли у Наш Емисије' },
  
  // English language
  { section_key: 'contact', language_code: 'en', content_key: 'contactEmail', content_value: 'info@nasemisije.com' },
  { section_key: 'contact', language_code: 'en', content_key: 'contactPhone', content_value: '+381 11 123 4567' },
  { section_key: 'hero', language_code: 'en', content_key: 'title', content_value: 'Welcome to Our Shows' },
  
  // German language
  { section_key: 'contact', language_code: 'de', content_key: 'contactEmail', content_value: 'info@nasemisije.com' },
  { section_key: 'contact', language_code: 'de', content_key: 'contactPhone', content_value: '+381 11 123 4567' },
  { section_key: 'hero', language_code: 'de', content_key: 'title', content_value: 'Willkommen bei unseren Sendungen' }
]

async function addContactInfo() {
  try {
    console.log('Adding contact information...')
    
    // Insert contact information
    const { data, error } = await supabase
      .from('content')
      .upsert(contactInfo, {
        onConflict: 'section_key,language_code,content_key'
      })
    
    if (error) throw error
    
    console.log('Contact information added successfully!')
    console.log('Added records:', data)
    
  } catch (error) {
    console.error('Error adding contact information:', error)
  }
}

// Run the function
addContactInfo()