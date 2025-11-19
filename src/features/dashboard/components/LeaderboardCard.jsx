import FrostedCard from '../../../components/ui/FrostedCard';
import { Trophy } from 'lucide-react';

export default function LeaderboardCard({ userRank, topPlayers }) {
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
          #{userRank}
        </p>
      </div>

      {/* Top Players */}
      <div className="space-y-1.5 max-h-56 overflow-y-auto leaderboard-scroll">
        {topPlayers.map((player) => (
          <div 
            key={player.rank}
            className="flex items-center justify-between p-2 rounded-lg border"
            style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}
          >
            <div className="flex items-center gap-2">
              <span className="text-base">{player.avatar}</span>
              <div>
                <p className="text-xs font-medium" style={{ color: 'var(--text-primary)' }}>
                  {player.name}
                </p>
                <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                  {player.score.toLocaleString()} pts
                </p>
              </div>
            </div>
            <span className="text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>
              #{player.rank}
            </span>
          </div>
        ))}
      </div>
    </FrostedCard>
  );
}
