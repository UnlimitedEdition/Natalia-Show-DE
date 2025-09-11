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

async function checkMissingTables() {
  try {
    console.log('=== CHECKING FOR MISSING TABLES ===\n')
    
    // Tables that should exist based on the admin panel components
    const expectedTables = [
      'page_sections',
      'media',
      'content',
      'languages',
      'advertisements',
      'announcements',
      'admin_users',
      'posts'
    ]
    
    // Check which tables exist
    console.log('1. TABLE EXISTENCE CHECK:')
    for (const table of expectedTables) {
      try {
        const { data, error } = await supabase
          .from(table)
          .select('*')
          .limit(1)
        
        if (error) {
          console.log(`  ✗ ${table}: Error - ${error.message}`)
        } else {
          console.log(`  ✓ ${table}: Exists`)
        }
      } catch (e) {
        console.log(`  ✗ ${table}: Does not exist`)
      }
    }
    
    // Check structure of advertisements table
    console.log('\n2. ADVERTISEMENTS TABLE:')
    try {
      const { data: ads, error: adsError } = await supabase
        .from('advertisements')
        .select('*')
      
      if (adsError) {
        console.log('  Table exists but error querying:', adsError.message)
      } else {
        console.log(`  Found ${ads.length} advertisements`)
        if (ads.length > 0) {
          console.log('  Sample advertisement:', ads[0])
        }
      }
    } catch (e) {
      console.log('  Table does not exist or is not accessible')
    }
    
    // Check structure of announcements table
    console.log('\n3. ANNOUNCEMENTS TABLE:')
    try {
      const { data: announcements, error: announcementsError } = await supabase
        .from('announcements')
        .select('*')
      
      if (announcementsError) {
        console.log('  Table exists but error querying:', announcementsError.message)
      } else {
        console.log(`  Found ${announcements.length} announcements`)
        if (announcements.length > 0) {
          console.log('  Sample announcement:', announcements[0])
        }
      }
    } catch (e) {
      console.log('  Table does not exist or is not accessible')
    }
    
    // Check structure of posts table
    console.log('\n4. POSTS TABLE:')
    try {
      const { data: posts, error: postsError } = await supabase
        .from('posts')
        .select('*')
      
      if (postsError) {
        console.log('  Table exists but error querying:', postsError.message)
      } else {
        console.log(`  Found ${posts.length} posts`)
        if (posts.length > 0) {
          console.log('  Sample post:', posts[0])
        }
      }
    } catch (e) {
      console.log('  Table does not exist or is not accessible')
    }
    
    // Check structure of admin_users table
    console.log('\n5. ADMIN_USERS TABLE:')
    try {
      const { data: adminUsers, error: adminUsersError } = await supabase
        .from('admin_users')
        .select('*')
      
      if (adminUsersError) {
        console.log('  Table exists but error querying:', adminUsersError.message)
      } else {
        console.log(`  Found ${adminUsers.length} admin users`)
        if (adminUsers.length > 0) {
          console.log('  Sample admin user:', adminUsers[0])
        }
      }
    } catch (e) {
      console.log('  Table does not exist or is not accessible')
    }
    
    console.log('\n=== MISSING TABLES CHECK COMPLETE ===')
    
  } catch (error) {
    console.error('Unexpected error:', error)
  }
}

// Run the check
checkMissingTables()