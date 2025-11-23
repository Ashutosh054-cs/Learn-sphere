import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import FrostedCard from '../../../components/ui/FrostedCard';
import { Code, Calculator, Zap } from 'lucide-react';

// Selected three placeholder games from the user's list
const games = [
  { name: 'HTML Structure Builder', icon: Code, color: 'var(--accent-primary)', difficulty: 'Easy', progress: 65 },
  { name: 'CSS Selector Battle', icon: Calculator, color: 'var(--accent-secondary)', difficulty: 'Medium', progress: 42 },
  { name: 'JS Puzzle Maze', icon: Zap, color: 'var(--accent-primary)', difficulty: 'Advanced', progress: 18 },
];

export default function QuickLaunchCard({ className = '' }) {
  const navigate = useNavigate();

  return (
    <FrostedCard className={className}>
      <h3 className="text-sm md:text-base lg:text-lg font-bold mb-2 md:mb-3" style={{ color: 'var(--text-primary)' }}>
        Jump Back In
      </h3>

      <div className="flex gap-2 md:gap-3 justify-between">
        {games.map((game) => (
          <motion.div
            key={game.name}
            className="flex-1 flex flex-col items-center gap-1 md:gap-2 p-2 md:p-3 rounded-xl md:rounded-2xl cursor-pointer border border-transparent relative overflow-hidden"
            style={{ backgroundColor: 'var(--bg-secondary)' }}
            whileHover={{ scale: 1.05, rotateY: 5, borderColor: 'var(--accent-primary)' }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.2 }}
            onClick={() => navigate('/learn')}
          >
            {/* Difficulty Badge */}
            <div 
              className="absolute top-0.5 right-0.5 md:top-1 md:right-1 px-1 md:px-1.5 py-0.5 rounded text-[0.55rem] md:text-xs font-semibold"
              style={{ 
                backgroundColor: game.difficulty === 'Easy' ? 'hsl(142 70% 45% / 0.12)' : 
                               game.difficulty === 'Medium' ? 'hsl(40 90% 50% / 0.12)' : 
                               'hsl(0 84% 60% / 0.12)',
                color: game.difficulty === 'Easy' ? 'hsl(142 70% 35%)' : 
                       game.difficulty === 'Medium' ? 'hsl(40 90% 40%)' : 
                       'hsl(0 84% 50%)',
                fontSize: '0.65rem'
              }}
            >
              {game.difficulty[0]}
            </div>

            <game.icon className="w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6" strokeWidth={1.5} style={{ color: game.color }} />
            <span className="text-[0.6rem] md:text-xs font-medium text-center leading-tight" style={{ color: 'var(--text-secondary)' }}>
              {game.name}
            </span>
            
            {/* Mini progress bar */}
            <div className="w-full h-0.5 md:h-1 rounded-full overflow-hidden mt-0.5 md:mt-1" style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}>
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
