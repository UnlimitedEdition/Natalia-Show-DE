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

async function testAuditLogging() {
  try {
    console.log('=== TESTING AUDIT LOGGING ===\n')
    
    // Check if audit_log table exists
    console.log('1. CHECKING AUDIT LOG TABLE:')
    const { data: auditData, error: auditError } = await supabase
      .from('audit_log')
      .select('count')
      .limit(1)
    
    if (auditError) {
      console.log('  ✗ audit_log table does not exist or is not accessible')
      console.log('    Error:', auditError.message)
    } else {
      console.log('  ✓ audit_log table exists')
    }
    
    // Try to insert a test record into a table to see if audit logging works
    console.log('\n2. TESTING AUDIT LOGGING:')
    
    // Insert a test record into content table
    const testContent = {
      section_key: 'test',
      language_code: 'en',
      content_key: 'test_audit',
      content_value: 'Test content for audit logging',
      is_active: true
    }
    
    const { data: insertData, error: insertError } = await supabase
      .from('content')
      .insert([testContent])
      .select()
    
    if (insertError) {
      console.log('  Error inserting test content:', insertError.message)
    } else {
      console.log('  ✓ Successfully inserted test content')
      const insertedId = insertData[0].id
      console.log('    Inserted record ID:', insertedId)
      
      // Update the test record
      const { error: updateError } = await supabase
        .from('content')
        .update({ content_value: 'Updated test content for audit logging' })
        .eq('id', insertedId)
      
      if (updateError) {
        console.log('  Error updating test content:', updateError.message)
      } else {
        console.log('  ✓ Successfully updated test content')
      }
      
      // Delete the test record
      const { error: deleteError } = await supabase
        .from('content')
        .delete()
        .eq('id', insertedId)
      
      if (deleteError) {
        console.log('  Error deleting test content:', deleteError.message)
      } else {
        console.log('  ✓ Successfully deleted test content')
      }
    }
    
    // Check if audit logs were created
    console.log('\n3. CHECKING AUDIT LOGS:')
    const { data: logsData, error: logsError } = await supabase
      .from('audit_log')
      .select('*')
      .ilike('table_name', '%content%')
      .order('created_at', { ascending: false })
      .limit(5)
    
    if (logsError) {
      console.log('  Error querying audit logs:', logsError.message)
    } else {
      console.log(`  Found ${logsData.length} recent audit logs for content table:`)
      logsData.forEach((log, index) => {
        console.log(`    ${index + 1}. ${log.operation} on ${log.table_name} at ${log.created_at}`)
      })
    }
    
    console.log('\n=== AUDIT LOGGING TEST COMPLETE ===')
    
  } catch (error) {
    console.error('Unexpected error:', error)
  }
}

// Run the audit logging test
testAuditLogging()