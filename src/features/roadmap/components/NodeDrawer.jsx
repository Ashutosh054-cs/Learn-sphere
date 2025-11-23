import { X, PlayCircle, FileText, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import FrostedCard from '../../../components/ui/FrostedCard';
import useRoadmapStore from '../../../stores/roadmapStore';

export default function NodeDrawer() {
  const { selectedNode, closeDrawer, markNodeComplete } = useRoadmapStore();

  if (!selectedNode) return null;

  return (
    <AnimatePresence>
      {selectedNode && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40"
            onClick={closeDrawer}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-md z-50 overflow-y-auto"
          >
            <FrostedCard className="h-full rounded-none p-6">
              {/* Header */}
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold mb-1" style={{ color: 'var(--text-primary)' }}>
                    {selectedNode.title}
                  </h2>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-1 rounded-full text-xs font-medium"
                      style={{
                        backgroundColor: selectedNode.difficulty === 'Easy' ? 'hsl(142 70% 45% / 0.12)' : 
                                       selectedNode.difficulty === 'Medium' ? 'hsl(40 90% 50% / 0.12)' : 
                                       'hsl(0 84% 60% / 0.12)',
                        color: selectedNode.difficulty === 'Easy' ? 'hsl(142 70% 35%)' : 
                               selectedNode.difficulty === 'Medium' ? 'hsl(40 90% 40%)' : 
                               'hsl(0 84% 50%)'
                      }}
                    >
                      {selectedNode.difficulty}
                    </span>
                    <span className="text-sm font-semibold" style={{ color: 'var(--accent-primary)' }}>
                      +{selectedNode.xp} XP
                    </span>
                  </div>
                </div>
                <button
                  onClick={closeDrawer}
                  className="p-2 rounded-full hover:bg-white/10 transition-colors"
                >
                  <X className="w-6 h-6" style={{ color: 'var(--text-secondary)' }} />
                </button>
              </div>

              {/* Description */}
              <div className="mb-6">
                <h3 className="text-sm font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
                  Description
                </h3>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  {selectedNode.description}
                </p>
              </div>

              {/* Skills */}
              <div className="mb-6">
                <h3 className="text-sm font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
                  Skills Covered
                </h3>
                <div className="flex flex-wrap gap-2">
                  {selectedNode.skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-3 py-1 rounded-full text-xs font-medium"
                      style={{
                        backgroundColor: 'var(--accent-light)',
                        color: 'var(--accent-primary)'
                      }}
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Time Estimate */}
              <div className="mb-6 p-3 rounded-lg" style={{ backgroundColor: 'var(--bg-secondary)' }}>
                <div className="flex items-center justify-between">
                  <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                    Estimated Time
                  </span>
                  <span className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
                    {selectedNode.estimatedMinutes} minutes
                  </span>
                </div>
              </div>

              {/* Resources */}
              {selectedNode.resources && selectedNode.resources.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-sm font-bold mb-3" style={{ color: 'var(--text-primary)' }}>
                    Learning Resources
                  </h3>
                  <div className="space-y-2">
                    {selectedNode.resources.map((resource, index) => (
                      <a
                        key={index}
                        href={resource.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block p-3 rounded-lg border transition-all hover:scale-102"
                        style={{
                          backgroundColor: 'var(--bg-secondary)',
                          borderColor: 'var(--border-color)'
                        }}
                      >
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4" style={{ color: 'var(--accent-primary)' }} />
                          <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                            {resource.title}
                          </span>
                        </div>
                        <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                          {resource.type}
                        </span>
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="space-y-3">
                <button
                  className="w-full px-4 py-3 rounded-full font-semibold transition-all hover:scale-105 flex items-center justify-center gap-2"
                  style={{
                    backgroundColor: 'var(--accent-primary)',
                    color: 'var(--bg-primary)'
                  }}
                  onClick={() => {
                    // Placeholder: Open learning resources
                    alert('Opening learning resources...');
                  }}
                >
                  <PlayCircle className="w-5 h-5" />
                  Start Learning
                </button>

                <button
                  className="w-full px-4 py-3 rounded-full font-semibold transition-all hover:scale-105 border flex items-center justify-center gap-2"
                  style={{
                    borderColor: 'var(--border-color)',
                    color: 'var(--text-primary)',
                    backgroundColor: 'var(--bg-secondary)'
                  }}
                  onClick={() => {
                    // Placeholder: Open quiz
                    alert('Quiz feature coming soon!');
                  }}
                >
                  <FileText className="w-5 h-5" />
                  Practice Quiz
                </button>

                {selectedNode.status !== 'completed' && (
                  <button
                    className="w-full px-4 py-3 rounded-full font-semibold transition-all hover:scale-105 border flex items-center justify-center gap-2"
                    style={{
                      borderColor: '#4ADE80',
                      color: '#4ADE80',
                      backgroundColor: 'rgba(74, 222, 128, 0.1)'
                    }}
                    onClick={() => {
                      markNodeComplete(selectedNode.id);
                    }}
                  >
                    <CheckCircle className="w-5 h-5" />
                    Mark as Complete
                  </button>
                )}

                {selectedNode.status === 'completed' && (
                  <div className="w-full px-4 py-3 rounded-full text-center font-semibold"
                    style={{
                      backgroundColor: 'rgba(74, 222, 128, 0.1)',
                      color: '#4ADE80'
                    }}
                  >
                    ✓ Completed
                  </div>
                )}
              </div>
            </FrostedCard>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
