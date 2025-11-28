# 🔐 Authentication Fix Guide

## ❌ Error You're Seeing

```
POST https://your-project.supabase.co/auth/v1/signup?redirect_to=http://localhost:5173/dashboard 
net::ERR_NAME_NOT_RESOLVED
```

**Root Cause:** You're using placeholder Supabase credentials in `.env.local`

---

## ✅ Step-by-Step Fix

### **Step 1: Get Your Supabase Credentials**

1. Go to **https://supabase.com/dashboard**
2. **Create a new project** (if you don't have one):
   - Click "New Project"
   - Enter project name: `learnsphere`
   - Enter database password (save this!)
   - Select region closest to you
   - Click "Create new project"
   - Wait 2-3 minutes for project to initialize

3. **Get your API credentials:**
   - In your project dashboard, go to **Settings** (⚙️ icon in sidebar)
   - Click **API** in the left menu
   - You'll see two values:
     - **Project URL** (looks like: `https://abcdefghijklm.supabase.co`)
     - **anon public** key (long string starting with `eyJ...`)

---

### **Step 2: Update `.env.local` File**

Open `c:\Users\dines\OneDrive\Desktop\LearnSphere\.env.local` and replace with your **real** values:

```env
VITE_SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.YOUR_ACTUAL_KEY_HERE
```

**Example (with fake values):**
```env
VITE_SUPABASE_URL=https://xyzproject123.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh5enByb2plY3QxMjMiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTYzODk2NjQwMCwiZXhwIjoxOTU0NTQyNDAwfQ.dGhpc2lzYWZha2VrZXlmb3JleGFtcGxlb25seQ
```

---

### **Step 3: Configure Supabase Auth Settings**

1. In Supabase dashboard, go to **Authentication** (shield icon in sidebar)
2. Click **URL Configuration** in the left menu
3. Under **Redirect URLs**, add your local development URLs:
   ```
   http://localhost:5173/**
   http://localhost:5174/**
   ```
4. Click **Save**

5. *(Optional)* If you want to skip email confirmation during development:
   - Go to **Authentication** → **Providers** → **Email**
   - Scroll down to **Email Templates**
   - Toggle **Confirm email** to OFF
   - Click **Save**

---

### **Step 4: Restart Dev Server**

Stop your current dev server (`Ctrl+C` in terminal) and restart:

```powershell
npm run dev
```

---

### **Step 5: Test Authentication**

1. Open http://localhost:5173/ (or whatever port Vite shows)
2. Click **Signup** or **Login**
3. Enter email and password
4. Click **Sign Up**

**You should now be able to authenticate successfully!** ✅

---

## 🐛 Additional Troubleshooting

### Issue: "Invalid login credentials"
**Fix:** Make sure you're using the correct email/password. If signing up for the first time, the account should be created.

### Issue: "Email not confirmed"
**Fix:** 
- Option 1: Check your email inbox for confirmation link
- Option 2: Disable email confirmation (see Step 3 above)

### Issue: Still getting `ERR_NAME_NOT_RESOLVED`
**Fix:** Double-check that:
1. `.env.local` has NO placeholder values (no `your-project`, no `your-anon-key`)
2. You restarted the dev server after editing `.env.local`
3. Your Supabase project is active (not paused)

### Issue: "Invalid JWT token" or "Invalid API key"
**Fix:** You copied the wrong key. Make sure you're using the **anon public** key, NOT the **service_role** key.

---

## 📋 Quick Checklist

- [ ] Created Supabase project at https://supabase.com/dashboard
- [ ] Copied Project URL from Settings → API
- [ ] Copied anon public key from Settings → API
- [ ] Updated `.env.local` with real values
- [ ] Added `http://localhost:5173/**` to Supabase Auth Redirect URLs
- [ ] Added `http://localhost:5174/**` to Supabase Auth Redirect URLs
- [ ] Restarted dev server (`npm run dev`)
- [ ] Tested signup at http://localhost:5173/signup

---

## 🎯 What Happens Next

Once authentication works:
- You can create an account
- Login to access protected routes
- Navigate to `/learn` to play the HTML Structure Builder game
- Your progress will be saved to Supabase (after setting up database schema)

---

## 🗄️ Optional: Set Up Database Schema

To enable progress tracking and leaderboards, run the SQL schema:

1. Go to Supabase Dashboard → **SQL Editor**
2. Click **+ New query**
3. Paste the contents from `docs/DATABASE_SCHEMA.sql` (if it exists)
4. Click **Run**

This creates the tables for:
- Games metadata
- Game levels
- User progress tracking
- Leaderboards

---

**Need help?** The error messages in the browser console will now be much clearer after the code updates!
