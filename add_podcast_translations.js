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

async function addPodcastTranslations() {
  try {
    console.log('Adding new podcast translations...')
    
    // New translations to add
    const newTranslations = [
      // Serbian translations
      {
        section_key: 'podcast',
        language_code: 'sr',
        content_key: 'podcastTitle',
        content_value: 'Подкаст',
        is_active: true
      },
      {
        section_key: 'podcast',
        language_code: 'sr',
        content_key: 'loadMore',
        content_value: 'Учитај још',
        is_active: true
      },
      {
        section_key: 'podcast',
        language_code: 'sr',
        content_key: 'loading',
        content_value: 'Учитавање...',
        is_active: true
      },
      
      // English translations
      {
        section_key: 'podcast',
        language_code: 'en',
        content_key: 'podcastTitle',
        content_value: 'Podcast',
        is_active: true
      },
      {
        section_key: 'podcast',
        language_code: 'en',
        content_key: 'loadMore',
        content_value: 'Load More',
        is_active: true
      },
      {
        section_key: 'podcast',
        language_code: 'en',
        content_key: 'loading',
        content_value: 'Loading...',
        is_active: true
      },
      
      // German translations
      {
        section_key: 'podcast',
        language_code: 'de',
        content_key: 'podcastTitle',
        content_value: 'Podcast',
        is_active: true
      },
      {
        section_key: 'podcast',
        language_code: 'de',
        content_key: 'loadMore',
        content_value: 'Mehr laden',
        is_active: true
      },
      {
        section_key: 'podcast',
        language_code: 'de',
        content_key: 'loading',
        content_value: 'Wird geladen...',
        is_active: true
      }
    ];
    
    // Insert new translations
    for (const translation of newTranslations) {
      const { error } = await supabase
        .from('content')
        .insert(translation);
      
      if (error) {
        console.error(`Error inserting ${translation.content_key} for ${translation.language_code}:`, error);
      } else {
        console.log(`✓ Added ${translation.content_key} for ${translation.language_code}: ${translation.content_value}`);
      }
    }
    
    console.log('\nNew podcast translations added successfully!');
    
  } catch (error) {
    console.error('Error:', error);
  }
}

// Run the script
addPodcastTranslations();