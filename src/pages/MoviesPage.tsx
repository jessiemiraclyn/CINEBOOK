import { useEffect, useMemo, useState } from 'react';
import Button from '@/components/ui/Button';
import ErrorMessage from '@/components/ui/ErrorMessage';
import MovieSection from '@/components/movies/MovieSection';
import SearchInput, { matchesMovieQuery } from '@/components/movies/SearchInput';
import PageContainer from '@/components/layout/PageContainer';
import { useAsyncData } from '@/hooks/useAsyncData';
import { useHashRoute } from '@/hooks/useHashRoute';
import { fetchMovies } from '@/services/movies';
import type { MovieStatus } from '@/types/cinema';
import { RotateCw } from 'lucide-react';

type StatusFilter = 'all' | MovieStatus;

const FILTERS: { value: StatusFilter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'now_showing', label: 'Now Showing' },
  { value: 'upcoming', label: 'Upcoming' },
];

export default function MoviesPage() {
  const catalog = useAsyncData(fetchMovies);
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<StatusFilter>('all');
  const { params } = useHashRoute();
  const routeStatus = params.get('status');

  useEffect(() => {
    if (routeStatus === 'upcoming' || routeStatus === 'now_showing') setFilter(routeStatus);
  }, [routeStatus]);

  const visibleMovies = useMemo(() => {
    if (!catalog.data) return null;
    return catalog.data.filter(
      (movie) => (filter === 'all' || movie.status === filter) && matchesMovieQuery(movie, query),
    );
  }, [catalog.data, filter, query]);

  return (
    <PageContainer>
      <div className="mb-10 animate-fade-up">
        <p className="text-xs font-semibold uppercase tracking-widest text-brand-400">Catalogue</p>
        <h1 className="section-title mt-2">Movies</h1>
        <p className="mt-2 max-w-xl text-sm text-zinc-400">
          Browse everything playing at CineBook and pick the show that suits you.
        </p>
      </div>

      <div className="mb-10 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div role="tablist" aria-label="Filter by status" className="no-scrollbar flex gap-2 overflow-x-auto">
          {FILTERS.map((item) => {
            const active = filter === item.value;
            return (
              <button
                key={item.value}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setFilter(item.value)}
                className={`shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition duration-300 ${
                  active
                    ? 'border-brand-500 bg-brand-600 text-white shadow-lg shadow-brand-900/40'
                    : 'border-white/10 bg-white/5 text-zinc-300 hover:border-white/25 hover:text-white'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>
        <SearchInput value={query} onChange={setQuery} />
      </div>

      {catalog.error ? (
        <div className="flex flex-col items-start gap-4">
          <ErrorMessage message={`We could not load movies. ${catalog.error}`} />
          <Button variant="secondary" onClick={catalog.reload}>
            <RotateCw className="h-4 w-4" aria-hidden="true" />
            Try again
          </Button>
        </div>
      ) : (
        <MovieSection
          id="browse"
          title={FILTERS.find((item) => item.value === filter)?.label ?? 'Movies'}
          movies={visibleMovies}
          emptyMessage={
            query.trim()
              ? `No movies match "${query.trim()}" in this category.`
              : 'No movies in this category yet.'
          }
        />
      )}
    </PageContainer>
  );
}
