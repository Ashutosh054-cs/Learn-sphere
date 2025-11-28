import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Palette, Play, RotateCcw, Lightbulb, Star, Trophy, Clock, Target } from 'lucide-react';
import FrostedCard from '../../../../../components/ui/FrostedCard';
import PremiumCodeEditor from '../HTMLBuilder/PremiumCodeEditor';
import { CSS_BATTLE_LEVELS } from './levels';
import { SelectorEngine } from './selectorEngine';
import Confetti from 'react-confetti';

/**
 * CSS Selector Battle - Complete Game Component
 * Uses exact same layout and editor as HTML Builder
 */

export default function CSSBattle() {
  // Game state
  const [currentLevel, setCurrentLevel] = useState(1);
  const [code, setCode] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [timer, setTimer] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [currentHintIndex, setCurrentHintIndex] = useState(-1);
  const [validationResult, setValidationResult] = useState(null);
  const [showCelebration, setShowCelebration] = useState(false);
  const [levelScore, setLevelScore] = useState(null);
  const [showLevelComplete, setShowLevelComplete] = useState(false);
  const [matchedElements, setMatchedElements] = useState([]);

  const level = CSS_BATTLE_LEVELS[currentLevel - 1];

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
    const draftKey = `css-battle-draft-level-${currentLevel}`;
    const savedDraft = localStorage.getItem(draftKey);
    if (savedDraft && code === '') {
      setCode(savedDraft);
    }
  }, [currentLevel]);

  useEffect(() => {
    const draftKey = `css-battle-draft-level-${currentLevel}`;
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
    let basePoints = level.xpReward || level.baseXP || 100;
    let bonuses = 0;
    let penalties = 0;

    if (timer <= level.parTime) bonuses += 50;
    if (validationResult?.efficiency >= 90) bonuses += 40;
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

  const handleSubmit = () => {
    setAttempts(prev => prev + 1);

    // Validate on submit
    const result = SelectorEngine.validateSelector(
      code,
      level.correctSelectors,
      level.htmlStructure
    );
    setValidationResult(result);
    setMatchedElements(result.matchedElements || []);

    if (result?.isValid) {
      setIsPlaying(false);
      const scoreData = calculateScore();
      setLevelScore(scoreData);
      setShowLevelComplete(true);
      setShowCelebration(true);
      setTimeout(() => setShowCelebration(false), 5000);
    }
  };

  const handleReset = () => {
    setCode('');
    setTimer(0);
    setIsPlaying(false);
    setAttempts(0);
    setHintsUsed(0);
    setCurrentHintIndex(-1);
    setValidationResult(null);
    localStorage.removeItem(`css-battle-draft-level-${currentLevel}`);
  };

  const handleNextLevel = () => {
    if (currentLevel < CSS_BATTLE_LEVELS.length) {
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

  // Generate live preview HTML showing matched elements
  const generatePreviewHTML = () => {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { 
              padding: 20px; 
              font-family: system-ui, sans-serif;
              background: #f5f5f5;
            }
            .highlight { 
              outline: 3px solid #22c55e !important;
              outline-offset: 2px;
              background-color: rgba(34, 197, 94, 0.1) !important;
              animation: pulse 2s infinite;
            }
            @keyframes pulse {
              0%, 100% { opacity: 1; }
              50% { opacity: 0.7; }
            }
            * { margin: 4px; padding: 8px; border: 1px solid #ddd; }
          </style>
        </head>
        <body>
          ${level.htmlStructure}
          <script>
            const selector = ${JSON.stringify(code)};
            if (selector) {
              try {
                const elements = document.querySelectorAll(selector);
                elements.forEach(el => el.classList.add('highlight'));
              } catch(e) {
                console.error('Invalid selector');
              }
            }
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
              <Palette className="inline mr-2 mb-0.5" size={20} style={{ color: 'var(--accent-primary)' }} />
              <span style={{ color: 'var(--text-primary)' }}>CSS Selector Battle</span>
            </h1>
          </div>

          {/* Stats */}
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
              onClick={handleSubmit}
              className="px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 shadow-md hover:shadow-lg"
              style={{
                backgroundColor: 'var(--accent-primary)',
                color: 'white'
              }}
            >
              <Trophy size={13} />
              Submit
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
                <h3 className="text-2xl font-bold flex items-center gap-2">
                  <Target size={20} style={{ color: 'var(--accent-primary)' }} />
                  <span style={{ color: 'var(--text-primary)' }}>Challenge</span>
                </h3>
                <span className="px-3 py-1 rounded-full text-sm font-bold" style={{ backgroundColor: 'var(--accent-primary)', color: 'white' }}>
                  Level {currentLevel}
                </span>
              </div>
            <p className="mb-4 text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              {level.description}
            </p>
            
            <div className="space-y-2 mb-4">
              <p className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>
                Target Elements:
              </p>
              <div className="flex flex-wrap gap-2">
                {level.targetElements?.map((el, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-1 rounded text-xs font-mono"
                    style={{
                      backgroundColor: 'var(--accent-light)',
                      color: 'var(--accent-primary)'
                    }}
                  >
                    {el}
                  </span>
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

            {/* CSS Selector Knowledge Section - Dynamic based on level */}
            {level.selectorReference && (
              <div className="p-3 rounded-lg" style={{ backgroundColor: 'var(--bg-secondary)' }}>
                <p className="text-xs font-semibold mb-3" style={{ color: 'var(--accent-primary)' }}>
                  📚 {level.selectorReference.title || 'Key Concepts'}
                </p>
                <div className="space-y-2 text-xs" style={{ color: 'var(--text-secondary)' }}>
                  {level.selectorReference.items.map((item, idx) => (
                    <div key={idx}>
                      <code className="px-2 py-0.5 rounded font-mono" style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--accent-primary)' }}>
                        {item.code}
                      </code>
                      <span className="ml-2">{item.description}</span>
                    </div>
                  ))}
                  {level.selectorReference.tip && (
                    <div className="pt-2 mt-2" style={{ borderTop: '1px solid var(--bg-primary)' }}>
                      <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>💡 Tip:</span>
                      <span className="ml-1">{level.selectorReference.tip}</span>
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
            validationResult={validationResult}
            language="css"
            previewContent={generatePreviewHTML()}
          />

          {/* Validation feedback */}
          <AnimatePresence>
            {validationResult && !validationResult.isValid && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
              >
                <FrostedCard className="p-6 border-2" style={{ borderColor: '#ef4444' }}>
                  <h3 className="font-bold mb-3 flex items-center gap-2" style={{ color: '#ef4444' }}>
                    ❌ Validation Failed
                  </h3>
                  <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                    {validationResult.message || 'Selector does not match the target elements correctly.'}
                  </p>
                  {validationResult.efficiency !== undefined && (
                    <p className="text-xs mt-2" style={{ color: 'var(--text-secondary)' }}>
                      Efficiency: {validationResult.efficiency}%
                    </p>
                  )}
                </FrostedCard>
              </motion.div>
            )}

            {validationResult?.isValid && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <FrostedCard className="p-6 border-2" style={{ borderColor: '#22c55e' }}>
                  <h3 className="font-bold mb-3 flex items-center gap-2" style={{ color: '#22c55e' }}>
                    ✅ Perfect Match!
                  </h3>
                  <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                    Matched {matchedElements.length} elements • Efficiency: {validationResult.efficiency}%
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
                    background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.2), rgba(236, 72, 153, 0.2))',
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
                  {currentLevel < CSS_BATTLE_LEVELS.length && (
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
