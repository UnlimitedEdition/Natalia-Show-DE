const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = "https://ykixjxocfbcczvkjgwts.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlraXhqeG9jZmJjY3p2a2pnd3RzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcxNjA4MjYsImV4cCI6MjA3MjczNjgyNn0.oI57oJXfm7QEwfIbred6XeRiEcRJ1Xu9rO42Ta8hTSU";

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