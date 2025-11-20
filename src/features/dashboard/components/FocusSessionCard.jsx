import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import FrostedCard from '../../../components/ui/FrostedCard';
import Button from '../../../components/ui/Button';

export default function FocusSessionCard({ className = '' }) {
  const navigate = useNavigate();
  const progress = 35; // Current session progress
  const sessionsToday = 3;
  const targetSessions = 8;

  // Calculate stroke dash for circular progress
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <FrostedCard 
      className={`cursor-pointer h-full ${className}`}
      onClick={() => navigate('/focus')}
      hover={true}
    >
      <div className="flex items-center justify-between mb-0">
        <h3 className="text-sm md:text-base lg:text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
          Focus Session
        </h3>
        <motion.div
          className="px-1.5 md:px-2 py-0.5 rounded-full text-[0.65rem] md:text-xs font-semibold"
          style={{ 
            backgroundColor: 'rgba(255, 107, 53, 0.15)',
            color: '#FF6B35'
          }}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
        >
          {sessionsToday}/{targetSessions}
        </motion.div>
      </div>

      {/* Compact horizontal layout */}
      <div className="flex items-center gap-2 transform translate-x-6 -translate-y-4 md:translate-x-8 md:-translate-y-5">
        {/* Circular Timer */}
        <div className="relative w-24 h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 shrink-0 mb-0">
          {/* Background circle */}
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
            <circle
              cx="60"
              cy="60"
              r={radius}
              stroke="rgba(255, 255, 255, 0.1)"
              strokeWidth="6"
              fill="none"
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
          
          {/* Time display */}
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-sm md:text-base font-bold" style={{ color: 'var(--text-primary)' }}>
              25:00
            </span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-col gap-1 ml-8 md:ml-10 lg:ml-12">
          <Button 
            variant="primary" 
            className="text-[0.75rem] md:text-xs py-0.5 px-3 min-w-16"
            onClick={(e) => {
              e.stopPropagation();
              navigate('/focus');
            }}
          >
            Start
          </Button>
          <Button 
            variant="outline"
            className="text-[0.75rem] md:text-xs py-0.5 px-2.5 md:px-3 min-w-14"
            onClick={(e) => e.stopPropagation()}
          >
            Lo-Fi
          </Button>
        </div>
      </div>

      {/* Progress bar (moved up to sit closer under the circle) */}
      <div className="-mt-2 md:-mt-3 h-2 rounded-full overflow-hidden" style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}>
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
