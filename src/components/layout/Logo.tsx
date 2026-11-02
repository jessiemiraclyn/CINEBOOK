import { Clapperboard } from 'lucide-react';

export default function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <a href="#/" className="group flex items-center gap-2.5" aria-label="CineBook home">
      <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-600 shadow-lg shadow-brand-900/50 transition duration-300 group-hover:bg-brand-500 group-hover:-rotate-6">
        <Clapperboard className="h-5 w-5 text-white" aria-hidden="true" />
      </span>
      {!compact && (
        <span className="font-display text-3xl leading-none tracking-wider text-white">
          CINE<span className="text-brand-500">BOOK</span>
        </span>
      )}
    </a>
  );
}
