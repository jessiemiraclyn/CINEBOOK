import { Armchair, Calendar, Clock, LogIn, ShieldCheck, Ticket } from 'lucide-react';
import CouponForm from '@/components/booking/CouponForm';
import Button from '@/components/ui/Button';
import PosterImage from '@/components/ui/PosterImage';
import { formatCurrency, formatShowDate, formatShowTime } from '@/lib/format';
import { calculateCharges, COUPON_CODE, COUPON_DISCOUNT_PERCENT } from '@/lib/pricing';
import { CATEGORY_LABELS, seatLabel } from '@/lib/seatLayout';
import type { Seat, ShowWithMovie } from '@/types/cinema';

interface BookingSummaryProps {
  show: ShowWithMovie;
  seats: Seat[];
  couponCode: string | null;
  onApplyCoupon: (code: string) => void;
  onRemoveCoupon: () => void;
  isSignedIn: boolean;
  onPay: () => void;
  onSignIn: () => void;
}

export default function BookingSummary({
  show,
  seats,
  couponCode,
  onApplyCoupon,
  onRemoveCoupon,
  isSignedIn,
  onPay,
  onSignIn,
}: BookingSummaryProps) {
  const subtotal = seats.reduce((sum, seat) => sum + seat.price, 0);
  const { discount, total } = calculateCharges(subtotal, couponCode);
  const categories = Array.from(new Set(seats.map((seat) => seat.category)));

  return (
    <aside className="animate-fade-up relative overflow-hidden rounded-3xl border border-white/10 bg-ink-900/80 shadow-[0_40px_100px_-30px_rgba(49,85,255,0.35)] backdrop-blur-xl" aria-label="Booking summary">
      <div className="relative h-36 overflow-hidden">
        <PosterImage
          src={show.movies.backdrop_url ?? show.movies.poster_url}
          alt=""
          className="absolute inset-0 h-full w-full scale-110 object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink-900 via-ink-900/40 to-transparent" />
        <p className="absolute left-5 top-4 cinema-label text-[10px]">Order summary</p>
        <h2 className="absolute bottom-3 left-5 right-5 truncate font-display text-4xl uppercase tracking-wide text-soft">
          {show.movies.title}
        </h2>
      </div>

      <div className="flex flex-col gap-6 p-5 sm:p-6">
        <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-soft/80">
          <span className="flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5 text-muted" aria-hidden="true" />
            {formatShowDate(show.show_date)}
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5 text-muted" aria-hidden="true" />
            {formatShowTime(show.show_time)} · {show.screen}
          </span>
        </div>

        <div>
          <p className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-muted">
            <Armchair className="h-4 w-4" aria-hidden="true" />
            Selected seats ({seats.length})
          </p>
          {seats.length === 0 ? (
            <p className="rounded-xl border border-dashed border-white/10 px-4 py-4 text-sm text-muted">
              No seats selected yet. Pick seats on the map to see your total.
            </p>
          ) : (
            <>
              <div className="flex flex-wrap gap-2">
                {seats.map((seat) => (
                  <span
                    key={seat.id}
                    className={`rounded-md px-2.5 py-1 font-display text-base tracking-wide ${
                      seat.category === 'vip' ? 'bg-gold-400 text-ink-950' : 'bg-brand-600 text-white'
                    }`}
                  >
                    {seatLabel(seat.row_label, seat.seat_number)}
                  </span>
                ))}
              </div>
              <div className="mt-4 flex flex-wrap gap-2 text-xs text-muted">
                {categories.map((category) => {
                  const count = seats.filter((seat) => seat.category === category).length;
                  return (
                    <span key={category} className="rounded-full border border-white/10 px-3 py-1">
                      {CATEGORY_LABELS[category]} × {count}
                    </span>
                  );
                })}
              </div>
            </>
          )}
        </div>

        <div className="border-t border-white/10 pt-6">
          <CouponForm appliedCode={couponCode} onApply={onApplyCoupon} onRemove={onRemoveCoupon} />
          <p className="mt-2 text-xs text-muted">Try code {COUPON_CODE} for {COUPON_DISCOUNT_PERCENT}% off.</p>
        </div>

        <dl className="space-y-3 border-t border-white/10 pt-6 text-sm">
          <div className="flex justify-between text-soft/80">
            <dt>Subtotal</dt>
            <dd>{formatCurrency(subtotal)}</dd>
          </div>
          <div className="flex justify-between text-soft/80">
            <dt>Discount {couponCode ? `(${couponCode})` : ''}</dt>
            <dd className={discount > 0 ? 'text-gold-400' : ''}>
              {discount > 0 ? `- ${formatCurrency(discount)}` : formatCurrency(0)}
            </dd>
          </div>
          <div className="flex items-baseline justify-between border-t border-white/10 pt-4">
            <dt className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">Final total</dt>
            <dd className="font-display text-5xl tracking-wide text-soft">{formatCurrency(total)}</dd>
          </div>
        </dl>

        {isSignedIn ? (
          <Button size="lg" className="w-full" disabled={seats.length === 0} onClick={onPay}>
            <Ticket className="h-4 w-4" aria-hidden="true" />
            {seats.length === 0 ? 'Select seats to continue' : `Pay ${formatCurrency(total)} (Demo)`}
          </Button>
        ) : (
          <Button size="lg" className="w-full" onClick={onSignIn}>
            <LogIn className="h-4 w-4" aria-hidden="true" />
            Sign in to book
          </Button>
        )}

        <p className="flex items-start gap-2 text-xs text-muted">
          <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          Demo payment only. No real money is charged; your seats are reserved in CINEBOOK&apos;s records.
        </p>
      </div>
    </aside>
  );
}
