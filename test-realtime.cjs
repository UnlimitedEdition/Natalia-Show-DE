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

const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = "https://tlhjkjynchwymgfdgybq.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRsaGpranluY2h3eW1nZmRneWJxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY4Mzk5OTYsImV4cCI6MjA3MjQxNTk5Nn0.iYAJph_kIluPcqDqydSO54vE2wuJmECf0hHW-KG4LnE";

const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

console.log('Connecting to Supabase...');

// Test real-time subscription
const channel = supabase
  .channel('test-changes')
  .on(
    'postgres_changes',
    {
      event: '*',
      schema: 'public',
      table: 'content'
    },
    (payload) => {
      console.log('Change received:', payload);
    }
  )
  .subscribe((status) => {
    console.log('Subscription status:', status);
  });

console.log('Listening for changes... Press Ctrl+C to exit.');