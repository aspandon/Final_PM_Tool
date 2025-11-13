import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Get the authorization token from the request
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      throw new Error('No authorization header')
    }

    // Create Supabase client with anon key to verify the caller
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } }
    })

    // Verify the user is authenticated and is admin
    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if (userError || !user) {
      throw new Error('Unauthorized')
    }

    if (user.email !== 'admin@pmtool.local') {
      throw new Error('Access denied: Admin only')
    }

    // Parse the request body
    const { email, password, metadata } = await req.json()

    if (!email || !password) {
      throw new Error('Email and password are required')
    }

    // Create admin client with service role key
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const adminClient = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })

    // Create user using Admin API
    const { data: newUser, error: createError } = await adminClient.auth.admin.createUser({
      email: email,
      password: password,
      email_confirm: true,
      user_metadata: metadata || {}
    })

    if (createError) {
      throw createError
    }

    return new Response(
      JSON.stringify({
        success: true,
        user_id: newUser.user.id,
        email: newUser.user.email
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )

  } catch (error) {
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
})