import { motion } from 'framer-motion';

export default function FrostedCard({ children, className = '', hover = false, ...props }) {
  const baseClasses = "backdrop-blur-[16px] border border-[rgba(255,255,255,0.1)] rounded-3xl p-4";
  const hoverClasses = hover ? "hover:shadow-lg hover:border-[rgba(0,230,230,0.3)] transition-all duration-300" : "";
  
  const Component = hover ? motion.div : 'div';
  const motionProps = hover ? {
    whileHover: { y: -4 },
    transition: { duration: 0.2 }
  } : {};

  return (
    <Component
      className={`${baseClasses} ${hoverClasses} ${className}`}
      style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)' }}
      {...motionProps}
      {...props}
    >
      {children}
    </Component>
  );
}
