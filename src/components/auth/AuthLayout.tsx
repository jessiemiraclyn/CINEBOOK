import type { InputHTMLAttributes, ReactNode } from 'react';
import Logo from '@/components/layout/Logo';

interface AuthLayoutProps {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer: ReactNode;
}

export default function AuthLayout({ title, subtitle, children, footer }: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen items-center justify-center px-4 pb-16 pt-28">
      <div className="w-full max-w-md animate-fade-up">
        <div className="mb-8 flex justify-center">
          <Logo />
        </div>
        <div className="glass-panel p-6 sm:p-8">
          <h1 className="font-display text-4xl tracking-wide text-white">{title}</h1>
          <p className="mt-2 text-sm leading-relaxed text-zinc-400">{subtitle}</p>
          <div className="mt-8">{children}</div>
        </div>
        <div className="mt-6 text-center text-sm text-zinc-400">{footer}</div>
      </div>
    </div>
  );
}

interface AuthFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export function AuthField({ label, error, id, ...inputProps }: AuthFieldProps) {
  const errorId = id ? `${id}-error` : undefined;
  return (
    <div>
      <label htmlFor={id} className="field-label">
        {label}
      </label>
      <input
        id={id}
        className="field-input"
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        {...inputProps}
      />
      {error && (
        <p id={errorId} className="mt-2 text-xs text-red-400">
          {error}
        </p>
      )}
    </div>
  );
}
