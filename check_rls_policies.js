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

async function checkRLSPolicies() {
  try {
    console.log('=== CHECKING RLS POLICIES ===\n')
    
    // List of existing tables
    const tables = [
      'page_sections',
      'media',
      'content',
      'languages',
      'advertisements',
      'announcements',
      'admin_users'
    ]
    
    console.log('Checking RLS policies for tables:')
    for (const table of tables) {
      try {
        // Try to insert a test record to see if RLS allows it
        const testRecord = {
          // Provide minimal required fields for each table
        }
        
        // Special handling for each table
        switch (table) {
          case 'page_sections':
            testRecord.section_key = 'test_section'
            testRecord.section_name = 'Test Section'
            break
          case 'languages':
            testRecord.code = 'ts'
            testRecord.name = 'Test Language'
            break
          case 'advertisements':
            testRecord.title = 'Test Ad'
            testRecord.ad_type = 'image'
            testRecord.position = 'header'
            break
          case 'announcements':
            testRecord.title = 'Test Announcement'
            testRecord.content = 'Test content'
            break
          case 'admin_users':
            testRecord.email = 'test@example.com'
            testRecord.password_hash = 'test_hash'
            break
          case 'media':
            testRecord.section_key = 'hero'
            testRecord.media_type = 'image'
            break
          case 'content':
            testRecord.section_key = 'hero'
            testRecord.language_code = 'en'
            testRecord.content_key = 'test_key'
            testRecord.content_value = 'Test content'
            break
        }
        
        // Try to insert (this will help us understand RLS behavior)
        const { data, error } = await supabase
          .from(table)
          .insert([testRecord])
        
        if (error) {
          console.log(`  ${table}: RLS may be enabled (insert failed: ${error.message})`)
        } else {
          console.log(`  ${table}: RLS may be disabled or allows inserts`)
          // Delete the test record if it was inserted
          if (data && data.length > 0) {
            await supabase.from(table).delete().eq('id', data[0].id)
          }
        }
      } catch (e) {
        console.log(`  ${table}: Error checking RLS - ${e.message}`)
      }
    }
    
    console.log('\n=== RLS CHECK COMPLETE ===')
    console.log('\nTo properly set up RLS policies, you should:')
    console.log('1. Use the Supabase SQL editor')
    console.log('2. Run RLS policy creation scripts')
    console.log('3. Test policies with different user roles')
    
  } catch (error) {
    console.error('Unexpected error:', error)
  }
}

// Run the RLS check
checkRLSPolicies()