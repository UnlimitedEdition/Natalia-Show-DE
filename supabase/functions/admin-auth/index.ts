import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, password, action } = await req.json();

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    if (action === 'login') {
      // Check if admin user exists
      const { data: adminUser, error } = await supabase
        .from('admin_users')
        .select('*')
        .eq('email', email)
        .eq('is_active', true)
        .single();

      if (error || !adminUser) {
        console.log('Admin user not found or error:', error);
        return new Response(
          JSON.stringify({ success: false, error: 'Neispravni podaci za prijavu' }),
          { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // For demo purposes, we'll use a simple password comparison
      // In production, you should use proper password hashing (bcrypt, etc.)
      const isValidPassword = adminUser.password_hash === password;

      if (!isValidPassword) {
        console.log('Invalid password for admin:', email);
        return new Response(
          JSON.stringify({ success: false, error: 'Neispravni podaci za prijavu' }),
          { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      console.log('Admin login successful:', email);
      return new Response(
        JSON.stringify({ 
          success: true, 
          adminId: adminUser.id,
          email: adminUser.email,
          fullName: adminUser.full_name 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );

    } else if (action === 'create') {
      // Create new admin user (for initial setup)
      const { data: newAdmin, error } = await supabase
        .from('admin_users')
        .insert([{
          email,
          password_hash: password, // In production, hash this properly
          full_name: 'Admin User',
          is_active: true
        }])
        .select()
        .single();

      if (error) {
        console.error('Error creating admin user:', error);
        return new Response(
          JSON.stringify({ success: false, error: 'Greška pri kreiranju admin korisnika' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      return new Response(
        JSON.stringify({ 
          success: true, 
          adminId: newAdmin.id,
          message: 'Admin korisnik je uspešno kreiran' 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ success: false, error: 'Nepoznata akcija' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in admin-auth function:', error);
    return new Response(
      JSON.stringify({ success: false, error: 'Server greška' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});