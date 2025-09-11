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
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlraXhqeG9jZmJjY3p2a2pnd3RzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcxNjA4MjYsImV4cCI6MjA3MjczNjgyNn0.oI57oJXfm7QEwfIbred6XeRiEcRJ1Xu9rO42Ta8hTSU'

// Create a Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

async function testPodcastPagination() {
  try {
    console.log('Testing Podcast pagination logic...')
    
    const ITEMS_PER_PAGE = 6;
    const currentLanguage = 'en';
    
    // Test page 0
    const page0 = 0;
    const from0 = page0 * ITEMS_PER_PAGE;
    const to0 = from0 + ITEMS_PER_PAGE - 1;
    
    console.log(`\nTesting page ${page0} (items ${from0}-${to0})...`);
    
    const { data: data0, error: error0 } = await supabase
      .from('media')
      .select('id, section_key, media_type, social_url')
      .eq('section_key', 'podcast')
      .eq('is_active', true)
      .eq('language_code', currentLanguage)
      .range(from0, to0)
      .order('created_at', { ascending: false });
    
    if (error0) {
      console.error('Database query error for page 0:', error0);
      return;
    }
    
    console.log(`Page ${page0} retrieved items:`, data0?.length || 0);
    console.log('Has more (page 0):', (data0?.length || 0) === ITEMS_PER_PAGE);
    
    // Test page 1
    const page1 = 1;
    const from1 = page1 * ITEMS_PER_PAGE;
    const to1 = from1 + ITEMS_PER_PAGE - 1;
    
    console.log(`\nTesting page ${page1} (items ${from1}-${to1})...`);
    
    const { data: data1, error: error1 } = await supabase
      .from('media')
      .select('id, section_key, media_type, social_url')
      .eq('section_key', 'podcast')
      .eq('is_active', true)
      .eq('language_code', currentLanguage)
      .range(from1, to1)
      .order('created_at', { ascending: false });
    
    if (error1) {
      console.error('Database query error for page 1:', error1);
      return;
    }
    
    console.log(`Page ${page1} retrieved items:`, data1?.length || 0);
    console.log('Has more (page 1):', (data1?.length || 0) === ITEMS_PER_PAGE);
    
    console.log('\nPagination test completed successfully!');
    
  } catch (error) {
    console.error('Error:', error);
  }
}

// Run the test
testPodcastPagination();