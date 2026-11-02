import { Loader2 } from 'lucide-react';

export default function Spinner({ label = 'Loading' }: { label?: string }) {
  return (
    <div role="status" className="flex flex-col items-center justify-center gap-3 py-16 text-zinc-400">
      <Loader2 className="h-8 w-8 animate-spin text-brand-500" aria-hidden="true" />
      <span className="text-sm">{label}...</span>
    </div>
  );
}
