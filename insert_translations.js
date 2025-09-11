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

// Translation data
const translations = [
  // Hero Section translations
  { section_key: 'hero', language_code: 'sr', content_key: 'title', content_value: 'Добродошли у Наш Емисије', is_active: true },
  { section_key: 'hero', language_code: 'sr', content_key: 'subtitle', content_value: 'Откријте свет нашег емисија и прича', is_active: true },
  { section_key: 'hero', language_code: 'sr', content_key: 'description', content_value: 'Причамо приче које би требало да се чују, са људима који би требало да их чују', is_active: true },
  { section_key: 'hero', language_code: 'en', content_key: 'title', content_value: 'Welcome to Our Shows', is_active: true },
  { section_key: 'hero', language_code: 'en', content_key: 'subtitle', content_value: 'Discover the world of our shows and stories', is_active: true },
  { section_key: 'hero', language_code: 'en', content_key: 'description', content_value: 'We tell stories that need to be heard, to people who need to hear them', is_active: true },
  { section_key: 'hero', language_code: 'de', content_key: 'title', content_value: 'Willkommen bei unseren Sendungen', is_active: true },
  { section_key: 'hero', language_code: 'de', content_key: 'subtitle', content_value: 'Entdecken Sie die Welt unserer Sendungen und Geschichten', is_active: true },
  { section_key: 'hero', language_code: 'de', content_key: 'description', content_value: 'Wir erzählen Geschichten, die gehört werden müssen, an Menschen, die sie hören müssen', is_active: true },

  // Podcast Section translations
  { section_key: 'podcast', language_code: 'sr', content_key: 'title', content_value: 'Подкаст', is_active: true },
  { section_key: 'podcast', language_code: 'sr', content_key: 'description', content_value: 'Слушајте наше најновије епизоде', is_active: true },
  { section_key: 'podcast', language_code: 'en', content_key: 'title', content_value: 'Podcast', is_active: true },
  { section_key: 'podcast', language_code: 'en', content_key: 'description', content_value: 'Listen to our latest episodes', is_active: true },
  { section_key: 'podcast', language_code: 'de', content_key: 'title', content_value: 'Podcast', is_active: true },
  { section_key: 'podcast', language_code: 'de', content_key: 'description', content_value: 'Hören Sie sich unsere neuesten Episoden an', is_active: true },

  // Kitchen Talk Show translations
  { section_key: 'kitchen', language_code: 'sr', content_key: 'title', content_value: 'Кухиња са гостима', is_active: true },
  { section_key: 'kitchen', language_code: 'sr', content_key: 'description', content_value: 'Разговори са занимљивим личностима у неформалној атмосфери', is_active: true },
  { section_key: 'kitchen', language_code: 'en', content_key: 'title', content_value: 'Kitchen with Guests', is_active: true },
  { section_key: 'kitchen', language_code: 'en', content_key: 'description', content_value: 'Conversations with interesting personalities in an informal atmosphere', is_active: true },
  { section_key: 'kitchen', language_code: 'de', content_key: 'title', content_value: 'Küche mit Gästen', is_active: true },
  { section_key: 'kitchen', language_code: 'de', content_key: 'description', content_value: 'Gespräche mit interessanten Persönlichkeiten in einer informellen Atmosphäre', is_active: true },

  // Cultural Section translations
  { section_key: 'cultural', language_code: 'sr', content_key: 'title', content_value: 'Ромска весеља', is_active: true },
  { section_key: 'cultural', language_code: 'sr', content_key: 'description', content_value: 'Културне приче и традиције нашег народа', is_active: true },
  { section_key: 'cultural', language_code: 'en', content_key: 'title', content_value: 'Romani Celebrations', is_active: true },
  { section_key: 'cultural', language_code: 'en', content_key: 'description', content_value: 'Cultural stories and traditions of our people', is_active: true },
  { section_key: 'cultural', language_code: 'de', content_key: 'title', content_value: 'Romani Feierlichkeiten', is_active: true },
  { section_key: 'cultural', language_code: 'de', content_key: 'description', content_value: 'Kulturelle Geschichten und Traditionen unseres Volkes', is_active: true },

  // Diaspora Section translations
  { section_key: 'diaspora', language_code: 'sr', content_key: 'title', content_value: 'Дијаспора и Балкан', is_active: true },
  { section_key: 'diaspora', language_code: 'sr', content_key: 'description', content_value: 'Вести и приче из дијаспоре и са Балкана', is_active: true },
  { section_key: 'diaspora', language_code: 'en', content_key: 'title', content_value: 'Diaspora and Balkans', is_active: true },
  { section_key: 'diaspora', language_code: 'en', content_key: 'description', content_value: 'News and stories from the diaspora and the Balkans', is_active: true },
  { section_key: 'diaspora', language_code: 'de', content_key: 'title', content_value: 'Diaspora und Balkan', is_active: true },
  { section_key: 'diaspora', language_code: 'de', content_key: 'description', content_value: 'Nachrichten und Geschichten aus der Diaspora und vom Balkan', is_active: true },

  // Posts Section translations
  { section_key: 'posts', language_code: 'sr', content_key: 'title', content_value: 'Објаве', is_active: true },
  { section_key: 'posts', language_code: 'sr', content_key: 'description', content_value: 'Најновије вести и обавештења', is_active: true },
  { section_key: 'posts', language_code: 'en', content_key: 'title', content_value: 'Posts', is_active: true },
  { section_key: 'posts', language_code: 'en', content_key: 'description', content_value: 'Latest news and announcements', is_active: true },
  { section_key: 'posts', language_code: 'de', content_key: 'title', content_value: 'Beiträge', is_active: true },
  { section_key: 'posts', language_code: 'de', content_key: 'description', content_value: 'Neueste Nachrichten und Ankündigungen', is_active: true },

  // Contact Section translations
  { section_key: 'contact', language_code: 'sr', content_key: 'title', content_value: 'Контакт', is_active: true },
  { section_key: 'contact', language_code: 'sr', content_key: 'description', content_value: 'Ступите у контакт са нама', is_active: true },
  { section_key: 'contact', language_code: 'sr', content_key: 'addressLabel', content_value: 'Адреса', is_active: true },
  { section_key: 'contact', language_code: 'sr', content_key: 'phoneLabel', content_value: 'Телефон', is_active: true },
  { section_key: 'contact', language_code: 'sr', content_key: 'emailLabel', content_value: 'Емаил', is_active: true },
  { section_key: 'contact', language_code: 'sr', content_key: 'nameLabel', content_value: 'Име', is_active: true },
  { section_key: 'contact', language_code: 'sr', content_key: 'namePlaceholder', content_value: 'Ваше име', is_active: true },
  { section_key: 'contact', language_code: 'sr', content_key: 'emailPlaceholder', content_value: 'Ваша емаил адреса', is_active: true },
  { section_key: 'contact', language_code: 'sr', content_key: 'messageLabel', content_value: 'Порука', is_active: true },
  { section_key: 'contact', language_code: 'sr', content_key: 'messagePlaceholder', content_value: 'Ваша порука', is_active: true },
  { section_key: 'contact', language_code: 'sr', content_key: 'sendButton', content_value: 'Пошаљи поруку', is_active: true },
  { section_key: 'contact', language_code: 'sr', content_key: 'contactInfo', content_value: 'Контакт информације', is_active: true },
  { section_key: 'contact', language_code: 'sr', content_key: 'sendMessage', content_value: 'Пошаљите нам поруку', is_active: true },
  { section_key: 'contact', language_code: 'en', content_key: 'title', content_value: 'Contact', is_active: true },
  { section_key: 'contact', language_code: 'en', content_key: 'description', content_value: 'Get in touch with us', is_active: true },
  { section_key: 'contact', language_code: 'en', content_key: 'addressLabel', content_value: 'Address', is_active: true },
  { section_key: 'contact', language_code: 'en', content_key: 'phoneLabel', content_value: 'Phone', is_active: true },
  { section_key: 'contact', language_code: 'en', content_key: 'emailLabel', content_value: 'Email', is_active: true },
  { section_key: 'contact', language_code: 'en', content_key: 'nameLabel', content_value: 'Name', is_active: true },
  { section_key: 'contact', language_code: 'en', content_key: 'namePlaceholder', content_value: 'Your name', is_active: true },
  { section_key: 'contact', language_code: 'en', content_key: 'emailPlaceholder', content_value: 'Your email address', is_active: true },
  { section_key: 'contact', language_code: 'en', content_key: 'messageLabel', content_value: 'Message', is_active: true },
  { section_key: 'contact', language_code: 'en', content_key: 'messagePlaceholder', content_value: 'Your message', is_active: true },
  { section_key: 'contact', language_code: 'en', content_key: 'sendButton', content_value: 'Send message', is_active: true },
  { section_key: 'contact', language_code: 'en', content_key: 'contactInfo', content_value: 'Contact Information', is_active: true },
  { section_key: 'contact', language_code: 'en', content_key: 'sendMessage', content_value: 'Send us a message', is_active: true },
  { section_key: 'contact', language_code: 'de', content_key: 'title', content_value: 'Kontakt', is_active: true },
  { section_key: 'contact', language_code: 'de', content_key: 'description', content_value: 'Kontaktieren Sie uns', is_active: true },
  { section_key: 'contact', language_code: 'de', content_key: 'addressLabel', content_value: 'Adresse', is_active: true },
  { section_key: 'contact', language_code: 'de', content_key: 'phoneLabel', content_value: 'Telefon', is_active: true },
  { section_key: 'contact', language_code: 'de', content_key: 'emailLabel', content_value: 'E-Mail', is_active: true },
  { section_key: 'contact', language_code: 'de', content_key: 'nameLabel', content_value: 'Name', is_active: true },
  { section_key: 'contact', language_code: 'de', content_key: 'namePlaceholder', content_value: 'Ihr Name', is_active: true },
  { section_key: 'contact', language_code: 'de', content_key: 'emailPlaceholder', content_value: 'Ihre E-Mail-Adresse', is_active: true },
  { section_key: 'contact', language_code: 'de', content_key: 'messageLabel', content_value: 'Nachricht', is_active: true },
  { section_key: 'contact', language_code: 'de', content_key: 'messagePlaceholder', content_value: 'Ihre Nachricht', is_active: true },
  { section_key: 'contact', language_code: 'de', content_key: 'sendButton', content_value: 'Nachricht senden', is_active: true },
  { section_key: 'contact', language_code: 'de', content_key: 'contactInfo', content_value: 'Kontaktinformationen', is_active: true },
  { section_key: 'contact', language_code: 'de', content_key: 'sendMessage', content_value: 'Senden Sie uns eine Nachricht', is_active: true }
];

async function insertTranslations() {
  try {
    console.log(`Inserting ${translations.length} translation records...`)
    
    // Insert translations one by one to handle duplicates
    let inserted = 0
    let skipped = 0
    
    for (const translation of translations) {
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
    
    console.log(`\nTranslation insertion completed!`)
    console.log(`  Inserted: ${inserted} records`)
    console.log(`  Skipped: ${skipped} records (already existed)`)
    
    // Verify the content was inserted
    console.log('\nVerifying content insertion...')
    const { data: contentCount, error: countError } = await supabase
      .from('content')
      .select('*', { count: 'exact' })
    
    if (countError) {
      console.error('Error counting content:', countError)
    } else {
      console.log(`Total content records in database: ${contentCount.length}`)
    }
    
  } catch (error) {
    console.error('Error:', error)
  }
}

// Run the translation insertion
insertTranslations()