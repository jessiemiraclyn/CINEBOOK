import { useEffect, useMemo, useState } from 'react';
import { AlertTriangle, ArrowLeft, RefreshCw } from 'lucide-react';
import Button from '@/components/ui/Button';
import ErrorMessage from '@/components/ui/ErrorMessage';
import Spinner from '@/components/ui/Spinner';
import PageContainer from '@/components/layout/PageContainer';
import BookingSummary from '@/components/booking/BookingSummary';
import DemoPaymentModal from '@/components/booking/DemoPaymentModal';
import SeatMap, { SeatLegend } from '@/components/seats/SeatMap';
import { useAsyncData } from '@/hooks/useAsyncData';
import { useAuth } from '@/hooks/useAuth';
import { navigate } from '@/hooks/useHashRoute';
import { useShowAvailability } from '@/hooks/useShowAvailability';
import { getErrorMessage } from '@/lib/errors';
import { formatCurrency, formatShowDate, formatShowTime, isShowStarted } from '@/lib/format';
import { calculateCharges } from '@/lib/pricing';
import { CATEGORY_LABELS, MAX_SEATS_PER_BOOKING } from '@/lib/seatLayout';
import { createBooking, fetchAllSeats } from '@/services/bookings';
import { fetchShowWithMovie } from '@/services/movies';
import type { Seat } from '@/types/cinema';

export default function SeatSelectionPage({ showId }: { showId: string }) {
  const { user } = useAuth();
  const show = useAsyncData(() => fetchShowWithMovie(showId), [showId]);
  const seats = useAsyncData(fetchAllSeats, []);
  const availability = useShowAvailability(showId);

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [couponCode, setCouponCode] = useState<string | null>(null);
  const [selectionMessage, setSelectionMessage] = useState<string | null>(null);
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [paying, setPaying] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);

  const seatList = useMemo(() => seats.data ?? [], [seats.data]);
  const bookedIds = useMemo(
    () => new Set(Object.entries(availability.bookedBySeat ?? {}).filter(([, booked]) => booked).map(([id]) => id)),
    [availability.bookedBySeat],
  );
  const selectedSeats = useMemo<Seat[]>(
    () =>
      seatList
        .filter((seat) => selectedIds.includes(seat.id))
        .sort((a, b) => a.row_label.localeCompare(b.row_label) || a.seat_number - b.seat_number),
    [seatList, selectedIds],
  );
  const { total } = calculateCharges(selectedSeats.reduce((sum, seat) => sum + seat.price, 0), couponCode);

  useEffect(() => {
    const takenSelection = selectedIds.some((id) => bookedIds.has(id));
    if (!takenSelection) return;
    setSelectedIds((ids) => ids.filter((id) => !bookedIds.has(id)));
    setSelectionMessage('Some of your selected seats were just booked by someone else and have been removed from your selection.');
  }, [bookedIds, selectedIds]);

  if (show.loading || seats.loading || (availability.bookedBySeat === null && !availability.error)) {
    return (
      <PageContainer>
        <Spinner label="Loading seat map" />
      </PageContainer>
    );
  }

  const loadError = show.error ?? seats.error ?? (availability.bookedBySeat === null ? availability.error : null);
  if (loadError) {
    return (
      <PageContainer>
        <div className="flex flex-col items-start gap-4">
          <ErrorMessage message={loadError} />
          <Button variant="secondary" onClick={() => navigate('/movies')}>
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Back to movies
          </Button>
        </div>
      </PageContainer>
    );
  }

  if (!show.data) {
    return (
      <PageContainer>
        <div className="flex flex-col items-start gap-4">
          <ErrorMessage message="This showtime could not be found." />
          <Button variant="secondary" onClick={() => navigate('/movies')}>Browse movies</Button>
        </div>
      </PageContainer>
    );
  }

  const currentShow = show.data;
  const started = isShowStarted(currentShow.show_date, currentShow.show_time);
  const movieHref = `/movies/${currentShow.movie_id}`;

  const toggleSeat = (seat: Seat) => {
    if (bookedIds.has(seat.id) || started || paying) return;
    if (selectedIds.includes(seat.id)) {
      setSelectedIds((ids) => ids.filter((id) => id !== seat.id));
      setSelectionMessage(null);
      return;
    }
    if (selectedIds.length >= MAX_SEATS_PER_BOOKING) {
      setSelectionMessage(`You can book up to ${MAX_SEATS_PER_BOOKING} seats in one booking.`);
      return;
    }
    setSelectedIds((ids) => [...ids, seat.id]);
    setSelectionMessage(null);
  };

  const handleCheckout = () => {
    if (!user) {
      navigate(`/login?next=${encodeURIComponent(`/book/${showId}`)}`);
      return;
    }
    setPaymentError(null);
    setPaymentOpen(true);
  };

  const handleConfirmPayment = async () => {
    setPaying(true);
    setPaymentError(null);
    try {
      const booking = await createBooking(showId, selectedIds, couponCode);
      navigate(`/bookings/${booking.booking_id}`);
    } catch (err) {
      setPaymentError(getErrorMessage(err, 'Payment could not be completed. Please try again.'));
      const freshBooked = await availability.refresh();
      if (freshBooked) {
        setSelectedIds((ids) => ids.filter((id) => !freshBooked[id]));
      }
      setPaying(false);
    }
  };

  const priceByCategory = (['regular', 'premium', 'vip'] as const)
    .map((category) => {
      const sample = seatList.find((seat) => seat.category === category);
      const rows = Array.from(new Set(seatList.filter((seat) => seat.category === category).map((seat) => seat.row_label)));
      return sample ? { category, price: sample.price, rows } : null;
    })
    .filter((item): item is { category: 'regular' | 'premium' | 'vip'; price: number; rows: string[] } => item !== null);

  return (
    <PageContainer className="animate-fade-up">
      <button
        type="button"
        onClick={() => navigate(movieHref)}
        className="mb-6 inline-flex items-center gap-2 rounded-full text-sm text-zinc-400 transition hover:text-white"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Back to {currentShow.movies.title}
      </button>

      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-brand-400">
            {formatShowDate(currentShow.show_date)} · {formatShowTime(currentShow.show_time)} · {currentShow.screen}
          </p>
          <h1 className="section-title mt-2">Choose your seats</h1>
        </div>
        <p className="text-sm text-zinc-400">
          {formatCurrency(total)} for {selectedSeats.length} {selectedSeats.length === 1 ? 'seat' : 'seats'}
        </p>
      </div>

      {started && (
        <div className="mb-6">
          <p className="flex items-start gap-3 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-100">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-300" aria-hidden="true" />
            This showtime has already started. Please choose another show.
          </p>
        </div>
      )}

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_380px] lg:items-start">
        <section className="glass-panel p-4 sm:p-8" aria-label="Seat selection">
          <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
            <SeatLegend />
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-2 text-xs text-zinc-400">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                </span>
                Live{availability.updatedAt && ` · updated ${availability.updatedAt.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}`}
              </span>
              <button
                type="button"
                onClick={() => availability.refresh()}
                className="inline-flex items-center gap-2 rounded-full border border-white/10 px-3 py-1.5 text-xs text-zinc-300 transition hover:border-white/25 hover:text-white"
              >
                <RefreshCw className="h-3.5 w-3.5" aria-hidden="true" />
                Refresh seats
              </button>
            </div>
          </div>

          {availability.error && (
            <div className="mb-6">
              <ErrorMessage message={availability.error} />
            </div>
          )}

          {selectionMessage && (
            <p role="status" className="animate-fade-in mb-6 text-center text-sm text-amber-300">
              {selectionMessage}
            </p>
          )}

          <SeatMap
            seats={seatList}
            bookedSeatIds={bookedIds}
            selectedSeatIds={new Set(selectedIds)}
            disabled={started || paying}
            onToggle={toggleSeat}
          />

          <div className="mt-10 grid gap-3 border-t border-white/10 pt-6 sm:grid-cols-3">
            {priceByCategory.map((item) => (
              <div key={item.category} className="rounded-xl border border-white/10 bg-white/5 px-4 py-3">
                <p className="text-sm font-semibold text-white">{CATEGORY_LABELS[item.category]}</p>
                <p className="text-xs text-zinc-400">Rows {item.rows.join(' & ')} · {formatCurrency(item.price)} per seat</p>
              </div>
            ))}
          </div>
        </section>

        <div className="lg:sticky lg:top-24">
          <BookingSummary
            show={currentShow}
            seats={selectedSeats}
            couponCode={couponCode}
            onApplyCoupon={setCouponCode}
            onRemoveCoupon={() => setCouponCode(null)}
            isSignedIn={Boolean(user)}
            onPay={handleCheckout}
            onSignIn={() => navigate(`/login?next=${encodeURIComponent(`/book/${showId}`)}`)}
          />
        </div>
      </div>

      <DemoPaymentModal
        open={paymentOpen}
        amount={total}
        seatCount={selectedSeats.length}
        submitting={paying}
        error={paymentError}
        onConfirm={handleConfirmPayment}
        onClose={() => setPaymentOpen(false)}
      />
    </PageContainer>
  );
}
