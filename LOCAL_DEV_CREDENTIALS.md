# 🔐 Local Development Credentials

## Admin Login (For Collaborators)

Use these credentials to log in locally without Supabase backend:

```
Email: admin@learnsphere.local
Password: LearnSphere2024!
```

---

## How to Use

1. **Start the development server:**
   ```bash
   npm run dev
   ```

2. **Navigate to login page:**
   - Open http://localhost:5173/login

3. **Enter credentials:**
   - Email: `admin@learnsphere.local`
   - Password: `LearnSphere2024!`

4. **Click "Sign In"**
   - You'll be automatically logged in without needing Supabase

---

## Important Notes

⚠️ **DEV_MODE is currently ENABLED**
- The app is running in local development mode
- No Supabase connection required
- All collaborators share the same admin account
- Data is stored in browser localStorage only

🔧 **To Enable Real Backend:**
1. Get Supabase credentials from your collaborator
2. Update `.env` file with:
   ```
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```
3. Open `src/stores/authStore.js`
4. Change `const DEV_MODE = true` to `const DEV_MODE = false`
5. Restart the dev server

---

## Features Available in DEV_MODE

✅ **Working:**
- Login with admin credentials
- Full UI access (Dashboard, Focus, Learn, etc.)
- All frontend features
- localStorage persistence

❌ **Not Working:**
- Real user authentication
- Database persistence
- Leaderboard (no real users)
- User profiles (mock data only)
- Backend services (focus sessions, achievements, etc.)

---

## Troubleshooting

### "Invalid credentials" error
- Make sure you're typing the credentials exactly:
  - Email: `admin@learnsphere.local` (all lowercase)
  - Password: `LearnSphere2024!` (case-sensitive, includes exclamation)

### Still seeing login page after signing in
- Check browser console for errors
- Clear localStorage: `localStorage.clear()` in browser console
- Refresh the page

### Want to log out
- Click your profile in the navbar
- Click "Sign Out"
- Or clear localStorage manually

---

## File Modified

**`src/stores/authStore.js`**
- Added `DEV_MODE` flag at the top
- Added `ADMIN_CREDENTIALS` object with hardcoded credentials
- Modified `initialize()`, `signIn()`, `signOut()`, `signUp()` to check DEV_MODE

---

**Last Updated:** November 28, 2025
**Version:** Local Dev v1.0
