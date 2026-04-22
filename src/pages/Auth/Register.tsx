import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Zap, Eye, EyeOff } from 'lucide-react';
import Button from '../../components/ui/Button';
import { registerUser } from '../../api/auth.api';
import { useAuthStore } from '../../store/authStore';
import { useUIStore } from '../../store/uiStore';
import { isValidEmail, isStrongPassword } from '../../utils/validators';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'participant' | 'organizer'>('participant');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { setUser } = useAuthStore();
  const { addToast } = useUIStore();
  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!name.trim()) {
      addToast('Name is required', 'error');
      return;
    }
    if (!isValidEmail(email)) {
      addToast('Please enter a valid email', 'error');
      return;
    }
    if (!isStrongPassword(password)) {
      addToast('Password must be 8+ chars with uppercase, lowercase, and a digit', 'error');
      return;
    }

    setIsLoading(true);
    try {
      const user = await registerUser({ name, email, password, role });
      setUser(user);
      addToast('Account created successfully!', 'success');
      navigate('/dashboard');
    } catch {
      addToast('Registration failed. Email may already be in use.', 'error');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12">
      {/* Background effects */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-[128px]" />
        <div className="absolute bottom-1/3 left-1/4 w-96 h-96 bg-accent-secondary/5 rounded-full blur-[128px]" />
      </div>

      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center shadow-lg shadow-accent-glow">
              <Zap size={22} className="text-white" />
            </div>
          </Link>
          <h1 className="font-display text-3xl font-bold text-text-primary mb-2">Create account</h1>
          <p className="text-text-secondary text-sm">Join the global hackathon community</p>
        </div>

        {/* Form card */}
        <div className="card p-8 hover:translate-y-0 hover:shadow-none">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Role toggle */}
            <div className="flex rounded-xl bg-surface-elevated border border-border p-1">
              {(['participant', 'organizer'] as const).map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRole(r)}
                  className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 capitalize ${
                    role === r
                      ? 'bg-accent text-white shadow-md shadow-accent-glow'
                      : 'text-text-muted hover:text-text-primary'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>

            {/* Name */}
            <div className="space-y-1.5">
              <label htmlFor="register-name" className="text-sm font-medium text-text-secondary">
                Full Name
              </label>
              <div className="relative">
                <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
                <input
                  id="register-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  className="input-field w-full pl-10"
                  autoComplete="name"
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <label htmlFor="register-email" className="text-sm font-medium text-text-secondary">
                Email
              </label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
                <input
                  id="register-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="input-field w-full pl-10"
                  autoComplete="email"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label htmlFor="register-password" className="text-sm font-medium text-text-secondary">
                Password
              </label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
                <input
                  id="register-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min. 8 characters"
                  className="input-field w-full pl-10 pr-10"
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              <p className="text-xs text-text-muted">
                At least 8 characters, one uppercase, one lowercase, one digit
              </p>
            </div>

            <Button type="submit" className="w-full" size="lg" isLoading={isLoading}>
              Create Account
            </Button>
          </form>

          <p className="text-center text-sm text-text-muted mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-accent hover:underline font-medium">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
