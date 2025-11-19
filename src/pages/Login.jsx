import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  // Dummy credentials for testing
  const DUMMY_CREDENTIALS = {
    email: 'test@learnsphere.com',
    password: 'password123'
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')

    // Check dummy credentials
    if (email === DUMMY_CREDENTIALS.email && password === DUMMY_CREDENTIALS.password) {
      // Store login state in localStorage
      localStorage.setItem('isLoggedIn', 'true')
      localStorage.setItem('userEmail', email)
      // Redirect to dashboard
      navigate('/dashboard')
    } else {
      setError('Invalid email or password. Try test@learnsphere.com / password123')
    }
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

        {/* Login Form */}
        <div className="border rounded-2xl p-8" style={{ 
          backgroundColor: 'var(--bg-primary)',
          borderColor: 'var(--border-color)',
          boxShadow: 'var(--shadow-md)'
        }}>
          <h1 className="text-2xl font-extrabold mb-1" style={{ color: 'var(--text-primary)' }}>
            Welcome Back
          </h1>
          <p className="mb-6" style={{ color: 'var(--text-secondary)' }}>
            Sign in to continue your learning journey
          </p>

          {/* Demo Credentials Info */}
          <div className="mb-6 p-4 rounded-lg border" style={{ backgroundColor: 'var(--accent-light)', borderColor: 'var(--accent-primary)' }}>
            <p className="text-sm font-medium mb-1" style={{ color: 'var(--accent-primary)' }}>Demo Account:</p>
            <p className="text-xs" style={{ color: 'var(--text-primary)' }}>Email: test@learnsphere.com</p>
            <p className="text-xs" style={{ color: 'var(--text-primary)' }}>Password: password123</p>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-lg" style={{ backgroundColor: 'rgba(215, 60, 75, 0.1)', border: '1px solid rgba(215, 60, 75, 0.3)' }}>
              <p className="text-sm" style={{ color: '#D73C4B' }}>{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
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
                placeholder="Enter your password"
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2">
                <input type="checkbox" className="rounded" />
                <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>Remember me</span>
              </label>
              <Link to="/forgot-password" className="text-sm hover:underline" style={{ color: 'var(--accent-primary)' }}>
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              className="w-full py-3 font-semibold rounded-lg hover:scale-105 transition-all duration-300"
              style={{ backgroundColor: 'var(--accent-primary)', color: 'var(--bg-primary)', boxShadow: 'var(--shadow-md)' }}
            >
              Sign In
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              Don't have an account?{' '}
              <Link to="/signup" className="font-medium hover:underline" style={{ color: 'var(--accent-primary)' }}>
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}
