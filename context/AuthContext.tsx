'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from 'react';
import { useRouter } from 'next/navigation';
import {
  api,
  setAuthData,
  clearAuthData,
  getAuthToken,
  getStoredUser,
  isAxiosError,
} from '@/lib/axios';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  phone?: string;
  roles?: string[];
  customer?: Record<string, unknown>;
}

interface LoginPayload {
  email: string;
  password: string;
}

interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  phone: string;
}

interface AuthApiResponse {
  success: boolean;
  message: string;
  data: {
    token: string;
    user: AuthUser;
  };
}

// Field-level errors returned by Laravel 422
export type FieldErrors<T> = Partial<Record<keyof T, string>>;

interface AuthContextValue {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (payload: LoginPayload) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => Promise<void>;
}

// ─── Context ──────────────────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextValue | null>(null);

// ─── Provider ─────────────────────────────────────────────────────────────────

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Rehydrate from localStorage on mount
  useEffect(() => {
    const token = getAuthToken();
    const stored = getStoredUser<AuthUser>();
    if (token && stored) {
      setUser(stored);
    }
    setIsLoading(false);
  }, []);

  // ── login ──────────────────────────────────────────────────────────────────
  const login = useCallback(async (payload: LoginPayload) => {
    const res = await api.post<AuthApiResponse>('/login', payload);
    const { token, user: loggedInUser } = res.data;
    setAuthData(token, loggedInUser);
    setUser(loggedInUser);
  }, []);

  // ── register ───────────────────────────────────────────────────────────────
  const register = useCallback(async (payload: RegisterPayload) => {
    const res = await api.post<AuthApiResponse>('/register', payload);
    const { token, user: newUser } = res.data;
    setAuthData(token, newUser);
    setUser(newUser);
  }, []);

  // ── logout ─────────────────────────────────────────────────────────────────
  const logout = useCallback(async () => {
    try {
      await api.post('/logout');
    } catch {
      // Ignore errors — token may already be invalid
    }
    clearAuthData();
    setUser(null);
    router.push('/login');
  }, [router]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: Boolean(user),
        isLoading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}

// ─── Field error extractor (422 validation errors) ────────────────────────────

export function extractFieldErrors<T extends object>(
  err: unknown,
): FieldErrors<T> {
  if (!isAxiosError(err)) return {};
  const data = err.response?.data as
    | { errors?: Record<string, string[]> }
    | undefined;
  if (!data?.errors) return {};
  return Object.fromEntries(
    Object.entries(data.errors).map(([key, msgs]) => [key, msgs[0]]),
  ) as FieldErrors<T>;
}
