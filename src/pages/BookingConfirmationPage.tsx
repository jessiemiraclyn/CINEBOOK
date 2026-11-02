import { ArrowRight, CheckCircle2, Ticket } from 'lucide-react';
import Button from '@/components/ui/Button';
import ErrorMessage from '@/components/ui/ErrorMessage';
import Spinner from '@/components/ui/Spinner';
import PageContainer from '@/components/layout/PageContainer';
import TicketCard from '@/components/booking/TicketCard';
import { getBookingStatus } from '@/components/booking/BookingStatusBadge';
import { useAsyncData } from '@/hooks/useAsyncData';
import { navigate } from '@/hooks/useHashRoute';
import { fetchBookingById } from '@/services/bookings';

export default function BookingConfirmationPage({ bookingId }: { bookingId: string }) {
  const booking = useAsyncData(() => fetchBookingById(bookingId), [bookingId]);

  if (booking.loading) {
    return (
      <PageContainer>
        <Spinner label="Loading your ticket" />
      </PageContainer>
    );
  }

  if (booking.error || !booking.data) {
    return (
      <PageContainer>
        <div className="flex flex-col items-start gap-4">
          <ErrorMessage message={booking.error ?? 'We could not find this booking.'} />
          <Button variant="secondary" onClick={() => navigate('/my-bookings')}>Go to My Bookings</Button>
        </div>
      </PageContainer>
    );
  }

  const data = booking.data;
  const cancelled = getBookingStatus(data) === 'cancelled';

  return (
    <PageContainer>
      {cancelled ? (
        <div className="animate-fade-up mx-auto mb-10 max-w-3xl">
          <ErrorMessage message="This booking has been cancelled. Any eligible refund is shown in My Bookings." />
        </div>
      ) : (
        <div className="animate-fade-up mx-auto mb-10 flex max-w-3xl flex-col items-center gap-3 text-center">
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-success-500/15 ring-8 ring-success-500/5">
            <CheckCircle2 className="h-8 w-8 text-success-400" aria-hidden="true" />
          </span>
          <p className="text-xs font-semibold uppercase tracking-widest text-success-400">Booking successful</p>
          <h1 className="section-title">You are all set</h1>
          <p className="max-w-md text-sm text-zinc-400">
            Your seats are reserved. Show this booking ID at the cinema. Payment was a demo transaction.
          </p>
        </div>
      )}

      <TicketCard booking={data} />

      <div className="mx-auto mt-10 flex max-w-3xl flex-col gap-3 sm:flex-row sm:justify-center">
        <Button variant="secondary" onClick={() => navigate('/my-bookings')}>
          <Ticket className="h-4 w-4" aria-hidden="true" />
          View My Bookings
        </Button>
        <Button variant="ghost" onClick={() => navigate('/movies')}>
          Browse more movies
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Button>
      </div>
    </PageContainer>
  );
}
