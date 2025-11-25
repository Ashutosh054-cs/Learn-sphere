import { useState, useEffect, useCallback } from 'react'
import StreakCard from './components/StreakCard';
import CompactStreakCard from './components/CompactStreakCard';
import MentorStatusCard from './components/MentorStatusCard';
import QuickLaunchCard from './components/QuickLaunchCard';
import LeaderboardCard from './components/LeaderboardCard';
import FocusSessionCard from './components/FocusSessionCard';
import { useAuthStore } from '../../stores/authStore';
import { userService, focusService, streakService, leaderboardService } from '../../services/supabaseService';
import timerManager from '../../services/timerManager'
import { useToast } from '../../components/ui/ToastProvider'

export default function Dashboard() {
  const user = useAuthStore(state => state.user)
  const userName = user?.user_metadata?.name || user?.email?.split('@')[0] || 'Student'
  const toast = useToast()
  
  const [stats, setStats] = useState({
    totalSessions: 0,
    totalMinutes: 0,
    currentStreak: 0,
    todayMinutes: 0,
    currentPeriod: new Date().getHours() < 12 ? 'morning' : 'evening'
  })
  const [leaderboard, setLeaderboard] = useState([])
  const [userRank, setUserRank] = useState(null)
  const [isLoadingData, setIsLoadingData] = useState(false)

  const loadDashboardData = useCallback(async () => {
    // Prevent multiple simultaneous loads
    if (isLoadingData) return
    
    setIsLoadingData(true)
    // Show subtle loading toast
    const toastId = toast.show('Refreshing dashboard...', { appearance: 'info', duration: 0 })
    
    try {
      // helper to handle DB errors returned from services
      const handleDbError = (err) => {
        console.error('Supabase error detected:', err)
        toast.dismiss(toastId)
        const code = err?.code || err?.status || err?.statusCode
        const msg = (err?.message || err?.details || JSON.stringify(err)).toString()

        // PostgREST: no rows found when using .single() -> PGRST116
        if (code === 'PGRST116' || msg.includes('Cannot coerce the result to a single JSON object') || msg.includes('0 rows')) {
          toast.show('No profile/row found for this user. Create a profile or run `CREATE_USER_PROFILE.sql` (see README).', { appearance: 'error', duration: 8000 })
          return
        }

        // Detect 406 / Not Acceptable (RLS / permission issue)
        if (String(code) === '406' || msg.toLowerCase().includes('not acceptable') || msg.includes('406')) {
          toast.show('Database permission issue (406). Run `FIX_RLS_POLICIES.sql` and ensure your profile exists.', { appearance: 'error', duration: 8000 })
          return
        }

        // Generic fallback
        toast.show('Failed to load some data (see console).', { appearance: 'error', duration: 4000 })
      }

      // Load user stats (handle if table or permissions missing)
      const statsResult = await userService.getStats(user.id)
      if (statsResult?.error) return handleDbError(statsResult.error)
      const userStats = statsResult?.data || null

      // Load current 12-hour period focus time
      const periodResult = await focusService.getTwelveHourFocusTime(user.id)
      if (periodResult?.error) return handleDbError(periodResult.error)
      const todayMinutes = periodResult?.data || 0
      const currentPeriod = periodResult?.period || 'morning'

      // Calculate current streak
      const streakResult = await streakService.calculateStreak(user.id)
      if (streakResult?.error) return handleDbError(streakResult.error)
      const currentStreak = streakResult?.data || 0

      // Load leaderboard
      const leaderboardResult = await leaderboardService.getWeeklyLeaderboard(10)
      if (leaderboardResult?.error) return handleDbError(leaderboardResult.error)
      const leaderboardData = leaderboardResult?.data || []

      // Get user rank
      const rankResult = await leaderboardService.getUserRank(user.id)
      if (rankResult?.error) return handleDbError(rankResult.error)
      const rank = rankResult?.data || null

      setStats({
        totalSessions: userStats?.total_sessions || 0,
        totalMinutes: userStats?.total_focus_minutes || 0,
        currentStreak: currentStreak || 0,
        todayMinutes: todayMinutes || 0,
        currentPeriod: currentPeriod
      })

      setLeaderboard(leaderboardData)
      setUserRank(rank)

      // Dismiss loading toast and show success
      toast.dismiss(toastId)
      toast.show('Dashboard updated!', { appearance: 'success', duration: 2000 })
    } catch (error) {
      console.error('Error loading dashboard data:', error)
      // Set default values on error
      setStats({
        totalSessions: 0,
        totalMinutes: 0,
        currentStreak: 0,
        todayMinutes: 0,
        currentPeriod: new Date().getHours() < 12 ? 'morning' : 'evening'
      })
      setLeaderboard([])
      setUserRank(null)
      
      // Dismiss loading toast and show error
      toast.dismiss(toastId)
      toast.show('Failed to load some data', { appearance: 'error', duration: 3000 })
    } finally {
      setIsLoadingData(false)
    }
  }, [user, toast, isLoadingData])

  useEffect(() => {
    if (user && !isLoadingData) {
      // Use setTimeout to defer data loading and avoid cascading render
      const timer = setTimeout(() => loadDashboardData(), 100)
      return () => clearTimeout(timer)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]) // Only run when user changes, not when loadDashboardData changes

  // subscribe to timer updates so dashboard reflects running session in real-time
  useEffect(() => {
    let baseToday = null
    let unsub = null
    const applyTimer = (s) => {
      // if we have loaded base today minutes, add elapsed from running timer
      if (baseToday === null) return
      const remainingSeconds = s.minutes * 60 + s.seconds
      const elapsedSeconds = (s.originalDuration * 60) - remainingSeconds
      const elapsedMinutes = Math.floor(Math.max(0, elapsedSeconds) / 60)
      setStats((prev) => ({ ...prev, todayMinutes: (baseToday || 0) + elapsedMinutes }))
    }

    if (user) {
      // load base 12-hour period value once and then subscribe
      (async () => {
        try {
          const periodResult = await focusService.getTwelveHourFocusTime(user.id)
          baseToday = periodResult?.data || 0
          const currentPeriod = periodResult?.period || 'morning'
          setStats((prev) => ({ ...prev, todayMinutes: baseToday, currentPeriod }))
        } catch {
          baseToday = 0
        }
        unsub = timerManager.subscribe(applyTimer)
      })()
    }

    return () => { if (unsub) unsub() }
  }, [user])
  
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
              currentPeriod={stats.currentPeriod}
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
