import { motion } from 'framer-motion';
import FrostedCard from '../../../components/ui/FrostedCard';
import { Flame, Coins, Gem, TrendingUp } from 'lucide-react';

export default function CompactStreakCard({ streak, coins, gems, className = '' }) {
  const nextMilestone = 100;
  const progress = Math.round((streak / nextMilestone) * 100);
  const bestStreak = 87; // Example best streak

  return (
    <FrostedCard className={className}>
      <div className="flex items-center justify-between mb-1 md:mb-2">
        <div>
          <h3 className="text-sm md:text-base lg:text-lg font-semibold" style={{ color: 'var(--text-secondary)' }}>
            Current Streak
          </h3>
        </div>
        <div className="flex gap-1.5 md:gap-2">
          <div className="flex items-center gap-0.5 md:gap-1">
            <Coins className="w-3 h-3 md:w-3.5 md:h-3.5" strokeWidth={1.5} style={{ color: 'var(--accent-primary)' }} />
            <span className="text-[0.65rem] md:text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>
              {coins.toLocaleString()}
            </span>
          </div>
          <div className="flex items-center gap-0.5 md:gap-1">
            <Gem className="w-3 h-3 md:w-3.5 md:h-3.5" strokeWidth={1.5} style={{ color: 'var(--accent-secondary)' }} />
            <span className="text-[0.65rem] md:text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>
              {gems}
            </span>
          </div>
        </div>
      </div>

      {/* Streak Display */}
      <div className="flex items-center justify-between mb-3 md:mb-4">
        <motion.div
          className="flex items-center gap-1 md:gap-2"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <span className="text-2xl md:text-3xl lg:text-4xl font-black" style={{ color: 'var(--text-primary)' }}>
            {streak}
          </span>
          <Flame className="w-5 h-5 md:w-6 md:h-6 lg:w-7 lg:h-7" strokeWidth={2} style={{ color: '#FF6B35' }} />
        </motion.div>
        <div className="text-right">
          <div className="flex items-center gap-0.5 md:gap-1">
            <TrendingUp className="w-2.5 h-2.5 md:w-3 md:h-3" style={{ color: '#4ADE80' }} />
            <span className="text-[0.65rem] md:text-xs font-semibold" style={{ color: '#4ADE80' }}>Best: {bestStreak}</span>
          </div>
          <p className="text-[0.65rem] md:text-xs" style={{ color: 'var(--text-secondary)' }}>
            {nextMilestone - streak} to {nextMilestone}
          </p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-1.5 md:h-2 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--border-color)' }}>
        <motion.div
          className="h-full rounded-full relative"
          style={{
            background: 'linear-gradient(to right, var(--accent-primary), var(--accent-secondary))',
            width: `${progress}%`,
          }}
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 1, delay: 0.2 }}
        >
          <motion.div
            className="absolute right-0 top-0 h-full w-1"
            style={{ backgroundColor: 'rgba(255, 255, 255, 0.5)' }}
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        </motion.div>
      </div>
    </FrostedCard>
  );
}
