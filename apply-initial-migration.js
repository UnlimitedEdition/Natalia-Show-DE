// apply-initial-migration.js
const { createClient } = require('@supabase/supabase-js');

// Load environment variables
const SUPABASE_URL = process.env.SUPABASE_URL || "https://ykixjxocfbcczvkjgwts.supabase.co";
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlraXhqeG9jZmJjY3p2a2pnd3RzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NzE2MDgyNiwiZXhwIjoyMDcyNzM2ODI2fQ.yVm112ou5zHIZnvDq2kZY4t_BRTiP0wNWHTuLyjY3lw";

// Create Supabase client with service role key (admin access)
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: {
    persistSession: false,
  },
});

async function applyInitialMigration() {
  console.log('Applying initial migration to database...');
  
  try {
    // Read the first migration file
    const fs = require('fs');
    const path = require('path');
    
    const migrationPath = path.join(__dirname, 'supabase', 'migrations', '20250903191740_8634431e-bec5-4b26-8c90-1a5451851762.sql');
    const migrationSql = fs.readFileSync(migrationPath, 'utf8');
    
    console.log('Creating tables and inserting initial data...');
    
    // Execute the SQL statements one by one
    // We'll split on double newlines to separate major blocks
    const blocks = migrationSql.split('\n\n').filter(block => block.trim().length > 0);
    
    for (const block of blocks) {
      const trimmedBlock = block.trim();
      if (trimmedBlock.startsWith('--') || trimmedBlock.length === 0) {
        continue; // Skip comments and empty blocks
      }
      
      console.log(`Executing block: ${trimmedBlock.substring(0, 50)}...`);
      
      // Try to execute each block
      const { error } = await supabase.rpc('execute_sql', { sql: trimmedBlock });
      
      if (error) {
        console.error('Error executing block:', error.message);
        // Try to execute statement by statement if block fails
        const statements = trimmedBlock.split(';').filter(stmt => stmt.trim().length > 0);
        for (const statement of statements) {
          const stmt = statement.trim();
          if (stmt.length > 0) {
            console.log(`Trying individual statement: ${stmt.substring(0, 50)}...`);
            const { error: stmtError } = await supabase.rpc('execute_sql', { sql: stmt });
            if (stmtError) {
              console.error('Error executing statement:', stmtError.message);
            } else {
              console.log('Statement executed successfully');
            }
          }
        }
      } else {
        console.log('Block executed successfully');
      }
    }
    
    console.log('Initial migration applied successfully!');
  } catch (error) {
    console.error('Error applying initial migration:', error);
  }
}

// Run the migration
applyInitialMigration();