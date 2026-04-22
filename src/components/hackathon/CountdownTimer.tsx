import { useState, useEffect } from 'react';
import { getCountdown } from '../../utils/formatDate';

interface CountdownTimerProps {
  endDate: string;
  className?: string;
}

export default function CountdownTimer({ endDate, className = '' }: CountdownTimerProps) {
  const [countdown, setCountdown] = useState(getCountdown(endDate));

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown(getCountdown(endDate));
    }, 1000);
    return () => clearInterval(interval);
  }, [endDate]);

  if (countdown.isExpired) {
    return (
      <span className={`font-mono text-text-muted text-sm ${className}`}>Expired</span>
    );
  }

  const isUrgent = countdown.totalMs < 60 * 60 * 1000; // < 1 hour
  const pad = (n: number) => String(n).padStart(2, '0');

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      {[
        { value: countdown.days, label: 'D' },
        { value: countdown.hours, label: 'H' },
        { value: countdown.minutes, label: 'M' },
        { value: countdown.seconds, label: 'S' },
      ].map(({ value, label }, i) => (
        <div key={label} className="flex items-center">
          {i > 0 && (
            <span className={`font-mono text-sm mx-0.5 ${isUrgent ? 'text-danger animate-pulse' : 'text-text-muted'}`}>
              :
            </span>
          )}
          <div
            className={`flex flex-col items-center px-2 py-1 rounded-lg ${
              isUrgent
                ? 'bg-danger/10 text-danger animate-pulse'
                : 'bg-surface-elevated text-text-primary'
            }`}
          >
            <span className="font-mono text-sm font-bold leading-tight">{pad(value)}</span>
            <span className="text-[10px] text-text-muted uppercase leading-tight">{label}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
