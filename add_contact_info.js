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

// Contact information translations
const contactInfoTranslations = [
  // Serbian
  { section_key: 'contact', language_code: 'sr', content_key: 'contactEmail', content_value: 'info@nasemisije.com' },
  { section_key: 'contact', language_code: 'sr', content_key: 'contactPhone', content_value: '+381 11 123 4567' },
  
  // English
  { section_key: 'contact', language_code: 'en', content_key: 'contactEmail', content_value: 'info@nasemisije.com' },
  { section_key: 'contact', language_code: 'en', content_key: 'contactPhone', content_value: '+381 11 123 4567' },
  
  // German
  { section_key: 'contact', language_code: 'de', content_key: 'contactEmail', content_value: 'info@nasemisije.com' },
  { section_key: 'contact', language_code: 'de', content_key: 'contactPhone', content_value: '+381 11 123 4567' }
]

async function addContactInfo() {
  try {
    console.log('Adding contact information to database...')
    
    // Insert translations one by one to handle duplicates
    let inserted = 0
    let skipped = 0
    
    for (const translation of contactInfoTranslations) {
      // Check if translation already exists
      const { data: existing, error: checkError } = await supabase
        .from('content')
        .select('id')
        .eq('section_key', translation.section_key)
        .eq('language_code', translation.language_code)
        .eq('content_key', translation.content_key)
        .maybeSingle()
      
      if (checkError) {
        console.error(`Error checking existing record:`, checkError)
        continue
      }
      
      if (!existing) {
        // Insert new translation
        const { error: insertError } = await supabase
          .from('content')
          .insert(translation)
        
        if (insertError) {
          console.error(`Error inserting [${translation.language_code}] ${translation.section_key}.${translation.content_key}:`, insertError)
        } else {
          inserted++
          console.log(`  ✓ Inserted: [${translation.language_code}] ${translation.section_key}.${translation.content_key}`)
        }
      } else {
        skipped++
        console.log(`  ○ Skipped (exists): [${translation.language_code}] ${translation.section_key}.${translation.content_key}`)
      }
    }
    
    console.log(`\nContact information insertion completed!`)
    console.log(`  Inserted: ${inserted} records`)
    console.log(`  Skipped: ${skipped} records (already existed)`)
    
  } catch (error) {
    console.error('Error:', error)
  }
}

// Run the insertion
addContactInfo()