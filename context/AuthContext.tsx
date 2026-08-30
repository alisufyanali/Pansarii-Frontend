'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
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
  /** Inject cart merge callback — called by CartProvider */
  setCartMerge: (fn: () => Promise<void>) => void;
  /** Inject wishlist merge callback — called by WishlistProvider */
  setWishlistMerge: (fn: () => Promise<void>) => void;
}

// ─── Context ──────────────────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextValue | null>(null);

// ─── Provider ─────────────────────────────────────────────────────────────────

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  // Cart merge callback — injected by CartContext after it mounts
  const cartMergeRef = useRef<(() => Promise<void>) | null>(null);
  // Wishlist merge callback — injected by WishlistContext after it mounts
  const wishlistMergeRef = useRef<(() => Promise<void>) | null>(null);

  const setCartMerge = useCallback((fn: () => Promise<void>) => {
    cartMergeRef.current = fn;
  }, []);

  const setWishlistMerge = useCallback((fn: () => Promise<void>) => {
    wishlistMergeRef.current = fn;
  }, []);

  // Rehydrate from localStorage on mount
  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      const token = getAuthToken();
      const stored = getStoredUser<AuthUser>();
      if (token && stored) setUser(stored);
      setIsLoading(false);
    });
    return () => cancelAnimationFrame(frame);
  }, []);

  // ── login ──────────────────────────────────────────────────────────────────
  const login = useCallback(async (payload: LoginPayload) => {
    const res = await api.post<AuthApiResponse>('/login', payload);
    // Guard: backend may return HTTP 200 with success:false for invalid
    // credentials instead of a proper 401. Without this check, login()
    // would resolve successfully despite bad credentials, causing
    // handleSubmit to proceed to window.location.href (full page reload).
    if (!res.data.success) {
      throw new Error(res.data.message || 'Login failed');
    }
    const { token, user: loggedInUser } = res.data.data;
    setAuthData(token, loggedInUser);
    setUser(loggedInUser);
    // Merge guest cart into API cart after successful login
    if (cartMergeRef.current) {
      try { await cartMergeRef.current(); } catch { /* non-blocking */ }
    }
    // Merge guest wishlist into API wishlist after successful login
    if (wishlistMergeRef.current) {
      try { await wishlistMergeRef.current(); } catch { /* non-blocking */ }
    }
  }, []);

  // ── register ───────────────────────────────────────────────────────────────
  const register = useCallback(async (payload: RegisterPayload) => {
    const res = await api.post<AuthApiResponse>('/register', payload);
    // Same success:false guard as login — backend may return 200 with
    // success:false for validation failures that slip past HTTP status codes.
    if (!res.data.success) {
      throw new Error(res.data.message || 'Registration failed');
    }
    const { token, user: newUser } = res.data.data;
    setAuthData(token, newUser);
    setUser(newUser);
    // Merge guest cart after registration too
    if (cartMergeRef.current) {
      try { await cartMergeRef.current(); } catch { /* non-blocking */ }
    }
    // Merge guest wishlist after registration too
    if (wishlistMergeRef.current) {
      try { await wishlistMergeRef.current(); } catch { /* non-blocking */ }
    }
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
        // Derived from user state so it's reactive — consumers re-render when
        // user changes (login/logout/rehydration), not just on token reads.
        isAuthenticated: user !== null,
        isLoading,
        login,
        register,
        logout,
        setCartMerge,
        setWishlistMerge,
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
