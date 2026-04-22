import { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { CreditCard, Lock } from 'lucide-react';
import Button from '../ui/Button';
import { useUIStore } from '../../store/uiStore';
import { formatCurrency } from '../../utils/formatCurrency';

interface CheckoutFormProps {
  hackathonTitle: string;
  amount: number;
  currency: string;
  clientSecret: string;
  onSuccess: () => void;
}

export default function CheckoutForm({
  hackathonTitle,
  amount,
  currency,
  clientSecret,
  onSuccess,
}: CheckoutFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { addToast } = useUIStore();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!stripe || !elements) return;

    const card = elements.getElement(CardElement);
    if (!card) return;

    setIsProcessing(true);
    setError(null);

    try {
      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: { card },
      });

      if (stripeError) {
        setError(stripeError.message || 'Payment failed');
        addToast(stripeError.message || 'Payment failed', 'error');
      } else if (paymentIntent?.status === 'succeeded') {
        addToast('Payment successful!', 'success');
        onSuccess();
      }
    } catch {
      setError('An unexpected error occurred');
      addToast('An unexpected error occurred', 'error');
    } finally {
      setIsProcessing(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Order summary */}
      <div className="bg-surface-elevated rounded-xl border border-border p-5">
        <h4 className="text-sm font-medium text-text-muted mb-1">Registering for</h4>
        <p className="font-display font-semibold text-text-primary text-lg">{hackathonTitle}</p>
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
          <span className="text-sm text-text-secondary">Registration Fee</span>
          <span className="font-mono text-lg font-bold text-accent">
            {formatCurrency(amount / 100, currency.toUpperCase())}
          </span>
        </div>
      </div>

      {/* Card input */}
      <div className="space-y-2">
        <label className="flex items-center gap-2 text-sm font-medium text-text-secondary">
          <CreditCard size={16} />
          Card Details
        </label>
        <div className="bg-surface-elevated border border-border rounded-xl px-4 py-3.5 transition-all focus-within:border-accent focus-within:ring-1 focus-within:ring-accent">
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: '16px',
                  color: '#f0f0ff',
                  '::placeholder': { color: '#55556a' },
                  fontFamily: "'DM Sans', sans-serif",
                },
                invalid: { color: '#ff4757' },
              },
            }}
          />
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="text-sm text-danger bg-danger/10 border border-danger/20 rounded-xl px-4 py-3">
          {error}
        </div>
      )}

      {/* Submit */}
      <Button
        type="submit"
        className="w-full"
        size="lg"
        isLoading={isProcessing}
        disabled={!stripe}
      >
        <Lock size={16} />
        Pay {formatCurrency(amount / 100, currency.toUpperCase())}
      </Button>

      <p className="text-xs text-text-muted text-center flex items-center justify-center gap-1">
        <Lock size={12} />
        Secured by Stripe. We never store your card data.
      </p>
    </form>
  );
}
