import { Link } from 'react-router-dom';
import { Users, Trophy, Calendar } from 'lucide-react';
import type { Hackathon } from '../../types';
import Badge from '../ui/Badge';
import CountdownTimer from './CountdownTimer';
import { formatCurrency } from '../../utils/formatCurrency';
import { formatDateRange } from '../../utils/formatDate';

interface HackathonCardProps {
  hackathon: Hackathon;
}

const statusColors: Record<Hackathon['status'], { variant: 'success' | 'warning' | 'accent'; label: string }> = {
  upcoming: { variant: 'accent', label: 'Upcoming' },
  ongoing: { variant: 'success', label: 'Live Now' },
  completed: { variant: 'warning', label: 'Completed' },
};

export default function HackathonCard({ hackathon }: HackathonCardProps) {
  const { id, title, coverImage, startDate, endDate, prizePool, participantCount, tags, registrationFee, status } = hackathon;
  const statusInfo = statusColors[status];

  return (
    <Link to={`/hackathon/${id}`} className="block group">
      <div className="card p-0 overflow-hidden hover:border-accent/30">
        {/* Cover Image */}
        <div className="relative h-44 overflow-hidden bg-surface-elevated">
          {coverImage ? (
            <img
              src={coverImage}
              alt={title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-accent/20 via-surface-elevated to-accent-secondary/10 flex items-center justify-center">
              <Trophy size={40} className="text-accent/40" />
            </div>
          )}

          {/* Status badge */}
          <div className="absolute top-3 left-3">
            <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>
          </div>

          {/* Fee badge */}
          <div className="absolute top-3 right-3">
            {registrationFee === 0 ? (
              <Badge variant="free">FREE</Badge>
            ) : (
              <Badge variant="warning">{formatCurrency(registrationFee)}</Badge>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-5">
          <h3 className="font-display font-semibold text-text-primary text-lg leading-tight mb-2 group-hover:text-accent transition-colors line-clamp-1">
            {title}
          </h3>

          {/* Date */}
          <div className="flex items-center gap-1.5 text-sm text-text-muted mb-3">
            <Calendar size={14} />
            <span>{formatDateRange(startDate, endDate)}</span>
          </div>

          {/* Tags */}
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-4">
              {tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="text-xs px-2 py-0.5 rounded-md bg-accent/8 text-accent-secondary border border-accent-secondary/15"
                >
                  {tag}
                </span>
              ))}
              {tags.length > 3 && (
                <span className="text-xs px-2 py-0.5 rounded-md text-text-muted">
                  +{tags.length - 3}
                </span>
              )}
            </div>
          )}

          {/* Bottom stats */}
          <div className="flex items-center justify-between pt-3 border-t border-border">
            <div className="flex items-center gap-1.5 text-sm text-text-secondary">
              <Users size={14} />
              <span>{participantCount} joined</span>
            </div>
            <div className="flex items-center gap-1.5 text-sm text-text-secondary">
              <Trophy size={14} className="text-warning" />
              <span>{formatCurrency(prizePool)}</span>
            </div>
          </div>

          {/* Countdown for upcoming */}
          {status === 'upcoming' && (
            <div className="mt-3 pt-3 border-t border-border">
              <p className="text-xs text-text-muted mb-1.5">Starts in</p>
              <CountdownTimer endDate={startDate} />
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
