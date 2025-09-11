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