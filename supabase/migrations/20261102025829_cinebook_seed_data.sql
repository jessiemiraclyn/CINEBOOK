/*
# Seed cinema seats and sample movies

## Plain-English summary
Loads the fixed 40-seat cinema layout (rows A to E, 8 seats each, priced Regular Rs.150, Premium Rs.250, VIP Rs.400),
eight sample movies with posters and descriptions, and showtimes for the coming week.

## Changes
- seats: 40 rows inserted (A and B regular, C and D premium, E VIP). Skipped if seats already exist.
- movies: 8 sample titles (5 now showing, 3 upcoming). Skipped if any movies already exist.
- shows: showtimes generated for the next 7 days through ensure_upcoming_shows().

## Security
No policy or permission changes. Seed rows are inserted by the migration owner.

## Important notes
1. The seed is idempotent: re-running it does not duplicate seats or movies.
2. Administrators can add, edit or delete movies and showtimes from the admin dashboard.
*/

INSERT INTO seats (row_label, seat_number, category, price)
SELECT r.row_label, n.seat_number,
  CASE WHEN r.row_label IN ('A', 'B') THEN 'regular'
       WHEN r.row_label IN ('C', 'D') THEN 'premium'
       ELSE 'vip' END,
  CASE WHEN r.row_label IN ('A', 'B') THEN 150
       WHEN r.row_label IN ('C', 'D') THEN 250
       ELSE 400 END
FROM (VALUES ('A'), ('B'), ('C'), ('D'), ('E')) AS r(row_label)
CROSS JOIN generate_series(1, 8) AS n(seat_number)
ON CONFLICT (row_label, seat_number) DO NOTHING;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM movies) THEN
    INSERT INTO movies (title, genre, language, duration_minutes, rating, description, poster_url, backdrop_url, status, is_trending, is_featured, release_date) VALUES
    ('Crimson Horizon', 'Sci-Fi Thriller', 'English', 142, 8.7,
     'When a deep-space relay goes silent near a dying red star, a crew of five is sent to find out why. What they uncover on the surface will force them to choose between their mission and their lives.',
     'https://images.pexels.com/photos/7661607/pexels-photo-7661607.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
     'https://images.pexels.com/photos/7991491/pexels-photo-7991491.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
     'now_showing', true, true, NULL),
    ('The Last Monsoon', 'Drama', 'Hindi', 128, 8.2,
     'A retired photographer returns to the coastal city of his youth as the rains arrive, reconnecting with the people and memories he left behind during one unforgettable season.',
     'https://images.pexels.com/photos/13081038/pexels-photo-13081038.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
     NULL, 'now_showing', true, false, NULL),
    ('Midnight in Marrakesh', 'Action Adventure', 'English', 118, 7.9,
     'A cartographer with a stolen map races through the labyrinthine markets and desert roads of Morocco, pursued by a syndicate that will stop at nothing to claim the hidden route.',
     'https://images.pexels.com/photos/6280847/pexels-photo-6280847.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
     NULL, 'now_showing', false, false, NULL),
    ('Neon Requiem', 'Noir Mystery', 'English', 105, 7.5,
     'In a city that never sleeps under endless rain, a disgraced detective takes one last case that leads straight into the glowing heart of a corporation built on secrets.',
     'https://images.pexels.com/photos/10833993/pexels-photo-10833993.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
     NULL, 'now_showing', true, false, NULL),
    ('Harbour of Echoes', 'Romance Drama', 'Tamil', 135, 8.0,
     'Two strangers stranded by a sudden storm at a quiet harbour discover that the town holds a love story neither of them expected to find, or to lose, so soon.',
     'https://images.pexels.com/photos/37984968/pexels-photo-37984968.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
     NULL, 'now_showing', true, false, NULL),
    ('Starfall Protocol', 'Science Fiction', 'English', 138, 0,
     'Humanity''s first interstellar colony ship receives a warning from the future. Its crew has one chance to change the course of history before the stars fall.',
     'https://images.pexels.com/photos/17954395/pexels-photo-17954395.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
     NULL, 'upcoming', false, false, DATE '2026-12-05'),
    ('Velvet Nights', 'Comedy', 'English', 110, 0,
     'A chaotic wedding weekend in the hills spirals out of control when the bride, the groom, and their families all discover the same missing heirloom is hidden somewhere on the property.',
     'https://images.pexels.com/photos/12752962/pexels-photo-12752962.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
     NULL, 'upcoming', false, false, DATE '2026-11-20'),
    ('The Iron Orchard', 'Fantasy Adventure', 'English', 152, 0,
     'Beneath a castle wrapped in eternal mist, a young cartographer awakens an ancient orchard of iron trees and must cross a forbidden kingdom before its guardians wake.',
     'https://images.pexels.com/photos/31381044/pexels-photo-31381044.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
     NULL, 'upcoming', false, false, DATE '2026-12-18');
  END IF;
END $$;

SELECT public.ensure_upcoming_shows();
