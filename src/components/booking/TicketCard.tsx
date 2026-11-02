import { CalendarDays, Clock, Armchair, Clapperboard, Ticket, Wallet } from 'lucide-react';
import { formatCurrency, formatDateTime, formatShowDate, formatShowTime } from '@/lib/format';
import { seatLabel } from '@/lib/seatLayout';
import { BookingStatusBadge, getBookingStatus } from '@/components/booking/BookingStatusBadge';
import type { BookingDetails } from '@/types/cinema';

function sortedSeats(booking: BookingDetails) {
  return [...booking.booking_seats].sort(
    (a, b) => a.seats.row_label.localeCompare(b.seats.row_label) || a.seats.seat_number - b.seats.seat_number,
  );
}

export default function TicketCard({ booking }: { booking: BookingDetails }) {
  const { shows: show } = booking;
  const movie = show.movies;
  const seats = sortedSeats(booking);
  const status = getBookingStatus(booking);

  return (
    <article className="animate-scale-in relative mx-auto w-full max-w-3xl overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-ink-800 via-ink-850 to-ink-900 shadow-2xl shadow-black/60">
      <div className="absolute inset-y-0 left-0 w-1.5 bg-brand-600" aria-hidden="true" />
      <div className="grid sm:grid-cols-[1fr_16rem]">
        <div className="space-y-6 p-6 sm:p-8">
          <div className="flex items-center justify-between gap-4">
            <span className="flex items-center gap-2 font-display text-2xl tracking-wider text-white">
              <Clapperboard className="h-5 w-5 text-brand-500" aria-hidden="true" />
              CINE<span className="text-brand-500">BOOK</span>
            </span>
            <BookingStatusBadge status={status} />
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-zinc-500">Admit {seats.length}</p>
            <h3 className="mt-1 font-display text-4xl tracking-wide text-white sm:text-5xl">{movie.title}</h3>
            <p className="mt-2 text-sm text-zinc-400">
              {movie.genre} · {movie.language} · {show.screen}
            </p>
          </div>

          <dl className="grid grid-cols-2 gap-5 text-sm">
            <div>
              <dt className="flex items-center gap-1.5 text-xs uppercase tracking-wider text-zinc-500">
                <CalendarDays className="h-3.5 w-3.5" aria-hidden="true" />Date
              </dt>
              <dd className="mt-1 font-semibold text-white">{formatShowDate(show.show_date)}</dd>
            </div>
            <div>
              <dt className="flex items-center gap-1.5 text-xs uppercase tracking-wider text-zinc-500">
                <Clock className="h-3.5 w-3.5" aria-hidden="true" />Showtime
              </dt>
              <dd className="mt-1 font-semibold text-white">{formatShowTime(show.show_time)}</dd>
            </div>
            <div className="col-span-2">
              <dt className="flex items-center gap-1.5 text-xs uppercase tracking-wider text-zinc-500">
                <Armchair className="h-3.5 w-3.5" aria-hidden="true" />Seats
              </dt>
              <dd className="mt-1 flex flex-wrap gap-1.5">
                {seats.map((bookingSeat) => (
                  <span key={bookingSeat.id} className="rounded-md bg-white/10 px-2 py-0.5 font-semibold text-white">
                    {seatLabel(bookingSeat.seats.row_label, bookingSeat.seats.seat_number)}
                  </span>
                ))}
              </dd>
            </div>
          </dl>
        </div>

        <div className="relative flex flex-col justify-between gap-6 border-t border-dashed border-white/15 bg-black/20 p-6 sm:border-l sm:border-t-0 sm:p-8">
          <span className="absolute -left-3 -top-3 hidden h-6 w-6 rounded-full bg-ink-950 sm:block" aria-hidden="true" />
          <span className="absolute -bottom-3 -left-3 hidden h-6 w-6 rounded-full bg-ink-950 sm:block" aria-hidden="true" />
          <div>
            <p className="text-xs uppercase tracking-widest text-zinc-500">Booking ID</p>
            <p className="mt-1 font-mono text-3xl font-bold tracking-wider text-white">{booking.booking_code}</p>
          </div>
          <div className="space-y-3 text-sm">
            <p className="flex items-center justify-between gap-4 text-zinc-400">
              <span className="flex items-center gap-1.5"><Wallet className="h-3.5 w-3.5" aria-hidden="true" />Amount paid</span>
              <span className="font-semibold text-white">{formatCurrency(booking.total_amount)}</span>
            </p>
            <p className="flex items-center justify-between gap-4 text-zinc-400">
              <span className="flex items-center gap-1.5"><Ticket className="h-3.5 w-3.5" aria-hidden="true" />Booked</span>
              <span className="text-right text-zinc-200">{formatDateTime(booking.created_at)}</span>
            </p>
          </div>
        </div>
      </div>
    </article>
  );
}
