import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import FrostedCard from '../../../components/ui/FrostedCard';
import { Code, Calculator, Zap } from 'lucide-react';

// Selected three placeholder games from the user's list
const games = [
  { name: 'HTML Structure Builder', icon: Code, color: 'var(--accent-primary)', difficulty: 'Easy', progress: 65 },
  { name: 'CSS Selector Battle', icon: Calculator, color: 'var(--accent-secondary)', difficulty: 'Medium', progress: 42 },
  { name: 'JS Puzzle Maze', icon: Zap, color: 'var(--accent-primary)', difficulty: 'Hard', progress: 18 },
];

export default function QuickLaunchCard({ className = '' }) {
  const navigate = useNavigate();

  return (
    <FrostedCard className={className}>
      <h3 className="text-lg font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
        Jump Back In
      </h3>

      <div className="flex gap-3 justify-between">
        {games.map((game) => (
          <motion.div
            key={game.name}
            className="flex-1 flex flex-col items-center gap-2 p-3 rounded-2xl cursor-pointer border border-transparent relative overflow-hidden"
            style={{ backgroundColor: 'rgba(255, 255, 255, 0.03)' }}
            whileHover={{ scale: 1.05, rotateY: 5, borderColor: 'var(--accent-primary)' }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.2 }}
            onClick={() => navigate('/learn')}
          >
            {/* Difficulty Badge */}
            <div 
              className="absolute top-1 right-1 px-1.5 py-0.5 rounded text-xs font-semibold"
              style={{ 
                backgroundColor: game.difficulty === 'Easy' ? 'rgba(74, 222, 128, 0.2)' : 
                               game.difficulty === 'Medium' ? 'rgba(251, 191, 36, 0.2)' : 
                               'rgba(239, 68, 68, 0.2)',
                color: game.difficulty === 'Easy' ? '#4ADE80' : 
                       game.difficulty === 'Medium' ? '#FBBF24' : 
                       '#EF4444',
                fontSize: '0.65rem'
              }}
            >
              {game.difficulty[0]}
            </div>

            <game.icon size={24} strokeWidth={1.5} style={{ color: game.color }} />
            <span className="text-xs font-medium text-center" style={{ color: 'var(--text-secondary)' }}>
              {game.name}
            </span>
            
            {/* Mini progress bar */}
            <div className="w-full h-1 rounded-full overflow-hidden mt-1" style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}>
              <motion.div
                className="h-full rounded-full"
                style={{
                  backgroundColor: game.color,
                  width: `${game.progress}%`
                }}
                initial={{ width: 0 }}
                animate={{ width: `${game.progress}%` }}
                transition={{ duration: 0.8, delay: 0.2 }}
              />
            </div>
          </motion.div>
        ))}
      </div>

      {/* <p className="mt-3 text-xs" style={{ color: 'var(--text-secondary)' }}>
        Placeholder tiles — the full games will be implemented on the Learn page.
      </p> */}
    </FrostedCard>
  );
}
