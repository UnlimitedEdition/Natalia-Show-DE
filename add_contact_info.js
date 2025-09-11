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