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

async function addSamplePodcastVideos() {
  try {
    console.log('Adding sample podcast videos...')
    
    // Sample podcast videos
    const sampleVideos = [
      {
        section_key: 'podcast',
        media_type: 'social_video',
        social_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ', // Sample YouTube video
        display_order: 1,
        is_active: true,
        language_code: 'en'
      },
      {
        section_key: 'podcast',
        media_type: 'social_video',
        social_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        display_order: 2,
        is_active: true,
        language_code: 'en'
      },
      {
        section_key: 'podcast',
        media_type: 'social_video',
        social_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        display_order: 3,
        is_active: true,
        language_code: 'en'
      },
      {
        section_key: 'podcast',
        media_type: 'social_video',
        social_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        display_order: 4,
        is_active: true,
        language_code: 'en'
      },
      {
        section_key: 'podcast',
        media_type: 'social_video',
        social_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        display_order: 5,
        is_active: true,
        language_code: 'en'
      },
      {
        section_key: 'podcast',
        media_type: 'social_video',
        social_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        display_order: 6,
        is_active: true,
        language_code: 'en'
      },
      {
        section_key: 'podcast',
        media_type: 'social_video',
        social_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        display_order: 7,
        is_active: true,
        language_code: 'en'
      },
      {
        section_key: 'podcast',
        media_type: 'social_video',
        social_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        display_order: 8,
        is_active: true,
        language_code: 'en'
      }
    ];
    
    // Insert sample videos
    for (const video of sampleVideos) {
      const { data, error } = await supabase
        .from('media')
        .insert(video)
        .select();
      
      if (error) {
        console.error(`Error inserting video:`, error);
      } else {
        console.log(`✓ Added video with ID: ${data[0].id}`);
      }
    }
    
    console.log('\nSample podcast videos added successfully!');
    
  } catch (error) {
    console.error('Error:', error);
  }
}

// Run the script
addSamplePodcastVideos();