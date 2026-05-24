import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { bootstrapSession, fetchMe } from '@/shared/api/auth';
import { fetchMyPartner } from '@/shared/api/partners';
import { authStore } from '@/shared/lib/auth-store';
import type { AuthMe, Partner } from '@/shared/types';
import { Spinner } from '@/shared/ui/Spinner';

interface AuthContextValue {
  user: AuthMe | null;
  partner: Partner | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  hasPartner: boolean;
  refreshAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthMe | null>(null);
  const [partner, setPartner] = useState<Partner | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshAuth = async () => {
    if (!authStore.isAuthenticated()) {
      setUser(null);
      setPartner(null);
      return;
    }

    const me = await fetchMe();
    setUser(me);

    try {
      const partnerData = await fetchMyPartner();
      setPartner(partnerData);
    } catch {
      setPartner(null);
      authStore.setPartnerId(null);
    }
  };

  useEffect(() => {
    let mounted = true;

    const init = async () => {
      try {
        const hasSession = await bootstrapSession();
        if (!hasSession) return;

        const me = await fetchMe();
        if (!mounted) return;
        setUser(me);

        try {
          const partnerData = await fetchMyPartner();
          if (mounted) setPartner(partnerData);
        } catch {
          if (mounted) setPartner(null);
        }
      } catch {
        authStore.clear();
      } finally {
        if (mounted) setIsLoading(false);
      }
    };

    void init();
    return () => {
      mounted = false;
    };
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      partner,
      isLoading,
      isAuthenticated: Boolean(user),
      hasPartner: Boolean(partner),
      refreshAuth,
    }),
    [user, partner, isLoading],
  );

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner label="Loading session..." />
      </div>
    );
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
