import { useAuthStore } from '../../store/authStore';
import { RegisteredHackathons, MyTeams, MySubmissions, PaymentHistory } from '../../components/dashboard/ParticipantPanels';
import { Sparkles } from 'lucide-react';

export default function ParticipantDashboard() {
  const { user } = useAuthStore();

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 rounded-xl bg-accent-secondary/15 flex items-center justify-center">
          <Sparkles size={22} className="text-accent-secondary" />
        </div>
        <div>
          <h1 className="font-display text-2xl font-bold text-text-primary">
            Hey, {user?.name || 'Hacker'} 👋
          </h1>
          <p className="text-text-muted text-sm">Your hackathon hub — all in one place</p>
        </div>
      </div>

      {/* Panel 1: Registered Hackathons (full-width) */}
      <div className="mb-6">
        <RegisteredHackathons />
      </div>

      {/* Panel 2 & 3: Teams + Submissions side-by-side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <MyTeams />
        <MySubmissions />
      </div>

      {/* Panel 4: Payment History */}
      <PaymentHistory />
    </div>
  );
}
