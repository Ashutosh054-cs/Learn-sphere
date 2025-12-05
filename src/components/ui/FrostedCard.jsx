import { motion } from 'framer-motion';

export default function FrostedCard({ children, className = '', hover = false, ...props }) {
  // Enhanced card with better shadows for visibility
  const baseClasses = "rounded-2xl p-4 border shadow-md";
  const hoverClasses = hover ? "hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200" : "";

  const Component = hover ? motion.div : 'div';
  const motionProps = hover ? {
    whileHover: { y: -4 },
    transition: { duration: 0.2 }
  } : {};

  return (
    <Component
      className={`${baseClasses} ${hoverClasses} ${className}`}
      style={{ 
        backgroundColor: 'var(--bg-primary)',
        borderColor: 'var(--border-color)',
        boxShadow: 'var(--shadow-md)'
      }}
      {...motionProps}
      {...props}
    >
      {children}
    </Component>
  );
}
