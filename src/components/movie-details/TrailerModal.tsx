import { useEffect } from 'react';
import { Film, X } from 'lucide-react';

interface TrailerModalProps {
  open: boolean;
  title: string;
  youtubeId: string | null;
  onClose: () => void;
}

export default function TrailerModal({ open, title, youtubeId, onClose }: TrailerModalProps) {
  useEffect(() => {
    if (!open) return;
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-8">
      <button
        type="button"
        aria-label="Close trailer"
        onClick={onClose}
        className="animate-fade-in absolute inset-0 bg-ink-950/90 backdrop-blur-md"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={`${title} trailer`}
        className="glass-panel animate-scale-in relative w-full max-w-5xl overflow-hidden rounded-2xl p-3 shadow-[0_40px_120px_-20px_rgba(135,60,255,0.45)] sm:p-4"
      >
        <div className="mb-3 flex items-center justify-between gap-4 px-2 pt-1">
          <div className="min-w-0">
            <p className="cinema-label">Official trailer</p>
            <h2 className="mt-1 truncate font-display text-2xl uppercase tracking-wide text-soft sm:text-3xl">{title}</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="shrink-0 rounded-full p-2 text-muted transition hover:bg-white/10 hover:text-soft"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        <div className="aspect-video w-full overflow-hidden rounded-xl bg-ink-950">
          {youtubeId ? (
            <iframe
              key={youtubeId}
              src={`https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1&rel=0`}
              title={`${title} trailer`}
              className="h-full w-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              referrerPolicy="strict-origin-when-cross-origin"
            />
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center gap-3 text-center">
              <Film className="h-8 w-8 text-cyan-400" aria-hidden="true" />
              <p className="font-display text-2xl uppercase tracking-wide text-soft">Trailer coming soon</p>
              <p className="text-sm text-muted">The official trailer for this film has not been released yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
