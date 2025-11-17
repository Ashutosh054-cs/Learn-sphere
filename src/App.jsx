import "./index.css";
import { BrowserRouter as Router } from 'react-router-dom'
import Navbar from './components/NavBar'

function App() {
  return (
    <Router>
      <div className="min-h-screen" style={{ backgroundColor: 'var(--bg-primary)' }}>
        <Navbar />
        <main className="container mx-auto px-4 py-8" style={{ paddingTop: '6rem' }}>
          <h1 style={{ color: 'var(--text-primary)' }}>
            Welcome to Learn Sphere
          </h1>
          <p className="text-lg mb-8" style={{ color: 'var(--text-secondary)' }}>
            Your AI-powered education platform
          </p>
          
          {/* Stats Display with Kinetic Typography */}
          <div className="mb-10">
            <h2 style={{ color: 'var(--accent-primary)' }}>Your Progress</h2>
            <div className="stat-text" style={{ color: 'var(--accent-primary)' }}>
              32 DAYS 🔥
            </div>
            <p style={{ color: 'var(--text-secondary)' }}>Current Streak</p>
          </div>

          {/* Achievement Example */}
          <div className="mb-10">
            <div className="achievement-text" style={{ 
              background: 'linear-gradient(to right, var(--accent-primary), var(--accent-secondary))',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              LEVEL UP! 🚀
            </div>
          </div>
          
          {/* Example buttons showing color palette */}
          <div className="flex gap-4 flex-wrap">
            <button className="px-6 py-3 font-semibold rounded-lg hover:scale-105 transition-all" style={{ backgroundColor: 'var(--accent-primary)', color: 'var(--bg-primary)' }}>
              Start Learning
            </button>
            <button className="px-6 py-3 font-semibold rounded-lg hover:scale-105 transition-all border" style={{ color: 'var(--accent-secondary)', borderColor: 'var(--accent-secondary)', backgroundColor: 'transparent' }}>
              AI Mentor 🤖
            </button>
            <button className="px-6 py-3 font-semibold rounded-lg hover:scale-105 transition-all border" style={{ color: 'var(--feedback-error)', borderColor: 'var(--feedback-error)', backgroundColor: 'transparent' }}>
              Error Example
            </button>
          </div>
        </main>
      </div>
    </Router>
  );
}

export default App;
