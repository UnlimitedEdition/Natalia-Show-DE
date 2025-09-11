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

async function analyzeDatabaseStructure() {
  try {
    console.log('=== DATABASE STRUCTURE ANALYSIS ===\n')
    
    // Get all tables in the public schema
    console.log('1. ALL TABLES IN PUBLIC SCHEMA:')
    const { data: tables, error: tablesError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
    
    if (tablesError) {
      console.error('Error fetching tables:', tablesError)
    } else {
      const tableNames = tables.map(t => t.table_name)
      console.log(`Found ${tableNames.length} tables:`)
      tableNames.forEach(table => {
        console.log(`  - ${table}`)
      })
    }
    
    // Check for audit trails or logging tables
    console.log('\n2. AUDIT/LOGGING TABLES:')
    const auditRelatedTables = ['audit_log', 'audit_trail', 'change_log', 'logs', 'activity_log']
    for (const tableName of auditRelatedTables) {
      try {
        const { data, error } = await supabase
          .from(tableName)
          .select('*')
          .limit(1)
        
        if (error) {
          console.log(`  ✗ ${tableName}: Does not exist or not accessible`)
        } else {
          console.log(`  ✓ ${tableName}: Exists with ${data.length} sample records`)
        }
      } catch (e) {
        console.log(`  ✗ ${tableName}: Does not exist`)
      }
    }
    
    // Check RLS status for all tables
    console.log('\n3. RLS (ROW LEVEL SECURITY) STATUS:')
    if (tables && tables.length > 0) {
      const tableNames = tables.map(t => t.table_name)
      for (const tableName of tableNames) {
        try {
          // Check if RLS is enabled
          const { data: rlsData, error: rlsError } = await supabase
            .rpc('get_rls_status', { table_name: tableName })
          
          if (rlsError) {
            // Alternative method to check RLS
            const { data: policyData, error: policyError } = await supabase
              .from('information_schema.tables')
              .select('*')
              .eq('table_name', tableName)
              .eq('table_schema', 'public')
            
            if (policyError) {
              console.log(`  ? ${tableName}: Unable to determine RLS status`)
            } else {
              console.log(`  ? ${tableName}: RLS status unknown (need direct DB access to check)`)
            }
          } else {
            console.log(`  ${rlsData.enabled ? '✓' : '✗'} ${tableName}: RLS ${rlsData.enabled ? 'ENABLED' : 'DISABLED'}`)
          }
        } catch (e) {
          console.log(`  ? ${tableName}: Unable to determine RLS status`)
        }
      }
    }
    
    // Check for translation-related tables
    console.log('\n4. TRANSLATION-RELATED TABLES:')
    const translationTables = ['content', 'languages', 'translations', 'translation_requests']
    for (const tableName of translationTables) {
      try {
        const { data, error } = await supabase
          .from(tableName)
          .select('count')
          .limit(1)
        
        if (error) {
          console.log(`  ✗ ${tableName}: Does not exist or not accessible`)
        } else {
          console.log(`  ✓ ${tableName}: Exists`)
        }
      } catch (e) {
        console.log(`  ✗ ${tableName}: Does not exist`)
      }
    }
    
    // Check for user-related tables
    console.log('\n5. USER-RELATED TABLES:')
    const userTables = ['users', 'admin_users', 'user_profiles', 'auth.users']
    for (const tableName of userTables) {
      try {
        const { data, error } = await supabase
          .from(tableName)
          .select('count')
          .limit(1)
        
        if (error) {
          console.log(`  ✗ ${tableName}: Does not exist or not accessible`)
        } else {
          console.log(`  ✓ ${tableName}: Exists`)
        }
      } catch (e) {
        console.log(`  ✗ ${tableName}: Does not exist`)
      }
    }
    
    console.log('\n=== ANALYSIS COMPLETE ===')
    console.log('\nRecommendations:')
    console.log('1. Consider removing unused or duplicate tables')
    console.log('2. Enable RLS on all tables that store sensitive data')
    console.log('3. Implement audit logging for tracking changes')
    console.log('4. Ensure proper language loading based on region')
    
  } catch (error) {
    console.error('Unexpected error:', error)
  }
}

// Run the analysis
analyzeDatabaseStructure()