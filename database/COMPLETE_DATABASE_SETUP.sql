-- =====================================================
-- LearnSphere Complete Database Setup
-- Run this script in your Supabase SQL Editor
-- =====================================================

-- =====================================================
-- STEP 1: Update user_profiles table
-- Add coins and gems columns
-- =====================================================

ALTER TABLE user_profiles 
ADD COLUMN IF NOT EXISTS coins INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS gems INTEGER DEFAULT 0;

-- =====================================================
-- STEP 2: Create game_progress table
-- Stores user progress in each game type
-- =====================================================

CREATE TABLE IF NOT EXISTS game_progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  game_type TEXT NOT NULL,
  current_level INTEGER DEFAULT 1,
  total_xp INTEGER DEFAULT 0,
  completed_levels INTEGER[] DEFAULT '{}',
  last_played_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, game_type)
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_game_progress_user_id 
  ON game_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_game_progress_game_type 
  ON game_progress(game_type);

-- =====================================================
-- STEP 3: Create game_completions table
-- Records each level completion with score/time
-- =====================================================

CREATE TABLE IF NOT EXISTS game_completions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  game_type TEXT NOT NULL,
  level_id TEXT NOT NULL,
  score INTEGER,
  time_taken INTEGER, -- in seconds
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_game_completions_user_id 
  ON game_completions(user_id);
CREATE INDEX IF NOT EXISTS idx_game_completions_game_type 
  ON game_completions(game_type);
CREATE INDEX IF NOT EXISTS idx_game_completions_completed_at 
  ON game_completions(completed_at);

-- =====================================================
-- STEP 4: Create currency_transactions table
-- Logs all coin/gem transactions
-- =====================================================

CREATE TABLE IF NOT EXISTS currency_transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  currency_type TEXT NOT NULL CHECK (currency_type IN ('coins', 'gems')),
  amount INTEGER NOT NULL,
  reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_currency_transactions_user_id 
  ON currency_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_currency_transactions_created_at 
  ON currency_transactions(created_at);

-- =====================================================
-- STEP 5: RPC Function - Update User Coins
-- =====================================================

CREATE OR REPLACE FUNCTION update_user_coins(
  p_user_id UUID,
  p_amount INTEGER
)
RETURNS void AS $$
BEGIN
  UPDATE user_profiles
  SET coins = GREATEST(0, coins + p_amount),
      updated_at = NOW()
  WHERE user_id = p_user_id;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'User profile not found for user_id: %', p_user_id;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- STEP 6: RPC Function - Update User Gems
-- =====================================================

CREATE OR REPLACE FUNCTION update_user_gems(
  p_user_id UUID,
  p_amount INTEGER
)
RETURNS void AS $$
BEGIN
  UPDATE user_profiles
  SET gems = GREATEST(0, gems + p_amount),
      updated_at = NOW()
  WHERE user_id = p_user_id;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'User profile not found for user_id: %', p_user_id;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- STEP 7: RPC Function - Record Level Completion
-- =====================================================

CREATE OR REPLACE FUNCTION record_level_completion(
  p_user_id UUID,
  p_game_type TEXT,
  p_level_id TEXT,
  p_score INTEGER,
  p_time_taken INTEGER
)
RETURNS void AS $$
DECLARE
  v_level_id_int INTEGER;
BEGIN
  -- Insert completion record
  INSERT INTO game_completions (user_id, game_type, level_id, score, time_taken)
  VALUES (p_user_id, p_game_type, p_level_id, p_score, p_time_taken);
  
  -- Try to convert level_id to integer
  BEGIN
    v_level_id_int := p_level_id::INTEGER;
  EXCEPTION WHEN OTHERS THEN
    -- If conversion fails, skip array update
    v_level_id_int := NULL;
  END;
  
  -- Update game progress
  IF v_level_id_int IS NOT NULL THEN
    UPDATE game_progress
    SET completed_levels = array_append(completed_levels, v_level_id_int),
        last_played_at = NOW(),
        updated_at = NOW()
    WHERE user_id = p_user_id AND game_type = p_game_type
      AND NOT (v_level_id_int = ANY(completed_levels)); -- Only add if not already in array
  ELSE
    UPDATE game_progress
    SET last_played_at = NOW(),
        updated_at = NOW()
    WHERE user_id = p_user_id AND game_type = p_game_type;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- STEP 8: Enable Row Level Security (RLS)
-- =====================================================

ALTER TABLE game_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_completions ENABLE ROW LEVEL SECURITY;
ALTER TABLE currency_transactions ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- STEP 9: RLS Policies for game_progress
-- =====================================================

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view own game progress" ON game_progress;
DROP POLICY IF EXISTS "Users can insert own game progress" ON game_progress;
DROP POLICY IF EXISTS "Users can update own game progress" ON game_progress;

-- Create new policies
CREATE POLICY "Users can view own game progress"
  ON game_progress FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own game progress"
  ON game_progress FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own game progress"
  ON game_progress FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- =====================================================
-- STEP 10: RLS Policies for game_completions
-- =====================================================

DROP POLICY IF EXISTS "Users can view own game completions" ON game_completions;
DROP POLICY IF EXISTS "Users can insert own game completions" ON game_completions;

CREATE POLICY "Users can view own game completions"
  ON game_completions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own game completions"
  ON game_completions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- =====================================================
-- STEP 11: RLS Policies for currency_transactions
-- =====================================================

DROP POLICY IF EXISTS "Users can view own currency transactions" ON currency_transactions;
DROP POLICY IF EXISTS "Users can insert own currency transactions" ON currency_transactions;

CREATE POLICY "Users can view own currency transactions"
  ON currency_transactions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own currency transactions"
  ON currency_transactions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- =====================================================
-- STEP 12: Create trigger to update game_progress updated_at
-- =====================================================

CREATE OR REPLACE FUNCTION update_game_progress_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_game_progress_updated_at ON game_progress;
CREATE TRIGGER set_game_progress_updated_at
  BEFORE UPDATE ON game_progress
  FOR EACH ROW
  EXECUTE FUNCTION update_game_progress_timestamp();

-- =====================================================
-- STEP 13: Create view for user game statistics
-- =====================================================

CREATE OR REPLACE VIEW user_game_stats AS
SELECT 
  user_id,
  game_type,
  COUNT(*) as total_completions,
  SUM(score) as total_score,
  AVG(score) as avg_score,
  MIN(time_taken) as best_time,
  MAX(completed_at) as last_played
FROM game_completions
GROUP BY user_id, game_type;

-- Grant access to authenticated users
GRANT SELECT ON user_game_stats TO authenticated;

-- =====================================================
-- STEP 14: Seed initial data (optional)
-- =====================================================

-- Initialize coins and gems for existing users
UPDATE user_profiles
SET coins = COALESCE(coins, 0),
    gems = COALESCE(gems, 0)
WHERE coins IS NULL OR gems IS NULL;

-- =====================================================
-- VERIFICATION QUERIES
-- Run these to verify setup
-- =====================================================

-- Check if all tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name IN ('game_progress', 'game_completions', 'currency_transactions');

-- Check if RLS is enabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
  AND tablename IN ('game_progress', 'game_completions', 'currency_transactions');

-- Check if RPC functions exist
SELECT routine_name 
FROM information_schema.routines 
WHERE routine_schema = 'public' 
  AND routine_name IN ('update_user_coins', 'update_user_gems', 'record_level_completion');

-- =====================================================
-- SUCCESS MESSAGE
-- =====================================================

DO $$
BEGIN
  RAISE NOTICE '✅ Database setup complete!';
  RAISE NOTICE 'Tables created: game_progress, game_completions, currency_transactions';
  RAISE NOTICE 'RPC functions created: update_user_coins, update_user_gems, record_level_completion';
  RAISE NOTICE 'RLS policies enabled on all new tables';
  RAISE NOTICE 'Run verification queries above to confirm setup';
END $$;
