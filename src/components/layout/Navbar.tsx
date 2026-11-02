import { useEffect, useState } from 'react';
import { LogOut, Menu, Shield, Ticket, UserRound, X } from 'lucide-react';
import Logo from '@/components/layout/Logo';
import Button from '@/components/ui/Button';
import { useAuth } from '@/hooks/useAuth';
import { navigate, useHashRoute } from '@/hooks/useHashRoute';
import { getErrorMessage } from '@/lib/errors';

interface NavItem {
  label: string;
  href: string;
  matches: (path: string) => boolean;
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Home', href: '#/', matches: (path) => path === '/' },
  { label: 'Explore Movies', href: '#/movies', matches: (path) => path === '/movies' || path.startsWith('/movies/') || path.startsWith('/book') },
  { label: 'Upcoming', href: '#/movies?status=upcoming', matches: () => false },
  { label: 'My Bookings', href: '#/my-bookings', matches: (path) => path.startsWith('/my-bookings') || path.startsWith('/bookings') },
  { label: 'About', href: '#/about', matches: (path) => path === '/about' },
];

export default function Navbar() {
  const { path } = useHashRoute();
  const { user, profile, isAdmin, signOut } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const [signOutError, setSignOutError] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 16);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [path]);

  const items = isAdmin ? [...NAV_ITEMS, { label: 'Admin', href: '#/admin', matches: (p: string) => p.startsWith('/admin') }] : NAV_ITEMS;

  const handleSignOut = async () => {
    setSigningOut(true);
    setSignOutError(null);
    try {
      await signOut();
      navigate('/');
    } catch (err) {
      setSignOutError(getErrorMessage(err, 'Could not sign out. Please try again.'));
    } finally {
      setSigningOut(false);
    }
  };

  const displayName = profile?.full_name || user?.email?.split('@')[0] || 'Account';

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-all duration-500 ${
        scrolled || menuOpen ? 'border-b border-gold-400/15 bg-ink-950/85 shadow-2xl shadow-black/50 backdrop-blur-xl' : 'bg-gradient-to-b from-black/80 to-transparent'
      }`}
    >
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-6 px-4 sm:px-6 lg:px-8">
        <Logo />

        <ul className="hidden items-center gap-1 md:flex">
          {items.map((item) => {
            const active = item.matches(path);
            return (
              <li key={item.href}>
                <a
                  href={item.href}
                  aria-current={active ? 'page' : undefined}
                  className={`relative block rounded-full px-4 py-2 text-sm font-medium transition duration-300 ${
                    active ? 'text-white' : 'text-zinc-300 hover:text-white'
                  }`}
                >
                  {item.label}
                  <span
                    className={`absolute inset-x-4 -bottom-0.5 h-0.5 rounded-full bg-brand-500 transition-transform duration-300 ${
                      active ? 'scale-x-100' : 'scale-x-0'
                    }`}
                  />
                </a>
              </li>
            );
          })}
        </ul>

        <div className="hidden items-center gap-3 md:flex">
          {user ? (
            <>
              <span className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 py-1.5 pl-2 pr-4 text-sm text-zinc-200">
                <UserRound className="h-4 w-4 text-brand-400" aria-hidden="true" />
                <span className="max-w-[10rem] truncate">{displayName}</span>
              </span>
              <Button variant="ghost" size="sm" onClick={handleSignOut} loading={signingOut}>
                <LogOut className="h-4 w-4" aria-hidden="true" />
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" size="sm" onClick={() => navigate('/login')}>
                Login
              </Button>
              <Button size="sm" onClick={() => navigate('/signup')}>
                Sign Up
              </Button>
            </>
          )}
        </div>

        <button
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          className="rounded-full p-2 text-white transition hover:bg-white/10 md:hidden"
        >
          {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {menuOpen && (
        <div className="animate-fade-in border-t border-white/10 bg-ink-950/95 px-4 pb-6 pt-3 backdrop-blur-xl md:hidden">
          <ul className="flex flex-col gap-1">
            {items.map((item) => {
              const active = item.matches(path);
              return (
                <li key={item.href}>
                  <a
                    href={item.href}
                    aria-current={active ? 'page' : undefined}
                    className={`flex items-center gap-3 rounded-xl px-4 py-3 text-base font-medium transition ${
                      active ? 'bg-brand-600/15 text-white' : 'text-zinc-300 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    {item.label === 'Admin' ? (
                      <Shield className="h-5 w-5 text-brand-400" aria-hidden="true" />
                    ) : item.label === 'My Bookings' ? (
                      <Ticket className="h-5 w-5 text-brand-400" aria-hidden="true" />
                    ) : null}
                    {item.label}
                  </a>
                </li>
              );
            })}
          </ul>
          <div className="mt-4 flex flex-col gap-3 border-t border-white/10 pt-4">
            {user ? (
              <>
                <p className="px-1 text-sm text-zinc-400">Signed in as <span className="text-white">{displayName}</span></p>
                <Button variant="secondary" onClick={handleSignOut} loading={signingOut}>
                  <LogOut className="h-4 w-4" aria-hidden="true" />
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button variant="secondary" onClick={() => navigate('/login')}>Login</Button>
                <Button onClick={() => navigate('/signup')}>Sign Up</Button>
              </>
            )}
            {signOutError && <p className="text-sm text-red-300">{signOutError}</p>}
          </div>
        </div>
      )}
    </header>
  );
}
