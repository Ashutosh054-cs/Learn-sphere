import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Puzzle, Play, RotateCcw, Lightbulb, Star, Trophy, Clock, Target, Zap } from 'lucide-react';
import FrostedCard from '../../../../../components/ui/FrostedCard';
import PremiumCodeEditor from '../HTMLBuilder/PremiumCodeEditor';
import { levels as JS_MAZE_LEVELS } from './levels';
import MazeExecutionEngine from './executionEngine';
import Confetti from 'react-confetti';

/**
 * JavaScript Maze - Complete Game Component
 * Uses exact same layout and editor as HTML Builder
 */

export default function JSMaze() {
  // Game state
  const [currentLevel, setCurrentLevel] = useState(1);
  const [code, setCode] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [timer, setTimer] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [currentHintIndex, setCurrentHintIndex] = useState(-1);
  const [executionResult, setExecutionResult] = useState(null);
  const [showCelebration, setShowCelebration] = useState(false);
  const [levelScore, setLevelScore] = useState(null);
  const [showLevelComplete, setShowLevelComplete] = useState(false);
  const [characterPath, setCharacterPath] = useState([]);
  const [isAnimating, setIsAnimating] = useState(false);

  const level = JS_MAZE_LEVELS[currentLevel - 1];

  // Timer logic
  useEffect(() => {
    let interval;
    if (isPlaying) {
      interval = setInterval(() => {
        setTimer(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  // Auto-save draft
  useEffect(() => {
    const draftKey = `js-maze-draft-level-${currentLevel}`;
    const savedDraft = localStorage.getItem(draftKey);
    if (savedDraft && code === '') {
      setCode(savedDraft);
    }
  }, [currentLevel]);

  useEffect(() => {
    const draftKey = `js-maze-draft-level-${currentLevel}`;
    const saveTimeout = setTimeout(() => {
      if (code && code.trim().length > 0) {
        localStorage.setItem(draftKey, code);
      }
    }, 1000);
    return () => clearTimeout(saveTimeout);
  }, [code, currentLevel]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const calculateScore = () => {
    let basePoints = level.baseXP || 100;
    let bonuses = 0;
    let penalties = 0;

    if (timer <= level.parTime) bonuses += 50;
    if (executionResult?.efficiency >= 90) bonuses += 40;
    if (attempts === 0 && hintsUsed === 0) bonuses += 20;
    penalties = hintsUsed * 10;

    const totalScore = Math.max(0, basePoints + bonuses - penalties);
    const stars = totalScore >= basePoints * 0.9 ? 3 : totalScore >= basePoints * 0.7 ? 2 : 1;

    return { score: totalScore, stars, bonuses, penalties };
  };

  const handlePlay = () => {
    if (!isPlaying) {
      setIsPlaying(true);
      setTimer(0);
    }
  };

  const handleRunCode = async () => {
    setAttempts(prev => prev + 1);
    setIsAnimating(true);

    try {
      const result = await MazeExecutionEngine.execute(code, level);
      setExecutionResult(result);

      if (result.success && result.path) {
        setCharacterPath(result.path);
        
        // Simulate path animation
        setTimeout(() => {
          setIsAnimating(false);
          if (result.reachedGoal) {
            setIsPlaying(false);
            const scoreData = calculateScore();
            setLevelScore(scoreData);
            setShowLevelComplete(true);
            setShowCelebration(true);
            setTimeout(() => setShowCelebration(false), 5000);
          }
        }, result.path.length * 300);
      } else {
        setIsAnimating(false);
      }
    } catch (error) {
      setExecutionResult({
        success: false,
        error: error.message || 'Execution failed'
      });
      setIsAnimating(false);
    }
  };

  const handleSubmit = handleRunCode;

  const handleReset = () => {
    setCode('');
    setTimer(0);
    setIsPlaying(false);
    setAttempts(0);
    setHintsUsed(0);
    setCurrentHintIndex(-1);
    setExecutionResult(null);
    setCharacterPath([]);
    setIsAnimating(false);
    localStorage.removeItem(`js-maze-draft-level-${currentLevel}`);
  };

  const handleNextLevel = () => {
    if (currentLevel < JS_MAZE_LEVELS.length) {
      setCurrentLevel(prev => prev + 1);
      handleReset();
      setShowLevelComplete(false);
    }
  };

  const handleRetry = () => {
    handleReset();
    setShowLevelComplete(false);
  };

  const handleGetHint = () => {
    if (currentHintIndex < level.hints.length - 1) {
      setCurrentHintIndex(prev => prev + 1);
      setHintsUsed(prev => prev + 1);
    }
  };

  // Generate preview showing maze and execution output
  const generatePreviewHTML = () => {
    const mazeHTML = `
      <div style="padding: 20px; background: #f5f5f5; min-height: 100%; display: flex; flex-direction: column; gap: 20px;">
        <div style="background: white; border-radius: 8px; padding: 16px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
          <h3 style="margin: 0 0 12px 0; font-size: 14px; font-weight: bold; color: #333;">Maze Preview</h3>
          <div id="maze-container"></div>
        </div>
        
        ${executionResult ? `
          <div style="background: white; border-radius: 8px; padding: 16px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
            <h3 style="margin: 0 0 12px 0; font-size: 14px; font-weight: bold; color: ${executionResult.success ? '#22c55e' : '#ef4444'};">
              ${executionResult.success ? '✅ Execution Successful' : '❌ Execution Failed'}
            </h3>
            <div style="font-family: monospace; font-size: 12px; color: #666;">
              ${executionResult.success ? `
                <p>✓ Path length: ${executionResult.path?.length || 0} steps</p>
                <p>✓ Goal reached: ${executionResult.reachedGoal ? 'Yes' : 'No'}</p>
                <p>✓ Efficiency: ${executionResult.efficiency || 0}%</p>
              ` : `
                <p style="color: #ef4444;">${executionResult.error || 'Unknown error'}</p>
              `}
            </div>
          </div>
        ` : ''}
      </div>
    `;

    return `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { margin: 0; font-family: system-ui, sans-serif; }
            .maze-cell {
              width: 30px;
              height: 30px;
              border: 1px solid #ddd;
              display: inline-block;
              text-align: center;
              line-height: 30px;
            }
            .wall { background: #333; }
            .path { background: #fff; }
            .start { background: #22c55e; }
            .goal { background: #f59e0b; }
            .character { background: #3b82f6; }
          </style>
        </head>
        <body>
          ${mazeHTML}
          <script>
            const maze = ${JSON.stringify(level.maze)};
            const start = ${JSON.stringify(level.startPos)};
            const goal = ${JSON.stringify(level.endPos)};
            const path = ${JSON.stringify(characterPath)};
            
            const container = document.getElementById('maze-container');
            maze.forEach((row, y) => {
              const rowDiv = document.createElement('div');
              row.forEach((cell, x) => {
                const cellDiv = document.createElement('div');
                cellDiv.className = 'maze-cell';
                
                if (cell === 1) cellDiv.classList.add('wall');
                else cellDiv.classList.add('path');
                
                if (start.row === y && start.col === x) cellDiv.classList.add('start');
                if (goal.row === y && goal.col === x) cellDiv.classList.add('goal');
                
                const isOnPath = path.some(p => p.row === y && p.col === x);
                if (isOnPath) cellDiv.classList.add('character');
                
                rowDiv.appendChild(cellDiv);
              });
              container.appendChild(rowDiv);
            });
          </script>
        </body>
      </html>
    `;
  };

  return (
    <div className="min-h-screen p-1 md:p-2 lg:p-3 ml-0 lg:ml-64" style={{ backgroundColor: 'var(--bg-primary)' }}>
      {showCelebration && (
        <Confetti
          width={window.innerWidth}
          height={window.innerHeight}
          recycle={false}
          numberOfPieces={200}
        />
      )}

      {/* Header */}
      <div className="max-w-7xl mx-auto mb-1">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 md:gap-4"
        >
          <div>
            <h1 className="text-base md:text-lg lg:text-xl font-bold mb-1">
              <Puzzle className="inline mr-2 mb-0.5" size={20} style={{ color: 'var(--accent-primary)' }} />
              <span style={{ color: 'var(--text-primary)' }}>JavaScript Maze Runner</span>
            </h1>
          </div>

          <div className="flex gap-2 md:gap-3">
            <FrostedCard className="px-2 py-1 md:px-4 md:py-2 flex items-center gap-2">
              <Clock size={16} style={{ color: 'var(--accent-primary)' }} />
              <span className="font-mono text-sm" style={{ color: 'var(--text-primary)' }}>
                {formatTime(timer)}
              </span>
              <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                / {formatTime(level.parTime)}
              </span>
            </FrostedCard>

            <FrostedCard className="px-4 py-2 flex items-center gap-2">
              <Trophy size={16} style={{ color: 'var(--game-medium)' }} />
              <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                {attempts} attempts
              </span>
            </FrostedCard>
          </div>

          {/* Action buttons */}
          <div className="flex gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleReset}
              className="px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 shadow-md hover:shadow-lg"
              style={{
                backgroundColor: 'var(--bg-secondary)',
                color: 'var(--text-primary)',
                border: '1.5px solid var(--border-color)'
              }}
            >
              <RotateCcw size={13} />
              Reset
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handlePlay}
              disabled={isPlaying}
              className="px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                backgroundColor: 'var(--accent-secondary)',
                color: 'white'
              }}
            >
              <Play size={13} />
              {isPlaying ? 'Running...' : 'Start Timer'}
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleRunCode}
              disabled={isAnimating}
              className="px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                backgroundColor: 'var(--accent-primary)',
                color: 'white'
              }}
            >
              <Zap size={13} />
              {isAnimating ? 'Running...' : 'Run Code'}
            </motion.button>
          </div>
        </motion.div>
      </div>

      {/* Main grid - exact HTML Builder layout */}
      <div className="mx-auto grid grid-cols-1 lg:grid-cols-5 gap-3 md:gap-4 lg:gap-6">
        {/* Left panel - Instructions & Hints */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-2 md:space-y-3 lg:col-span-2"
        >
          {/* Challenge card */}
          <FrostedCard className="p-1">
            <div className="p-2">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  <Target size={20} style={{ color: 'var(--accent-primary)' }} />
                  <span style={{ color: 'var(--text-primary)' }}>Challenge</span>
                </h2>
                <span className="px-3 py-1 rounded-full text-sm font-bold" style={{ backgroundColor: 'var(--accent-primary)', color: 'white' }}>
                  Level {currentLevel}
                </span>
              </div>
            <p className="mb-4 text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              {level.description}
            </p>
            
            <div className="space-y-2 mb-4">
              <p className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>
                Required Concepts:
              </p>
              <div className="space-y-1">
                {level.requiredConcepts?.map((method, idx) => (
                  <div
                    key={idx}
                    className="px-2 py-1 rounded text-xs font-mono"
                    style={{
                      backgroundColor: 'var(--bg-secondary)',
                      color: 'var(--text-primary)'
                    }}
                  >
                    {method}
                  </div>
                ))}
              </div>
            </div>

            <div className="p-3 rounded-lg mb-4" style={{ backgroundColor: 'var(--bg-secondary)' }}>
              <p className="text-xs font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>
                Instructions:
              </p>
              <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                {level.instructions}
              </p>
            </div>

            {/* JavaScript Knowledge Section - Dynamic per level */}
            {level.jsReference && (
            <div className="p-3 rounded-lg" style={{ backgroundColor: 'var(--bg-secondary)' }}>
              <p className="text-xs font-semibold mb-3" style={{ color: 'var(--accent-primary)' }}>
                📚 {level.jsReference.title}
              </p>
              <div className="space-y-2 text-xs" style={{ color: 'var(--text-secondary)' }}>
                {level.jsReference.sections.map((section, idx) => (
                  <div key={idx} className={idx > 0 ? "pt-2" : ""} style={idx > 0 ? { borderTop: '1px solid var(--bg-primary)' } : {}}>
                    <p className="font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>{section.subtitle}</p>
                    <div className="space-y-1 ml-2">
                      {section.items.map((item, itemIdx) => (
                        <div key={itemIdx}>
                          <code className="px-2 py-0.5 rounded font-mono" style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--accent-primary)' }}>
                            {item.code}
                          </code>
                          <span className="ml-2">{item.description}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
                
                {level.jsReference.example && (
                  <div className="pt-2 mt-2" style={{ borderTop: '1px solid var(--bg-primary)' }}>
                    <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>💡 Example:</span>
                    <div className="mt-1 p-2 rounded font-mono text-xs whitespace-pre-wrap" style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--accent-primary)' }}>
                      {level.jsReference.example}
                    </div>
                  </div>
                )}
              </div>
            </div>
            )}
            </div>
          </FrostedCard>

          {/* Hints */}
          <FrostedCard className="p-1">
            <div className="p-2">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-2xl font-bold flex items-center gap-2">
                  <Lightbulb size={18} style={{ color: '#fbbf24' }} />
                  <span style={{ color: 'var(--text-primary)' }}>Hints ({hintsUsed}/3)</span>
                </h3>
                <button
                  onClick={handleGetHint}
                  disabled={currentHintIndex >= level.hints.length - 1 || currentHintIndex >= 2}
                  className="px-3 py-1 rounded-lg text-sm font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    backgroundColor: 'var(--accent-primary)',
                    color: 'white'
                  }}
                >
                  Get Hint (-10 pts)
                </button>
              </div>

            <AnimatePresence mode="wait">
              {currentHintIndex >= 0 && (
                <motion.div
                  key={currentHintIndex}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-2"
                >
                  {level.hints.slice(0, currentHintIndex + 1).map((hint, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-lg border-l-4"
                      style={{
                        backgroundColor: 'var(--bg-secondary)',
                        borderColor: 'var(--accent-primary)'
                      }}
                    >
                      <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                        💡 {hint}
                      </p>
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            {currentHintIndex < 0 && (
              <p className="text-sm italic" style={{ color: 'var(--text-secondary)' }}>
                Click "Get Hint" if you need help. Each hint costs 10 points.
              </p>
            )}
            </div>
          </FrostedCard>
        </motion.div>

        {/* Right panel - Premium Editor (exact HTML Builder style) */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-4 lg:col-span-3"
        >
          <PremiumCodeEditor
            code={code}
            onChange={setCode}
            onSubmit={handleSubmit}
            onReset={handleReset}
            validationResult={executionResult}
            language="javascript"
            previewContent={generatePreviewHTML()}
          />

          {/* Execution feedback */}
          <AnimatePresence>
            {executionResult && !executionResult.success && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
              >
                <FrostedCard className="p-6 border-2" style={{ borderColor: '#ef4444' }}>
                  <h3 className="font-bold mb-3 flex items-center gap-2" style={{ color: '#ef4444' }}>
                    ❌ Execution Failed
                  </h3>
                  <p className="text-sm font-mono" style={{ color: 'var(--text-secondary)' }}>
                    {executionResult.error || 'Code execution failed'}
                  </p>
                </FrostedCard>
              </motion.div>
            )}

            {executionResult?.success && !executionResult?.reachedGoal && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <FrostedCard className="p-6 border-2" style={{ borderColor: '#f59e0b' }}>
                  <h3 className="font-bold mb-3 flex items-center gap-2" style={{ color: '#f59e0b' }}>
                    ⚠️ Goal Not Reached
                  </h3>
                  <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                    Your code ran successfully but didn't reach the goal. Try adjusting your path!
                  </p>
                </FrostedCard>
              </motion.div>
            )}

            {executionResult?.reachedGoal && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <FrostedCard className="p-6 border-2" style={{ borderColor: '#22c55e' }}>
                  <h3 className="font-bold mb-3 flex items-center gap-2" style={{ color: '#22c55e' }}>
                    ✅ Goal Reached!
                  </h3>
                  <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                    Path: {executionResult.path?.length} steps • Efficiency: {executionResult.efficiency}%
                  </p>
                </FrostedCard>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Level complete modal */}
      <AnimatePresence>
        {showLevelComplete && levelScore && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
            onClick={() => setShowLevelComplete(false)}
          >
            <motion.div
              initial={{ scale: 0.8, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 50 }}
              onClick={e => e.stopPropagation()}
              className="max-w-md w-full p-8 rounded-2xl border-2 shadow-2xl"
              style={{ 
                backgroundColor: 'var(--bg-primary)',
                borderColor: 'var(--accent-primary)',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
              }}
            >
              <div className="text-center">
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.2, type: 'spring' }}
                  className="mb-6 inline-block p-4 rounded-full"
                  style={{
                    background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(147, 51, 234, 0.2))',
                    border: '2px solid var(--accent-primary)'
                  }}
                >
                  <Trophy size={64} style={{ color: 'var(--accent-primary)' }} />
                </motion.div>

                <h2 className="text-3xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
                  Level Complete! 🎉
                </h2>
                <div className="flex justify-center gap-2 mb-4">
                    {[...Array(3)].map((_, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ delay: 0.3 + (idx * 0.1), type: 'spring' }}
                      >
                        <Star
                          size={40}
                          fill={idx < levelScore.stars ? 'var(--accent-primary)' : 'transparent'}
                          style={{ color: idx < levelScore.stars ? 'var(--accent-primary)' : 'var(--text-secondary)' }}
                        />
                      </motion.div>
                    ))}
                  </div>
                  <p className="text-5xl font-bold mb-6" style={{ color: 'var(--accent-primary)' }}>
                    {levelScore.score} pts
                  </p>

                <div className="space-y-2 mb-6 p-4 rounded-xl" style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-primary)' }}>
                  <div className="flex justify-between text-sm">
                    <span style={{ color: 'var(--text-secondary)' }}>Time:</span>
                    <span style={{ color: 'var(--text-primary)' }}>{formatTime(timer)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span style={{ color: 'var(--text-secondary)' }}>Bonuses:</span>
                    <span className="font-semibold" style={{ color: '#10b981' }}>+{levelScore.bonuses}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span style={{ color: 'var(--text-secondary)' }}>Penalties:</span>
                    <span className="font-semibold" style={{ color: '#ef4444' }}>-{levelScore.penalties}</span>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={handleRetry}
                    className="flex-1 px-4 py-3 rounded-xl font-semibold transition-all hover:scale-105 border-2"
                    style={{
                      backgroundColor: 'var(--bg-secondary)',
                      color: 'var(--text-primary)',
                      borderColor: 'var(--border-primary)'
                    }}
                  >
                    Retry
                  </button>
                  {currentLevel < JS_MAZE_LEVELS.length && (
                    <button
                      onClick={handleNextLevel}
                      className="flex-1 px-4 py-3 rounded-xl font-semibold transition-all hover:scale-105 shadow-lg"
                      style={{
                        background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))',
                        color: 'white',
                        border: 'none'
                      }}
                    >
                      Next Level →
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
