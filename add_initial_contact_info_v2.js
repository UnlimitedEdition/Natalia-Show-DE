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
    
    // First, check if the content already exists
    const { data: existingContactEmail, error: emailError } = await supabase
      .from('content')
      .select('id')
      .eq('section_key', 'contact')
      .eq('language_code', 'sr')
      .eq('content_key', 'contactEmail')
      .single()

    if (!existingContactEmail && !emailError) {
      // Insert contact email for Serbian
      const { error } = await supabase
        .from('content')
        .insert({
          section_key: 'contact',
          language_code: 'sr',
          content_key: 'contactEmail',
          content_value: 'info@nasemisije.com',
          is_active: true
        })
      
      if (error) {
        console.error('Error inserting contact email for sr:', error)
      } else {
        console.log('✓ Added contact email for sr: info@nasemisije.com')
      }
    } else {
      console.log('Contact email for sr already exists')
    }
    
    // Check if contact phone already exists
    const { data: existingContactPhone, error: phoneError } = await supabase
      .from('content')
      .select('id')
      .eq('section_key', 'contact')
      .eq('language_code', 'sr')
      .eq('content_key', 'contactPhone')
      .single()

    if (!existingContactPhone && !phoneError) {
      // Insert contact phone for Serbian
      const { error } = await supabase
        .from('content')
        .insert({
          section_key: 'contact',
          language_code: 'sr',
          content_key: 'contactPhone',
          content_value: '+381 11 123 4567',
          is_active: true
        })
      
      if (error) {
        console.error('Error inserting contact phone for sr:', error)
      } else {
        console.log('✓ Added contact phone for sr: +381 11 123 4567')
      }
    } else {
      console.log('Contact phone for sr already exists')
    }
    
    console.log('\nInitial contact information added successfully!')
    
  } catch (error) {
    console.error('Error:', error)
  }
}

// Run the script
addInitialContactInfo()