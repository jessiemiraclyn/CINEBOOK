import type { Movie } from '@/types/cinema';

const GENRE_SEPARATOR = /[,/]/;

export function splitGenres(genre: string): string[] {
  return genre
    .split(GENRE_SEPARATOR)
    .map((part) => part.trim())
    .filter(Boolean);
}

export function collectGenres(movies: Movie[]): string[] {
  return [...new Set(movies.flatMap((movie) => splitGenres(movie.genre)))].sort((a, b) => a.localeCompare(b));
}

export function matchesGenre(movie: Movie, genre: string | null): boolean {
  return genre === null || splitGenres(movie.genre).includes(genre);
}
