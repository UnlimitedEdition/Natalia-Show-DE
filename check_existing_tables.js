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

async function checkExistingTables() {
  try {
    console.log('=== CHECKING EXISTING TABLES ===\n')
    
    // List of tables we know should exist
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
    
    console.log('1. TABLE EXISTENCE CHECK:')
    const existingTables = []
    for (const tableName of expectedTables) {
      try {
        const { data, error } = await supabase
          .from(tableName)
          .select('count')
          .limit(1)
        
        if (error) {
          console.log(`  ✗ ${tableName}: ${error.message}`)
        } else {
          existingTables.push(tableName)
          console.log(`  ✓ ${tableName}: Exists`)
        }
      } catch (e) {
        console.log(`  ✗ ${tableName}: Does not exist`)
      }
    }
    
    // Check structure of existing tables
    console.log('\n2. TABLE STRUCTURE ANALYSIS:')
    for (const tableName of existingTables) {
      try {
        console.log(`\n  ${tableName}:`)
        // Get column information
        const { data: columns, error: columnsError } = await supabase
          .from('information_schema.columns')
          .select('column_name, data_type, is_nullable')
          .eq('table_name', tableName)
        
        if (columnsError) {
          console.log(`    Unable to get column info: ${columnsError.message}`)
        } else {
          console.log(`    Columns (${columns.length}):`)
          columns.forEach(col => {
            console.log(`      - ${col.column_name} (${col.data_type}) ${col.is_nullable === 'YES' ? 'NULL' : 'NOT NULL'}`)
          })
        }
      } catch (e) {
        console.log(`    Error analyzing ${tableName}: ${e.message}`)
      }
    }
    
    console.log('\n=== CHECK COMPLETE ===')
    
  } catch (error) {
    console.error('Unexpected error:', error)
  }
}

// Run the check
checkExistingTables()