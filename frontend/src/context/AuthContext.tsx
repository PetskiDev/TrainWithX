// AuthProvider.tsx
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import type { UserDto } from '@shared/types/user';

interface AuthState {
  user: UserDto | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<UserDto>;
  register: (
    email: string,
    username: string,
    password: string
  ) => Promise<UserDto>;
  refreshUser: () => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthState | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserDto | null>(null);
  const [loading, setLoading] = useState(true);

  /* 1️⃣ session hydration */
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/v1/me', { credentials: 'include' });
        if (!res.ok) throw new Error();
        const data: UserDto = await res.json();
        setUser(data);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const login = async (email: string, password: string) => {
    const res = await fetch('/api/v1/auth/login', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) {
      const errorData = await res.json();
      if (errorData.reason === 'not_verified') {
        // Optional: trigger resend email here if you want automatic behavior
        throw new Error('Email not verified. Verification email is resent.');
      }
      throw new Error(errorData.error || 'Login failed');
    }
    const user: UserDto = await res.json();
    setUser(user);
    return user;
  };
  const register = async (
    email: string,
    username: string,
    password: string
  ) => {
    const res = await fetch('/api/v1/auth/register', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, username, password }),
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error || 'Registration failed');
    }

    const user: UserDto = await res.json();

    // Set user only if cookie was set (user is verified)
    if (user.isVerified) {
      setUser(user);
    }

    return user; // just to check after
  };
  const refreshUser = async () => {
    const res = await fetch('/api/v1/me', { credentials: 'include' });
    const updatedUser = await res.json();
    setUser(updatedUser);
  };
  const logout = async () => {
    await fetch('/api/v1/auth/logout', {
      method: 'POST',
      credentials: 'include',
    });
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, login, register, refreshUser, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
};
