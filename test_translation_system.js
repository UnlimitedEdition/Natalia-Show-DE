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

async function testTranslationSystem() {
  try {
    console.log('=== TESTING TRANSLATION SYSTEM ===\n')
    
    // Test 1: Check if translations were inserted correctly
    console.log('1. TESTING TRANSLATION INSERTION:')
    const { data: heroTranslations, error: heroError } = await supabase
      .from('content')
      .select('language_code, content_key, content_value')
      .eq('section_key', 'hero')
      .order('language_code, content_key')
    
    if (heroError) {
      console.error('Error querying hero translations:', heroError)
    } else {
      console.log('  Hero section translations:')
      heroTranslations.forEach(t => {
        console.log(`    [${t.language_code}] ${t.content_key}: ${t.content_value}`)
      })
    }
    
    // Test 2: Check all sections have translations
    console.log('\n2. CHECKING ALL SECTIONS:')
    const { data: sections, error: sectionsError } = await supabase
      .from('page_sections')
      .select('section_key, section_name')
    
    if (sectionsError) {
      console.error('Error querying sections:', sectionsError)
    } else {
      console.log('  Sections with translations:')
      for (const section of sections) {
        const { count, error } = await supabase
          .from('content')
          .select('*', { count: 'exact', head: true })
          .eq('section_key', section.section_key)
        
        if (error) {
          console.log(`    ✗ ${section.section_key}: Error checking translations`)
        } else {
          console.log(`    ${count > 0 ? '✓' : '○'} ${section.section_key}: ${count} translations`)
        }
      }
    }
    
    // Test 3: Check language distribution
    console.log('\n3. LANGUAGE DISTRIBUTION:')
    const { data: contentStats, error: statsError } = await supabase
      .from('content')
      .select('language_code, section_key')
    
    if (statsError) {
      console.error('Error querying content stats:', statsError)
    } else {
      const languageCount = {}
      const sectionCount = {}
      
      contentStats.forEach(item => {
        // Count by language
        if (!languageCount[item.language_code]) {
          languageCount[item.language_code] = 0
        }
        languageCount[item.language_code]++
        
        // Count by section
        if (!sectionCount[item.section_key]) {
          sectionCount[item.section_key] = 0
        }
        sectionCount[item.section_key]++
      })
      
      console.log('  By language:')
      Object.entries(languageCount).forEach(([lang, count]) => {
        console.log(`    ${lang}: ${count} translations`)
      })
      
      console.log('  By section:')
      Object.entries(sectionCount).forEach(([section, count]) => {
        console.log(`    ${section}: ${count} translations`)
      })
    }
    
    // Test 4: Verify content structure
    console.log('\n4. CONTENT STRUCTURE VERIFICATION:')
    const { data: sampleContent, error: sampleError } = await supabase
      .from('content')
      .select('id, section_key, media_id, language_code, content_key, content_value')
      .limit(5)
    
    if (sampleError) {
      console.error('Error querying sample content:', sampleError)
    } else {
      console.log('  Sample content records:')
      sampleContent.forEach((item, index) => {
        console.log(`    ${index + 1}. [${item.language_code}] ${item.section_key}.${item.content_key} = ${item.content_value?.substring(0, 30)}${item.content_value?.length > 30 ? '...' : ''}`)
      })
    }
    
    // Test 5: Check indexes
    console.log('\n5. DATABASE INDEXES:')
    console.log('  The following indexes should exist for optimal performance:')
    console.log('    - idx_content_section_key')
    console.log('    - idx_content_language_code')
    console.log('    - idx_content_content_key')
    console.log('    - idx_content_media_id')
    
    console.log('\n=== TRANSLATION SYSTEM TEST COMPLETE ===')
    console.log('\nTo verify the frontend implementation:')
    console.log('1. Start the development server')
    console.log('2. Navigate to the homepage')
    console.log('3. Check that section titles and descriptions load from the database')
    console.log('4. Switch languages using the language selector')
    console.log('5. Verify that content changes according to the selected language')
    
  } catch (error) {
    console.error('Unexpected error:', error)
  }
}

// Run the test
testTranslationSystem()