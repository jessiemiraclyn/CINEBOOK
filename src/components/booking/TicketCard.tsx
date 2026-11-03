import { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { CalendarDays, Clock, Armchair, Clapperboard, Wallet } from 'lucide-react';
import PosterImage from '@/components/ui/PosterImage';
import { formatCurrency, formatDateTime, formatShowDate, formatShowTime } from '@/lib/format';
import { seatLabel } from '@/lib/seatLayout';
import { BookingStatusBadge, getBookingStatus } from '@/components/booking/BookingStatusBadge';
import type { BookingDetails } from '@/types/cinema';

function sortedSeats(booking: BookingDetails) {
  return [...booking.booking_seats].sort(
    (a, b) => a.seats.row_label.localeCompare(b.seats.row_label) || a.seats.seat_number - b.seats.seat_number,
  );
}

function useQrDataUrl(value: string) {
  const [dataUrl, setDataUrl] = useState<string | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setFailed(false);
    QRCode.toDataURL(value, {
      margin: 1,
      width: 240,
      errorCorrectionLevel: 'M',
      color: { dark: '#090a12', light: '#f3f2ee' },
    })
      .then((url) => {
        if (!cancelled) setDataUrl(url);
      })
      .catch(() => {
        if (!cancelled) setFailed(true);
      });
    return () => {
      cancelled = true;
    };
  }, [value]);

  return { dataUrl, failed };
}

export default function TicketCard({ booking }: { booking: BookingDetails }) {
  const { shows: show } = booking;
  const movie = show.movies;
  const seats = sortedSeats(booking);
  const status = getBookingStatus(booking);
  const confirmed = status !== 'cancelled';
  const qr = useQrDataUrl(`CINEBOOK:${booking.booking_code}`);

  return (
    <article className="animate-scale-in relative mx-auto w-full max-w-4xl overflow-hidden rounded-[2rem] border border-white/10 bg-ink-900 shadow-[0_50px_120px_-30px_rgba(135,60,255,0.4)]">
      <div className="grid md:grid-cols-[minmax(0,1fr)_17rem]">
        <div className="relative flex flex-col gap-6 p-6 sm:p-8">
          <div className="flex items-center justify-between gap-4">
            <span className="flex items-center gap-2 font-display text-2xl uppercase tracking-wider text-soft">
              <Clapperboard className="h-5 w-5 text-brand-500" aria-hidden="true" />
              CINE<span className="text-gold-400">BOOK</span>
            </span>
            <BookingStatusBadge status={status} />
          </div>

          <div className="flex gap-5">
            <PosterImage src={movie.poster_url} alt={`${movie.title} poster`} className="hidden h-36 w-24 shrink-0 rounded-lg sm:block" />
            <div className="min-w-0">
              <p className="cinema-label text-[10px]">Private midnight pass · {seats.length} {seats.length === 1 ? 'seat' : 'seats'}</p>
              <h3 className="mt-2 font-display text-5xl uppercase leading-none tracking-wide text-soft sm:text-6xl">{movie.title}</h3>
              <p className="mt-2 text-sm text-muted">
                {movie.genre} · {movie.language} · {show.screen}
              </p>
            </div>
          </div>

          <dl className="grid grid-cols-2 gap-5 border-t border-white/10 pt-6 text-sm">
            <div>
              <dt className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-muted">
                <CalendarDays className="h-3.5 w-3.5" aria-hidden="true" />Date
              </dt>
              <dd className="mt-1 font-semibold text-soft">{formatShowDate(show.show_date)}</dd>
            </div>
            <div>
              <dt className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-muted">
                <Clock className="h-3.5 w-3.5" aria-hidden="true" />Showtime
              </dt>
              <dd className="mt-1 font-semibold text-soft">{formatShowTime(show.show_time)}</dd>
            </div>
            <div className="col-span-2">
              <dt className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-muted">
                <Armchair className="h-3.5 w-3.5" aria-hidden="true" />Seats
              </dt>
              <dd className="mt-2 flex flex-wrap gap-1.5">
                {seats.map((bookingSeat) => (
                  <span
                    key={bookingSeat.id}
                    className={`rounded-md px-2.5 py-1 font-display text-lg tracking-wide ${
                      bookingSeat.seats.category === 'vip' ? 'bg-gold-400 text-ink-950' : 'bg-white/10 text-soft'
                    }`}
                  >
                    {seatLabel(bookingSeat.seats.row_label, bookingSeat.seats.seat_number)}
                  </span>
                ))}
              </dd>
            </div>
          </dl>
        </div>

        <div className="relative flex flex-col items-center justify-between gap-6 border-t-2 border-dashed border-white/15 bg-gradient-to-b from-ink-800 to-ink-950 p-6 text-center sm:p-8 md:border-l-2 md:border-t-0">
          <span className="absolute -left-4 -top-4 hidden h-8 w-8 rounded-full bg-ink-950 md:block" aria-hidden="true" />
          <span className="absolute -bottom-4 -left-4 hidden h-8 w-8 rounded-full bg-ink-950 md:block" aria-hidden="true" />

          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-muted">Booking ID</p>
            <p className="mt-1 font-display text-3xl tracking-wider text-gold-400">{booking.booking_code}</p>
          </div>

          <div className="flex h-[10.5rem] w-[10.5rem] items-center justify-center rounded-2xl bg-soft p-2">
            {qr.dataUrl ? (
              <img src={qr.dataUrl} alt={`QR code for booking ${booking.booking_code}`} className="h-full w-full" />
            ) : (
              <p className="px-2 text-xs text-ink-900">
                {qr.failed ? 'QR unavailable. Show your booking ID.' : 'Generating QR...'}
              </p>
            )}
          </div>

          <div className="w-full space-y-3 text-sm">
            <p className="flex items-center justify-between gap-4 text-muted">
              <span className="flex items-center gap-1.5"><Wallet className="h-3.5 w-3.5" aria-hidden="true" />Paid</span>
              <span className="font-semibold text-soft">{formatCurrency(booking.total_amount)}</span>
            </p>
            <p className="flex items-center justify-between gap-4 text-muted">
              <span>Issued</span>
              <span className="text-right text-soft/80">{formatDateTime(booking.created_at)}</span>
            </p>
            <p className={`rounded-full px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] ${confirmed ? 'bg-gold-400/15 text-gold-400' : 'bg-white/5 text-muted'}`}>
              {confirmed ? 'Confirmed admission' : 'Booking cancelled'}
            </p>
          </div>
        </div>
      </div>
    </article>
  );
}
