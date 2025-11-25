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
import Attendance from './features/attendance/Attendance'
import About from './features/about/About'
import AIroadmap from './features/roadmap/AIroadmap'
import Learn from './features/learn/Learn'

// Protected Route Component
function ProtectedRoute({ children }) {
  const user = useAuthStore(state => state.user)
  const loading = useAuthStore(state => state.loading)
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl" style={{ color: 'var(--text-primary)' }}>Loading...</div>
      </div>
    )
  }
  
  return user ? children : <Navigate to="/login" replace />
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
        <Route path="/attendance" element={<ProtectedRoute><Attendance /></ProtectedRoute>} />
        <Route path="/about" element={<ProtectedRoute><About /></ProtectedRoute>} />
        <Route path="/roadmap" element={<ProtectedRoute><AIroadmap /></ProtectedRoute>} />
        <Route path="/learn" element={<ProtectedRoute><Learn /></ProtectedRoute>} />
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
