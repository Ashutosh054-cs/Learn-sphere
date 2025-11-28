import { useState, useEffect } from 'react';

// Simple progress hook that persists progress to localStorage (fallback when Supabase not present)
export function useGameProgress(gameKey) {
  const storageKey = `learn:progress:${gameKey}`;
  const [progress, setProgress] = useState(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      return raw ? JSON.parse(raw) : { completed: [], xp: 0 };
    } catch (e) {
      return { completed: [], xp: 0 };
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(progress));
    } catch (e) {
      // ignore
    }
  }, [storageKey, progress]);

  const markComplete = (levelId, xpEarned) => {
    setProgress(prev => {
      if (prev.completed.includes(levelId)) return prev;
      const next = { ...prev, completed: [...prev.completed, levelId], xp: (prev.xp || 0) + (xpEarned || 0) };
      return next;
    });
  };

  const resetProgress = () => {
    setProgress({ completed: [], xp: 0 });
  };

  return { progress, markComplete, resetProgress };
}
