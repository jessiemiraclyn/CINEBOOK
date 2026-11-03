import { Clapperboard } from 'lucide-react';

export default function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <a href="#/" className="group flex items-center gap-2.5" aria-label="CINEBOOK home">
      <span className="flex h-9 w-9 items-center justify-center rounded-md bg-brand-600 shadow-lg shadow-brand-600/40 transition duration-300 group-hover:-rotate-6 group-hover:bg-brand-500">
        <Clapperboard className="h-5 w-5 text-white" aria-hidden="true" />
      </span>
      {!compact && (
        <span className="flex flex-col leading-none">
          <span className="font-display text-2xl tracking-wider text-soft">
            CINE<span className="bg-gradient-to-r from-cyan-300 via-soft to-ultra-400 bg-clip-text text-transparent">BOOK</span>
          </span>
          <span className="mt-1 text-[9px] font-semibold uppercase tracking-[0.35em] text-muted">
            Midnight Cinema Club
          </span>
        </span>
      )}
    </a>
  );
}
