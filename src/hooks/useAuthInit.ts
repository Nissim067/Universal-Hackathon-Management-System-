import { useEffect } from 'react';
import { getCurrentUser } from '../api/auth.api';
import { useAuthStore } from '../store/authStore';

/**
 * On mount, attempt to restore auth state from the httpOnly session cookie.
 * Call this once in App.tsx.
 */
export function useAuthInit() {
  const { setUser, setLoading } = useAuthStore();

  useEffect(() => {
    let cancelled = false;

    async function init() {
      try {
        const user = await getCurrentUser();
        if (!cancelled) setUser(user);
      } catch {
        // Not authenticated — that's fine
        if (!cancelled) setUser(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    init();
    return () => { cancelled = true; };
  }, [setUser, setLoading]);
}
