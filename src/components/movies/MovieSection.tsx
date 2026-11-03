import type { ReactNode } from 'react';
import MovieCard from '@/components/movies/MovieCard';
import type { Movie } from '@/types/cinema';

interface MovieSectionProps {
  id: string;
  title: string;
  subtitle?: string;
  eyebrow?: string;
  movies: Movie[] | null;
  emptyMessage: string;
  action?: ReactNode;
  spotlight?: boolean;
}

export default function MovieSection({
  id,
  title,
  subtitle,
  eyebrow,
  movies,
  emptyMessage,
  action,
  spotlight = false,
}: MovieSectionProps) {
  const headingId = `${id}-heading`;

  return (
    <section aria-labelledby={headingId} className="flex flex-col gap-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          {eyebrow && <p className="cinema-label">{eyebrow}</p>}
          <h2 id={headingId} className="section-title mt-2">
            {title}
          </h2>
          {subtitle && <p className="mt-2 max-w-xl text-sm text-muted">{subtitle}</p>}
        </div>
        {action}
      </div>

      {movies === null ? (
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4" aria-busy="true">
          {Array.from({ length: 4 }, (_, index) => (
            <div key={index} className="skeleton aspect-[2/3] rounded-2xl" />
          ))}
        </div>
      ) : movies.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-white/10 px-6 py-12 text-center text-sm text-muted">
          {emptyMessage}
        </p>
      ) : (
        <div className="no-scrollbar -mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-4 sm:-mx-6 sm:px-6 md:mx-0 md:grid md:grid-cols-2 md:gap-6 md:overflow-visible md:px-0 md:pb-0 lg:grid-cols-4">
          {movies.map((movie, index) => {
            const isLead = spotlight && index === 0;
            return (
              <div
                key={movie.id}
                className={`w-[70vw] shrink-0 snap-start sm:w-[44vw] md:w-auto ${
                  isLead ? 'md:col-span-2 md:row-span-2' : ''
                }`}
              >
                <MovieCard movie={movie} large={isLead} className="h-full" />
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
