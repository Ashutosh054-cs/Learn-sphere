import { create } from 'zustand'
import { supabase } from '../lib/supabase'

export const useAuthStore = create((set) => ({
  user: null,
  session: null,
  loading: true,

  // Initialize auth state
  initialize: async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      set({ session, user: session?.user ?? null, loading: false })

      // Listen for auth changes
      supabase.auth.onAuthStateChange((_event, session) => {
        set({ session, user: session?.user ?? null })
      })
    } catch (error) {
      console.error('Error initializing auth:', error)
      set({ loading: false })
    }
  },

  // Sign up with email and password
  signUp: async (email, password, userData = {}) => {
    try {
      // First try to sign up
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: userData,
          emailRedirectTo: window.location.origin + '/dashboard'
        }
      })
      if (error) throw error
      
      // If signup successful but no session (email confirmation required)
      if (data.user && !data.session) {
        // Try to sign in immediately (works if email confirmation is disabled)
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password
        })
        
        if (!signInError && signInData.session) {
          set({ session: signInData.session, user: signInData.user })
          return { data: signInData, error: null }
        }
      }
      
      // If session exists from signup, set it
      if (data.session) {
        set({ session: data.session, user: data.user })
      }
      
      return { data, error: null }
    } catch (error) {
      return { data: null, error: error.message }
    }
  },

  // Sign in with email and password
  signIn: async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
        options: {
          // Allow unverified email during development
          emailRedirectTo: window.location.origin + '/dashboard'
        }
      })
      if (error) throw error
      set({ session: data.session, user: data.user })
      return { data, error: null }
    } catch (error) {
      return { data: null, error: error.message }
    }
  },

  // Sign out
  signOut: async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      set({ session: null, user: null })
      return { error: null }
    } catch (error) {
      return { error: error.message }
    }
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
