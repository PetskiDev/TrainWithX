/* -------------------------------------------------
 *  src/pages/RegisterPage.tsx
 * ------------------------------------------------*/

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@frontend/context/AuthContext';

import { TrainWithXLogo } from '@/components/TrainWithXLogo';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useSmartNavigate } from '@frontend/hooks/useSmartNavigate';
import { registerSchema, type RegisterInput } from '@trainwithx/shared';
import { zodErrorToFieldErrors } from '@frontend/lib/AppErrorUtils.ts';

const RegisterPage = () => {
  const { goPublic, goToDashboard } = useSmartNavigate();
  const { user, loading, register } = useAuth();

  const [form, setForm] = useState<RegisterInput>({
    username: '',
    email: '',
    password: '',
  });

  const [formErrors, setFormErrors] = useState<
    Partial<Record<keyof RegisterInput, string>>
  >({});
  const [globalError, setGlobalError] = useState('');

  useEffect(() => {
    if (!loading && user) goPublic('/me');
  }, [loading, user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setFormErrors((prev) => ({ ...prev, [name]: undefined }));
    setGlobalError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormErrors({});
    setGlobalError('');

    const parsed = registerSchema.safeParse(form);
    if (!parsed.success) {
      const fieldErrors = zodErrorToFieldErrors<RegisterInput>(parsed.error);
      setFormErrors(fieldErrors);
      return;
    }
    try {
      const user = await register(form.email, form.username, form.password);
      if (!user.isVerified) {
        goPublic('/email-verification');
      } else {
        goToDashboard(user);
      }
    } catch (err: any) {
      setGlobalError(err.message);
    }
  };

  const handleGoogleSignUp = () => {
    window.location.href = '/api/v1/auth/google';
  };

  if (loading || user) {
    return (
      <div className='min-h-screen-navbar flex items-center justify-center'>
        <p className='text-muted-foreground'>Loading…</p>
      </div>
    );
  }
  /* -------------- view ------------------------------------------------ */
  return (
    <div className='min-h-screen-navbar flex items-center justify-center bg-gradient-to-br from-background to-primary/5 p-4'>
      <Card className='w-full max-w-md'>
        <CardHeader className='text-center'>
          <div className='flex justify-center mb-4'>
            <TrainWithXLogo size='md' />
          </div>
          <CardTitle className='text-2xl font-bold'>Create Account</CardTitle>
          <CardDescription>
            Join TrainWithX and start your fitness journey
          </CardDescription>
        </CardHeader>

        <CardContent className='space-y-4'>
          {/* ---------- register form ---------- */}
          <form onSubmit={handleSubmit} className='space-y-4'>
            <div className='space-y-2'>
              <Label htmlFor='username'>Username</Label>
              <Input
                id='username'
                name='username'
                type='text'
                placeholder='Enter your username'
                value={form.username}
                onChange={handleChange}
                required
              />
            </div>
            {formErrors.username && (
              <p className='text-sm text-destructive'>{formErrors.username}</p>
            )}
            <div className='space-y-2'>
              <Label htmlFor='email'>Email</Label>
              <Input
                id='email'
                name='email'
                type='email'
                placeholder='Enter your email'
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>
            {formErrors.email && (
              <p className='text-sm text-destructive'>{formErrors.email}</p>
            )}
            <div className='space-y-2'>
              <Label htmlFor='password'>Password</Label>
              <Input
                id='password'
                name='password'
                type='password'
                placeholder='Create a password'
                value={form.password}
                onChange={handleChange}
                required
              />
            </div>
            {formErrors.password && (
              <p className='text-sm text-destructive'>{formErrors.password}</p>
            )}
            {globalError && (
              <p className='text-sm text-destructive font-medium'>
                {globalError}
              </p>
            )}
            <Button
              type='submit'
              className='w-full gradient-bg text-white hover:opacity-90'
            >
              Create Account
            </Button>
          </form>
          <p className='text-xs text-muted-foreground text-center mt-2'>
            By signing up, you agree to our{' '}
            <button
              type='button'
              onClick={() => goPublic('/terms-of-service', true)}
              className='underline text-foreground px-0 bg-transparent border-none cursor-pointer'
            >
              Terms of Service
            </button>{' '}
            and{' '}
            <button
              type='button'
              onClick={() => goPublic('/privacy-policy', true)}
              className='underline text-foreground px-0 bg-transparent border-none cursor-pointer'
            >
              Privacy Policy
            </button>
            .
          </p>

          {/* ---------- divider ---------- */}
          <div className='relative'>
            <div className='absolute inset-0 flex items-center'>
              <span className='w-full border-t' />
            </div>
            <div className='relative flex justify-center text-xs uppercase'>
              <span className='bg-background px-2 text-muted-foreground'>
                Or continue with
              </span>
            </div>
          </div>

          {/* ---------- Google button ---------- */}
          <Button
            type='button'
            variant='outline'
            className='w-full'
            onClick={handleGoogleSignUp}
          >
            <svg className='mr-2 h-4 w-4' viewBox='0 0 24 24'>
              <path
                d='M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z'
                fill='#4285F4'
              />
              <path
                d='M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z'
                fill='#FBBC05'
              />
              <path
                d='M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z'
                fill='#34A853'
              />
              <path
                d='M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z'
                fill='#FBBC05'
              />
              <path
                d='M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z'
                fill='#EA4335'
              />
            </svg>
            Sign up with Google
          </Button>

          <div className='text-center text-sm'>
            Already have an account?{' '}
            <Link to='/login' className='text-primary hover:underline'>
              Sign in
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RegisterPage;
