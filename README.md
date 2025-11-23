# LearnSphere 🚀

A premium, interactive learning platform built with React + Vite, featuring AI-powered roadmaps, gamification, and comprehensive career path guidance.

## 🌟 Features

### ✅ **Fully Implemented**
- **37 Career Paths** - From Frontend to AI Video Developer, with comprehensive roadmaps
- **AI Roadmap System** - Interactive node-based learning paths with 170+ nodes
- **Responsive UI** - Optimized for all screen sizes with theme support (light/dark)
- **Focus Mode** - Pomodoro timer with customizable backgrounds and fullscreen mode
- **Dashboard** - Activity tracking, streaks, leaderboards, and quick launch cards
- **Skill Tracking** - Animated progress circles with real-time XP updates
- **Weekly Goals** - Progress tracking with XP rewards
- **Achievement System** - Badges with carousel navigation
- **AI Mentor Panel** - Interactive chat interface with quick actions

### 🎯 **Career Paths Available**
**Development**: Frontend, Backend, Full-Stack, Mobile, Game Dev, API Developer, OSS Engineer  
**AI/ML**: AI/ML Engineer, Data Scientist, MLOps, GenAI Agent Developer, LLM Fine-Tuning, AI Automation, AI Video Developer  
**Infrastructure**: DevOps, Cloud Engineer, Cloud Cost Optimization, Edge Computing, SRE  
**Data**: Data Engineer, Big Data Engineer, Bioinformatics Engineer  
**Security**: Cybersecurity, Ethical Hacker, Cyber Threat Analyst, Cloud Security  
**Specialized**: Blockchain, FinTech, Hardware+AI Integration, Tech Evangelist, Product Designer, Software Architect, QA, System Design, Database Admin, Prompt Engineer

## 🚀 Quick Start

```powershell
# Install dependencies
npm install

# Run development server (http://localhost:5173)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

## 📁 Project Structure

```
src/
├── components/
│   ├── ui/              # Reusable UI components (FrostedCard, Button)
│   └── NavBar.jsx       # Navigation component
├── features/
│   ├── roadmap/         # AI Roadmap page & components
│   │   ├── AIroadmap.jsx
│   │   └── components/  # CareerSelector, RoadmapGraph, SkillOverview, etc.
│   ├── dashboard/       # Dashboard & cards
│   ├── focus/           # Pomodoro timer with backgrounds
│   ├── attendance/      # Attendance tracking (placeholder)
│   ├── home/            # Landing page
│   └── about/           # About page
├── data/
│   └── roadmapData.json # 37 careers, 170+ nodes, skills, badges
├── stores/
│   └── roadmapStore.js  # Zustand state management
├── contexts/
│   └── ThemeContext.jsx # Light/Dark theme context
└── App.jsx              # Main app component with routing
```

## 🎨 Design System

### Color Palette (CSS Variables)
**Light Mode:**
- Primary BG: Warm gradient (`hsl(210 40% 96%)` → `hsl(280 35% 97%)`)
- Accent Primary: `hsl(220 45% 38%)` (Muted blue)
- Accent Secondary: `hsl(220 35% 48%)`
- Text Primary: `hsl(220 20% 20%)`

**Dark Mode:**
- Primary BG: `#0D1117` (Deep charcoal)
- Accent Primary: `#00E6E6` (Neon cyan)
- Accent Secondary: `#7F00FF` (Deep violet)
- Text Primary: `#E6E6E6`

**Difficulty Colors:**
- Basic: Green (`hsl(142 60% 45%)` light, `#00E6E6` dark)
- Intermediate: Yellow (`hsl(42 95% 50%)` light, `#7F00FF` dark)
- Advanced: Red (`hsl(0 75% 55%)` light, `#FF6B35` dark)

### Typography
- Font: Manrope (body), Poppins (navbar)
- Kinetic numbers and bold headings
- Responsive sizing (10px → 2xl)

## 🛠 Tech Stack

- **Frontend**: React 18/19, Vite
- **Styling**: Tailwind CSS 4
- **Routing**: React Router v7
- **State**: Zustand
- **Animations**: Framer Motion
- **Icons**: Lucide React

## 📊 Recent Updates (Latest)

### v1.5.0 - Career Expansion & UX Improvements
- ✅ Added 12 new trending tech roles (37 total careers)
- ✅ Comprehensive roadmap data from roadmap.sh
- ✅ Light mode optimizations (improved node/card visibility)
- ✅ Responsive career selector (smaller cards, removed emojis)
- ✅ Fixed hover card overflow on edge nodes
- ✅ Animated skill progress circles (starts from 0)
- ✅ Difficulty badge color system (Basic/Intermediate/Advanced)
- ✅ Theme-aware components (light/dark mode support)
- ✅ All 37 career path titles in roadmap graph

## 🎯 Roadmap & Future Enhancements

### Phase 1: Core UX (Priority)
- [ ] Search/filter for career selector
- [ ] Progress percentage on roadmap levels
- [ ] Keyboard shortcuts (Tab, Enter, Esc navigation)
- [ ] Back to top button
- [ ] Custom goals with modal

### Phase 2: Advanced Features
- [ ] Career comparison mode (side-by-side)
- [ ] Minimap for roadmap overview
- [ ] Badge progress tracking
- [ ] Node drawer notes section
- [ ] Statistics dashboard with charts
- [ ] Activity heatmap (GitHub-style)

### Phase 3: Backend Integration
- [ ] User authentication
- [ ] Progress sync across devices
- [ ] Real AI mentor (LLM API integration)
- [ ] Social features (leaderboards, sharing)
- [ ] Attendance tracking system

## 🤝 Contributing

This is a student learning platform project. Contributions are welcome!

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is open source and available under the MIT License.

## 🙏 Acknowledgments

- Roadmap data sourced from [roadmap.sh](https://roadmap.sh)
- Icons by [Lucide](https://lucide.dev)
- Fonts from Google Fonts (Manrope, Poppins)

---

**Built with ❤️ for learners worldwide**
