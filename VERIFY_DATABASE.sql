-- ============================================
-- DATABASE VERIFICATION SCRIPT
-- ============================================
-- Run these queries ONE BY ONE to diagnose the issue

-- QUERY 1: Check if user_profiles table exists
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name = 'user_profiles';
-- Expected: Should return 'user_profiles'

-- QUERY 2: Check if weekly_leaderboard view exists
SELECT table_name 
FROM information_schema.views 
WHERE table_schema = 'public' 
AND table_name = 'weekly_leaderboard';
-- Expected: Should return 'weekly_leaderboard'

-- QUERY 3: Check RLS policies on user_profiles
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies
WHERE tablename = 'user_profiles';
-- Expected: Should show policies including the new "Authenticated users can view all profiles"

-- QUERY 4: Check if your user profile exists
-- Replace YOUR_USER_ID with your actual user ID: 3b8c5f06-7d96-4b5c-8eaf-c3e30bd8eccc
SELECT id, email, name, total_focus_minutes, total_sessions, current_streak
FROM public.user_profiles
WHERE id = '3b8c5f06-7d96-4b5c-8eaf-c3e30bd8eccc';
-- Expected: Should return your profile data

-- QUERY 5: Count total profiles
SELECT COUNT(*) as total_profiles FROM public.user_profiles;
-- Expected: Should return a number (might be 0 if no profiles created yet)

-- QUERY 6: Check if RLS is enabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'user_profiles';
-- Expected: rowsecurity should be 't' (true)

-- ============================================
-- TROUBLESHOOTING RESULTS:
-- ============================================
-- If QUERY 1 or 2 returns nothing: Run DATABASE_SCHEMA.sql first
-- If QUERY 3 doesn't show the new policy: Run FIX_RLS_POLICIES.sql
-- If QUERY 4 returns nothing: User profile doesn't exist - need to create it
-- If QUERY 5 returns 0: No profiles exist yet - this is normal for new users
