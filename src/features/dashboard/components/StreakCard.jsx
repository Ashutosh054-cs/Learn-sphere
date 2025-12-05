import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import FrostedCard from '../../../components/ui/FrostedCard';
import { Coins, Gem, Flame } from 'lucide-react';
import { useAuthStore } from '../../../stores/authStore';
import { streakService } from '../../../services/supabaseService';

const ContributionHeatmap = ({ userId, onDataLoaded }) => {
  const [contributionData, setContributionData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Load real contribution data from backend
  useEffect(() => {
    if (!userId) {
      const emptyData = generateEmptyYear();
      setContributionData(emptyData);
      setIsLoading(false);
      if (onDataLoaded) onDataLoaded(emptyData);
      return;
    }
    
    const loadContributions = async () => {
      setIsLoading(true);
      try {
        // Get daily activity for the last year
        const result = await streakService.getDailyActivity(userId, 365);
        if (result?.data && result.data.length > 0) {
          // Transform backend data to expected format
          const transformedData = result.data.map(activity => ({
            date: new Date(activity.activity_date),
            count: activity.activity_count || activity.focus_minutes || 0,
            level: calculateActivityLevel(activity.activity_count || activity.focus_minutes || 0)
          }));
          
          // Fill in missing dates with empty data
          const filledData = fillMissingDates(transformedData);
          setContributionData(filledData);
          if (onDataLoaded) onDataLoaded(filledData);
        } else {
          // Fallback to empty data if no backend data
          const emptyData = generateEmptyYear();
          setContributionData(emptyData);
          if (onDataLoaded) onDataLoaded(emptyData);
        }
      } catch (error) {
        console.error('Failed to load contribution data:', error);
        const emptyData = generateEmptyYear();
        setContributionData(emptyData);
        if (onDataLoaded) onDataLoaded(emptyData);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadContributions();
  }, [userId, onDataLoaded]);
  
  // Calculate activity level (0-4) based on count
  const calculateActivityLevel = (count) => {
    if (count === 0) return 0;
    if (count < 30) return 1;
    if (count < 60) return 2;
    if (count < 90) return 3;
    return 4;
  };
  
  // Fill in missing dates between data points
  const fillMissingDates = (data) => {
    const today = new Date();
    const startDate = new Date(today);
    startDate.setFullYear(today.getFullYear() - 1);
    
    const dateMap = new Map();
    data.forEach(item => {
      const dateStr = item.date.toISOString().split('T')[0];
      dateMap.set(dateStr, item);
    });
    
    const filledData = [];
    let currentDate = new Date(startDate);
    
    while (currentDate <= today) {
      const dateStr = currentDate.toISOString().split('T')[0];
      if (dateMap.has(dateStr)) {
        filledData.push(dateMap.get(dateStr));
      } else {
        filledData.push({
          date: new Date(currentDate),
          level: 0,
          count: 0,
        });
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    return filledData;
  };
  
  // Generate empty year data as fallback
  const generateEmptyYear = () => {
    const data = [];
    const today = new Date();
    const startDate = new Date(today);
    startDate.setFullYear(today.getFullYear() - 1);
    
    let currentDate = new Date(startDate);
    
    while (currentDate <= today) {
      data.push({
        date: new Date(currentDate),
        level: 0,
        count: 0,
      });
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    return data;
  };
  
  // Group data by weeks
  const weeks = [];
  let currentWeek = [];

  contributionData.forEach((day) => {
    const dayOfWeek = new Date(day.date).getDay();

    if (dayOfWeek === 0 && currentWeek.length > 0) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
    currentWeek.push({
      ...day,
      date: new Date(day.date) // Ensure date is a Date object
    });
  });

  if (currentWeek.length > 0) {
    weeks.push(currentWeek);
  }

  const getColor = (level) => {
    const colors = [
      'var(--heatmap-color-0)',
      'var(--heatmap-color-1)',
      'var(--heatmap-color-2)',
      'var(--heatmap-color-3)',
      'var(--heatmap-color-4)'
    ];
    return colors[level] || colors[0];
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
      
      // Mobile: 320-480px
      if (width < 481) {
        weeks = 12;
        cellSize = 5;
        gap = 2;
      } 
      // Small tablets: 481-768px
      else if (width < 769) {
        weeks = 20;
        cellSize = 6;
        gap = 2;
      } 
      // Tablets/iPad: 769-1024px
      else if (width < 1025) {
        weeks = 28;
        cellSize = 7;
        gap = 3;
      } 
      // Small laptops: 1025-1366px
      else if (width < 1367) {
        weeks = 36;
        cellSize = 9;
        gap = 4;
      } 
      // Large screens: 1367px+
      else {
        weeks = 52;
        cellSize = 11;
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
    <div className="mt-4 sm:mt-5 md:mt-6 overflow-x-auto pb-2">
      <div className="flex pr-2 sm:pr-3 md:pr-4" style={{ gap: `${config.gap}px`, maxWidth: '100%', minWidth: 'min-content' }}>
        {weeks.slice(-config.weeks).map((week, weekIndex) => (
          <div key={weekIndex} className="flex flex-col shrink-0" style={{ gap: `${config.gap}px` }}>
            {[0, 1, 2, 3, 4, 5, 6].map((dayIndex) => {
              const day = week.find(d => d.date.getDay() === dayIndex);
              return (
                <motion.div
                  key={dayIndex}
                  className="rounded-sm"
                  style={{ 
                    width: `${config.cellSize}px`,
                    height: `${config.cellSize}px`,
                    backgroundColor: day ? getColor(day.level) : 'transparent',
                    minWidth: `${config.cellSize}px`,
                    minHeight: `${config.cellSize}px`
                  }}
                  whileHover={{ scale: 1.3 }}
                  title={day ? `${day.count} activities on ${day.date.toLocaleDateString()}` : ''}      
                />
              );
            })}
          </div>
        ))}
      </div>

      {/* Legend - Responsive sizing */}
      <div className="flex items-center gap-1.5 sm:gap-2 mt-3 sm:mt-4">
        <span className="text-[0.65rem] sm:text-xs md:text-sm" style={{ color: 'var(--text-secondary)' }}>Less</span>
        {[0, 1, 2, 3, 4].map((level) => (
          <div
            key={level}
            className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 rounded-sm shrink-0"
            style={{ backgroundColor: getColor(level) }}
          />
        ))}
        <span className="text-[0.65rem] sm:text-xs md:text-sm" style={{ color: 'var(--text-secondary)' }}>More</span>
      </div>
    </div>
  );
};

export default function StreakCard({ streak, coins, gems, totalMinutes = 0 }) {
  const user = useAuthStore(state => state.user);
  const [totalActivities, setTotalActivities] = useState(0);
  
  // Update total activities when contribution data is loaded
  const handleDataLoaded = (data) => {
    const total = data.reduce((sum, day) => sum + (day.count || 0), 0);
    setTotalActivities(total);
  };
  
  return (
    <FrostedCard className="relative overflow-hidden h-full p-3 sm:p-4 md:p-5 lg:p-6">
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

      {/* Currency Display - Responsive */}
      <div className="absolute top-2 right-2 sm:top-3 sm:right-3 md:top-4 md:right-4 flex gap-2 sm:gap-2.5 md:gap-3 z-10">
        <div className="flex items-center gap-1 sm:gap-1.5 md:gap-2" style={{ color: 'var(--text-primary)' }}>
          <Coins size={14} className="sm:w-4 sm:h-4 md:w-[18px] md:h-[18px]" strokeWidth={1.5} style={{ color: 'var(--accent-primary)' }} />
          <span className="font-semibold text-xs sm:text-sm">{coins.toLocaleString()}</span>
        </div>
        <div className="flex items-center gap-1 sm:gap-1.5 md:gap-2" style={{ color: 'var(--text-primary)' }}>
          <Gem size={14} className="sm:w-4 sm:h-4 md:w-[18px] md:h-[18px]" strokeWidth={1.5} style={{ color: 'var(--accent-secondary)' }} />
          <span className="font-semibold text-xs sm:text-sm">{gems}</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10">
        <div className="flex items-center gap-2 sm:gap-2.5 md:gap-3 mb-1.5 sm:mb-2">
          <h2 className="text-sm sm:text-base md:text-lg lg:text-xl font-semibold" style={{ color: 'var(--text-secondary)' }}>
            Current Streak
          </h2>
        </div>

        {/* Responsive streak display - stack on very small screens */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 md:gap-6 mb-2 sm:mb-3">
          <div>
            <motion.div
              className="flex items-center gap-2 sm:gap-2.5 md:gap-3"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <span className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black" style={{ color: 'var(--accent-primary)' }}>
                {streak}
              </span>
              <Flame size={28} className="sm:w-8 sm:h-8 md:w-10 md:h-10 lg:w-12 lg:h-12" strokeWidth={2} style={{ color: '#FF6B35' }} />
            </motion.div>
            <p className="text-xs sm:text-sm md:text-base mt-0.5 sm:mt-1" style={{ color: 'var(--text-secondary)' }}>
              days
            </p>
          </div>

          <div className="h-px w-full sm:h-10 sm:w-px md:h-12" style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }} />

          <div>
            <p className="text-xl sm:text-2xl md:text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>
              {totalActivities}
            </p>
            <p className="text-[0.65rem] sm:text-xs md:text-sm" style={{ color: 'var(--text-secondary)' }}>
              activities this year
            </p>
          </div>
        </div>

        {/* Contribution Heatmap */}
        <ContributionHeatmap userId={user?.id} onDataLoaded={handleDataLoaded} />
      </div>
    </FrostedCard>
  );
}
