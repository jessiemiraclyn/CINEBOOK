import { useState } from 'react';
import { Film } from 'lucide-react';

interface PosterImageProps {
  src: string;
  alt: string;
  className?: string;
}

export default function PosterImage({ src, alt, className = '' }: PosterImageProps) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={`flex items-center justify-center bg-gradient-to-br from-brand-800 via-ink-800 to-ink-950 ${className}`}
      >
        <Film className="h-10 w-10 text-white/30" aria-hidden="true" />
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      onError={() => setFailed(true)}
      className={`bg-ink-800 object-cover ${className}`}
    />
  );
}
