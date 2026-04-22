import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, Users, Share2 } from 'lucide-react';
import HackathonBanner from '../components/hackathon/HackathonBanner';
import Button from '../components/ui/Button';
import Skeleton from '../components/ui/Skeleton';
import { getHackathonById, registerForHackathon } from '../api/hackathon.api';
import { getPaymentStatus } from '../api/payment.api';
import { useAuthStore } from '../store/authStore';
import { useUIStore } from '../store/uiStore';
import { useState } from 'react';

export default function HackathonDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const { addToast } = useUIStore();
  const [registering, setRegistering] = useState(false);

  const { data: hackathon, isLoading } = useQuery({
    queryKey: ['hackathon', id],
    queryFn: () => getHackathonById(id!),
    enabled: !!id,
  });

  const { data: paymentStatus } = useQuery({
    queryKey: ['payment-status', id],
    queryFn: () => getPaymentStatus(id!),
    enabled: !!id && isAuthenticated,
  });

  async function handleRegister() {
    if (!isAuthenticated) { navigate('/login'); return; }
    if (!hackathon) return;
    if (hackathon.registrationFee > 0) { navigate(`/checkout/${hackathon.id}`); return; }
    setRegistering(true);
    try {
      await registerForHackathon(hackathon.id);
      addToast('Successfully registered!', 'success');
    } catch { addToast('Registration failed.', 'error'); }
    finally { setRegistering(false); }
  }

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-10">
        <Skeleton className="h-8 w-32 mb-6" />
        <Skeleton variant="rectangular" className="w-full h-72 rounded-2xl mb-8" />
        <Skeleton className="h-40 w-full rounded-xl" />
      </div>
    );
  }

  if (!hackathon) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-20 text-center">
        <h2 className="font-display text-2xl font-bold text-text-primary mb-2">Not found</h2>
        <Button onClick={() => navigate('/explore')}>Browse Hackathons</Button>
      </div>
    );
  }

  const isRegistered = paymentStatus?.paid || false;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <button onClick={() => navigate(-1)} className="flex items-center gap-1.5 text-sm text-text-muted hover:text-text-primary mb-6">
        <ArrowLeft size={16} /> Back
      </button>
      <HackathonBanner hackathon={hackathon} />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
        <div className="lg:col-span-2">
          <div className="card p-6 hover:translate-y-0 hover:shadow-none">
            <h2 className="font-display text-xl font-semibold text-text-primary mb-4">About</h2>
            <p className="text-text-secondary leading-relaxed whitespace-pre-line">{hackathon.description}</p>
          </div>
        </div>
        <div className="space-y-4">
          <div className="card p-6 hover:translate-y-0 hover:shadow-none">
            <h3 className="font-display font-semibold text-text-primary mb-4">Registration</h3>
            {isRegistered ? (
              <div className="text-center py-4">
                <Users size={20} className="mx-auto text-success mb-2" />
                <p className="text-success font-medium text-sm">You're registered!</p>
              </div>
            ) : hackathon.status === 'completed' ? (
              <p className="text-text-muted text-sm text-center py-4">Closed</p>
            ) : (
              <>
                <div className="flex justify-between mb-4 text-sm">
                  <span className="text-text-muted">Fee</span>
                  <span className="font-mono font-bold">{hackathon.registrationFee === 0 ? 'FREE' : `₹${hackathon.registrationFee}`}</span>
                </div>
                <Button className="w-full" onClick={handleRegister} isLoading={registering}>
                  {hackathon.registrationFee > 0 ? 'Register & Pay' : 'Register Now'}
                </Button>
              </>
            )}
          </div>
          <div className="card p-6 hover:translate-y-0 hover:shadow-none">
            <Button variant="secondary" size="sm" className="w-full" onClick={() => { navigator.clipboard.writeText(window.location.href); addToast('Link copied!', 'info'); }}>
              <Share2 size={14} /> Copy Link
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
