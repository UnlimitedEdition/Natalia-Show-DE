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
import { readFileSync } from 'fs'

// Supabase configuration
const SUPABASE_URL = 'https://ykixjxocfbcczvkjgwts.supabase.co'

// Create a Supabase client with full access
const supabase = createClient(SUPABASE_URL, SERVICE_KEY, {
  auth: {
    persistSession: false,
    autoRefreshToken: false
  }
})

async function executeSQL() {
  try {
    console.log('Reading SQL file...')
    const sqlContent = readFileSync('implement_translation_system.sql', 'utf8')
    
    console.log('Executing SQL commands...')
    // Split the SQL content into individual statements
    const statements = sqlContent
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0)
    
    console.log(`Found ${statements.length} SQL statements to execute`)
    
    // Execute each statement
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i]
      if (statement.startsWith('--') || statement.length === 0) {
        continue // Skip comments and empty statements
      }
      
      try {
        console.log(`Executing statement ${i + 1}/${statements.length}...`)
        // For INSERT statements, we need to use the Supabase client differently
        if (statement.startsWith('INSERT INTO content')) {
          // Extract values from the INSERT statement
          const valuesMatch = statement.match(/VALUES\s*$$([^$$]+)$$/i)
          if (valuesMatch) {
            const values = valuesMatch[1].split('),').map(v => v.replace(/[()]/g, '').trim())
            
            for (const valueSet of values) {
              const parts = valueSet.split(',').map(p => p.trim().replace(/^'|'$/g, ''))
              if (parts.length >= 5) {
                const [sectionKey, languageCode, contentKey, contentValue, isActive] = parts
                
                // Check if record already exists to avoid duplicates
                const { data: existing, error: checkError } = await supabase
                  .from('content')
                  .select('id')
                  .eq('section_key', sectionKey)
                  .eq('language_code', languageCode)
                  .eq('content_key', contentKey)
                  .maybeSingle()
                
                if (checkError) {
                  console.error(`Error checking existing record:`, checkError)
                  continue
                }
                
                if (!existing) {
                  // Insert new record
                  const { error: insertError } = await supabase
                    .from('content')
                    .insert({
                      section_key: sectionKey,
                      language_code: languageCode,
                      content_key: contentKey,
                      content_value: contentValue,
                      is_active: isActive === 'true'
                    })
                  
                  if (insertError) {
                    console.error(`Error inserting record:`, insertError)
                  } else {
                    console.log(`  ✓ Inserted: [${languageCode}] ${sectionKey}.${contentKey}`)
                  }
                } else {
                  console.log(`  ○ Skipped (exists): [${languageCode}] ${sectionKey}.${contentKey}`)
                }
              }
            }
          }
        } else if (statement.startsWith('CREATE INDEX')) {
          console.log(`  Skipping index creation (would need direct DB access)`)
        } else if (statement.startsWith('COMMENT ON')) {
          console.log(`  Skipping comment (would need direct DB access)`)
        } else {
          console.log(`  Skipping statement: ${statement.substring(0, 50)}...`)
        }
      } catch (error) {
        console.error(`Error executing statement ${i + 1}:`, error.message)
      }
    }
    
    console.log('\nSQL execution completed!')
    
    // Verify the content was inserted
    console.log('\nVerifying content insertion...')
    const { data: contentCount, error: countError } = await supabase
      .from('content')
      .select('*', { count: 'exact' })
    
    if (countError) {
      console.error('Error counting content:', countError)
    } else {
      console.log(`Found ${contentCount.length} content records in the database`)
    }
    
  } catch (error) {
    console.error('Error:', error)
  }
}

// Run the SQL execution
executeSQL()