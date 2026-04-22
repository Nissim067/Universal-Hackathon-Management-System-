import { useAuthStore } from '../../store/authStore';
import { OrganizerStats, ManageHackathons } from '../../components/dashboard/OrganizerPanels';
import { Zap } from 'lucide-react';

export default function OrganizerDashboard() {
  const { user } = useAuthStore();

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 rounded-xl bg-accent/15 flex items-center justify-center">
          <Zap size={22} className="text-accent" />
        </div>
        <div>
          <h1 className="font-display text-2xl font-bold text-text-primary">
            Welcome back, {user?.name || 'Organizer'}
          </h1>
          <p className="text-text-muted text-sm">Manage your hackathons and track performance</p>
        </div>
      </div>

      {/* Stats */}
      <div className="mb-8">
        <OrganizerStats />
      </div>

      {/* Hackathon management */}
      <ManageHackathons />
    </div>
  );
}
