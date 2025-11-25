-- ============================================
-- MANUALLY CREATE USER PROFILE
-- ============================================
-- Use this if your user profile doesn't exist yet
-- This can happen if you signed up before running DATABASE_SCHEMA.sql

-- Replace these values with your actual user data:
-- YOUR_USER_ID: Get this from auth.users table or from the error message (3b8c5f06-7d96-4b5c-8eaf-c3e30bd8eccc)
-- YOUR_EMAIL: Your login email
-- YOUR_NAME: Your display name (optional)

INSERT INTO public.user_profiles (
  id, 
  email, 
  name,
  total_focus_minutes,
  total_sessions,
  current_streak,
  longest_streak,
  last_activity_date,
  created_at,
  updated_at
)
VALUES (
  '3b8c5f06-7d96-4b5c-8eaf-c3e30bd8eccc',  -- Replace with your user ID
  'your-email@example.com',                  -- Replace with your email
  'Your Name',                                -- Replace with your name
  0,
  0,
  0,
  0,
  NULL,
  NOW(),
  NOW()
)
ON CONFLICT (id) DO UPDATE SET
  updated_at = NOW();

-- After running this, refresh your browser and the 406 errors should be gone!
