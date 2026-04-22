import { X, CheckCircle, AlertTriangle, Info, XCircle } from 'lucide-react';
import { useUIStore } from '../../store/uiStore';

const icons = {
  success: CheckCircle,
  error: XCircle,
  warning: AlertTriangle,
  info: Info,
};

const colors = {
  success: 'border-success/40 bg-success/5 text-success',
  error: 'border-danger/40 bg-danger/5 text-danger',
  warning: 'border-warning/40 bg-warning/5 text-warning',
  info: 'border-accent-secondary/40 bg-accent-secondary/5 text-accent-secondary',
};

export default function ToastContainer() {
  const { toasts, removeToast } = useUIStore();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3 max-w-sm w-full">
      {toasts.map((toast) => {
        const Icon = icons[toast.type];
        return (
          <div
            key={toast.id}
            className={`flex items-start gap-3 px-4 py-3 rounded-xl border backdrop-blur-md animate-slide-up ${colors[toast.type]}`}
          >
            <Icon size={18} className="mt-0.5 shrink-0" />
            <p className="text-sm flex-1 text-text-primary">{toast.message}</p>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-text-muted hover:text-text-primary transition-colors shrink-0"
            >
              <X size={14} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
