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

// ============================================
// GAME PROGRESS OPERATIONS
// ============================================
export const gameService = {
  // Save game progress
  saveProgress: async (userId, gameType, levelId, progressData) => {
    try {
      const { data, error } = await supabase
        .from('game_progress')
        .upsert([{
          user_id: userId,
          game_type: gameType,
          level_id: levelId,
          progress_data: progressData,
          last_played_at: new Date().toISOString()
        }], {
          onConflict: 'user_id,game_type,level_id'
        })
        .select()
        .single()
      
      if (error) throw error
      return { data, error: null }
    } catch (error) {
      return { data: null, error }
    }
  },

  // Get game progress
  getProgress: async (userId, gameType, levelId = null) => {
    try {
      let query = supabase
        .from('game_progress')
        .select('*')
        .eq('user_id', userId)
        .eq('game_type', gameType)
      
      if (levelId) {
        query = query.eq('level_id', levelId)
      }
      
      const { data, error } = await query.order('last_played_at', { ascending: false })
      
      if (error) throw error
      return { data: data || [], error: null }
    } catch (error) {
      return { data: [], error }
    }
  },

  // Complete a level
  completeLevel: async (userId, gameType, levelId, score, timeSpent) => {
    try {
      const { data, error } = await supabase
        .from('game_completions')
        .insert([{
          user_id: userId,
          game_type: gameType,
          level_id: levelId,
          score: score,
          time_spent_seconds: timeSpent,
          completed_at: new Date().toISOString()
        }])
        .select()
        .single()
      
      if (error) throw error
      
      // Update user stats
      await supabase.rpc('increment_game_stats', {
        user_uuid: userId,
        game_type: gameType
      })
      
      return { data, error: null }
    } catch (error) {
      return { data: null, error }
    }
  },

  // Get user's game statistics
  getGameStats: async (userId, gameType = null) => {
    try {
      let query = supabase
        .from('game_completions')
        .select('game_type, level_id, score, time_spent_seconds, completed_at')
        .eq('user_id', userId)
      
      if (gameType) {
        query = query.eq('game_type', gameType)
      }
      
      const { data, error } = await query.order('completed_at', { ascending: false })
      
      if (error) throw error
      return { data: data || [], error: null }
    } catch (error) {
      return { data: [], error }
    }
  }
}

// ============================================
// COINS & GEMS (GAMIFICATION)
// ============================================
export const gamificationService = {
  // Get user's coins and gems
  getCurrency: async (userId) => {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('coins, gems')
        .eq('id', userId)
        .maybeSingle()
      
      if (error) throw error
      return { data: data || { coins: 0, gems: 0 }, error: null }
    } catch (error) {
      return { data: { coins: 0, gems: 0 }, error }
    }
  },

  // Award coins
  awardCoins: async (userId, amount, reason = 'Activity reward') => {
    try {
      const { data, error } = await supabase.rpc('add_coins', {
        user_uuid: userId,
        coin_amount: amount
      })
      
      if (error) throw error
      
      // Log transaction
      await supabase.from('currency_transactions').insert([{
        user_id: userId,
        currency_type: 'coins',
        amount: amount,
        reason: reason,
        created_at: new Date().toISOString()
      }])
      
      return { data, error: null }
    } catch (error) {
      return { data: null, error }
    }
  },

  // Award gems
  awardGems: async (userId, amount, reason = 'Special achievement') => {
    try {
      const { data, error } = await supabase.rpc('add_gems', {
        user_uuid: userId,
        gem_amount: amount
      })
      
      if (error) throw error
      
      // Log transaction
      await supabase.from('currency_transactions').insert([{
        user_id: userId,
        currency_type: 'gems',
        amount: amount,
        reason: reason,
        created_at: new Date().toISOString()
      }])
      
      return { data, error: null }
    } catch (error) {
      return { data: null, error }
    }
  },

  // Get transaction history
  getTransactionHistory: async (userId, limit = 20) => {
    try {
      const { data, error } = await supabase
        .from('currency_transactions')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit)
      
      if (error) throw error
      return { data: data || [], error: null }
    } catch (error) {
      return { data: [], error }
    }
  }
}

// ============================================
// GROUP / COMMUNITY OPERATIONS
// ============================================
export const groupService = {
  // Create a new group
  createGroup: async ({ name, description = null, visibility = 'private' }) => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      const { data, error } = await supabase
        .from('groups')
        .insert([{ owner_id: user.id, name, description, visibility }])
        .select()
        .maybeSingle()

      if (error) throw error
      return { data, error: null }
    } catch (error) {
      return { data: null, error }
    }
  },

  // List groups the current user is member of or owns
  listMyGroups: async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      // groups where user is member
      const { data: memberGroups, error: mErr } = await supabase
        .from('group_members')
        .select('group_id')
        .eq('user_id', user.id)

      if (mErr) throw mErr

      const groupIds = (memberGroups || []).map(g => g.group_id)

      const { data, error } = await supabase
        .from('groups')
        .select('*')
        .in('id', groupIds.length ? groupIds : [''])

      if (error) throw error
      return { data: data || [], error: null }
    } catch (error) {
      return { data: [], error }
    }
  },

  // Get group details and members
  getGroup: async (groupId) => {
    try {
      const { data: group, error: gErr } = await supabase
        .from('groups')
        .select('*')
        .eq('id', groupId)
        .maybeSingle()
      if (gErr) throw gErr

      const { data: members, error: mErr } = await supabase
        .from('group_members')
        .select('user_id, role, joined_at')
        .eq('group_id', groupId)
      if (mErr) throw mErr

      return { data: { group, members }, error: null }
    } catch (error) {
      return { data: null, error }
    }
  },

  // Invite by email (creates an invite with token)
  inviteByEmail: async (groupId, invitedEmail) => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      // create a token
      const token = cryptoRandomString()

      const { data, error } = await supabase
        .from('group_invites')
        .insert([{ group_id: groupId, invited_email: invitedEmail, invited_by: user.id, token }])
        .select()
        .maybeSingle()

      if (error) throw error
      return { data, error: null }
    } catch (error) {
      return { data: null, error }
    }
  },

  // Accept invite using token
  acceptInvite: async (token) => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      const { data: invite, error: iErr } = await supabase
        .from('group_invites')
        .select('*')
        .eq('token', token)
        .maybeSingle()
      if (iErr) throw iErr
      if (!invite) throw new Error('Invite not found')
      if (invite.accepted) throw new Error('Invite already accepted')
      if (invite.invited_email.toLowerCase() !== (user.email || '').toLowerCase()) throw new Error('Invite email does not match your account')

      // insert membership
      const { data: mData, error: mErr } = await supabase
        .from('group_members')
        .insert([{ group_id: invite.group_id, user_id: user.id, role: 'member' }])
        .select()
        .maybeSingle()
      if (mErr) throw mErr

      // mark invite accepted
      const { data: uData, error: uErr } = await supabase
        .from('group_invites')
        .update({ accepted: true })
        .eq('id', invite.id)
      if (uErr) throw uErr

      return { data: { membership: mData, invite: uData }, error: null }
    } catch (error) {
      return { data: null, error }
    }
  },

  // Mark attendance for current user
  markAttendance: async (groupId, notes = null) => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      const { data, error } = await supabase
        .from('group_attendance')
        .insert([{ group_id: groupId, user_id: user.id, notes }])
        .select()
        .maybeSingle()

      if (error) throw error
      return { data, error: null }
    } catch (error) {
      return { data: null, error }
    }
  },

  // Add or update a group rule (owner only)
  upsertRule: async (groupId, key, value) => {
    try {
      const { data: ruleExists } = await supabase
        .from('group_rules')
        .select('*')
        .eq('group_id', groupId)
        .eq('rule_key', key)
        .maybeSingle()

      if (ruleExists) {
        const { data, error } = await supabase
          .from('group_rules')
          .update({ rule_value: value })
          .eq('id', ruleExists.id)
          .select()
          .maybeSingle()
        if (error) throw error
        return { data, error: null }
      }

      const { data, error } = await supabase
        .from('group_rules')
        .insert([{ group_id: groupId, rule_key: key, rule_value: value }])
        .select()
        .maybeSingle()
      if (error) throw error
      return { data, error: null }
    } catch (error) {
      return { data: null, error }
    }
  }
}

// Small helper to generate tokens
function cryptoRandomString() {
  // fallback simple token generator
  return Math.random().toString(36).slice(2) + Date.now().toString(36)
}
