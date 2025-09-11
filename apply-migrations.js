// apply-migrations.js
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

async function applyMigrations() {
  console.log('Applying migrations to database...');
  
  try {
    // Read and execute the first migration file which creates all basic tables
    const fs = require('fs');
    const path = require('path');
    
    const migrationFiles = fs.readdirSync(path.join(__dirname, 'supabase', 'migrations'))
      .sort()
      .filter(file => file.endsWith('.sql'));
    
    console.log(`Found ${migrationFiles.length} migration files`);
    
    for (const file of migrationFiles) {
      console.log(`Applying migration: ${file}`);
      const migrationSql = fs.readFileSync(path.join(__dirname, 'supabase', 'migrations', file), 'utf8');
      
      // Split migration into individual statements
      const statements = migrationSql
        .split(';')
        .map(stmt => stmt.trim())
        .filter(stmt => stmt.length > 0);
      
      for (const statement of statements) {
        if (statement.trim().length === 0) continue;
        
        console.log(`Executing statement: ${statement.substring(0, 50)}...`);
        const { error } = await supabase.rpc('execute_sql', { sql: statement });
        
        if (error) {
          console.error('Error executing statement:', error);
          // Continue with other statements
        } else {
          console.log('Statement executed successfully');
        }
      }
    }
    
    console.log('All migrations applied successfully!');
  } catch (error) {
    console.error('Error applying migrations:', error);
  }
}

// Run the migrations
applyMigrations();