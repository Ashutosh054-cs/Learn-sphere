import "./index.css";
import { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom'
import { ThemeProvider } from './contexts/ThemeContext'
import { useAuthStore } from './stores/authStore'
import Navbar from './components/NavBar'
import Home from './features/home/Home'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Profile from './pages/Profile'
import Dashboard from './features/dashboard/Dashboard'
import Focus from './features/focus/Focus'
import About from './features/about/About'
import AIroadmap from './features/roadmap/AIroadmap'
import Learn from './features/learn/Learn'
import HTMLBuilder from './features/learn/components/games/HTMLBuilder/HTMLBuilder'
import CSSBattle from './features/learn/components/games/CSSBattle/CSSBattle'
import JSMaze from './features/learn/components/games/JSMaze/JSMaze'
import Groups from './pages/Groups'
import Group from './pages/Group'

// Protected Route Component
function ProtectedRoute({ children }) {
  const user = useAuthStore(state => state.user)
  const loading = useAuthStore(state => state.loading)
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p style={{ color: 'var(--text-secondary)' }}>Loading...</p>
        </div>
      </div>
    )
  }
  
  if (!user) {
    return <Navigate to="/login" replace />
  }
  
  return children
}

function AppContent() {
  const location = useLocation()
  const user = useAuthStore(state => state.user)
  const initialize = useAuthStore(state => state.initialize)
  
  // Initialize auth on mount
  useEffect(() => {
    initialize()
  }, [])
  
  // Hide navbar only on home, login, and signup pages
  const hideNavbarPaths = ['/', '/login', '/signup']
  const showNavbar = !hideNavbarPaths.includes(location.pathname)

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--bg-primary)' }}>
      {showNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/focus" element={<ProtectedRoute><Focus /></ProtectedRoute>} />
        <Route path="/about" element={<ProtectedRoute><About /></ProtectedRoute>} />
        <Route path="/roadmap" element={<ProtectedRoute><AIroadmap /></ProtectedRoute>} />
        <Route path="/learn" element={<ProtectedRoute><Learn /></ProtectedRoute>} />
        <Route path="/learn/html-builder" element={<ProtectedRoute><HTMLBuilder /></ProtectedRoute>} />
        <Route path="/learn/css-battle" element={<ProtectedRoute><CSSBattle /></ProtectedRoute>} />
        <Route path="/learn/js-maze" element={<ProtectedRoute><JSMaze /></ProtectedRoute>} />
        <Route path="/groups" element={<ProtectedRoute><Groups /></ProtectedRoute>} />
        <Route path="/groups/:id" element={<ProtectedRoute><Group /></ProtectedRoute>} />
      </Routes>
    </div>
  )
}

function App() {
  return (
    <ThemeProvider>
      <Router>
        <AppContent />
      </Router>
    </ThemeProvider>
  );
}

export default App;
