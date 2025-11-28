import FrostedCard from '../../../components/ui/FrostedCard';
import { Trophy } from 'lucide-react';

export default function LeaderboardCard({ userRank, topPlayers, currentUserId }) {
  return (
    <FrostedCard className="h-full">
      <div className="flex items-center gap-1.5 sm:gap-2 mb-2 sm:mb-3">
        <Trophy size={14} className="sm:w-4 sm:h-4 md:w-[18px] md:h-[18px]" strokeWidth={1.5} style={{ color: 'var(--accent-primary)' }} />
        <h3 className="text-sm sm:text-base font-bold" style={{ color: 'var(--text-primary)' }}>
          Weekly Ranking
        </h3>
      </div>

      {/* User's Rank - responsive padding and text */}
      <div 
        className="mb-2 sm:mb-3 p-2 sm:p-2.5 rounded-lg sm:rounded-xl"
        style={{ backgroundColor: 'var(--accent-light)' }}
      >
        <p className="text-[0.65rem] sm:text-xs" style={{ color: 'var(--text-secondary)' }}>
          Your Rank
        </p>
        <p className="text-lg sm:text-xl font-bold" style={{ color: 'var(--accent-primary)' }}>
          {userRank ? `#${userRank}` : 'Unranked'}
        </p>
      </div>

      {/* Top Players - responsive spacing and text */}
      <div className="space-y-1 sm:space-y-1.5 max-h-48 sm:max-h-56 overflow-y-auto leaderboard-scroll">
        {topPlayers.length === 0 ? (
          <div className="text-center py-6 sm:py-8">
            <p className="text-xs sm:text-sm" style={{ color: 'var(--text-secondary)' }}>
              No data yet. Complete focus sessions to appear on the leaderboard! 🚀
            </p>
          </div>
        ) : (
          topPlayers.map((player) => {
            const isCurrentUser = player.id === currentUserId
            return (
              <div 
                key={player.id}
                className="flex items-center justify-between p-1.5 sm:p-2 rounded-lg border"
                style={{ 
                  backgroundColor: isCurrentUser ? 'var(--accent-light)' : 'var(--bg-secondary)', 
                  borderColor: isCurrentUser ? 'var(--accent-primary)' : 'var(--border-color)',
                  borderWidth: isCurrentUser ? '2px' : '1px'
                }}
              >
                <div className="flex items-center gap-1.5 sm:gap-2">
                  {player.avatar_url ? (
                    <img 
                      src={player.avatar_url} 
                      alt={player.name} 
                      className="w-5 h-5 sm:w-6 sm:h-6 rounded-full object-cover shrink-0"
                    />
                  ) : (
                    <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center text-[0.6rem] sm:text-xs font-bold shrink-0" style={{ backgroundColor: 'var(--accent-primary)', color: 'white' }}>
                      {player.name?.charAt(0).toUpperCase() || '?'}
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="text-[0.65rem] sm:text-xs font-medium truncate" style={{ color: 'var(--text-primary)' }}>
                      {player.name || 'Anonymous'} {isCurrentUser && '(You)'}
                    </p>
                    <p className="text-[0.6rem] sm:text-xs truncate" style={{ color: 'var(--text-secondary)' }}>
                      {player.weekly_minutes} min · {player.weekly_sessions} sessions
                    </p>
                  </div>
                </div>
                <span className="text-[0.65rem] sm:text-xs font-semibold shrink-0" style={{ color: 'var(--text-secondary)' }}>
                  #{player.rank}
                </span>
              </div>
            )
          })
        )}
      </div>
    </FrostedCard>
  );
}
