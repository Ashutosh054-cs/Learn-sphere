# 🚀 Setup Instructions: Real Database Integration

## What Changed

Your dashboard now uses **real data from Supabase** instead of mock data:

✅ **Streak tracking** - Calculated from actual daily activity  
✅ **Focus sessions** - Saved and tracked in database  
✅ **Leaderboard** - Based on weekly focus minutes  
✅ **User stats** - All zeros for new users (no fake data!)

---

## Step 1: Run the Database Schema

1. **Go to Supabase Dashboard**: https://supabase.com/dashboard
2. Select your project
3. Click **SQL Editor** in the left sidebar
4. Click **New Query**
5. **Copy the entire contents** of `DATABASE_SCHEMA.sql`
6. **Paste** into the SQL Editor
7. Click **Run** (or press `Ctrl+Enter`)

This will create:
- `user_profiles` table
- `focus_sessions` table  
- `daily_activity` table
- `achievements` tables
- Auto-triggers to update stats
- Leaderboard view
- Streak calculation function

---

## Step 2: Verify Setup

Check that tables were created:

1. Go to **Table Editor** in Supabase
2. You should see:
   - `user_profiles`
   - `focus_sessions`
   - `daily_activity`
   - `achievements`
   - `achievement_definitions`

---

## Step 3: Test the Dashboard

1. **Refresh your app**: http://localhost:5173
2. **Login** to your account
3. You should see:
   - ✅ All stats at **0** (no fake data!)
   - ✅ "Unranked" on leaderboard
   - ✅ Empty leaderboard message

---

## Step 4: Complete Your First Focus Session

1. Go to **Focus** page
2. Click **Start Focus**
3. Let the timer run (or wait for it to complete)
4. When done, the session will be **automatically saved** to database
5. Go back to **Dashboard**
6. You should now see:
   - ✅ Today's focus minutes updated
   - ✅ Total sessions incremented
   - ✅ Your name appears on leaderboard!

---

## How It Works

### When You Complete a Focus Session:

1. **Session saved** to `focus_sessions` table
2. **Trigger fires** to update stats:
   - `user_profiles.total_sessions` +1
   - `user_profiles.total_focus_minutes` + duration
   - `daily_activity` updated for today
3. **Leaderboard recalculates** automatically
4. **Streak calculated** based on consecutive days with activity

### Dashboard Loading:

- Fetches **user stats** from `user_profiles`
- Calculates **current streak** using SQL function
- Gets **today's minutes** from `focus_sessions`
- Loads **weekly leaderboard** from view
- All data is **real-time** from your database!

---

## Troubleshooting

### "Loading dashboard..." forever
- Check browser console for errors
- Verify SQL schema ran successfully
- Make sure you're logged in

### Stats not updating after focus session
- Check that `DATABASE_SCHEMA.sql` created the triggers
- Look for errors in Supabase logs
- Verify RLS policies are correct

### Leaderboard empty
- This is normal if no one has completed sessions this week!
- Complete a focus session to appear on the board

---

## Next Steps

Your database is now fully integrated! Here's what you can do:

1. **Complete focus sessions** to build your stats
2. **Maintain daily streaks** to earn achievements  
3. **Compete on leaderboard** with other users
4. **Track your progress** over time

All data is persistent and tied to your Supabase account. No more fake data! 🎉
