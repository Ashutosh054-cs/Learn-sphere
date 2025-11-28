import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import FrostedCard from '../../../components/ui/FrostedCard';
import Button from '../../../components/ui/Button';
import { Brain, Target, CheckCircle2 } from 'lucide-react';

export default function MentorStatusCard({ className = '' }) {
  const navigate = useNavigate();
  const todayQuests = 5;
  const completedQuests = 3;
  const completionRate = Math.round((completedQuests / todayQuests) * 100);

  return (
    <FrostedCard className={className}>
      <div className="flex items-start gap-1.5 sm:gap-2 md:gap-3 mb-1.5 sm:mb-2 md:mb-3">
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.7, 1, 0.7],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          <Brain 
            className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 lg:w-7 lg:h-7"
            strokeWidth={1.5} 
            style={{ color: 'var(--accent-secondary)' }} 
          />
        </motion.div>
        
        <div className="flex-1">
          <div className="flex items-center gap-1 sm:gap-1.5 md:gap-2">
            <h3 className="text-xs sm:text-sm md:text-base lg:text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
              AI Mentor
            </h3>
            <motion.div
              className="px-1 sm:px-1.5 md:px-2 py-0.5 rounded-full text-[0.6rem] sm:text-[0.65rem] md:text-xs font-semibold"
              style={{ 
                backgroundColor: 'var(--accent-light)',
                color: 'var(--accent-secondary)'
              }}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3 }}
            >
              Active
            </motion.div>
          </div>
          <p className="text-[0.6rem] sm:text-[0.65rem] md:text-xs" style={{ color: 'var(--text-secondary)' }}>
            Adaptive Learning
          </p>
        </div>
      </div>

      {/* Quest Stats */}
      <div className="flex items-center gap-1.5 sm:gap-2 md:gap-4 mb-1.5 sm:mb-2 md:mb-3">
        <div className="flex items-center gap-0.5 sm:gap-1 md:gap-2">
          <Target className="w-2.5 h-2.5 sm:w-3 sm:h-3 md:w-3.5 md:h-3.5" style={{ color: 'var(--accent-primary)' }} />
          <span className="text-[0.6rem] sm:text-[0.65rem] md:text-xs" style={{ color: 'var(--text-secondary)' }}>
            {completedQuests}/{todayQuests} Quests
          </span>
        </div>
        <div className="flex items-center gap-0.5 sm:gap-0.5 md:gap-1">
          <CheckCircle2 className="w-2.5 h-2.5 sm:w-3 sm:h-3 md:w-3.5 md:h-3.5" style={{ color: '#4ADE80' }} />
          <span className="text-[0.6rem] sm:text-[0.65rem] md:text-xs font-semibold" style={{ color: '#4ADE80' }}>
            {completionRate}%
          </span>
        </div>
      </div>

      <Button 
        variant="primary" 
        className="w-full text-[0.65rem] sm:text-xs md:text-sm py-1 sm:py-1.5 md:py-2 cursor-pointer"
        onClick={() => navigate('/roadmap')}
      >
        Review Today's Quests
      </Button>
    </FrostedCard>
  );
}
