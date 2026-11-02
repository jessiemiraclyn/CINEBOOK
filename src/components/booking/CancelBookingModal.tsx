import { useState } from 'react';
import { AlertTriangle, Loader2 } from 'lucide-react';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import ErrorMessage from '@/components/ui/ErrorMessage';
import { calculateRefund } from '@/lib/pricing';
import { formatCurrency } from '@/lib/format';
import type { BookingDetails } from '@/types/cinema';

interface CancelBookingModalProps {
  booking: BookingDetails | null;
  submitting: boolean;
  error: string | null;
  onConfirm: () => void;
  onClose: () => void;
}

export default function CancelBookingModal({ booking, submitting, error, onConfirm, onClose }: CancelBookingModalProps) {
  const [acknowledged, setAcknowledged] = useState(false);
  const refund = booking ? calculateRefund(booking.total_amount) : 0;

  return (
    <Modal
      open={booking !== null}
      title="Cancel booking?"
      onClose={submitting ? () => undefined : () => {
        setAcknowledged(false);
        onClose();
      }}
    >
      {booking && (
        <div className="space-y-6">
          <p className="text-sm text-zinc-300">
            Booking <span className="font-mono font-semibold text-white">{booking.booking_code}</span> for{' '}
            <span className="font-semibold text-white">{booking.shows.movies.title}</span> will be cancelled and its seats released.
          </p>

          <div className="rounded-xl border border-white/10 bg-white/5 p-4">
            <div className="flex justify-between text-sm text-zinc-400">
              <span>Amount paid</span>
              <span>{formatCurrency(booking.total_amount)}</span>
            </div>
            <div className="mt-2 flex justify-between text-sm text-zinc-400">
              <span>Refund (80%)</span>
              <span className="text-success-400">{formatCurrency(refund)}</span>
            </div>
            <div className="mt-3 flex justify-between border-t border-white/10 pt-3 font-semibold text-white">
              <span>Amount kept as cancellation fee</span>
              <span>{formatCurrency(booking.total_amount - refund)}</span>
            </div>
          </div>

          <label className="flex cursor-pointer items-start gap-3 text-sm text-zinc-300">
            <input
              type="checkbox"
              checked={acknowledged}
              onChange={(event) => setAcknowledged(event.target.checked)}
              className="mt-0.5 h-4 w-4 rounded border-white/20 bg-ink-850 accent-brand-600"
            />
            I understand this cancellation cannot be undone and only 80% is refunded.
          </label>

          <p className="flex items-start gap-2 text-xs text-zinc-500">
            <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            Refunds are simulated in this demo; no money is moved.
          </p>

          {error && <ErrorMessage message={error} />}

          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <Button variant="secondary" onClick={onClose} disabled={submitting}>
              Keep booking
            </Button>
            <Button variant="danger" onClick={onConfirm} disabled={!acknowledged || submitting}>
              {submitting && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
              {submitting ? 'Cancelling...' : 'Cancel booking'}
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
}
