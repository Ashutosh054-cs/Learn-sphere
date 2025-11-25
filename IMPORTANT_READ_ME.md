# ⚠️ CRITICAL: Fix 406 Errors - Step by Step

## 406 Error = Permission Denied by Database

Your queries are being **blocked** by Row Level Security policies. Follow these steps **IN ORDER**:

---

## 🔧 STEP 1: Verify Database Setup

Run `VERIFY_DATABASE.sql` in Supabase SQL Editor to diagnose the issue:

1. Open: https://supabase.com/dashboard/project/lrnbfmafelgcdyqvvzas
2. Click **"SQL Editor"** → **"New Query"**
3. Copy ALL queries from `VERIFY_DATABASE.sql` 
4. Run them **ONE BY ONE** and note the results

**What to look for:**
- ✅ If tables exist → Good, move to Step 2
- ❌ If tables DON'T exist → Run `DATABASE_SCHEMA.sql` first, then restart from Step 1

---

## 🔧 STEP 2: Fix RLS Policies

Run `FIX_RLS_POLICIES.sql`:

1. In Supabase SQL Editor, click **"New Query"**
2. Copy and paste **ALL** content from `FIX_RLS_POLICIES.sql`
3. Click **"RUN"** (bottom right)
4. Look for **"Success. No rows returned"** message

**What this does:**
- Removes old restrictive policy (users can only view own profile)
- Adds new policy (authenticated users can view all profiles for leaderboard)
- **Security preserved:** Users still can only UPDATE/INSERT their own profile

---

## 🔧 STEP 3: Create Your User Profile

If you signed up **before** running the schema, your profile doesn't exist yet!

Run `CREATE_USER_PROFILE.sql`:

1. **IMPORTANT:** Edit the SQL file first:
   - Replace `'3b8c5f06-7d96-4b5c-8eaf-c3e30bd8eccc'` with your actual user ID (from error message)
   - Replace `'your-email@example.com'` with your actual email
   - Replace `'Your Name'` with your actual name

2. In Supabase SQL Editor, click **"New Query"**
3. Copy the **EDITED** content from `CREATE_USER_PROFILE.sql`
4. Click **"RUN"**

---

## ✅ STEP 4: Verify Fix

1. **Refresh your browser** at http://localhost:5174
2. **Check console** - 406 errors should be GONE
3. **Dashboard should load** with your stats

---

## 🚨 Still Getting 406 Errors?

Run this quick test in Supabase SQL Editor:

```sql
SELECT * FROM public.user_profiles WHERE id = '3b8c5f06-7d96-4b5c-8eaf-c3e30bd8eccc';
```

- ✅ **Returns data?** → RLS is fixed, profile exists
- ❌ **Returns nothing?** → Profile doesn't exist, run Step 3
- ❌ **Error?** → RLS not fixed, run Step 2 again

---

## Previous Setup (Already Done):

### Database Schema - ✅ COMPLETED
You already ran `DATABASE_SCHEMA.sql` which created:
- All database tables (user_profiles, focus_sessions, daily_activity, etc.)
- Automatic triggers for stat updates
- Leaderboard view
- Basic Row Level Security policies

---

## What I Fixed Earlier:

### Infinite Toast Loop - SOLVED! 🎉

**Problem**: Dashboard was calling `loadDashboardData()` repeatedly, creating hundreds of toast notifications

**Solution**:
- Added `isLoadingData` state to prevent multiple simultaneous loads
- Changed useEffect dependency to only trigger on `user` change
- Added 100ms delay to prevent cascading renders
- Added early return if already loading

**Result**: Only ONE toast notification per dashboard load now!

---

## Next Steps:

1. Run the DATABASE_SCHEMA.sql (instructions above)
2. Test the focus timer
3. Click "Complete" to save a session
4. Check Dashboard - your minutes should appear!

All the code is ready and working - just needs the database tables! 🚀
