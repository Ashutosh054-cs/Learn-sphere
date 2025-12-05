-- =====================================================
-- Debug Leaderboard Issues
-- Run each query separately to diagnose
-- =====================================================

-- =====================================================
-- CHECK 1: Verify your user profile exists
-- =====================================================
SELECT 
  id,
  name,
  avatar_url,
  coins,
  gems,
  total_xp,
  level,
  created_at
FROM user_profiles
ORDER BY created_at DESC
LIMIT 5;

-- =====================================================
-- CHECK 2: Check if you have any focus sessions
-- =====================================================
SELECT 
  user_id,
  duration,
  completed,
  session_type,
  completed_at,
  created_at
FROM focus_sessions
ORDER BY created_at DESC
LIMIT 10;

-- =====================================================
-- CHECK 3: Check this week's focus sessions
-- =====================================================
SELECT 
  user_id,
  SUM(duration) as total_minutes,
  COUNT(*) as session_count
FROM focus_sessions
WHERE 
  completed = true
  AND completed_at >= date_trunc('week', CURRENT_DATE)
GROUP BY user_id;

-- =====================================================
-- CHECK 4: View the weekly_leaderboard
-- =====================================================
SELECT * FROM weekly_leaderboard
ORDER BY rank
LIMIT 10;

-- =====================================================
-- CHECK 5: Find your specific entry
-- Replace 'your-email@example.com' with your actual email
-- =====================================================
-- SELECT 
--   up.*,
--   wl.weekly_minutes,
--   wl.weekly_sessions,
--   wl.rank
-- FROM user_profiles up
-- LEFT JOIN weekly_leaderboard wl ON up.id = wl.id
-- WHERE up.email = 'your-email@example.com';

-- =====================================================
-- CHECK 6: Verify auth.users connection
-- =====================================================
SELECT 
  au.id,
  au.email,
  up.name,
  up.created_at as profile_created
FROM auth.users au
LEFT JOIN user_profiles up ON au.id = up.id
ORDER BY au.created_at DESC
LIMIT 5;
