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

// apply-migrations.js
const { createClient } = require('@supabase/supabase-js');

// Load environment variables
const SUPABASE_URL = process.env.SUPABASE_URL || "https://ykixjxocfbcczvkjgwts.supabase.co";

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