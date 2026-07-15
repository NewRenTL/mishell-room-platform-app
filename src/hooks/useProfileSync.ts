import { useEffect } from 'react';
import { useAuthStore } from '../stores/authStore';
import { authService } from '../services/auth.service';

export function useProfileSync() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  useEffect(() => {
    if (!isAuthenticated) return;

    async function refresh() {
      const { accessToken, setAuth } = useAuthStore.getState();
      if (!accessToken) return;
      try {
        const res = await authService.me();
        setAuth(accessToken, res.data);
      } catch {
        // silent — no forzamos logout si falla el refresh
      }
    }

    refresh();

    function onVisibility() {
      if (document.visibilityState === 'visible') refresh();
    }

    document.addEventListener('visibilitychange', onVisibility);
    return () => document.removeEventListener('visibilitychange', onVisibility);
  }, [isAuthenticated]);
}
