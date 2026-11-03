export type MovieStatus = 'now_showing' | 'upcoming';
export type SeatCategory = 'regular' | 'premium' | 'vip';
export type BookingStatus = 'confirmed' | 'cancelled';
export type UserRole = 'customer' | 'admin';

export interface Movie {
  id: string;
  title: string;
  genre: string;
  language: string;
  duration_minutes: number;
  rating: number;
  description: string;
  poster_url: string;
  backdrop_url: string | null;
  trailer_youtube_id: string | null;
  status: MovieStatus;
  is_trending: boolean;
  is_featured: boolean;
  release_date: string | null;
}

export type MovieInput = Omit<Movie, 'id'>;

export interface Show {
  id: string;
  movie_id: string;
  show_date: string;
  show_time: string;
  screen: string;
}

export interface ShowWithMovie extends Show {
  movies: Movie;
}

export interface Seat {
  id: string;
  row_label: string;
  seat_number: number;
  category: SeatCategory;
  price: number;
}

export interface Booking {
  id: string;
  booking_code: string;
  user_id: string;
  show_id: string;
  seat_count: number;
  subtotal_amount: number;
  discount_amount: number;
  coupon_code: string | null;
  total_amount: number;
  status: BookingStatus;
  refund_amount: number;
  cancelled_at: string | null;
  created_at: string;
}

export interface BookingSeat {
  id: string;
  status: 'booked' | 'released';
  price_paid: number;
  seats: Seat;
}

export interface BookingDetails extends Booking {
  shows: ShowWithMovie;
  booking_seats: BookingSeat[];
}

export interface Profile {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
}
