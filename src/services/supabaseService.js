import { supabase } from '../lib/supabase'

// ============================================
// USER PROFILE OPERATIONS
// ============================================
export const userService = {
  // Get user profile with stats
  getProfile: async (userId) => {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle()
      
      if (error) throw error
      return { data, error: null }
    } catch (error) {
      return { data: null, error }
    }
  },

  // Update user profile
  updateProfile: async (userId, updates) => {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', userId)
        .select()
        .single()
      
      if (error) throw error
      return { data, error: null }
    } catch (error) {
      return { data: null, error }
    }
  },

  // Get user stats
  getStats: async (userId) => {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('total_focus_minutes, total_sessions, current_streak, longest_streak')
        .eq('id', userId)
        .maybeSingle()
      
      if (error) throw error
      return { data, error: null }
    } catch (error) {
      return { data: null, error }
    }
  }
}

// ============================================
// FOCUS SESSION OPERATIONS
// ============================================
export const focusService = {
  // Create focus session
  createSession: async (sessionData) => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      const { data, error } = await supabase
        .from('focus_sessions')
        .insert([{
          user_id: user.id,
          ...sessionData
        }])
        .select()
        .single()
      
      if (error) throw error
      return { data, error: null }
    } catch (error) {
      return { data: null, error }
    }
  },

  // Get user's focus sessions
  getUserSessions: async (userId, limit = 10) => {
    try {
      const { data, error } = await supabase
        .from('focus_sessions')
        .select('*')
        .eq('user_id', userId)
        .order('completed_at', { ascending: false })
        .limit(limit)
      
      if (error) throw error
      return { data, error: null }
    } catch (error) {
      return { data: null, error }
    }
  },

  // Get today's focus time
  getTodayFocusTime: async (userId) => {
    try {
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      
      const { data, error } = await supabase
        .from('focus_sessions')
        .select('duration_minutes')
        .eq('user_id', userId)
        .eq('completed', true)
        .eq('session_type', 'focus')
        .gte('completed_at', today.toISOString())
      
      if (error) throw error
      
      const totalMinutes = data.reduce((sum, session) => sum + session.duration_minutes, 0)
      return { data: totalMinutes, error: null }
    } catch (error) {
      return { data: 0, error }
    }
  },

  // Get focus time for current 12-hour period (morning: 12AM-12PM, evening: 12PM-12AM)
  getTwelveHourFocusTime: async (userId) => {
    try {
      const now = new Date()
      const currentHour = now.getHours()
      
      // Determine if we're in morning (0-11) or evening (12-23) period
      const isMorning = currentHour < 12
      
      // Set period start time
      const periodStart = new Date(now)
      if (isMorning) {
        periodStart.setHours(0, 0, 0, 0)
      } else {
        periodStart.setHours(12, 0, 0, 0)
      }
      
      const { data, error } = await supabase
        .from('focus_sessions')
        .select('duration_minutes')
        .eq('user_id', userId)
        .eq('completed', true)
        .eq('session_type', 'focus')
        .gte('completed_at', periodStart.toISOString())
      
      if (error) throw error
      
      const totalMinutes = data.reduce((sum, session) => sum + session.duration_minutes, 0)
      return { data: totalMinutes, error: null, period: isMorning ? 'morning' : 'evening' }
    } catch (error) {
      return { data: 0, error, period: 'morning' }
    }
  },

  // Get weekly focus sessions
  getWeeklySessions: async (userId) => {
    try {
      const weekAgo = new Date()
      weekAgo.setDate(weekAgo.getDate() - 7)
      
      const { data, error } = await supabase
        .from('focus_sessions')
        .select('*')
        .eq('user_id', userId)
        .eq('completed', true)
        .eq('session_type', 'focus')
        .gte('completed_at', weekAgo.toISOString())
        .order('completed_at', { ascending: true })
      
      if (error) throw error
      return { data, error: null }
    } catch (error) {
      return { data: [], error }
    }
  }
}

// ============================================
// STREAK OPERATIONS
// ============================================
export const streakService = {
  // Calculate current streak
  calculateStreak: async (userId) => {
    try {
      const { data, error } = await supabase
        .rpc('calculate_user_streak', { user_uuid: userId })
      
      if (error) throw error
      
      // Update user profile with new streak
      await supabase
        .from('user_profiles')
        .update({ current_streak: data })
        .eq('id', userId)
      
      return { data, error: null }
    } catch (error) {
      return { data: 0, error }
    }
  },

  // Get daily activity for last N days
  getDailyActivity: async (userId, days = 7) => {
    try {
      const startDate = new Date()
      startDate.setDate(startDate.getDate() - days)
      
      const { data, error} = await supabase
        .from('daily_activity')
        .select('*')
        .eq('user_id', userId)
        .gte('activity_date', startDate.toISOString().split('T')[0])
        .order('activity_date', { ascending: true })
      
      if (error) throw error
      return { data, error: null }
    } catch (error) {
      return { data: [], error }
    }
  }
}

// ============================================
// LEADERBOARD OPERATIONS
// ============================================
export const leaderboardService = {
  // Get weekly leaderboard
  getWeeklyLeaderboard: async (limit = 10) => {
    try {
      const { data, error } = await supabase
        .from('weekly_leaderboard')
        .select('*')
        .limit(limit)
      
      if (error) throw error
      return { data, error: null }
    } catch (error) {
      return { data: [], error }
    }
  },

  // Get user's rank
  getUserRank: async (userId) => {
    try {
      const { data, error } = await supabase
        .from('weekly_leaderboard')
        .select('rank')
        .eq('id', userId)
        .maybeSingle()
      
      if (error) throw error
      return { data: data?.rank || null, error: null }
    } catch (error) {
      return { data: null, error }
    }
  }
}

// ============================================
// ACHIEVEMENT OPERATIONS
// ============================================
export const achievementService = {
  // Get user achievements
  getUserAchievements: async (userId) => {
    try {
      const { data, error } = await supabase
        .from('achievements')
        .select('*')
        .eq('user_id', userId)
        .order('earned_at', { ascending: false })
      
      if (error) throw error
      return { data, error: null }
    } catch (error) {
      return { data: [], error }
    }
  },

  // Award achievement
  awardAchievement: async (userId, achievementType) => {
    try {
      // Get achievement definition
      const { data: definition } = await supabase
        .from('achievement_definitions')
        .select('*')
        .eq('achievement_type', achievementType)
        .maybeSingle()
      
      if (!definition) return { data: null, error: 'Achievement not found' }
      
      // Check if user already has this achievement
      const { data: existing } = await supabase
        .from('achievements')
        .select('id')
        .eq('user_id', userId)
        .eq('achievement_type', achievementType)
        .maybeSingle()
      
      if (existing) return { data: existing, error: null }
      
      // Award achievement
      const { data, error } = await supabase
        .from('achievements')
        .insert([{
          user_id: userId,
          achievement_type: achievementType,
          achievement_name: definition.name,
          description: definition.description,
          icon: definition.icon
        }])
        .select()
        .single()
      
      if (error) throw error
      return { data, error: null }
    } catch (error) {
      return { data: null, error }
    }
  }
}
