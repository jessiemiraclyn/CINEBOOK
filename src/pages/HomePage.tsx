import { useMemo, useState } from 'react';
import { Film, RotateCw } from 'lucide-react';
import Button from '@/components/ui/Button';
import ErrorMessage from '@/components/ui/ErrorMessage';
import HeroBanner from '@/components/movies/HeroBanner';
import GenreFilter from '@/components/movies/GenreFilter';
import MovieSection from '@/components/movies/MovieSection';
import SearchInput, { matchesMovieQuery } from '@/components/movies/SearchInput';
import PageContainer from '@/components/layout/PageContainer';
import { useAsyncData } from '@/hooks/useAsyncData';
import { collectGenres, matchesGenre } from '@/lib/genres';
import { fetchMovies } from '@/services/movies';

const FAVOURITES_LIMIT = 5;

export default function HomePage() {
  const catalog = useAsyncData(fetchMovies);
  const [query, setQuery] = useState('');
  const [genre, setGenre] = useState<string | null>(null);

  const movies = catalog.data;
  const featured = useMemo(() => {
    if (!movies) return null;
    return movies.find((movie) => movie.is_featured && movie.status === 'now_showing')
      ?? movies.find((movie) => movie.status === 'now_showing')
      ?? movies[0]
      ?? null;
  }, [movies]);

  const genres = useMemo(() => (movies ? collectGenres(movies) : []), [movies]);

  const visibleMovies = useMemo(
    () => movies?.filter((movie) => matchesGenre(movie, genre) && matchesMovieQuery(movie, query)) ?? null,
    [movies, genre, query],
  );

  const favourites = useMemo(
    () =>
      (visibleMovies ?? [])
        .filter((movie) => movie.rating > 0)
        .sort((a, b) => b.rating - a.rating)
        .slice(0, FAVOURITES_LIMIT),
    [visibleMovies],
  );

  if (catalog.error) {
    return (
      <PageContainer>
        <div className="flex flex-col items-start gap-4">
          <ErrorMessage message={`We could not load movies. ${catalog.error}`} />
          <Button variant="secondary" onClick={catalog.reload}>
            <RotateCw className="h-4 w-4" aria-hidden="true" />
            Try again
          </Button>
        </div>
      </PageContainer>
    );
  }

  if (movies && movies.length === 0) {
    return (
      <PageContainer>
        <div className="flex flex-col items-center gap-3 py-24 text-center">
          <Film className="h-10 w-10 text-zinc-500" aria-hidden="true" />
          <h1 className="section-title">No movies yet</h1>
          <p className="text-zinc-400">Movies will appear here as soon as they are added to the catalogue.</p>
        </div>
      </PageContainer>
    );
  }

  if (!movies || !featured || !visibleMovies) {
    return (
      <div className="pt-16">
        <div className="skeleton h-[70vh] w-full" />
      </div>
    );
  }

  const isSearching = query.trim().length > 0;
  const trimmedQuery = query.trim();
  const featuredPosition = movies.indexOf(featured) + 1;

  return (
    <>
      <HeroBanner movie={featured} position={featuredPosition} total={movies.length} />

      <div className="mx-auto max-w-7xl space-y-24 px-4 pb-24 sm:px-6 lg:px-8">
        <section aria-label="Find movies" className="flex flex-col gap-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="cinema-label">Find your film</p>
              <p className="mt-2 text-sm text-muted">Search by title, genre or language</p>
            </div>
            <SearchInput value={query} onChange={setQuery} />
          </div>
          <GenreFilter genres={genres} active={genre} onChange={setGenre} />
        </section>

        {isSearching ? (
          <MovieSection
            id="search-results"
            eyebrow="Search"
            title="Search results"
            subtitle={`Matches for "${trimmedQuery}"`}
            movies={visibleMovies}
            emptyMessage={`No movies match "${trimmedQuery}"${genre ? ` in ${genre}` : ''}. Try a different title, genre or language.`}
          />
        ) : (
          <>
            <MovieSection
              id="spotlight"
              eyebrow="Trending this week"
              title="The Spotlight"
              subtitle="The films audiences are talking about right now"
              movies={visibleMovies.filter((movie) => movie.is_trending)}
              emptyMessage="No trending movies match this genre."
              spotlight
            />
            <MovieSection
              id="now-on-screen"
              eyebrow="Showing today"
              title="Now On Screen"
              subtitle="Book your seats for screenings today and beyond"
              movies={visibleMovies.filter((movie) => movie.status === 'now_showing')}
              emptyMessage="No movies are showing right now for this genre."
            />
            <MovieSection
              id="cult-favourites"
              eyebrow="Audience favourites"
              title="Cult Favourites"
              subtitle="The highest rated films on CINEBOOK"
              movies={favourites}
              emptyMessage="No rated films match this genre yet."
            />
            <MovieSection
              id="next-premiere"
              eyebrow="Coming soon"
              title="The Next Premiere"
              subtitle="Get ready for what is coming next"
              movies={visibleMovies.filter((movie) => movie.status === 'upcoming')}
              emptyMessage="No upcoming releases match this genre."
            />
          </>
        )}
      </div>
    </>
  );
}

