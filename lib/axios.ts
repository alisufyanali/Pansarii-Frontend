/**
 * lib/axios.ts
 *
 * Central Axios instance for all Laravel API calls.
 *
 * Features:
 *  - Base URL from NEXT_PUBLIC_API_URL env variable
 *  - Automatically attaches Bearer token from localStorage on every request
 *  - Intercepts 401 responses → clears auth data and redirects to /login
 *  - Typed response/error helpers exported for use across the app
 */

import axios, {
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios';

// ─── Base URL ─────────────────────────────────────────────────────────────────
// Falls back to localhost so the app never crashes if .env.local is missing
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000/api';

// ─── Create instance ──────────────────────────────────────────────────────────
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000, // 15 s — enough for slow mobile connections
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// ─── Token helpers ────────────────────────────────────────────────────────────
// Centralised so every part of the app reads/writes the same key.

const TOKEN_KEY = 'pansari-auth-token';
const USER_KEY  = 'pansari-auth-user';

/**
 * Read the stored Bearer token.
 * Returns null when called on the server (no window).
 */
export function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(TOKEN_KEY);
}

/** Persist token + user after a successful login / register response. */
export function setAuthData(token: string, user: unknown): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

/** Wipe auth data (called on logout or 401). */
export function clearAuthData(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

/** Read the stored user object, or null if not logged in. */
export function getStoredUser<T = unknown>(): T | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

/** Returns true when a token exists in storage. */
export function isAuthenticated(): boolean {
  return Boolean(getAuthToken());
}

// ─── Request interceptor — attach token ───────────────────────────────────────
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    const token = getAuthToken();

    if (token) {
      // Axios v1 stores headers as an AxiosHeaders object
      config.headers.set('Authorization', `Bearer ${token}`);
    }

    return config;
  },
  (error: AxiosError) => Promise.reject(error),
);

// ─── Response interceptor — handle 401 ───────────────────────────────────────
apiClient.interceptors.response.use(
  // Pass successful responses straight through
  (response: AxiosResponse) => response,

  // Handle errors
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Token expired or invalid — clean up and redirect to login
      clearAuthData();

      // Only redirect in the browser (not during SSR/RSC)
      if (typeof window !== 'undefined') {
        // Preserve the page the user was trying to reach so we can
        // redirect back after a successful login.
        const returnTo = encodeURIComponent(window.location.pathname);
        window.location.href = `/login?returnTo=${returnTo}`;
      }
    }

    return Promise.reject(error);
  },
);

// ─── Typed API error helper ───────────────────────────────────────────────────

/**
 * Shape of a Laravel validation error response.
 * Laravel returns: { message: string; errors: Record<string, string[]> }
 */
export interface LaravelValidationError {
  message: string;
  errors: Record<string, string[]>;
}

/**
 * Narrow an unknown catch value to an AxiosError.
 * Usage:
 *   catch (err) {
 *     if (isAxiosError(err)) { ... err.response?.data ... }
 *   }
 */
export function isAxiosError(err: unknown): err is AxiosError {
  return axios.isAxiosError(err);
}

/**
 * Extract a human-readable error message from any API error.
 *
 * Priority:
 *  1. First Laravel validation error string
 *  2. Laravel `message` field
 *  3. Axios network/timeout message
 *  4. Generic fallback
 */
export function getApiErrorMessage(err: unknown): string {
  if (!isAxiosError(err)) {
    return err instanceof Error ? err.message : 'An unexpected error occurred.';
  }

  const data = err.response?.data as Partial<LaravelValidationError> | undefined;

  // Laravel validation errors — return the first field's first message
  if (data?.errors) {
    const firstField = Object.values(data.errors)[0];
    if (firstField?.[0]) return firstField[0];
  }

  // Laravel generic message
  if (data?.message) return data.message;

  // Network / timeout
  if (err.code === 'ECONNABORTED') return 'Request timed out. Please try again.';
  if (!err.response)               return 'Network error. Check your connection.';

  return 'Something went wrong. Please try again.';
}

// ─── Convenience wrappers ─────────────────────────────────────────────────────
// These are thin wrappers that unwrap `.data` so callers don't have to.

export const api = {
  /**
   * GET /endpoint
   * @example const products = await api.get<Product[]>('/products');
   */
  get: async <T>(url: string, params?: Record<string, unknown>): Promise<T> => {
    const res = await apiClient.get<T>(url, { params });
    return res.data;
  },

  /**
   * POST /endpoint
   * @example const user = await api.post<User>('/auth/login', { email, password });
   */
  post: async <T>(url: string, body?: unknown): Promise<T> => {
    const res = await apiClient.post<T>(url, body);
    return res.data;
  },

  /**
   * PUT /endpoint
   * @example await api.put('/profile', updatedData);
   */
  put: async <T>(url: string, body?: unknown): Promise<T> => {
    const res = await apiClient.put<T>(url, body);
    return res.data;
  },

  /**
   * PATCH /endpoint
   * @example await api.patch('/orders/5', { status: 'shipped' });
   */
  patch: async <T>(url: string, body?: unknown): Promise<T> => {
    const res = await apiClient.patch<T>(url, body);
    return res.data;
  },

  /**
   * DELETE /endpoint
   * @example await api.delete('/cart/items/3');
   */
  delete: async <T>(url: string): Promise<T> => {
    const res = await apiClient.delete<T>(url);
    return res.data;
  },

  /**
   * POST with multipart/form-data (file uploads).
   * @example await api.upload('/products/image', formData);
   */
  upload: async <T>(url: string, formData: FormData): Promise<T> => {
    const res = await apiClient.post<T>(url, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },
};

// Default export is the raw Axios instance for advanced use cases
export default apiClient;
