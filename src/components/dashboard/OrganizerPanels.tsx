import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Plus, Users, FileText, Trophy, DollarSign, Trash2, Edit, Eye, ExternalLink, Clock } from 'lucide-react';
import { getHackathons } from '../../api/hackathon.api';
import { getSubmissionsByHackathon } from '../../api/submission.api';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import Skeleton from '../ui/Skeleton';
import { formatCurrency } from '../../utils/formatCurrency';
import { formatDate } from '../../utils/formatDate';

/* ── Panel 1: Stats Grid ── */
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
  const totalRevenue = hackathons.reduce((sum, h) => sum + h.registrationFee * h.participantCount, 0);

  const stats = [
    { label: 'Hackathons', value: hackathons.length, icon: Trophy, color: 'text-accent' },
    { label: 'Participants', value: totalParticipants, icon: Users, color: 'text-accent-secondary' },
    { label: 'Revenue', value: formatCurrency(totalRevenue), icon: DollarSign, color: 'text-warning' },
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

/* ── Panel 2: Manage Hackathons (CRUD list) ── */
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

/* ── Panel 3: Submissions Review Table ── */
export function SubmissionsReview() {
  const { data: hackathonData } = useQuery({
    queryKey: ['organizer-hackathons'],
    queryFn: () => getHackathons(),
  });

  // Fetch submissions for the first hackathon as a representative sample
  const firstHackathonId = hackathonData?.hackathons?.[0]?.id;

  const { data: submissions, isLoading } = useQuery({
    queryKey: ['submissions-review', firstHackathonId],
    queryFn: () => getSubmissionsByHackathon(firstHackathonId!),
    enabled: !!firstHackathonId,
  });

  return (
    <div className="card p-6">
      <div className="flex items-center gap-2 mb-6">
        <FileText size={18} className="text-success" />
        <h3 className="font-display font-semibold text-lg text-text-primary">Submissions Review</h3>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-14 w-full rounded-xl" />
          ))}
        </div>
      ) : !submissions?.length ? (
        <div className="text-center py-10">
          <FileText size={40} className="mx-auto text-text-muted mb-3" />
          <p className="text-text-secondary text-sm">No submissions received yet</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-3 text-xs text-text-muted uppercase tracking-wider font-medium">Project</th>
                <th className="text-left py-3 px-3 text-xs text-text-muted uppercase tracking-wider font-medium">Team</th>
                <th className="text-left py-3 px-3 text-xs text-text-muted uppercase tracking-wider font-medium">Submitted</th>
                <th className="text-right py-3 px-3 text-xs text-text-muted uppercase tracking-wider font-medium">Links</th>
              </tr>
            </thead>
            <tbody>
              {submissions.map((sub) => (
                <tr key={sub.id} className="border-b border-border/50 hover:bg-surface-elevated/50 transition-colors">
                  <td className="py-3 px-3">
                    <p className="font-medium text-text-primary">{sub.title}</p>
                    <p className="text-xs text-text-muted line-clamp-1 mt-0.5">{sub.description}</p>
                  </td>
                  <td className="py-3 px-3">
                    <span className="font-mono text-xs text-text-secondary">{sub.teamId.slice(0, 8)}…</span>
                  </td>
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-1 text-text-muted text-xs">
                      <Clock size={12} />
                      {formatDate(sub.createdAt)}
                    </div>
                  </td>
                  <td className="py-3 px-3 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {sub.projectUrl && (
                        <a href={sub.projectUrl} target="_blank" rel="noopener noreferrer" className="p-1.5 text-text-muted hover:text-accent transition-colors rounded-lg hover:bg-accent/10">
                          <ExternalLink size={13} />
                        </a>
                      )}
                      {sub.demoVideoUrl && (
                        <a href={sub.demoVideoUrl} target="_blank" rel="noopener noreferrer" className="p-1.5 text-text-muted hover:text-accent-secondary transition-colors rounded-lg hover:bg-accent-secondary/10">
                          <Eye size={13} />
                        </a>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

/* ── Panel 4: Payments Overview ── */
export function PaymentsOverview() {
  const { data, isLoading } = useQuery({
    queryKey: ['organizer-hackathons'],
    queryFn: () => getHackathons(),
  });

  if (isLoading) {
    return (
      <div className="card p-6">
        <Skeleton className="h-6 w-40 mb-6" />
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-14 w-full rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  const hackathons = data?.hackathons || [];
  const paidHackathons = hackathons.filter((h) => h.registrationFee > 0);

  return (
    <div className="card p-6">
      <div className="flex items-center gap-2 mb-6">
        <DollarSign size={18} className="text-warning" />
        <h3 className="font-display font-semibold text-lg text-text-primary">Payments Overview</h3>
      </div>

      {!paidHackathons.length ? (
        <div className="text-center py-10">
          <DollarSign size={40} className="mx-auto text-text-muted mb-3" />
          <p className="text-text-secondary text-sm">No paid hackathons yet</p>
          <p className="text-text-muted text-xs mt-1">Revenue will appear here when you create paid hackathons</p>
        </div>
      ) : (
        <div className="space-y-3">
          {paidHackathons.map((h) => {
            const revenue = h.registrationFee * h.participantCount;
            return (
              <div key={h.id} className="flex items-center justify-between px-4 py-3 rounded-xl bg-surface-elevated border border-border">
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium text-text-primary truncate">{h.title}</h4>
                  <div className="flex items-center gap-3 mt-1 text-xs text-text-muted">
                    <span>{formatCurrency(h.registrationFee)} × {h.participantCount} participants</span>
                  </div>
                </div>
                <div className="text-right ml-4">
                  <p className="font-mono text-sm font-bold text-success">{formatCurrency(revenue)}</p>
                  <p className="text-xs text-text-muted">total revenue</p>
                </div>
              </div>
            );
          })}

          {/* Total */}
          <div className="flex items-center justify-between px-4 py-3 rounded-xl border border-accent/20 bg-accent/5">
            <span className="text-sm font-medium text-text-primary">Total Revenue</span>
            <span className="font-mono text-lg font-bold text-accent">
              {formatCurrency(paidHackathons.reduce((sum, h) => sum + h.registrationFee * h.participantCount, 0))}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
