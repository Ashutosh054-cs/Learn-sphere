import { Clock, Zap } from 'lucide-react';
import FrostedCard from '../../../components/ui/FrostedCard';
import useRoadmapStore from '../../../stores/roadmapStore';

export default function NextSteps() {
  const { selectNode, getNextSteps, activeCareer } = useRoadmapStore();
  const nextSteps = getNextSteps(activeCareer);

  if (nextSteps.length === 0) {
    return (
      <FrostedCard className="p-6">
        <h2 className="text-xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
          Recommended Next Steps
        </h2>
        <p style={{ color: 'var(--text-secondary)' }}>
          Complete a module to unlock new recommendations!
        </p>
      </FrostedCard>
    );
  }

  return (
    <FrostedCard className="p-6">
      <div className="flex items-center gap-2 mb-4">
        <Zap className="w-6 h-6" style={{ color: 'var(--accent-primary)' }} />
        <h2 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
          Recommended Next Steps
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {nextSteps.map((step) => (
          <div
            key={step.id}
            className="border rounded-xl p-4 transition-all"
            style={{
              backgroundColor: 'var(--bg-secondary)',
              borderColor: 'var(--border-color)'
            }}
            onClick={() => selectNode(step.id)}
          >
            <div className="flex items-start justify-between mb-2">
              <h3 className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
                {step.title}
              </h3>
              <span className="px-2 py-0.5 rounded-full text-xs font-medium"
                style={{
                  backgroundColor: step.difficulty === 'Basic' ? 'hsl(142 70% 45% / 0.12)' : 
                                 step.difficulty === 'Intermediate' ? 'hsl(42 100% 55% / 0.12)' : 
                                 'hsl(0 84% 60% / 0.12)',
                  color: step.difficulty === 'Basic' ? 'hsl(142 70% 35%)' : 
                         step.difficulty === 'Intermediate' ? 'hsl(42 100% 45%)' : 
                         'hsl(0 84% 50%)'
                }}
              >
                {step.difficulty}
              </span>
            </div>

            <p className="text-xs mb-3" style={{ color: 'var(--text-secondary)' }}>
              {step.description}
            </p>

            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-1" style={{ color: 'var(--text-secondary)' }}>
                <Clock className="w-3 h-3" />
                <span>{step.estimatedMinutes} min</span>
              </div>
              <div className="font-semibold" style={{ color: 'var(--accent-primary)' }}>
                +{step.xp} XP
              </div>
            </div>

            <button
              className="w-full mt-3 px-4 py-2 rounded-full text-sm font-medium transition-all hover:scale-105 cursor-pointer"
              style={{
                backgroundColor: 'var(--accent-primary)',
                color: 'var(--bg-primary)'
              }}
              onClick={(e) => {
                e.stopPropagation();
                selectNode(step.id);
              }}
            >
              Start Learning
            </button>

            {step.reason && (
              <p className="text-xs mt-2 italic" style={{ color: 'var(--text-secondary)' }}>
                {step.reason}
              </p>
            )}
          </div>
        ))}
      </div>
    </FrostedCard>
  );
}
