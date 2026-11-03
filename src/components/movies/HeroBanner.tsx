import { ArrowRight, CalendarDays, Clock, Globe2, Star } from 'lucide-react';
import PosterImage from '@/components/ui/PosterImage';
import { formatDuration, formatShowDate } from '@/lib/format';
import { navigate } from '@/hooks/useHashRoute';
import type { Movie } from '@/types/cinema';

interface HeroBannerProps {
  movie: Movie;
  position: number;
  total: number;
}

export default function HeroBanner({ movie, position, total }: HeroBannerProps) {
  const backdrop = movie.backdrop_url ?? movie.poster_url;
  const indexLabel = `${String(position).padStart(2, '0')} / ${String(total).padStart(2, '0')}`;

  return (
    <section className="relative isolate flex min-h-[100svh] items-center overflow-hidden pb-16 pt-28 lg:pt-32">
      <PosterImage
        src={backdrop}
        alt=""
        className="absolute inset-0 -z-30 h-full w-full scale-110 object-cover object-center opacity-40 blur-sm animate-drift"
      />
      <div className="absolute inset-0 -z-20 bg-gradient-to-r from-ink-950 via-ink-950/85 to-ink-950/40" />
      <div className="absolute inset-0 -z-20 bg-gradient-to-t from-ink-950 via-transparent to-ink-950/60" />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-32 top-1/4 -z-10 h-[32rem] w-[32rem] rounded-full border border-cyan-400/20 animate-spin-slow"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-20 top-1/3 -z-10 h-[24rem] w-[24rem] rounded-full border border-dashed border-gold-400/25 animate-spin-slow [animation-direction:reverse]"
      />

      <p
        aria-hidden="true"
        className="absolute right-4 top-1/2 hidden -translate-y-1/2 font-display text-sm tracking-[0.4em] text-muted [writing-mode:vertical-rl] lg:block"
      >
        {indexLabel} · NOW ON SCREEN
      </p>

      <div className="mx-auto grid w-full max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-12 lg:gap-8 lg:px-8">
        <div className="lg:col-span-7">
          <p className="animate-fade-up cinema-label">
            <span className="h-px w-10 bg-cyan-400" aria-hidden="true" />
            The Midnight Cinema Club
          </p>

          <h1 className="animate-fade-up mt-6 font-display text-[clamp(3.75rem,11vw,10.5rem)] uppercase leading-[0.86] tracking-tight text-soft [animation-delay:120ms]">
            Tonight,
            <span className="block bg-gradient-to-r from-cyan-400 via-brand-500 to-ultra-500 bg-clip-text text-transparent">
              escape reality.
            </span>
          </h1>

          <div className="animate-fade-up mt-8 flex flex-col gap-4 [animation-delay:200ms]">
            <p className="font-display text-3xl uppercase tracking-wide text-gold-400 sm:text-4xl">
              {movie.title}
            </p>
            <p className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-soft/80">
              <span className="rounded-full border border-cyan-400/40 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-cyan-300">
                {movie.genre}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="h-4 w-4 text-muted" aria-hidden="true" />
                {formatDuration(movie.duration_minutes)}
              </span>
              <span className="flex items-center gap-1.5">
                <Globe2 className="h-4 w-4 text-muted" aria-hidden="true" />
                {movie.language}
              </span>
              {movie.release_date && (
                <span className="flex items-center gap-1.5">
                  <CalendarDays className="h-4 w-4 text-muted" aria-hidden="true" />
                  {formatShowDate(movie.release_date)}
                </span>
              )}
              {movie.rating > 0 && (
                <span className="flex items-center gap-1.5">
                  <Star className="h-4 w-4 fill-gold-400 text-gold-400" aria-hidden="true" />
                  {movie.rating.toFixed(1)} / 10
                </span>
              )}
            </p>
            <p className="line-clamp-3 max-w-xl text-base leading-relaxed text-muted">{movie.description}</p>
          </div>

          <div className="animate-fade-up mt-10 flex flex-wrap items-center gap-4 [animation-delay:300ms]">
            <button
              type="button"
              onClick={() => navigate(`/movies/${movie.id}`)}
              className="group relative inline-flex h-14 items-center gap-3 overflow-hidden rounded-full bg-gold-400 px-8 font-display text-lg uppercase tracking-wider text-ink-950 shadow-[0_0_32px_rgba(213,255,80,0.35)] transition duration-300 hover:shadow-[0_0_48px_rgba(213,255,80,0.55)] active:scale-[0.98]"
            >
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-y-0 left-0 w-1/3 -skew-x-12 bg-white/50 opacity-0 transition duration-500 group-hover:translate-x-[300%] group-hover:opacity-100"
              />
              Book your seat
              <ArrowRight className="h-5 w-5 transition duration-300 group-hover:translate-x-1" aria-hidden="true" />
            </button>
            <a
              href="#/movies"
              className="inline-flex h-14 items-center rounded-full border border-white/15 px-7 text-sm font-semibold uppercase tracking-wider text-soft transition duration-300 hover:border-cyan-400/60 hover:text-cyan-300"
            >
              Explore movies
            </a>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-xs sm:max-w-sm lg:col-span-5 lg:mx-0 lg:ml-auto lg:max-w-md">
          <div className="relative -rotate-3 animate-fade-in rounded-2xl border border-white/10 bg-ink-900 p-2 shadow-[0_40px_120px_-20px_rgba(49,85,255,0.45)] transition duration-700 hover:rotate-0">
            <PosterImage
              src={movie.poster_url}
              alt={`${movie.title} poster`}
              className="aspect-[2/3] w-full rounded-xl"
            />
            <div className="absolute -bottom-6 -left-6 flex items-center gap-3 rounded-xl border border-cyan-400/30 bg-ink-950/80 px-4 py-3 shadow-xl backdrop-blur-xl animate-float">
              <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-gold-400" aria-hidden="true" />
              <span className="text-xs font-semibold uppercase tracking-[0.25em] text-soft">Screening live</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
