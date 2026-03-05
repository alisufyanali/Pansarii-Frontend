// components/navbar/searchbar.tsx
'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  FiSearch,
  FiX,
  FiClock,
  FiChevronRight
} from 'react-icons/fi';
import { HiOutlineShoppingBag, HiOutlineTag } from 'react-icons/hi';
import { BsStar } from 'react-icons/bs';

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

export interface SearchBarProps {
  placeholder?: string;
  className?: string;
  onSearch?: (query: string) => void;
  mockProducts?: ProductSuggestion[];
  initialQuery?: string;
}

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debouncedValue;
}

export default function SearchBar({
  placeholder = "Search for products...",
  className = "",
  onSearch,
  mockProducts = [],
  initialQuery = ''
}: SearchBarProps) {
  const [query, setQuery] = useState(initialQuery);
  const [suggestions, setSuggestions] = useState<ProductSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (initialQuery) setQuery(initialQuery);
  }, [initialQuery]);

  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (!debouncedQuery.trim()) { setSuggestions([]); return; }
      setIsLoading(true);
      try {
        if (mockProducts.length > 0) {
          const filtered = mockProducts.filter(p =>
            p.name.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
            p.category?.toLowerCase().includes(debouncedQuery.toLowerCase())
          ).slice(0, 5);
          setSuggestions(filtered);
          setIsOpen(true);
        } else {
          const res = await fetch(`/api/search/suggestions?q=${encodeURIComponent(debouncedQuery)}&limit=5`);
          if (res.ok) {
            const data = await res.json();
            setSuggestions(data.suggestions || []);
            setIsOpen(true);
          }
        }
      } catch (e) {
        console.error('Search error:', e);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSuggestions();
  }, [debouncedQuery, mockProducts]);

  useEffect(() => {
    const stored = localStorage.getItem('recentSearches');
    if (stored) { try { setRecentSearches(JSON.parse(stored)); } catch {} }
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) setIsOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSearch = useCallback((q: string) => {
    if (!q.trim()) return;
    const updated = [q, ...recentSearches.filter(s => s.toLowerCase() !== q.toLowerCase())].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem('recentSearches', JSON.stringify(updated));
    if (onSearch) onSearch(q);
    window.location.href = `/shop?search=${encodeURIComponent(q)}`;
    setIsOpen(false);
  }, [recentSearches, onSearch]);

  const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); handleSearch(query); };
  const clearSearch = () => { setQuery(''); setSuggestions([]); setIsOpen(false); inputRef.current?.focus(); };
  const clearRecentSearches = () => { setRecentSearches([]); localStorage.removeItem('recentSearches'); };

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('en-PK', { style: 'currency', currency: 'PKR', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(price);

  return (
    <div ref={searchRef} className={`relative ${className}`}>
      <form onSubmit={handleSubmit} className="relative flex items-center">

        {/* Left search icon — decorative */}
        <FiSearch className="absolute left-3 w-3.5 h-3.5 text-gray-400 pointer-events-none z-10" />

        {/* Input — py-1.5 gives same line-height as nav link text (~32–34px total) */}
        <input
          ref={inputRef}
          type="search"
          value={query}
          onChange={(e) => { setQuery(e.target.value); if (e.target.value.trim()) setIsOpen(true); }}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          className="w-full pl-8 pr-[4.5rem] py-1.5 text-sm border border-gray-200 rounded-full bg-gray-50
            focus:outline-none focus:border-green-600 focus:bg-white focus:ring-1 focus:ring-green-500/20
            transition-all duration-200 text-gray-900 placeholder-gray-400"
          aria-label="Search products"
          aria-expanded={isOpen}
          aria-controls="search-suggestions"
        />

        {/* Right: clear + submit */}
        <div className="absolute right-1 top-1/2 -translate-y-1/2 flex items-center gap-0.5">
          {query && (
            <button
              type="button"
              onClick={clearSearch}
              className="p-1 text-gray-400 hover:text-gray-600 transition rounded-full hover:bg-gray-100"
              aria-label="Clear search"
            >
              <FiX className="w-3.5 h-3.5" />
            </button>
          )}
          <button
            type="submit"
            disabled={isLoading}
            className="w-7 h-7 flex items-center justify-center bg-green-700 hover:bg-green-600
              text-white rounded-full transition focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-1"
            aria-label="Search"
          >
            {isLoading
              ? <div className="w-3 h-3 border-[1.5px] border-white border-t-transparent rounded-full animate-spin" />
              : <FiSearch className="w-3.5 h-3.5" />
            }
          </button>
        </div>
      </form>

      {/* ── Dropdown ── */}
      {isOpen && (
        <div
          id="search-suggestions"
          className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl border border-gray-200 z-50 max-h-[65vh] overflow-y-auto"
        >
          {/* Recent searches */}
          {!query && recentSearches.length > 0 && (
            <div className="p-4 border-b">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <FiClock className="w-4 h-4 text-gray-400" />
                  <h3 className="text-sm font-semibold text-gray-700">Recent Searches</h3>
                </div>
                <button onClick={clearRecentSearches} className="text-xs text-green-700 hover:text-green-800 font-medium">
                  Clear all
                </button>
              </div>
              <div className="space-y-1">
                {recentSearches.map((s, i) => (
                  <button
                    key={i}
                    onClick={() => { setQuery(s); handleSearch(s); }}
                    className="flex items-center justify-between w-full p-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition group"
                  >
                    <div className="flex items-center gap-3">
                      <FiClock className="w-4 h-4 text-gray-400 group-hover:text-gray-600" />
                      <span>{s}</span>
                    </div>
                    <FiChevronRight className="w-4 h-4 text-gray-300 group-hover:text-gray-400" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Product suggestions */}
          {query && suggestions.length > 0 && (
            <div className="p-4">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Products ({suggestions.length})</h3>
              <div className="space-y-2">
                {suggestions.map((product) => (
                  <button
                    key={product.id}
                    onClick={() => { setQuery(product.name); handleSearch(product.name); }}
                    className="flex items-center gap-3 w-full p-3 hover:bg-gray-50 rounded-lg transition group border border-transparent hover:border-green-100"
                  >
                    {product.image ? (
                      <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
                        <Image src={product.image} alt={product.name} fill className="object-cover group-hover:scale-105 transition-transform duration-200" sizes="48px" />
                        {product.isBestSeller && (
                          <div className="absolute top-1 left-1"><HiOutlineTag className="w-3 h-3 text-amber-500" /></div>
                        )}
                      </div>
                    ) : (
                      <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <HiOutlineShoppingBag className="w-5 h-5 text-gray-400" />
                      </div>
                    )}
                    <div className="flex-1 text-left min-w-0">
                      <p className="text-sm font-medium text-gray-900 group-hover:text-green-700 truncate">{product.name}</p>
                      {product.category && <p className="text-xs text-gray-500 truncate">{product.category}</p>}
                      {product.rating && (
                        <div className="flex items-center gap-1 mt-1">
                          <BsStar className="w-3 h-3 text-amber-400 fill-current" />
                          <span className="text-xs text-gray-600">{product.rating.toFixed(1)}</span>
                        </div>
                      )}
                    </div>
                    <div className="flex-shrink-0">
                      {product.salePrice ? (
                        <div className="flex items-center gap-1">
                          <span className="text-sm font-semibold text-green-700">{formatPrice(product.salePrice)}</span>
                          <span className="text-xs text-gray-400 line-through">{formatPrice(product.price)}</span>
                        </div>
                      ) : (
                        <span className="text-sm font-semibold text-gray-900">{formatPrice(product.price)}</span>
                      )}
                    </div>
                  </button>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t">
                <Link
                  href={`/shop?search=${encodeURIComponent(query)}`}
                  className="flex items-center justify-center gap-2 w-full py-2.5 text-sm font-semibold text-green-700 hover:text-green-800 hover:bg-green-50 rounded-lg transition"
                  onClick={() => setIsOpen(false)}
                >
                  View all results for "{query}"
                  <FiChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          )}

          {/* Loading */}
          {query && isLoading && (
            <div className="p-8 text-center">
              <div className="inline-block w-6 h-6 border-2 border-green-700 border-t-transparent rounded-full animate-spin mb-3" />
              <p className="text-gray-600 text-sm">Searching products...</p>
            </div>
          )}

          {/* No results */}
          {query && !isLoading && suggestions.length === 0 && (
            <div className="p-6 text-center">
              <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-gray-100 flex items-center justify-center">
                <FiSearch className="w-5 h-5 text-gray-400" />
              </div>
              <p className="text-gray-900 font-medium">No products found</p>
              <p className="text-sm text-gray-600 mt-1">Try different keywords or check spelling</p>
              {recentSearches.length > 0 && (
                <div className="mt-4 pt-4 border-t">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Recent searches:</h4>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {recentSearches.map((s, i) => (
                      <button key={i} onClick={() => { setQuery(s); handleSearch(s); }}
                        className="px-3 py-1 text-xs font-medium text-green-700 bg-green-50 hover:bg-green-100 rounded-full transition">
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}