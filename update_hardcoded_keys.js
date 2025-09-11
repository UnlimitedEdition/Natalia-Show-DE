import fs from 'fs';
import path from 'path';

// List of files that need to be updated
const filesToUpdate = [
  'add_admin_translations.js',
  'add_contact_info.js',
  'add_footer_labels.js',
  'add_header_footer_translations.js',
  'add_initial_contact_info.js',
  'add_initial_contact_info_v2.js',
  'add_is_active_column.js',
  'add_kitchen_quote_translations.js',
  'add_podcast_translations.js',
  'add_sample_podcast_videos.js',
  'analyze_database_structure.js',
  'analyze_translations.js',
  'apply-initial-migration.js',
  'apply-migrations.js',
  'check_admin_panel_connections.js',
  'check_admin_users_structure.js',
  'check_all_tables.js',
  'check_announcements_structure.js',
  'check_announcements_table.js',
  'check_contact_db.js',
  'check_contact_fields.js',
  'check_contact_info.js',
  'check_contact_messages_structure.js',
  'check_contact_messages_table.js',
  'check_content_structure.js',
  'check_current_contact_info.js',
  'check_database_columns.js',
  'check_db_constraints.js',
  'check_existing_tables.js',
  'check_footer_labels.js',
  'check_footer_translations.js',
  'check_missing_tables.js',
  'check_navigation_translations.js',
  'check_podcast_content.js',
  'check_podcast_section.js',
  'check_podcast_translations.js',
  'check_rls_policies.js',
  'check_site_name.js',
  'check_table_structure.js',
  'check-database-consistency-simple.js',
  'check-database-consistency.js',
  'check-database-consistency.ts',
  'check-db.cjs',
  'check-db.js',
  'describe_contact_messages.js',
  'detailed_db_analysis.js',
  'direct_db_connection.js',
  'execute_create_missing_tables.js',
  'execute_sql.js',
  'fix_announcements_table.js',
  'fix_recursive_rls_policy.js',
  'fix_recursive_rls_policy.sql',
  'implement_translation_system.sql',
  'insert_translations.js',
  'list_tables_simple.js',
  'revert_contact_email.js',
  'setup_audit_and_rls.sql',
  'simple_translation_test.js',
  'test_audit_logging.js',
  'test_contact_admin.js',
  'test_fetch_contact_info.js',
  'test_hero_component.js',
  'test_language_detection.js',
  'test_podcast_admin.js',
  'test_podcast_db.js',
  'test_podcast_frontend.js',
  'test_podcast_functionality.js',
  'test_podcast_pagination.js',
  'test_translation_service.js',
  'test_translation_system.js',
  'test_update_contact_info.js',
  'test_update_contact_info_v2.js',
  'test-realtime.cjs',
  'test-realtime.js'
];

// Template for the new file header
const newHeader = `import { createClient } from '@supabase/supabase-js'
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

`;

// Function to update a file
function updateFile(fileName) {
  try {
    const filePath = path.join('.', fileName);
    
    // Check if file exists
    if (!fs.existsSync(filePath)) {
      console.log('File not found: ' + fileName);
      return;
    }
    
    // Read the file content
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Check if the file already contains the new header
    if (content.includes('import dotenv from \'dotenv\'')) {
      console.log('File already updated: ' + fileName);
      return;
    }
    
    // Remove the old SERVICE_KEY line (assuming it's near the top)
    const lines = content.split('\n');
    let newLines = [];
    let foundServiceKey = false;
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      
      // Skip lines that contain the old SERVICE_KEY definition
      if (line.includes('const SERVICE_KEY =') && line.includes('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9')) {
        foundServiceKey = true;
        continue;
      }
      
      // Skip lines that contain SUPABASE_SERVICE_ROLE_KEY definition
      if (line.includes('const SUPABASE_SERVICE_ROLE_KEY =') && line.includes('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9')) {
        foundServiceKey = true;
        continue;
      }
      
      // Skip lines that contain SUPABASE_KEY definition
      if (line.includes('const SUPABASE_KEY =') && line.includes('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9')) {
        foundServiceKey = true;
        continue;
      }
      
      newLines.push(line);
    }
    
    // Add the new header at the beginning
    const updatedContent = newHeader + newLines.join('\n');
    
    // Write the updated content back to the file
    fs.writeFileSync(filePath, updatedContent, 'utf8');
    
    console.log('Updated file: ' + fileName);
  } catch (error) {
    console.error('Error updating file ' + fileName + ': ' + error.message);
  }
}

// Update all files
console.log('Updating files with hardcoded keys...');
filesToUpdate.forEach(updateFile);
console.log('Done updating files.');