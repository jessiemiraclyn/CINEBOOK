import { useEffect, useState, type FormEvent } from 'react';
import { ArrowRight, Mail } from 'lucide-react';
import Button from '@/components/ui/Button';
import ErrorMessage from '@/components/ui/ErrorMessage';
import AuthLayout, { AuthField } from '@/components/auth/AuthLayout';
import { useAuth } from '@/hooks/useAuth';
import { navigate, useHashRoute } from '@/hooks/useHashRoute';
import { getAuthErrorMessage } from '@/lib/errors';
import { buildAuthHref, getSafeNextPath } from '@/lib/redirect';
import { EMAIL_PATTERN } from '@/lib/validation';

interface LoginErrors {
  email?: string;
  password?: string;
}

export default function LoginPage() {
  const { user, loading, signIn } = useAuth();
  const { params } = useHashRoute();
  const next = getSafeNextPath(params.get('next'));

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<LoginErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && user) navigate(next);
  }, [loading, user, next]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError(null);

    const nextErrors: LoginErrors = {};
    if (!EMAIL_PATTERN.test(email.trim())) nextErrors.email = 'Enter a valid email address.';
    if (!password) nextErrors.password = 'Enter your password.';
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setSubmitting(true);
    try {
      await signIn(email.trim(), password);
      navigate(next);
    } catch (err) {
      setFormError(getAuthErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to view your tickets and book your next show."
      footer={
        <>
          New to CineBook?{' '}
          <a href={buildAuthHref('/signup', next)} className="font-semibold text-white underline-offset-4 hover:underline">
            Create an account
          </a>
        </>
      }
    >
      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
        {formError && <ErrorMessage message={formError} />}

        <AuthField
          id="login-email"
          label="Email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          error={errors.email}
        />
        <AuthField
          id="login-password"
          label="Password"
          type="password"
          autoComplete="current-password"
          placeholder="Your password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          error={errors.password}
        />

        <Button type="submit" size="lg" loading={submitting} className="mt-2 w-full">
          {!submitting && <Mail className="h-4 w-4" aria-hidden="true" />}
          Sign in
          {!submitting && <ArrowRight className="h-4 w-4" aria-hidden="true" />}
        </Button>
      </form>
    </AuthLayout>
  );
}
