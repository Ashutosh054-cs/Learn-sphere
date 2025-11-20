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
    if (level === 0) return 'hsl(220, 15%, 92%)';
    if (level === 1) return 'hsla(220, 70%, 40%, 0.15)';
    if (level === 2) return 'hsla(220, 70%, 40%, 0.3)';
    if (level === 3) return 'hsla(220, 70%, 40%, 0.5)';
    return 'hsla(220, 70%, 40%, 0.8)';
  };

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  // Dynamic config that updates on resize
  const [config, setConfig] = useState({ 
    weeks: 52, 
    cellSize: 14, 
    gap: 4,
    legendSize: 12
  });
  
  // Calculate optimal sizes based on available width
  const updateConfig = () => {
    if (typeof window !== 'undefined') {
      const width = window.innerWidth;
      
      let weeks, cellSize, gap, legendSize;
      
      // Mobile (< 640px): ultra-compact
      if (width < 640) {
        weeks = 26;
        cellSize = 6;  // 1.5 = 6px
        gap = 2;       // 0.5 = 2px
        legendSize = 8;
      }
      // Small tablet (640-768px): compact
      else if (width < 768) {
        weeks = 32;
        cellSize = 8;  // 2 = 8px
        gap = 2;
        legendSize = 8;
      }
      // Tablet (768-1024px): balanced
      else if (width < 1024) {
        weeks = 40;
        cellSize = 10; // 2.5 = 10px
        gap = 2;
        legendSize = 10;
      }
      // Small desktop (1024-1280px): comfortable
      else if (width < 1280) {
        weeks = 46;
        cellSize = 10;
        gap = 4;       // 1 = 4px
        legendSize = 10;
      }
      // Large desktop (1280-1536px): spacious
      else if (width < 1536) {
        weeks = 50;
        cellSize = 12; // 3 = 12px
        gap = 4;
        legendSize = 12;
      }
      // Extra large (>1536px): full year
      else {
        weeks = 52;
        cellSize = 14; // 3.5 = 14px
        gap = 4;
        legendSize = 12;
      }
      
      setConfig({ weeks, cellSize, gap, legendSize });
    }
  };
  
  useEffect(() => {
    updateConfig();
    window.addEventListener('resize', updateConfig);
    return () => window.removeEventListener('resize', updateConfig);
  }, []);
  
  return (
    <div className="mt-3 md:mt-4 lg:mt-6">
      <div className="flex overflow-x-auto pb-2 scrollbar-thin" style={{ maxWidth: '100%', gap: `${config.gap}px` }}>
        {weeks.slice(-config.weeks).map((week, weekIndex) => (
          <div key={weekIndex} className="flex flex-col" style={{ gap: `${config.gap}px` }}>
            {[0, 1, 2, 3, 4, 5, 6].map((dayIndex) => {
              const day = week.find(d => d.date.getDay() === dayIndex);
              return (
                <motion.div
                  key={dayIndex}
                  className="rounded-sm shrink-0"
                  style={{ 
                    width: `${config.cellSize}px`,
                    height: `${config.cellSize}px`,
                    backgroundColor: day ? getColor(day.level) : 'transparent'
                  }}
                  whileHover={{ scale: 1.2 }}
                  transition={{ duration: 0.15 }}
                  title={day ? `${day.count} activities on ${day.date.toLocaleDateString()}` : ''}
                />
              );
            })}
          </div>
        ))}
      </div>
      
      {/* Legend */}
      <div className="flex items-center mt-2 md:mt-3" style={{ gap: `${config.gap * 1.5}px` }}>
        <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>Less</span>
        {[0, 1, 2, 3, 4].map((level) => (
          <div
            key={level}
            className="rounded-sm shrink-0"
            style={{ 
              width: `${config.legendSize}px`,
              height: `${config.legendSize}px`,
              backgroundColor: getColor(level) 
            }}
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
      <div className="absolute top-3 right-3 md:top-4 md:right-4 flex gap-2 md:gap-3 z-10">
        <div className="flex items-center gap-1 md:gap-2" style={{ color: 'var(--text-primary)' }}>
          <Coins size={16} className="md:w-[18px] md:h-[18px]" strokeWidth={1.5} style={{ color: 'var(--accent-primary)' }} />
          <span className="font-semibold text-xs md:text-sm">{coins.toLocaleString()}</span>
        </div>
        <div className="flex items-center gap-1 md:gap-2" style={{ color: 'var(--text-primary)' }}>
          <Gem size={16} className="md:w-[18px] md:h-[18px]" strokeWidth={1.5} style={{ color: 'var(--accent-secondary)' }} />
          <span className="font-semibold text-xs md:text-sm">{gems}</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10">
        <div className="flex items-center gap-2 md:gap-3 mb-1 md:mb-2">
          <h2 className="text-sm md:text-base lg:text-lg font-semibold" style={{ color: 'var(--text-secondary)' }}>
            Current Streak
          </h2>
        </div>
        
        <div className="flex flex-wrap items-center gap-2 md:gap-4 lg:gap-6 mb-2 md:mb-3">
          <div className="flex items-center gap-2 md:gap-3">
            <motion.div
              className="flex items-center gap-1.5 md:gap-2"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <span className="text-3xl md:text-4xl lg:text-5xl font-black" style={{ color: 'var(--accent-primary)' }}>
                {streak}
              </span>
              <Flame size={28} className="md:w-9 md:h-9 lg:w-10 lg:h-10" strokeWidth={2} style={{ color: '#FF6B35' }} />
            </motion.div>
            <p className="text-xs md:text-sm lg:text-base" style={{ color: 'var(--text-secondary)' }}>
              days
            </p>
          </div>

          <div className="hidden sm:block h-8 md:h-10 lg:h-12 w-px" style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }} />

          <div>
            <p className="text-lg md:text-xl lg:text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
              {totalActivities}
            </p>
            <p className="text-xs whitespace-nowrap" style={{ color: 'var(--text-secondary)' }}>
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
