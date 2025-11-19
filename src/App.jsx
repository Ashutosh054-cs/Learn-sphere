import "./index.css";
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom'
import Navbar from './components/NavBar'
import Home from './pages/Home'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Dashboard from './features/dashboard/Dashboard.jsx'
import Focus from './pages/Focus'
import Attendence from './pages/Attendence'
import About from './pages/About'

// Protected Route Component
function ProtectedRoute({ children }) {
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true'
  return isLoggedIn ? children : <Navigate to="/login" replace />
}

function AppContent() {
  const location = useLocation()
  const showNavbar = !['/', '/login', '/signup'].includes(location.pathname)

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--bg-primary)' }}>
      {showNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/focus" element={<ProtectedRoute><Focus /></ProtectedRoute>} />
        <Route path="/attendance" element={<ProtectedRoute><Attendence /></ProtectedRoute>} />
        <Route path="/about" element={<ProtectedRoute><About /></ProtectedRoute>} />
      </Routes>
    </div>
  )
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
