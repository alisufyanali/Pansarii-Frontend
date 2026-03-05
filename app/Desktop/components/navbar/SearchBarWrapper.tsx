// components/navbar/SearchBarWrapper.tsx
'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';

// Create a component that uses useSearchParams
function SearchBarWithParams({
  placeholder = "Search for products...",
  variant = 'desktop',
  mockProducts = [],
  className = ""
}: {
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
}) {
  // Dynamically import useSearchParams only on client
  const { useSearchParams } = require('next/navigation');
  const searchParams = useSearchParams();
  
  // Get search query from URL to pre-populate the search bar
  const initialQuery = searchParams.get('search') || '';

  const SearchBar = dynamic(() => import('./searchbar'), {
    ssr: false,
    loading: () => (
      <div className="relative w-full">
        <input
          type="search"
          placeholder="Search for products..."
          className="w-full px-6 py-3 pr-12 border-2 border-gray-200 rounded-full bg-gray-50 animate-pulse"
          disabled
        />
      </div>
    ),
  });

  return (
    <SearchBar 
      placeholder={placeholder}
      variant={variant}
      mockProducts={mockProducts}
      className={className}
      initialQuery={initialQuery}
    />
  );
}

export default function SearchBarWrapper({
  placeholder = "Search for products...",
  variant = 'desktop',
  mockProducts = [],
  className = ""
}: {
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
}) {
  return (
    <Suspense fallback={
      <div className="relative w-full">
        <input
          type="search"
          placeholder="Search for products..."
          className="w-full px-6 py-3 pr-12 border-2 border-gray-200 rounded-full bg-gray-50 animate-pulse"
          disabled
        />
      </div>
    }>
      <SearchBarWithParams 
        placeholder={placeholder}
        variant={variant}
        mockProducts={mockProducts}
        className={className}
      />
    </Suspense>
  );
}