// components/BuyButton.tsx
import { useAuth } from '@frontend/context/AuthContext';
import { usePaddle } from '../context/PaddleContext';
import { useState } from 'react';

export function BuyButton({ planId }: { planId: number }) {
  const { paddle, loading } = usePaddle();
  const [busy, setBusy] = useState(false);
  const { user } = useAuth();
  const openCheckout = async () => {
    if (!paddle) return;

    setBusy(true);
    try {
      // 1️⃣ ask backend for transaction token
      const res = await fetch(`/api/v1/paddle/checkout`, {
        method: 'POST',
        body: JSON.stringify({ planId }),
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });
      const { token, error } = await res.json();
      if (error || !token) throw new Error(error || 'No token');

      // 2️⃣ open Paddle modal
      paddle.Checkout.open({
        transactionId: token,
        customer: {
          email: user!.email,
          address: {
            countryCode: 'US',
          },
        },
      });
    } catch (e: any) {
      alert(e.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <button onClick={openCheckout} disabled={loading || busy}>
      {busy ? 'Loading…' : 'Buy now'}
    </button>
  );
}
