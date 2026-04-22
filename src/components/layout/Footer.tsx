import { Link } from 'react-router-dom';
import { Zap, Github, Twitter } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-border bg-surface/50 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center">
                <Zap size={18} className="text-white" />
              </div>
              <span className="font-display font-bold text-lg">UHMS</span>
            </Link>
            <p className="text-text-muted text-sm leading-relaxed">
              The universal platform for organizing, hosting, and participating in hackathons worldwide.
            </p>
          </div>

          {/* Platform */}
          <div>
            <h4 className="font-display font-semibold text-sm text-text-primary mb-4 uppercase tracking-wider">
              Platform
            </h4>
            <ul className="space-y-2">
              {[
                { to: '/explore', label: 'Explore Hackathons' },
                { to: '/create', label: 'Host a Hackathon' },
                { to: '/dashboard', label: 'Dashboard' },
              ].map(({ to, label }) => (
                <li key={to}>
                  <Link to={to} className="text-sm text-text-muted hover:text-accent transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-display font-semibold text-sm text-text-primary mb-4 uppercase tracking-wider">
              Resources
            </h4>
            <ul className="space-y-2">
              {['Documentation', 'API Reference', 'Community'].map((label) => (
                <li key={label}>
                  <span className="text-sm text-text-muted hover:text-accent transition-colors cursor-pointer">
                    {label}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="font-display font-semibold text-sm text-text-primary mb-4 uppercase tracking-wider">
              Connect
            </h4>
            <div className="flex gap-3">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-surface-elevated border border-border flex items-center justify-center text-text-muted hover:text-accent hover:border-accent/30 transition-all"
              >
                <Github size={16} />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-surface-elevated border border-border flex items-center justify-center text-text-muted hover:text-accent hover:border-accent/30 transition-all"
              >
                <Twitter size={16} />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-border mt-10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-text-muted">
            © {new Date().getFullYear()} UHMS. All rights reserved.
          </p>
          <p className="text-xs text-text-muted">
            Built with <span className="text-accent">♥</span> for hackers everywhere
          </p>
        </div>
      </div>
    </footer>
  );
}
