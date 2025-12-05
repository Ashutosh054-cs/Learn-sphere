-- =====================================================
-- Fix Leaderboard and Game Progress Issues
-- Run this in Supabase SQL Editor
-- =====================================================

-- =====================================================
-- Create weekly_leaderboard view
-- =====================================================
CREATE OR REPLACE VIEW weekly_leaderboard AS
SELECT 
  up.id,
  up.name,
  up.avatar_url,
  COALESCE(weekly_stats.total_minutes, 0) as weekly_minutes,
  COALESCE(weekly_stats.session_count, 0) as weekly_sessions,
  ROW_NUMBER() OVER (ORDER BY COALESCE(weekly_stats.total_minutes, 0) DESC) as rank
FROM user_profiles up
LEFT JOIN (
  SELECT 
    user_id,
    SUM(duration) as total_minutes,
    COUNT(*) as session_count
  FROM focus_sessions
  WHERE 
    completed = true
    AND completed_at >= date_trunc('week', CURRENT_DATE)
  GROUP BY user_id
) weekly_stats ON up.id = weekly_stats.user_id
ORDER BY weekly_minutes DESC;

-- =====================================================
-- Ensure user_profiles table has all necessary columns
-- =====================================================
DO $$ 
BEGIN
  -- Add coins column if not exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'user_profiles' AND column_name = 'coins'
  ) THEN
    ALTER TABLE user_profiles ADD COLUMN coins INTEGER DEFAULT 0;
  END IF;

  -- Add gems column if not exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'user_profiles' AND column_name = 'gems'
  ) THEN
    ALTER TABLE user_profiles ADD COLUMN gems INTEGER DEFAULT 0;
  END IF;

  -- Add total_xp column if not exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'user_profiles' AND column_name = 'total_xp'
  ) THEN
    ALTER TABLE user_profiles ADD COLUMN total_xp INTEGER DEFAULT 0;
  END IF;

  -- Add level column if not exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'user_profiles' AND column_name = 'level'
  ) THEN
    ALTER TABLE user_profiles ADD COLUMN level INTEGER DEFAULT 1;
  END IF;
END $$;

-- =====================================================
-- Create index for faster leaderboard queries
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_focus_sessions_weekly 
  ON focus_sessions(user_id, completed_at) 
  WHERE completed = true;

-- =====================================================
-- Grant permissions on the view
-- =====================================================
GRANT SELECT ON weekly_leaderboard TO authenticated;
GRANT SELECT ON weekly_leaderboard TO anon;

-- =====================================================
-- Verify setup
-- =====================================================
-- Check if view exists
SELECT 'weekly_leaderboard view created' as status
WHERE EXISTS (
  SELECT 1 FROM information_schema.views 
  WHERE table_name = 'weekly_leaderboard'
);

-- Check user_profiles columns
SELECT column_name 
FROM information_schema.columns 
WHERE table_name = 'user_profiles' 
  AND column_name IN ('coins', 'gems', 'total_xp', 'level');
