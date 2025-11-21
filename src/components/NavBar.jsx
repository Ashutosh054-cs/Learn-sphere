import { Link, useLocation } from 'react-router-dom'
import { FaChartBar, FaBullseye, FaGamepad, FaTools, FaUsers, FaInfoCircle } from 'react-icons/fa'
import { Sun, Moon } from 'lucide-react'
import { useTheme } from '../contexts/ThemeContext'

export default function NavBar() {
  const location = useLocation()
  const { theme, toggleTheme } = useTheme()

  const navLinks = [
    { name: 'Dashboard', path: '/dashboard', icon: <FaChartBar /> },
    { name: 'Focus', path: '/focus', icon: <FaBullseye /> },
    { name: 'Learn', path: '/learn', icon: <FaGamepad /> },
    { name: 'StudyTools', path: '/studytools', icon: <FaTools /> },
    { name: 'Community', path: '/community', icon: <FaUsers /> },
    { name: 'About', path: '/about', icon: <FaInfoCircle /> },
  ]

  const isActive = (path) => location.pathname === path

  return (
    <aside 
      className="navbar fixed left-0 top-0 h-screen w-64 border-r flex flex-col z-40"
      style={{ 
        backgroundColor: theme === 'dark' ? 'rgba(13, 17, 23, 0.95)' : 'var(--accent-primary)',
        borderColor: theme === 'dark' ? 'rgba(0, 230, 230, 0.2)' : 'hsl(var(--hue) 70% 50%)',
        boxShadow: 'var(--shadow-md)'
      }}
    >
      {/* Logo/Brand */}
      <Link to="/" className="flex items-center gap-3 p-6 border-b" style={{ borderColor: theme === 'dark' ? 'rgba(0, 230, 230, 0.2)' : 'hsl(220, 70%, 50%)' }}>
        <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: theme === 'dark' ? 'linear-gradient(to bottom right, #00E6E6, #7F00FF)' : 'linear-gradient(to bottom right, hsl(220, 70%, 55%), hsl(220, 70%, 65%))' }}>
          <span className="text-xl font-bold text-white">LS</span>
        </div>
        <span className="text-xl font-bold" style={{ color: theme === 'dark' ? '#00E6E6' : 'hsl(0, 0%, 100%)' }}>
          Learn Sphere
        </span>
      </Link>

      {/* Navigation Links */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {navLinks.map((link) => (
            <li key={link.path}>
              <Link
                to={link.path}
                className="flex items-center justify-between px-4 py-3 rounded-lg transition-all duration-200 relative"
                style={{
                  backgroundColor: isActive(link.path) ? 'var(--bg-primary)' : 'transparent',
                  color: isActive(link.path) ? 'var(--accent-primary)' : 'hsl(0 0% 100%)',
                  boxShadow: isActive(link.path) ? 'var(--shadow-sm)' : 'none'
                }}
                onMouseEnter={(e) => {
                  if (!isActive(link.path)) {
                    e.currentTarget.style.backgroundColor = theme === 'dark' ? 'rgba(0, 230, 230, 0.15)' : 'hsl(var(--hue) 70% 50%)'
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive(link.path)) {
                    e.currentTarget.style.backgroundColor = 'transparent'
                  }
                }}
              >
                <span className="font-medium relative z-10">{link.name}</span>
                <span className="text-lg relative z-10 flex items-center justify-center w-6">{link.icon}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* AI Roadmap Button */}
      <div className="p-4 border-t" style={{ borderColor: theme === 'dark' ? 'rgba(0, 230, 230, 0.2)' : 'hsl(220, 70%, 50%)' }}>
        <button 
          className="w-full px-4 py-3 font-semibold rounded-lg hover:scale-105 transition-all duration-300 shadow-lg flex items-center justify-center gap-2"
          style={{ 
            backgroundColor: theme === 'dark' ? 'rgba(0, 230, 230, 0.15)' : 'hsl(220, 70%, 95%)', 
            color: theme === 'dark' ? '#00E6E6' : 'hsl(220, 70%, 40%)' 
          }}
        >
          <span>🤖</span>
          <span>AI Roadmap</span>
        </button>
      </div>

      {/* Theme Toggle */}
      <div className="px-4 pb-4">
        <button
          onClick={toggleTheme}
          className="w-full px-4 py-3 font-medium rounded-lg hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
          style={{ 
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            color: 'hsl(0 0% 100%)',
            border: '1px solid rgba(255, 255, 255, 0.2)'
          }}
        >
          {theme === 'light' ? (
            <>
              <Moon size={18} />
              <span>Dark Mode</span>
            </>
          ) : (
            <>
              <Sun size={18} />
              <span>Light Mode</span>
            </>
          )}
        </button>
      </div>

      {/* User Profile */}
      <div className="p-4 border-t" style={{ borderColor: 'hsl(var(--hue) 70% 50%)' }}>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ backgroundColor: 'hsl(0 0% 100% / 0.95)' }}>
            <span className="text-base font-semibold" style={{ color: 'var(--accent-primary)' }}>
              {localStorage.getItem('userName')?.charAt(0).toUpperCase() || 'S'}
            </span>
          </div>
          <div className="flex-1">
            <p className="text-sm" style={{ color: 'hsl(0 0% 100% / 0.95)' }}>
              {localStorage.getItem('userName') || 'Student'}
            </p>
          </div>
          <button
            onClick={() => {
              localStorage.removeItem('isLoggedIn')
              localStorage.removeItem('userEmail')
              localStorage.removeItem('userName')
              window.location.href = '/'
            }}
            className="px-3 py-1 rounded-full text-xs border"
            style={{ 
              color: 'hsl(0 0% 100%)',
              borderColor: 'hsl(0 0% 100% / 0.6)',
              backgroundColor: 'transparent'
            }}
          >
            Logout
          </button>
        </div>
      </div>
    </aside>
  )
}

