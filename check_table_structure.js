import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://ykixjxocfbcczvkjgwts.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlraXhqeG9jZmJjY3p2a2pnd3RzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcxNjA4MjYsImV4cCI6MjA3MjczNjgyNn0.oI57oJXfm7QEwfIbred6XeRiEcRJ1Xu9rO42Ta8hTSU'
);

async function checkTableStructure() {
  try {
    // Try to get column information through a simple query
    const { data, error } = await supabase
      .from('media')
      .select('*')
      .limit(1);
      
    if (error) {
      console.log('Error:', error);
      return;
    }
    
    if (data && data.length > 0) {
      console.log('Available columns in media table:');
      console.log(Object.keys(data[0]));
    } else {
      console.log('No data found in media table');
      
      // Try to check what columns might exist by testing common ones
      const commonColumns = [
        'id', 'section_key', 'media_type', 'file_url', 'social_url', 
        'thumbnail_url', 'display_order', 'is_active', 'created_at', 
        'updated_at', 'title', 'description', 'language_code'
      ];
      
      console.log('\nTesting common column names:');
      for (const column of commonColumns) {
        try {
          const testResult = await supabase
            .from('media')
            .select(column)
            .limit(1);
            
          if (!testResult.error) {
            console.log(`✓ Column exists: ${column}`);
          } else {
            console.log(`✗ Column does not exist: ${column}`);
          }
        } catch (testError) {
          console.log(`✗ Error testing column ${column}:`, testError.message);
        }
      }
    }
  } catch (err) {
    console.error('Unexpected error:', err);
  }
}

checkTableStructure();