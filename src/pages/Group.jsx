import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { localGroupService } from '../services/localGroupService'
import { Users, Mail, CheckCircle, Settings, ArrowLeft, UserPlus, Timer, BookOpen, Calendar, TrendingUp } from 'lucide-react'

export default function Group() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [data, setData] = useState(null)
  const [inviteEmail, setInviteEmail] = useState('')
  const [ruleKey, setRuleKey] = useState('')
  const [ruleValue, setRuleValue] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)
  const [success, setSuccess] = useState(null)
  const [attendanceHistory, setAttendanceHistory] = useState([])
  const [showCalendar, setShowCalendar] = useState(false)
  const [todayStats, setTodayStats] = useState(null)
  const [groupStats, setGroupStats] = useState([])

  useEffect(() => {
    async function loadGroup() {
      if (!id) return
      setLoading(true)
      const { data, error } = await localGroupService.getGroup(id)
      if (error) setError(error.message || error)
      else setData(data)
      
      // Load attendance history
      const { data: attendance } = await localGroupService.getAttendance(id)
      if (attendance) setAttendanceHistory(attendance)
      
      // Load today's stats
      const { data: stats } = await localGroupService.getTodayStudyTime(id)
      if (stats) setTodayStats(stats)
      
      // Load group stats
      const { data: gStats } = await localGroupService.getGroupStudyStats(id)
      if (gStats) setGroupStats(gStats)
      
      setLoading(false)
    }
    loadGroup()
  }, [id])

  async function load() {
    setLoading(true)
    const { data, error } = await localGroupService.getGroup(id)
    if (error) setError(error.message || error)
    else setData(data)
    
    // Reload attendance history
    const { data: attendance } = await localGroupService.getAttendance(id)
    if (attendance) setAttendanceHistory(attendance)
    
    // Reload today's stats
    const { data: stats } = await localGroupService.getTodayStudyTime(id)
    if (stats) setTodayStats(stats)
    
    // Reload group stats
    const { data: gStats } = await localGroupService.getGroupStudyStats(id)
    if (gStats) setGroupStats(gStats)
    
    setLoading(false)
  }

  async function handleInvite(e) {
    e.preventDefault()
    setError(null)
    setSuccess(null)
    const { error } = await localGroupService.inviteByEmail(id, inviteEmail)
    if (error) return setError(error.message || error)
    setInviteEmail('')
    setSuccess('Invite sent! Share the invite link with the user.')
    load()
  }

  async function handleAttendance() {
    setError(null)
    setSuccess(null)
    const { error } = await localGroupService.markAttendance(id)
    if (error) return setError(error.message || error)
    setSuccess('Attendance marked successfully! ✓')
    load()
  }

  function handleStartStudying() {
    // Start a study session and navigate to focus page
    localGroupService.startStudySession(id, 25)
    navigate('/focus', { state: { groupId: id, returnTo: `/groups/${id}` } })
  }

  function handleTimer() {
    // Navigate directly to focus page with group context
    navigate('/focus', { state: { groupId: id, returnTo: `/groups/${id}` } })
  }

  // Generate calendar data for current month
  function generateCalendar() {
    const now = new Date()
    const year = now.getFullYear()
    const month = now.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()
    
    const calendar = []
    let day = 1
    
    for (let i = 0; i < 6; i++) {
      const week = []
      for (let j = 0; j < 7; j++) {
        if (i === 0 && j < startingDayOfWeek) {
          week.push(null)
        } else if (day > daysInMonth) {
          week.push(null)
        } else {
          const currentDate = new Date(year, month, day)
          const hasAttendance = attendanceHistory.some(a => {
            const attendanceDate = new Date(a.attended_at)
            return attendanceDate.toDateString() === currentDate.toDateString()
          })
          week.push({ day, hasAttendance, date: currentDate })
          day++
        }
      }
      calendar.push(week)
      if (day > daysInMonth) break
    }
    
    return calendar
  }

  async function handleRule(e) {
    e.preventDefault()
    setError(null)
    setSuccess(null)
    const { error } = await localGroupService.upsertRule(id, ruleKey, ruleValue)
    if (error) return setError(error.message || error)
    setRuleKey('')
    setRuleValue('')
    setSuccess('Rule saved!')
    load()
  }

  if (loading) {
    return (
      <div 
        className="min-h-screen ml-64 flex items-center justify-center"
        style={{ backgroundColor: 'var(--bg-secondary)' }}
      >
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4" style={{ borderColor: 'var(--accent-primary)' }}></div>
          <p style={{ color: 'var(--text-secondary)' }}>Loading group...</p>
        </div>
      </div>
    )
  }

  if (!data) {
    return (
      <div 
        className="min-h-screen ml-64 p-8"
        style={{ backgroundColor: 'var(--bg-secondary)' }}
      >
        <p style={{ color: 'var(--feedback-error)' }}>Group not found</p>
      </div>
    )
  }

  const { group } = data

  return (
    <main 
      className="min-h-screen ml-64 p-8"
      style={{ backgroundColor: 'var(--bg-secondary)' }}
    >
      <div className="max-w-5xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate('/groups')}
          className="mb-6 flex items-center gap-2 px-4 py-2 rounded-lg transition-all hover:scale-105"
          style={{
            backgroundColor: 'var(--ui-white)',
            color: 'var(--text-secondary)',
            border: '1px solid var(--border-color)'
          }}
        >
          <ArrowLeft size={18} />
          Back to Groups
        </button>

        {/* Header */}
        <div 
          className="mb-6 p-6 rounded-xl border"
          style={{
            backgroundColor: 'var(--ui-white)',
            borderColor: 'var(--border-color)',
            boxShadow: 'var(--shadow-md)'
          }}
        >
          <div className="flex items-start gap-4">
            <div 
              className="w-16 h-16 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: 'var(--accent-light)' }}
            >
              <Users size={32} style={{ color: 'var(--accent-primary)' }} />
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold mb-1" style={{ color: 'var(--text-primary)' }}>
                {group?.name}
              </h1>
              {group?.description && (
                <p style={{ color: 'var(--text-secondary)' }}>
                  {group.description}
                </p>
              )}
              <p className="text-sm mt-2" style={{ color: 'var(--text-secondary)' }}>
                Created {new Date(group?.created_at).toLocaleDateString()}
              </p>
            </div>
          </div>
          
          {/* Quick Action Buttons */}
          <div className="mt-4 flex gap-3">
            <button
              onClick={handleTimer}
              className="flex-1 px-4 py-3 rounded-lg font-semibold transition-all hover:scale-105 flex items-center justify-center gap-2"
              style={{
                backgroundColor: 'var(--accent-primary)',
                color: 'var(--ui-white)',
                boxShadow: 'var(--shadow-sm)'
              }}
            >
              <Timer size={20} />
              Timer
            </button>
            <button
              onClick={handleStartStudying}
              className="flex-1 px-4 py-3 rounded-lg font-semibold transition-all hover:scale-105 flex items-center justify-center gap-2"
              style={{
                backgroundColor: 'var(--accent-secondary)',
                color: 'var(--ui-white)',
                boxShadow: 'var(--shadow-sm)'
              }}
            >
              <BookOpen size={20} />
              Start Studying
            </button>
          </div>
        </div>

        {/* Alerts */}
        {error && (
          <div 
            className="mb-6 p-4 rounded-lg border"
            style={{ 
              backgroundColor: 'hsla(0, 70%, 50%, 0.1)',
              borderColor: 'var(--feedback-error)',
              color: 'var(--feedback-error)'
            }}
          >
            {String(error)}
          </div>
        )}
        
        {success && (
          <div 
            className="mb-6 p-4 rounded-lg border animate-pulse"
            style={{ 
              backgroundColor: 'hsla(142, 60%, 45%, 0.1)',
              borderColor: 'var(--difficulty-basic)',
              color: 'var(--difficulty-basic)'
            }}
          >
            {success}
          </div>
        )}

        {/* Today's Progress - Enhanced */}
        {todayStats && (
          <div 
            className="mb-6 p-8 rounded-2xl border"
            style={{
              backgroundColor: 'var(--ui-white)',
              borderColor: 'var(--border-color)',
              boxShadow: 'var(--shadow-md)'
            }}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold flex items-center gap-3" style={{ color: 'var(--text-primary)' }}>
                <TrendingUp size={28} />
                Your Progress Today
              </h2>
              <div className="text-right">
                <div className="text-4xl font-bold" style={{ color: 'var(--accent-primary)' }}>
                  {todayStats.totalMinutes} <span className="text-lg">min</span>
                </div>
                <div className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
                  {todayStats.sessions} session{todayStats.sessions !== 1 ? 's' : ''} completed
                </div>
              </div>
            </div>
            
            {/* Enhanced Progress Bar */}
            <div className="relative h-5 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--bg-secondary)' }}>
              <div 
                className="absolute inset-y-0 left-0 rounded-full transition-all duration-700"
                style={{
                  width: `${Math.min((todayStats.totalMinutes / 120) * 100, 100)}%`,
                  background: 'linear-gradient(90deg, var(--accent-primary), var(--accent-secondary))',
                  boxShadow: '0 0 20px var(--accent-primary)'
                }}
              />
            </div>
            <div className="mt-4 flex justify-between items-center text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
              <span>0 min</span>
              <span className="px-3 py-1 rounded-full" style={{ backgroundColor: 'var(--accent-light)', color: 'var(--accent-primary)' }}>
                {Math.round((todayStats.totalMinutes / 120) * 100)}% Complete
              </span>
              <span>Goal: 120 min</span>
            </div>
          </div>
        )}

        {/* Group Leaderboard - Full Width */}
        <section 
          className="mb-6 p-6 rounded-2xl border"
          style={{
            backgroundColor: 'var(--ui-white)',
            borderColor: 'var(--border-color)',
            boxShadow: 'var(--shadow-sm)'
          }}
        >
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-3" style={{ color: 'var(--text-primary)' }}>
            <Users size={28} />
            Group Leaderboard
          </h2>
          <div className="space-y-4">
            {groupStats
              .sort((a, b) => b.todayMinutes - a.todayMinutes)
              .map((stat, index) => (
                <div 
                  key={stat.userId}
                  className="p-5 rounded-xl transition-all hover:scale-[1.02]"
                  style={{ 
                    backgroundColor: 'var(--bg-secondary)',
                    border: index === 0 ? '2px solid var(--accent-primary)' : 'none',
                    boxShadow: index === 0 ? 'var(--shadow-sm)' : 'none'
                  }}
                >
                  <div className="flex items-center gap-4">
                    <div 
                      className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl flex-shrink-0"
                      style={{
                        backgroundColor: index === 0 ? 'var(--accent-primary)' : index === 1 ? 'var(--accent-secondary)' : 'var(--border-color)',
                        color: index < 2 ? 'var(--ui-white)' : 'var(--text-secondary)'
                      }}
                    >
                      {index === 0 ? '🏆' : index + 1}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <span style={{ color: 'var(--text-primary)' }} className="font-bold text-base truncate">
                          {stat.userId.slice(0, 12)}...
                        </span>
                        <span 
                          className="text-xs px-2 py-1 rounded-full flex-shrink-0"
                          style={{
                            backgroundColor: stat.role === 'owner' ? 'var(--accent-light)' : 'var(--border-color)',
                            color: stat.role === 'owner' ? 'var(--accent-primary)' : 'var(--text-secondary)'
                          }}
                        >
                          {stat.role}
                        </span>
                      </div>
                      
                      <div className="relative h-2.5 rounded-full overflow-hidden mb-2" style={{ backgroundColor: 'var(--border-color)' }}>
                        <div 
                          className="absolute inset-y-0 left-0 rounded-full transition-all duration-700"
                          style={{
                            width: `${Math.min((stat.todayMinutes / 120) * 100, 100)}%`,
                            backgroundColor: index === 0 ? 'var(--accent-primary)' : 'var(--accent-secondary)'
                          }}
                        />
                      </div>
                      
                      <div className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>
                        Total: {stat.totalMinutes} min • {stat.totalSessions} sessions
                      </div>
                    </div>
                    
                    <div className="text-right flex-shrink-0">
                      <div className="text-3xl font-bold" style={{ color: 'var(--accent-primary)' }}>
                        {stat.todayMinutes}
                      </div>
                      <div className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>
                        min today
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </section>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Invite Section */}
          <section 
            className="p-6 rounded-xl border"
            style={{
              backgroundColor: 'var(--ui-white)',
              borderColor: 'var(--border-color)',
              boxShadow: 'var(--shadow-sm)'
            }}
          >
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
              <UserPlus size={20} />
              Invite Members
            </h2>
            <form onSubmit={handleInvite} className="space-y-3">
              <input
                required
                type="email"
                placeholder="Email address"
                value={inviteEmail}
                onChange={e => setInviteEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 transition-all"
                style={{
                  backgroundColor: 'var(--bg-secondary)',
                  borderColor: 'var(--border-color)',
                  color: 'var(--text-primary)',
                  '--tw-ring-color': 'var(--accent-primary)'
                }}
              />
              <button
                type="submit"
                className="w-full px-4 py-3 rounded-lg font-semibold transition-all hover:scale-105 flex items-center justify-center gap-2"
                style={{
                  backgroundColor: 'var(--accent-primary)',
                  color: 'var(--ui-white)',
                  boxShadow: 'var(--shadow-sm)'
                }}
              >
                <Mail size={18} />
                Send Invite
              </button>
            </form>
          </section>

          {/* Attendance Section */}
          <section 
            className="p-6 rounded-xl border"
            style={{
              backgroundColor: 'var(--ui-white)',
              borderColor: 'var(--border-color)',
              boxShadow: 'var(--shadow-sm)'
            }}
          >
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
              <CheckCircle size={20} />
              Daily Attendance
            </h2>
            <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>
              Mark your attendance for today to maintain your group streak
            </p>
            <button
              onClick={handleAttendance}
              className="w-full px-4 py-3 rounded-lg font-semibold transition-all hover:scale-105 flex items-center justify-center gap-2 mb-4"
              style={{
                backgroundColor: 'var(--difficulty-basic)',
                color: 'var(--ui-white)',
                boxShadow: 'var(--shadow-sm)'
              }}
            >
              <CheckCircle size={18} />
              Mark Attendance
            </button>
            
            <button
              onClick={() => setShowCalendar(!showCalendar)}
              className="w-full px-4 py-2 rounded-lg font-medium transition-all flex items-center justify-center gap-2"
              style={{
                backgroundColor: 'var(--bg-secondary)',
                color: 'var(--text-primary)',
                border: '1px solid var(--border-color)'
              }}
            >
              <Calendar size={18} />
              {showCalendar ? 'Hide' : 'View'} Calendar
            </button>
            
            {showCalendar && (
              <div className="mt-4">
                <div className="text-center mb-3 font-semibold" style={{ color: 'var(--text-primary)' }}>
                  {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </div>
                <div className="grid grid-cols-7 gap-1">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <div
                      key={day}
                      className="text-center text-xs font-semibold py-2"
                      style={{ color: 'var(--text-secondary)' }}
                    >
                      {day}
                    </div>
                  ))}
                  {generateCalendar().map((week, weekIndex) => (
                    week.map((dayData, dayIndex) => (
                      <div
                        key={`${weekIndex}-${dayIndex}`}
                        className="aspect-square flex items-center justify-center rounded-lg text-sm relative transition-all"
                        style={{
                          backgroundColor: dayData?.hasAttendance 
                            ? 'var(--difficulty-basic)' 
                            : dayData 
                            ? 'var(--bg-secondary)' 
                            : 'transparent',
                          color: dayData?.hasAttendance 
                            ? 'var(--ui-white)' 
                            : dayData 
                            ? 'var(--text-primary)' 
                            : 'transparent',
                          fontWeight: dayData?.hasAttendance ? '600' : '400',
                          border: dayData?.hasAttendance ? '2px solid var(--difficulty-basic)' : 'none'
                        }}
                      >
                        <span className={dayData?.hasAttendance ? 'relative z-10' : ''}>
                          {dayData?.day}
                        </span>
                        {dayData?.hasAttendance && (
                          <CheckCircle 
                            size={14} 
                            className="absolute top-1 right-1"
                            style={{ color: 'var(--ui-white)', opacity: 0.9 }}
                          />
                        )}
                      </div>
                    ))
                  ))}
                </div>
                <div className="mt-3 text-xs text-center" style={{ color: 'var(--text-secondary)' }}>
                  {attendanceHistory.length} day{attendanceHistory.length !== 1 ? 's' : ''} attended
                </div>
              </div>
            )}
          </section>

          {/* Rules Section */}
          <section 
            className="p-6 rounded-xl border"
            style={{
              backgroundColor: 'var(--ui-white)',
              borderColor: 'var(--border-color)',
              boxShadow: 'var(--shadow-sm)'
            }}
          >
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
              <Settings size={20} />
              Group Rules
            </h2>
            <form onSubmit={handleRule} className="space-y-3">
              <input
                required
                placeholder="Rule name (e.g., daily_study_time)"
                value={ruleKey}
                onChange={e => setRuleKey(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 transition-all"
                style={{
                  backgroundColor: 'var(--bg-secondary)',
                  borderColor: 'var(--border-color)',
                  color: 'var(--text-primary)',
                  '--tw-ring-color': 'var(--accent-primary)'
                }}
              />
              <input
                required
                placeholder="Rule value (e.g., 2 hours)"
                value={ruleValue}
                onChange={e => setRuleValue(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 transition-all"
                style={{
                  backgroundColor: 'var(--bg-secondary)',
                  borderColor: 'var(--border-color)',
                  color: 'var(--text-primary)',
                  '--tw-ring-color': 'var(--accent-primary)'
                }}
              />
              <button
                type="submit"
                className="w-full px-4 py-3 rounded-lg font-semibold transition-all hover:scale-105 flex items-center justify-center gap-2"
                style={{
                  backgroundColor: 'var(--accent-secondary)',
                  color: 'var(--ui-white)',
                  boxShadow: 'var(--shadow-sm)'
                }}
              >
                <Settings size={18} />
                Save Rule
              </button>
            </form>
          </section>
        </div>
      </div>
    </main>
  )
}
