/* -------------------------------------------------
 *  src/components/BuyButton.tsx
 * ------------------------------------------------*/

import { useState } from 'react';
import { Loader2 } from 'lucide-react';

import { useAuth } from '@frontend/context/AuthContext';
import { usePaddle } from '@frontend/context/PaddleContext';

import { Button } from '@/components/ui/button';

interface BuyButtonProps {
  planId: number;
  text?: string;
  /** Optional – extra Tailwind classes */
  className?: string;
}

export const BuyButton = ({ planId, text, className }: BuyButtonProps) => {
  const { paddle, loading: paddleLoading } = usePaddle();
  const { user } = useAuth();
  const [busy, setBusy] = useState(false);

  /* ---------- checkout flow ------------------------------------------ */
  const openCheckout = async () => {
    if (!paddle || busy || paddleLoading) return;

    setBusy(true);
    try {
      // 1️⃣ get Paddle transaction token from backend
      const res = await fetch('/api/v1/purchases', {
        method: 'POST',
        body: JSON.stringify({ planId }),
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });
      const { token, error } = await res.json();
      if (error || !token) throw new Error(error ?? 'Checkout failed');

      // 2️⃣ open Paddle modal
      paddle.Checkout.open({
        transactionId: token,
        customer: {
          email: user!.email,
          address: { countryCode: 'US' },
        },
      });
    } catch (err: any) {
      // eslint-disable-next-line no-alert
      alert(err.message);
    } finally {
      setBusy(false);
    }
  };

  /* ---------- render -------------------------------------------------- */
  const isDisabled = busy || paddleLoading;

  return (
    <Button
      onClick={openCheckout}
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
  );
};

export default BuyButton;
