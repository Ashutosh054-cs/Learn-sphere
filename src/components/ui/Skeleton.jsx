export default function Skeleton({ className = '', width, height }) {
  return (
    <div
      className={`animate-pulse rounded-lg ${className}`}
      style={{
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        width: width || '100%',
        height: height || '1rem',
      }}
    />
  );
}
