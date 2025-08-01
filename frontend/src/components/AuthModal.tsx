import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { TrainWithXLogo } from '@/components/TrainWithXLogo';
import { useAuth } from '@frontend/context/AuthContext';
import {
  registerSchema,
  type RegisterInput,
  type UserDto,
} from '@trainwithx/shared';
import { useSmartNavigate } from '@frontend/hooks/useSmartNavigate';
import { zodErrorToFieldErrors } from '@frontend/lib/AppErrorUtils.ts';

interface AuthModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: (user: UserDto) => void;
  redirectUrl?: string;
}

export const AuthModal = ({
  open,
  onClose,
  onSuccess,
  redirectUrl,
}: AuthModalProps) => {
  const { goPublic } = useSmartNavigate();

  const [mode, setMode] = useState<'login' | 'register'>('register');
  const [form, setForm] = useState({ email: '', password: '', username: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [infoMessage, setInfoMessage] = useState('');

  const [formErrors, setFormErrors] = useState<
    Partial<Record<keyof RegisterInput, string>>
  >({});

  const { login, register } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setFormErrors((prev) => ({ ...prev, [e.target.name]: undefined }));
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setInfoMessage('');
    setFormErrors({});
    setLoading(true);

    try {
      if (mode === 'login') {
        const user = await login(form.email, form.password);
        onSuccess(user);
      } else {
        const result = registerSchema.safeParse(form);
        if (!result.success) {
          setFormErrors(zodErrorToFieldErrors<RegisterInput>(result.error));
          return;
        }

        const newUser = await register(
          form.email,
          form.username,
          form.password
        );
        if (!newUser.isVerified) {
          // Switch back to login mode and inform user
          setMode('login');
          setInfoMessage(
            'Check your email to verify your account before logging in.'
          );
        } else {
          onSuccess(newUser);
        }
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = () => {
    if (redirectUrl) {
      document.cookie = `redirectUrl=${encodeURIComponent(
        redirectUrl
      )}; path=/; domain=.${import.meta.env.VITE_BASE_DOMAIN}; SameSite=Lax`;
    }
    window.location.href = '/api/v1/auth/google';
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className='max-w-md'>
        <DialogHeader className='text-center'>
          <div className='flex justify-center mb-4'>
            <TrainWithXLogo size='md' />
          </div>
          <DialogTitle className='text-2xl font-bold'>
            {mode === 'login' ? 'Welcome Back' : 'Create Account'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className='space-y-4'>
          {infoMessage && (
            <div className='text-sm text-red-700 font-medium mb-2'>
              {infoMessage}
            </div>
          )}
          {mode === 'register' && (
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
              {formErrors.username && (
                <p className='text-sm text-destructive'>
                  {formErrors.username}
                </p>
              )}
            </div>
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
              placeholder={
                mode === 'login' ? 'Enter your password' : 'Create a password'
              }
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>

          {formErrors.password && (
            <p className='text-sm text-destructive'>{formErrors.password}</p>
          )}

          {error && (
            <p className='text-sm text-destructive font-medium'>
              {error}
            </p>
          )}
          <Button
            type='submit'
            className='w-full gradient-bg text-white hover:opacity-90'
            disabled={loading}
          >
            {loading
              ? mode === 'login'
                ? 'Signing In...'
                : 'Creating Account...'
              : mode === 'login'
              ? 'Sign In'
              : 'Create Account'}
          </Button>
        </form>

        {mode === 'register' && (
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
        )}

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

        <Button
          type='button'
          variant='outline'
          className='w-full'
          onClick={handleGoogleAuth}
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
              d='M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z'
              fill='#EA4335'
            />
          </svg>
          {mode === 'login' ? 'Sign in with Google' : 'Sign up with Google'}
        </Button>

        <div className='text-center text-sm mt-4'>
          {mode === 'login' ? (
            <>
              Don’t have an account?{' '}
              <button
                onClick={() => setMode('register')}
                className='text-primary hover:underline'
              >
                Create account
              </button>
            </>
          ) : (
            <>
              Already have an account?{' '}
              <button
                onClick={() => setMode('login')}
                className='text-primary hover:underline'
              >
                Sign in
              </button>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
