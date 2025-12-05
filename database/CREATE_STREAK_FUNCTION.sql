-- =====================================================
-- CREATE STREAK CALCULATION FUNCTION
-- Calculates user streak from focus_sessions table
-- =====================================================

-- Function to calculate current streak based on completed focus sessions
CREATE OR REPLACE FUNCTION public.calculate_user_streak(user_uuid UUID)
RETURNS TABLE(current_streak INTEGER, longest_streak INTEGER) AS $$
DECLARE
  streak INTEGER := 0;
  max_streak INTEGER := 0;
  check_date DATE := CURRENT_DATE;
  has_activity BOOLEAN;
  prev_has_activity BOOLEAN := TRUE;
BEGIN
  -- Loop through days backwards from today
  FOR i IN 0..365 LOOP
    check_date := CURRENT_DATE - i;
    
    -- Check if user completed any focus session on this date
    SELECT EXISTS(
      SELECT 1 FROM public.focus_sessions
      WHERE user_id = user_uuid 
        AND completed = TRUE
        AND DATE(completed_at) = check_date
    ) INTO has_activity;
    
    -- If there's activity, increment streak
    IF has_activity THEN
      IF prev_has_activity THEN
        streak := streak + 1;
      ELSE
        -- Reset streak if there was a gap
        streak := 1;
      END IF;
      
      -- Track max streak
      IF streak > max_streak THEN
        max_streak := streak;
      END IF;
      
      prev_has_activity := TRUE;
    ELSE
      -- If we're still in the current streak period
      IF i = 0 OR prev_has_activity THEN
        -- Only break current streak if we hit a gap
        prev_has_activity := FALSE;
      ELSE
        -- We've moved past the current streak
        EXIT;
      END IF;
    END IF;
  END LOOP;
  
  -- Return both current and longest streak
  RETURN QUERY SELECT 
    CASE WHEN prev_has_activity THEN streak ELSE 0 END as current_streak,
    max_streak as longest_streak;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add streak columns to user_profiles if they don't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'user_profiles' AND column_name = 'current_streak'
  ) THEN
    ALTER TABLE user_profiles ADD COLUMN current_streak INTEGER DEFAULT 0;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'user_profiles' AND column_name = 'longest_streak'
  ) THEN
    ALTER TABLE user_profiles ADD COLUMN longest_streak INTEGER DEFAULT 0;
  END IF;
END $$;

-- Grant execute permission on the function
GRANT EXECUTE ON FUNCTION public.calculate_user_streak(UUID) TO authenticated;
