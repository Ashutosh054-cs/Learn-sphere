import { useState, useRef, useEffect } from 'react';

// Generic game engine hook used by the learn games
export function useGameEngine({ initialLevel, levels, onComplete }) {
  const [currentLevelId, setCurrentLevelId] = useState(initialLevel || (levels && levels[0] && levels[0].id));
  const [status, setStatus] = useState('idle'); // idle, running, success, failed
  const [steps, setSteps] = useState([]);
  const [timeMs, setTimeMs] = useState(0);
  const timerRef = useRef(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const startTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    const start = Date.now();
    timerRef.current = setInterval(() => {
      setTimeMs(Date.now() - start);
    }, 250);
  };

  const stopTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = null;
  };

  const start = () => {
    setStatus('running');
    setSteps([]);
    setTimeMs(0);
    startTimer();
  };

  const recordStep = (action) => {
    setSteps(prev => [...prev, { action, ts: Date.now() }]);
  };

  const complete = (result) => {
    stopTimer();
    setStatus(result.success ? 'success' : 'failed');
    if (onComplete) onComplete(result);
  };

  const resetLevel = () => {
    setSteps([]);
    setStatus('idle');
    setTimeMs(0);
  };

  const nextLevel = () => {
    const idx = levels.findIndex(l => l.id === currentLevelId);
    if (idx >= 0 && idx < levels.length - 1) {
      setCurrentLevelId(levels[idx + 1].id);
      resetLevel();
    }
  };

  const prevLevel = () => {
    const idx = levels.findIndex(l => l.id === currentLevelId);
    if (idx > 0) {
      setCurrentLevelId(levels[idx - 1].id);
      resetLevel();
    }
  };

  return {
    currentLevelId,
    status,
    steps,
    timeMs,
    start,
    resetLevel,
    complete,
    recordStep,
    nextLevel,
    prevLevel,
    setCurrentLevelId
  };
}
