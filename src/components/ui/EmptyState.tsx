import type { ReactNode } from 'react';

interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  message: string;
  action?: ReactNode;
}

export default function EmptyState({ icon, title, message, action }: EmptyStateProps) {
  return (
    <div className="animate-fade-in flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-white/10 bg-ink-900/50 px-6 py-14 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/5 text-zinc-400">
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-white">{title}</h3>
      <p className="max-w-md text-sm text-zinc-400">{message}</p>
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}
