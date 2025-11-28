// Lightweight progress service that uses localStorage as a fallback
export const ProgressService = {
  saveProgress: async (gameKey, payload) => {
    try {
      const key = `learn:progress:${gameKey}`;
      localStorage.setItem(key, JSON.stringify(payload));
      return { success: true };
    } catch (e) {
      return { success: false, error: e.message };
    }
  },
  loadProgress: async (gameKey) => {
    try {
      const key = `learn:progress:${gameKey}`;
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : { completed: [], xp: 0 };
    } catch (e) {
      return { completed: [], xp: 0 };
    }
  }
};
