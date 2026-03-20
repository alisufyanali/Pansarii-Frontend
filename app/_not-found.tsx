// app/_not-found.tsx
import Link from 'next/link';
import { Suspense } from 'react';

export default function NotFound() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-700"></div>
      </div>
    }>
      <div className="min-h-screen bg-white flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-9xl font-bold text-gray-300 mb-4">404</h1>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Page Not Found</h2>
          <p className="text-gray-600 text-lg mb-8">
            The page you're looking for doesn't exist.
          </p>
          <Link 
            href="/"
            className="inline-block bg-green-700 text-white px-8 py-3 rounded-full font-semibold hover:bg-green-600 transition"
          >
            Go Back Home
          </Link>
        </div>
      </div>
    </Suspense>
  );
}