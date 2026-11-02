import Logo from '@/components/layout/Logo';

export default function Footer() {
  return (
    <footer className="mt-24 border-t border-white/10 bg-ink-900/60">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-12 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
        <div className="flex flex-col gap-3">
          <Logo />
          <p className="max-w-xs text-sm text-zinc-400">
            Pick your seats, pay in seconds and walk straight into the best seat in the house.
          </p>
        </div>
        <nav aria-label="Footer" className="flex flex-wrap gap-x-8 gap-y-3 text-sm text-zinc-300">
          <a href="#/" className="transition hover:text-white">Home</a>
          <a href="#/movies" className="transition hover:text-white">Movies</a>
          <a href="#/my-bookings" className="transition hover:text-white">My Bookings</a>
          <a href="#/about" className="transition hover:text-white">About</a>
        </nav>
        <p className="text-xs text-zinc-500">© {new Date().getFullYear()} CineBook. All rights reserved.</p>
      </div>
    </footer>
  );
}
