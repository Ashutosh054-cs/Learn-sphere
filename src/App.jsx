import "./index.css";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/NavBar'
import Dashboard from './features/dashboard/Dashboard'

function App() {
  return (
    <Router>
      <div className="min-h-screen" style={{ backgroundColor: 'var(--bg-primary)' }}>
        <Navbar />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/focus" element={<div className="container mx-auto px-4 py-8" style={{ paddingTop: '6rem', color: 'var(--text-primary)' }}>Focus Page (Coming Soon)</div>} />
          <Route path="/attendance" element={<div className="container mx-auto px-4 py-8" style={{ paddingTop: '6rem', color: 'var(--text-primary)' }}>Attendance Page (Coming Soon)</div>} />
          <Route path="/about" element={<div className="container mx-auto px-4 py-8" style={{ paddingTop: '6rem', color: 'var(--text-primary)' }}>About Page (Coming Soon)</div>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
