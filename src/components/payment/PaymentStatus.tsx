import { CheckCircle, XCircle, Loader } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '../ui/Button';

interface PaymentStatusProps {
  status: 'success' | 'failed' | 'processing';
  hackathonId?: string;
  hackathonTitle?: string;
}

export default function PaymentStatus({ status, hackathonId, hackathonTitle }: PaymentStatusProps) {
  if (status === 'processing') {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <Loader size={48} className="text-accent animate-spin mb-4" />
        <h3 className="font-display text-xl font-semibold text-text-primary mb-2">
          Processing Payment...
        </h3>
        <p className="text-text-secondary text-sm">Please wait while we confirm your payment.</p>
      </div>
    );
  }

  if (status === 'failed') {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-16 h-16 rounded-full bg-danger/10 flex items-center justify-center mb-4">
          <XCircle size={32} className="text-danger" />
        </div>
        <h3 className="font-display text-xl font-semibold text-text-primary mb-2">
          Payment Failed
        </h3>
        <p className="text-text-secondary text-sm mb-6">
          Something went wrong. Please try again or use a different card.
        </p>
        <Button variant="secondary" onClick={() => window.location.reload()}>
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mb-4 animate-bounce-in">
        <CheckCircle size={32} className="text-success" />
      </div>
      <h3 className="font-display text-xl font-semibold text-text-primary mb-2">
        Payment Successful!
      </h3>
      <p className="text-text-secondary text-sm mb-1">
        You're now registered{hackathonTitle ? ` for ${hackathonTitle}` : ''}.
      </p>
      <p className="text-text-muted text-xs mb-6">
        A confirmation has been sent to your email.
      </p>
      <div className="flex gap-3">
        {hackathonId && (
          <Link to={`/hackathon/${hackathonId}`}>
            <Button variant="primary">View Hackathon</Button>
          </Link>
        )}
        <Link to="/dashboard">
          <Button variant="secondary">Go to Dashboard</Button>
        </Link>
      </div>
    </div>
  );
}
