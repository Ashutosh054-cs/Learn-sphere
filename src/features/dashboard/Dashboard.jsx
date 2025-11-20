import StreakCard from './components/StreakCard';
import CompactStreakCard from './components/CompactStreakCard';
import MentorStatusCard from './components/MentorStatusCard';
import QuickLaunchCard from './components/QuickLaunchCard';
import LeaderboardCard from './components/LeaderboardCard';
import FocusSessionCard from './components/FocusSessionCard';
import { mockUser } from '../../data/mockUser';
import { mockLeaderboard } from '../../data/mockLeaderboard';

export default function Dashboard() {
  return (
    <div className="min-h-screen ml-64" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <main className="px-4 py-8 w-full max-w-full overflow-x-hidden" style={{ paddingTop: '3rem' }}>
        <h1 className="text-4xl font-semibold mb-8" style={{ color: 'var(--accent-primary)' }}>
          Welcome back, {mockUser.name}! 👋
        </h1>

        {/* Two separate sections side by side (tighter spacing) */}
        <div className="flex flex-col lg:flex-row gap-4 mb-4 w-full">
          {/* Left Section - Heatmap Card */}
          <div className="flex-1 min-w-0">
            <StreakCard 
              streak={mockUser.streak}
              coins={mockUser.coins}
              gems={mockUser.gems}
            />
          </div>

          {/* Right Section - Leaderboard (independent sizing) */}
          <div className="w-full lg:w-[360px] xl:w-[400px] shrink-0 lg:pl-4">
            <LeaderboardCard 
              userRank={mockUser.rank}
              topPlayers={mockLeaderboard}
            />
          </div>
        </div>

        {/* Four cards in one row (4x1) on desktop, stacked on mobile */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-stretch">
          <div className="w-full h-36 md:h-40 lg:h-48">
            <FocusSessionCard className="w-full h-full" />
          </div>
          <div className="w-full h-36 md:h-40 lg:h-48">
            <QuickLaunchCard className="w-full h-full" />
          </div>
          <div className="w-full h-36 md:h-40 lg:h-48">
            <CompactStreakCard 
              className="w-full h-full"
              streak={mockUser.streak}
              coins={mockUser.coins}
              gems={mockUser.gems}
            />
          </div>
          <div className="w-full h-36 md:h-40 lg:h-48">
            <MentorStatusCard className="w-full h-full" />
          </div>
        </div>
      </main>
    </div>
  );
}
