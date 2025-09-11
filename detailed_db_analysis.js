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

async function detailedAnalysis() {
  try {
    console.log('=== DETAILED DATABASE STRUCTURE ANALYSIS ===\n')
    
    // Check all tables in the database
    console.log('1. AVAILABLE TABLES:')
    // We'll try to get information about tables by querying system tables
    
    // Check page_sections table
    console.log('\n2. PAGE SECTIONS TABLE:')
    const { data: sections, error: sectionsError } = await supabase
      .from('page_sections')
      .select('*')
    
    if (sectionsError) {
      console.error('Error querying page_sections:', sectionsError)
    } else {
      console.log('Found', sections.length, 'sections:')
      sections.forEach(section => {
        console.log(`  - ${section.section_key}: ${section.section_name}`)
      })
    }
    
    // Check the structure of the content table in detail
    console.log('\n3. CONTENT TABLE STRUCTURE:')
    const contentColumns = [
      'id', 'media_id', 'language_code', 'content_key', 
      'content_value', 'section_key', 'is_active', 'created_at', 'updated_at'
    ];
    
    for (const column of contentColumns) {
      try {
        const { data, error } = await supabase
          .from('content')
          .select(column)
          .limit(1)
        
        if (error) {
          console.log(`  ✗ Column does not exist: ${column}`)
        } else {
          console.log(`  ✓ Column exists: ${column}`)
        }
      } catch (e) {
        console.log(`  ✗ Error checking column ${column}:`, e.message)
      }
    }
    
    // Check if there are any records in content table with specific filters
    console.log('\n4. CONTENT TABLE DATA ANALYSIS:')
    
    // Check for posts section content
    const { data: postsContent, error: postsError } = await supabase
      .from('content')
      .select('*')
      .eq('section_key', 'posts')
    
    if (postsError) {
      console.log('  Error querying posts content:', postsError.message)
    } else {
      console.log(`  Found ${postsContent.length} posts content records`)
    }
    
    // Check for any content with media_id
    const { data: mediaContent, error: mediaContentError } = await supabase
      .from('content')
      .select('*')
      .not('media_id', 'is', null)
    
    if (mediaContentError) {
      console.log('  Error querying media content:', mediaContentError.message)
    } else {
      console.log(`  Found ${mediaContent.length} media content records`)
    }
    
    // Check for content without media_id but with section_key
    const { data: sectionContent, error: sectionContentError } = await supabase
      .from('content')
      .select('*')
      .is('media_id', null)
      .not('section_key', 'is', null)
    
    if (sectionContentError) {
      console.log('  Error querying section content:', sectionContentError.message)
    } else {
      console.log(`  Found ${sectionContent.length} section content records`)
      if (sectionContent.length > 0) {
        console.log('  Sample section content:')
        sectionContent.slice(0, 3).forEach((item, index) => {
          console.log(`    ${index + 1}. [${item.language_code}] ${item.section_key}.${item.content_key}: ${item.content_value?.substring(0, 50)}${item.content_value?.length > 50 ? '...' : ''}`)
        })
      }
    }
    
    // Analyze how the application currently handles translations
    console.log('\n5. APPLICATION TRANSLATION ANALYSIS:')
    console.log('  Based on the database structure, the translation system appears to work as follows:')
    console.log('  - Languages are stored in the "languages" table')
    console.log('  - Translations are stored in the "content" table')
    console.log('  - Content can be associated with either:')
    console.log('    a) A specific media item (via media_id)')
    console.log('    b) A specific section (via section_key)')
    console.log('  - Each translation has a language_code and content_key')
    console.log('  - The content_value contains the actual translated text')
    
    console.log('\n=== DETAILED ANALYSIS COMPLETE ===')
  } catch (error) {
    console.error('Unexpected error:', error)
  }
}

// Run the detailed analysis
detailedAnalysis()