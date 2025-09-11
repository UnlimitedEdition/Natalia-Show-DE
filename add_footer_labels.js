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

// Footer label translations
const footerLabelTranslations = [
  // Serbian
  { section_key: 'footer', language_code: 'sr', content_key: 'emailLabel', content_value: 'Емаил' },
  { section_key: 'footer', language_code: 'sr', content_key: 'phoneLabel', content_value: 'Телефон' },
  
  // English
  { section_key: 'footer', language_code: 'en', content_key: 'emailLabel', content_value: 'Email' },
  { section_key: 'footer', language_code: 'en', content_key: 'phoneLabel', content_value: 'Phone' },
  
  // German
  { section_key: 'footer', language_code: 'de', content_key: 'emailLabel', content_value: 'E-Mail' },
  { section_key: 'footer', language_code: 'de', content_key: 'phoneLabel', content_value: 'Telefon' }
]

async function addFooterLabels() {
  try {
    console.log('Adding emailLabel and phoneLabel translations to footer section...')
    
    // Insert translations one by one to handle duplicates
    let inserted = 0
    let skipped = 0
    
    for (const translation of footerLabelTranslations) {
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
    
    console.log(`\nFooter label translations insertion completed!`)
    console.log(`  Inserted: ${inserted} records`)
    console.log(`  Skipped: ${skipped} records (already existed)`)
    
  } catch (error) {
    console.error('Error:', error)
  }
}

// Run the insertion
addFooterLabels()