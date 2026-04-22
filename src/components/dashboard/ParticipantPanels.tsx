import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Trophy, Users, FileText, CreditCard, Calendar, ArrowRight } from 'lucide-react';
import { getHackathons } from '../../api/hackathon.api';
import Badge from '../ui/Badge';
import Skeleton from '../ui/Skeleton';
import { formatDate } from '../../utils/formatDate';

export function RegisteredHackathons() {
  const { data, isLoading } = useQuery({
    queryKey: ['participant-hackathons'],
    queryFn: () => getHackathons(),
  });

  return (
    <div className="card p-6">
      <div className="flex items-center gap-2 mb-6">
        <Trophy size={18} className="text-accent" />
        <h3 className="font-display font-semibold text-lg text-text-primary">My Hackathons</h3>
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
          <p className="text-text-secondary text-sm mb-4">You haven't joined any hackathons yet</p>
          <Link to="/explore" className="text-accent text-sm hover:underline">
            Explore hackathons →
          </Link>
        </div>
      ) : (
        <div className="space-y-2">
          {data.hackathons.slice(0, 5).map((h) => (
            <Link
              key={h.id}
              to={`/hackathon/${h.id}`}
              className="flex items-center justify-between px-4 py-3 rounded-xl bg-surface-elevated border border-border hover:border-accent/20 transition-all group"
            >
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium text-text-primary truncate group-hover:text-accent transition-colors">
                  {h.title}
                </h4>
                <div className="flex items-center gap-2 mt-1 text-xs text-text-muted">
                  <Calendar size={12} />
                  <span>{formatDate(h.startDate)}</span>
                </div>
              </div>
              <div className="flex items-center gap-2 ml-4">
                <Badge variant={h.status === 'ongoing' ? 'success' : h.status === 'upcoming' ? 'accent' : 'warning'}>
                  {h.status}
                </Badge>
                <ArrowRight size={14} className="text-text-muted group-hover:text-accent transition-colors" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export function DashboardQuickActions() {
  const actions = [
    { label: 'My Teams', icon: Users, to: '/teams', color: 'text-accent-secondary' },
    { label: 'Submissions', icon: FileText, to: '/submissions', color: 'text-success' },
    { label: 'Payments', icon: CreditCard, to: '/dashboard', color: 'text-warning' },
    { label: 'Explore', icon: Trophy, to: '/explore', color: 'text-accent' },
  ];

  return (
    <div className="grid grid-cols-2 gap-3">
      {actions.map(({ label, icon: Icon, to, color }) => (
        <Link
          key={label}
          to={to}
          className="card p-4 flex items-center gap-3 hover:border-accent/20 group"
        >
          <div className={`w-9 h-9 rounded-lg bg-surface-elevated flex items-center justify-center ${color}`}>
            <Icon size={18} />
          </div>
          <span className="text-sm font-medium text-text-secondary group-hover:text-text-primary transition-colors">
            {label}
          </span>
        </Link>
      ))}
    </div>
  );
}
