import { CalendarDays, Clock, Globe2, Star, Ticket } from 'lucide-react';
import PosterImage from '@/components/ui/PosterImage';
import { formatDuration, formatShowDate } from '@/lib/format';
import type { Movie } from '@/types/cinema';

interface MovieCardProps {
  movie: Movie;
  className?: string;
  large?: boolean;
}

export default function MovieCard({ movie, className = '', large = false }: MovieCardProps) {
  const detailsHref = `#/movies/${movie.id}`;
  const bookable = movie.status === 'now_showing';

  return (
    <article
      className={`group relative flex flex-col overflow-hidden rounded-2xl border border-white/5 bg-ink-900 transition duration-500 hover:-translate-y-1.5 hover:border-cyan-400/40 hover:shadow-[0_24px_60px_-18px_rgba(77,235,255,0.35)] ${className}`}
    >
      <a
        href={detailsHref}
        className={`relative block overflow-hidden ${large ? 'aspect-[4/5] lg:aspect-auto lg:h-full' : 'aspect-[2/3]'}`}
        aria-label={`View details for ${movie.title}`}
      >
        <PosterImage
          src={movie.poster_url}
          alt={`${movie.title} poster`}
          className="h-full w-full transition duration-700 ease-out group-hover:scale-110 group-hover:brightness-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/20 to-transparent opacity-80 transition duration-500 group-hover:opacity-95" />
        <div className="absolute inset-0 bg-gradient-to-br from-brand-600/0 to-cyan-400/0 transition duration-500 group-hover:from-brand-600/25 group-hover:to-cyan-400/10" />

        <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
          {movie.is_trending && (
            <span className="rounded-sm bg-gold-400 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-ink-950">
              Trending
            </span>
          )}
          {!bookable && (
            <span className="rounded-sm border border-cyan-400/50 bg-ink-950/70 px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-cyan-300 backdrop-blur">
              Upcoming
            </span>
          )}
        </div>

        {movie.rating > 0 && (
          <span className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-ink-950/75 px-2.5 py-1 text-xs font-semibold text-soft backdrop-blur">
            <Star className="h-3 w-3 fill-gold-400 text-gold-400" aria-hidden="true" />
            {movie.rating.toFixed(1)}
          </span>
        )}

        <div className="absolute inset-x-0 bottom-0 translate-y-2 p-4 opacity-0 transition duration-500 group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:opacity-100">
          <p className="text-xs uppercase tracking-[0.2em] text-cyan-300">{movie.genre}</p>
        </div>
      </a>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="min-w-0">
          <h3
            className={`truncate font-display uppercase tracking-wide text-soft transition duration-300 group-hover:text-gold-400 ${
              large ? 'text-4xl' : 'text-2xl'
            }`}
            title={movie.title}
          >
            {movie.title}
          </h3>
          <p className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted">
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
              className="flex w-full items-center justify-center gap-2 rounded-full bg-brand-600 py-2.5 text-sm font-semibold uppercase tracking-wider text-white transition duration-300 hover:bg-brand-500 hover:shadow-[0_0_24px_rgba(49,85,255,0.6)] active:scale-[0.98]"
            >
              <Ticket className="h-4 w-4" aria-hidden="true" />
              Book now
            </a>
          ) : (
            <a
              href={detailsHref}
              className="flex w-full items-center justify-center rounded-full border border-white/15 py-2.5 text-sm font-semibold uppercase tracking-wider text-soft transition duration-300 hover:border-cyan-400/60 hover:text-cyan-300"
            >
              View details
            </a>
          )}
        </div>
      </div>
    </article>
  );
}
