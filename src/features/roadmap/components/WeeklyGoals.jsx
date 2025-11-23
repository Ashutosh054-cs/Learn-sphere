import { useState } from 'react';
import { Target, ChevronDown, ChevronUp } from 'lucide-react';
import FrostedCard from '../../../components/ui/FrostedCard';
import useRoadmapStore from '../../../stores/roadmapStore';

export default function WeeklyGoals() {
  const { weeklyGoals, toggleWeeklyGoal, xp } = useRoadmapStore();
  const [isExpanded, setIsExpanded] = useState(true);

  const completedGoals = weeklyGoals.filter(g => g.completed).length;
  const totalXP = weeklyGoals.reduce((sum, g) => sum + (g.completed ? g.xp : 0), 0);
  const maxXP = weeklyGoals.reduce((sum, g) => sum + g.xp, 0);
  const progress = (totalXP / maxXP) * 100;

  return (
    <FrostedCard className="p-6">
      <div 
        className="flex items-center justify-between cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-2">
          <Target className="w-6 h-6" style={{ color: 'var(--accent-secondary)' }} />
          <h2 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
            Weekly Goals
          </h2>
          <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            ({completedGoals}/{weeklyGoals.length})
          </span>
        </div>
        {isExpanded ? (
          <ChevronUp className="w-5 h-5" style={{ color: 'var(--text-secondary)' }} />
        ) : (
          <ChevronDown className="w-5 h-5" style={{ color: 'var(--text-secondary)' }} />
        )}
      </div>

      {isExpanded && (
        <>
          {/* Progress Bar */}
          <div className="mt-4 mb-4">
            <div className="flex items-center justify-between text-sm mb-2">
              <span style={{ color: 'var(--text-secondary)' }}>Progress</span>
              <span className="font-bold" style={{ color: 'var(--accent-primary)' }}>
                {totalXP}/{maxXP} XP
              </span>
            </div>
            <div className="h-3 rounded-full overflow-hidden" style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}>
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  background: 'linear-gradient(to right, var(--accent-primary), var(--accent-secondary))',
                  width: `${progress}%`
                }}
              />
            </div>
          </div>

          {/* Goals Checklist */}
          <div className="space-y-3">
            {weeklyGoals.map((goal) => (
              <div
                key={goal.id}
                className="flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all hover:scale-102"
                style={{
                  backgroundColor: goal.completed ? 'var(--accent-light)' : 'var(--bg-secondary)',
                  borderLeft: `3px solid ${goal.completed ? 'var(--accent-primary)' : 'transparent'}`
                }}
                onClick={() => toggleWeeklyGoal(goal.id)}
              >
                <input
                  type="checkbox"
                  checked={goal.completed}
                  onChange={() => toggleWeeklyGoal(goal.id)}
                  className="w-5 h-5 rounded cursor-pointer"
                  style={{ accentColor: 'var(--accent-primary)' }}
                />
                <div className="flex-1">
                  <p
                    className={`text-sm font-medium ${goal.completed ? 'line-through' : ''}`}
                    style={{ color: goal.completed ? 'var(--text-secondary)' : 'var(--text-primary)' }}
                  >
                    {goal.title}
                  </p>
                </div>
                <span className="text-xs font-semibold" style={{ color: 'var(--accent-primary)' }}>
                  +{goal.xp} XP
                </span>
              </div>
            ))}
          </div>

          {/* Total XP Display */}
          <div className="mt-4 pt-4 border-t" style={{ borderColor: 'var(--border-color)' }}>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
                Total XP Earned
              </span>
              <span className="text-2xl font-bold" style={{ color: 'var(--accent-primary)' }}>
                {xp}
              </span>
            </div>
          </div>
        </>
      )}
    </FrostedCard>
  );
}
