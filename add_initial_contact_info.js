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

async function addInitialContactInfo() {
  try {
    console.log('Adding initial contact information...')
    
    // Languages to add translations for
    const languages = ['sr', 'en', 'de']
    
    // Contact information to add
    const contactInfo = [
      { content_key: 'contactEmail', content_value: 'info@nasemisije.com' },
      { content_key: 'contactPhone', content_value: '+381 11 123 4567' }
    ]
    
    // Site name
    const siteNames = [
      { language_code: 'sr', content_value: 'Наш Емисије' },
      { language_code: 'en', content_value: 'Our Shows' },
      { language_code: 'de', content_value: 'Unsere Sendungen' }
    ]
    
    // Add contact information for all languages
    for (const lang of languages) {
      for (const info of contactInfo) {
        const { error } = await supabase
          .from('content')
          .upsert({
            section_key: 'contact',
            language_code: lang,
            content_key: info.content_key,
            content_value: info.content_value,
            is_active: true
          }, {
            onConflict: 'section_key,language_code,content_key'
          })
        
        if (error) {
          console.error(`Error inserting ${info.content_key} for ${lang}:`, error)
        } else {
          console.log(`✓ Added ${info.content_key} for ${lang}: ${info.content_value}`)
        }
      }
    }
    
    // Add site names
    for (const siteName of siteNames) {
      const { error } = await supabase
        .from('content')
        .upsert({
          section_key: 'hero',
          language_code: siteName.language_code,
          content_key: 'title',
          content_value: siteName.content_value,
          is_active: true
        }, {
          onConflict: 'section_key,language_code,content_key'
        })
      
      if (error) {
        console.error(`Error inserting site name for ${siteName.language_code}:`, error)
      } else {
        console.log(`✓ Added site name for ${siteName.language_code}: ${siteName.content_value}`)
      }
    }
    
    console.log('\nInitial contact information added successfully!')
    
  } catch (error) {
    console.error('Error:', error)
  }
}

// Run the script
addInitialContactInfo()