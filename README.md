<<<<<<< Updated upstream
# AuraLearn (Learn-Sphere)

Premium, dark-mode-first React + Vite app for a student-focused learning platform. This README documents the shared plan and guardrails for collaborators and AI agents. Current scope intentionally excludes gaming features (Game Hub/Real-Time Arena) — we will add those later.

## Quick Start

```powershell
# install deps
npm i

# dev server (http://localhost:5173)
npm run dev

# build / preview
npm run build
npm run preview

# lint
npm run lint
```

## Current Code Overview

- Vite + React 19, TailwindCSS 4.
- Entry: `index.html` → `src/main.jsx` → `src/App.jsx`.
- Navigation: `src/components/NavBar.jsx` (uses `react-router-dom/Link`).
- Styling: `src/index.css` defines CSS variables and typography.
- Pages (placeholders): `src/pages/{Dashboard,Focus,Home,About,Attendence}.jsx`.
- Note: `Attendence.jsx` filename has a typo vs route `/attendance` — fix when wiring routes.

## Scope (Now) — No-Game Plan

- Build non-gaming core: Design System, Navigation, Dashboard, AI Mentor Hub, Focus Environment.
- Exclude Game Hub and Real-Time Arena for now (placeholders only, no code).

## Architecture

- SPA routing that feels MPA: persistent layout shell + fast page transitions.
- Layout: fixed desktop sidebar (solid), mobile bottom nav (frosted). Content scrolls within.
- Data: no backend — use fixtures in `src/data/` and deterministic mocks.
- Animations: lightweight transforms/opacity; avoid layout thrash.

## Proposed Folder Structure (incremental adoption)

```
src/
	app/                 # App shell, route registration, providers
	components/
		layout/            # Sidebar, BottomNav, Header, LayoutShell
		ui/                # Button, FrostedCard, Card, Skeleton, Icon
		charts/            # SkillGraph (stub), KineticTimer (stub)
	features/
		dashboard/         # Dashboard page + bento cards
		mentor/            # AI Mentor page (Quests, Chat)
		focus/             # Focus page (Pomodoro, FocusTree stub)
	data/                # fixtures for user, quests, leaderboard
	styles/              # tokens.css (optional), shimmer.css, glow.css
```

We will migrate from `src/pages/*` gradually; do not break existing imports until routes are wired.

## Navigation & Routes

- Desktop: left `Sidebar` (solid `#0D1117`), icons + labels on hover/expanded.
- Mobile: bottom `BottomNav` (frosted glass). Active = teal + label.
- Initial routes:
	- `/` Dashboard
	- `/mentor` AI Mentor Hub
	- `/focus` Focus Environment
	- `/about` About
	- `/profile` Profile (placeholder)

## Pages (v1 deliverables)

- Dashboard (Bento Grid, frosted cards):
	- Profile & Streak (large): kinetic number (e.g., 32), "DAY STREAK 🔥", coins/gems top-right, subtle teal plasma background animation.
	- AI Mentor Status: pulsing violet icon, CTA "Review Today’s Quests".
	- Quick Launch: 3 minimalist SVG tiles with tilt + teal focus/hover.
	- Leaderboard Snippet: rank + top 3.
- AI Mentor Hub:
	- Skill Graph (violet theme, interactive nodes) — D3 stub acceptable.
	- Quests List (frosted): checklist of tasks.
	- Chat (frosted): AI-generated bubbles use subtle violet↔teal gradient outline.
- Focus Environment:
	- Center Pomodoro timer (large circular). Controls in frosted card.
	- Focus Tree (Three.js/WebGL stub) that "grows" per session (placeholder animation ok).

## Design System

- Colors (CSS variables in `src/index.css`):
	- `--bg-primary: #0D1117`
	- `--accent-primary: #00E6E6` (CTAs, active, progress)
	- `--accent-secondary: #7F00FF` (AI, rewards)
	- `--text-primary: #E6E6E6`, `--text-secondary: #8B949E`
	- `--feedback-error: #D73C4B`
- Core primitive: FrostedCard — rgba(255,255,255,0.05) bg, `backdrop-blur(12px)`, 1px translucent border.
- Typography: Inter; bold, spacious headings; kinetic variants for H1/H2.
- Icons: `lucide-react` (1.5px stroke). Wrap with `Icon` helper for consistent size/color.

## Interactivity, Motion, Loading

- Microinteractions: press scale 0.98; hover lift; teal ring on focus; 150–200ms.
- Page transitions: fast fade/slide via `framer-motion` (to be added).
- Loading: skeleton shimmer on cards (no spinners). Keep dark-mode friendly.
- Subtle parallax background (grid/starfield) using transform + low opacity.

## Accessibility & Performance

- High contrast; all controls keyboard-navigable; aria-labels on icon-only buttons.
- Respect `prefers-reduced-motion`; disable non-essential animations for it.
- Optimize with transform/opacity; avoid large blurred areas on mobile.

## Data & Integrations

- No API yet — use fixtures in `src/data/` and deterministic delays for loading states.
- If adding integrations later, document env vars and endpoints here before merging.

## Team Split (no-game scope)

- A: Design System + UI primitives (Button, FrostedCard, Skeleton, Icon).
- B: LayoutShell + Sidebar + BottomNav + route skeleton.
- C: Dashboard (all 4 cards + fixtures).
- D: Mentor Hub (SkillGraph stub + Quests + Chat bubbles).
- E: Focus page (Pomodoro + Focus Tree stub).
- F: A11y/Perf sweeps + skeleton states + transitions.

## Guardrails

- Use color variables from `src/index.css`; do not hardcode hex values.
- Prefer Tailwind utilities; use inline styles only to reference CSS variables.
- Keep icons via `lucide-react`; do not mix icon sets.
- Keep new routes under `src/features/*`; leave `src/pages/*` as legacy until migration.
- Do not add backend code; mock data only.
- Fix `Attendence.jsx` → `Attendance.jsx` when routes are wired.

## Next Steps

1) Agree on this plan (no-game scope).
2) Add `framer-motion` and `lucide-react` dependencies (optional now, recommended soon).
3) Scaffold layout shell + routes with placeholders only.
4) Implement Dashboard → Mentor → Focus in that order.

## Open Questions

- Approve adding `framer-motion`, `lucide-react`, and `three` (for Focus Tree stub) now?
- Any brand assets (logo/avatars) or copy standards to include?
=======
# Learn-Sphere
### cd learn-sphere
# Install this dependencies
### npm i
### npm install tailwindcss @tailwindcss/vite
### npm install react-router-dom
>>>>>>> Stashed changes
