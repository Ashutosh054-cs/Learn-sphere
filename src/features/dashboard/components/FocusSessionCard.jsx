import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import FrostedCard from '../../../components/ui/FrostedCard';
import Button from '../../../components/ui/Button';

export default function FocusSessionCard({ className = '', todayMinutes = 0, totalSessions = 0, currentPeriod = 'morning' }) {
  const navigate = useNavigate();
  const targetMinutes = 120; // 2 hours target per 12-hour period
  const progress = Math.min((todayMinutes / targetMinutes) * 100, 100);
  
  const periodIcon = currentPeriod === 'morning' ? '🌅' : '🌙';
  const periodLabel = currentPeriod === 'morning' ? 'Morning' : 'Evening';

  // Calculate stroke dash for circular progress
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <FrostedCard 
      className={`h-full ${className}`}
    >
      <div className="flex items-center justify-between mb-0">
        <div className="flex items-center gap-1.5 sm:gap-2">
          <h3 className="text-xs sm:text-sm md:text-base lg:text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
            Focus Session
          </h3>
          <span className="text-sm sm:text-base" title={`${periodLabel} Session`}>{periodIcon}</span>
        </div>
        <motion.div
          className="px-1.5 sm:px-2 py-0.5 rounded-full text-[0.6rem] sm:text-[0.65rem] md:text-xs font-semibold"
          style={{ 
            backgroundColor: 'rgba(255, 107, 53, 0.15)',
            color: '#FF6B35'
          }}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
        >
          {totalSessions} total
        </motion.div>
      </div>

      {/* Responsive layout - reduced horizontal offset on mobile */}
      <div className="flex items-center gap-1.5 sm:gap-2 transform translate-x-4 -translate-y-3 sm:translate-x-6 sm:-translate-y-4 md:translate-x-8 md:-translate-y-5">
        {/* Circular Timer - responsive sizing */}
        <div className="relative w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 shrink-0 mb-0">
          {/* Background circle */}
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
            <circle
              cx="60"
              cy="60"
              r={radius}
              stroke="var(--border-color)"
              strokeWidth="6"
              fill="none"
              opacity="0.3"
            />
            {/* Progress circle with gradient */}
            <motion.circle
              cx="60"
              cy="60"
              r={radius}
              stroke="url(#focusGradient)"
              strokeWidth="6"
              fill="none"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset }}
              transition={{ duration: 0.5 }}
            />
            <defs>
              <linearGradient id="focusGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FF6B35" />
                <stop offset="50%" stopColor="var(--accent-secondary)" />
                <stop offset="100%" stopColor="var(--accent-primary)" />
              </linearGradient>
            </defs>
          </svg>
          
          {/* Time display - responsive text */}
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xs sm:text-sm md:text-base font-bold" style={{ color: 'var(--text-primary)' }}>
              {todayMinutes}m
            </span>
          </div>
        </div>

        {/* Controls - responsive spacing */}
        <div className="flex flex-col gap-0.5 sm:gap-1 ml-6 sm:ml-8 md:ml-10 lg:ml-12">
          <Button 
            variant="primary" 
            className="text-[0.65rem] sm:text-[0.75rem] md:text-xs py-0.5 px-2.5 sm:px-3 min-w-14 sm:min-w-16 cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              navigate('/focus');
            }}
          >
            Start
          </Button>
          <p className="text-[0.55rem] sm:text-[0.6rem] md:text-xs text-center" style={{ color: 'var(--text-secondary)' }}>
            {Math.round(progress)}% of goal
          </p>
        </div>
      </div>

      {/* Progress bar - responsive margin */}
      <div className="-mt-1.5 sm:-mt-2 md:-mt-3 h-1.5 sm:h-2 rounded-full overflow-hidden" style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}>
        <motion.div
          className="h-full rounded-full"
          style={{
            background: 'linear-gradient(to right, #FF6B35, var(--accent-secondary), var(--accent-primary))',
            width: `${progress}%`,
          }}
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>
    </FrostedCard>
  );
}
