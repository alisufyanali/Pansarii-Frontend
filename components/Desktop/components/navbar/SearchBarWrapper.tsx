'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';

// ── Move dynamic import OUTSIDE the component so it is never recreated ──
// This is the fix for the blinking: dynamic() inside a component body
// creates a new loader on every render → unmount/remount → blink.
const SearchBar = dynamic(() => import('./searchbar'), {
  ssr: false,
  loading: () => (
    <div className="relative w-full">
      <input
        type="text"
        placeholder="Search for products..."
        className="w-full px-5 py-1.5 pr-8 border border-gray-200 rounded-full bg-gray-50 animate-pulse text-sm"
        disabled
      />
    </div>
  ),
});

interface SearchBarWrapperProps {
  placeholder?: string;
  variant?: 'desktop' | 'mobile';
  mockProducts?: Array<{
    id: string;
    name: string;
    slug: string;
    price: number;
    salePrice?: number;
    image?: string;
    category?: string;
    rating?: number;
    isBestSeller?: boolean;
  }>;
  className?: string;
}

// ── No useSearchParams here — navbar search is intentionally NOT synced
// to the URL. The shop's SearchFilterBar manages its own URL state.
// The navbar bar always starts empty and navigates to /shop?search=...
// on submit, at which point the shop page reads the URL itself.
export default function SearchBarWrapper({
  placeholder = "Search for products...",
  variant = 'desktop',
  mockProducts = [],
  className = "",
}: SearchBarWrapperProps) {
  return (
    <Suspense fallback={
      <div className="relative w-full">
        <input
          type="text"
          placeholder="Search for products..."
          className="w-full px-5 py-1.5 pr-8 border border-gray-200 rounded-full bg-gray-50 animate-pulse text-sm"
          disabled
        />
      </div>
    }>
      {/* initialQuery intentionally omitted — navbar search always starts blank */}
      <SearchBar
        placeholder={placeholder}
        variant={variant}
        mockProducts={mockProducts}
        className={className}
      />
    </Suspense>
  );
}
