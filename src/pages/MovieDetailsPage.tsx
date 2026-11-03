import { useState } from 'react';
import { AlertTriangle, ArrowLeft, Armchair, CalendarDays, Clock, Globe2, Star, Ticket } from 'lucide-react';
import Button from '@/components/ui/Button';
import ErrorMessage from '@/components/ui/ErrorMessage';
import PosterImage from '@/components/ui/PosterImage';
import Spinner from '@/components/ui/Spinner';
import PageContainer from '@/components/layout/PageContainer';
import ShowPicker from '@/components/movie-details/ShowPicker';
import { useAsyncData } from '@/hooks/useAsyncData';
import { navigate } from '@/hooks/useHashRoute';
import { formatDuration, formatShowDate, formatShowTime } from '@/lib/format';
import { ensureUpcomingShows, fetchMovie, fetchUpcomingShowsForMovie } from '@/services/movies';
import type { Show } from '@/types/cinema';

async function loadMovieDetails(movieId: string) {
  await ensureUpcomingShows().catch(() => undefined);
  const [movie, shows] = await Promise.all([fetchMovie(movieId), fetchUpcomingShowsForMovie(movieId)]);
  if (!movie) throw new Error('This movie could not be found.');
  return { movie, shows };
}

export default function MovieDetailsPage({ movieId }: { movieId: string }) {
  const details = useAsyncData(() => loadMovieDetails(movieId), [movieId]);
  const [selectedShow, setSelectedShow] = useState<Show | null>(null);

  if (details.loading) {
    return (
      <PageContainer>
        <Spinner label="Loading movie" />
      </PageContainer>
    );
  }

  if (details.error || !details.data) {
    return (
      <PageContainer>
        <div className="flex flex-col items-start gap-4">
          <ErrorMessage message={details.error ?? 'This movie could not be loaded.'} />
          <Button variant="secondary" onClick={() => navigate('/movies')}>
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Back to movies
          </Button>
        </div>
      </PageContainer>
    );
  }

  const { movie, shows } = details.data;
  const bookable = movie.status === 'now_showing';
  const backdrop = movie.backdrop_url ?? movie.poster_url;

  const facts = [
    { label: 'Duration', value: formatDuration(movie.duration_minutes), icon: Clock },
    { label: 'Language', value: movie.language, icon: Globe2 },
    {
      label: 'Rating',
      value: movie.rating > 0 ? `${movie.rating.toFixed(1)} / 10` : 'Not rated yet',
      icon: Star,
    },
    {
      label: bookable ? 'Status' : 'Release',
      value: bookable ? 'Now showing' : movie.release_date ? formatShowDate(movie.release_date) : 'Coming soon',
      icon: CalendarDays,
    },
  ];

  return (
    <div className="animate-fade-up">
      <section className="relative isolate overflow-hidden pb-16 pt-28 lg:pt-36">
        <PosterImage
          src={backdrop}
          alt=""
          className="absolute inset-0 -z-20 h-full w-full scale-110 object-cover object-center opacity-45 blur-[2px]"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-ink-950/40 via-ink-950/80 to-ink-950" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-ink-950 via-ink-950/60 to-transparent" />

        <PageContainer className="!pt-0">
          <button
            type="button"
            onClick={() => navigate('/movies')}
            className="mb-10 inline-flex items-center gap-2 rounded-full text-xs font-semibold uppercase tracking-[0.25em] text-muted transition hover:text-cyan-300"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            All movies
          </button>

          <div className="grid items-end gap-10 lg:grid-cols-12 lg:gap-8">
            <div className="order-2 lg:order-1 lg:col-span-7">
              <p className="cinema-label">{movie.genre}</p>
              <h1 className="mt-4 font-display text-[clamp(3.5rem,9vw,8.5rem)] uppercase leading-[0.86] tracking-tight text-soft">
                {movie.title}
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted">{movie.description}</p>

              <dl className="mt-10 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 sm:grid-cols-4">
                {facts.map((fact) => {
                  const Icon = fact.icon;
                  return (
                    <div key={fact.label} className="bg-ink-950/80 p-5 backdrop-blur">
                      <dt className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-muted">
                        <Icon className="h-3.5 w-3.5 text-cyan-400" aria-hidden="true" />
                        {fact.label}
                      </dt>
                      <dd className="mt-2 font-display text-2xl uppercase tracking-wide text-soft">{fact.value}</dd>
                    </div>
                  );
                })}
              </dl>
            </div>

            <div className="relative order-1 mx-auto w-full max-w-xs sm:max-w-sm lg:order-2 lg:col-span-5 lg:mx-0 lg:ml-auto lg:max-w-md">
              <div className="absolute -inset-6 -z-10 rounded-[2rem] bg-brand-600/20 blur-3xl" aria-hidden="true" />
              <div className="rotate-2 rounded-2xl border border-white/10 bg-ink-900 p-2 shadow-[0_40px_120px_-20px_rgba(135,60,255,0.45)] transition duration-700 hover:rotate-0">
                <PosterImage
                  src={movie.poster_url}
                  alt={`${movie.title} poster`}
                  className="aspect-[2/3] w-full rounded-xl"
                />
              </div>
            </div>
          </div>
        </PageContainer>
      </section>

      <PageContainer className="!pt-16">
        <section className="grid gap-12 pb-32 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-4">
            <p className="cinema-label">The programme</p>
            <h2 className="section-title mt-3">Screenings</h2>
            <p className="mt-4 text-sm leading-relaxed text-muted">
              Choose a date and showtime. Seats are reserved for the show you select, and every screening has its own availability.
            </p>
          </div>

          <div className="lg:col-span-8">
            {bookable ? (
              <ShowPicker shows={shows} selectedShowId={selectedShow?.id ?? null} onSelect={setSelectedShow} />
            ) : (
              <p className="flex items-start gap-3 rounded-2xl border border-cyan-400/30 bg-cyan-400/5 px-5 py-5 text-sm text-soft/90">
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-cyan-300" aria-hidden="true" />
                Ticket booking opens when this movie is released. Check the Next Premiere section for updates.
              </p>
            )}
          </div>
        </section>
      </PageContainer>

      {bookable && (
        <div className="fixed inset-x-0 bottom-0 z-30 border-t border-white/10 bg-ink-950/90 backdrop-blur-xl">
          <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
            <div className="min-w-0">
              {selectedShow ? (
                <>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted">Selected screening</p>
                  <p className="flex items-center gap-2 font-display text-xl uppercase tracking-wide text-soft">
                    <Armchair className="h-4 w-4 text-gold-400" aria-hidden="true" />
                    {formatShowDate(selectedShow.show_date)} · {formatShowTime(selectedShow.show_time)}
                  </p>
                </>
              ) : (
                <p className="text-sm text-muted">Pick a date and showtime to continue.</p>
              )}
            </div>
            <Button
              size="lg"
              disabled={!selectedShow}
              onClick={() => selectedShow && navigate(`/book/${selectedShow.id}`)}
              className="w-full sm:w-auto"
            >
              <Ticket className="h-4 w-4" aria-hidden="true" />
              Book tickets
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
