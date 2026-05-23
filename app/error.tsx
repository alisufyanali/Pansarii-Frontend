'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { FaExclamationTriangle, FaRedo, FaHome, FaStore } from 'react-icons/fa';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log to console in dev only
    if (process.env.NODE_ENV === 'development') {
      console.error('[Global Error]', error);
    }
    // TODO: Add Sentry here when ready
    // Sentry.captureException(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md text-center">

        {/* Icon */}
        <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <FaExclamationTriangle className="w-9 h-9 text-red-400" />
        </div>

        {/* Heading */}
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Something went wrong
        </h1>
        <p className="text-gray-500 text-sm mb-1">
          An unexpected error occurred. Our team has been notified.
        </p>

        {/* Error digest for support reference */}
        {error.digest && (
          <p className="text-xs text-gray-400 mb-6">
            Error ID: <span className="font-mono">{error.digest}</span>
          </p>
        )}
        {!error.digest && <div className="mb-6" />}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={reset}
            className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-green-700 text-white text-sm font-semibold rounded-full hover:bg-green-600 transition shadow-sm hover:shadow-md"
          >
            <FaRedo className="w-3.5 h-3.5" />
            Try Again
          </button>
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-2.5 border-2 border-gray-200 text-gray-700 text-sm font-semibold rounded-full hover:bg-gray-100 transition"
          >
            <FaHome className="w-3.5 h-3.5" />
            Back to Home
          </Link>
        </div>

        {/* Secondary link */}
        <p className="mt-6 text-xs text-gray-400">
          Still having trouble?{' '}
          <Link href="/contact" className="text-green-700 hover:underline font-medium">
            Contact support
          </Link>
        </p>

      </div>
    </div>
  );
}
