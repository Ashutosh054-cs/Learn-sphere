import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { useAuthStore } from '../stores/authStore'

const AuthContext = createContext({})

// Export hook in the same file for convenience
// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const authStore = useAuthStore()

  useEffect(() => {
    let mounted = true

    const initializeAuth = async () => {
      // Initialize auth store
      await authStore.initialize()

      if (!supabase) {
        if (mounted) setLoading(false)
        return
      }

      // Get initial session
      const { data: { session } } = await supabase.auth.getSession()
      if (mounted) {
        setUser(session?.user ?? null)
        setLoading(false)
      }

      // Listen for auth changes
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        async (event, session) => {
          if (mounted) {
            setUser(session?.user ?? null)
            setLoading(false)
          }

          // Handle specific auth events
          if (event === 'SIGNED_IN') {
            console.log('User signed in:', session?.user?.email)
          } else if (event === 'SIGNED_OUT') {
            console.log('User signed out')
          } else if (event === 'USER_UPDATED') {
            console.log('User updated:', session?.user?.email)
          }
        }
      )

      return subscription
    }

    const subscription = initializeAuth()

    return () => {
      mounted = false
      subscription.then(sub => sub?.unsubscribe())
    }
  }, [authStore])

  const value = {
    user,
    loading,
    signUp: authStore.signUp,
    signIn: authStore.signIn,
    signOut: authStore.signOut,
    resetPassword: authStore.resetPassword,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
