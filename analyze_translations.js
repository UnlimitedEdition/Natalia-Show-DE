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

async function analyzeTranslations() {
  try {
    console.log('=== ANALYZING TRANSLATION SYSTEM ===\n')
    
    // Check languages table
    console.log('1. LANGUAGES TABLE:')
    const { data: languages, error: languagesError } = await supabase
      .from('languages')
      .select('*')
    
    if (languagesError) {
      console.error('Error querying languages table:', languagesError)
    } else {
      console.log('Found', languages.length, 'languages:')
      languages.forEach(lang => {
        console.log(`  - ${lang.code}: ${lang.name} ${lang.is_default ? '(DEFAULT)' : ''} ${lang.is_active ? '(ACTIVE)' : '(INACTIVE)'}`)
      })
    }
    
    // Check if there's a translations table
    console.log('\n2. CHECKING FOR TRANSLATIONS TABLE:')
    try {
      const { data: translations, error: translationsError } = await supabase
        .from('translations')
        .select('*')
        .limit(5)
      
      if (translationsError) {
        console.log('  No translations table found or error accessing it:', translationsError.message)
      } else {
        console.log('  Found translations table with', translations.length, 'sample records')
        if (translations.length > 0) {
          console.log('  Sample record:', translations[0])
        }
      }
    } catch (e) {
      console.log('  No translations table found')
    }
    
    // Check content table for translation data
    console.log('\n3. CONTENT TABLE ANALYSIS:')
    const { data: contentData, error: contentError } = await supabase
      .from('content')
      .select('*')
    
    if (contentError) {
      console.error('Error querying content table:', contentError)
    } else {
      console.log('  Found', contentData.length, 'content records')
      
      // Group by language_code and content_key
      const languageStats = {}
      const keyStats = {}
      
      contentData.forEach(item => {
        // Language statistics
        if (!languageStats[item.language_code]) {
          languageStats[item.language_code] = 0
        }
        languageStats[item.language_code]++
        
        // Content key statistics
        if (!keyStats[item.content_key]) {
          keyStats[item.content_key] = 0
        }
        keyStats[item.content_key]++
      })
      
      console.log('  Language distribution:')
      Object.entries(languageStats).forEach(([lang, count]) => {
        console.log(`    ${lang}: ${count} records`)
      })
      
      console.log('  Content key distribution:')
      Object.entries(keyStats).forEach(([key, count]) => {
        console.log(`    ${key}: ${count} records`)
      })
      
      // Show sample records
      if (contentData.length > 0) {
        console.log('\n  Sample content records:')
        contentData.slice(0, 3).forEach((item, index) => {
          console.log(`    ${index + 1}. [${item.language_code}] ${item.content_key}: ${item.content_value?.substring(0, 50)}${item.content_value?.length > 50 ? '...' : ''}`)
        })
      }
    }
    
    // Check if there are any translation_requests table
    console.log('\n4. CHECKING FOR TRANSLATION REQUESTS:')
    try {
      const { data: translationRequests, error: requestsError } = await supabase
        .from('translation_requests')
        .select('*')
        .limit(5)
      
      if (requestsError) {
        console.log('  No translation_requests table found or error accessing it:', requestsError.message)
      } else {
        console.log('  Found translation_requests table with', translationRequests.length, 'sample records')
        if (translationRequests.length > 0) {
          console.log('  Sample record:', translationRequests[0])
        }
      }
    } catch (e) {
      console.log('  No translation_requests table found')
    }
    
    // Check for any tables that might contain translation data
    console.log('\n5. CHECKING MEDIA TABLE FOR TRANSLATION DATA:')
    const { data: mediaData, error: mediaError } = await supabase
      .from('media')
      .select('title, description, language_code')
      .limit(10)
    
    if (mediaError) {
      console.error('Error querying media table:', mediaError)
    } else {
      console.log('  Sample media records with potential translation fields:')
      mediaData.forEach((item, index) => {
        console.log(`    ${index + 1}. [${item.language_code}] Title: ${item.title}, Description: ${item.description}`)
      })
    }
    
    console.log('\n=== ANALYSIS COMPLETE ===')
  } catch (error) {
    console.error('Unexpected error:', error)
  }
}

// Run the analysis
analyzeTranslations()