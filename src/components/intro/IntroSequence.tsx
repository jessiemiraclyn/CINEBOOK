import { useEffect, useState } from 'react';
import { Clapperboard } from 'lucide-react';

const FADE_OUT_AT_MS = 2600;
const FINISH_AT_MS = 3100;

interface IntroSequenceProps {
  onDone: () => void;
}

export default function IntroSequence({ onDone }: IntroSequenceProps) {
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    const fadeTimer = window.setTimeout(() => setLeaving(true), FADE_OUT_AT_MS);
    const doneTimer = window.setTimeout(onDone, FINISH_AT_MS);
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onDone();
    };
    window.addEventListener('keydown', handleKey);
    return () => {
      window.clearTimeout(fadeTimer);
      window.clearTimeout(doneTimer);
      window.removeEventListener('keydown', handleKey);
    };
  }, [onDone]);

  return (
    <div
      role="dialog"
      aria-label="Welcome to CineBook"
      className={`fixed inset-0 z-[70] flex flex-col items-center justify-center overflow-hidden bg-ink-950 transition-opacity duration-500 ${
        leaving ? 'opacity-0' : 'opacity-100'
      }`}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_50%_40%_at_50%_50%,rgba(54,224,208,0.16),transparent_70%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 h-px animate-scan bg-gradient-to-r from-transparent via-cyan-300 to-transparent shadow-[0_0_24px_rgba(104,232,255,0.8)]"
      />

      <div className="relative flex flex-col items-center gap-6 px-6 text-center">
        <span className="animate-fade-up flex h-16 w-16 items-center justify-center rounded-2xl border border-cyan-400/30 bg-ink-900/80 shadow-[0_0_40px_rgba(104,232,255,0.35)] [animation-delay:500ms]">
          <Clapperboard className="h-8 w-8 text-cyan-300" aria-hidden="true" />
        </span>
        <p className="animate-fade-up font-display text-[clamp(3rem,10vw,6rem)] uppercase leading-none tracking-wide [animation-delay:700ms]">
          <span className="metallic-text drop-shadow-[0_0_24px_rgba(104,232,255,0.45)]">CINEBOOK</span>
        </p>
        <p className="animate-fade-in text-xs font-semibold uppercase tracking-[0.4em] text-soft/80 [animation-delay:1100ms] sm:text-sm">
          Welcome to the Midnight Cinema Club.
        </p>
      </div>

      <button
        type="button"
        onClick={onDone}
        className="absolute bottom-8 right-6 rounded-full border border-white/15 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-muted transition hover:border-cyan-400/50 hover:text-soft"
      >
        Skip intro
      </button>
    </div>
  );
}
