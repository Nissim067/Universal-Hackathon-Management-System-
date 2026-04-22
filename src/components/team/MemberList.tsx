import type { User } from '../../types';
import { Crown, MoreHorizontal } from 'lucide-react';

interface MemberListProps {
  members: User[];
  leaderId: string;
}

export default function MemberList({ members, leaderId }: MemberListProps) {
  return (
    <div className="space-y-2">
      {members.map((member) => (
        <div
          key={member.id}
          className="flex items-center justify-between px-4 py-3 rounded-xl bg-surface-elevated border border-border hover:border-accent/20 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-accent/15 flex items-center justify-center text-sm font-bold text-accent">
              {member.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-text-primary">{member.name}</span>
                {member.id === leaderId && (
                  <span className="flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded bg-warning/10 text-warning border border-warning/20">
                    <Crown size={10} />
                    Lead
                  </span>
                )}
              </div>
              <p className="text-xs text-text-muted">{member.email}</p>
            </div>
          </div>
          <button className="text-text-muted hover:text-text-primary p-1 rounded transition-colors">
            <MoreHorizontal size={16} />
          </button>
        </div>
      ))}
    </div>
  );
}
