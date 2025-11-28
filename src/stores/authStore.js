import { create } from 'zustand'
import { supabase } from '../lib/supabase'

export const useAuthStore = create((set) => ({
  user: { id: 'dev-user', email: 'dev@example.com' }, // Mock user for development
  session: { user: { id: 'dev-user', email: 'dev@example.com' } }, // Mock session
  loading: false, // No loading needed

  // Initialize auth state (disabled - always authenticated in dev mode)
  initialize: async () => {
    set({ 
      user: { id: 'dev-user', email: 'dev@example.com' },
      session: { user: { id: 'dev-user', email: 'dev@example.com' } },
      loading: false 
    })
  },

  // Sign up (disabled - auto-authenticated in dev mode)
  signUp: async (email, password, userData = {}) => {
    const mockUser = { id: 'dev-user', email, ...userData }
    set({ 
      user: mockUser,
      session: { user: mockUser }
    })
    return { data: { user: mockUser, session: { user: mockUser } }, error: null }
  },

  // Sign in (disabled - auto-authenticated in dev mode)
  signIn: async (email, password) => {
    const mockUser = { id: 'dev-user', email }
    set({ 
      user: mockUser,
      session: { user: mockUser }
    })
    return { data: { user: mockUser, session: { user: mockUser } }, error: null }
  },

  // Sign out (disabled - stays authenticated in dev mode)
  signOut: async () => {
    // Don't actually sign out in dev mode
    return { error: null }
  },

  // Reset password
  resetPassword: async (email) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email)
      if (error) throw error
      return { error: null }
    } catch (error) {
      return { error: error.message }
    }
  }
}))
