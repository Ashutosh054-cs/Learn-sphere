import FrostedCard from '../../../components/ui/FrostedCard';
import useRoadmapStore from '../../../stores/roadmapStore';

export default function CareerSelector() {
  const { careers, activeCareer, setActiveCareer } = useRoadmapStore();

  return (
    <div className="mb-6">
      <h2 className="text-lg font-bold mb-3" style={{ color: 'var(--text-primary)' }}>
        Choose Your Role
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2">
        {careers.map((career) => {
          const isActive = activeCareer === career.id;

          return (
            <FrostedCard
              key={career.id}
              className={`p-2 cursor-pointer transition-all duration-200 ${isActive ? 'ring-2 ring-offset-1' : ''}`}
              style={{
                transform: isActive ? 'scale(1.03)' : 'scale(1)'
              }}
              onClick={() => {
                setActiveCareer(career.id);
                // scroll to roadmap graph after a tiny delay
                setTimeout(() => {
                  const el = document.getElementById('roadmap-graph');
                  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }, 120);
              }}
              hover={true}
            >
              <div className="flex flex-col items-start">
                <div className="text-[10px] sm:text-xs font-semibold mb-1 leading-tight" style={{ color: 'var(--text-primary)' }}>
                  {career.title}
                </div>
                <p className="text-[9px] sm:text-[10px] opacity-70 line-clamp-2" style={{ color: 'var(--text-secondary)' }}>
                  {career.description}
                </p>
                {isActive && (
                  <div className="mt-1.5 px-1.5 py-0.5 rounded-full text-[8px] sm:text-[9px] font-medium"
                    style={{
                      backgroundColor: 'var(--accent-light)',
                      color: 'var(--accent-primary)'
                    }}
                  >
                    Active
                  </div>
                )}
              </div>
            </FrostedCard>
          );
        })}
      </div>
    </div>
  );
}
