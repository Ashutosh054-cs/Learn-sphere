// Backup of original src/lib/supabase.js

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Create a mock client if env vars are missing (for dev mode)
const createSupabaseClient = () => {
  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn(
      '⚠️  Supabase env vars missing. Running in DEV MODE with mock auth.\n' +
      'To use real Supabase:\n' +
      '1. Copy .env.local.example to .env.local\n' +
      '2. Add your VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY\n' +
      '3. Restart the dev server'
    )
    // Return a dummy client that won't break imports
    return null
  }
  return createClient(supabaseUrl, supabaseAnonKey)
}

export const supabase = createSupabaseClient()
