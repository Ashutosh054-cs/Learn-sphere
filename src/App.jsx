import "./index.css";
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom'
import { ThemeProvider } from './contexts/ThemeContext'
import Navbar from './components/NavBar'
import Home from './features/home/Home'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Dashboard from './features/dashboard/Dashboard'
import Focus from './features/focus/Focus'
import Attendance from './features/attendance/Attendance'
import About from './features/about/About'

// Protected Route Component
function ProtectedRoute({ children }) {
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true'
  return isLoggedIn ? children : <Navigate to="/login" replace />
}

function AppContent() {
  const location = useLocation()
  // Keep navbar visible on login/signup so protected-route redirects don't hide it
  const showNavbar = location.pathname !== '/'

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--bg-primary)' }}>
      {showNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        {/* Dashboard available without auth to avoid accidental hiding during redirects */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/focus" element={<ProtectedRoute><Focus /></ProtectedRoute>} />
        <Route path="/attendance" element={<ProtectedRoute><Attendance /></ProtectedRoute>} />
        <Route path="/about" element={<ProtectedRoute><About /></ProtectedRoute>} />
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
