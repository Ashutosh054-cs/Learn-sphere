import FrostedCard from '../../../components/ui/FrostedCard';
import { Trophy } from 'lucide-react';

export default function LeaderboardCard({ userRank, topPlayers, currentUserId }) {
  return (
    <FrostedCard className="h-full">
      <div className="flex items-center gap-2 mb-3">
        <Trophy size={18} strokeWidth={1.5} style={{ color: 'var(--accent-primary)' }} />
        <h3 className="text-base font-bold" style={{ color: 'var(--text-primary)' }}>
          Weekly Ranking
        </h3>
      </div>

      {/* User's Rank */}
      <div 
        className="mb-3 p-2.5 rounded-xl"
        style={{ backgroundColor: 'var(--accent-light)' }}
      >
        <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
          Your Rank
        </p>
        <p className="text-xl font-bold" style={{ color: 'var(--accent-primary)' }}>
          {userRank ? `#${userRank}` : 'Unranked'}
        </p>
      </div>

      {/* Top Players */}
      <div className="space-y-1.5 max-h-56 overflow-y-auto leaderboard-scroll">
        {topPlayers.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              No data yet. Complete focus sessions to appear on the leaderboard! 🚀
            </p>
          </div>
        ) : (
          topPlayers.map((player) => {
            const isCurrentUser = player.id === currentUserId
            return (
              <div 
                key={player.id}
                className="flex items-center justify-between p-2 rounded-lg border"
                style={{ 
                  backgroundColor: isCurrentUser ? 'var(--accent-light)' : 'var(--bg-secondary)', 
                  borderColor: isCurrentUser ? 'var(--accent-primary)' : 'var(--border-color)',
                  borderWidth: isCurrentUser ? '2px' : '1px'
                }}
              >
                <div className="flex items-center gap-2">
                  {player.avatar_url ? (
                    <img 
                      src={player.avatar_url} 
                      alt={player.name} 
                      className="w-6 h-6 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold" style={{ backgroundColor: 'var(--accent-primary)', color: 'white' }}>
                      {player.name?.charAt(0).toUpperCase() || '?'}
                    </div>
                  )}
                  <div>
                    <p className="text-xs font-medium" style={{ color: 'var(--text-primary)' }}>
                      {player.name || 'Anonymous'} {isCurrentUser && '(You)'}
                    </p>
                    <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                      {player.weekly_minutes} min · {player.weekly_sessions} sessions
                    </p>
                  </div>
                </div>
                <span className="text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>
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
