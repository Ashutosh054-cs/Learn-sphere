# 🎮 LearnSphere Games - Setup Guide

## ✅ What I Just Fixed

### 1. **Created `.env.local` File** (Critical)
The app needs Supabase credentials to run properly. I created the file with placeholder values.

**ACTION REQUIRED:**
```bash
# Open .env.local and replace with your actual Supabase credentials:
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

**Get your credentials:**
1. Go to https://supabase.com/dashboard
2. Select your project (or create one)
3. Go to Settings → API
4. Copy "Project URL" → Replace `VITE_SUPABASE_URL`
5. Copy "anon public" key → Replace `VITE_SUPABASE_ANON_KEY`

---

### 2. **Added `/learn` Routes** ✅
Added two new routes to `App.jsx`:
- `/learn` → Game catalog page
- `/learn/html-builder` → HTML Structure Builder game

---

### 3. **Created `Learn.jsx` Page** ✅
Main game catalog showing:
- ✅ HTML Structure Builder (fully implemented, 10 levels)
- 🚧 CSS Selector Battle (coming soon)
- 🚧 JS Puzzle Maze (coming soon)

---

### 4. **Added CSS Variables** ✅
Added game difficulty colors to `src/index.css`:
```css
--game-easy: #4ADE80;       /* Green */
--game-medium: #FBBF24;     /* Amber */
--game-advanced: #F87171;   /* Red */
```

---

## 🚀 How to Run

### 1. Install Dependencies (if not already done)
```bash
npm install
```

### 2. Configure Environment Variables
Edit `.env.local` with your Supabase credentials (see instructions above).

### 3. Start Dev Server
```bash
npm run dev
```

Server will run at: **http://localhost:5173** (or 5174 if 5173 is busy)

---

## 🎮 How to Access the Games

1. **Start the dev server** (`npm run dev`)
2. **Navigate to:** http://localhost:5173/
3. **Login or Signup** (authentication required)
4. **Click "Learn" in the navigation sidebar**
5. **Select "HTML Structure Builder"** from the game catalog
6. **Start coding!** 🚀

---

## 📦 Project Structure

```
src/
├── features/
│   └── learn/
│       ├── Learn.jsx                     # Game catalog page
│       ├── components/
│       │   └── games/
│       │       └── HTMLBuilder/
│       │           ├── HTMLBuilder.jsx              # Main game component
│       │           ├── levels.js                    # 10 level definitions
│       │           ├── htmlValidator.js             # Validation engine
│       │           ├── HTMLBuilderEditor.jsx        # Code editor
│       │           └── HTMLBuilderPreview.jsx       # Live preview
│       └── hooks/
│           └── useGameProgress.js        # Supabase progress tracking
```

---

## 🗄️ Database Setup (Optional - For Progress Tracking)

If you want to save game progress, you need to set up the database schema in Supabase:

1. Go to Supabase Dashboard → SQL Editor
2. Run the schema from `docs/DATABASE_SCHEMA.sql`
3. This creates:
   - `games` table (game metadata)
   - `game_levels` table (level definitions)
   - `user_progress` table (tracks stars, time, completion)
   - `game_leaderboards` table (rankings)

**Note:** The game works WITHOUT database setup, but progress won't be saved.

---

## 🎯 HTML Structure Builder Game Features

### ✅ Fully Implemented
- **10 Progressive Levels** - From basic structure to complex landing pages
- **Real-time Validation** - Instant feedback on HTML structure
- **3-Star Scoring System** - Based on time and code quality
- **Hints System** - Get help when stuck (costs XP)
- **Live Preview** - See your HTML render in real-time
- **Responsive Viewports** - Test desktop/tablet/mobile
- **Syntax Highlighting** - Color-coded HTML editor
- **Code Reset** - Start over anytime
- **Progress Tracking** - Saves to Supabase (if configured)
- **Celebration Effects** - Confetti on level completion 🎉

### 🎮 Levels Overview
1. **Basic HTML Structure** - DOCTYPE, html, head, body
2. **Header and Navigation** - Semantic header with nav
3. **Article and Sections** - Main content structure
4. **Footer with Links** - Footer element with social links
5. **Blog Post Layout** - Article with headings and paragraphs
6. **Dashboard Grid** - Complex card-based layout
7. **Product Grid** - E-commerce product showcase
8. **Form Elements** - Contact form with validation
9. **Accessibility Focus** - ARIA labels and semantic HTML
10. **Landing Page** - Full responsive landing page

---

## 🐛 Troubleshooting

### ❌ "Missing Supabase environment variables"
**Fix:** Update `.env.local` with your real Supabase credentials.

### ❌ "Cannot read properties of undefined (reading 'user')"
**Fix:** Make sure you're logged in. Go to `/login` and create an account.

### ❌ Port 5173 already in use
**Fix:** Vite will automatically use port 5174. Check terminal for the correct URL.

### ❌ "Failed to fetch" errors on Supabase calls
**Fix:** 
1. Check `.env.local` has correct credentials
2. Verify Supabase project is running
3. Check browser console for detailed error

### ❌ Game page shows blank screen
**Fix:**
1. Open browser DevTools (F12)
2. Check Console tab for errors
3. Verify you're logged in (check `/profile`)

---

## 🔮 Coming Soon

### CSS Selector Battle
- Interactive CSS selector challenges
- Master specificity and combinators
- 12 levels of increasing difficulty
- **Status:** Planned (not implemented)

### JS Puzzle Maze
- Code-based pathfinding game
- Learn JavaScript fundamentals
- 15 challenging levels
- **Status:** Planned (not implemented)

---

## 📝 Notes

- **NavBar already had `/learn` link** - No changes needed
- **FrostedCard component** - Used for consistent UI design
- **Theme support** - Games work in both light and dark mode
- **Mobile responsive** - All games adapt to screen size

---

## 🎉 You're All Set!

Your localhost should now be running properly. Just update `.env.local` with your Supabase credentials and you're good to go! 🚀

**Next Steps:**
1. Update Supabase credentials in `.env.local`
2. Start dev server (`npm run dev`)
3. Login/Signup
4. Navigate to `/learn`
5. Start playing HTML Structure Builder! 🎮
