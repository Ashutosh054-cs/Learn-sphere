import StreakCard from '../components/StreakCard';
import CompactStreakCard from '../components/CompactStreakCard';
import MentorStatusCard from '../components/MentorStatusCard';
import QuickLaunchCard from '../components/QuickLaunchCard';
import LeaderboardCard from '../components/LeaderboardCard';
import FocusSessionCard from '../components/FocusSessionCard';
import { mockUser } from '../data/mockUser';
import { mockLeaderboard } from '../data/mockLeaderboard';

export default function Dashboard() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--bg-secondary)' }}>
      <main className="px-4 py-8 w-full mx-0 md:pl-8 lg:pl-12" style={{ paddingTop: '6rem' }}>
        <h1 className="text-3xl font-semibold mb-8" style={{ color: 'hsl(220, 70%, 40%)' }}>
          Welcome back, {mockUser.name}! 👋
        </h1>

        {/* Two separate sections side by side (tighter spacing) */}
        <div className="flex flex-col lg:flex-row gap-4 mb-4">
          {/* Left Section - Heatmap Card */}
          <div className="flex-1">
            <StreakCard 
              streak={mockUser.streak}
              coins={mockUser.coins}
              gems={mockUser.gems}
            />
          </div>

          {/* Right Section - Leaderboard (independent sizing) */}
          <div className="w-full lg:w-[400px] shrink-0 pl-2 lg:pl-4">
            <LeaderboardCard 
              userRank={mockUser.rank}
              topPlayers={mockLeaderboard}
            />
          </div>
        </div>

        {/* Four cards in one row (4x1) on desktop, stacked on mobile */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-stretch">
          <div className="w-full h-40 md:h-44 lg:h-52">
            <FocusSessionCard className="w-full h-full" />
          </div>
          <div className="w-full h-40 md:h-44 lg:h-52">
            <QuickLaunchCard className="w-full h-full" />
          </div>
          <div className="w-full h-40 md:h-44 lg:h-52">
            <CompactStreakCard 
              className="w-full h-full"
              streak={mockUser.streak}
              coins={mockUser.coins}
              gems={mockUser.gems}
            />
          </div>
          <div className="w-full h-40 md:h-44 lg:h-52">
            <MentorStatusCard className="w-full h-full" />
          </div>
        </div>
      </main>
    </div>
  );
}
