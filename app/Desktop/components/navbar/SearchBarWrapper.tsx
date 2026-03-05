// components/navbar/SearchBarWrapper.tsx
'use client';

import { Suspense } from 'react';
import SearchBar, { type ProductSuggestion } from './searchbar';

interface SearchBarWrapperProps {
  placeholder?: string;
  className?: string;
  mockProducts?: ProductSuggestion[];
  initialQuery?: string;
  onSearch?: (query: string) => void;
}

function SearchBarFallback({ className }: { className?: string }) {
  return (
    <div className={`relative ${className ?? ''}`}>
      <div className="w-full h-[34px] bg-gray-100 rounded-full animate-pulse" />
    </div>
  );
}

export default function SearchBarWrapper({
  placeholder,
  className,
  mockProducts,
  initialQuery,
  onSearch,
}: SearchBarWrapperProps) {
  return (
    <Suspense fallback={<SearchBarFallback className={className} />}>
      <SearchBar
        placeholder={placeholder}
        className={className}
        mockProducts={mockProducts}
        initialQuery={initialQuery}
        onSearch={onSearch}
      />
    </Suspense>
  );
}