import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search, Filter, X } from 'lucide-react';
import HackathonCard from '../components/hackathon/HackathonCard';
import { HackathonCardSkeleton } from '../components/ui/Skeleton';
import { getHackathons } from '../api/hackathon.api';
import type { Hackathon } from '../types';

const statusFilters: { label: string; value: Hackathon['status'] | 'all' }[] = [
  { label: 'All', value: 'all' },
  { label: 'Upcoming', value: 'upcoming' },
  { label: 'Live Now', value: 'ongoing' },
  { label: 'Completed', value: 'completed' },
];

export default function Explore() {
  const [statusFilter, setStatusFilter] = useState<Hackathon['status'] | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ['hackathons', statusFilter, page],
    queryFn: () =>
      getHackathons({
        status: statusFilter === 'all' ? undefined : statusFilter,
        page,
        limit: 9,
      }),
  });

  const filtered = data?.hackathons.filter((h) =>
    searchQuery
      ? h.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        h.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()))
      : true
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="mb-10">
        <h1 className="font-display text-4xl font-bold text-text-primary mb-2">
          Explore Hackathons
        </h1>
        <p className="text-text-secondary">
          Discover hackathons that match your skills and interests
        </p>
      </div>

      {/* Filters bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mb-8">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name or tag..."
            className="input-field w-full pl-10 pr-10"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Status filters */}
        <div className="flex items-center gap-1 bg-surface rounded-xl border border-border p-1">
          <Filter size={14} className="text-text-muted ml-2 mr-1 hidden sm:block" />
          {statusFilters.map(({ label, value }) => (
            <button
              key={value}
              onClick={() => {
                setStatusFilter(value);
                setPage(1);
              }}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                statusFilter === value
                  ? 'bg-accent text-white shadow-md'
                  : 'text-text-muted hover:text-text-primary'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <HackathonCardSkeleton key={i} />
          ))}
        </div>
      ) : !filtered || filtered.length === 0 ? (
        <div className="text-center py-20">
          <Search size={48} className="mx-auto text-text-muted mb-4" />
          <h3 className="font-display text-xl font-semibold text-text-primary mb-2">
            No hackathons found
          </h3>
          <p className="text-text-muted text-sm">
            {searchQuery
              ? 'Try a different search term'
              : 'Check back soon for new hackathons'}
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((h) => (
              <HackathonCard key={h.id} hackathon={h} />
            ))}
          </div>

          {/* Pagination */}
          {data && data.totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-12">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-4 py-2 rounded-xl text-sm font-medium bg-surface-elevated border border-border text-text-secondary hover:text-text-primary disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                Previous
              </button>
              <span className="text-sm text-text-muted px-4">
                Page {page} of {data.totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(data.totalPages, p + 1))}
                disabled={page === data.totalPages}
                className="px-4 py-2 rounded-xl text-sm font-medium bg-surface-elevated border border-border text-text-secondary hover:text-text-primary disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
