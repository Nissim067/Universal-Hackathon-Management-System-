import { Users } from 'lucide-react';
import type { Team } from '../../types';

interface TeamCardProps {
  team: Team;
  onClick?: () => void;
}

export default function TeamCard({ team, onClick }: TeamCardProps) {
  return (
    <div
      className="card p-5 cursor-pointer hover:border-accent/30"
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onClick?.()}
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="font-display font-semibold text-text-primary text-lg">{team.name}</h3>
          <p className="text-sm text-text-muted mt-0.5">
            Created {new Date(team.createdAt).toLocaleDateString()}
          </p>
        </div>
        <div className="flex items-center gap-1.5 text-sm text-text-secondary bg-surface-elevated px-2.5 py-1 rounded-lg">
          <Users size={14} />
          <span>{team.members.length}</span>
        </div>
      </div>

      {/* Member avatars */}
      <div className="flex -space-x-2">
        {team.members.slice(0, 5).map((member) => (
          <div
            key={member.id}
            className="w-8 h-8 rounded-full bg-accent/20 border-2 border-surface flex items-center justify-center text-xs font-bold text-accent"
            title={member.name}
          >
            {member.name.charAt(0).toUpperCase()}
          </div>
        ))}
        {team.members.length > 5 && (
          <div className="w-8 h-8 rounded-full bg-surface-elevated border-2 border-surface flex items-center justify-center text-xs font-medium text-text-muted">
            +{team.members.length - 5}
          </div>
        )}
      </div>
    </div>
  );
}
