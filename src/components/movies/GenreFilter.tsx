interface GenreFilterProps {
  genres: string[];
  active: string | null;
  onChange: (genre: string | null) => void;
}

export default function GenreFilter({ genres, active, onChange }: GenreFilterProps) {
  const options: (string | null)[] = [null, ...genres];

  return (
    <div
      role="group"
      aria-label="Filter by genre"
      className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:px-0"
    >
      {options.map((option) => {
        const selected = option === active;
        return (
          <button
            key={option ?? 'all'}
            type="button"
            aria-pressed={selected}
            onClick={() => onChange(option)}
            className={`shrink-0 rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-wider transition duration-300 active:scale-[0.97] ${
              selected
                ? 'border-brand-500 bg-brand-600 text-white shadow-lg shadow-brand-600/30'
                : 'border-white/10 bg-white/5 text-zinc-300 hover:border-gold-400/40 hover:text-gold-200'
            }`}
          >
            {option ?? 'All genres'}
          </button>
        );
      })}
    </div>
  );
}
