import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Trophy, Users, FileText, CreditCard, Calendar, ArrowRight, Clock, ExternalLink } from 'lucide-react';
import { getHackathons } from '../../api/hackathon.api';
import Badge from '../ui/Badge';
import Skeleton from '../ui/Skeleton';
import { formatDate } from '../../utils/formatDate';

/* ── Panel 1: Registered Hackathons ── */
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

/* ── Panel 2: My Teams ── */
export function MyTeams() {
  // TODO: Backend - need endpoint for listing current user's teams
  // For now, showing a placeholder panel that links to team pages

  return (
    <div className="card p-6">
      <div className="flex items-center gap-2 mb-6">
        <Users size={18} className="text-accent-secondary" />
        <h3 className="font-display font-semibold text-lg text-text-primary">My Teams</h3>
      </div>

      <div className="text-center py-8">
        <div className="w-14 h-14 mx-auto mb-3 rounded-xl bg-accent-secondary/10 flex items-center justify-center">
          <Users size={24} className="text-accent-secondary" />
        </div>
        <p className="text-text-secondary text-sm mb-1">Your teams will appear here</p>
        <p className="text-text-muted text-xs">Join a hackathon and create or join a team to get started</p>
      </div>
    </div>
  );
}

/* ── Panel 3: My Submissions ── */
export function MySubmissions() {
  // TODO: Backend - need endpoint for listing current user's submissions
  // For now, showing a placeholder with link to submit

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <FileText size={18} className="text-success" />
          <h3 className="font-display font-semibold text-lg text-text-primary">My Submissions</h3>
        </div>
        <Link to="/submit">
          <button className="text-xs text-accent hover:underline font-medium">+ Submit</button>
        </Link>
      </div>

      <div className="text-center py-8">
        <div className="w-14 h-14 mx-auto mb-3 rounded-xl bg-success/10 flex items-center justify-center">
          <FileText size={24} className="text-success" />
        </div>
        <p className="text-text-secondary text-sm mb-1">No submissions yet</p>
        <p className="text-text-muted text-xs mb-4">Submit your project when you're ready</p>
        <Link to="/submit" className="text-accent text-sm hover:underline">
          Submit a project →
        </Link>
      </div>
    </div>
  );
}

/* ── Panel 4: Payment History ── */
export function PaymentHistory() {
  // Uses hackathon data to show paid registrations
  const { data, isLoading } = useQuery({
    queryKey: ['participant-hackathons'],
    queryFn: () => getHackathons(),
  });

  const paidHackathons = data?.hackathons.filter((h) => h.registrationFee > 0) || [];

  return (
    <div className="card p-6">
      <div className="flex items-center gap-2 mb-6">
        <CreditCard size={18} className="text-warning" />
        <h3 className="font-display font-semibold text-lg text-text-primary">Payment History</h3>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 2 }).map((_, i) => (
            <Skeleton key={i} className="h-14 w-full rounded-xl" />
          ))}
        </div>
      ) : !paidHackathons.length ? (
        <div className="text-center py-8">
          <div className="w-14 h-14 mx-auto mb-3 rounded-xl bg-warning/10 flex items-center justify-center">
            <CreditCard size={24} className="text-warning" />
          </div>
          <p className="text-text-secondary text-sm mb-1">No payments made</p>
          <p className="text-text-muted text-xs">Payment records will appear here after registration</p>
        </div>
      ) : (
        <div className="space-y-2">
          {paidHackathons.map((h) => (
            <div key={h.id} className="flex items-center justify-between px-4 py-3 rounded-xl bg-surface-elevated border border-border">
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium text-text-primary truncate">{h.title}</h4>
                <div className="flex items-center gap-1 mt-1 text-xs text-text-muted">
                  <Clock size={12} />
                  <span>{formatDate(h.startDate)}</span>
                </div>
              </div>
              <div className="flex items-center gap-3 ml-4">
                <span className="font-mono text-sm font-bold text-text-primary">₹{h.registrationFee}</span>
                <Badge variant="success">Paid</Badge>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
