import { useCallback, useEffect, useState } from 'react';
import { fetchShowAvailability } from '@/services/bookings';
import { getErrorMessage } from '@/lib/errors';

const LIVE_REFRESH_INTERVAL_MS = 8000;

interface AvailabilityState {
  bookedBySeat: Record<string, boolean> | null;
  error: string | null;
  updatedAt: Date | null;
}

export function useShowAvailability(showId: string) {
  const [state, setState] = useState<AvailabilityState>({ bookedBySeat: null, error: null, updatedAt: null });

  const refresh = useCallback(async () => {
    try {
      const bookedBySeat = await fetchShowAvailability(showId);
      setState({ bookedBySeat, error: null, updatedAt: new Date() });
      return bookedBySeat;
    } catch (err) {
      setState((previous) => ({
        ...previous,
        error: getErrorMessage(err, 'Seat availability could not be loaded.'),
      }));
      return null;
    }
  }, [showId]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      if (document.visibilityState === 'visible') refresh();
    }, LIVE_REFRESH_INTERVAL_MS);
    return () => window.clearInterval(timer);
  }, [refresh]);

  return { ...state, refresh };
}
