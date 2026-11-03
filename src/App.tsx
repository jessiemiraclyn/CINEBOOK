import { useCallback, useState } from 'react';
import { AuthProvider } from '@/context/AuthContext';
import IntroSequence from '@/components/intro/IntroSequence';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import RequireAuth from '@/components/auth/RequireAuth';
import { navigate, useHashRoute } from '@/hooks/useHashRoute';
import HomePage from '@/pages/HomePage';
import MoviesPage from '@/pages/MoviesPage';
import MovieDetailsPage from '@/pages/MovieDetailsPage';
import SeatSelectionPage from '@/pages/SeatSelectionPage';
import BookingConfirmationPage from '@/pages/BookingConfirmationPage';
import MyBookingsPage from '@/pages/MyBookingsPage';
import LoginPage from '@/pages/LoginPage';
import SignUpPage from '@/pages/SignUpPage';
import Button from '@/components/ui/Button';
import PageContainer from '@/components/layout/PageContainer';
import { Home } from 'lucide-react';

function NotFoundPage() {
  return (
    <PageContainer className="flex flex-col items-center gap-6 py-24 text-center animate-fade-up">
      <p className="font-display text-7xl tracking-wide text-brand-500">404</p>
      <h1 className="section-title">Page not found</h1>
      <p className="max-w-md text-zinc-400">The page you were looking for does not exist or has moved.</p>
      <Button onClick={() => navigate('/')}>
        <Home className="h-4 w-4" aria-hidden="true" />
        Back to home
      </Button>
    </PageContainer>
  );
}

function Router() {
  const { segments } = useHashRoute();
  const [first, second] = segments;

  if (!first) return <HomePage />;
  if (first === 'movies' && !second) return <MoviesPage />;
  if (first === 'movies' && second) return <MovieDetailsPage movieId={second} />;
  if (first === 'book' && second) return <SeatSelectionPage showId={second} />;
  if (first === 'bookings' && second) {
    return (
      <RequireAuth>
        <BookingConfirmationPage bookingId={second} />
      </RequireAuth>
    );
  }
  if (first === 'my-bookings') {
    return (
      <RequireAuth>
        <MyBookingsPage />
      </RequireAuth>
    );
  }
  if (first === 'login') return <LoginPage />;
  if (first === 'signup') return <SignUpPage />;
  return <NotFoundPage />;
}

export default function App() {
  const [introVisible, setIntroVisible] = useState(
    () => !window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  );
  const dismissIntro = useCallback(() => setIntroVisible(false), []);

  return (
    <AuthProvider>
      {introVisible && <IntroSequence onDone={dismissIntro} />}
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1">
          <Router />
        </main>
        <Footer />
      </div>
    </AuthProvider>
  );
}
