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