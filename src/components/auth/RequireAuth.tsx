import { useEffect, type ReactNode } from 'react';
import Spinner from '@/components/ui/Spinner';
import { useAuth } from '@/hooks/useAuth';
import { navigate, useHashRoute } from '@/hooks/useHashRoute';

export default function RequireAuth({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  const { path } = useHashRoute();

  useEffect(() => {
    if (!loading && !user) {
      navigate(`/login?next=${encodeURIComponent(path)}`);
    }
  }, [loading, user, path]);

  if (loading || !user) {
    return <Spinner label="Checking your session" />;
  }

  return <>{children}</>;
}
