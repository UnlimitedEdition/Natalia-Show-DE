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

// Test script to verify PodcastSection functionality
console.log('Testing PodcastSection functionality...');

// Test data structure
const testData = [
  {
    id: '1',
    section_key: 'podcast',
    media_type: 'social_video',
    social_url: 'https://www.youtube.com/embed/test1',
    display_order: 1,
    is_active: true,
    language_code: 'en'
  },
  {
    id: '2',
    section_key: 'podcast',
    media_type: 'social_video',
    social_url: 'https://www.youtube.com/embed/test2',
    display_order: 2,
    is_active: true,
    language_code: 'en'
  },
  {
    id: '3',
    section_key: 'podcast',
    media_type: 'social_video',
    social_url: 'https://www.youtube.com/embed/test3',
    display_order: 3,
    is_active: true,
    language_code: 'en'
  }
];

console.log('Test data:', testData);
console.log('Number of items:', testData.length);

// Test pagination logic
const ITEMS_PER_PAGE = 6;
const page = 0;
const from = page * ITEMS_PER_PAGE;
const to = from + ITEMS_PER_PAGE - 1;

console.log('Pagination test:');
console.log('Page:', page);
console.log('From:', from);
console.log('To:', to);
console.log('Items in page:', testData.slice(from, to + 1));

// Test hasMore logic
const hasMore = testData.slice(from, to + 1).length === ITEMS_PER_PAGE;
console.log('Has more items:', hasMore);

console.log('\nPodcastSection functionality test completed!');