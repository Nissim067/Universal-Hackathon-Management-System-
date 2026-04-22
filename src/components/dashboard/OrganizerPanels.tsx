import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Plus, Users, FileText, Trophy, DollarSign, Trash2, Edit, Eye } from 'lucide-react';
import { getHackathons } from '../../api/hackathon.api';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import Skeleton from '../ui/Skeleton';
import { formatCurrency } from '../../utils/formatCurrency';
import { formatDate } from '../../utils/formatDate';

export function OrganizerStats() {
  const { data, isLoading } = useQuery({
    queryKey: ['organizer-hackathons'],
    queryFn: () => getHackathons(),
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="card p-5">
            <Skeleton className="h-4 w-20 mb-2" />
            <Skeleton className="h-8 w-16" />
          </div>
        ))}
      </div>
    );
  }

  const hackathons = data?.hackathons || [];
  const totalParticipants = hackathons.reduce((sum, h) => sum + h.participantCount, 0);
  const totalPrize = hackathons.reduce((sum, h) => sum + h.prizePool, 0);

  const stats = [
    { label: 'Hackathons', value: hackathons.length, icon: Trophy, color: 'text-accent' },
    { label: 'Participants', value: totalParticipants, icon: Users, color: 'text-accent-secondary' },
    { label: 'Prize Pool', value: formatCurrency(totalPrize), icon: DollarSign, color: 'text-warning' },
    { label: 'Submissions', value: '—', icon: FileText, color: 'text-success' },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map(({ label, value, icon: Icon, color }) => (
        <div key={label} className="card p-5 hover:border-accent/20">
          <div className="flex items-center gap-2 mb-2">
            <Icon size={16} className={color} />
            <span className="text-xs text-text-muted uppercase tracking-wider">{label}</span>
          </div>
          <p className="font-display text-2xl font-bold text-text-primary">{value}</p>
        </div>
      ))}
    </div>
  );
}

export function ManageHackathons() {
  const { data, isLoading } = useQuery({
    queryKey: ['organizer-hackathons'],
    queryFn: () => getHackathons(),
  });

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-display font-semibold text-lg text-text-primary">Your Hackathons</h3>
        <Link to="/create">
          <Button size="sm">
            <Plus size={14} />
            New
          </Button>
        </Link>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full rounded-xl" />
          ))}
        </div>
      ) : !data?.hackathons.length ? (
        <div className="text-center py-10">
          <Trophy size={40} className="mx-auto text-text-muted mb-3" />
          <p className="text-text-secondary text-sm mb-4">No hackathons yet</p>
          <Link to="/create">
            <Button size="sm">Create Your First Hackathon</Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-2">
          {data.hackathons.map((h) => (
            <div
              key={h.id}
              className="flex items-center justify-between px-4 py-3 rounded-xl bg-surface-elevated border border-border hover:border-accent/20 transition-colors"
            >
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium text-text-primary truncate">{h.title}</h4>
                <div className="flex items-center gap-3 mt-1 text-xs text-text-muted">
                  <span>{formatDate(h.startDate)}</span>
                  <span>·</span>
                  <span>{h.participantCount} participants</span>
                </div>
              </div>
              <div className="flex items-center gap-2 ml-4">
                <Badge variant={h.status === 'ongoing' ? 'success' : h.status === 'upcoming' ? 'accent' : 'warning'}>
                  {h.status}
                </Badge>
                <Link to={`/hackathon/${h.id}`} className="p-1.5 text-text-muted hover:text-accent transition-colors rounded-lg hover:bg-accent/10">
                  <Eye size={14} />
                </Link>
                <button className="p-1.5 text-text-muted hover:text-accent-secondary transition-colors rounded-lg hover:bg-accent-secondary/10">
                  <Edit size={14} />
                </button>
                <button className="p-1.5 text-text-muted hover:text-danger transition-colors rounded-lg hover:bg-danger/10">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
