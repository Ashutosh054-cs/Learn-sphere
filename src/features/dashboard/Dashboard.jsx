import { useState, useEffect } from 'react'
import StreakCard from './components/StreakCard';
import CompactStreakCard from './components/CompactStreakCard';
import MentorStatusCard from './components/MentorStatusCard';
import QuickLaunchCard from './components/QuickLaunchCard';
import LeaderboardCard from './components/LeaderboardCard';
import FocusSessionCard from './components/FocusSessionCard';
import { useAuthStore } from '../../stores/authStore';
import { userService, focusService, streakService, leaderboardService } from '../../services/supabaseService';

export default function Dashboard() {
  const user = useAuthStore(state => state.user)
  const userName = user?.user_metadata?.name || user?.email?.split('@')[0] || 'Student'
  
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalSessions: 0,
    totalMinutes: 0,
    currentStreak: 0,
    todayMinutes: 0
  })
  const [leaderboard, setLeaderboard] = useState([])
  const [userRank, setUserRank] = useState(null)

  useEffect(() => {
    if (user) {
      loadDashboardData()
    }
  }, [user])

  const loadDashboardData = async () => {
    setLoading(true)
    try {
      // Load user stats (handle if table doesn't exist)
      const statsResult = await userService.getStats(user.id)
      const userStats = statsResult?.data || null
      
      // Load today's focus time
      const todayResult = await focusService.getTodayFocusTime(user.id)
      const todayMinutes = todayResult?.data || 0
      
      // Calculate current streak
      const streakResult = await streakService.calculateStreak(user.id)
      const currentStreak = streakResult?.data || 0
      
      // Load leaderboard
      const leaderboardResult = await leaderboardService.getWeeklyLeaderboard(10)
      const leaderboardData = leaderboardResult?.data || []
      
      // Get user rank
      const rankResult = await leaderboardService.getUserRank(user.id)
      const rank = rankResult?.data || null

      setStats({
        totalSessions: userStats?.total_sessions || 0,
        totalMinutes: userStats?.total_focus_minutes || 0,
        currentStreak: currentStreak || 0,
        todayMinutes: todayMinutes || 0
      })
      
      setLeaderboard(leaderboardData)
      setUserRank(rank)
    } catch (error) {
      console.error('Error loading dashboard data:', error)
      // Set default values on error
      setStats({
        totalSessions: 0,
        totalMinutes: 0,
        currentStreak: 0,
        todayMinutes: 0
      })
      setLeaderboard([])
      setUserRank(null)
    } finally {
      setLoading(false)
    }
  }
  
  if (loading) {
    return (
      <div className="min-h-screen ml-64 flex items-center justify-center">
        <div className="text-xl" style={{ color: 'var(--text-primary)' }}>Loading dashboard...</div>
      </div>
    )
  }
  
  return (
    <div className="min-h-screen ml-64">
      <main className="px-4 py-6 w-full max-w-full overflow-x-hidden" style={{ paddingTop: '2rem' }}>
        <h1 className="text-4xl font-semibold mb-6" style={{ color: 'var(--accent-primary)' }}>
          Welcome back, {userName}! 👋
        </h1>

        {/* Two separate sections side by side (tighter spacing) */}
        <div className="flex flex-col lg:flex-row gap-4 mb-4 w-full">
          {/* Left Section - Heatmap Card */}
          <div className="flex-1 min-w-0">
            <StreakCard 
              streak={stats.currentStreak}
              coins={0}
              gems={0}
              totalMinutes={stats.totalMinutes}
            />
          </div>

          {/* Right Section - Leaderboard (independent sizing) */}
          <div className="w-full lg:w-[360px] xl:w-[400px] shrink-0 lg:pl-4">
            <LeaderboardCard 
              userRank={userRank}
              topPlayers={leaderboard}
              currentUserId={user.id}
            />
          </div>
        </div>

        {/* Four cards in one row (4x1) on desktop, stacked on mobile */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-stretch">
          <div className="w-full h-40 md:h-44 lg:h-52">
            <FocusSessionCard 
              className="w-full h-full"
              todayMinutes={stats.todayMinutes}
              totalSessions={stats.totalSessions}
            />
          </div>
          <div className="w-full h-40 md:h-44 lg:h-52">
            <QuickLaunchCard className="w-full h-full" />
          </div>
          <div className="w-full h-40 md:h-44 lg:h-52">
            <CompactStreakCard 
              className="w-full h-full"
              streak={stats.currentStreak}
              coins={0}
              gems={0}
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
