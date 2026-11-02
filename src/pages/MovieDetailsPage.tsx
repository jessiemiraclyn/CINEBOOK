import { useState } from 'react';
import { AlertTriangle, ArrowLeft, Armchair, Clock, Globe2, Star, Ticket } from 'lucide-react';
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

  return (
    <PageContainer className="animate-fade-up">
      <button
        type="button"
        onClick={() => navigate('/movies')}
        className="mb-8 inline-flex items-center gap-2 rounded-full text-sm text-zinc-400 transition hover:text-white"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        All movies
      </button>

      <div className="grid gap-10 lg:grid-cols-[minmax(0,320px)_1fr] lg:gap-14">
        <div className="mx-auto w-full max-w-xs lg:mx-0 lg:max-w-none">
          <div className="relative overflow-hidden rounded-2xl border border-white/10 shadow-2xl shadow-black/60">
            <PosterImage src={movie.poster_url} alt={`${movie.title} poster`} className="aspect-[2/3] w-full" />
          </div>
        </div>

        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-widest text-brand-400">{movie.genre}</p>
          <h1 className="mt-2 font-display text-6xl leading-none tracking-wide text-white sm:text-7xl">{movie.title}</h1>

          <dl className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div className="rounded-xl border border-white/10 bg-ink-850 p-4">
              <dt className="flex items-center gap-1.5 text-xs uppercase tracking-wider text-zinc-500"><Clock className="h-3.5 w-3.5" aria-hidden="true" />Duration</dt>
              <dd className="mt-1.5 font-semibold text-white">{formatDuration(movie.duration_minutes)}</dd>
            </div>
            <div className="rounded-xl border border-white/10 bg-ink-850 p-4">
              <dt className="flex items-center gap-1.5 text-xs uppercase tracking-wider text-zinc-500"><Globe2 className="h-3.5 w-3.5" aria-hidden="true" />Language</dt>
              <dd className="mt-1.5 font-semibold text-white">{movie.language}</dd>
            </div>
            <div className="rounded-xl border border-white/10 bg-ink-850 p-4">
              <dt className="flex items-center gap-1.5 text-xs uppercase tracking-wider text-zinc-500"><Star className="h-3.5 w-3.5" aria-hidden="true" />Rating</dt>
              <dd className="mt-1.5 font-semibold text-white">{movie.rating > 0 ? `${movie.rating.toFixed(1)} / 10` : 'Not rated yet'}</dd>
            </div>
            <div className="rounded-xl border border-white/10 bg-ink-850 p-4">
              <dt className="text-xs uppercase tracking-wider text-zinc-500">{bookable ? 'Status' : 'Release'}</dt>
              <dd className="mt-1.5 font-semibold text-white">
                {bookable ? 'Now showing' : movie.release_date ? formatShowDate(movie.release_date) : 'Coming soon'}
              </dd>
            </div>
          </dl>

          <h2 className="mt-10 text-sm font-semibold uppercase tracking-wider text-zinc-400">Synopsis</h2>
          <p className="mt-3 max-w-2xl text-base leading-relaxed text-zinc-300">{movie.description}</p>

          <div className="mt-10 border-t border-white/10 pt-10">
            <h2 className="section-title text-3xl sm:text-4xl">Showtimes</h2>
            <div className="mt-6">
              {bookable ? (
                <ShowPicker
                  shows={shows}
                  selectedShowId={selectedShow?.id ?? null}
                  onSelect={setSelectedShow}
                />
              ) : (
                <p className="flex items-start gap-3 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-4 text-sm text-amber-100">
                  <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-300" aria-hidden="true" />
                  Ticket booking opens when this movie is released. Check the Upcoming section for updates.
                </p>
              )}
            </div>
          </div>

          {bookable && (
            <div className="glass-panel sticky bottom-4 mt-10 flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                {selectedShow ? (
                  <>
                    <p className="text-sm text-zinc-400">Selected show</p>
                    <p className="flex items-center gap-2 font-semibold text-white">
                      <Armchair className="h-4 w-4 text-brand-400" aria-hidden="true" />
                      {formatShowDate(selectedShow.show_date)} at {formatShowTime(selectedShow.show_time)}
                    </p>
                  </>
                ) : (
                  <p className="text-sm text-zinc-400">Pick a date and showtime to continue.</p>
                )}
              </div>
              <Button
                size="lg"
                disabled={!selectedShow}
                onClick={() => selectedShow && navigate(`/book/${selectedShow.id}`)}
                className="w-full sm:w-auto"
              >
                <Ticket className="h-4 w-4" aria-hidden="true" />
                Book Tickets
              </Button>
            </div>
          )}
        </div>
      </div>
    </PageContainer>
  );
}
