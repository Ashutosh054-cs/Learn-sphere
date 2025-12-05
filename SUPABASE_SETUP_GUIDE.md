# 🚀 Supabase Database Setup Guide

Follow these steps to set up your LearnSphere database in Supabase.

---

## ✅ **Step 1: Create Supabase Project**

1. Go to [https://app.supabase.com](https://app.supabase.com)
2. Sign in (or create account if new)
3. Click **"New Project"**
4. Fill in project details:
   - **Name:** `learnsphere` (or your preferred name)
   - **Database Password:** Create a strong password (save it securely!)
   - **Region:** Choose closest to your users (e.g., US East, EU West)
   - **Pricing Plan:** Free tier (sufficient for development)
5. Click **"Create new project"**
6. ⏱️ **Wait 1-2 minutes** for project initialization

---

## ✅ **Step 2: Get API Credentials**

1. Once project is ready, go to **Project Settings** (gear icon in sidebar)
2. Navigate to **API** section
3. Copy these two values:

   **Project URL:**
   ```
   https://xxxxxxxxxxxxx.supabase.co
   ```

   **anon/public key:** (under "Project API keys")
   ```
   eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

---

## ✅ **Step 3: Update Environment Variables**

1. Open `.env` file in your project root
2. Replace placeholder values with your actual credentials:

```env
VITE_SUPABASE_URL=https://your-actual-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-actual-anon-key-here
```

3. **Save the file**
4. ⚠️ **DO NOT commit `.env` to Git** (it's already in `.gitignore`)

---

## ✅ **Step 4: Run Database Setup SQL**

### Option A: Using Supabase Dashboard (Recommended)

1. In your Supabase project, go to **SQL Editor** (left sidebar)
2. Click **"New Query"**
3. Open `database/COMPLETE_DATABASE_SETUP.sql` from this project
4. **Copy the entire contents** of the SQL file
5. **Paste** into Supabase SQL Editor
6. Click **"Run"** (or press `Ctrl+Enter`)
7. ✅ You should see success messages in the Results panel

### Option B: Using Supabase CLI

```powershell
# Install Supabase CLI (if not installed)
npm install -g supabase

# Login to Supabase
supabase login

# Link your project
supabase link --project-ref your-project-id

# Run migrations
supabase db push
```

---

## ✅ **Step 5: Verify Database Setup**

Run these verification queries in Supabase SQL Editor:

### Check Tables Created
```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name IN ('game_progress', 'game_completions', 'currency_transactions', 'user_profiles');
```

**Expected Result:** 4 rows showing all table names

### Check RLS Enabled
```sql
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
  AND tablename IN ('game_progress', 'game_completions', 'currency_transactions');
```

**Expected Result:** All tables show `rowsecurity = true`

### Check RPC Functions
```sql
SELECT routine_name 
FROM information_schema.routines 
WHERE routine_schema = 'public' 
  AND routine_name IN ('update_user_coins', 'update_user_gems', 'record_level_completion');
```

**Expected Result:** 3 functions listed

---

## ✅ **Step 6: Set Up Storage Bucket (For Profile Avatars)**

1. Go to **Storage** in Supabase sidebar
2. Click **"Create a new bucket"**
3. Bucket settings:
   - **Name:** `user-uploads`
   - **Public bucket:** ✅ Check this (for avatar URLs)
   - **File size limit:** `2MB`
   - **Allowed MIME types:** `image/png, image/jpeg, image/jpg, image/webp`
4. Click **"Create bucket"**

### Set Storage Policies

In the bucket settings, add these policies:

**Policy 1: Users can upload their own files**
```sql
CREATE POLICY "Users can upload own files"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'user-uploads' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);
```

**Policy 2: Anyone can view uploaded files**
```sql
CREATE POLICY "Public access to user uploads"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'user-uploads');
```

**Policy 3: Users can update their own files**
```sql
CREATE POLICY "Users can update own files"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'user-uploads' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);
```

**Policy 4: Users can delete their own files**
```sql
CREATE POLICY "Users can delete own files"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'user-uploads' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);
```

---

## ✅ **Step 7: Test the Connection**

1. **Restart your dev server:**
   ```powershell
   npm run dev
   ```

2. **Open the app** in browser: `http://localhost:5173`

3. **Sign up with a new account** (or use local dev mode)

4. **Check Supabase dashboard:**
   - Go to **Authentication** → Should see your new user
   - Go to **Table Editor** → `user_profiles` → Should see a profile row

---

## ✅ **Step 8: Disable Local Dev Mode (Production)**

Once database is working, disable local dev mode:

1. Open `src/stores/authStore.js`
2. Change `DEV_MODE` to `false`:
   ```javascript
   const DEV_MODE = false; // ← Change to false
   ```
3. Save and test authentication with real Supabase

---

## 🎯 **Database Schema Overview**

### Tables Created

| Table | Purpose | Key Columns |
|-------|---------|-------------|
| `user_profiles` | User data, XP, coins, gems | `id`, `name`, `coins`, `gems`, `total_xp` |
| `focus_sessions` | Pomodoro session tracking | `user_id`, `duration`, `completed_at` |
| `game_progress` | Current game state | `user_id`, `game_type`, `current_level`, `total_xp` |
| `game_completions` | Level completion history | `user_id`, `game_type`, `level_id`, `score`, `time_taken` |
| `currency_transactions` | Coin/gem transaction log | `user_id`, `currency_type`, `amount`, `reason` |

### RPC Functions

| Function | Purpose | Parameters |
|----------|---------|------------|
| `update_user_coins` | Add/subtract coins | `p_user_id`, `p_amount` |
| `update_user_gems` | Add/subtract gems | `p_user_id`, `p_amount` |
| `record_level_completion` | Log level completion | `p_user_id`, `p_game_type`, `p_level_id`, `p_score`, `p_time_taken` |

---

## 🚨 **Troubleshooting**

### Error: "relation 'user_profiles' does not exist"

**Solution:** The `user_profiles` table needs to be created first. Run this SQL:

```sql
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT,
  bio TEXT,
  avatar_url TEXT,
  total_xp INTEGER DEFAULT 0,
  coins INTEGER DEFAULT 0,
  gems INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON user_profiles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile"
  ON user_profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own profile"
  ON user_profiles FOR UPDATE
  USING (auth.uid() = user_id);
```

### Error: "permission denied for table..."

**Solution:** RLS policies might be too restrictive. Check policies in Supabase Dashboard under **Authentication** → **Policies**.

### Error: "Invalid API key"

**Solution:** 
1. Check `.env` has correct `VITE_SUPABASE_ANON_KEY`
2. Restart dev server after changing `.env`
3. Verify key in Supabase Project Settings → API

### Connection Timeout

**Solution:**
1. Check internet connection
2. Verify `VITE_SUPABASE_URL` is correct
3. Check Supabase project status (not paused)

---

## 📊 **What Happens Next?**

Once database is set up:

✅ Authentication will work with real Supabase (signup/login)  
✅ Dashboard will load real user stats (coins, gems, XP)  
✅ Focus sessions will be tracked in database  
✅ Game progress will persist across sessions  
✅ Leaderboards will show real user rankings  
✅ Profile avatars will upload to Supabase Storage  

---

## 🎉 **Success Checklist**

- [ ] Supabase project created
- [ ] `.env` file updated with credentials
- [ ] Database setup SQL executed successfully
- [ ] All tables created (verified with query)
- [ ] RLS policies enabled
- [ ] RPC functions created
- [ ] Storage bucket `user-uploads` created
- [ ] Storage policies configured
- [ ] Dev server restarted
- [ ] Test signup/login works
- [ ] Dashboard loads without errors

---

## 📚 **Additional Resources**

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase RLS Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [Supabase Storage Guide](https://supabase.com/docs/guides/storage)
- [LearnSphere Backend Integration Docs](./BACKEND_INTEGRATION_COMPLETE.md)

---

**Need Help?** Check the [troubleshooting section](#-troubleshooting) or review the [backend integration documentation](./BACKEND_INTEGRATION_COMPLETE.md).
