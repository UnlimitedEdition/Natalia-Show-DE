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