export const SEAT_ROWS = ['A', 'B', 'C', 'D', 'E'] as const;
export const SEAT_COLUMNS = 8;
export const MAX_SEATS_PER_BOOKING = 10;

export const CATEGORY_LABELS: Record<'regular' | 'premium' | 'vip', string> = {
  regular: 'Regular',
  premium: 'Premium',
  vip: 'VIP',
};

export function seatLabel(rowLabel: string, seatNumber: number): string {
  return `${rowLabel}${seatNumber}`;
}
