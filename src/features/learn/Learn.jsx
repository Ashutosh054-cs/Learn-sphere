import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Code, Palette, Zap, Star, Clock, Trophy } from 'lucide-react';
import FrostedCard from '../../components/ui/FrostedCard';

/**
 * Learn Page - Game Catalog
 * Main page displaying all available learning games
 */

const games = [
  {
    id: 'html-builder',
    title: 'HTML Structure Builder',
    description: 'Master HTML5 semantic structure through progressive challenges. Build webpage layouts matching wireframe specifications.',
    icon: Code,
    difficulty: 'Easy',
    difficultyColor: '#10b981', // Light green
    levels: 10,
    estimatedTime: '45 min',
    xpReward: 370,
    progress: 0, // Will be loaded from database
    path: '/learn/html-builder'
  },
  {
    id: 'css-battle',
    title: 'CSS Selector Battle',
    description: 'Challenge arena where you write CSS selectors to target specific elements. Master specificity and combinators.',
    icon: Palette,
    difficulty: 'Medium',
    difficultyColor: '#fbbf24', // Yellow
    levels: 12,
    estimatedTime: '60 min',
    xpReward: 480,
    progress: 0,
    path: '/learn/css-battle',
    comingSoon: false
  },
  {
    id: 'js-maze',
    title: 'JS Puzzle Maze',
    description: 'Code-based pathfinding game teaching JavaScript fundamentals. Navigate through mazes using programming logic.',
    icon: Zap,
    difficulty: 'Advanced',
    difficultyColor: '#f97316', // Orange
    levels: 15,
    estimatedTime: '90 min',
    xpReward: 650,
    progress: 0,
    path: '/learn/js-maze',
    comingSoon: false
  }
];

export default function Learn() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState('all'); // all, easy, medium, advanced

  const filteredGames = games.filter(game => {
    if (filter === 'all') return true;
    return game.difficulty.toLowerCase() === filter;
  });

  return (
    <div className="ml-64 min-h-screen p-4 md:p-6 lg:p-8" style={{ backgroundColor: 'var(--bg-primary)' }}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto mb-8"
      >
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
          Interactive Learning Games 🎮
        </h1>
        <p className="text-lg md:text-xl" style={{ color: 'var(--text-secondary)' }}>
          Master tech skills through hands-on challenges and gamified learning
        </p>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="max-w-7xl mx-auto mb-8"
      >
        <div className="flex gap-3 flex-wrap">
          {['all', 'easy', 'medium', 'advanced'].map((level) => (
            <button
              key={level}
              onClick={() => setFilter(level)}
              className="px-4 py-2 rounded-lg font-semibold text-sm capitalize transition-all"
              style={{
                backgroundColor: filter === level ? 'var(--accent-primary)' : 'var(--bg-secondary)',
                color: filter === level ? 'white' : 'var(--text-primary)'
              }}
            >
              {level}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Game Cards */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredGames.map((game, index) => (
          <motion.div
            key={game.id}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <FrostedCard 
              className="h-full flex flex-col relative overflow-hidden"
              onClick={() => !game.comingSoon && navigate(game.path)}
              hover={!game.comingSoon}
              role="group"
            >
              {/* Coming Soon Badge */}
              {game.comingSoon && (
                <div className="absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold" style={{ backgroundColor: 'var(--accent-secondary)', color: 'white' }}>
                  Coming Soon
                </div>
              )}

              {/* Icon */}
              <div className="mb-4">
                <div 
                  className="w-16 h-16 rounded-2xl flex items-center justify-center"
                  style={{ backgroundColor: game.difficultyColor + '20' }}
                >
                  <game.icon size={32} style={{ color: game.difficultyColor }} />
                </div>
              </div>

              {/* Title */}
              <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
                {game.title}
              </h3>

              {/* Description */}
              <p className="text-sm mb-4 grow" style={{ color: 'var(--text-secondary)' }}>
                {game.description}
              </p>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="flex items-center gap-2">
                  <Trophy size={16} style={{ color: 'var(--accent-primary)' }} />
                  <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                    {game.levels} Levels
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock size={16} style={{ color: 'var(--accent-secondary)' }} />
                  <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                    {game.estimatedTime}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Star size={16} style={{ color: 'var(--game-easy)' }} />
                  <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                    {game.xpReward} XP
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div 
                    className="px-2 py-0.5 rounded text-xs font-bold"
                    style={{ 
                      backgroundColor: game.difficultyColor + '20',
                      color: game.difficultyColor
                    }}
                  >
                    {game.difficulty}
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-2 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--bg-secondary)' }}>
                <motion.div
                  className="h-full"
                  style={{ backgroundColor: game.difficultyColor }}
                  initial={{ width: 0 }}
                  animate={{ width: `${game.progress}%` }}
                  transition={{ duration: 0.8, delay: index * 0.1 + 0.3 }}
                />
              </div>

              {/* Play Button */}
              {!game.comingSoon && (
                <button
                  className="mt-4 w-full py-3 rounded-xl font-bold text-white transition-all cursor-pointer"
                  style={{ backgroundColor: game.difficultyColor }}
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(game.path);
                  }}
                >
                  {game.progress > 0 ? 'Continue' : 'Start Game'} →
                </button>
              )}
            </FrostedCard>
          </motion.div>
        ))}
      </div>

      {/* Stats Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="max-w-7xl mx-auto mt-12"
      >
        <FrostedCard className="p-6">
          <h3 className="text-xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
            Your Learning Progress
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold mb-1" style={{ color: 'var(--accent-primary)' }}>0</div>
              <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>Games Completed</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold mb-1" style={{ color: 'var(--game-easy)' }}>0</div>
              <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>Total Stars</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold mb-1" style={{ color: 'var(--accent-secondary)' }}>0</div>
              <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>XP Earned</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold mb-1" style={{ color: 'var(--text-primary)' }}>0h 0m</div>
              <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>Time Played</div>
            </div>
          </div>
        </FrostedCard>
      </motion.div>
    </div>
  );
}
