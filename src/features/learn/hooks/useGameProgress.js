import { useState, useEffect, useCallback } from 'react';
import { useAuthStore } from '../../../stores/authStore';
import { gameService, gamificationService } from '../../../services/supabaseService';

// Game progress hook that syncs with Supabase backend
export function useGameProgress(gameKey) {
  const user = useAuthStore(state => state.user);
  const storageKey = `learn:progress:${gameKey}`;
  
  const [progress, setProgress] = useState(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      return raw ? JSON.parse(raw) : { completed: [], xp: 0 };
    } catch (e) {
      return { completed: [], xp: 0 };
    }
  });
  
  const [isLoading, setIsLoading] = useState(false);

  // Load progress from backend when user logs in
  useEffect(() => {
    if (!user?.id) return;

    const loadBackendProgress = async () => {
      setIsLoading(true);
      try {
        const result = await gameService.getProgress(user.id, gameKey);
        if (result?.data) {
          const backendProgress = {
            completed: result.data.completed_levels || [],
            xp: result.data.total_xp || 0,
            lastPlayed: result.data.last_played_at
          };
          setProgress(backendProgress);
          localStorage.setItem(storageKey, JSON.stringify(backendProgress));
        }
      } catch (error) {
        console.error('Failed to load game progress from backend:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadBackendProgress();
  }, [user?.id, gameKey, storageKey]);

  // Sync to localStorage on changes
  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(progress));
    } catch (e) {
      // ignore
    }
  }, [storageKey, progress]);

  const markComplete = useCallback(async (levelId, xpEarned = 0, score = 100, timeTaken = 0) => {
    setProgress(prev => {
      if (prev.completed.includes(levelId)) return prev;
      const next = { 
        ...prev, 
        completed: [...prev.completed, levelId], 
        xp: (prev.xp || 0) + xpEarned 
      };
      
      // Sync to backend if user is logged in
      if (user?.id) {
        gameService.completeLevel(user.id, gameKey, levelId, score, timeTaken)
          .catch(err => console.error('Failed to save level completion:', err));
        
        // Award coins for completing level
        if (xpEarned > 0) {
          const coinsEarned = Math.floor(xpEarned / 10); // 1 coin per 10 XP
          gamificationService.awardCoins(user.id, coinsEarned, `Completed ${gameKey} level ${levelId}`)
            .catch(err => console.error('Failed to award coins:', err));
        }
      }
      
      return next;
    });
  }, [user?.id, gameKey]);

  const resetProgress = useCallback(() => {
    setProgress({ completed: [], xp: 0 });
  }, []);

  return { progress, markComplete, resetProgress, isLoading };
}
