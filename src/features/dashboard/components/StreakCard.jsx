import { motion } from 'framer-motion';
import FrostedCard from '../../../components/ui/FrostedCard';
import { Coins, Gem, Flame } from 'lucide-react';
import { contributionData } from '../../../data/mockContributions';

const ContributionHeatmap = () => {
  // Group data by weeks
  const weeks = [];
  let currentWeek = [];
  
  contributionData.forEach((day, index) => {
    const dayOfWeek = day.date.getDay();
    
    if (dayOfWeek === 0 && currentWeek.length > 0) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
    currentWeek.push(day);
  });
  
  if (currentWeek.length > 0) {
    weeks.push(currentWeek);
  }

  const getColor = (level) => {
    if (level === 0) return 'hsl(220, 15%, 92%)';
    if (level === 1) return 'hsla(220, 70%, 40%, 0.15)';
    if (level === 2) return 'hsla(220, 70%, 40%, 0.3)';
    if (level === 3) return 'hsla(220, 70%, 40%, 0.5)';
    return 'hsla(220, 70%, 40%, 0.8)';
  };

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  return (
    <div className="mt-6">
      <div className="flex gap-1.5 overflow-x-auto pb-2" style={{ maxWidth: '100%' }}>
        {weeks.slice(-52).map((week, weekIndex) => (
          <div key={weekIndex} className="flex flex-col gap-2">
            {[0, 1, 2, 3, 4, 5, 6].map((dayIndex) => {
              const day = week.find(d => d.date.getDay() === dayIndex);
              return (
                <motion.div
                  key={dayIndex}
                  className="w-3.5 h-3.5 rounded-sm"
                  style={{ backgroundColor: day ? getColor(day.level) : 'transparent' }}
                  whileHover={{ scale: 1.4 }}
                  title={day ? `${day.count} activities on ${day.date.toLocaleDateString()}` : ''}
                />
              );
            })}
          </div>
        ))}
      </div>
      
      {/* Legend */}
      <div className="flex items-center gap-2 mt-4">
        <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>Less</span>
        {[0, 1, 2, 3, 4].map((level) => (
          <div
            key={level}
            className="w-4 h-4 rounded-sm"
            style={{ backgroundColor: getColor(level) }}
          />
        ))}
        <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>More</span>
      </div>
    </div>
  );
};

export default function StreakCard({ streak, coins, gems }) {
  const totalActivities = contributionData.reduce((sum, day) => sum + day.count, 0);
  
  return (
    <FrostedCard className="relative overflow-hidden h-full">
      {/* Animated background gradient */}
      <motion.div
        className="absolute inset-0 opacity-10"
        style={{
          background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))',
        }}
        animate={{
          backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'linear',
        }}
      />

      {/* Currency Display */}
      <div className="absolute top-4 right-4 flex gap-3 z-10">
        <div className="flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
          <Coins size={18} strokeWidth={1.5} style={{ color: 'var(--accent-primary)' }} />
          <span className="font-semibold text-sm">{coins.toLocaleString()}</span>
        </div>
        <div className="flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
          <Gem size={18} strokeWidth={1.5} style={{ color: 'var(--accent-secondary)' }} />
          <span className="font-semibold text-sm">{gems}</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-2">
          <h2 className="text-lg font-semibold" style={{ color: 'var(--text-secondary)' }}>
            Current Streak
          </h2>
        </div>
        
        <div className="flex items-center gap-6 mb-3">
          <div>
            <motion.div
              className="flex items-center gap-3"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <span className="text-5xl font-black" style={{ color: 'var(--accent-primary)' }}>
                {streak}
              </span>
              <Flame size={40} strokeWidth={2} style={{ color: '#FF6B35' }} />
            </motion.div>
            <p className="text-base mt-1" style={{ color: 'var(--text-secondary)' }}>
              days
            </p>
          </div>

          <div className="h-12 w-px" style={{ backgroundColor: 'var(--border-color)' }} />

          <div>
            <p className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
              {totalActivities}
            </p>
            <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
              activities this year
            </p>
          </div>
        </div>

        {/* Contribution Heatmap */}
        <ContributionHeatmap />
      </div>
    </FrostedCard>
  );
}
