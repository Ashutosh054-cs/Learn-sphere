import { Sparkles, Target, Users, Brain, Zap, TrendingUp, Shield, Heart } from 'lucide-react'
import FrostedCard from '../../components/ui/FrostedCard'

export default function About() {
  const features = [
    { icon: <Zap size={24} />, title: 'Focus Sessions', description: 'Pomodoro timers with ambient sounds', color: 'var(--accent-primary)' },
    { icon: <TrendingUp size={24} />, title: 'Streak Tracking', description: 'Visual heatmaps & daily momentum', color: 'var(--accent-secondary)' },
    { icon: <Users size={24} />, title: 'Community', description: 'Leaderboards & shared goals', color: 'var(--accent-primary)' },
    { icon: <Brain size={24} />, title: 'AI Roadmaps', description: 'Personalized learning paths', color: 'var(--accent-secondary)' },
  ]

  const stats = [
    { label: 'Active Learners', value: '10K+', icon: '👥' },
    { label: 'Study Sessions', value: '50K+', icon: '⏱️' },
    { label: 'Total Streaks', value: '25K+', icon: '🔥' },
    { label: 'Success Rate', value: '92%', icon: '🎯' },
  ]

  return (
    <main className="ml-64 min-h-screen" style={{ paddingTop: '3rem', paddingBottom: '3rem' }}>
      <div className="container mx-auto px-4 md:px-8 max-w-6xl">
        {/* Hero Section */}
        <div className="mb-12 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4" style={{ backgroundColor: 'var(--accent-light)', color: 'var(--accent-primary)' }}>
            <Sparkles size={16} />
            <span className="text-sm font-semibold">AI-Powered Learning Platform</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black mb-4" style={{ color: 'var(--text-primary)' }}>
            About Learn Sphere
          </h1>
          <p className="text-lg md:text-xl max-w-3xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
            Your intelligent companion for focused learning, habit building, and academic excellence.
            Built to help you learn smarter, stay motivated, and achieve your goals.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {stats.map((stat, index) => (
            <FrostedCard key={index} className="text-center p-6 hover:scale-105 transition-transform">
              <div className="text-3xl mb-2">{stat.icon}</div>
              <div className="text-2xl font-bold mb-1" style={{ color: 'var(--accent-primary)' }}>{stat.value}</div>
              <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>{stat.label}</div>
            </FrostedCard>
          ))}
        </div>

        {/* Mission & Vision */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
          <FrostedCard className="p-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-xl" style={{ backgroundColor: 'var(--accent-light)' }}>
                <Target size={28} style={{ color: 'var(--accent-primary)' }} />
              </div>
              <h2 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Our Mission</h2>
            </div>
            <p className="text-base leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              To democratize personalized education by combining proven learning science with cutting-edge AI,
              helping every learner build sustainable habits and reach their full potential.
            </p>
          </FrostedCard>

          <FrostedCard className="p-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-xl" style={{ backgroundColor: 'var(--accent-light)' }}>
                <Heart size={28} style={{ color: 'var(--accent-secondary)' }} />
              </div>
              <h2 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Our Values</h2>
            </div>
            <p className="text-base leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              We believe in learner-first design, data privacy, inclusive education, and building tools that
              respect your time while maximizing your growth.
            </p>
          </FrostedCard>
        </div>

        {/* Features Grid */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-6 text-center" style={{ color: 'var(--text-primary)' }}>
            Core Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {features.map((feature, index) => (
              <FrostedCard key={index} className="p-6 hover:scale-105 transition-all cursor-pointer">
                <div className="p-3 rounded-lg inline-block mb-3" style={{ backgroundColor: 'var(--accent-light)' }}>
                  <div style={{ color: feature.color }}>{feature.icon}</div>
                </div>
                <h3 className="font-bold mb-2" style={{ color: 'var(--text-primary)' }}>{feature.title}</h3>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{feature.description}</p>
              </FrostedCard>
            ))}
          </div>
        </div>

        {/* Comparison Table */}
        <FrostedCard className="p-8 mb-12">
          <h2 className="text-2xl font-bold mb-6 text-center" style={{ color: 'var(--text-primary)' }}>
            Why Choose Learn Sphere?
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full" style={{ borderCollapse: 'separate', borderSpacing: '0 0.5rem' }}>
              <thead>
                <tr>
                  <th className="text-left p-3 rounded-l-lg" style={{ backgroundColor: 'var(--accent-light)', color: 'var(--accent-primary)' }}>Feature</th>
                  <th className="text-center p-3" style={{ backgroundColor: 'var(--accent-light)', color: 'var(--accent-primary)' }}>Traditional Apps</th>
                  <th className="text-center p-3 rounded-r-lg" style={{ backgroundColor: 'var(--accent-light)', color: 'var(--accent-primary)' }}>Learn Sphere</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="p-3" style={{ color: 'var(--text-primary)' }}>AI-Powered Insights</td>
                  <td className="text-center p-3" style={{ color: 'var(--text-secondary)' }}>❌</td>
                  <td className="text-center p-3" style={{ color: 'var(--accent-primary)' }}>✅</td>
                </tr>
                <tr>
                  <td className="p-3" style={{ color: 'var(--text-primary)' }}>Visual Progress Tracking</td>
                  <td className="text-center p-3" style={{ color: 'var(--text-secondary)' }}>Basic</td>
                  <td className="text-center p-3" style={{ color: 'var(--accent-primary)' }}>Advanced</td>
                </tr>
                <tr>
                  <td className="p-3" style={{ color: 'var(--text-primary)' }}>Community & Leaderboards</td>
                  <td className="text-center p-3" style={{ color: 'var(--text-secondary)' }}>❌</td>
                  <td className="text-center p-3" style={{ color: 'var(--accent-primary)' }}>✅</td>
                </tr>
                <tr>
                  <td className="p-3" style={{ color: 'var(--text-primary)' }}>Focus Tools + Ambient Audio</td>
                  <td className="text-center p-3" style={{ color: 'var(--text-secondary)' }}>Limited</td>
                  <td className="text-center p-3" style={{ color: 'var(--accent-primary)' }}>Premium</td>
                </tr>
                <tr>
                  <td className="p-3" style={{ color: 'var(--text-primary)' }}>Personalized Roadmaps</td>
                  <td className="text-center p-3" style={{ color: 'var(--text-secondary)' }}>❌</td>
                  <td className="text-center p-3" style={{ color: 'var(--accent-primary)' }}>✅</td>
                </tr>
              </tbody>
            </table>
          </div>
        </FrostedCard>

        {/* Call to Action */}
        <FrostedCard className="p-10 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4" style={{ backgroundColor: 'var(--accent-light)' }}>
            <Shield size={32} style={{ color: 'var(--accent-primary)' }} />
          </div>
          <h2 className="text-3xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
            Ready to Transform Your Learning?
          </h2>
          <p className="text-lg mb-6 max-w-2xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
            Join thousands of learners who are building better habits, achieving their goals, and unlocking their potential with Learn Sphere.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <button 
              className="px-8 py-3 rounded-xl font-semibold hover:scale-105 transition-all shadow-lg"
              style={{ backgroundColor: 'var(--accent-primary)', color: 'var(--ui-white)' }}
              onClick={() => window.location.href = '/dashboard'}
            >
              Get Started Now
            </button>
            <button 
              className="px-8 py-3 rounded-xl font-semibold hover:scale-105 transition-all border"
              style={{ backgroundColor: 'transparent', color: 'var(--accent-primary)', borderColor: 'var(--accent-primary)' }}
              onClick={() => window.location.href = '/community'}
            >
              Join Community
            </button>
          </div>
          
          <div className="mt-8 pt-6 border-t" style={{ borderColor: 'var(--border-color)' }}>
            <p className="text-sm mb-3" style={{ color: 'var(--text-secondary)' }}>
              Have questions or feedback? We'd love to hear from you!
            </p>
            <a 
              href="mailto:hello@learnsphere.com" 
              className="inline-flex items-center gap-2 text-sm font-medium hover:underline"
              style={{ color: 'var(--accent-primary)' }}
            >
              📧 hello@learnsphere.com
            </a>
          </div>
        </FrostedCard>
      </div>
    </main>
  )
}
