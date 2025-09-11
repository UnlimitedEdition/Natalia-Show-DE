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

// Kitchen quote translations
const kitchenQuoteTranslations = [
  // Serbian
  { section_key: 'kitchen', language_code: 'sr', content_key: 'quote', content_value: '"Храна спаја људе, а приче чине јело незаборавним."' },
  
  // English
  { section_key: 'kitchen', language_code: 'en', content_key: 'quote', content_value: '"Food brings people together, and stories make the meal memorable."' },
  
  // German
  { section_key: 'kitchen', language_code: 'de', content_key: 'quote', content_value: '"Essen verbindet Menschen, und Geschichten machen das Essen unvergesslich."' }
]

async function addKitchenQuoteTranslations() {
  try {
    console.log('Adding kitchen quote translations to database...')
    
    // Insert translations one by one to handle duplicates
    let inserted = 0
    let skipped = 0
    
    for (const translation of kitchenQuoteTranslations) {
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
    
    console.log(`\nKitchen quote translations insertion completed!`)
    console.log(`  Inserted: ${inserted} records`)
    console.log(`  Skipped: ${skipped} records (already existed)`)
    
  } catch (error) {
    console.error('Error:', error)
  }
}

// Run the translation insertion
addKitchenQuoteTranslations()