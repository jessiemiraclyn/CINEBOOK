import { Armchair, CalendarDays, Clock, Receipt, RotateCcw, Ticket, XCircle } from 'lucide-react';
import Button from '@/components/ui/Button';
import PosterImage from '@/components/ui/PosterImage';
import { BookingStatusBadge, canCancelBooking, getBookingStatus } from '@/components/booking/BookingStatusBadge';
import { formatCurrency, formatDateTime, formatShowDate, formatShowTime } from '@/lib/format';
import { seatLabel } from '@/lib/seatLayout';
import { navigate } from '@/hooks/useHashRoute';
import type { BookingDetails } from '@/types/cinema';

interface BookingCardProps {
  booking: BookingDetails;
  onCancel: (booking: BookingDetails) => void;
}

export default function BookingCard({ booking, onCancel }: BookingCardProps) {
  const { shows: show } = booking;
  const movie = show.movies;
  const status = getBookingStatus(booking);
  const seats = [...booking.booking_seats]
    .sort((a, b) => a.seats.row_label.localeCompare(b.seats.row_label) || a.seats.seat_number - b.seats.seat_number)
    .map((item) => seatLabel(item.seats.row_label, item.seats.seat_number));

  return (
    <article className="animate-fade-up glass-panel flex flex-col gap-5 p-5 transition duration-300 hover:border-white/20 sm:flex-row sm:p-6">
      <PosterImage src={movie.poster_url} alt={`${movie.title} poster`} className="h-40 w-28 shrink-0 rounded-xl sm:h-36 sm:w-24" />

      <div className="flex min-w-0 flex-1 flex-col gap-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="font-mono text-xs font-semibold tracking-wider text-brand-400">{booking.booking_code}</p>
            <h3 className="mt-1 truncate font-display text-3xl tracking-wide text-white">{movie.title}</h3>
          </div>
          <BookingStatusBadge status={status} />
        </div>

        <dl className="grid grid-cols-1 gap-3 text-sm sm:grid-cols-2 xl:grid-cols-3">
          <div className="flex items-center gap-2 text-zinc-300">
            <CalendarDays className="h-4 w-4 shrink-0 text-zinc-500" aria-hidden="true" />
            {formatShowDate(show.show_date)}
          </div>
          <div className="flex items-center gap-2 text-zinc-300">
            <Clock className="h-4 w-4 shrink-0 text-zinc-500" aria-hidden="true" />
            {formatShowTime(show.show_time)} · {show.screen}
          </div>
          <div className="flex items-center gap-2 text-zinc-300">
            <Armchair className="h-4 w-4 shrink-0 text-zinc-500" aria-hidden="true" />
            <span className="truncate">Seats {seats.join(', ')}</span>
          </div>
          <div className="flex items-center gap-2 text-zinc-300">
            <Receipt className="h-4 w-4 shrink-0 text-zinc-500" aria-hidden="true" />
            Paid {formatCurrency(booking.total_amount)}
          </div>
          {status === 'cancelled' && (
            <div className="flex items-center gap-2 text-success-400">
              <RotateCcw className="h-4 w-4 shrink-0" aria-hidden="true" />
              Refunded {formatCurrency(booking.refund_amount)}
            </div>
          )}
          <div className="text-xs text-zinc-500 sm:col-span-2 xl:col-span-3">
            Booked {formatDateTime(booking.created_at)}
            {booking.cancelled_at && ` · Cancelled ${formatDateTime(booking.cancelled_at)}`}
          </div>
        </dl>

        <div className="mt-auto flex flex-wrap items-center gap-3 border-t border-white/10 pt-4">
          {canCancelBooking(booking) ? (
            <Button variant="danger" size="sm" onClick={() => onCancel(booking)}>
              <XCircle className="h-4 w-4" aria-hidden="true" />
              Cancel booking
            </Button>
          ) : status === 'completed' ? (
            <p className="text-xs text-zinc-500">This show has already started, so the booking can no longer be cancelled.</p>
          ) : null}
          <Button variant="secondary" size="sm" onClick={() => navigate(`/bookings/${booking.id}`)}>
            <Ticket className="h-4 w-4" aria-hidden="true" />
            View ticket
          </Button>
        </div>
      </div>
    </article>
  );
}
