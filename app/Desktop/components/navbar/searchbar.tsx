// app/Mobile/components/Header/SearchBar.tsx
'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { FiSearch, FiX, FiClock, FiTrendingUp } from 'react-icons/fi';

interface Product {
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
  variant?: 'desktop' | 'mobile';
  mockProducts?: Product[];
  className?: string;
}

const RECENT_SEARCHES_KEY = 'pansari_recent_searches';
const MAX_RECENT_SEARCHES = 5;

const trendingSearches = [
  'Black Seed Oil',
  'Moringa Powder',
  'Turmeric',
  'Honey',
  'Ginger Tea',
];

export default function SearchBar({
  placeholder = 'Search for products...',
  variant = 'desktop',
  mockProducts = [],
  className = '',
}: SearchBarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<Product[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const stored = localStorage.getItem(RECENT_SEARCHES_KEY);
    if (stored) {
      try {
        setRecentSearches(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to parse recent searches', e);
      }
    }
  }, []);

  const saveRecentSearch = useCallback((searchQuery: string) => {
    if (!searchQuery.trim()) return;
    
    const updated = [
      searchQuery,
      ...recentSearches.filter(s => s !== searchQuery)
    ].slice(0, MAX_RECENT_SEARCHES);
    
    setRecentSearches(updated);
    localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
  }, [recentSearches]);

  useEffect(() => {
    if (query.trim() && mockProducts.length > 0) {
      const filtered = mockProducts.filter(product =>
        product.name.toLowerCase().includes(query.toLowerCase()) ||
        product.category?.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 5);
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  }, [query, mockProducts]);

  const closeSearch = useCallback(() => {
    setIsOpen(false);
    setQuery('');
    setSuggestions([]);
  }, []);

  const handleSearch = useCallback((searchQuery: string) => {
    if (!searchQuery.trim()) return;
    
    saveRecentSearch(searchQuery);
    closeSearch();
    router.push(`/shop?search=${encodeURIComponent(searchQuery)}`);
  }, [router, saveRecentSearch, closeSearch]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(query);
  };

  const handleSuggestionClick = (product: Product) => {
    saveRecentSearch(product.name);
    closeSearch();
    router.push(`/product/${product.slug}`);
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem(RECENT_SEARCHES_KEY);
  };

  return (
    <>
      {/* Search Input - NO BORDER ON FOCUS */}
      <div className={`relative ${className}`}>
        <button
          onClick={() => setIsOpen(true)}
          className="w-full flex items-center gap-2 px-4 py-2.5 border border-gray-200 rounded-full bg-gray-50 hover:bg-white transition-colors outline-none"
        >
          <FiSearch className="w-4 h-4 text-gray-400 flex-shrink-0" />
          <span className="text-sm text-gray-400 flex-1 text-left">{placeholder}</span>
        </button>
      </div>

      {/* Full-Screen Modal - CENTERED WITH BLUR */}
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-start justify-center p-4 md:p-6 pt-16 md:pt-24">
          {/* Blur Backdrop */}
          <div 
            className="absolute inset-0 bg-black/40 backdrop-blur-md"
            onClick={closeSearch}
          />

          {/* Modal Content - Auto-height, centered */}
          <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden animate-slideDown">
            {/* Search Header - NO BORDER BOTTOM */}
            <div className="p-4">
              <form onSubmit={handleSubmit} className="flex items-center gap-3">
                <FiSearch className="w-5 h-5 text-gray-400 flex-shrink-0" />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={placeholder}
                  className="flex-1 text-base text-gray-900 placeholder-gray-400 outline-none border-none"
                  style={{ boxShadow: 'none' }}
                  autoFocus
                />
                {query && (
                  <button
                    type="button"
                    onClick={() => setQuery('')}
                    className="p-1.5 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <FiX className="w-4 h-4 text-gray-500" />
                  </button>
                )}
                <button
                  type="button"
                  onClick={closeSearch}
                  className="px-4 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
              </form>
            </div>

            {/* Divider */}
            <div className="h-px bg-gray-200" />

            {/* Search Results - Auto height */}
            <div className="max-h-[60vh] overflow-y-auto">
              {/* Product Suggestions */}
              {suggestions.length > 0 && (
                <div className="p-4">
                  <h3 className="text-xs font-semibold text-gray-500 uppercase mb-3">Products</h3>
                  <div className="space-y-2">
                    {suggestions.map((product) => (
                      <button
                        key={product.id}
                        onClick={() => handleSuggestionClick(product)}
                        className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors text-left"
                      >
                        {product.image && (
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                          />
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 truncate">{product.name}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-sm font-semibold text-green-600">
                              PKR {(product.salePrice || product.price).toLocaleString()}
                            </span>
                            {product.salePrice && (
                              <span className="text-xs text-gray-400 line-through">
                                PKR {product.price.toLocaleString()}
                              </span>
                            )}
                          </div>
                        </div>
                        <FiSearch className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Recent Searches */}
              {!query && recentSearches.length > 0 && (
                <div className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xs font-semibold text-gray-500 uppercase flex items-center gap-2">
                      <FiClock className="w-4 h-4" />
                      Recent Searches
                    </h3>
                    <button
                      onClick={clearRecentSearches}
                      className="text-xs text-red-500 hover:text-red-600 font-medium"
                    >
                      Clear All
                    </button>
                  </div>
                  <div className="space-y-2">
                    {recentSearches.map((search, index) => (
                      <button
                        key={index}
                        onClick={() => handleSearch(search)}
                        className="w-full flex items-center gap-3 p-2.5 rounded-lg hover:bg-gray-50 transition-colors text-left group"
                      >
                        <FiClock className="w-4 h-4 text-gray-400 flex-shrink-0" />
                        <span className="flex-1 text-sm text-gray-700">{search}</span>
                        <FiSearch className="w-4 h-4 text-gray-300 group-hover:text-green-600 flex-shrink-0" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Trending Searches */}
              {!query && (
                <div className="p-4">
                  <h3 className="text-xs font-semibold text-gray-500 uppercase mb-3 flex items-center gap-2">
                    <FiTrendingUp className="w-4 h-4" />
                    Trending Searches
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {trendingSearches.map((search, index) => (
                      <button
                        key={index}
                        onClick={() => handleSearch(search)}
                        className="px-4 py-2 bg-gray-100 hover:bg-green-50 hover:text-green-700 text-sm font-medium rounded-full transition-colors"
                      >
                        {search}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* No Results */}
              {query && suggestions.length === 0 && (
                <div className="p-8 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                    <FiSearch className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No results found</h3>
                  <p className="text-sm text-gray-500 mb-4">
                    Try searching for something else or browse our categories
                  </p>
                  <button
                    onClick={() => handleSearch(query)}
                    className="px-6 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                  >
                    Search in Shop
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slideDown {
          animation: slideDown 0.2s ease-out;
        }
      `}</style>
    </>
  );
}