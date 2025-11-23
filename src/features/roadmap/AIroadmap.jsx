import { Brain } from 'lucide-react';
import { useEffect } from 'react';
import SkillOverview from './components/SkillOverview';
import CareerSelector from './components/CareerSelector';
import RoadmapGraph from './components/RoadmapGraph';
import NodeDrawer from './components/NodeDrawer';
import NextSteps from './components/NextSteps';
import WeeklyGoals from './components/WeeklyGoals';
import MentorPanel from './components/MentorPanel';
import BadgesPanel from './components/BadgesPanel';
import useRoadmapStore from '../../stores/roadmapStore';

export default function AIroadmap() {
  const { isDrawerOpen, isMentorPanelOpen } = useRoadmapStore();

  useEffect(() => {
    // Ensure page starts at top when navigating to the AI Roadmap
    // This prevents the router from restoring a scroll position that lands mid-page.
    try {
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    } catch (e) {
      // ignore in non-browser environments
    }
  }, []);

  return (
    <div className="ml-64 min-h-screen" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <main className="px-4 py-6 w-full max-w-full overflow-x-hidden">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-3">
            <Brain 
              className="w-10 h-10" 
              strokeWidth={1.5} 
              style={{ color: 'var(--accent-primary)' }}
            />
            <h1 className="text-4xl font-bold" style={{ color: 'var(--text-primary)', marginBottom: '0' }}>
              AI Roadmap
            </h1>
           
          </div>
           <p className="text-base" style={{ color: 'var(--text-secondary)' }}>
              Personalized Learning Path Powered by AI
            </p>
        </div>

        {/* Skills Overview */}
        <SkillOverview />

        {/* Career Selector */}
        <CareerSelector />

        {/* Main Layout: Graph + Mentor Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6">
          {/* Main Area: Roadmap Graph + Next Steps */}
          <div className={`${isMentorPanelOpen ? 'lg:col-span-8' : 'lg:col-span-12'} space-y-6`}>
            {/* Roadmap Graph */}
            <div id="roadmap-graph">
              <RoadmapGraph />
            </div>
            
            {/* Next Steps */}
            <NextSteps />
          </div>

          {/* Mentor Panel (Sticky) */}
          {isMentorPanelOpen && (
            <div className="lg:col-span-4">
              <div className="lg:sticky lg:top-6">
                <MentorPanel />
              </div>
            </div>
          )}
        </div>

        {/* Bottom Row: Weekly Goals + Badges */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <WeeklyGoals />
          <BadgesPanel />
        </div>

        {/* Node Drawer (Slide-in) */}
        {isDrawerOpen && <NodeDrawer />}
      </main>
    </div>
  );
}
