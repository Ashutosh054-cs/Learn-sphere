import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../stores/authStore'

export default function Home() {
  const user = useAuthStore(state => state.user)
  const navigate = useNavigate()

  const handleGetStarted = () => {
    if (user) {
      navigate('/dashboard')
    } else {
      navigate('/signup')
    }
  }

  return (
    <main className="min-h-screen" style={{ paddingTop: 0, background: 'var(--bg-secondary)' }}>
      {/* Hero Section */}
      <section className="container mx-auto px-4 pt-6 pb-16 text-center">
        <h1 className="text-5xl md:text-7xl font-extrabold mb-6" style={{ 
          background: 'linear-gradient(to right, var(--accent-primary), var(--accent-secondary))',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }}>
          Welcome to Learn Sphere
        </h1>
        <p className="text-xl md:text-2xl mb-12 max-w-3xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
          Your AI-powered education platform for personalized learning, focus sessions, and progress tracking
        </p>
        
        <div className="flex gap-4 justify-center flex-wrap">
          <button 
            onClick={handleGetStarted}
            className="px-8 py-4 font-semibold rounded-full hover:scale-105 transition-all text-lg" 
            style={{ backgroundColor: 'var(--accent-primary)', color: 'var(--bg-primary)', boxShadow: 'var(--shadow-md)' }}
          >
            {user ? 'Go to Dashboard' : 'Get Started'}
          </button>
          <Link to="/about">
            <button className="px-8 py-4 font-semibold rounded-full hover:scale-105 transition-all border text-lg" style={{ color: 'var(--text-primary)', borderColor: 'var(--border-color)', backgroundColor: 'var(--accent-light)' }}>
              Learn More
            </button>
          </Link>
        </div>
      </section>

      {/* About Us Section */}
      <section className="container mx-auto px-4 pb-8">
        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          <div className="border rounded-3xl p-8 md:p-10" style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border-color)', boxShadow: 'var(--shadow-lg)' }}>
            <h2 className="text-3xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>About Learn Sphere</h2>
            <p className="mb-6" style={{ color: 'var(--text-secondary)' }}>
              We’re on a mission to make studying calmer and smarter. Learn Sphere blends a distraction-free Focus Mode, clear progress tracking, and thoughtful UI so you can learn with momentum.
            </p>
            <ul className="space-y-3">
              <li className="flex items-start gap-3"><span>✅</span><span style={{ color: 'var(--text-secondary)' }}>Minimal, creamy UI designed to reduce visual fatigue</span></li>
              <li className="flex items-start gap-3"><span>✅</span><span style={{ color: 'var(--text-secondary)' }}>Pomodoro Focus with fullscreen, themes, and ambient noise</span></li>
              <li className="flex items-start gap-3"><span>✅</span><span style={{ color: 'var(--text-secondary)' }}>Dashboard insights to keep streaks and goals on track</span></li>
            </ul>
          </div>
          <div className="border rounded-3xl p-0 overflow-hidden" style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border-color)', boxShadow: 'var(--shadow-lg)' }}>
            <div className="h-full w-full" style={{ background: 'linear-gradient(135deg, hsl(220 70% 92%), hsl(160 55% 92%))' }}>
              <div className="h-56 md:h-full flex items-center justify-center">
                <div className="rounded-2xl px-6 py-3" style={{ backgroundColor: 'var(--bg-primary)', boxShadow: 'var(--shadow-md)', border: '1px solid var(--border-color)' }}>
                  <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>Thoughtfully designed for focus ✨</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-16" style={{ color: 'var(--text-primary)' }}>
          Why Choose Learn Sphere?
        </h2>
        
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Feature 1 */}
          <div className="border rounded-2xl p-8" style={{ 
            backgroundColor: 'var(--bg-primary)',
            borderColor: 'var(--border-color)',
            boxShadow: 'var(--shadow-md)'
          }}>
            <div className="text-4xl mb-4">🎯</div>
            <h3 className="text-xl font-bold mb-3" style={{ color: 'var(--accent-primary)' }}>Focus Mode</h3>
            <p style={{ color: 'var(--text-secondary)' }}>Pomodoro technique with customizable timers and beautiful backgrounds to maximize your productivity.</p>
          </div>

          {/* Feature 2 */}
          <div className="border rounded-2xl p-8" style={{ 
            backgroundColor: 'var(--bg-primary)',
            borderColor: 'var(--border-color)',
            boxShadow: 'var(--shadow-md)'
          }}>
            <div className="text-4xl mb-4">🤖</div>
            <h3 className="text-xl font-bold mb-3" style={{ color: 'var(--accent-secondary)' }}>AI Roadmap</h3>
            <p style={{ color: 'var(--text-secondary)' }}>Get personalized learning paths powered by AI to achieve your educational goals faster.</p>
          </div>

          {/* Feature 3 */}
          <div className="border rounded-2xl p-8" style={{ 
            backgroundColor: 'var(--bg-primary)',
            borderColor: 'var(--border-color)',
            boxShadow: 'var(--shadow-md)'
          }}>
            <div className="text-4xl mb-4">📊</div>
            <h3 className="text-xl font-bold mb-3" style={{ color: 'var(--accent-primary)' }}>Track Progress</h3>
            <p style={{ color: 'var(--text-secondary)' }}>Monitor your learning journey with detailed analytics and celebrate your achievements.</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="border rounded-3xl p-12 max-w-4xl mx-auto" style={{ 
          backgroundColor: 'var(--bg-primary)',
          borderColor: 'var(--border-color)',
          boxShadow: 'var(--shadow-lg)'
        }}>
          <h2 className="text-3xl md:text-4xl font-bold mb-6" style={{ color: 'var(--text-primary)' }}>
            Ready to Transform Your Learning?
          </h2>
          <p className="text-lg mb-8" style={{ color: 'var(--text-secondary)' }}>
            Join thousands of students who are already learning smarter, not harder.
          </p>
          <button 
            onClick={handleGetStarted}
            className="px-10 py-4 font-semibold rounded-full hover:scale-105 transition-all text-lg" 
            style={{ 
              background: 'linear-gradient(to right, var(--accent-primary), var(--accent-secondary))',
              color: 'var(--bg-primary)',
              boxShadow: 'var(--shadow-md)'
            }}
          >
            {user ? 'Go to Dashboard' : 'Start Learning Today'}
          </button>
        </div>
      </section>
    </main>
  )
}
