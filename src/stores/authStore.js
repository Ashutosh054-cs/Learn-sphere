import { create } from 'zustand'
import { supabase } from '../lib/supabase'

// 🔧 LOCAL DEVELOPMENT MODE - REMOVE BEFORE PRODUCTION
const DEV_MODE = true // Set to false when you have Supabase credentials

// Admin credentials for local development (collaborators use these)
const ADMIN_CREDENTIALS = {
  email: 'admin@learnsphere.local',
  password: 'LearnSphere2024!',
  mockUser: {
    id: 'admin-local-dev',
    email: 'admin@learnsphere.local',
    user_metadata: {
      name: 'Admin User'
    }
  }
}

export const useAuthStore = create((set) => ({
  user: null,
  session: null,
  loading: true,

  // Initialize auth state
  initialize: async () => {
    // LOCAL DEV MODE: Auto-login with mock user if previously logged in
    if (DEV_MODE) {
      const savedUser = localStorage.getItem('learnsphere_dev_user')
      if (savedUser) {
        set({ 
          user: JSON.parse(savedUser),
          session: { user: JSON.parse(savedUser) },
          loading: false 
        })
      } else {
        set({ loading: false })
      }
      return
    }

    // PRODUCTION MODE: Use Supabase
    try {
      const { data: { session } } = await supabase.auth.getSession()
      set({ 
        user: session?.user ?? null,
        session,
        loading: false 
      })

      // Listen for auth changes
      supabase.auth.onAuthStateChange((_event, session) => {
        set({ 
          user: session?.user ?? null,
          session 
        })
      })
    } catch (error) {
      console.error('Error initializing auth:', error)
      set({ loading: false })
    }
  },

  // Sign up
  signUp: async (email, password, userData = {}) => {
    // LOCAL DEV MODE: Mock sign up
    if (DEV_MODE) {
      return { data: null, error: 'Sign up disabled in dev mode. Use admin credentials to login.' }
    }

    // PRODUCTION MODE: Use Supabase
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: userData
        }
      })
      if (error) throw error
      
      // Create user profile
      if (data.user) {
        await supabase.from('user_profiles').insert([{
          id: data.user.id,
          email: data.user.email,
          name: userData.name || email.split('@')[0],
          avatar_url: userData.avatar_url || null
        }])
      }
      
      return { data, error: null }
    } catch (error) {
      return { data: null, error: error.message }
    }
  },

  // Sign in
  signIn: async (email, password) => {
    // LOCAL DEV MODE: Check admin credentials
    if (DEV_MODE) {
      if (email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
        const user = ADMIN_CREDENTIALS.mockUser
        localStorage.setItem('learnsphere_dev_user', JSON.stringify(user))
        set({ 
          user,
          session: { user },
          loading: false 
        })
        return { data: { user }, error: null }
      } else {
        return { 
          data: null, 
          error: 'Invalid credentials. Use: admin@learnsphere.local / LearnSphere2024!' 
        }
      }
    }

    // PRODUCTION MODE: Use Supabase
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })
      if (error) throw error
      return { data, error: null }
    } catch (error) {
      return { data: null, error: error.message }
    }
  },

  // Sign out
  signOut: async () => {
    // LOCAL DEV MODE: Clear mock user
    if (DEV_MODE) {
      localStorage.removeItem('learnsphere_dev_user')
      set({ user: null, session: null })
      return { error: null }
    }

    // PRODUCTION MODE: Use Supabase
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      set({ user: null, session: null })
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
