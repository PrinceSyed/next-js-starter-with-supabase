import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseSecretKey = process.env.SUPABASE_SECRET_KEY

// Only create client if environment variables are available
if (!supabaseUrl || !supabaseSecretKey) {
  console.warn('Supabase admin environment variables not found. Please check your .env.local file.')
}

// This client should only be used in server-side code (API routes, Server Components, etc.)
export const supabaseAdmin = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseSecretKey || 'placeholder-secret-key',
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
) 