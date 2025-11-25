-- ============================================
-- FIX RLS POLICIES FOR LEADERBOARD ACCESS
-- ============================================
-- Run this ENTIRE script in Supabase SQL Editor

-- STEP 1: Drop ALL existing SELECT policies on user_profiles
DROP POLICY IF EXISTS "Users can view own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Authenticated users can view all profiles" ON public.user_profiles;

-- STEP 2: Create NEW policy that allows authenticated users to view all profiles
CREATE POLICY "Authenticated users can view all profiles"
  ON public.user_profiles FOR SELECT
  USING (auth.role() = 'authenticated');

-- STEP 3: Verify RLS is enabled
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- STEP 4: Test the policy (this should return rows if policy is working)
-- Uncomment the line below to test:
-- SELECT id, email, name FROM public.user_profiles LIMIT 5;

-- ============================================
-- EXPLANATION:
-- ============================================
-- Before: Users could only view their OWN profile (auth.uid() = id)
-- After: Users can view ALL profiles (needed for leaderboard)
-- Security: UPDATE and INSERT policies still protect write operations
