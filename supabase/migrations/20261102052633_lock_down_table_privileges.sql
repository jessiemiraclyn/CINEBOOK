/*
# Lock down table privileges to the minimum the app needs

1. Summary
- Removes the broad insert, update and delete privileges that the project default granted to the public API roles on every CineBook table.
- Re-grants only the access the app actually uses. Row level security still decides which rows each role can see.

2. Security changes
- anon: read-only on movies, shows and seats (public catalogue).
- authenticated: read on movies, shows, seats, bookings and booking_seats; read on users.
- authenticated: write on movies and shows (admin only, enforced by existing is_admin() policies).
- users: authenticated may update only full_name. role, email and id are not writable by the user, which prevents self-promotion to admin.
- Bookings are created and cancelled only through the create_booking and cancel_booking functions, so no direct write grant is given on bookings or booking_seats.

3. Notes
- Idempotent: safe to re-run.
- No data is changed; only privileges are revoked and re-granted.
*/

REVOKE ALL ON ALL TABLES IN SCHEMA public FROM anon, authenticated;

GRANT SELECT ON movies, shows, seats TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON movies, shows TO authenticated;
GRANT SELECT ON bookings, booking_seats TO authenticated;
GRANT SELECT ON users TO authenticated;
REVOKE UPDATE ON users FROM authenticated;
GRANT UPDATE (full_name) ON users TO authenticated;
