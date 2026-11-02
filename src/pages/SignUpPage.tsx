import { useEffect, useState, type FormEvent } from 'react';
import { ArrowRight } from 'lucide-react';
import Button from '@/components/ui/Button';
import ErrorMessage from '@/components/ui/ErrorMessage';
import AuthLayout, { AuthField } from '@/components/auth/AuthLayout';
import { useAuth } from '@/hooks/useAuth';
import { navigate, useHashRoute } from '@/hooks/useHashRoute';
import { getAuthErrorMessage } from '@/lib/errors';
import { buildAuthHref, getSafeNextPath } from '@/lib/redirect';
import { EMAIL_PATTERN, MIN_PASSWORD_LENGTH } from '@/lib/validation';

interface SignUpErrors {
  fullName?: string;
  email?: string;
  password?: string;
}

export default function SignUpPage() {
  const { user, loading, signUp } = useAuth();
  const { params } = useHashRoute();
  const next = getSafeNextPath(params.get('next'));

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<SignUpErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && user) navigate(next);
  }, [loading, user, next]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError(null);

    const nextErrors: SignUpErrors = {};
    if (fullName.trim().length < 2) nextErrors.fullName = 'Enter your full name.';
    if (!EMAIL_PATTERN.test(email.trim())) nextErrors.email = 'Enter a valid email address.';
    if (password.length < MIN_PASSWORD_LENGTH) {
      nextErrors.password = `Use at least ${MIN_PASSWORD_LENGTH} characters.`;
    }
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setSubmitting(true);
    try {
      await signUp(fullName.trim(), email.trim(), password);
      navigate(next);
    } catch (err) {
      setFormError(getAuthErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Join CineBook to book seats and keep every ticket in one place."
      footer={
        <>
          Already have an account?{' '}
          <a href={buildAuthHref('/login', next)} className="font-semibold text-white underline-offset-4 hover:underline">
            Sign in
          </a>
        </>
      }
    >
      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
        {formError && <ErrorMessage message={formError} />}

        <AuthField
          id="signup-name"
          label="Full name"
          autoComplete="name"
          placeholder="Ananya Rao"
          value={fullName}
          onChange={(event) => setFullName(event.target.value)}
          error={errors.fullName}
        />
        <AuthField
          id="signup-email"
          label="Email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          error={errors.email}
        />
        <AuthField
          id="signup-password"
          label="Password"
          type="password"
          autoComplete="new-password"
          placeholder={`At least ${MIN_PASSWORD_LENGTH} characters`}
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          error={errors.password}
        />

        <Button type="submit" size="lg" loading={submitting} className="mt-2 w-full">
          Create account
          {!submitting && <ArrowRight className="h-4 w-4" aria-hidden="true" />}
        </Button>
      </form>
    </AuthLayout>
  );
}
