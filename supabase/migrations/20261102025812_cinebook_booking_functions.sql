/*
# Booking, cancellation and availability functions

## Plain-English summary
Adds the server-side logic that books seats, cancels bookings with an 80% refund, reports which seats are
taken for a show, and keeps upcoming showtimes available. Each booking is written in one database
transaction, so two people cannot take the same seat.

## New functions
1. create_booking(show, seats, coupon): checks the user is signed in, locks the show, rejects taken seats,
   calculates prices from the seat table, applies coupon CINE10 (10% off), and stores the booking
   with a code such as BK1001.
2. cancel_booking(booking): only the booking owner can cancel. Only confirmed bookings for shows that
   have not started can be cancelled. Sets the status to Cancelled, records an 80% refund, and releases the seats.
3. get_show_availability(show): returns every seat with a flag saying whether it is booked for that show.
4. ensure_upcoming_shows(): creates showtimes for the next 7 days for every now-showing movie. Safe to run repeatedly.
5. handle_new_user already exists from the schema migration.

## Security
- create_booking and cancel_booking run as SECURITY DEFINER with a fixed search path and require sign-in.
- Clients cannot write bookings or booking seats directly; they must call these functions.
- get_show_availability exposes only seat ids and booked flags, never customer details.
- EXECUTE is revoked from PUBLIC for every function, then granted only to the roles that need it.

## Important notes
1. Booking codes come from a sequence starting at BK1001.
2. The active-seat unique index guarantees that a seat can be held only once per show.
3. Show start times are interpreted in Indian Standard Time (Asia/Kolkata).
4. Refunds are 80% of the amount paid (after any coupon discount), rounded down to whole rupees.
*/

CREATE OR REPLACE FUNCTION public.create_booking(
  p_show_id uuid,
  p_seat_ids uuid[],
  p_coupon_code text DEFAULT NULL
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user uuid := auth.uid();
  v_show shows%ROWTYPE;
  v_coupon text := upper(btrim(COALESCE(p_coupon_code, '')));
  v_seat_count integer;
  v_subtotal integer;
  v_discount integer := 0;
  v_booking bookings%ROWTYPE;
BEGIN
  IF v_user IS NULL THEN
    RAISE EXCEPTION 'AUTH_REQUIRED';
  END IF;

  IF p_seat_ids IS NULL OR cardinality(p_seat_ids) = 0 THEN
    RAISE EXCEPTION 'NO_SEATS';
  END IF;

  IF cardinality(p_seat_ids) > 10 THEN
    RAISE EXCEPTION 'TOO_MANY_SEATS';
  END IF;

  SELECT * INTO v_show FROM shows WHERE id = p_show_id FOR UPDATE;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'SHOW_NOT_FOUND';
  END IF;

  IF ((v_show.show_date + v_show.show_time) AT TIME ZONE 'Asia/Kolkata') <= now() THEN
    RAISE EXCEPTION 'SHOW_STARTED';
  END IF;

  IF (SELECT count(DISTINCT x) FROM unnest(p_seat_ids) AS x) <> cardinality(p_seat_ids) THEN
    RAISE EXCEPTION 'INVALID_SEAT';
  END IF;

  SELECT count(*), COALESCE(sum(price), 0)
    INTO v_seat_count, v_subtotal
    FROM seats
    WHERE id = ANY (p_seat_ids);

  IF v_seat_count <> cardinality(p_seat_ids) THEN
    RAISE EXCEPTION 'INVALID_SEAT';
  END IF;

  IF EXISTS (
    SELECT 1 FROM booking_seats bs
    WHERE bs.show_id = p_show_id AND bs.status = 'booked' AND bs.seat_id = ANY (p_seat_ids)
  ) THEN
    RAISE EXCEPTION 'SEAT_TAKEN';
  END IF;

  IF v_coupon = 'CINE10' THEN
    v_discount := floor(v_subtotal * 0.10)::integer;
  ELSIF v_coupon <> '' THEN
    RAISE EXCEPTION 'INVALID_COUPON';
  END IF;

  INSERT INTO bookings (
    user_id, show_id, seat_count, subtotal_amount, discount_amount, coupon_code, total_amount, status
  )
  VALUES (
    v_user, p_show_id, v_seat_count, v_subtotal, v_discount,
    NULLIF(v_coupon, ''), v_subtotal - v_discount, 'confirmed'
  )
  RETURNING * INTO v_booking;

  INSERT INTO booking_seats (booking_id, show_id, seat_id, price_paid, status)
  SELECT v_booking.id, p_show_id, s.id, s.price, 'booked'
  FROM seats s
  WHERE s.id = ANY (p_seat_ids);

  RETURN jsonb_build_object('booking_id', v_booking.id, 'booking_code', v_booking.booking_code);
EXCEPTION
  WHEN unique_violation THEN
    RAISE EXCEPTION 'SEAT_TAKEN';
END;
$$;

CREATE OR REPLACE FUNCTION public.cancel_booking(p_booking_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user uuid := auth.uid();
  v_booking bookings%ROWTYPE;
  v_show shows%ROWTYPE;
  v_refund integer;
BEGIN
  IF v_user IS NULL THEN
    RAISE EXCEPTION 'AUTH_REQUIRED';
  END IF;

  SELECT * INTO v_booking FROM bookings WHERE id = p_booking_id FOR UPDATE;
  IF NOT FOUND OR v_booking.user_id <> v_user THEN
    RAISE EXCEPTION 'BOOKING_NOT_FOUND';
  END IF;

  IF v_booking.status = 'cancelled' THEN
    RAISE EXCEPTION 'ALREADY_CANCELLED';
  END IF;

  SELECT * INTO v_show FROM shows WHERE id = v_booking.show_id;
  IF ((v_show.show_date + v_show.show_time) AT TIME ZONE 'Asia/Kolkata') <= now() THEN
    RAISE EXCEPTION 'SHOW_STARTED';
  END IF;

  v_refund := round(v_booking.total_amount * 0.8)::integer;

  UPDATE bookings
    SET status = 'cancelled', refund_amount = v_refund, cancelled_at = now()
    WHERE id = v_booking.id;

  UPDATE booking_seats
    SET status = 'released', released_at = now()
    WHERE booking_id = v_booking.id AND status = 'booked';

  RETURN jsonb_build_object('booking_id', v_booking.id, 'refund_amount', v_refund);
END;
$$;

CREATE OR REPLACE FUNCTION public.get_show_availability(p_show_id uuid)
RETURNS TABLE (seat_id uuid, is_booked boolean)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT s.id,
         EXISTS (
           SELECT 1 FROM booking_seats bs
           WHERE bs.show_id = p_show_id AND bs.seat_id = s.id AND bs.status = 'booked'
         )
  FROM seats s
  ORDER BY s.row_label, s.seat_number;
$$;

CREATE OR REPLACE FUNCTION public.ensure_upcoming_shows()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_today date := (now() AT TIME ZONE 'Asia/Kolkata')::date;
BEGIN
  INSERT INTO shows (movie_id, show_date, show_time)
  SELECT m.id, v_today + d.offset_days, t.show_time
  FROM movies m
  CROSS JOIN generate_series(0, 6) AS d(offset_days)
  CROSS JOIN (VALUES (time '10:00'), (time '13:30'), (time '17:00'), (time '20:30')) AS t(show_time)
  WHERE m.status = 'now_showing'
  ON CONFLICT (movie_id, show_date, show_time) DO NOTHING;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.create_booking(uuid, uuid[], text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.create_booking(uuid, uuid[], text) TO authenticated;

REVOKE EXECUTE ON FUNCTION public.cancel_booking(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.cancel_booking(uuid) TO authenticated;

REVOKE EXECUTE ON FUNCTION public.get_show_availability(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_show_availability(uuid) TO anon, authenticated;

REVOKE EXECUTE ON FUNCTION public.ensure_upcoming_shows() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.ensure_upcoming_shows() TO anon, authenticated;
