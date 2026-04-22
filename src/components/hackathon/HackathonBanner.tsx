import { Users, Trophy, Calendar, Clock } from 'lucide-react';
import type { Hackathon } from '../../types';
import Badge from '../ui/Badge';
import CountdownTimer from './CountdownTimer';
import { formatCurrency } from '../../utils/formatCurrency';
import { formatDateRange } from '../../utils/formatDate';

interface HackathonBannerProps {
  hackathon: Hackathon;
}

export default function HackathonBanner({ hackathon }: HackathonBannerProps) {
  const { title, coverImage, startDate, endDate, prizePool, participantCount, tags, status, registrationFee } = hackathon;

  return (
    <div className="relative overflow-hidden rounded-2xl border border-border">
      {/* Background */}
      <div className="absolute inset-0">
        {coverImage ? (
          <img src={coverImage} alt={title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-accent/30 via-bg to-accent-secondary/20" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/80 to-bg/40" />
      </div>

      {/* Content */}
      <div className="relative px-6 sm:px-10 py-10 sm:py-14">
        <div className="flex flex-wrap gap-2 mb-4">
          <Badge variant={status === 'ongoing' ? 'success' : status === 'upcoming' ? 'accent' : 'warning'}>
            {status === 'ongoing' ? '🟢 Live Now' : status === 'upcoming' ? '🚀 Upcoming' : '✅ Completed'}
          </Badge>
          {registrationFee === 0 ? (
            <Badge variant="free">FREE</Badge>
          ) : (
            <Badge variant="warning">{formatCurrency(registrationFee)}</Badge>
          )}
        </div>

        <h1 className="font-display font-bold text-3xl sm:text-4xl lg:text-5xl text-text-primary mb-4 leading-tight max-w-3xl">
          {title}
        </h1>

        {/* Stats row */}
        <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-sm text-text-secondary mb-6">
          <div className="flex items-center gap-1.5">
            <Calendar size={16} />
            <span>{formatDateRange(startDate, endDate)}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Users size={16} />
            <span>{participantCount} participants</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Trophy size={16} className="text-warning" />
            <span>{formatCurrency(prizePool)} prize pool</span>
          </div>
        </div>

        {/* Tags */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {tags.map((tag) => (
              <span
                key={tag}
                className="text-xs px-3 py-1 rounded-lg bg-accent/10 text-accent border border-accent/20"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Countdown */}
        {status === 'upcoming' && (
          <div className="mt-2">
            <div className="flex items-center gap-2 mb-2 text-sm text-text-muted">
              <Clock size={14} />
              <span>Starts in</span>
            </div>
            <CountdownTimer endDate={startDate} />
          </div>
        )}
      </div>
    </div>
  );
}
