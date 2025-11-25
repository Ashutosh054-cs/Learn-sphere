import { createContext, useContext, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const ToastContext = createContext(null)

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const show = useCallback((message, { duration = 4000, appearance = 'info' } = {}) => {
    const id = Math.random().toString(36).slice(2)
    const t = { id, message, duration, appearance }
    setToasts((s) => [t, ...s])
    if (duration > 0) {
      setTimeout(() => setToasts((s) => s.filter((x) => x.id !== id)), duration)
    }
    return id
  }, [])

  const dismiss = useCallback((id) => setToasts((s) => s.filter((x) => x.id !== id)), [])

  const getAppearanceStyles = (appearance) => {
    switch (appearance) {
      case 'success':
        return {
          bg: 'linear-gradient(135deg, rgba(16, 185, 129, 0.95) 0%, rgba(5, 150, 105, 0.95) 100%)',
          icon: '✓',
          iconBg: 'rgba(255, 255, 255, 0.25)'
        }
      case 'error':
        return {
          bg: 'linear-gradient(135deg, rgba(239, 68, 68, 0.95) 0%, rgba(220, 38, 38, 0.95) 100%)',
          icon: '✕',
          iconBg: 'rgba(255, 255, 255, 0.25)'
        }
      default: // info
        return {
          bg: 'linear-gradient(135deg, rgba(59, 130, 246, 0.95) 0%, rgba(37, 99, 235, 0.95) 100%)',
          icon: '🎯',
          iconBg: 'rgba(255, 255, 255, 0.2)'
        }
    }
  }

  return (
    <ToastContext.Provider value={{ show, dismiss }}>
      {children}
      <div style={{ position: 'fixed', right: 24, bottom: 24, zIndex: 9999, display: 'flex', flexDirection: 'column-reverse', gap: 12, pointerEvents: 'none' }}>
        <AnimatePresence>
          {toasts.map((t) => {
            const styles = getAppearanceStyles(t.appearance)
            return (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, y: 50, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 50, scale: 0.8 }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                role="status"
                style={{
                  minWidth: 280,
                  maxWidth: 400,
                  padding: '16px 20px',
                  borderRadius: 16,
                  boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.1)',
                  background: styles.bg,
                  backdropFilter: 'blur(12px)',
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 14,
                  pointerEvents: 'auto',
                  cursor: 'pointer'
                }}
                onClick={() => dismiss(t.id)}
              >
                <div style={{
                  width: 40,
                  height: 40,
                  borderRadius: 12,
                  background: styles.iconBg,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 20,
                  flexShrink: 0,
                  fontWeight: 'bold'
                }}>
                  {styles.icon}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 15, fontWeight: 600, lineHeight: 1.4, letterSpacing: '0.01em' }}>{t.message}</div>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    dismiss(t.id)
                  }}
                  style={{
                    background: 'rgba(255, 255, 255, 0.2)',
                    border: 'none',
                    borderRadius: 8,
                    width: 28,
                    height: 28,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    color: '#fff',
                    fontSize: 16,
                    fontWeight: 'bold',
                    flexShrink: 0,
                    transition: 'background 0.2s'
                  }}
                  onMouseEnter={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.3)'}
                  onMouseLeave={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.2)'}
                >
                  ×
                </button>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx
}

export default ToastProvider
