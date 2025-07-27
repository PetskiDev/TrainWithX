import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';

import { useAuth } from '@frontend/context/AuthContext';
import { usePaddle } from '@frontend/context/PaddleContext';

import { Button } from '@/components/ui/button';
import type { UserDto } from '@trainwithx/shared';
import { AuthModal } from '@frontend/components/AuthModal';

interface BuyButtonProps {
  planId: number;
  text?: string;
  autoOpen?: boolean;

  /** Optional – extra Tailwind classes */
  className?: string;
}

export const BuyButton = ({
  planId,
  text,
  className,
  autoOpen,
}: BuyButtonProps) => {
  const { paddle, loading: paddleLoading } = usePaddle();
  const { user, refreshUser } = useAuth();
  const [busy, setBusy] = useState(false);
  const [showLogin, setShowLogin] = useState(false); // 👈 Track modal state

  useEffect(() => {
    console.log(user);
    if (autoOpen && user) {
      openCheckout(user);
    }
  }, [autoOpen, user]);

  const openCheckout = async (u: UserDto) => {
    if (!paddle || busy || paddleLoading) return;

    setBusy(true);
    try {
      const res = await fetch('/api/v1/checkout', {
        method: 'POST',
        body: JSON.stringify({ planId }),
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });
      const { token, error } = await res.json();
      if (error || !token) throw new Error(error ?? 'Checkout failed');

      paddle.Checkout.open({
        transactionId: token,
        customer: {
          email: u!.email,
          address: { countryCode: 'US' },
        },
      });
    } catch (err: any) {
      alert(err.message);
    } finally {
      setBusy(false);
    }
  };

  const handleClick = () => {
    if (!user) {
      setShowLogin(true); // 👈 open modal if not logged in
    } else {
      openCheckout(user);
    }
  };

  const handleLoginSuccess = async () => {
    setShowLogin(false);
    const updatedUser = await refreshUser();
    openCheckout(updatedUser);
  };
  const isDisabled = busy || paddleLoading;

  return (
    <>
      <Button
        onClick={handleClick}
        disabled={isDisabled}
        aria-busy={isDisabled}
        className={`w-full gradient-bg text-white hover:opacity-90 ${
          className ?? ''
        }`}
      >
        {isDisabled ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processing…
          </>
        ) : (
          text || 'Get This Plan'
        )}
      </Button>

      <AuthModal
        open={showLogin}
        onClose={() => setShowLogin(false)}
        onSuccess={handleLoginSuccess}
        redirectUrl={`${window.location.origin}${window.location.pathname}?openCheckout=true`}
      />
    </>
  );
};

export default BuyButton;
