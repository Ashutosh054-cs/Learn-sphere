import { useState } from 'react'
import { Link } from 'react-router-dom'

export default function NavBar() {
  const [isOpen, setIsOpen] = useState(false)

  const navLinks = [
    { name: 'Dashboard', path: '/' },
    { name: 'Focus', path: '/focus' },
    { name: 'Attendance', path: '/attendance' },
    { name: 'About', path: '/about' },
  ]

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-7xl">
      <div className="flex items-center justify-between px-6">
        {/* Logo/Brand */}
        <Link to="/" className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(to bottom right, var(--accent-primary), var(--accent-secondary))' }}>
            <span className="text-xl font-bold text-white">LS</span>
          </div>
          <span className="text-xl font-bold bg-clip-text text-transparent" style={{ backgroundImage: 'linear-gradient(to right, var(--accent-primary), var(--accent-secondary))' }}>
            Learn Sphere
          </span>
        </Link>

        {/* Desktop Navigation - Oval Shape */}
        <nav className="hidden md:flex items-center gap-1 backdrop-blur-[16px] border border-[rgba(255,255,255,0.1)] rounded-full px-6 py-3" style={{ backgroundColor: 'rgba(13, 17, 23, 0.8)' }}>
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className="px-6 py-2 rounded-full transition-all duration-300 font-medium"
              style={{ color: 'var(--text-primary)' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = 'var(--accent-primary)'
                e.currentTarget.style.backgroundColor = 'rgba(0, 230, 230, 0.1)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = 'var(--text-primary)'
                e.currentTarget.style.backgroundColor = 'transparent'
              }}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* AI Roadmap Button (Desktop) */}
        {/* AI Roadmap Button (Desktop) */}
        <button className="hidden md:block px-6 py-3 font-semibold rounded-full hover:scale-105 transition-all duration-300 shadow-lg" style={{ backgroundColor: 'var(--accent-secondary)', color: 'var(--text-primary)' }}>
          AI Roadmap
        </button>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden p-2 rounded-full backdrop-blur-[12px] bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] hover:bg-[rgba(255,255,255,0.08)] transition-all"
          aria-label="Toggle menu"
        >
          <div className="w-6 h-5 flex flex-col justify-between">
            <span className={`w-full h-0.5 transition-all duration-300 ${isOpen ? 'rotate-45 translate-y-2' : ''}`} style={{ backgroundColor: 'var(--text-primary)' }}></span>
            <span className={`w-full h-0.5 transition-all duration-300 ${isOpen ? 'opacity-0' : ''}`} style={{ backgroundColor: 'var(--text-primary)' }}></span>
            <span className={`w-full h-0.5 transition-all duration-300 ${isOpen ? '-rotate-45 -translate-y-2' : ''}`} style={{ backgroundColor: 'var(--text-primary)' }}></span>
          </div>
        </button>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden mt-4 px-6">
          <nav className="backdrop-blur-[12px] bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-3xl p-4 space-y-3">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className="block px-4 py-3 hover:bg-[rgba(255,255,255,0.05)] rounded-full transition-all duration-300"
                style={{ color: 'var(--text-primary)' }}
                onMouseEnter={(e) => e.currentTarget.style.color = 'var(--accent-primary)'}
                onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-primary)'}
              >
                {link.name}
              </Link>
            ))}
            <button className="w-full px-6 py-3 font-semibold rounded-full transition-all duration-300 shadow-lg" style={{ backgroundColor: 'var(--accent-secondary)', color: 'var(--text-primary)' }}>
              AI Roadmap
            </button>
          </nav>
        </div>
      )}
    </div>
  )
}

