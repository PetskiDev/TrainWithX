import { useEffect, useState } from 'react';

import { useAuth } from '@frontend/context/AuthContext';

import { Button } from '@/components/ui/button';
import { AuthModal } from '@frontend/components/AuthModal';
import { useSmartNavigate } from '@frontend/hooks/useSmartNavigate.ts';

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
  const { goPublic } = useSmartNavigate();
  const { user } = useAuth();
  const [showLogin, setShowLogin] = useState(false); // 👈 Track modal state
  const base = import.meta.env.VITE_BASE_DOMAIN!;

  useEffect(() => {
    if (autoOpen && user) {
      navigateToCheckout();
    }
  }, [autoOpen, user]);

  const navigateToCheckout = () => {
    goPublic(`/checkout?planId=${planId}`);
  };

  const handleClick = () => {
    if (!user) {
      setShowLogin(true); // 👈 open modal if not logged in
    } else {
      navigateToCheckout();
    }
  };

  const handleLoginSuccess = async () => {
    setShowLogin(false);
    navigateToCheckout();
  };

  return (
    <>
      <Button
        onClick={handleClick}
        className={`w-full gradient-bg text-white hover:opacity-90 ${
          className ?? ''
        }`}
      >
        {text || 'Get This Plan'}
      </Button>

      <AuthModal
        open={showLogin}
        onClose={() => setShowLogin(false)}
        onSuccess={handleLoginSuccess}
        redirectUrl={`https://${base}/checkout?planId=${planId}`}
        />
    </>
  );
};

export default BuyButton;
