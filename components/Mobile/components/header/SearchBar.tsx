// app/Mobile/components/Header/SearchBar.tsx
"use client";

import { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { 
  FiSearch, 
  FiX, 
  FiClock,
  FiChevronRight 
} from 'react-icons/fi';
import { HiOutlineShoppingBag } from 'react-icons/hi';
import { useSearchParams } from 'next/navigation';

export interface ProductSuggestion {
  id: string;
  name: string;
  slug: string;
  price: number;
  salePrice?: number;
  image?: string;
  category?: string;
  rating?: number;
  isBestSeller?: boolean;
}

interface SearchBarProps {
  placeholder?: string;
  className?: string;
  mockProducts?: ProductSuggestion[];
}

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}

export default function SearchBar({ 
  placeholder = "Search for products...", 
  className = "",
  mockProducts = []
}: SearchBarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<ProductSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const debouncedQuery = useDebounce(query, 300);

  // Load recent searches
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('recentSearches');
      if (stored) {
        try {
          setRecentSearches(JSON.parse(stored));
        } catch (error) {
          if (process.env.NODE_ENV === 'development') {
            console.error('Error parsing recent searches:', error);
          }
        }
      }
    }
  }, []);

  // Fetch suggestions
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (!debouncedQuery.trim()) {
        setSuggestions([]);
        return;
      }

      setIsLoading(true);
      try {
        if (mockProducts.length > 0) {
          const filtered = mockProducts.filter(product => 
            product.name.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
            product.category?.toLowerCase().includes(debouncedQuery.toLowerCase())
          ).slice(0, 5);
          
          setSuggestions(filtered);
        } else {
          const response = await fetch(
            `/api/search/suggestions?q=${encodeURIComponent(debouncedQuery)}&limit=5`
          );
          
          if (response.ok) {
            const data = await response.json();
            setSuggestions(data.suggestions || []);
          }
        }
      } catch (error) {
        if (process.env.NODE_ENV === 'development') {
          console.error('Failed to fetch suggestions:', error);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchSuggestions();
  }, [debouncedQuery, mockProducts]);

  // Click outside handler
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const closeSearch = useCallback(() => {
    setIsOpen(false);
    setQuery('');
    setSuggestions([]);
  }, []);

  const handleSearch = useCallback((searchQuery: string) => {
    if (!searchQuery.trim()) return;

    // Save to recent searches
    const updatedSearches = [
      searchQuery,
      ...recentSearches.filter(s => s.toLowerCase() !== searchQuery.toLowerCase())
    ].slice(0, 5);

    setRecentSearches(updatedSearches);
    if (typeof window !== 'undefined') {
      localStorage.setItem('recentSearches', JSON.stringify(updatedSearches));
    }

    // Close the modal and clear input
    closeSearch();

    // Navigate to shop page with search query
    router.push(`/shop?search=${encodeURIComponent(searchQuery)}`);
  }, [recentSearches, router, closeSearch]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(query);
  };

  const handleSuggestionClick = (product: ProductSuggestion) => {
    handleSearch(product.name);
  };

  const handleRecentSearchClick = (search: string) => {
    handleSearch(search);
  };

  const clearInput = () => {
    setQuery('');
    setSuggestions([]);
    inputRef.current?.focus();
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('recentSearches');
    }
  };

  const formatPrice = (price: number) => {
    return `PKR ${price.toLocaleString()}`;
  };

  return (
    <div ref={searchRef} className={`relative ${className}`}>
      <form onSubmit={handleSubmit} className="relative">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          className="w-full px-3 py-2.5 pl-10 pr-10 bg-gray-50 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white border border-gray-200 transition-all duration-200 text-gray-900 placeholder-gray-500"
          aria-label="Search products"
          autoComplete="off"
        />
        
        <div className="absolute left-3 top-1/2 -translate-y-1/2">
          <FiSearch className="w-4 h-4 text-gray-400" />
        </div>
        
        {query && (
          <button
            type="button"
            onClick={clearInput}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 transition"
            aria-label="Clear search"
          >
            <FiX className="w-4 h-4" />
          </button>
        )}
      </form>

      {/* Suggestions Dropdown */}
      {isOpen && (query || recentSearches.length > 0) && (
        <div 
          className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-xl border border-gray-200 z-50 max-h-[70vh] overflow-y-auto"
        >
          {/* Recent Searches */}
          {!query && recentSearches.length > 0 && (
            <div className="p-3 border-b border-gray-100">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <FiClock className="w-3.5 h-3.5 text-gray-400" />
                  <h3 className="text-xs font-semibold text-gray-700">Recent</h3>
                </div>
                <button
                  onClick={clearRecentSearches}
                  className="text-xs text-green-600 hover:text-green-700 font-medium"
                >
                  Clear
                </button>
              </div>
              <div className="space-y-0.5">
                {recentSearches.map((search, index) => (
                  <button
                    key={index}
                    onClick={() => handleRecentSearchClick(search)}
                    className="flex items-center justify-between w-full p-2 text-sm text-gray-700 hover:bg-gray-50 rounded transition"
                  >
                    <div className="flex items-center gap-2">
                      <FiClock className="w-3.5 h-3.5 text-gray-400" />
                      <span className="text-xs">{search}</span>
                    </div>
                    <FiChevronRight className="w-3 h-3 text-gray-300" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Product Suggestions */}
          {query && suggestions.length > 0 && (
            <div className="p-3">
              <h3 className="text-xs font-semibold text-gray-700 mb-2">
                Products ({suggestions.length})
              </h3>
              
              <div className="space-y-1.5">
                {suggestions.map((product) => (
                  <button
                    key={product.id}
                    onClick={() => handleSuggestionClick(product)}
                    className="flex items-center gap-2.5 w-full p-2 hover:bg-gray-50 rounded-lg transition"
                  >
                    {product.image ? (
                      <div className="relative w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
                        <Image
                          src={product.image}
                          alt={product.name}
                          fill
                          className="object-cover"
                          sizes="40px"
                        />
                      </div>
                    ) : (
                      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <HiOutlineShoppingBag className="w-4 h-4 text-gray-400" />
                      </div>
                    )}
                    
                    <div className="flex-1 text-left min-w-0">
                      <p className="text-xs font-medium text-gray-900 truncate">
                        {product.name}
                      </p>
                      {product.category && (
                        <p className="text-[10px] text-gray-500 truncate">{product.category}</p>
                      )}
                    </div>
                    
                    <div className="flex-shrink-0">
                      {product.salePrice ? (
                        <div className="flex flex-col items-end">
                          <span className="text-xs font-semibold text-green-600">
                            {formatPrice(product.salePrice)}
                          </span>
                          <span className="text-[10px] text-gray-400 line-through">
                            {formatPrice(product.price)}
                          </span>
                        </div>
                      ) : (
                        <span className="text-xs font-semibold text-gray-900">
                          {formatPrice(product.price)}
                        </span>
                      )}
                    </div>
                  </button>
                ))}
              </div>

              <div className="mt-3 pt-3 border-t border-gray-100">
                <button
                  onClick={() => handleSearch(query)}
                  className="flex items-center justify-center gap-2 w-full py-2 text-center text-xs font-semibold text-green-600 hover:text-green-700 hover:bg-green-50 rounded-lg transition"
                >
                  View all results for "{query}"
                  <FiChevronRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          )}

          {/* Loading State */}
          {query && isLoading && (
            <div className="p-6 text-center">
              <div className="inline-block w-5 h-5 border-2 border-green-600 border-t-transparent rounded-full animate-spin mb-2" />
              <p className="text-gray-600 text-xs">Searching...</p>
            </div>
          )}

          {/* No Results */}
          {query && !isLoading && suggestions.length === 0 && (
            <div className="p-5 text-center">
              <div className="w-10 h-10 mx-auto mb-2 rounded-full bg-gray-100 flex items-center justify-center">
                <FiSearch className="w-4 h-4 text-gray-400" />
              </div>
              <p className="text-gray-900 font-medium text-xs">No products found</p>
              <p className="text-[11px] text-gray-600 mt-1">Try different keywords</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
