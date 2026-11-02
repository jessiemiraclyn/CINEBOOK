import { Check, X } from 'lucide-react';
import { SEAT_COLUMNS, SEAT_ROWS, CATEGORY_LABELS, seatLabel } from '@/lib/seatLayout';
import type { Seat } from '@/types/cinema';

interface SeatMapProps {
  seats: Seat[];
  bookedSeatIds: Set<string>;
  selectedSeatIds: Set<string>;
  disabled: boolean;
  onToggle: (seat: Seat) => void;
}

const AISLE_AFTER_COLUMN = 4;

function seatButtonClasses(state: 'available' | 'booked' | 'selected', vip: boolean): string {
  const vipRing = vip ? ' ring-1 ring-gold-400/70' : '';
  switch (state) {
    case 'booked':
      return `cursor-not-allowed border-zinc-600/50 bg-zinc-700/40 text-zinc-500${vipRing}`;
    case 'selected':
      return `border-brand-400 bg-brand-600 text-white shadow-lg shadow-brand-600/50 -translate-y-0.5${vipRing}`;
    default:
      return `border-emerald-500/60 bg-emerald-500/15 text-emerald-300 hover:-translate-y-0.5 hover:bg-emerald-500/30 hover:shadow-lg hover:shadow-emerald-500/20${vipRing}`;
  }
}

export default function SeatMap({ seats, bookedSeatIds, selectedSeatIds, disabled, onToggle }: SeatMapProps) {
  const seatsByPosition = new Map(seats.map((seat) => [`${seat.row_label}-${seat.seat_number}`, seat]));

  return (
    <div className="flex flex-col items-center gap-10">
      <div className="relative w-full max-w-xl">
        <div className="relative">
          <div aria-hidden="true" className="absolute inset-x-8 -top-4 h-10 rounded-full bg-gold-400/20 blur-2xl" />
          <div className="relative h-1.5 w-full rounded-full bg-gradient-to-r from-transparent via-gold-300 to-transparent shadow-[0_0_24px_rgba(214,180,106,0.6)]" />
        </div>
        <p className="mt-4 text-center text-xs font-semibold uppercase tracking-[0.4em] text-zinc-400">Screen this way</p>
      </div>

      <div className="flex w-full flex-col gap-4 overflow-x-auto pb-2" role="group" aria-label="Seat map">
        {SEAT_ROWS.map((row) => {
          const rowSeats = seats.filter((seat) => seat.row_label === row);
          const category = rowSeats[0]?.category;
          const price = rowSeats[0]?.price;
          return (
            <div key={row} className="flex items-center justify-center gap-3 sm:gap-4">
              <span className="w-5 text-center text-sm font-semibold text-zinc-400">{row}</span>
              <div className="flex items-center gap-1.5 sm:gap-2">
                {Array.from({ length: SEAT_COLUMNS }, (_, index) => {
                  const seatNumber = index + 1;
                  const seat = seatsByPosition.get(`${row}-${seatNumber}`);
                  const aisle = seatNumber === AISLE_AFTER_COLUMN ? 'ml-4 sm:ml-8' : '';
                  if (!seat) return <span key={seatNumber} className={`h-8 w-8 sm:h-10 sm:w-10 ${aisle}`} />;

                  const booked = bookedSeatIds.has(seat.id);
                  const selected = selectedSeatIds.has(seat.id);
                  const state = booked ? 'booked' : selected ? 'selected' : 'available';
                  const label = seatLabel(seat.row_label, seat.seat_number);
                  const statusText = booked ? 'booked' : selected ? 'selected' : 'available';

                  return (
                    <button
                      key={seat.id}
                      type="button"
                      onClick={() => onToggle(seat)}
                      disabled={booked || disabled}
                      aria-pressed={selected}
                      aria-label={`Seat ${label}, ${CATEGORY_LABELS[seat.category]}, ₹${seat.price}, ${statusText}`}
                      title={`${label} · ${CATEGORY_LABELS[seat.category]} · ₹${seat.price} · ${statusText}`}
                      className={`${aisle} flex h-8 w-8 items-center justify-center rounded-t-xl rounded-b-md border text-[11px] font-semibold transition-all duration-300 active:scale-90 disabled:opacity-60 sm:h-10 sm:w-10 sm:text-xs ${seatButtonClasses(state, seat.category === 'vip')}`}
                    >
                      {seatNumber}
                    </button>
                  );
                })}
              </div>
              <span className="hidden w-16 text-xs text-zinc-500 md:block">
                {category ? `${CATEGORY_LABELS[category]} · ₹${price}` : ''}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function SeatLegend() {
  const items = [
    { label: 'Available', className: 'border-emerald-500/60 bg-emerald-500/15', icon: null },
    { label: 'VIP', className: 'border-emerald-500/60 bg-emerald-500/15 ring-1 ring-gold-400/70', icon: null },
    { label: 'Selected', className: 'border-brand-400 bg-brand-600', icon: <Check className="h-3 w-3 text-white" /> },
    { label: 'Booked', className: 'border-zinc-600/50 bg-zinc-700/40', icon: <X className="h-3 w-3 text-zinc-500" /> },
  ];

  return (
    <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-sm text-zinc-300">
      {items.map((item) => (
        <span key={item.label} className="flex items-center gap-2">
          <span className={`flex h-5 w-5 items-center justify-center rounded-md border ${item.className}`}>{item.icon}</span>
          {item.label}
        </span>
      ))}
    </div>
  );
}
