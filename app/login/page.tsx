// app/login/page.tsx
'use client';

import { Suspense, useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { useAuth, extractFieldErrors } from '@/context/AuthContext';
import { getApiErrorMessage } from '@/lib/axios';

// ─── Wrapper ──────────────────────────────────────────────────────────────────

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-white">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-700" />
        </div>
      }
    >
      <LoginPageContent />
    </Suspense>
  );
}

// ─── Open-redirect protection ─────────────────────────────────────────────────
// Only allow relative internal paths. Reject anything that starts with '//'
// (protocol-relative URL) or contains a protocol (http://, https://).
function safeReturnTo(raw: string): string {
  try {
    const decoded = decodeURIComponent(raw);
    if (
      decoded.startsWith('/') &&
      !decoded.startsWith('//') &&
      !/^[a-z][a-z0-9+\-.]*:/i.test(decoded)
    ) {
      return decoded;
    }
  } catch {
    // malformed URI component — fall through to default
  }
  return '/';
}

// ─── Field error shape ────────────────────────────────────────────────────────
interface LoginFields {
  email: string;
  password: string;
}

// ─── Content ──────────────────────────────────────────────────────────────────

function LoginPageContent() {
  const searchParams = useSearchParams();
  const { login, isAuthenticated, isLoading: authLoading } = useAuth();

  // Keep a ref always pointing at the latest searchParams object.
  const searchParamsRef = useRef(searchParams);
  useEffect(() => {
    searchParamsRef.current = searchParams;
  }, [searchParams]);

  // Tracks whether handleSubmit already triggered navigation after a fresh login.
  // When true, the mount-guard effect below must not fire a competing redirect.
  const hasNavigatedRef = useRef(false);

  // ── All useState hooks declared unconditionally before any early return ─────
  const [formData, setFormData] = useState<LoginFields>({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading,    setIsLoading]    = useState(false);
  const [apiError,     setApiError]     = useState('');
  const [fieldErrors,  setFieldErrors]  = useState<Partial<LoginFields>>({});

  // Guard: redirect away from /login if the user is already authenticated.
  // Does NOT run after a fresh login — handleSubmit owns that redirect.
  //
  // Uses window.location.replace (hard navigation) instead of router.replace
  // because router.replace is a no-op when called during the first post-Suspense
  // render commit before the App Router is fully hydrated on the client.
  useEffect(() => {
    if (!authLoading && isAuthenticated && !hasNavigatedRef.current) {
      const raw      = searchParamsRef.current.get('returnTo') ?? '/';
      const returnTo = safeReturnTo(raw);
      window.location.replace(returnTo);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, authLoading]);

  // While auth is resolving OR once confirmed authenticated (redirect imminent),
  // render only the spinner so the login form never flashes.
  if (authLoading || isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-white">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-700" />
      </div>
    );
  }

  // ── Client validation ───────────────────────────────────────────────────────
  const validate = (): boolean => {
    const errs: Partial<LoginFields> = {};
    if (!formData.email)                         errs.email    = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) errs.email = 'Email is invalid';
    if (!formData.password)                      errs.password = 'Password is required';
    else if (formData.password.length < 6)       errs.password = 'Password must be at least 6 characters';
    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // ── Submit ──────────────────────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError('');
    if (!validate()) return;

    setIsLoading(true);
    try {
      await login({ email: formData.email, password: formData.password });

      // Mark as navigated BEFORE redirecting so the mount-guard useEffect
      // cannot fire a competing redirect when isAuthenticated commits.
      hasNavigatedRef.current = true;

      const raw      = searchParamsRef.current.get('returnTo') ?? '/';
      const returnTo = safeReturnTo(raw);

      // Toast first — router.replace unmounts this component before the toast
      // library can schedule its render if called after navigation.
      toast.success('Login successful!');

      // Use window.location.href instead of router.replace so navigation
      // always fires even when returnTo resolves to the current route.
      // router.replace('/') is a no-op when the user is already at '/',
      // which causes the "toast shows but no redirect" symptom.
      window.location.href = returnTo;
    } catch (err) {
      // Map Laravel 422 field errors
      const fields = extractFieldErrors<LoginFields>(err);
      if (Object.keys(fields).length) {
        setFieldErrors(fields);
      } else {
        // 401 → "These credentials do not match our records."
        setApiError(getApiErrorMessage(err));
      }
    } finally {
      setIsLoading(false);
    }
  };

  // ── Field change ────────────────────────────────────────────────────────────
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (fieldErrors[name as keyof LoginFields]) setFieldErrors(prev => ({ ...prev, [name]: undefined }));
    if (apiError) setApiError('');
  };

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-white p-4">
      <div className="w-full max-w-md">

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h1>
          <p className="text-gray-600">Sign in to your Pansari account</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6" noValidate>

            {/* API error banner */}
            {apiError && (
              <div className="px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                {apiError}
              </div>
            )}

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="email" name="email" type="email" autoComplete="email"
                  value={formData.email} onChange={handleChange} disabled={isLoading}
                  placeholder="your@email.com"
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all disabled:opacity-60 ${fieldErrors.email ? 'border-red-500' : 'border-gray-300'}`}
                />
              </div>
              {fieldErrors.email && <p className="mt-1 text-sm text-red-500">{fieldErrors.email}</p>}
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="password" name="password" type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  value={formData.password} onChange={handleChange} disabled={isLoading}
                  placeholder="Enter your password"
                  className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all disabled:opacity-60 ${fieldErrors.password ? 'border-red-500' : 'border-gray-300'}`}
                />
                <button
                  type="button" onClick={() => setShowPassword(p => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <FiEyeOff className="w-5 h-5" /> : <FiEye className="w-5 h-5" />}
                </button>
              </div>
              {fieldErrors.password && <p className="mt-1 text-sm text-red-500">{fieldErrors.password}</p>}
            </div>

            {/* Remember + Forgot */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500" />
                <span className="text-sm text-gray-600">Remember me</span>
              </label>
              <Link href="/forgot-password" className="text-sm text-green-600 hover:text-green-700 font-medium">
                Forgot password?
              </Link>
            </div>

            {/* Submit */}
            <button
              type="submit" disabled={isLoading}
              className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors shadow-md hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Signing in…
                </>
              ) : 'Sign In'}
            </button>
          </form>

          <div className="my-6 flex items-center">
            <div className="flex-1 border-t border-gray-300" />
            <span className="px-4 text-sm text-gray-500">or</span>
            <div className="flex-1 border-t border-gray-300" />
          </div>

          <p className="text-center text-sm text-gray-600">
            Don&apos;t have an account?{' '}
            <Link href="/register" className="text-green-600 hover:text-green-700 font-semibold">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
