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

// Header navigation translations
const headerTranslations = [
  // Serbian
  { section_key: 'navigation', language_code: 'sr', content_key: 'home', content_value: 'Početna' },
  { section_key: 'navigation', language_code: 'sr', content_key: 'podcast', content_value: 'Podcast' },
  { section_key: 'navigation', language_code: 'sr', content_key: 'cultural', content_value: 'Romska Veselja' },
  { section_key: 'navigation', language_code: 'sr', content_key: 'kitchen', content_value: 'Kuhinja sa Gostima' },
  { section_key: 'navigation', language_code: 'sr', content_key: 'diaspora', content_value: 'Dijaspora' },
  { section_key: 'navigation', language_code: 'sr', content_key: 'contact', content_value: 'Kontakt' },
  
  // English
  { section_key: 'navigation', language_code: 'en', content_key: 'home', content_value: 'Home' },
  { section_key: 'navigation', language_code: 'en', content_key: 'podcast', content_value: 'Podcast' },
  { section_key: 'navigation', language_code: 'en', content_key: 'cultural', content_value: 'Romani Celebrations' },
  { section_key: 'navigation', language_code: 'en', content_key: 'kitchen', content_value: 'Kitchen with Guests' },
  { section_key: 'navigation', language_code: 'en', content_key: 'diaspora', content_value: 'Diaspora' },
  { section_key: 'navigation', language_code: 'en', content_key: 'contact', content_value: 'Contact' },
  
  // German
  { section_key: 'navigation', language_code: 'de', content_key: 'home', content_value: 'Startseite' },
  { section_key: 'navigation', language_code: 'de', content_key: 'podcast', content_value: 'Podcast' },
  { section_key: 'navigation', language_code: 'de', content_key: 'cultural', content_value: 'Roma Feste' },
  { section_key: 'navigation', language_code: 'de', content_key: 'kitchen', content_value: 'Küche mit Gästen' },
  { section_key: 'navigation', language_code: 'de', content_key: 'diaspora', content_value: 'Diaspora' },
  { section_key: 'navigation', language_code: 'de', content_key: 'contact', content_value: 'Kontakt' }
]

// Footer translations
const footerTranslations = [
  // Serbian
  { section_key: 'footer', language_code: 'sr', content_key: 'sectionsTitle', content_value: 'Sekcije' },
  { section_key: 'footer', language_code: 'sr', content_key: 'podcastSection', content_value: 'Podcast' },
  { section_key: 'footer', language_code: 'sr', content_key: 'culturalSection', content_value: 'Romska Veselja' },
  { section_key: 'footer', language_code: 'sr', content_key: 'kitchenSection', content_value: 'Kuhinja sa Gostima' },
  { section_key: 'footer', language_code: 'sr', content_key: 'diasporaSection', content_value: 'Dijaspora' },
  { section_key: 'footer', language_code: 'sr', content_key: 'contactSection', content_value: 'Kontakt' },
  { section_key: 'footer', language_code: 'sr', content_key: 'copyright', content_value: '© {year} Podcast Studio. Sva prava zadržana.' },
  { section_key: 'footer', language_code: 'sr', content_key: 'description', content_value: 'Profesionalni podcasti i kulturno izveštavanje' },
  
  // English
  { section_key: 'footer', language_code: 'en', content_key: 'sectionsTitle', content_value: 'Sections' },
  { section_key: 'footer', language_code: 'en', content_key: 'podcastSection', content_value: 'Podcast' },
  { section_key: 'footer', language_code: 'en', content_key: 'culturalSection', content_value: 'Romani Celebrations' },
  { section_key: 'footer', language_code: 'en', content_key: 'kitchenSection', content_value: 'Kitchen with Guests' },
  { section_key: 'footer', language_code: 'en', content_key: 'diasporaSection', content_value: 'Diaspora' },
  { section_key: 'footer', language_code: 'en', content_key: 'contactSection', content_value: 'Contact' },
  { section_key: 'footer', language_code: 'en', content_key: 'copyright', content_value: '© {year} Podcast Studio. All rights reserved.' },
  { section_key: 'footer', language_code: 'en', content_key: 'description', content_value: 'Professional Podcasts & Cultural Reporting' },
  
  // German
  { section_key: 'footer', language_code: 'de', content_key: 'sectionsTitle', content_value: 'Sektionen' },
  { section_key: 'footer', language_code: 'de', content_key: 'podcastSection', content_value: 'Podcast' },
  { section_key: 'footer', language_code: 'de', content_key: 'culturalSection', content_value: 'Romani Feierlichkeiten' },
  { section_key: 'footer', language_code: 'de', content_key: 'kitchenSection', content_value: 'Küche mit Gästen' },
  { section_key: 'footer', language_code: 'de', content_key: 'diasporaSection', content_value: 'Diaspora' },
  { section_key: 'footer', language_code: 'de', content_key: 'contactSection', content_value: 'Kontakt' },
  { section_key: 'footer', language_code: 'de', content_key: 'copyright', content_value: '© {year} Podcast Studio. Alle Rechte vorbehalten.' },
  { section_key: 'footer', language_code: 'de', content_key: 'description', content_value: 'Professionelle Podcasts & Kulturelle Berichterstattung' }
]

async function addHeaderFooterTranslations() {
  try {
    console.log('Adding header and footer translations to database...')
    
    // Combine all translations
    const allTranslations = [...headerTranslations, ...footerTranslations]
    
    // Insert translations one by one to handle duplicates
    let inserted = 0
    let skipped = 0
    
    for (const translation of allTranslations) {
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
    
    console.log(`\nHeader and footer translations insertion completed!`)
    console.log(`  Inserted: ${inserted} records`)
    console.log(`  Skipped: ${skipped} records (already existed)`)
    
  } catch (error) {
    console.error('Error:', error)
  }
}

// Run the translation insertion
addHeaderFooterTranslations()