import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowRight, Zap, Globe, Users, Trophy, Shield, Sparkles } from 'lucide-react';
import Button from '../components/ui/Button';
import HackathonCard from '../components/hackathon/HackathonCard';
import { HackathonCardSkeleton } from '../components/ui/Skeleton';
import { getHackathons } from '../api/hackathon.api';

const features = [
  {
    icon: Globe,
    title: 'Global Reach',
    description: 'Host and join hackathons from anywhere in the world. No boundaries.',
    color: 'text-accent-secondary',
  },
  {
    icon: Users,
    title: 'Team Formation',
    description: 'Find your dream team with smart matching and invite-based collaboration.',
    color: 'text-accent',
  },
  {
    icon: Trophy,
    title: 'Prize Management',
    description: 'Transparent prize pools, automated payouts, and live leaderboards.',
    color: 'text-warning',
  },
  {
    icon: Shield,
    title: 'Secure Payments',
    description: 'Stripe-powered payments with full encryption and instant confirmations.',
    color: 'text-success',
  },
];

export default function Home() {
  const { data, isLoading } = useQuery({
    queryKey: ['featured-hackathons'],
    queryFn: () => getHackathons({ status: 'upcoming', limit: 3 }),
  });

  return (
    <div className="relative">
      {/* ─── Hero ─── */}
      <section className="relative overflow-hidden">
        {/* Ambient glow */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-accent/8 rounded-full blur-[160px]" />
          <div className="absolute top-40 right-0 w-[400px] h-[400px] bg-accent-secondary/5 rounded-full blur-[120px]" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24 sm:pt-28 sm:pb-32">
          <div className="text-center max-w-3xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/10 border border-accent/20 text-accent text-sm font-medium mb-8 animate-fade-in">
              <Sparkles size={14} />
              The future of hackathons is here
            </div>

            {/* Headline */}
            <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold text-text-primary leading-[1.1] mb-6 animate-slide-up">
              Build, Compete,{' '}
              <span className="bg-gradient-to-r from-accent via-accent-secondary to-accent bg-clip-text text-transparent">
                Innovate
              </span>
            </h1>

            {/* Subheadline */}
            <p className="text-lg sm:text-xl text-text-secondary max-w-2xl mx-auto mb-10 animate-slide-up" style={{ animationDelay: '100ms' }}>
              The universal platform for organizing, hosting, and participating in hackathons. 
              From idea to demo day — we've got you covered.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center justify-center gap-4 animate-slide-up" style={{ animationDelay: '200ms' }}>
              <Link to="/explore">
                <Button size="lg">
                  Explore Hackathons
                  <ArrowRight size={18} />
                </Button>
              </Link>
              <Link to="/create">
                <Button variant="secondary" size="lg">
                  <Zap size={18} />
                  Host a Hackathon
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="flex items-center justify-center gap-8 sm:gap-12 mt-16 animate-fade-in" style={{ animationDelay: '400ms' }}>
              {[
                { value: '500+', label: 'Hackathons' },
                { value: '25K+', label: 'Hackers' },
                { value: '$2M+', label: 'Prize Pool' },
              ].map(({ value, label }) => (
                <div key={label} className="text-center">
                  <p className="font-display text-2xl sm:text-3xl font-bold text-text-primary">{value}</p>
                  <p className="text-xs sm:text-sm text-text-muted mt-1">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── Featured Hackathons ─── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-text-primary mb-2">
              Featured Hackathons
            </h2>
            <p className="text-text-secondary">Join the most exciting upcoming events</p>
          </div>
          <Link to="/explore" className="hidden sm:flex items-center gap-1 text-accent text-sm font-medium hover:underline">
            View all <ArrowRight size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading
            ? Array.from({ length: 3 }).map((_, i) => <HackathonCardSkeleton key={i} />)
            : data?.hackathons.map((h) => <HackathonCard key={h.id} hackathon={h} />)}
        </div>

        {!isLoading && (!data?.hackathons || data.hackathons.length === 0) && (
          <div className="text-center py-16">
            <Trophy size={48} className="mx-auto text-text-muted mb-4" />
            <p className="text-text-secondary text-lg mb-2">No upcoming hackathons yet</p>
            <p className="text-text-muted text-sm">Check back soon or host your own!</p>
          </div>
        )}

        <div className="sm:hidden text-center mt-6">
          <Link to="/explore" className="text-accent text-sm font-medium hover:underline">
            View all hackathons →
          </Link>
        </div>
      </section>

      {/* ─── Features ─── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-14">
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-text-primary mb-3">
            Everything you need
          </h2>
          <p className="text-text-secondary max-w-xl mx-auto">
            A complete platform built for the modern hackathon experience
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map(({ icon: Icon, title, description, color }) => (
            <div key={title} className="card p-6 text-center group">
              <div className={`w-12 h-12 mx-auto mb-4 rounded-xl bg-surface-elevated flex items-center justify-center ${color} group-hover:scale-110 transition-transform`}>
                <Icon size={24} />
              </div>
              <h3 className="font-display font-semibold text-text-primary mb-2">{title}</h3>
              <p className="text-sm text-text-muted leading-relaxed">{description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── CTA Banner ─── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="relative overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-accent/10 via-surface to-accent-secondary/10 px-8 sm:px-14 py-14 text-center">
          <div className="absolute top-0 right-0 w-64 h-64 bg-accent/10 rounded-full blur-[80px]" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent-secondary/10 rounded-full blur-[80px]" />
          <div className="relative">
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-text-primary mb-4">
              Ready to hack?
            </h2>
            <p className="text-text-secondary mb-8 max-w-lg mx-auto">
              Join thousands of developers, designers, and innovators building the future together.
            </p>
            <Link to="/register">
              <Button size="lg">
                Get Started — It's Free
                <ArrowRight size={18} />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
