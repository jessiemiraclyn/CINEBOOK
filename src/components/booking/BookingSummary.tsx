import { CATEGORY_LABELS, seatLabel } from '@/lib/seatLayout';
import { formatCurrency, formatShowDate, formatShowTime } from '@/lib/format';
import { calculateCharges, COUPON_CODE, COUPON_DISCOUNT_PERCENT } from '@/lib/pricing';
import CouponForm from '@/components/booking/CouponForm';
import Button from '@/components/ui/Button';
import PosterImage from '@/components/ui/PosterImage';
import { Armchair, Calendar, Clock, LogIn, ShieldCheck, Ticket } from 'lucide-react';
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
    <aside className="glass-panel animate-fade-up flex flex-col gap-6 p-6" aria-label="Booking summary">
      <div className="flex gap-4">
        <PosterImage src={show.movies.poster_url} alt="" className="h-24 w-16 shrink-0 rounded-lg" />
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-widest text-brand-400">Booking summary</p>
          <h2 className="mt-1 truncate font-display text-3xl tracking-wide text-white">{show.movies.title}</h2>
          <p className="mt-1 flex items-center gap-1.5 text-sm text-zinc-400">
            <Calendar className="h-3.5 w-3.5" aria-hidden="true" />
            {formatShowDate(show.show_date)}
          </p>
          <p className="flex items-center gap-1.5 text-sm text-zinc-400">
            <Clock className="h-3.5 w-3.5" aria-hidden="true" />
            {formatShowTime(show.show_time)} · {show.screen}
          </p>
        </div>
      </div>

      <div className="border-t border-white/10 pt-6">
        <p className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-zinc-400">
          <Armchair className="h-4 w-4" aria-hidden="true" />
          Selected seats ({seats.length})
        </p>
        {seats.length === 0 ? (
          <p className="text-sm text-zinc-500">No seats selected yet. Pick seats on the map to see your total.</p>
        ) : (
          <>
            <div className="flex flex-wrap gap-2">
              {seats.map((seat) => (
                <span key={seat.id} className="rounded-md bg-warning-400/15 px-2.5 py-1 text-sm font-semibold text-warning-400">
                  {seatLabel(seat.row_label, seat.seat_number)}
                </span>
              ))}
            </div>
            <div className="mt-4 flex flex-wrap gap-2 text-xs text-zinc-400">
              {categories.map((category) => {
                const count = seats.filter((seat) => seat.category === category).length;
                return (
                  <span key={category} className="rounded-full border border-white/10 px-3 py-1">
                    {CATEGORY_LABELS[category]} × {count}
                  </span>
                );
              })}
            </div>
            <ul className="mt-4 divide-y divide-white/5 text-sm">
              {seats.map((seat) => (
                <li key={seat.id} className="flex items-center justify-between py-2 text-zinc-300">
                  <span>
                    {seatLabel(seat.row_label, seat.seat_number)} · {CATEGORY_LABELS[seat.category]}
                  </span>
                  <span className="font-medium text-white">{formatCurrency(seat.price)}</span>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>

      <div className="border-t border-white/10 pt-6">
        <CouponForm appliedCode={couponCode} onApply={onApplyCoupon} onRemove={onRemoveCoupon} />
        <p className="mt-2 text-xs text-zinc-500">Try code {COUPON_CODE} for {COUPON_DISCOUNT_PERCENT}% off.</p>
      </div>

      <dl className="space-y-3 border-t border-white/10 pt-6 text-sm">
        <div className="flex justify-between text-zinc-300">
          <dt>Original amount</dt>
          <dd>{formatCurrency(subtotal)}</dd>
        </div>
        <div className="flex justify-between text-zinc-300">
          <dt>Discount {couponCode ? `(${couponCode})` : ''}</dt>
          <dd className={discount > 0 ? 'text-success-400' : ''}>
            {discount > 0 ? `- ${formatCurrency(discount)}` : formatCurrency(0)}
          </dd>
        </div>
        <div className="flex items-baseline justify-between border-t border-white/10 pt-4">
          <dt className="text-base font-semibold text-white">Final payable</dt>
          <dd className="font-display text-4xl tracking-wide text-white">{formatCurrency(total)}</dd>
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

      <p className="flex items-start gap-2 text-xs text-zinc-500">
        <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-zinc-400" aria-hidden="true" />
        Demo payment only. No real money is charged; your seats are reserved in CineBook&apos;s records.
      </p>
    </aside>
  );
}
