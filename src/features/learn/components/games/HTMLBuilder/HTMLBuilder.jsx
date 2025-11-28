import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Code, Play, RotateCcw, Lightbulb, Star, Trophy, Clock } from 'lucide-react';
import FrostedCard from '../../../../../components/ui/FrostedCard';
import PremiumCodeEditor from './PremiumCodeEditor';
import { LEVELS } from './levels';
import { validateHTML } from './htmlValidator';
import { useGameProgress } from '../../../hooks/useGameProgress';
import Confetti from 'react-confetti';

/**
 * HTML Structure Builder - Complete Game Component
 * 
 * DESCRIPTION:
 * Interactive game teaching HTML5 semantic structure through progressive challenges.
 * Users build webpage layouts matching wireframe specifications using proper semantic HTML.
 * 
 * MECHANICS:
 * - 10 progressive levels (basic tags → complex layouts)
 * - Real-time HTML validation with specific rules
 * - Live preview with syntax highlighting
 * - 3-star rating system based on semantic correctness, time, and attempts
 * - Hint system (3 hints per level, -10 points each)
 * - Auto-save progress to Supabase
 * 
 * POINTS SYSTEM:
 * - Base points: 100 per level
 * - Time bonus: +50 points if under par time
 * - Perfect semantics: +30 points (all required tags used correctly)
 * - First attempt: +20 points (no hints, passed first try)
 * - Star multiplier: 1★ = 1x, 2★ = 1.5x, 3★ = 2x
 * - Hint penalty: -10 points per hint used
 */

export default function HTMLBuilder() {
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

  // Custom hook for progress tracking
  const { saveProgress, getProgress, isLoading } = useGameProgress('html-builder');

  const level = LEVELS[currentLevel - 1];

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

  // Load saved progress on mount
  useEffect(() => {
    const loadProgress = async () => {
      const progress = await getProgress();
      if (progress && progress.currentLevel) {
        setCurrentLevel(progress.currentLevel);
      }
    };
    loadProgress();
  }, []);

  // Auto-save draft to localStorage (silent, non-intrusive)
  useEffect(() => {
    const draftKey = `html-builder-draft-level-${currentLevel}`;
    
    // Silently restore draft on level change (no confirmation dialog)
    const savedDraft = localStorage.getItem(draftKey);
    if (savedDraft && savedDraft !== level.starterCode && code === level.starterCode) {
      setCode(savedDraft);
    }
  }, [currentLevel]); // Only run when level changes

  // Separate effect for auto-saving (debounced)
  useEffect(() => {
    const draftKey = `html-builder-draft-level-${currentLevel}`;
    
    // Debounced auto-save - only save after user stops typing for 1 second
    const saveTimeout = setTimeout(() => {
      if (code && code !== level.starterCode && code.trim().length > 0) {
        localStorage.setItem(draftKey, code);
      }
    }, 1000);

    return () => clearTimeout(saveTimeout);
  }, [code, currentLevel, level.starterCode]);

  // Initialize level
  useEffect(() => {
    setCode(level.starterCode);
    setIsPlaying(false);
    setTimer(0);
    setAttempts(0);
    setHintsUsed(0);
    setCurrentHintIndex(-1);
    setValidationResult(null);
    setLevelScore(null);
  }, [currentLevel]);

  // Calculate score based on performance
  const calculateScore = useCallback((isValid, stars) => {
    let basePoints = 100;
    let bonus = 0;

    // Time bonus (completed within par time)
    if (timer <= level.parTime) {
      bonus += 50;
    }

    // Semantic perfection bonus
    if (validationResult?.semanticScore >= 95) {
      bonus += 30;
    }

    // First attempt bonus (attempts will be incremented before this runs)
    const currentAttempts = attempts + 1;
    if (currentAttempts === 1 && hintsUsed === 0) {
      bonus += 20;
    }

    // Hint penalty
    const hintPenalty = hintsUsed * 10;

    // Star multiplier
    const multiplier = stars === 3 ? 2 : stars === 2 ? 1.5 : 1;

    const totalScore = Math.max(0, (basePoints + bonus - hintPenalty) * multiplier);

    return {
      basePoints,
      bonus,
      hintPenalty,
      multiplier,
      totalScore: Math.round(totalScore),
      stars
    };
  }, [timer, level, attempts, hintsUsed, validationResult]);

  // Calculate stars based on criteria
  const calculateStars = useCallback((validationResult) => {
    let stars = 1; // Base star for completion

    // Check time performance (avoid division by zero)
    const timePerformance = timer > 0 ? Math.min(100, (level.parTime / timer) * 100) : 100;
    
    // Check semantic correctness
    const semanticScore = validationResult.semanticScore || 0;
    
    // Check attempts (will be incremented after validation)
    const currentAttempts = attempts + 1;
    const attemptScore = currentAttempts === 1 ? 100 : currentAttempts === 2 ? 70 : currentAttempts === 3 ? 50 : 30;

    // Calculate weighted performance
    const overallScore = (timePerformance * 0.3) + (semanticScore * 0.5) + (attemptScore * 0.2);

    if (overallScore >= 85) stars = 3;
    else if (overallScore >= 65) stars = 2;

    return stars;
  }, [timer, level, attempts]);

  // Handle code submission
  const handleSubmit = useCallback(async () => {
    setAttempts(prev => prev + 1);

    const result = validateHTML(code, level.validationRules);
    setValidationResult(result);

    if (result.isValid) {
      setIsPlaying(false);
      const stars = calculateStars(result);
      const score = calculateScore(true, stars);
      setLevelScore(score);
      setShowCelebration(true);
      setShowLevelComplete(true);

      // Clear draft from localStorage
      const draftKey = `html-builder-draft-level-${currentLevel}`;
      localStorage.removeItem(draftKey);

      // Save progress to database
      await saveProgress({
        levelNumber: currentLevel,
        status: 'completed',
        starsEarned: stars,
        completionTime: timer,
        codeSubmitted: code,
        attempts: attempts + 1,
        hintsUsed: hintsUsed,
        score: score.totalScore
      });

      // Auto-hide celebration after 3 seconds
      setTimeout(() => setShowCelebration(false), 3000);
    }
  }, [code, level, attempts, hintsUsed, timer, currentLevel, calculateStars, calculateScore, saveProgress]);

  // Handle hint request
  const handleHint = useCallback(() => {
    if (currentHintIndex < level.hints.length - 1) {
      setCurrentHintIndex(prev => prev + 1);
      setHintsUsed(prev => prev + 1);
    }
  }, [currentHintIndex, level.hints.length]);

  // Reset level
  const handleReset = useCallback(() => {
    setCode(level.starterCode);
    setTimer(0);
    setAttempts(0);
    setHintsUsed(0);
    setCurrentHintIndex(-1);
    setValidationResult(null);
    setIsPlaying(false);
  }, [level.starterCode]);

  // Start playing
  const handlePlay = useCallback(() => {
    setIsPlaying(true);
  }, []);

  // Next level
  const handleNextLevel = useCallback(() => {
    if (currentLevel < LEVELS.length) {
      setCurrentLevel(prev => prev + 1);
      setShowLevelComplete(false);
    }
  }, [currentLevel]);

  // Format timer display
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen p-2 md:p-4 lg:p-6 ml-0 lg:ml-64" style={{ backgroundColor: 'var(--bg-primary)' }}>
      {/* Confetti celebration */}
      {showCelebration && (
        <Confetti
          width={window.innerWidth}
          height={window.innerHeight}
          recycle={false}
          numberOfPieces={200}
        />
      )}

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto mb-3 md:mb-4"
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 md:gap-4">
          <div>
            <h3 className="text-base md:text-lg lg:text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
              <Code className="inline mr-2 mb-0.5" size={20} />
              HTML Structure Builder
            </h3>
            {/* <p className="text-xs md:text-sm" style={{ color: 'var(--text-secondary)' }}>
              Level {currentLevel} of {LEVELS.length}: {level.title}
            </p> */}
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
              <Trophy size={16} style={{ color: 'var(--game-easy)' }} />
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
        </div>

      </motion.div>

      {/* Main content */}
      <div className="mx-auto grid grid-cols-1 lg:grid-cols-3 gap-3 md:gap-4 lg:gap-6">
        {/* Left panel - Instructions and hints */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-2 md:space-y-3 lg:col-span-1"
        >
          {/* Instructions */}
          <FrostedCard className="p-1">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-2xl font-bold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                <Trophy size={20} />
                Challenge
              </h3>
              <span className="px-3 py-1 rounded-full text-sm font-bold" style={{ backgroundColor: 'var(--accent-primary)', color: 'white' }}>
                Level {currentLevel}
              </span>
            </div>
            <p className="mb-4 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              {level.description}
            </p>
            
            <div className="space-y-2">
              <h4 className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>Requirements:</h4>
              <ul className="space-y-1">
                {level.instructions.map((instruction, idx) => (
                  <li key={idx} className="text-sm flex items-start gap-2" style={{ color: 'var(--text-secondary)' }}>
                    <span className="text-green-500 mt-0.5">✓</span>
                    <span>{instruction}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Expected elements */}
            <div className="mt-4 p-3 rounded-lg" style={{ backgroundColor: 'var(--bg-secondary)' }}>
              <p className="text-xs font-semibold mb-2" style={{ color: 'var(--text-secondary)' }}>
                Required HTML Elements:
              </p>
              <div className="flex flex-wrap gap-2">
                {level.validationRules.requiredTags.map((tag, idx) => (
                  <code
                    key={idx}
                    className="px-2 py-1 rounded text-xs font-mono"
                    style={{ 
                      backgroundColor: validationResult?.isValid || !validationResult 
                        ? 'var(--accent-primary)' 
                        : validationResult.errors.some(e => e.includes(`<${tag}>`)) 
                          ? 'var(--game-advanced)' 
                          : 'var(--game-easy)',
                      color: 'white'
                    }}
                  >
                    &lt;{tag}&gt;
                  </code>
                ))}
              </div>
            </div>

            {/* Test cases / Validation rules */}
            <div className="mt-3 p-3 rounded-lg border" style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border-color)' }}>
              <p className="text-xs font-semibold mb-2" style={{ color: 'var(--text-secondary)' }}>
                ✓ Test Cases:
              </p>
              <ul className="space-y-1 text-xs" style={{ color: 'var(--text-secondary)' }}>
                <li className="flex items-start gap-2">
                  <span>•</span>
                  <span>Has valid HTML5 DOCTYPE</span>
                </li>
                {level.validationRules.semanticRules?.slice(0, 3).map((rule, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span>•</span>
                    <span>{rule.rule}</span>
                  </li>
                ))}
                {level.validationRules.requiredAttributes && (
                  <li className="flex items-start gap-2">
                    <span>•</span>
                    <span>All required attributes present</span>
                  </li>
                )}
              </ul>
            </div>
          </FrostedCard>

          {/* Hints */}
          <FrostedCard className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-bold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                <Lightbulb size={18} />
                Hints ({level.hints.length - hintsUsed} remaining)
              </h4>
              <button
                onClick={handleHint}
                disabled={currentHintIndex >= level.hints.length - 1}
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
          </FrostedCard>
        </motion.div>

        {/* Right panel - Editor and preview */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-4 lg:col-span-2"
        >
          {/* Premium Monaco Code Editor with Live Preview */}
          <PremiumCodeEditor
            code={code}
            onChange={setCode}
            onSubmit={handleSubmit}
            onReset={handleReset}
            validationResult={validationResult}
            language="html"
          />

          {/* Validation feedback */}
          <AnimatePresence>
            {validationResult && !validationResult.isValid && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
              >
                <FrostedCard className="p-6 border-2" style={{ borderColor: 'var(--game-advanced)' }}>
                  <h3 className="font-bold mb-3 flex items-center gap-2" style={{ color: 'var(--game-advanced)' }}>
                    ❌ Validation Failed
                  </h3>
                  <ul className="space-y-2">
                    {validationResult.errors.map((error, idx) => (
                      <li key={idx} className="text-sm flex items-start gap-2" style={{ color: 'var(--text-secondary)' }}>
                        <span className="text-red-500 mt-0.5">•</span>
                        <span>{error}</span>
                      </li>
                    ))}
                  </ul>
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
              onClick={(e) => e.stopPropagation()}
              className="max-w-md w-full p-8 rounded-2xl"
              style={{ backgroundColor: 'var(--bg-primary)' }}
            >
              <div className="text-center">
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.2, type: 'spring' }}
                  className="mb-6 inline-block p-4 rounded-full"
                  style={{
                    background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(59, 130, 246, 0.2))',
                    border: '2px solid var(--accent-primary)'
                  }}
                >
                  <Trophy size={64} className="mx-auto" style={{ color: 'var(--accent-primary)' }} />
                </motion.div>

                <h2 className="text-3xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
                  Level Complete! 🎉
                </h2>
                
                <p className="text-lg mb-6" style={{ color: 'var(--text-secondary)' }}>
                  {level.title}
                </p>

                {/* Stars */}
                <div className="flex justify-center gap-2 mb-6">
                  {[1, 2, 3].map((star) => (
                    <motion.div
                      key={star}
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ delay: 0.3 + (star * 0.1), type: 'spring' }}
                    >
                      <Star
                        size={40}
                        fill={star <= levelScore.stars ? 'var(--game-easy)' : 'transparent'}
                        style={{ color: star <= levelScore.stars ? 'var(--game-easy)' : 'var(--text-secondary)' }}
                      />
                    </motion.div>
                  ))}
                </div>

                {/* Score breakdown */}
                <div className="space-y-2 mb-6 p-4 rounded-xl" style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-primary)' }}>
                  <div className="flex justify-between text-sm">
                    <span style={{ color: 'var(--text-secondary)' }}>Base Points:</span>
                    <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>+{levelScore.basePoints}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span style={{ color: 'var(--text-secondary)' }}>Bonus:</span>
                    <span className="font-semibold" style={{ color: '#10b981' }}>+{levelScore.bonus}</span>
                  </div>
                  {levelScore.hintPenalty > 0 && (
                    <div className="flex justify-between text-sm">
                      <span style={{ color: 'var(--text-secondary)' }}>Hint Penalty:</span>
                      <span className="font-semibold" style={{ color: '#ef4444' }}>-{levelScore.hintPenalty}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm">
                    <span style={{ color: 'var(--text-secondary)' }}>Star Multiplier:</span>
                    <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>×{levelScore.multiplier}</span>
                  </div>
                  <div className="h-px my-2" style={{ backgroundColor: 'var(--border-primary)' }} />
                  <div className="flex justify-between text-lg font-bold" style={{ color: 'var(--accent-primary)' }}>
                    <span>Total Score:</span>
                    <span>{levelScore.totalScore} XP</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowLevelComplete(false)}
                    className="flex-1 px-4 py-3 rounded-xl font-semibold transition-all hover:scale-105 border-2"
                    style={{
                      backgroundColor: 'var(--bg-secondary)',
                      color: 'var(--text-primary)',
                      borderColor: 'var(--border-primary)'
                    }}
                  >
                    Review
                  </button>
                  {currentLevel < LEVELS.length && (
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
