export default function Icon({ 
  icon: IconComponent, 
  size = 24, 
  color = 'var(--text-secondary)',
  className = '',
  ...props 
}) {
  return (
    <IconComponent
      size={size}
      strokeWidth={1.5}
      style={{ color }}
      className={className}
      {...props}
    />
  );
}
