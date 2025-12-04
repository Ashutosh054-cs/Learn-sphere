// Quick test to verify Supabase connection
import { supabase } from '../src/lib/supabase.js'

async function testConnection() {
  console.log('🧪 Testing Supabase Connection...\n')

  if (!supabase) {
    console.error('❌ Supabase client not initialized')
    console.log('Make sure .env.local has:')
    console.log('  VITE_SUPABASE_URL=https://kbduyhatydsttfwpxgke.supabase.co')
    console.log('  VITE_SUPABASE_ANON_KEY=your-anon-key')
    process.exit(1)
  }

  try {
    // Test 1: Check auth settings
    console.log('Test 1: Checking auth settings...')
    const response = await fetch(`${process.env.VITE_SUPABASE_URL}/auth/v1/settings`, {
      headers: {
        'apikey': process.env.VITE_SUPABASE_ANON_KEY
      }
    })
    
    if (response.ok) {
      console.log('✅ Auth endpoint reachable')
    } else {
      console.log('❌ Auth endpoint error:', response.status)
    }

    // Test 2: Check if user_profiles table exists
    console.log('\nTest 2: Checking user_profiles table...')
    const { data, error } = await supabase
      .from('user_profiles')
      .select('count')
      .limit(1)
    
    if (error) {
      console.log('❌ user_profiles table error:', error.message)
      console.log('   👉 Run DATABASE_SCHEMA.sql in Supabase SQL Editor!')
    } else {
      console.log('✅ user_profiles table exists')
    }

    // Test 3: Check if trigger exists
    console.log('\nTest 3: Checking handle_new_user trigger...')
    const { data: triggerData, error: triggerError } = await supabase
      .from('pg_trigger')
      .select('tgname')
      .eq('tgname', 'on_auth_user_created')
      .single()
    
    if (triggerError) {
      console.log('⚠️  Could not verify trigger (this is normal)')
      console.log('   Make sure you ran DATABASE_SCHEMA.sql')
    } else {
      console.log('✅ Trigger verified')
    }

    console.log('\n🎉 Connection test complete!')
    console.log('\n📋 Next steps:')
    console.log('   1. If any tests failed, run DATABASE_SCHEMA.sql in Supabase SQL Editor')
    console.log('   2. Start your dev server: npm run dev')
    console.log('   3. Test signup at http://localhost:5173/signup')

  } catch (error) {
    console.error('❌ Connection test failed:', error.message)
  }
}

// Load env vars
import { config } from 'dotenv'
config({ path: '.env.local' })

testConnection()
