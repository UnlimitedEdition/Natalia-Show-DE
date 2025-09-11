import { supabase } from '@/integrations/supabase/client';

async function testConnection() {
  try {
    const { data, error } = await supabase
      .from('admin_users')
      .select('*')
      .limit(1);

    if (error) {
      console.error('Database connection error:', error);
      return;
    }

    console.log('Database connection successful!');
    console.log('Data:', data);
  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

testConnection();