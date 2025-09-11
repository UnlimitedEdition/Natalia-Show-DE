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

import { translationService } from './src/services/translationService.js';

async function testHeroComponent() {
  try {
    console.log('Testing Hero component translation loading...');
    
    // Test loading hero translations
    const translations = await translationService.getSectionContent('hero', 'sr');
    console.log('Hero translations in Serbian:', translations);
    
    // Test with different language
    const enTranslations = await translationService.getSectionContent('hero', 'en');
    console.log('Hero translations in English:', enTranslations);
    
    // Test with German
    const deTranslations = await translationService.getSectionContent('hero', 'de');
    console.log('Hero translations in German:', deTranslations);
    
  } catch (error) {
    console.error('Error testing Hero component:', error);
  }
}

// Run the test
testHeroComponent();