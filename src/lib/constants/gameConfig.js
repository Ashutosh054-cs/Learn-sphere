/**
 * Game Configuration Constants
 * Central configuration for all learning games
 */

export const GAMES = {
  HTML_BUILDER: {
    id: 'html-builder',
    name: 'HTML Structure Builder',
    description: 'Master HTML5 semantic structure through progressive challenges',
    difficulty: 'Easy',
    difficultyColor: 'var(--game-easy)',
    totalLevels: 10,
    estimatedTime: '45 min',
    baseXP: 370,
    language: 'html'
  },
  CSS_BATTLE: {
    id: 'css-battle',
    name: 'CSS Selector Battle',
    description: 'Master CSS selectors by targeting elements with precision',
    difficulty: 'Medium',
    difficultyColor: 'var(--game-medium)',
    totalLevels: 12,
    estimatedTime: '60 min',
    baseXP: 480,
    language: 'css'
  },
  JS_MAZE: {
    id: 'js-maze',
    name: 'JavaScript Puzzle Maze',
    description: 'Navigate mazes using JavaScript logic and algorithms',
    difficulty: 'Advanced',
    difficultyColor: 'var(--game-advanced)',
    totalLevels: 15,
    estimatedTime: '90 min',
    baseXP: 650,
    language: 'javascript'
  }
};

/**
 * Scoring multipliers and bonuses
 */
export const SCORING = {
  // Star thresholds (percentage of max possible score)
  STARS: {
    THREE_STAR: 0.9,  // 90%+ = 3 stars
    TWO_STAR: 0.7,    // 70-89% = 2 stars
    ONE_STAR: 0.5     // 50-69% = 1 star
  },

  // Bonus multipliers
  BONUSES: {
    TIME_BONUS: 50,           // Bonus points if under par time
    PERFECT_SCORE: 30,        // All requirements met perfectly
    FIRST_TRY: 20,            // Passed on first attempt
    NO_HINTS: 15,             // No hints used
    EFFICIENCY_BONUS: 40      // Optimal solution (CSS specificity, JS moves)
  },

  // Penalties
  PENALTIES: {
    HINT_PENALTY: 10,         // -10 per hint
    RETRY_PENALTY: 5,         // -5 per retry (after 3 attempts)
    TIME_PENALTY_RATIO: 0.1   // -10% per minute over par time
  },

  // Star multipliers
  STAR_MULTIPLIERS: {
    ONE_STAR: 1,
    TWO_STAR: 1.5,
    THREE_STAR: 2
  }
};

/**
 * Streak and achievement constants
 */
export const STREAKS = {
  DAILY_STREAK_BONUS: 10,    // +10 XP per day streak
  MAX_STREAK_BONUS: 100,     // Max 100 XP from streaks
  COMBO_MULTIPLIER: 1.2      // 1.2x for consecutive perfect levels
};

/**
 * Leaderboard configuration
 */
export const LEADERBOARD = {
  ENTRIES_PER_PAGE: 20,
  TIME_FILTERS: ['week', 'month', 'all-time'],
  RANK_COLORS: {
    1: '#FFD700',  // Gold
    2: '#C0C0C0',  // Silver
    3: '#CD7F32'   // Bronze
  }
};

/**
 * Game type identifiers
 */
export const GAME_TYPES = {
  HTML_BUILDER: 'html-builder',
  CSS_BATTLE: 'css-battle',
  JS_MAZE: 'js-maze'
};

/**
 * Progress tracking keys
 */
export const STORAGE_KEYS = {
  PROGRESS: 'game-progress',
  STREAK: 'daily-streak',
  ACHIEVEMENTS: 'achievements',
  LEADERBOARD: 'leaderboard-cache',
  DRAFT_PREFIX: 'draft-'
};
