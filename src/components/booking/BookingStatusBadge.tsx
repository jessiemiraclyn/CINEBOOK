import { CheckCircle2, Clock, XCircle, type LucideIcon } from 'lucide-react';
import { isShowStarted } from '@/lib/format';
import type { BookingDetails } from '@/types/cinema';

export type DisplayBookingStatus = 'upcoming' | 'completed' | 'cancelled';

export function getBookingStatus(booking: BookingDetails): DisplayBookingStatus {
  if (booking.status === 'cancelled') return 'cancelled';
  return isShowStarted(booking.shows.show_date, booking.shows.show_time) ? 'completed' : 'upcoming';
}

export function canCancelBooking(booking: BookingDetails): boolean {
  return getBookingStatus(booking) === 'upcoming';
}

const STATUS_STYLES: Record<DisplayBookingStatus, { label: string; className: string; Icon: LucideIcon }> = {
  upcoming: { label: 'Confirmed', className: 'border-success-500/40 bg-success-500/10 text-success-400', Icon: CheckCircle2 },
  completed: { label: 'Completed', className: 'border-zinc-500/40 bg-zinc-500/10 text-zinc-300', Icon: Clock },
  cancelled: { label: 'Cancelled', className: 'border-red-500/40 bg-red-500/10 text-red-300', Icon: XCircle },
};

export function BookingStatusBadge({ status }: { status: DisplayBookingStatus }) {
  const { label, className, Icon } = STATUS_STYLES[status];
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wider ${className}`}>
      <Icon className="h-3.5 w-3.5" aria-hidden="true" />
      {label}
    </span>
  );
}
