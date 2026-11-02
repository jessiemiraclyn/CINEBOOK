import { CalendarDays, Clock, Globe2, Star, Ticket } from 'lucide-react';
import PosterImage from '@/components/ui/PosterImage';
import { formatDuration, formatShowDate } from '@/lib/format';
import type { Movie } from '@/types/cinema';

interface MovieCardProps {
  movie: Movie;
}

export default function MovieCard({ movie }: MovieCardProps) {
  const detailsHref = `#/movies/${movie.id}`;
  const bookable = movie.status === 'now_showing';

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-2xl border border-white/5 bg-ink-850 shadow-lg shadow-black/30 transition duration-500 hover:-translate-y-1.5 hover:border-brand-600/50 hover:shadow-2xl hover:shadow-brand-900/30">
      <a href={detailsHref} className="relative block aspect-[2/3] overflow-hidden" aria-label={`View details for ${movie.title}`}>
        <PosterImage
          src={movie.poster_url}
          alt={`${movie.title} poster`}
          className="h-full w-full transition duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent opacity-60 transition duration-500 group-hover:opacity-90" />

        <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
          {movie.is_trending && (
            <span className="rounded-full bg-brand-600 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-white shadow-lg">
              Trending
            </span>
          )}
          {!bookable && (
            <span className="rounded-full bg-black/60 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-amber-300 backdrop-blur">
              Upcoming
            </span>
          )}
        </div>

        {movie.rating > 0 && (
          <span className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-black/70 px-2 py-1 text-xs font-semibold text-white backdrop-blur">
            <Star className="h-3 w-3 fill-warning-400 text-warning-400" aria-hidden="true" />
            {movie.rating.toFixed(1)}
          </span>
        )}

        <div className="absolute inset-x-0 bottom-0 flex flex-col gap-3 p-4 opacity-0 transition duration-500 group-hover:opacity-100 group-focus-within:opacity-100">
          <p className="text-xs text-zinc-300">{movie.genre}</p>
        </div>
      </a>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="min-w-0">
          <h3 className="truncate text-base font-semibold text-white" title={movie.title}>
            {movie.title}
          </h3>
          <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-zinc-400">
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" aria-hidden="true" />
              {formatDuration(movie.duration_minutes)}
            </span>
            <span className="flex items-center gap-1">
              <Globe2 className="h-3 w-3" aria-hidden="true" />
              {movie.language}
            </span>
            {movie.release_date && (
              <span className="flex items-center gap-1">
                <CalendarDays className="h-3 w-3" aria-hidden="true" />
                {formatShowDate(movie.release_date)}
              </span>
            )}
          </p>
        </div>

        <div className="mt-auto">
          {bookable ? (
            <a
              href={detailsHref}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-brand-600 py-2.5 text-sm font-medium text-white transition duration-300 hover:bg-brand-500 hover:shadow-lg hover:shadow-brand-900/50 active:scale-[0.98]"
            >
              <Ticket className="h-4 w-4" aria-hidden="true" />
              Book Now
            </a>
          ) : (
            <a
              href={detailsHref}
              className="flex w-full items-center justify-center rounded-full border border-white/15 py-2.5 text-sm font-medium text-white transition duration-300 hover:border-white/30 hover:bg-white/5"
            >
              View Details
            </a>
          )}
        </div>
      </div>
    </article>
  );
}
