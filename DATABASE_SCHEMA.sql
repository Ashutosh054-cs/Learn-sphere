-- ============================================
-- DATABASE SCHEMA FOR LEARN SPHERE
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- 1. USER PROFILES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  bio TEXT,
  avatar_url TEXT,
  total_focus_minutes INTEGER DEFAULT 0,
  total_sessions INTEGER DEFAULT 0,
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  last_activity_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Row Level Security for user_profiles
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own profile" ON public.user_profiles;
CREATE POLICY "Users can view own profile"
  ON public.user_profiles FOR SELECT
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON public.user_profiles;
CREATE POLICY "Users can update own profile"
  ON public.user_profiles FOR UPDATE
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert own profile" ON public.user_profiles;
CREATE POLICY "Users can insert own profile"
  ON public.user_profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- ============================================
-- 2. FOCUS SESSIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.focus_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  duration_minutes INTEGER NOT NULL,
  session_type TEXT DEFAULT 'focus' CHECK (session_type IN ('focus', 'break', 'long_break')),
  completed BOOLEAN DEFAULT TRUE,
  background_image TEXT,
  notes TEXT,
  started_at TIMESTAMP WITH TIME ZONE NOT NULL,
  completed_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Row Level Security for focus_sessions
ALTER TABLE public.focus_sessions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own sessions" ON public.focus_sessions;
CREATE POLICY "Users can view own sessions"
  ON public.focus_sessions FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own sessions" ON public.focus_sessions;
CREATE POLICY "Users can insert own sessions"
  ON public.focus_sessions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own sessions" ON public.focus_sessions;
CREATE POLICY "Users can update own sessions"
  ON public.focus_sessions FOR UPDATE
  USING (auth.uid() = user_id);

-- Index for faster queries
CREATE INDEX IF NOT EXISTS idx_focus_sessions_user_date 
  ON public.focus_sessions(user_id, completed_at DESC);

-- ============================================
-- 3. ACHIEVEMENTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.achievements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  achievement_type TEXT NOT NULL,
  achievement_name TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  earned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Row Level Security for achievements
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own achievements" ON public.achievements;
CREATE POLICY "Users can view own achievements"
  ON public.achievements FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "System can insert achievements" ON public.achievements;
CREATE POLICY "System can insert achievements"
  ON public.achievements FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- ============================================
-- 4. DAILY ACTIVITY TABLE (for streak calculation)
-- ============================================
CREATE TABLE IF NOT EXISTS public.daily_activity (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  activity_date DATE NOT NULL,
  focus_minutes INTEGER DEFAULT 0,
  sessions_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, activity_date)
);

-- Row Level Security for daily_activity
ALTER TABLE public.daily_activity ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own activity" ON public.daily_activity;
CREATE POLICY "Users can view own activity"
  ON public.daily_activity FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own activity" ON public.daily_activity;
CREATE POLICY "Users can insert own activity"
  ON public.daily_activity FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own activity" ON public.daily_activity;
CREATE POLICY "Users can update own activity"
  ON public.daily_activity FOR UPDATE
  USING (auth.uid() = user_id);

-- Index for streak calculations
CREATE INDEX IF NOT EXISTS idx_daily_activity_user_date 
  ON public.daily_activity(user_id, activity_date DESC);

-- ============================================
-- 5. FUNCTIONS AND TRIGGERS
-- ============================================

-- Function to create user profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (id, email, name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1))
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to auto-create profile
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update user stats after session
CREATE OR REPLACE FUNCTION public.update_user_stats_after_session()
RETURNS TRIGGER AS $$
BEGIN
  -- Update user profile stats
  UPDATE public.user_profiles
  SET 
    total_focus_minutes = total_focus_minutes + NEW.duration_minutes,
    total_sessions = total_sessions + 1,
    last_activity_date = CURRENT_DATE,
    updated_at = NOW()
  WHERE id = NEW.user_id;

  -- Update or insert daily activity
  INSERT INTO public.daily_activity (user_id, activity_date, focus_minutes, sessions_count)
  VALUES (NEW.user_id, DATE(NEW.completed_at), NEW.duration_minutes, 1)
  ON CONFLICT (user_id, activity_date) 
  DO UPDATE SET
    focus_minutes = daily_activity.focus_minutes + NEW.duration_minutes,
    sessions_count = daily_activity.sessions_count + 1;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to update stats after focus session
DROP TRIGGER IF EXISTS on_focus_session_completed ON public.focus_sessions;
CREATE TRIGGER on_focus_session_completed
  AFTER INSERT ON public.focus_sessions
  FOR EACH ROW 
  WHEN (NEW.completed = TRUE AND NEW.session_type = 'focus')
  EXECUTE FUNCTION public.update_user_stats_after_session();

-- Function to calculate current streak
CREATE OR REPLACE FUNCTION public.calculate_user_streak(user_uuid UUID)
RETURNS INTEGER AS $$
DECLARE
  streak INTEGER := 0;
  check_date DATE := CURRENT_DATE;
  has_activity BOOLEAN;
BEGIN
  LOOP
    SELECT EXISTS(
      SELECT 1 FROM public.daily_activity
      WHERE user_id = user_uuid AND activity_date = check_date
    ) INTO has_activity;
    
    EXIT WHEN NOT has_activity;
    
    streak := streak + 1;
    check_date := check_date - INTERVAL '1 day';
  END LOOP;
  
  RETURN streak;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- 6. VIEWS FOR LEADERBOARD
-- ============================================

-- Weekly leaderboard view
CREATE OR REPLACE VIEW public.weekly_leaderboard AS
SELECT 
  u.id,
  u.email,
  u.name,
  u.avatar_url,
  COALESCE(SUM(fs.duration_minutes), 0) as weekly_minutes,
  COALESCE(COUNT(fs.id), 0) as weekly_sessions,
  ROW_NUMBER() OVER (ORDER BY COALESCE(SUM(fs.duration_minutes), 0) DESC) as rank
FROM public.user_profiles u
LEFT JOIN public.focus_sessions fs ON u.id = fs.user_id 
  AND fs.completed_at >= DATE_TRUNC('week', CURRENT_DATE)
  AND fs.completed = TRUE
  AND fs.session_type = 'focus'
GROUP BY u.id, u.email, u.name, u.avatar_url
ORDER BY weekly_minutes DESC
LIMIT 10;

-- Allow authenticated users to view leaderboard
GRANT SELECT ON public.weekly_leaderboard TO authenticated;

-- ============================================
-- 7. INITIAL SEED DATA (Optional)
-- ============================================

-- Achievement types that can be earned
CREATE TABLE IF NOT EXISTS public.achievement_definitions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  achievement_type TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  requirement_value INTEGER
);

INSERT INTO public.achievement_definitions (achievement_type, name, description, icon, requirement_value)
VALUES
  ('first_session', 'First Steps', 'Complete your first focus session', '🎯', 1),
  ('sessions_10', 'Getting Started', 'Complete 10 focus sessions', '⭐', 10),
  ('sessions_50', 'Focused Learner', 'Complete 50 focus sessions', '🔥', 50),
  ('sessions_100', 'Focus Master', 'Complete 100 focus sessions', '💎', 100),
  ('streak_7', 'Week Warrior', 'Maintain a 7-day streak', '📅', 7),
  ('streak_30', 'Month Master', 'Maintain a 30-day streak', '🏆', 30),
  ('minutes_100', 'Century Club', 'Focus for 100 minutes total', '⏱️', 100),
  ('minutes_1000', 'Focus Legend', 'Focus for 1000 minutes total', '👑', 1000)
ON CONFLICT (achievement_type) DO NOTHING;

GRANT SELECT ON public.achievement_definitions TO authenticated;

-- ============================================
-- STEP 12: COMMUNITY / GROUPS
-- ============================================
-- Groups table
CREATE TABLE IF NOT EXISTS public.groups (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  owner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  visibility TEXT DEFAULT 'private' CHECK (visibility IN ('private','public')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.groups ENABLE ROW LEVEL SECURITY;

-- Owner can manage their group; authenticated users can view public groups
DROP POLICY IF EXISTS "Owners can manage groups" ON public.groups;
CREATE POLICY "Owners can manage groups"
  ON public.groups FOR ALL
  USING (auth.uid() = owner_id)
  WITH CHECK (auth.uid() = owner_id);

DROP POLICY IF EXISTS "Authenticated can view public groups" ON public.groups;
CREATE POLICY "Authenticated can view public groups"
  ON public.groups FOR SELECT
  USING (visibility = 'public' OR auth.uid() = owner_id);

-- Group members
CREATE TABLE IF NOT EXISTS public.group_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  group_id UUID REFERENCES public.groups(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role TEXT DEFAULT 'member' CHECK (role IN ('member','admin','owner')),
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(group_id, user_id)
);

ALTER TABLE public.group_members ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Members can select their membership" ON public.group_members;
CREATE POLICY "Members can select their membership"
  ON public.group_members FOR SELECT
  USING (auth.uid() = user_id OR EXISTS (SELECT 1 FROM public.groups g WHERE g.id = group_members.group_id AND (g.owner_id = auth.uid() OR g.visibility = 'public')));

DROP POLICY IF EXISTS "Members can insert membership" ON public.group_members;
CREATE POLICY "Members can insert membership"
  ON public.group_members FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Members can delete membership" ON public.group_members;
CREATE POLICY "Members can delete membership"
  ON public.group_members FOR DELETE
  USING (auth.uid() = user_id OR EXISTS (SELECT 1 FROM public.groups g WHERE g.id = group_members.group_id AND g.owner_id = auth.uid()));

-- Group attendance
CREATE TABLE IF NOT EXISTS public.group_attendance (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  group_id UUID REFERENCES public.groups(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  attended_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  notes TEXT
);

ALTER TABLE public.group_attendance ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Attendance insert by members" ON public.group_attendance;
CREATE POLICY "Attendance insert by members"
  ON public.group_attendance FOR INSERT
  WITH CHECK (auth.uid() = user_id AND EXISTS (SELECT 1 FROM public.group_members gm WHERE gm.group_id = group_attendance.group_id AND gm.user_id = user_id));

DROP POLICY IF EXISTS "Attendance select by members" ON public.group_attendance;
CREATE POLICY "Attendance select by members"
  ON public.group_attendance FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.group_members gm WHERE gm.group_id = group_attendance.group_id AND gm.user_id = auth.uid()) OR EXISTS (SELECT 1 FROM public.groups g WHERE g.id = group_attendance.group_id AND g.owner_id = auth.uid()));

-- Group rules
CREATE TABLE IF NOT EXISTS public.group_rules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  group_id UUID REFERENCES public.groups(id) ON DELETE CASCADE NOT NULL,
  rule_key TEXT NOT NULL,
  rule_value TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.group_rules ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Rules select" ON public.group_rules;
CREATE POLICY "Rules select"
  ON public.group_rules FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.group_members gm WHERE gm.group_id = group_rules.group_id AND gm.user_id = auth.uid()) OR EXISTS (SELECT 1 FROM public.groups g WHERE g.id = group_rules.group_id AND g.owner_id = auth.uid()));

DROP POLICY IF EXISTS "Rules modify" ON public.group_rules;
CREATE POLICY "Rules modify"
  ON public.group_rules FOR ALL
  USING (EXISTS (SELECT 1 FROM public.groups g WHERE g.id = group_rules.group_id AND g.owner_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM public.groups g WHERE g.id = group_rules.group_id AND g.owner_id = auth.uid()));

-- Group invites
CREATE TABLE IF NOT EXISTS public.group_invites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  group_id UUID REFERENCES public.groups(id) ON DELETE CASCADE NOT NULL,
  invited_email TEXT NOT NULL,
  invited_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  token TEXT UNIQUE NOT NULL,
  accepted BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.group_invites ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Invites manage" ON public.group_invites;
CREATE POLICY "Invites manage"
  ON public.group_invites FOR ALL
  USING (EXISTS (SELECT 1 FROM public.groups g WHERE g.id = group_invites.group_id AND g.owner_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM public.groups g WHERE g.id = group_invites.group_id AND g.owner_id = auth.uid()));

-- Trigger: add owner as member when group created
CREATE OR REPLACE FUNCTION public.add_owner_as_member()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.group_members (group_id, user_id, role)
  VALUES (NEW.id, NEW.owner_id, 'owner')
  ON CONFLICT (group_id, user_id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_group_created ON public.groups;
CREATE TRIGGER on_group_created
  AFTER INSERT ON public.groups
  FOR EACH ROW EXECUTE FUNCTION public.add_owner_as_member();

