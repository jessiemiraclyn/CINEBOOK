import { Search, X } from 'lucide-react';
import type { Movie } from '@/types/cinema';

export function matchesMovieQuery(movie: Movie, query: string): boolean {
  const needle = query.trim().toLowerCase();
  if (!needle) return true;
  return [movie.title, movie.genre, movie.language].some((field) => field.toLowerCase().includes(needle));
}

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function SearchInput({ value, onChange, placeholder = 'Search movies, genres, languages' }: SearchInputProps) {
  return (
    <div className="relative w-full max-w-md">
      <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" aria-hidden="true" />
      <input
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        aria-label="Search movies"
        className="field-input h-12 rounded-full pl-11 pr-11 [&::-webkit-search-cancel-button]:hidden"
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange('')}
          aria-label="Clear search"
          className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1.5 text-zinc-400 transition hover:bg-white/10 hover:text-white"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
