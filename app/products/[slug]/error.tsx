'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { FaBoxOpen, FaRedo, FaStore } from 'react-icons/fa';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ProductPageError({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error('[Product Page Error]', error);
  }, [error]);

  return (
    <div className="min-h-[70vh] bg-white flex items-center justify-center px-4">
      <div className="w-full max-w-md text-center">

        {/* Icon */}
        <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <FaBoxOpen className="w-9 h-9 text-amber-400" />
        </div>

        {/* Heading */}
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Couldn&apos;t load this product
        </h1>
        <p className="text-gray-500 text-sm mb-1">
          There was a problem loading the product details. Please try again.
        </p>

        {/* Error digest */}
        {error.digest && (
          <p className="text-xs text-gray-400 mb-6">
            Ref: <span className="font-mono">{error.digest}</span>
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
            href="/shop"
            className="inline-flex items-center justify-center gap-2 px-6 py-2.5 border-2 border-gray-200 text-gray-700 text-sm font-semibold rounded-full hover:bg-gray-100 transition"
          >
            <FaStore className="w-3.5 h-3.5" />
            Browse Products
          </Link>
        </div>

        {/* Secondary link */}
        <p className="mt-6 text-xs text-gray-400">
          Looking for something specific?{' '}
          <Link href="/" className="text-green-700 hover:underline font-medium">
            Go to homepage
          </Link>
        </p>

      </div>
    </div>
  );
}
