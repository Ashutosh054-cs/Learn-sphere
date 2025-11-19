import { motion } from 'framer-motion';

export default function Button({ 
  children, 
  variant = 'primary', 
  onClick, 
  className = '',
  ...props 
}) {
  const variants = {
    primary: {
      backgroundColor: 'var(--accent-primary)',
      color: 'var(--bg-primary)',
    },
    secondary: {
      backgroundColor: 'transparent',
      color: 'var(--accent-secondary)',
      border: '1px solid var(--accent-secondary)',
    },
    outline: {
      backgroundColor: 'transparent',
      color: 'var(--text-primary)',
      border: '1px solid rgba(255, 255, 255, 0.2)',
    }
  };

  return (
    <motion.button
      className={`px-6 py-3 font-semibold rounded-full transition-all duration-200 ${className}`}
      style={variants[variant]}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      {...props}
    >
      {children}
    </motion.button>
  );
}
