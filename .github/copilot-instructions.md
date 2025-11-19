**Project Overview**
- **Stack:** Vite + React (18/19), Tailwind CSS, React Router (v7), no backend in this repo.
- **Entry points:** `index.html` loads `src/main.jsx` which mounts `src/App.jsx`.
- **Layout:** Top-level UI lives in `src/App.jsx`; reusable UI lives in `src/components/*`; page-level screens live in `src/pages/*`.

**How to run / build**
- **Install deps:** `npm i` (README recommends `npm i` and tailwind deps; `package.json` already lists `tailwindcss` and `@tailwindcss/vite`).
- **Dev server:** `npm run dev` (runs `vite` — opens at `http://localhost:5173` by default).
- **Build:** `npm run build`.
- **Preview build:** `npm run preview`.
- **Lint:** `npm run lint` (uses ESLint configured via dependencies).

**Architecture & important files**
- `src/main.jsx`: React entry, `createRoot` mounting `App`.
- `src/App.jsx`: Wraps the app with `BrowserRouter` and provides the top-level layout and sample content.
- `src/components/NavBar.jsx`: Navigation patterns and the source of truth for nav links (array `navLinks`).
- `src/index.css`: Tailwind import + project CSS variables (color palette and typography). The project relies on CSS variables like `var(--accent-primary)` for theming — prefer using those when adding colored UI.
- `src/pages/*`: Page placeholders (several are empty). Add pages here and wire them into `App.jsx` via `react-router` routes.

**Patterns and conventions for AI agents**
- **Routing:** NavBar creates links for `/`, `/focus`, `/attendance`, `/about`. Note: page filename `Attendence.jsx` (in `src/pages`) has a typo and may not match the `/attendance` path — check and keep filenames/route paths consistent.
- **Styling:** Mix of Tailwind utility classes and inline styles that reference CSS variables (e.g., `style={{ color: 'var(--text-primary)' }}`). When changing colors, prefer updating `src/index.css` variables rather than hardcoding hex values.
- **Interactive styles:** `NavBar.jsx` uses inline `onMouseEnter` / `onMouseLeave` to change element styles at runtime. Be cautious when refactoring hover behavior — tests that assume only CSS hover may break.
- **Components vs Pages:** Keep small, reusable UI in `src/components/` and route-level views in `src/pages/`. Many `pages/*` files are currently empty — treat them as placeholders unless the user asks to implement features.

**Common tasks — quick examples**
- Add a new page:
  - Create `src/pages/MyFeature.jsx` exporting a React component.
  - Add a `<Route path="/myfeature" element={<MyFeature/>} />` inside `src/App.jsx` (note: `App.jsx` currently doesn't define `<Routes>` — add them when wiring pages).
  - Add a nav link by updating `navLinks` in `src/components/NavBar.jsx`.
- Use shared colors:
  - Prefer `style={{ backgroundColor: 'var(--accent-primary)' }}` or Tailwind + CSS variable combinations.

**Integration & external deps**
- Fonts loaded from Google Fonts in `index.html` (`Inter` and `Space Grotesk`).
- No server/API layers found in this repo — if you add integrations, document env vars and endpoints in `README.md`.

**Gotchas / things to watch**
- `NavBar.jsx` uses `Link` from `react-router-dom` but `App.jsx` currently doesn't register routes — clicking links may not render different pages until routes are added.
- Spelling mismatch: page filename `Attendence.jsx` vs NavBar path `/attendance` — fix the filename or link when adding routes.
- `src/components/Footer.jsx` exists but is empty; adding content here is safe and expected.
- Tailwind usage is non-standard in `src/index.css` (it imports `@import "tailwindcss"`); if you modify Tailwind config, verify `vite` plugin and PostCSS setup.

**When you are uncertain**
- If a page is empty or routes are not wired, ask the maintainer before implementing full features.
- Prefer small, focused PRs: add one route or one component per PR and update `README.md` with new run/build notes if necessary.

If anything in this file is unclear or you want me to expand a section (examples for routing wiring, code snippets for adding a page, or a checklist for PRs), tell me which part to expand.
