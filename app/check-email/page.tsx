'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { FiMail } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { getApiErrorMessage } from '@/lib/axios';

interface ForgotPasswordResponse {
  success: boolean;
  message: string;
}

export default function CheckEmailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email') ?? '';

  const [countdown, setCountdown] = useState(60);
  const [isResending, setIsResending] = useState(false);
  const [apiError, setApiError] = useState('');

  useEffect(() => {
    if (!email) {
      router.replace('/forgot-password');
      return;
    }

    if (countdown <= 0) return;
    const timer = window.setInterval(() => setCountdown((prev) => prev - 1), 1000);
    return () => window.clearInterval(timer);
  }, [countdown, email, router]);

  const handleResend = async () => {
    setApiError('');
    setIsResending(true);

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = (await response.json()) as ForgotPasswordResponse;
      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Unable to resend reset link.');
      }

      toast.success(data.message || 'Reset link sent again.');
      setCountdown(60);
    } catch (err) {
      const message = getApiErrorMessage(err);
      setApiError(message);
      toast.error(message);
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-white p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Check your email</h1>
          <p className="text-gray-600">We&apos;ve sent a password reset link to your email</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 space-y-6">
          {apiError && (
            <div className="px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
              {apiError}
            </div>
          )}

          <div className="flex justify-center">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
              <FiMail className="w-8 h-8 text-green-600" />
            </div>
          </div>

          <p className="text-sm text-center text-gray-600 break-all">{email}</p>

          <button
            type="button"
            onClick={handleResend}
            disabled={isResending || countdown > 0}
            className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors shadow-md hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isResending ? (
              <>
                <svg className="animate-spin w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Resending…
              </>
            ) : countdown > 0 ? `Resend in ${countdown}s` : 'Resend Email'}
          </button>

          <p className="text-center text-sm text-gray-600">
            <Link href="/login" className="text-green-600 hover:text-green-700 font-semibold">
              Back to Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
