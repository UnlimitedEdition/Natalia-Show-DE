import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://ykixjxocfbcczvkjgwts.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlraXhqeG9jZmJjY3p2a2pnd3RzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcxNjA4MjYsImV4cCI6MjA3MjczNjgyNn0.oI57oJXfm7QEwfIbred6XeRiEcRJ1Xu9rO42Ta8hTSU'
);

async function checkAllTables() {
  try {
    // Check media table
    console.log('=== MEDIA TABLE ===');
    const mediaResult = await supabase.from('media').select('*').limit(1);
    if (mediaResult.data && mediaResult.data.length > 0) {
      console.log('Columns:', Object.keys(mediaResult.data[0]));
    } else {
      // Test specific columns
      const mediaColumns = ['id', 'section_key', 'media_type', 'file_url', 'social_url', 
        'thumbnail_url', 'display_order', 'is_active', 'created_at', 'updated_at', 
        'title', 'description', 'language_code'];
      
      console.log('Testing columns:');
      for (const column of mediaColumns) {
        try {
          const testResult = await supabase.from('media').select(column).limit(1);
          if (!testResult.error) {
            console.log(`✓ ${column}`);
          } else {
            console.log(`✗ ${column}`);
          }
        } catch (e) {
          console.log(`✗ ${column}`);
        }
      }
    }

    // Check content table
    console.log('\n=== CONTENT TABLE ===');
    const contentResult = await supabase.from('content').select('*').limit(1);
    if (contentResult.data && contentResult.data.length > 0) {
      console.log('Columns:', Object.keys(contentResult.data[0]));
    } else {
      // Test specific columns
      const contentColumns = ['id', 'media_id', 'language_code', 'content_key', 'content_value', 
        'is_active', 'created_at', 'updated_at'];
      
      console.log('Testing columns:');
      for (const column of contentColumns) {
        try {
          const testResult = await supabase.from('content').select(column).limit(1);
          if (!testResult.error) {
            console.log(`✓ ${column}`);
          } else {
            console.log(`✗ ${column}`);
          }
        } catch (e) {
          console.log(`✗ ${column}`);
        }
      }
    }

    // Check languages table
    console.log('\n=== LANGUAGES TABLE ===');
    const languagesResult = await supabase.from('languages').select('*').limit(1);
    if (languagesResult.data && languagesResult.data.length > 0) {
      console.log('Columns:', Object.keys(languagesResult.data[0]));
    } else {
      console.log('No data found in languages table');
    }

    // Check page_sections table
    console.log('\n=== PAGE_SECTIONS TABLE ===');
    const sectionsResult = await supabase.from('page_sections').select('*').limit(1);
    if (sectionsResult.data && sectionsResult.data.length > 0) {
      console.log('Columns:', Object.keys(sectionsResult.data[0]));
    } else {
      console.log('No data found in page_sections table');
    }

  } catch (err) {
    console.error('Error:', err);
  }
}

checkAllTables();