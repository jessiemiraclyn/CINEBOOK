import { Clock, Globe2, Play, Star, Ticket } from 'lucide-react';
import PosterImage from '@/components/ui/PosterImage';
import { formatDuration } from '@/lib/format';
import { navigate } from '@/hooks/useHashRoute';
import type { Movie } from '@/types/cinema';

export default function HeroBanner({ movie }: { movie: Movie }) {
  const image = movie.backdrop_url ?? movie.poster_url;

  return (
    <section className="relative isolate flex min-h-[92vh] items-end overflow-hidden pt-16">
      <PosterImage
        src={image}
        alt=""
        className="absolute inset-0 -z-20 h-full w-full scale-110 object-cover object-center animate-drift"
      />
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-ink-950 via-ink-950/75 to-ink-950/25" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-ink-950 via-ink-950/30 to-ink-950/50" />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-1/4 top-0 -z-10 h-[70%] w-[80%] animate-drift rounded-full bg-brand-600/20 blur-[120px]"
      />

      <div className="mx-auto w-full max-w-7xl px-4 pb-16 pt-32 sm:px-6 sm:pb-20 lg:px-8">
        <div className="max-w-2xl">
          <p className="animate-fade-up cinema-label">
            <span className="h-px w-8 bg-gold-400" aria-hidden="true" />
            Your next movie experience starts here.
          </p>

          <h1 className="animate-fade-up mt-5 font-display text-7xl leading-[0.9] tracking-wide text-white [animation-delay:120ms] sm:text-8xl lg:text-9xl">
            {movie.title}
          </h1>

          <p className="animate-fade-up mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-zinc-300 [animation-delay:200ms]">
            <span className="rounded-full border border-gold-400/40 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-gold-300">
              {movie.genre}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="h-4 w-4 text-zinc-400" aria-hidden="true" />
              {formatDuration(movie.duration_minutes)}
            </span>
            <span className="flex items-center gap-1.5">
              <Globe2 className="h-4 w-4 text-zinc-400" aria-hidden="true" />
              {movie.language}
            </span>
            {movie.rating > 0 && (
              <span className="flex items-center gap-1.5">
                <Star className="h-4 w-4 fill-gold-400 text-gold-400" aria-hidden="true" />
                {movie.rating.toFixed(1)} / 10
              </span>
            )}
          </p>

          <p className="animate-fade-up mt-6 line-clamp-3 max-w-xl text-base leading-relaxed text-zinc-300 [animation-delay:280ms]">
            {movie.description}
          </p>

          <div className="animate-fade-up mt-10 flex flex-wrap gap-4 [animation-delay:360ms]">
            <button
              type="button"
              onClick={() => navigate(`/movies/${movie.id}`)}
              className="inline-flex h-12 items-center gap-2 rounded-full bg-brand-600 px-7 text-sm font-semibold tracking-wide text-white shadow-xl shadow-brand-600/30 transition duration-300 hover:bg-brand-500 hover:shadow-brand-600/50 active:scale-[0.98]"
            >
              <Ticket className="h-4 w-4" aria-hidden="true" />
              Book Your Experience
            </button>
            <button
              type="button"
              onClick={() => navigate('/movies')}
              className="inline-flex h-12 items-center gap-2 rounded-full border border-gold-400/40 bg-white/5 px-7 text-sm font-semibold tracking-wide text-gold-200 backdrop-blur transition duration-300 hover:border-gold-400 hover:bg-gold-400/10"
            >
              <Play className="h-4 w-4 fill-current" aria-hidden="true" />
              Explore Movies
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
