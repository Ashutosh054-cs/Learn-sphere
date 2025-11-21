import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
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
    if (level === 0) return 'rgba(255, 255, 255, 0.05)';
    if (level === 1) return 'rgba(0, 230, 230, 0.2)';
    if (level === 2) return 'rgba(0, 230, 230, 0.4)';
    if (level === 3) return 'rgba(0, 230, 230, 0.6)';
    return 'rgba(0, 230, 230, 0.9)';
  };

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  // Dynamic config based on container width
  const [config, setConfig] = useState({ 
    weeks: 52, 
    cellSize: 14, 
    gap: 6
  });
  
  const updateConfig = () => {
    if (typeof window !== 'undefined') {
      const width = window.innerWidth;
      
      let weeks, cellSize, gap;
      
      // Account for navbar (256px) in calculations
      if (width < 768) {
        weeks = 20;
        cellSize = 6;
        gap = 2;
      } else if (width < 1024) {
        weeks = 28;
        cellSize = 7;
        gap = 3;
      } else if (width < 1280) {
        weeks = 36;
        cellSize = 8;
        gap = 3;
      } else if (width < 1440) {
        weeks = 42;
        cellSize = 9;
        gap = 4;
      } else if (width < 1600) {
        weeks = 48;
        cellSize = 10;
        gap = 4;
      } else if (width < 1800) {
        weeks = 50;
        cellSize = 11;
        gap = 5;
      } else {
        weeks = 52;
        cellSize = 12;
        gap = 5;
      }
      
      setConfig({ weeks, cellSize, gap });
    }
  };
  
  useEffect(() => {
    updateConfig();
    window.addEventListener('resize', updateConfig);
    return () => window.removeEventListener('resize', updateConfig);
  }, []);

  return (
    <div className="mt-6">
      <div className="flex pr-4" style={{ gap: `${config.gap}px`, maxWidth: '100%' }}>
        {weeks.slice(-config.weeks).map((week, weekIndex) => (
          <div key={weekIndex} className="flex flex-col" style={{ gap: `${config.gap}px` }}>
            {[0, 1, 2, 3, 4, 5, 6].map((dayIndex) => {
              const day = week.find(d => d.date.getDay() === dayIndex);
              return (
                <motion.div
                  key={dayIndex}
                  className="rounded-sm"
                  style={{ 
                    width: `${config.cellSize}px`,
                    height: `${config.cellSize}px`,
                    backgroundColor: day ? getColor(day.level) : 'transparent' 
                  }}
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

          <div className="h-12 w-px" style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }} />

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
