// src/context/PaddleContext.tsx
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import { initializePaddle, type Paddle } from '@paddle/paddle-js';

interface PaddleCtx {
  paddle: Paddle | null;
  loading: boolean;
  error: string | null;
}

const Context = createContext<PaddleCtx | undefined>(undefined);

export function PaddleProvider({ children }: { children: ReactNode }) {
  const [paddle, setPaddle] = useState<Paddle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // only run in browser
    (async () => {
      try {
        const instance = await initializePaddle({
          environment:
            import.meta.env.VITE_PADDLE_SANDBOX === 'true'
              ? 'sandbox'
              : 'production',
          token: import.meta.env.VITE_PADDLE_AUTH_TOKEN, // Dashboard → “Client-side auth token”
        });

        if (!instance) throw new Error('Paddle failed to initialise');
        setPaddle(instance);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <Context.Provider value={{ paddle, loading, error }}>
      {children}
    </Context.Provider>
  );
}

export function usePaddle() {
  const ctx = useContext(Context);
  if (!ctx) throw new Error('usePaddle must be inside <PaddleProvider>');
  return ctx; // { paddle, loading, error }
}
