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