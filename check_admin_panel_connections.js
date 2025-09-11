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

async function checkAdminPanelConnections() {
  try {
    console.log('=== CHECKING ADMIN PANEL DATABASE CONNECTIONS ===\n')
    
    // Check if page_sections table has data
    console.log('1. PAGE SECTIONS:')
    const { data: sections, error: sectionsError } = await supabase
      .from('page_sections')
      .select('*')
    
    if (sectionsError) {
      console.error('  Error querying page_sections:', sectionsError)
    } else {
      console.log(`  Found ${sections.length} sections:`)
      sections.forEach(section => {
        console.log(`    - ${section.section_key}: ${section.section_name}`)
      })
    }
    
    // Check if media table has data
    console.log('\n2. MEDIA ITEMS:')
    const { data: media, error: mediaError } = await supabase
      .from('media')
      .select('*')
    
    if (mediaError) {
      console.error('  Error querying media:', mediaError)
    } else {
      console.log(`  Found ${media.length} media items`)
      if (media.length > 0) {
        media.slice(0, 3).forEach((item, index) => {
          console.log(`    ${index + 1}. [${item.section_key}] ${item.media_type}: ${item.file_url || item.social_url}`)
        })
        if (media.length > 3) {
          console.log(`    ... and ${media.length - 3} more`)
        }
      }
    }
    
    // Check if content table has data
    console.log('\n3. CONTENT ITEMS:')
    const { data: content, error: contentError } = await supabase
      .from('content')
      .select('*')
    
    if (contentError) {
      console.error('  Error querying content:', contentError)
    } else {
      console.log(`  Found ${content.length} content items`)
      if (content.length > 0) {
        // Group by section_key
        const sectionContent = {}
        content.forEach(item => {
          if (!sectionContent[item.section_key]) {
            sectionContent[item.section_key] = 0
          }
          sectionContent[item.section_key]++
        })
        
        console.log('  Content distribution by section:')
        Object.entries(sectionContent).forEach(([section, count]) => {
          console.log(`    ${section}: ${count} items`)
        })
      }
    }
    
    // Check if languages table has data
    console.log('\n4. LANGUAGES:')
    const { data: languages, error: languagesError } = await supabase
      .from('languages')
      .select('*')
    
    if (languagesError) {
      console.error('  Error querying languages:', languagesError)
    } else {
      console.log(`  Found ${languages.length} languages:`)
      languages.forEach(lang => {
        console.log(`    - ${lang.code}: ${lang.name} ${lang.is_default ? '(DEFAULT)' : ''}`)
      })
    }
    
    // Check if admin_users table exists and has data
    console.log('\n5. ADMIN USERS:')
    try {
      const { data: adminUsers, error: adminUsersError } = await supabase
        .from('admin_users')
        .select('*')
      
      if (adminUsersError) {
        console.log('  No admin_users table found or error accessing it')
      } else {
        console.log(`  Found ${adminUsers.length} admin users`)
        if (adminUsers.length > 0) {
          adminUsers.forEach(user => {
            console.log(`    - ${user.email} ${user.is_active ? '(ACTIVE)' : '(INACTIVE)'}`)
          })
        }
      }
    } catch (e) {
      console.log('  No admin_users table found')
    }
    
    // Check if advertisements table exists and has data
    console.log('\n6. ADVERTISEMENTS:')
    try {
      const { data: advertisements, error: adsError } = await supabase
        .from('advertisements')
        .select('*')
      
      if (adsError) {
        console.log('  No advertisements table found or error accessing it')
      } else {
        console.log(`  Found ${advertisements.length} advertisements`)
      }
    } catch (e) {
      console.log('  No advertisements table found')
    }
    
    console.log('\n=== CONNECTION CHECK COMPLETE ===')
    console.log('\nTo improve admin panel:')
    console.log('1. Consider loading admin panel translations from database instead of hardcoded values')
    console.log('2. Ensure all content management components properly sync with database')
    console.log('3. Verify real-time subscriptions are working for live updates')
    
  } catch (error) {
    console.error('Unexpected error:', error)
  }
}

// Run the check
checkAdminPanelConnections()