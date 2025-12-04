# Supabase Authentication Integration Guide

## ✅ Setup Complete

Your Learn Sphere app now has full Supabase authentication integrated!

## 🔑 What's Been Configured

### 1. **Database Schema** (`DATABASE_SCHEMA.sql`)
- ✅ User profiles table with RLS policies
- ✅ Focus sessions tracking
- ✅ Achievements system
- ✅ Daily activity for streak tracking
- ✅ Leaderboard view
- ✅ Automatic profile creation trigger (`handle_new_user()`)

### 2. **Authentication Flow**
- ✅ Sign up with email/password
- ✅ Sign in with email/password
- ✅ Sign out
- ✅ Password reset
- ✅ Protected routes
- ✅ Automatic session management

### 3. **Supabase Services** (`src/services/supabaseService.js`)
- ✅ User profile operations (get, update, stats)
- ✅ Focus session management
- ✅ Streak calculation
- ✅ Leaderboard queries
- ✅ Achievement tracking

### 4. **Auth Store** (`src/stores/authStore.js`)
- ✅ Zustand store for auth state
- ✅ Dev mode fallback (if Supabase not configured)
- ✅ Production mode with real Supabase

### 5. **Auth Context** (`src/contexts/AuthContext.jsx`)
- ✅ React context for auth state
- ✅ Event listeners for auth changes
- ✅ Centralized auth management

### 6. **Protected Routes** (`src/components/ProtectedRoute.jsx`)
- ✅ Redirects unauthenticated users to login
- ✅ Shows loading state
- ✅ Preserves attempted route

## 🚀 How to Use

### Sign Up a New User

```javascript
import { useAuthStore } from './stores/authStore'

const signUp = useAuthStore(state => state.signUp)

// In your component
const { data, error } = await signUp(email, password, { name: userName })

if (error) {
  console.error('Signup failed:', error)
} else {
  console.log('User created:', data.user)
  // User profile automatically created by database trigger!
}
```

### Sign In

```javascript
import { useAuthStore } from './stores/authStore'

const signIn = useAuthStore(state => state.signIn)

const { data, error } = await signIn(email, password)

if (error) {
  console.error('Login failed:', error)
} else {
  console.log('Logged in:', data.user)
  // Redirect to dashboard
}
```

### Access User Data

```javascript
import { useAuthStore } from './stores/authStore'

function MyComponent() {
  const user = useAuthStore(state => state.user)
  const loading = useAuthStore(state => state.loading)
  
  if (loading) return <div>Loading...</div>
  if (!user) return <div>Not logged in</div>
  
  return <div>Welcome, {user.email}!</div>
}
```

### Using Supabase Services

```javascript
import { userService, focusService } from './services/supabaseService'

// Get user profile
const { data: profile, error } = await userService.getProfile(userId)

// Create focus session
const sessionData = {
  duration_minutes: 25,
  session_type: 'focus',
  completed: true,
  started_at: new Date().toISOString(),
  completed_at: new Date().toISOString()
}
await focusService.createSession(userId, sessionData)

// Get today's focus time
const { data: minutes } = await focusService.getTodayFocusTime(userId)
```

## 📊 Database Trigger Magic

When a user signs up:
1. Supabase creates the auth user
2. `handle_new_user()` trigger fires automatically
3. A profile is created in `user_profiles` table
4. User can immediately start using the app!

No manual profile creation needed! ✨

## 🔒 Row Level Security (RLS)

All tables have RLS policies:
- Users can only see/edit their own data
- Leaderboard is publicly readable
- Automatic security enforcement by Supabase

## 🧪 Testing Your Setup

1. **Run the SQL in Supabase**:
   - Go to https://kbduyhatydsttfwpxgke.supabase.co
   - Open SQL Editor
   - Copy/paste entire `DATABASE_SCHEMA.sql`
   - Click "Run"

2. **Start the dev server**:
   ```bash
   npm run dev
   ```

3. **Test signup**:
   - Navigate to `/signup`
   - Create an account
   - Should redirect to dashboard after success

4. **Verify in Supabase Dashboard**:
   - Go to Authentication > Users
   - Check your new user appears
   - Go to Table Editor > user_profiles
   - Verify profile was auto-created!

## 🛠️ Environment Variables

Make sure `.env.local` has:
```env
VITE_SUPABASE_URL=https://kbduyhatydsttfwpxgke.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

After changing `.env.local`, restart your dev server!

## 🎯 Next Steps

1. ✅ Run `DATABASE_SCHEMA.sql` in Supabase (if you haven't already)
2. ✅ Test signup/login flow
3. ✅ Integrate focus session creation in your Focus page
4. ✅ Display user stats on Dashboard
5. ✅ Show leaderboard
6. ✅ Award achievements based on milestones

## 📝 Key Files

- `src/lib/supabase.js` - Supabase client initialization
- `src/stores/authStore.js` - Auth state management
- `src/contexts/AuthContext.jsx` - Auth React context
- `src/services/supabaseService.js` - Database operations
- `src/components/ProtectedRoute.jsx` - Route protection
- `DATABASE_SCHEMA.sql` - Complete database setup

## 🐛 Troubleshooting

**Problem**: "Supabase env vars missing" warning
- **Solution**: Check `.env.local` exists and has correct values
- Restart dev server after changing `.env.local`

**Problem**: 500 error on signup
- **Solution**: Run `DATABASE_SCHEMA.sql` in Supabase SQL Editor
- The `handle_new_user()` trigger must exist!

**Problem**: User can sign up but no profile created
- **Solution**: Check Supabase logs for trigger errors
- Verify RLS policies allow INSERT into user_profiles

**Problem**: Can't query user_profiles
- **Solution**: Check RLS policies
- Use authenticated Supabase client
- Verify `auth.uid()` matches user ID

## 🎉 You're Ready!

Your authentication system is now fully integrated with Supabase and connected to your database tables!
