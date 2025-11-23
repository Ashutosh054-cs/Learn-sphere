import { useState } from 'react';
import { Trophy, ChevronLeft, ChevronRight, Lock } from 'lucide-react';
import FrostedCard from '../../../components/ui/FrostedCard';
import useRoadmapStore from '../../../stores/roadmapStore';

export default function BadgesPanel() {
  const { badges } = useRoadmapStore();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);

  const itemsPerPage = 4;
  const totalPages = Math.ceil(badges.length / itemsPerPage);
  const currentBadges = badges.slice(
    currentIndex * itemsPerPage,
    (currentIndex + 1) * itemsPerPage
  );

  const nextPage = () => {
    if (currentIndex < totalPages - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const prevPage = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleBadgeClick = (badge) => {
    if (badge.unlocked) {
      // Trigger confetti animation
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 2000);
    }
  };

  return (
    <FrostedCard className="p-6 relative overflow-hidden">
      {/* Confetti Effect */}
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none z-10">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-confetti"
              style={{
                left: `${Math.random() * 100}%`,
                top: '-10px',
                width: '8px',
                height: '8px',
                backgroundColor: ['#00E6E6', '#7F00FF', '#FF6B35', '#4ADE80'][Math.floor(Math.random() * 4)],
                borderRadius: '50%',
                animationDelay: `${Math.random() * 0.5}s`,
                animationDuration: `${1 + Math.random()}s`
              }}
            />
          ))}
        </div>
      )}

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Trophy className="w-6 h-6" style={{ color: 'var(--accent-secondary)' }} />
          <h2 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
            Achievements
          </h2>
          <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            ({badges.filter(b => b.unlocked).length}/{badges.length})
          </span>
        </div>

        {/* Carousel Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={prevPage}
            disabled={currentIndex === 0}
            className="p-1 rounded-full transition-all hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-5 h-5" style={{ color: 'var(--text-secondary)' }} />
          </button>
          <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>
            {currentIndex + 1}/{totalPages}
          </span>
          <button
            onClick={nextPage}
            disabled={currentIndex >= totalPages - 1}
            className="p-1 rounded-full transition-all hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronRight className="w-5 h-5" style={{ color: 'var(--text-secondary)' }} />
          </button>
        </div>
      </div>

      {/* Badges Grid */}
      <div className="grid grid-cols-4 gap-3">
        {currentBadges.map((badge) => (
          <div
            key={badge.id}
            className={`p-3 rounded-xl border transition-all cursor-pointer ${
              badge.unlocked ? 'hover:scale-110' : ''
            }`}
            style={{
              backgroundColor: badge.unlocked ? 'var(--accent-light)' : 'var(--bg-secondary)',
              borderColor: badge.unlocked ? 'var(--accent-primary)' : 'var(--border-color)',
              opacity: badge.unlocked ? 1 : 0.5,
              boxShadow: badge.unlocked ? '0 0 20px rgba(0, 230, 230, 0.3)' : 'none'
            }}
            onClick={() => handleBadgeClick(badge)}
          >
            <div className="flex flex-col items-center text-center">
              <div className="text-3xl mb-1 relative">
                {badge.unlocked ? badge.icon : <Lock className="w-6 h-6" style={{ color: 'var(--text-secondary)' }} />}
              </div>
              <span className="text-xs font-medium" style={{ color: badge.unlocked ? 'var(--text-primary)' : 'var(--text-secondary)' }}>
                {badge.title}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Progress Bar */}
      <div className="mt-4">
        <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}>
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              background: 'linear-gradient(to right, var(--accent-primary), var(--accent-secondary))',
              width: `${(badges.filter(b => b.unlocked).length / badges.length) * 100}%`
            }}
          />
        </div>
      </div>

      <style>{`
        @keyframes confetti {
          0% {
            transform: translateY(-10px) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(600px) rotate(720deg);
            opacity: 0;
          }
        }
        .animate-confetti {
          animation: confetti linear forwards;
        }
      `}</style>
    </FrostedCard>
  );
}
