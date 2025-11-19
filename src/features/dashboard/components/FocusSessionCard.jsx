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
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <FrostedCard 
      className={`cursor-pointer h-full ${className}`}
      onClick={() => navigate('/focus')}
      hover={true}
    >
      <div className="flex items-center justify-between mb-1">
        <h3 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
          Focus Session
        </h3>
        <motion.div
          className="px-2 py-0.5 rounded-full text-xs font-semibold"
          style={{ 
            backgroundColor: 'rgba(255, 107, 53, 0.15)',
            color: '#FF6B35'
          }}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
        >
          {sessionsToday}/{targetSessions} today
        </motion.div>
      </div>

      {/* Compact horizontal layout */}
      <div className="flex items-center gap-2">
        {/* Circular Timer */}
        <div className="relative w-28 h-28 shrink-0">
          {/* Background circle */}
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="56"
              cy="56"
              r={radius}
              stroke="rgba(255, 255, 255, 0.1)"
              strokeWidth="5"
              fill="none"
            />
            {/* Progress circle with gradient */}
            <motion.circle
              cx="56"
              cy="56"
              r={radius}
              stroke="url(#focusGradient)"
              strokeWidth="5"
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
            <span className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
              25:00
            </span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-col gap-1.5 ml-2">
          <Button 
            variant="primary" 
            className="text-xs py-0.5 px-2.5"
            onClick={(e) => {
              e.stopPropagation();
              navigate('/focus');
            }}
          >
            Start
          </Button>
          <Button 
            variant="outline"
            className="text-xs py-0.5 px-2"
            onClick={(e) => e.stopPropagation()}
          >
            Lo-Fi
          </Button>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mt-2 h-2 rounded-full overflow-hidden" style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}>
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
