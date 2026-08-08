// app/register/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FiUser, FiMail, FiLock, FiEye, FiEyeOff, FiPhone, FiCheck } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { useAuth, extractFieldErrors } from '@/context/AuthContext';
import { getApiErrorMessage } from '@/lib/axios';

// ─── Field error shape ────────────────────────────────────────────────────────
interface RegisterFields {
  name: string;
  email: string;
  phone: string;
  password: string;
  password_confirmation: string;
}

// ─── Password requirement rules ───────────────────────────────────────────────
const PASSWORD_RULES = [
  { id: 'length',    label: 'At least 8 characters',     test: (p: string) => p.length >= 8           },
  { id: 'uppercase', label: 'One uppercase letter (A–Z)', test: (p: string) => /[A-Z]/.test(p)        },
  { id: 'number',    label: 'One number (0–9)',           test: (p: string) => /[0-9]/.test(p)        },
  { id: 'symbol',    label: 'One symbol (!@#$…)',         test: (p: string) => /[^A-Za-z0-9]/.test(p) },
] as const;

// All four rules are rendered simultaneously as soon as the field has been focused.
// Each rule's indicator toggles independently as the user types.
function PasswordChecklist({ password, visible }: { password: string; visible: boolean }) {
  if (!visible) return null;
  return (
    <ul className="mt-2 space-y-1 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5">
      {PASSWORD_RULES.map(rule => {
        const met = rule.test(password);
        return (
          <li key={rule.id} className="flex items-center gap-2 text-xs">
            <span className={`flex-shrink-0 w-4 h-4 rounded-full flex items-center justify-center transition-colors ${
              met ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-400'
            }`}>
              {met && <FiCheck className="w-2.5 h-2.5" />}
            </span>
            <span className={met ? 'text-green-700 font-medium' : 'text-gray-500'}>
              {rule.label}
            </span>
          </li>
        );
      })}
    </ul>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function RegisterPage() {
  const router       = useRouter();
  const { register } = useAuth();

  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', password: '', confirmPassword: '',
  });
  const [showPassword,        setShowPassword]        = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading,           setIsLoading]           = useState(false);
  const [fieldErrors,         setFieldErrors]         = useState<Partial<RegisterFields & { confirmPassword: string }>>({});
  const [apiError,            setApiError]            = useState('');
  // Show checklist once the password field has been focused at least once
  const [passwordFocused,     setPasswordFocused]     = useState(false);
  // Controlled state — completely decoupled from form submission
  const [termsAccepted,       setTermsAccepted]       = useState(false);

  // ── Client validation ───────────────────────────────────────────────────────
  const validate = (): boolean => {
    const errs: typeof fieldErrors = {};
    if (!formData.name || formData.name.length < 2)
      errs.name = 'Name must be at least 2 characters';
    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email))
      errs.email = 'Valid email is required';
    if (!formData.phone || !/^[0-9]{10,15}$/.test(formData.phone.replace(/[-()\s+]/g, '')))
      errs.phone = 'Valid phone number is required';
    if (!formData.password || formData.password.length < 8)
      errs.password = 'Password must be at least 8 characters';
    if (formData.password !== formData.confirmPassword)
      errs.confirmPassword = 'Passwords do not match';
    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // ── Submit ──────────────────────────────────────────────────────────────────
  // Order: (1) terms check → early return with toast
  //        (2) validate()  → early return with field errors
  //        (3) API call    → register()
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError('');

    if (!termsAccepted) {
      toast.error('Please accept the Terms of Service and Privacy Policy to continue.');
      return; // stops here — no API call
    }

    if (!validate()) return; // stops here — no API call

    setIsLoading(true);
    try {
      await register({
        name:                  formData.name,
        email:                 formData.email,
        phone:                 formData.phone,
        password:              formData.password,
        password_confirmation: formData.confirmPassword,
      });
      toast.success('Registration successful! Welcome to Pansari Inn 🎉');
      router.push('/');
    } catch (err) {
      const fields = extractFieldErrors<RegisterFields>(err);
      if (Object.keys(fields).length) {
        const { password_confirmation, ...rest } = fields;
        setFieldErrors({ ...rest, confirmPassword: password_confirmation });
      } else {
        setApiError(getApiErrorMessage(err));
        toast.error(getApiErrorMessage(err));
      }
    } finally {
      setIsLoading(false);
    }
  };

  // ── Field change ────────────────────────────────────────────────────────────
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if ((fieldErrors as Record<string, unknown>)[name])
      setFieldErrors(prev => ({ ...prev, [name]: undefined }));
    if (apiError) setApiError('');
  };

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-white p-4">
      <div className="w-full max-w-md">

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Account</h1>
          <p className="text-gray-600">Join Pansari Inn today</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-5" noValidate>

            {/* API error banner */}
            {apiError && (
              <div className="px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                {apiError}
              </div>
            )}

            {/* Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <div className="relative">
                <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="name" name="name" type="text" autoComplete="name"
                  value={formData.name} onChange={handleChange} disabled={isLoading}
                  placeholder="Ahmed Khan"
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all disabled:opacity-60 ${fieldErrors.name ? 'border-red-500' : 'border-gray-300'}`}
                />
              </div>
              {fieldErrors.name && <p className="mt-1 text-sm text-red-500">{fieldErrors.name}</p>}
            </div>

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

            {/* Phone */}
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              <div className="relative">
                <FiPhone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="phone" name="phone" type="tel" autoComplete="tel"
                  value={formData.phone} onChange={handleChange} disabled={isLoading}
                  placeholder="+92 304 5779900"
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all disabled:opacity-60 ${fieldErrors.phone ? 'border-red-500' : 'border-gray-300'}`}
                />
              </div>
              {fieldErrors.phone && <p className="mt-1 text-sm text-red-500">{fieldErrors.phone}</p>}
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="password" name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  value={formData.password} onChange={handleChange} disabled={isLoading}
                  placeholder="Create a strong password"
                  onFocus={() => setPasswordFocused(true)}
                  className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all disabled:opacity-60 ${fieldErrors.password ? 'border-red-500' : 'border-gray-300'}`}
                />
                <button type="button" onClick={() => setShowPassword(p => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}>
                  {showPassword ? <FiEyeOff className="w-5 h-5" /> : <FiEye className="w-5 h-5" />}
                </button>
              </div>
              {/* All 4 rules render at once; each toggles its own indicator independently */}
              <PasswordChecklist password={formData.password} visible={passwordFocused} />
              {fieldErrors.password && <p className="mt-1 text-sm text-red-500">{fieldErrors.password}</p>}
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="confirmPassword" name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  value={formData.confirmPassword} onChange={handleChange} disabled={isLoading}
                  placeholder="Confirm your password"
                  className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all disabled:opacity-60 ${fieldErrors.confirmPassword ? 'border-red-500' : 'border-gray-300'}`}
                />
                <button type="button" onClick={() => setShowConfirmPassword(p => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}>
                  {showConfirmPassword ? <FiEyeOff className="w-5 h-5" /> : <FiEye className="w-5 h-5" />}
                </button>
              </div>
              {fieldErrors.confirmPassword && <p className="mt-1 text-sm text-red-500">{fieldErrors.confirmPassword}</p>}
            </div>

            {/* Terms — controlled checkbox; links are in a plain <span>, not a <label>,
                so clicking them never bubbles to the checkbox or triggers submission.
                target="_blank" opens in a new tab — the current registration tab is
                completely unaffected (React state, form values, all preserved). */}
            <div className="flex items-start gap-2">
              <input
                type="checkbox"
                id="terms"
                checked={termsAccepted}
                onChange={e => setTermsAccepted(e.target.checked)}
                disabled={isLoading}
                className="w-4 h-4 mt-0.5 flex-shrink-0 text-green-600 border-gray-300 rounded focus:ring-green-500 cursor-pointer"
              />
              <span className="text-sm text-gray-600 leading-snug">
                I agree to the{' '}
                <Link
                  href="/terms"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-green-600 hover:text-green-700 font-medium underline-offset-2 hover:underline"
                  onClick={e => e.stopPropagation()}
                >
                  Terms of Service
                </Link>
                {' '}and{' '}
                <Link
                  href="/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-green-600 hover:text-green-700 font-medium underline-offset-2 hover:underline"
                  onClick={e => e.stopPropagation()}
                >
                  Privacy Policy
                </Link>
              </span>
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
                  Creating account…
                </>
              ) : 'Create Account'}
            </button>
          </form>

          <div className="my-6 flex items-center">
            <div className="flex-1 border-t border-gray-300" />
            <span className="px-4 text-sm text-gray-500">or</span>
            <div className="flex-1 border-t border-gray-300" />
          </div>

          <p className="text-center text-sm text-gray-600">
            Already have an account?{' '}
            <Link href="/login" className="text-green-600 hover:text-green-700 font-semibold">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
