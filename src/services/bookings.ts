import { supabase } from '@/lib/supabase';
import type { BookingDetails, Seat } from '@/types/cinema';

export const BOOKING_DETAILS_SELECT = `
  *,
  shows (
    id, movie_id, show_date, show_time, screen,
    movies ( id, title, genre, language, duration_minutes, rating, poster_url, backdrop_url, status, is_trending, is_featured, description, release_date )
  ),
  booking_seats (
    id, status, price_paid,
    seats ( id, row_label, seat_number, category, price )
  )
`;

export async function fetchAllSeats(): Promise<Seat[]> {
  const { data, error } = await supabase
    .from('seats')
    .select('*')
    .order('row_label')
    .order('seat_number');
  if (error) throw error;
  return (data ?? []) as Seat[];
}

export async function fetchShowAvailability(showId: string): Promise<Record<string, boolean>> {
  const { data, error } = await supabase.rpc('get_show_availability', { p_show_id: showId });
  if (error) throw error;
  if (!Array.isArray(data)) throw new Error('Seat availability could not be loaded.');
  const bookedBySeat: Record<string, boolean> = {};
  for (const row of data as { seat_id: string; is_booked: boolean }[]) {
    bookedBySeat[row.seat_id] = row.is_booked;
  }
  return bookedBySeat;
}

export interface CreatedBooking {
  booking_id: string;
  booking_code: string;
}

export async function createBooking(
  showId: string,
  seatIds: string[],
  couponCode: string | null,
): Promise<CreatedBooking> {
  const { data, error } = await supabase.rpc('create_booking', {
    p_show_id: showId,
    p_seat_ids: seatIds,
    p_coupon_code: couponCode,
  });
  if (error) throw error;
  const result = data as Partial<CreatedBooking> | null;
  if (!result || typeof result.booking_id !== 'string' || typeof result.booking_code !== 'string') {
    throw new Error('Booking could not be confirmed. Please check My Bookings before trying again.');
  }
  return { booking_id: result.booking_id, booking_code: result.booking_code };
}

export async function cancelBooking(bookingId: string): Promise<number> {
  const { data, error } = await supabase.rpc('cancel_booking', { p_booking_id: bookingId });
  if (error) throw error;
  const refund = (data as { refund_amount?: unknown } | null)?.refund_amount;
  if (typeof refund !== 'number') throw new Error('Cancellation could not be confirmed.');
  return refund;
}

export async function fetchMyBookings(): Promise<BookingDetails[]> {
  const { data, error } = await supabase
    .from('bookings')
    .select(BOOKING_DETAILS_SELECT)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data ?? []) as unknown as BookingDetails[];
}

export async function fetchBookingById(bookingId: string): Promise<BookingDetails | null> {
  const { data, error } = await supabase
    .from('bookings')
    .select(BOOKING_DETAILS_SELECT)
    .eq('id', bookingId)
    .maybeSingle();
  if (error) throw error;
  return (data as unknown as BookingDetails | null) ?? null;
}

export async function fetchAllBookings(): Promise<BookingDetails[]> {
  const { data, error } = await supabase
    .from('bookings')
    .select(BOOKING_DETAILS_SELECT)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data ?? []) as unknown as BookingDetails[];
}
