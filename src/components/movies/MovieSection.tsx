import type { ReactNode } from 'react';
import { Film } from 'lucide-react';
import EmptyState from '@/components/ui/EmptyState';
import MovieCard from '@/components/movies/MovieCard';
import type { Movie } from '@/types/cinema';

interface MovieSectionProps {
  id: string;
  title: string;
  subtitle?: string;
  movies: Movie[] | null;
  emptyMessage: string;
  action?: ReactNode;
}

export default function MovieSection({ id, title, subtitle, movies, emptyMessage, action }: MovieSectionProps) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="scroll-mt-24">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 id={`${id}-title`} className="section-title">{title}</h2>
          {subtitle && <p className="mt-2 text-sm text-zinc-400">{subtitle}</p>}
        </div>
        {action}
      </div>

      {movies === null ? (
        <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {Array.from({ length: 5 }, (_, index) => (
            <div key={index} className="flex flex-col gap-3">
              <div className="skeleton aspect-[2/3] rounded-2xl" />
              <div className="skeleton h-4 w-3/4 rounded" />
              <div className="skeleton h-3 w-1/2 rounded" />
            </div>
          ))}
        </div>
      ) : movies.length === 0 ? (
        <EmptyState icon={<Film className="h-6 w-6" />} title="Nothing here yet" message={emptyMessage} />
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      )}
    </section>
  );
}
