// Local storage service for groups (no Supabase)

const STORAGE_KEYS = {
  GROUPS: 'learnsphere_groups',
  GROUP_MEMBERS: 'learnsphere_group_members',
  GROUP_ATTENDANCE: 'learnsphere_group_attendance',
  GROUP_RULES: 'learnsphere_group_rules',
  GROUP_INVITES: 'learnsphere_group_invites'
}

// Helper to get current user
const getCurrentUser = () => {
  const userStr = localStorage.getItem('learnsphere_dev_user')
  if (!userStr) return null
  return JSON.parse(userStr)
}

// Helper to generate random ID
const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}

// Helper to generate random token
const generateToken = () => {
  return Array.from(crypto.getRandomValues(new Uint8Array(16)))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('')
}

// Get data from localStorage
const getLocalData = (key) => {
  const data = localStorage.getItem(key)
  return data ? JSON.parse(data) : []
}

// Set data to localStorage
const setLocalData = (key, data) => {
  localStorage.setItem(key, JSON.stringify(data))
}

export const localGroupService = {
  // Create a new group
  createGroup: async ({ name, description, visibility = 'private', groupType = 'study' }) => {
    try {
      const user = getCurrentUser()
      if (!user) throw new Error('Not authenticated')

      const groups = getLocalData(STORAGE_KEYS.GROUPS)
      const members = getLocalData(STORAGE_KEYS.GROUP_MEMBERS)

      const newGroup = {
        id: generateId(),
        owner_id: user.id,
        name,
        description,
        visibility,
        group_type: groupType,
        created_at: new Date().toISOString()
      }

      groups.push(newGroup)
      setLocalData(STORAGE_KEYS.GROUPS, groups)

      // Add owner as member
      const newMember = {
        id: generateId(),
        group_id: newGroup.id,
        user_id: user.id,
        role: 'owner',
        joined_at: new Date().toISOString()
      }

      members.push(newMember)
      setLocalData(STORAGE_KEYS.GROUP_MEMBERS, members)

      return { data: newGroup, error: null }
    } catch (error) {
      return { data: null, error }
    }
  },

  // List groups where current user is a member
  listMyGroups: async () => {
    try {
      const user = getCurrentUser()
      if (!user) throw new Error('Not authenticated')

      const groups = getLocalData(STORAGE_KEYS.GROUPS)
      const members = getLocalData(STORAGE_KEYS.GROUP_MEMBERS)

      // Find groups where user is a member
      const userGroupIds = members
        .filter(m => m.user_id === user.id)
        .map(m => m.group_id)

      const myGroups = groups.filter(g => userGroupIds.includes(g.id))

      return { data: myGroups, error: null }
    } catch (error) {
      return { data: null, error }
    }
  },

  // Get single group with members
  getGroup: async (groupId) => {
    try {
      const user = getCurrentUser()
      if (!user) throw new Error('Not authenticated')

      const groups = getLocalData(STORAGE_KEYS.GROUPS)
      const members = getLocalData(STORAGE_KEYS.GROUP_MEMBERS)

      const group = groups.find(g => g.id === groupId)
      if (!group) throw new Error('Group not found')

      // Check if user is a member
      const isMember = members.some(m => m.group_id === groupId && m.user_id === user.id)
      if (!isMember) throw new Error('Not authorized')

      // Get all members
      const groupMembers = members.filter(m => m.group_id === groupId)

      return { 
        data: {
          ...group,
          members: groupMembers
        }, 
        error: null 
      }
    } catch (error) {
      return { data: null, error }
    }
  },

  // Invite by email
  inviteByEmail: async (groupId, invitedEmail) => {
    try {
      const user = getCurrentUser()
      if (!user) throw new Error('Not authenticated')

      const groups = getLocalData(STORAGE_KEYS.GROUPS)
      const members = getLocalData(STORAGE_KEYS.GROUP_MEMBERS)
      const invites = getLocalData(STORAGE_KEYS.GROUP_INVITES)

      const group = groups.find(g => g.id === groupId)
      if (!group) throw new Error('Group not found')

      // Check if user is owner
      const isOwner = members.some(m => 
        m.group_id === groupId && 
        m.user_id === user.id && 
        m.role === 'owner'
      )
      if (!isOwner) throw new Error('Only owner can invite')

      const newInvite = {
        id: generateId(),
        group_id: groupId,
        invited_by: user.id,
        invited_email: invitedEmail,
        token: generateToken(),
        accepted: false,
        created_at: new Date().toISOString()
      }

      invites.push(newInvite)
      setLocalData(STORAGE_KEYS.GROUP_INVITES, invites)

      return { data: newInvite, error: null }
    } catch (error) {
      return { data: null, error }
    }
  },

  // Accept invite
  acceptInvite: async (token) => {
    try {
      const user = getCurrentUser()
      if (!user) throw new Error('Not authenticated')

      const invites = getLocalData(STORAGE_KEYS.GROUP_INVITES)
      const members = getLocalData(STORAGE_KEYS.GROUP_MEMBERS)

      const invite = invites.find(i => i.token === token && !i.accepted)
      if (!invite) throw new Error('Invalid or expired invite')

      // Check if user email matches
      if (invite.invited_email !== user.email) {
        throw new Error('This invite is for a different email')
      }

      // Add as member
      const newMember = {
        id: generateId(),
        group_id: invite.group_id,
        user_id: user.id,
        role: 'member',
        joined_at: new Date().toISOString()
      }

      members.push(newMember)
      setLocalData(STORAGE_KEYS.GROUP_MEMBERS, members)

      // Mark invite as accepted
      invite.accepted = true
      setLocalData(STORAGE_KEYS.GROUP_INVITES, invites)

      return { data: newMember, error: null }
    } catch (error) {
      return { data: null, error }
    }
  },

  // Mark attendance
  markAttendance: async (groupId, notes = '') => {
    try {
      const user = getCurrentUser()
      if (!user) throw new Error('Not authenticated')

      const members = getLocalData(STORAGE_KEYS.GROUP_MEMBERS)
      const attendance = getLocalData(STORAGE_KEYS.GROUP_ATTENDANCE)

      // Check if user is a member
      const isMember = members.some(m => m.group_id === groupId && m.user_id === user.id)
      if (!isMember) throw new Error('Not a member of this group')

      const newAttendance = {
        id: generateId(),
        group_id: groupId,
        user_id: user.id,
        attended_at: new Date().toISOString(),
        notes
      }

      attendance.push(newAttendance)
      setLocalData(STORAGE_KEYS.GROUP_ATTENDANCE, attendance)

      return { data: newAttendance, error: null }
    } catch (error) {
      return { data: null, error }
    }
  },

  // Upsert rule
  upsertRule: async (groupId, key, value) => {
    try {
      const user = getCurrentUser()
      if (!user) throw new Error('Not authenticated')

      const groups = getLocalData(STORAGE_KEYS.GROUPS)
      const members = getLocalData(STORAGE_KEYS.GROUP_MEMBERS)
      const rules = getLocalData(STORAGE_KEYS.GROUP_RULES)

      const group = groups.find(g => g.id === groupId)
      if (!group) throw new Error('Group not found')

      // Check if user is owner
      const isOwner = members.some(m => 
        m.group_id === groupId && 
        m.user_id === user.id && 
        m.role === 'owner'
      )
      if (!isOwner) throw new Error('Only owner can modify rules')

      // Check if rule exists
      const existingRule = rules.find(r => r.group_id === groupId && r.rule_key === key)

      if (existingRule) {
        // Update
        existingRule.rule_value = value
        existingRule.updated_at = new Date().toISOString()
      } else {
        // Insert
        const newRule = {
          id: generateId(),
          group_id: groupId,
          rule_key: key,
          rule_value: value,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
        rules.push(newRule)
      }

      setLocalData(STORAGE_KEYS.GROUP_RULES, rules)

      return { 
        data: existingRule || rules[rules.length - 1], 
        error: null 
      }
    } catch (error) {
      return { data: null, error }
    }
  },

  // Get rules for a group
  getRules: async (groupId) => {
    try {
      const user = getCurrentUser()
      if (!user) throw new Error('Not authenticated')

      const members = getLocalData(STORAGE_KEYS.GROUP_MEMBERS)
      const rules = getLocalData(STORAGE_KEYS.GROUP_RULES)

      // Check if user is a member
      const isMember = members.some(m => m.group_id === groupId && m.user_id === user.id)
      if (!isMember) throw new Error('Not a member of this group')

      const groupRules = rules.filter(r => r.group_id === groupId)

      return { data: groupRules, error: null }
    } catch (error) {
      return { data: null, error }
    }
  },

  // Get attendance history
  getAttendance: async (groupId) => {
    try {
      const user = getCurrentUser()
      if (!user) throw new Error('Not authenticated')

      const members = getLocalData(STORAGE_KEYS.GROUP_MEMBERS)
      const attendance = getLocalData(STORAGE_KEYS.GROUP_ATTENDANCE)

      // Check if user is a member
      const isMember = members.some(m => m.group_id === groupId && m.user_id === user.id)
      if (!isMember) throw new Error('Not a member of this group')

      const groupAttendance = attendance
        .filter(a => a.group_id === groupId)
        .sort((a, b) => new Date(b.attended_at) - new Date(a.attended_at))

      return { data: groupAttendance, error: null }
    } catch (error) {
      return { data: null, error }
    }
  },

  // Start a study session for a group
  startStudySession: async (groupId, duration = 25) => {
    try {
      const user = getCurrentUser()
      if (!user) throw new Error('Not authenticated')

      const members = getLocalData(STORAGE_KEYS.GROUP_MEMBERS)
      
      // Check if user is a member
      const isMember = members.some(m => m.group_id === groupId && m.user_id === user.id)
      if (!isMember) throw new Error('Not a member of this group')

      const sessionData = {
        groupId,
        userId: user.id,
        startTime: new Date().toISOString(),
        duration,
        completed: false
      }

      localStorage.setItem('learnsphere_active_session', JSON.stringify(sessionData))

      return { data: sessionData, error: null }
    } catch (error) {
      return { data: null, error }
    }
  },

  // Complete a study session and mark attendance
  completeStudySession: async (actualMinutes) => {
    try {
      const user = getCurrentUser()
      if (!user) throw new Error('Not authenticated')

      const sessionStr = localStorage.getItem('learnsphere_active_session')
      if (!sessionStr) throw new Error('No active session')

      const session = JSON.parse(sessionStr)
      if (session.userId !== user.id) throw new Error('Not your session')

      // Calculate actual time spent
      const startTime = new Date(session.startTime)
      const endTime = new Date()
      const actualTimeSpent = actualMinutes || Math.floor((endTime - startTime) / 60000) // minutes

      // Mark attendance with actual time
      const attendance = getLocalData(STORAGE_KEYS.GROUP_ATTENDANCE)
      const newAttendance = {
        id: generateId(),
        group_id: session.groupId,
        user_id: user.id,
        attended_at: new Date().toISOString(),
        notes: `Studied for ${actualTimeSpent} minutes`,
        session_duration: actualTimeSpent,
        start_time: session.startTime,
        end_time: endTime.toISOString()
      }

      attendance.push(newAttendance)
      setLocalData(STORAGE_KEYS.GROUP_ATTENDANCE, attendance)

      // Clear active session
      localStorage.removeItem('learnsphere_active_session')

      return { data: newAttendance, error: null }
    } catch (error) {
      return { data: null, error }
    }
  },

  // Get active study session
  getActiveSession: () => {
    const sessionStr = localStorage.getItem('learnsphere_active_session')
    return sessionStr ? JSON.parse(sessionStr) : null
  },

  // Get total study time for a group (today)
  getTodayStudyTime: async (groupId) => {
    try {
      const user = getCurrentUser()
      if (!user) throw new Error('Not authenticated')

      const attendance = getLocalData(STORAGE_KEYS.GROUP_ATTENDANCE)
      const today = new Date().toDateString()

      const todayAttendance = attendance.filter(a => 
        a.group_id === groupId && 
        a.user_id === user.id &&
        new Date(a.attended_at).toDateString() === today
      )

      const totalMinutes = todayAttendance.reduce((sum, a) => sum + (a.session_duration || 0), 0)

      return { data: { totalMinutes, sessions: todayAttendance.length }, error: null }
    } catch (error) {
      return { data: null, error }
    }
  },

  // Get study stats for all members in a group
  getGroupStudyStats: async (groupId) => {
    try {
      const user = getCurrentUser()
      if (!user) throw new Error('Not authenticated')

      const members = getLocalData(STORAGE_KEYS.GROUP_MEMBERS)
      const attendance = getLocalData(STORAGE_KEYS.GROUP_ATTENDANCE)

      // Check if user is a member
      const isMember = members.some(m => m.group_id === groupId && m.user_id === user.id)
      if (!isMember) throw new Error('Not a member of this group')

      const today = new Date().toDateString()

      // Calculate stats for each member
      const memberStats = members
        .filter(m => m.group_id === groupId)
        .map(member => {
          const memberAttendance = attendance.filter(a => 
            a.group_id === groupId && 
            a.user_id === member.user_id
          )

          const todayAttendance = memberAttendance.filter(a =>
            new Date(a.attended_at).toDateString() === today
          )

          const todayMinutes = todayAttendance.reduce((sum, a) => sum + (a.session_duration || 0), 0)
          const totalMinutes = memberAttendance.reduce((sum, a) => sum + (a.session_duration || 0), 0)

          return {
            userId: member.user_id,
            role: member.role,
            todayMinutes,
            totalMinutes,
            totalSessions: memberAttendance.length
          }
        })

      return { data: memberStats, error: null }
    } catch (error) {
      return { data: null, error }
    }
  }
}
