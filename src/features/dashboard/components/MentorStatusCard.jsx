import { motion } from 'framer-motion';
import FrostedCard from '../../../components/ui/FrostedCard';
import Button from '../../../components/ui/Button';
import { Brain, Target, CheckCircle2 } from 'lucide-react';

export default function MentorStatusCard({ className = '' }) {
  const todayQuests = 5;
  const completedQuests = 3;
  const completionRate = Math.round((completedQuests / todayQuests) * 100);

  return (
    <FrostedCard className={className}>
      <div className="flex items-start gap-3 mb-3">
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
            size={28} 
            strokeWidth={1.5} 
            style={{ color: 'var(--accent-secondary)' }} 
          />
        </motion.div>
        
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
              AI Mentor
            </h3>
            <motion.div
              className="px-2 py-0.5 rounded-full text-xs font-semibold"
              style={{ 
                backgroundColor: 'rgba(0, 230, 230, 0.15)',
                color: 'var(--accent-secondary)'
              }}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3 }}
            >
              Active
            </motion.div>
          </div>
          <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
            Adaptive Learning Path
          </p>
        </div>
      </div>

      {/* Quest Stats */}
      <div className="flex items-center gap-4 mb-3">
        <div className="flex items-center gap-2">
          <Target size={14} style={{ color: 'var(--accent-primary)' }} />
          <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>
            {completedQuests}/{todayQuests} Quests
          </span>
        </div>
        <div className="flex items-center gap-1">
          <CheckCircle2 size={14} style={{ color: '#4ADE80' }} />
          <span className="text-xs font-semibold" style={{ color: '#4ADE80' }}>
            {completionRate}%
          </span>
        </div>
      </div>

      <Button variant="primary" className="w-full text-sm py-2">
        Review Today's Quests
      </Button>
    </FrostedCard>
  );
}
