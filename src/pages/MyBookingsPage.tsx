import { useState } from 'react';
import { Ticket } from 'lucide-react';
import Button from '@/components/ui/Button';
import EmptyState from '@/components/ui/EmptyState';
import ErrorMessage from '@/components/ui/ErrorMessage';
import Spinner from '@/components/ui/Spinner';
import PageContainer from '@/components/layout/PageContainer';
import BookingCard from '@/components/booking/BookingCard';
import CancelBookingModal from '@/components/booking/CancelBookingModal';
import { useAsyncData } from '@/hooks/useAsyncData';
import { navigate } from '@/hooks/useHashRoute';
import { getErrorMessage } from '@/lib/errors';
import { formatCurrency } from '@/lib/format';
import { cancelBooking, fetchMyBookings } from '@/services/bookings';
import type { BookingDetails } from '@/types/cinema';

export default function MyBookingsPage() {
  const bookings = useAsyncData(fetchMyBookings);
  const [pendingCancel, setPendingCancel] = useState<BookingDetails | null>(null);
  const [cancelling, setCancelling] = useState(false);
  const [cancelError, setCancelError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const closeCancelDialog = () => {
    setPendingCancel(null);
    setCancelError(null);
  };

  const handleConfirmCancel = async () => {
    if (!pendingCancel) return;
    setCancelling(true);
    setCancelError(null);
    try {
      const refund = await cancelBooking(pendingCancel.id);
      setNotice(`Booking ${pendingCancel.booking_code} cancelled. ${formatCurrency(refund)} will be refunded.`);
      closeCancelDialog();
      bookings.reload();
    } catch (err) {
      setCancelError(getErrorMessage(err, 'The booking could not be cancelled. Please try again.'));
    } finally {
      setCancelling(false);
    }
  };

  return (
    <PageContainer>
      <div className="mb-10 flex flex-wrap items-end justify-between gap-4 animate-fade-up">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-brand-400">Your account</p>
          <h1 className="section-title mt-2">My Bookings</h1>
        </div>
        <Button variant="secondary" size="sm" onClick={() => navigate('/movies')}>
          <Ticket className="h-4 w-4" aria-hidden="true" />
          Book another show
        </Button>
      </div>

      {notice && (
        <div role="status" className="animate-fade-in mb-6 rounded-xl border border-success-500/30 bg-success-500/10 px-4 py-3 text-sm text-success-400">
          {notice}
        </div>
      )}

      {bookings.loading && !bookings.data && <Spinner label="Loading your bookings" />}

      {bookings.error && (
        <div className="flex flex-col items-start gap-4">
          <ErrorMessage message={`Your bookings could not be loaded. ${bookings.error}`} />
          <Button variant="secondary" onClick={bookings.reload}>Try again</Button>
        </div>
      )}

      {bookings.data && bookings.data.length === 0 && (
        <EmptyState
          icon={<Ticket className="h-6 w-6" />}
          title="No bookings yet"
          message="Once you book seats for a show, your tickets will appear here."
          action={<Button onClick={() => navigate('/movies')}>Browse movies</Button>}
        />
      )}

      {bookings.data && bookings.data.length > 0 && (
        <div className="grid gap-5">
          {bookings.data.map((booking) => (
            <BookingCard
              key={booking.id}
              booking={booking}
              onCancel={(item) => {
                setNotice(null);
                setCancelError(null);
                setPendingCancel(item);
              }}
            />
          ))}
        </div>
      )}

      <CancelBookingModal
        key={pendingCancel?.id ?? 'closed'}
        booking={pendingCancel}
        submitting={cancelling}
        error={cancelError}
        onConfirm={handleConfirmCancel}
        onClose={closeCancelDialog}
      />
    </PageContainer>
  );
}
