-- ============================================
-- DIAGNOSTIC: Check current trigger and function
-- ============================================

-- 1. List all triggers on auth.users
SELECT 
  tgname AS trigger_name,
  tgenabled AS enabled,
  proname AS function_name,
  prosrc AS function_source
FROM pg_trigger t
JOIN pg_proc p ON t.tgfoid = p.oid
WHERE tgrelid::regclass::text = 'auth.users';

-- 2. Check if user_profiles table exists
SELECT EXISTS (
  SELECT FROM pg_tables 
  WHERE schemaname = 'public' 
  AND tablename = 'user_profiles'
) AS user_profiles_exists;

-- 3. Show the full function definition
SELECT pg_get_functiondef(p.oid) AS full_definition
FROM pg_proc p
WHERE p.proname = 'handle_new_user';

-- 4. Check auth.users columns (to see what's available)
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_schema = 'auth' 
AND table_name = 'users'
ORDER BY ordinal_position;

-- 5. Check if there are any existing user profiles
SELECT COUNT(*) as profile_count FROM public.user_profiles;
