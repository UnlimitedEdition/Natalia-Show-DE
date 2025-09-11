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