import { useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp } from 'lucide-react';
import FrostedCard from '../../../components/ui/FrostedCard';
import useRoadmapStore from '../../../stores/roadmapStore';

export default function SkillOverview() {
  const { skills } = useRoadmapStore();
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
          Your Skills
        </h2>
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 rounded-full text-sm font-medium transition-all hover:scale-105"
          style={{
            backgroundColor: 'var(--accent-primary)',
            color: 'var(--bg-primary)'
          }}
        >
          Update Skill Test
        </button>
      </div>

      <FrostedCard className="p-4 w-fit">
        <div className="flex items-center justify-start gap-3 flex-wrap">
          {skills.map((skill) => {
            const percentage = (skill.level / skill.maxLevel) * 100;
            const radius = 36;
            const circumference = 2 * Math.PI * radius;
            const strokeDashoffset = circumference - (percentage / 100) * circumference;

            return (
              <div key={skill.id} className="flex flex-col items-center mx-1">
                {/* Radial Progress (larger with gradient) */}
                <div className="relative w-20 h-20 mb-1">
                  <svg className="transform -rotate-90" width="80" height="80">
                    <defs>
                      <linearGradient id={`skillGradient-${skill.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#FF6B35" />
                        <stop offset="50%" stopColor="var(--accent-secondary)" />
                        <stop offset="100%" stopColor="var(--accent-primary)" />
                      </linearGradient>
                    </defs>
                    <circle
                      cx="40"
                      cy="40"
                      r={radius}
                      stroke="rgba(255, 255, 255, 0.08)"
                      strokeWidth="6"
                      fill="none"
                    />
                    <motion.circle
                      cx="40"
                      cy="40"
                      r={radius}
                      stroke={`url(#skillGradient-${skill.id})`}
                      strokeWidth="6"
                      fill="none"
                      strokeDasharray={circumference}
                      strokeDashoffset={strokeDashoffset}
                      strokeLinecap="round"
                      initial={{ strokeDashoffset: circumference }}
                      animate={{ strokeDashoffset }}
                      transition={{ duration: 1, ease: "easeOut" }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
                      {skill.level}
                    </span>
                  </div>
                </div>

                {/* Skill Name (smaller, constrained) */}
                <div
                  className="text-[11px] font-medium text-center max-w-16 truncate leading-tight"
                  style={{ color: 'var(--text-primary)' }}
                >
                  {skill.name}
                </div>

                {/* Trend Icon (smaller) */}
                <div className="flex items-center gap-1 mt-0.5">
                  <TrendingUp className="w-3 h-3" style={{ color: '#34D399' }} />
                  <span className="text-xs" style={{ color: '#34D399' }}>
                    +5
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </FrostedCard>

      {/* Skill Test Modal (Placeholder) */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowModal(false)} />
          <FrostedCard className="relative z-10 w-full max-w-md p-6 mx-4">
            <h3 className="text-xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
              Skill Assessment
            </h3>
            <p className="mb-4" style={{ color: 'var(--text-secondary)' }}>
              Take a quick test to update your skill levels. This feature will be available soon!
            </p>
            <button
              onClick={() => setShowModal(false)}
              className="w-full px-4 py-2 rounded-full font-medium"
              style={{
                backgroundColor: 'var(--accent-primary)',
                color: 'var(--bg-primary)'
              }}
            >
              Close
            </button>
          </FrostedCard>
        </div>
      )}
    </div>
  );
}
