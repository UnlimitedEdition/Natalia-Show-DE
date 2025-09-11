import { createClient } from '@supabase/supabase-js'

// Supabase configuration
const SUPABASE_URL = 'https://ykixjxocfbcczvkjgwts.supabase.co'
const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlraXhqeG9jZmJjY3p2a2pnd3RzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NzE2MDgyNiwiZXhwIjoyMDcyNzM2ODI2fQ.yVm112ou5zHIZnvDq2kZY4t_BRTiP0wNWHTuLyjY3lw'

// Create a Supabase client with service role for full access
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)

async function revertContactEmail() {
  try {
    console.log('Reverting contact email to original value...')
    
    const currentLanguage = 'sr'; // Serbian language
    
    // First check if record exists
    const { data: existingEmail, error: fetchEmailError } = await supabase
      .from('content')
      .select('id')
      .eq('section_key', 'contact')
      .eq('language_code', currentLanguage)
      .eq('content_key', 'contactEmail')
      .maybeSingle()

    if (fetchEmailError) throw fetchEmailError

    if (existingEmail) {
      console.log('Updating existing contact email record to original value...')
      // Update existing record
      const { error: updateError } = await supabase
        .from('content')
        .update({
          content_value: 'info@nasemisije.com',
          is_active: true,
          updated_at: new Date().toISOString()
        })
        .eq('id', existingEmail.id)

      if (updateError) throw updateError
      console.log('Contact email reverted successfully')
    }
    
    console.log('Contact email revert completed!')
    
  } catch (error) {
    console.error('Error:', error)
  }
}

// Run the revert
revertContactEmail()