import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config()

// Supabase configuration
const SUPABASE_URL = process.env.SUPABASE_URL
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

// Validate environment variables
if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('Missing required environment variables:')
  if (!SUPABASE_URL) console.error('- SUPABASE_URL')
  if (!SUPABASE_SERVICE_KEY) console.error('- SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

// Create a Supabase client with service role for full access
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)

// Test data
const testContactInfo = {
  email: 'test@example.com',
  phone: '+1234567890',
  address: '123 Test Street, Test City, TC 12345',
  facebook: 'https://facebook.com/test',
  instagram: 'https://instagram.com/test',
  created_at: new Date(),
  updated_at: new Date()
};

async function testUpdateContactInfo() {
  try {
    console.log('Testing contact info update...');
    
    // Delete existing contact info
    const { error: deleteError } = await supabase
      .from('contact_info')
      .delete()
      .neq('id', 0); // Delete all records
    
    if (deleteError) {
      console.error('Error deleting existing contact info:', deleteError);
      return;
    }
    
    console.log('Existing contact info deleted successfully');
    
    // Insert new contact info
    const { data, error } = await supabase
      .from('contact_info')
      .insert(testContactInfo)
      .select();
    
    if (error) {
      console.error('Error inserting contact info:', error);
      return;
    }
    
    console.log('Contact info inserted successfully:', data);
    
    // Update contact info
    const updatedContactInfo = {
      ...testContactInfo,
      email: 'updated@example.com',
      phone: '+0987654321',
      updated_at: new Date()
    };
    
    const { data: updatedData, error: updateError } = await supabase
      .from('contact_info')
      .update(updatedContactInfo)
      .eq('id', data[0].id)
      .select();
    
    if (updateError) {
      console.error('Error updating contact info:', updateError);
      return;
    }
    
    console.log('Contact info updated successfully:', updatedData);
    console.log('Test completed successfully!');
  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

testUpdateContactInfo();