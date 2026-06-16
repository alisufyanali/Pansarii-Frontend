'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FiCheckCircle } from 'react-icons/fi';

export default function ResetPasswordSuccessPage() {
  const router = useRouter();

  useEffect(() => {
    const timer = window.setTimeout(() => {
      router.push('/login');
    }, 3000);
    return () => window.clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-white p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center space-y-6">
          <div className="flex justify-center">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
              <FiCheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </div>

          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Password Reset Successful</h1>
            <p className="text-gray-600">Your password has been updated successfully.</p>
          </div>

          <Link
            href="/login"
            className="w-full inline-flex items-center justify-center bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors shadow-md hover:shadow-lg"
          >
            Go to Login
          </Link>

          <p className="text-xs text-gray-500">Redirecting to login in 3 seconds…</p>
        </div>
      </div>
    </div>
  );
}
