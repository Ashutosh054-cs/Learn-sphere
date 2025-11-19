import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

export default function Signup() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')

    // Validation
    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    // For demo purposes, just store and redirect
    localStorage.setItem('isLoggedIn', 'true')
    localStorage.setItem('userEmail', email)
    localStorage.setItem('userName', name)
    
    // Redirect to dashboard
    navigate('/dashboard')
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-4" style={{ backgroundColor: 'var(--bg-secondary)', overflowY: 'auto' }}>
      <div className="w-full max-w-md">
        {/* Logo */}
        <Link to="/" className="flex items-center justify-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(to bottom right, var(--accent-primary), var(--accent-secondary))' }}>
            <span className="text-2xl font-bold text-white">LS</span>
          </div>
          <span className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
            Learn Sphere
          </span>
        </Link>

        {/* Signup Form */}
        <div className="border rounded-2xl p-8" style={{ 
          backgroundColor: 'var(--bg-primary)',
          borderColor: 'var(--border-color)',
          boxShadow: 'var(--shadow-md)'
        }}>
          <h1 className="text-2xl font-extrabold mb-1" style={{ color: 'var(--text-primary)' }}>
            Create Account
          </h1>
          <p className="mb-6" style={{ color: 'var(--text-secondary)' }}>
            Start your learning journey today
          </p>

          {error && (
            <div className="mb-6 p-4 rounded-lg" style={{ backgroundColor: 'rgba(215, 60, 75, 0.1)', border: '1px solid rgba(215, 60, 75, 0.3)' }}>
              <p className="text-sm" style={{ color: '#D73C4B' }}>{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 transition-all"
                style={{ 
                  backgroundColor: 'var(--bg-primary)',
                  borderColor: 'var(--border-color)',
                  color: 'var(--text-primary)'
                }}
                placeholder="Enter your full name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 transition-all"
                style={{ 
                  backgroundColor: 'var(--bg-primary)',
                  borderColor: 'var(--border-color)',
                  color: 'var(--text-primary)'
                }}
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 transition-all"
                style={{ 
                  backgroundColor: 'var(--bg-primary)',
                  borderColor: 'var(--border-color)',
                  color: 'var(--text-primary)'
                }}
                placeholder="Create a password"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
                Confirm Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 transition-all"
                style={{ 
                  backgroundColor: 'var(--bg-primary)',
                  borderColor: 'var(--border-color)',
                  color: 'var(--text-primary)'
                }}
                placeholder="Confirm your password"
              />
            </div>

            <div className="flex items-start gap-2">
              <input type="checkbox" required className="mt-1 rounded" />
              <label className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                I agree to the{' '}
                <Link to="/terms" className="hover:underline" style={{ color: 'var(--accent-primary)' }}>
                  Terms of Service
                </Link>
                {' '}and{' '}
                <Link to="/privacy" className="hover:underline" style={{ color: 'var(--accent-primary)' }}>
                  Privacy Policy
                </Link>
              </label>
            </div>

            <button
              type="submit"
              className="w-full py-3 font-semibold rounded-lg hover:scale-105 transition-all duration-300"
              style={{ backgroundColor: 'var(--accent-primary)', color: 'var(--bg-primary)', boxShadow: 'var(--shadow-md)' }}
            >
              Create Account
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              Already have an account?{' '}
              <Link to="/login" className="font-medium hover:underline" style={{ color: 'var(--accent-primary)' }}>
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}
