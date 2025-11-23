# Authentication Flow - How It Works

## ✅ What's Been Implemented:

### 1. **Session Persistence**
- User sessions are automatically saved in Supabase
- When you close and reopen the app, you stay logged in
- No need to login again until you explicitly logout

### 2. **Protected Routes**
- All routes (Dashboard, Focus, About, etc.) require authentication
- If not logged in, users are redirected to `/login`
- After login/signup, users go directly to Dashboard

### 3. **Sign Up Flow**
- Users create account with name, email, and password
- Supabase sends verification email (check spam folder)
- User can login immediately after signup
- Success message shows: "Account created successfully! Redirecting..."

### 4. **Login Flow**
- Users login with email and password
- Session is saved automatically
- Redirects to Dashboard with personalized welcome message

### 5. **Personalized Experience**
- Dashboard shows: "Welcome back, [Your Name]! 👋"
- Navbar shows user's first letter in avatar
- Name comes from signup data or email username

### 6. **Logout**
- Click "Logout" button in navbar
- Clears session from Supabase
- Redirects to login page
- Must login again to access app

## 🚀 How to Test:

### First Time Setup:
1. Make sure you've run the SQL schema in Supabase (from SUPABASE_SETUP.md)
2. Your `.env.local` has correct Supabase credentials
3. Restart dev server: `npm run dev`

### Test Sign Up:
1. Go to http://localhost:5173/signup
2. Fill in name, email, password
3. Click "Create Account"
4. You'll see success message
5. Check email for verification (optional for now)
6. Automatically redirected to Dashboard

### Test Login:
1. Go to http://localhost:5173/login
2. Enter your email and password
3. Click "Sign In"
4. Redirected to Dashboard with your name

### Test Session Persistence:
1. Login to the app
2. Close the browser/tab completely
3. Open http://localhost:5173
4. Click any protected route (Dashboard, Focus, etc.)
5. You should still be logged in! ✨

### Test Logout:
1. Click "Logout" in navbar
2. You're redirected to login
3. Try accessing Dashboard - you'll be sent back to login

## 📝 Important Notes:

### Email Verification:
- Supabase sends verification emails by default
- Users can login before verifying (current setup)
- To require verification, update auth policies in Supabase

### Password Reset:
- Available at `/forgot-password` (needs implementation)
- Use `useAuthStore().resetPassword(email)` method

### User Data Storage:
- User profile created automatically on signup (via trigger)
- Stored in `profiles` table with name, email, avatar, score, etc.
- Access via `useAuthStore().user`

## 🔧 Troubleshooting:

**"Missing Supabase environment variables"**
- Check `.env.local` file exists
- Verify VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set
- Restart dev server after adding env vars

**"Invalid login credentials"**
- Make sure user account exists (try signup first)
- Check password is correct
- Verify email in Supabase Auth dashboard

**Not redirecting after login**
- Check browser console for errors
- Verify routes are set up correctly in App.jsx
- Make sure all protected routes wrap components in `<ProtectedRoute>`

**Session not persisting**
- Check browser localStorage (should see supabase keys)
- Verify Supabase URL is correct
- Clear browser cache and try again

## 🎯 Next Steps (Optional Enhancements):

1. **Email Verification Required**: Force users to verify email before accessing app
2. **Password Reset Page**: Create forgot-password flow
3. **Social Login**: Add Google/GitHub login options
4. **Profile Page**: Let users update name, avatar, preferences
5. **Remember Me**: Add checkbox to extend session duration
