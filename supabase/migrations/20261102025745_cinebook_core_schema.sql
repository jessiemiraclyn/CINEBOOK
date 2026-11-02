/*
# CineBook core schema

## Plain-English summary
Creates every table CineBook needs: user profiles, movies, showtimes, the cinema seat layout,
bookings and the individual seats held by each booking. Seat availability is tracked per show,
so the same seat can be booked for different showtimes independently.

## New tables
1. users: one profile per sign-up (id = auth account id), full name, email, role (customer or admin).
2. movies: catalogue entries with title, genre, language, duration, rating, description, poster and backdrop images, status (now_showing or upcoming), trending and featured flags.
3. shows: a screening of a movie on a date at a time (unique per movie, date and time).
4. seats: the fixed 5 x 8 cinema layout (rows A to E, seats 1 to 8) with category and price.
5. bookings: one row per purchase, with a booking code (BK1001 style), owner, show, amounts, coupon, status and refund.
6. booking_seats: one row per seat held by a booking for a show. A partial unique index allows a seat to be held by only one active booking per show.

## Security
- Row level security enabled on every table.
- Movies, shows and seats are readable by everyone (public catalogue).
- Only administrators (checked by is_admin()) can add, edit or delete movies and shows.
- Bookings and booking seats are readable only by their owner or an administrator. Clients cannot insert or update bookings directly; that happens through server-side functions in the next migration.
- The users role column cannot be changed by the user. Users may only update their own full name.
- is_admin() is a SECURITY DEFINER helper so policies can check the role without exposing the users table.

## Important notes
1. Prices are stored on seats and copied onto booking_seats at purchase time, so later price changes do not alter past bookings.
2. A sign-up trigger creates the matching users row automatically.
3. Foreign keys protect history: a show with bookings cannot be deleted, while deleting a movie removes its unused shows.
*/

CREATE SEQUENCE IF NOT EXISTS booking_code_seq START WITH 1001;

CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  full_name text NOT NULL DEFAULT '',
  role text NOT NULL DEFAULT 'customer' CHECK (role IN ('customer', 'admin')),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS movies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL CHECK (char_length(title) BETWEEN 1 AND 120),
  genre text NOT NULL,
  language text NOT NULL,
  duration_minutes integer NOT NULL CHECK (duration_minutes BETWEEN 1 AND 400),
  rating numeric(3,1) NOT NULL DEFAULT 0 CHECK (rating BETWEEN 0 AND 10),
  description text NOT NULL DEFAULT '',
  poster_url text NOT NULL,
  backdrop_url text,
  status text NOT NULL DEFAULT 'now_showing' CHECK (status IN ('now_showing', 'upcoming')),
  is_trending boolean NOT NULL DEFAULT false,
  is_featured boolean NOT NULL DEFAULT false,
  release_date date,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS shows (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  movie_id uuid NOT NULL REFERENCES movies(id) ON DELETE CASCADE,
  show_date date NOT NULL,
  show_time time NOT NULL,
  screen text NOT NULL DEFAULT 'Screen 1',
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (movie_id, show_date, show_time)
);
CREATE INDEX IF NOT EXISTS shows_movie_date_idx ON shows (movie_id, show_date);

CREATE TABLE IF NOT EXISTS seats (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  row_label text NOT NULL CHECK (row_label IN ('A', 'B', 'C', 'D', 'E')),
  seat_number integer NOT NULL CHECK (seat_number BETWEEN 1 AND 8),
  category text NOT NULL CHECK (category IN ('regular', 'premium', 'vip')),
  price integer NOT NULL CHECK (price > 0),
  UNIQUE (row_label, seat_number)
);

CREATE TABLE IF NOT EXISTS bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_code text NOT NULL UNIQUE DEFAULT ('BK' || nextval('booking_code_seq')),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES users(id) ON DELETE RESTRICT,
  show_id uuid NOT NULL REFERENCES shows(id) ON DELETE RESTRICT,
  seat_count integer NOT NULL CHECK (seat_count > 0),
  subtotal_amount integer NOT NULL CHECK (subtotal_amount >= 0),
  discount_amount integer NOT NULL DEFAULT 0 CHECK (discount_amount >= 0),
  coupon_code text,
  total_amount integer NOT NULL CHECK (total_amount >= 0),
  status text NOT NULL DEFAULT 'confirmed' CHECK (status IN ('confirmed', 'cancelled')),
  refund_amount integer NOT NULL DEFAULT 0 CHECK (refund_amount >= 0),
  cancelled_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS bookings_user_idx ON bookings (user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS bookings_show_idx ON bookings (show_id);

CREATE TABLE IF NOT EXISTS booking_seats (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id uuid NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  show_id uuid NOT NULL REFERENCES shows(id) ON DELETE RESTRICT,
  seat_id uuid NOT NULL REFERENCES seats(id) ON DELETE RESTRICT,
  price_paid integer NOT NULL CHECK (price_paid >= 0),
  status text NOT NULL DEFAULT 'booked' CHECK (status IN ('booked', 'released')),
  released_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX IF NOT EXISTS booking_seats_one_active_holder
  ON booking_seats (show_id, seat_id) WHERE status = 'booked';
CREATE INDEX IF NOT EXISTS booking_seats_booking_idx ON booking_seats (booking_id);

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE movies ENABLE ROW LEVEL SECURITY;
ALTER TABLE shows ENABLE ROW LEVEL SECURITY;
ALTER TABLE seats ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE booking_seats ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'
  );
$$;

REVOKE EXECUTE ON FUNCTION public.is_admin() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.email, ''),
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', '')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

GRANT SELECT ON users TO authenticated;
GRANT UPDATE (full_name) ON users TO authenticated;

DROP POLICY IF EXISTS "users_select_own_profile" ON users;
CREATE POLICY "users_select_own_profile" ON users FOR SELECT
  TO authenticated USING (auth.uid() = id);

DROP POLICY IF EXISTS "users_update_own_name" ON users;
CREATE POLICY "users_update_own_name" ON users FOR UPDATE
  TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

GRANT SELECT ON movies TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON movies TO authenticated;

DROP POLICY IF EXISTS "movies_public_read" ON movies;
CREATE POLICY "movies_public_read" ON movies FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "movies_admin_insert" ON movies;
CREATE POLICY "movies_admin_insert" ON movies FOR INSERT
  TO authenticated WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "movies_admin_update" ON movies;
CREATE POLICY "movies_admin_update" ON movies FOR UPDATE
  TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "movies_admin_delete" ON movies;
CREATE POLICY "movies_admin_delete" ON movies FOR DELETE
  TO authenticated USING (public.is_admin());

GRANT SELECT ON shows TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON shows TO authenticated;

DROP POLICY IF EXISTS "shows_public_read" ON shows;
CREATE POLICY "shows_public_read" ON shows FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "shows_admin_insert" ON shows;
CREATE POLICY "shows_admin_insert" ON shows FOR INSERT
  TO authenticated WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "shows_admin_update" ON shows;
CREATE POLICY "shows_admin_update" ON shows FOR UPDATE
  TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "shows_admin_delete" ON shows;
CREATE POLICY "shows_admin_delete" ON shows FOR DELETE
  TO authenticated USING (public.is_admin());

GRANT SELECT ON seats TO anon, authenticated;

DROP POLICY IF EXISTS "seats_public_read" ON seats;
CREATE POLICY "seats_public_read" ON seats FOR SELECT
  TO anon, authenticated USING (true);

GRANT SELECT ON bookings TO authenticated;

DROP POLICY IF EXISTS "bookings_select_own_or_admin" ON bookings;
CREATE POLICY "bookings_select_own_or_admin" ON bookings FOR SELECT
  TO authenticated USING (auth.uid() = user_id OR public.is_admin());

GRANT SELECT ON booking_seats TO authenticated;

DROP POLICY IF EXISTS "booking_seats_select_own_or_admin" ON booking_seats;
CREATE POLICY "booking_seats_select_own_or_admin" ON booking_seats FOR SELECT
  TO authenticated USING (
    public.is_admin() OR EXISTS (
      SELECT 1 FROM bookings b WHERE b.id = booking_seats.booking_id AND b.user_id = auth.uid()
    )
  );
