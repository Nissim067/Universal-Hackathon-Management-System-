import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { ArrowLeft } from 'lucide-react';
import CheckoutForm from '../components/payment/CheckoutForm';
import PaymentStatusComponent from '../components/payment/PaymentStatus';
import Skeleton from '../components/ui/Skeleton';
import { getHackathonById, registerForHackathon } from '../api/hackathon.api';
import { createPaymentIntent } from '../api/payment.api';
import { useUIStore } from '../store/uiStore';
import { useState } from 'react';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY || '');

export default function Checkout() {
  const { hackathonId } = useParams<{ hackathonId: string }>();
  const navigate = useNavigate();
  const { addToast } = useUIStore();
  const [paymentDone, setPaymentDone] = useState(false);

  const { data: hackathon, isLoading: loadingH } = useQuery({
    queryKey: ['hackathon', hackathonId],
    queryFn: () => getHackathonById(hackathonId!),
    enabled: !!hackathonId,
  });

  const { data: intent, isLoading: loadingI } = useQuery({
    queryKey: ['payment-intent', hackathonId],
    queryFn: () => createPaymentIntent(hackathonId!),
    enabled: !!hackathonId && !paymentDone,
  });

  async function handleSuccess() {
    try {
      await registerForHackathon(hackathonId!);
    } catch { addToast('Payment succeeded but registration may have failed.', 'warning'); }
    setPaymentDone(true);
  }

  if (loadingH || loadingI) {
    return (
      <div className="max-w-lg mx-auto px-4 py-16">
        <Skeleton className="h-8 w-48 mb-6" />
        <Skeleton variant="rectangular" className="h-64 rounded-xl" />
      </div>
    );
  }

  if (paymentDone) {
    return (
      <div className="max-w-lg mx-auto px-4 py-16">
        <PaymentStatusComponent status="success" hackathonId={hackathonId} hackathonTitle={hackathon?.title} />
      </div>
    );
  }

  if (!hackathon || !intent) {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center">
        <p className="text-text-muted">Unable to load checkout</p>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto px-4 sm:px-6 py-10">
      <button onClick={() => navigate(-1)} className="flex items-center gap-1.5 text-sm text-text-muted hover:text-text-primary mb-6">
        <ArrowLeft size={16} /> Back
      </button>
      <h1 className="font-display text-2xl font-bold text-text-primary mb-6">Checkout</h1>
      <Elements stripe={stripePromise} options={{ clientSecret: intent.clientSecret, appearance: { theme: 'night' } }}>
        <CheckoutForm hackathonTitle={hackathon.title} amount={intent.amount} currency={intent.currency} clientSecret={intent.clientSecret} onSuccess={handleSuccess} />
      </Elements>
    </div>
  );
}
