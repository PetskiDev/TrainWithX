import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

import { useAuth } from '@frontend/context/AuthContext';
import { usePaddle } from '@frontend/context/PaddleContext';
import { AuthModal } from '@frontend/components/AuthModal';
import type { UserDto } from '@trainwithx/shared';
import { useSmartNavigate } from '@frontend/hooks/useSmartNavigate.ts';

export default function CheckoutPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { goPublic } = useSmartNavigate();
  const { paddle, loading: paddleLoading } = usePaddle();
  const { user, refreshUser } = useAuth();
  const [busy, setBusy] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [checkoutFailed, setCheckoutFailed] = useState(false);

  const planId = searchParams.get('planId');
  const isCanceled = searchParams.get('cancel') === 'true';
  const isFailed = searchParams.get('failed') === 'true';
  const isSuccess = searchParams.get('success') === 'true';

  useEffect(() => {
    if (!planId) {
      setError('No plan ID provided');
      return;
    }

    // Handle success checkout
    if (isSuccess) {
      return;
    }

    // Handle failed or canceled checkout
    if (isFailed || isCanceled) {
      setCheckoutFailed(true);
      return;
    }

    if (user && paddle && !paddleLoading) {
      openCheckout(user);
    }
  }, [planId, user, paddle, paddleLoading, isFailed, isCanceled]);

  const openCheckout = async (u: UserDto) => {
    if (!paddle || busy || paddleLoading || !planId) return;

    setBusy(true);
    setError(null);
    
    try {
      const res = await fetch('/api/v1/checkout', {
        method: 'POST',
        body: JSON.stringify({ planId: parseInt(planId) }),
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });
      const { token } = await res.json();
      
      if (!token) {
        throw new Error('Plan Already Purchased');
      }

      paddle.Checkout.open({
        settings:{
            successUrl: `${window.location.origin}/checkout?planId=${planId}&success=true`,
        },
        transactionId: token,
        customer: {
          email: u.email,
          address: { countryCode: 'US' },
        },
      });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  const handleLoginSuccess = async () => {
    setShowLogin(false);
    const updatedUser = await refreshUser();
    openCheckout(updatedUser);
  };

  const handleBackToPlans = () => {
    goPublic('/plans');
  };

  const handleRetry = () => {
    setCheckoutFailed(false);
    setError(null);
    if (user) {
      openCheckout(user);
    }
  };

  const handleGoToProfile = () => {
    goPublic('/me');
  };

  if (!planId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Invalid Checkout</h1>
          <p className="text-gray-600 mb-6">No plan ID provided for checkout.</p>
          <button
            onClick={handleBackToPlans}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
          >
            Back to Plans
          </button>
        </div>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6 text-center">
          <div className="mb-6">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
              <svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Thank You!</h1>
            <p className="text-gray-600 mb-6">
              Your purchase was successful. You can now access your plan and start your fitness journey.
            </p>
          </div>
          <div className="space-y-3">
            <button
              onClick={handleGoToProfile}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
            >
              Go to My Profile
            </button>
            <button
              onClick={handleBackToPlans}
              className="w-full bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300 transition-colors"
            >
              Browse More Plans
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (checkoutFailed) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            {isCanceled ? 'Checkout Canceled' : 'Checkout Failed'}
          </h1>
          <p className="text-gray-600 mb-6">
            {isCanceled 
              ? 'Your checkout was canceled. You can try again or return to browse our plans.'
              : 'Something went wrong with your checkout. Please try again or contact support if the problem persists.'
            }
          </p>
          <div className="space-y-3">
            <button
              onClick={handleRetry}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
            <button
              onClick={handleBackToPlans}
              className="w-full bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300 transition-colors"
            >
              Back to Plans
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Checkout Error</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <div className="space-y-3">
            <button
              onClick={handleRetry}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
            <button
              onClick={handleBackToPlans}
              className="w-full bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300 transition-colors"
            >
              Back to Plans
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Complete Your Purchase</h1>
          <p className="text-gray-600 mb-6">Please log in to continue with your purchase.</p>
          <button
            onClick={() => setShowLogin(true)}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
          >
            Log In
          </button>
        </div>
        
        <AuthModal
          open={showLogin}
          onClose={() => setShowLogin(false)}
          onSuccess={handleLoginSuccess}
          redirectUrl={`${window.location.origin}/checkout?planId=${planId}`}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Preparing Checkout</h1>
        <p className="text-gray-600 mb-6">Please wait while we prepare your checkout...</p>
        
        {busy || paddleLoading ? (
          <div className="flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            <span className="ml-2 text-gray-600">Loading checkout...</span>
          </div>
        ) : (
          <button
            onClick={() => openCheckout(user)}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
          >
            Open Checkout
          </button>
        )}
      </div>
    </div>
  );
} 