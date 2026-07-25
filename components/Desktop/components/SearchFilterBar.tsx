// components/SearchFilterBar.tsx
'use client';

import { useState, useEffect, useCallback, useRef, Suspense } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { FilterOptions } from '@/utils/filterProducts';
import type { FilterOptions as FilterOptionsType } from '@/utils/filterProducts';
import {
  FiFilter,
  FiSearch,
  FiX,
  FiGrid,
  FiList,
  FiChevronDown,
  FiSliders,
  FiChevronUp,
  FiCheck,
  FiRefreshCw,
} from 'react-icons/fi';
import {
  FaStar,
  FaTag,
  FaBox,
  FaSortAmountDown,
} from 'react-icons/fa';

function SearchFilterBarContent({
  onFilterChange,
  onViewModeChange,
  productCount = 0,
  categories = [],
  initialSearchQuery = '',
}: {
  onFilterChange: (filters: FilterOptions) => void;
  onViewModeChange: (mode: 'grid' | 'list') => void;
  productCount?: number;
  categories?: string[];
  initialSearchQuery?: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const [filters, setFilters] = useState<FilterOptions>({
    searchQuery: initialSearchQuery,
    minPrice: 0,
    maxPrice: 5000,
    categories: [],
    sortBy: 'default',
    showOnSale: false,
    showInStock: true,
    showNewArrivals: false,
    showBestSellers: false,
  });

  const [tempFilters, setTempFilters] = useState<FilterOptions>(filters);
  const [showMobileSort, setShowMobileSort] = useState(false);

  const isInitialMount = useRef(true);
  const initialSearchQueryRef = useRef(initialSearchQuery);
  const filterPanelRef = useRef<HTMLDivElement>(null);
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Keep a ref to the latest onFilterChange so the debounce effect never
  // needs to list it as a dependency — prevents the callback identity from
  // re-triggering the effect on every parent render.
  const onFilterChangeRef = useRef(onFilterChange);
  useEffect(() => { onFilterChangeRef.current = onFilterChange; }, [onFilterChange]);

  const sortOptions = [
    { value: 'default',    label: 'Default' },
    { value: 'price-low',  label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'rating',     label: 'Highest Rated' },
    { value: 'name',       label: 'Alphabetically A-Z' },
  ];

  useEffect(() => {
    if (isInitialMount.current) { isInitialMount.current = false; return; }
    if (initialSearchQuery !== initialSearchQueryRef.current) {
      initialSearchQueryRef.current = initialSearchQuery;
      setFilters(prev => ({ ...prev, searchQuery: initialSearchQuery }));
    }
  }, [initialSearchQuery]);

  useEffect(() => {
    const urlCategory = searchParams.get('category');
    const urlCategories = searchParams.get('categories')?.split(',').filter(Boolean) || [];
    const initial = urlCategory ? [urlCategory] : urlCategories;
    setFilters(prev => {
      if (JSON.stringify(prev.categories) === JSON.stringify(initial)) return prev;
      return { ...prev, categories: initial };
    });
    setTempFilters(prev => {
      if (JSON.stringify(prev.categories) === JSON.stringify(initial)) return prev;
      return { ...prev, categories: initial };
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const urlCategory = searchParams.get('category');
    const urlCategories = searchParams.get('categories')?.split(',').filter(Boolean) || [];
    // Single category support only - take urlCategory first or the first item of urlCategories
    const newCats = urlCategory ? [urlCategory] : (urlCategories.length > 0 ? [urlCategories[0]] : []);
    setFilters(prev => {
      if (JSON.stringify(prev.categories) === JSON.stringify(newCats)) return prev;
      return { ...prev, categories: newCats };
    });
    setTempFilters(prev => {
      if (JSON.stringify(prev.categories) === JSON.stringify(newCats)) return prev;
      return { ...prev, categories: newCats };
    });
  }, [searchParams]);

  useEffect(() => {
    function onOutside(e: MouseEvent) {
      if (filterPanelRef.current && !filterPanelRef.current.contains(e.target as Node)) {
        setIsFilterOpen(false);
      }
    }
    document.addEventListener('mousedown', onOutside);
    return () => document.removeEventListener('mousedown', onOutside);
  }, []);

  useEffect(() => {
    if (!isMobileFilterOpen) return;
    const y = window.scrollY;
    document.body.style.cssText = `position:fixed;top:-${y}px;width:100%;overflow:hidden`;
    return () => {
      document.body.style.cssText = '';
      window.scrollTo(0, y);
    };
  }, [isMobileFilterOpen]);

  useEffect(() => {
    if (debounceTimeoutRef.current) clearTimeout(debounceTimeoutRef.current);
    debounceTimeoutRef.current = setTimeout(() => onFilterChangeRef.current(filters), 300);
    return () => { if (debounceTimeoutRef.current) clearTimeout(debounceTimeoutRef.current); };
  }, [filters]);

  const handleViewModeChange = (mode: 'grid' | 'list') => {
    setViewMode(mode);
    onViewModeChange(mode);
  };

  const handleSortChange = (sortBy: FilterOptions['sortBy']) => {
    setFilters(prev => ({ ...prev, sortBy }));
    setShowMobileSort(false);
  };

  const applyMobileFilters = () => {
    setFilters(tempFilters);
    onFilterChange(tempFilters);
    setIsMobileFilterOpen(false);
  };

  const clearFilters = useCallback(() => {
    const reset: FilterOptions = {
      searchQuery: '',
      minPrice: 0,
      maxPrice: 5000,
      categories: [],
      sortBy: 'default',
      showOnSale: false,
      showInStock: true,
      showNewArrivals: false,
      showBestSellers: false,
    };
    setFilters(reset);
    setTempFilters(reset);
    const params = new URLSearchParams(searchParams.toString());
    params.delete('search');
    params.delete('category');
    params.delete('categories');
    router.push(params.toString() ? `${pathname}?${params.toString()}` : pathname);
  }, [router, pathname, searchParams]);

  const getActiveFilterCount = (f = filters) => {
    let n = 0;
    if (f.searchQuery) n++;
    if (f.minPrice > 0 || f.maxPrice < 5000) n++;
    if (f.categories.length > 0) n++;
    if (f.sortBy !== 'default') n++;
    if (f.showOnSale) n++;
    if (!f.showInStock) n++;
    if (f.showBestSellers) n++;
    if (f.showNewArrivals) n++;
    return n;
  };

  const currentCategory = searchParams.get('category');

  return (
    <div className="mb-4 sm:mb-6 relative">

      {/* ══ MAIN BAR ══ */}
      <div className="relative">
        <div className="flex flex-col sm:flex-row sm:items-center border-2 border-gray-200 rounded-xl bg-white shadow-sm hover:shadow-md transition-shadow">

       

{/* MOBILE - Fixed version with proper sizing */}
<div className="flex items-center w-full sm:hidden">
  <button
    onClick={() => { setTempFilters(filters); setIsMobileFilterOpen(true); }}
    className="flex items-center justify-center gap-1 px-2.5 py-3 border-r-2 border-gray-200 text-gray-700 hover:bg-green-50 transition-colors flex-shrink-0"
  >
    <FiSliders className="w-4 h-4" />
    <span className="text-xs font-semibold">Filter</span>
    {getActiveFilterCount() > 0 && (
      <span className="px-1.5 py-0.5 bg-green-600 text-white text-[10px] rounded-full font-bold">{getActiveFilterCount()}</span>
    )}
  </button>

  <div className="flex-1 flex items-center px-2 min-w-0">
    <FiSearch className="w-4 h-4 text-gray-400 mr-1.5 flex-shrink-0" />
    <input
      type="text"
      placeholder="Search..."
      className="flex-1 py-3 outline-none bg-transparent text-gray-700 placeholder-gray-400 text-xs min-w-0"
      value={filters.searchQuery}
      onChange={e => setFilters(prev => ({ ...prev, searchQuery: e.target.value }))}
    />
    {filters.searchQuery && (
      <button onClick={() => setFilters(prev => ({ ...prev, searchQuery: '' }))} className="p-1 hover:bg-gray-100 rounded-full flex-shrink-0">
        <FiX className="w-3.5 h-3.5 text-gray-500" />
      </button>
    )}
  </div>

  <button
    onClick={() => setShowMobileSort(v => !v)}
    className="flex items-center gap-0.5 px-2.5 py-3 border-l-2 border-gray-200 text-gray-700 hover:bg-green-50 flex-shrink-0"
  >
    <span className="text-xs font-semibold">Sort</span>
    {showMobileSort ? <FiChevronUp className="w-3.5 h-3.5" /> : <FiChevronDown className="w-3.5 h-3.5" />}
  </button>
</div>


          {/* DESKTOP */}
          <div className="hidden sm:flex items-center w-full">
            <div className="flex items-center gap-3 px-5 py-1 flex-shrink-0">
              <button
                onClick={() => setIsFilterOpen(v => !v)}
                className="flex items-center gap-2 text-gray-700 hover:text-green-700 transition-colors group"
              >
                <div className="p-2 rounded-lg group-hover:bg-green-50 transition-colors">
                  <FiFilter className="w-5 h-5" />
                </div>
                <span className="text-sm font-semibold">Filters</span>
                {getActiveFilterCount() > 0 && (
                  <span className="px-2 py-0.5 bg-green-600 text-white text-xs rounded-full font-bold">{getActiveFilterCount()}</span>
                )}
              </button>
              <span className="hidden lg:flex items-center gap-1 text-sm text-gray-500 ml-2 font-medium">
                <FaBox className="w-3.5 h-3.5" />
                {productCount} {productCount === 1 ? 'item' : 'items'}
              </span>
            </div>

            <div className="flex-1 flex items-center border-l-2 border-gray-200 pl-5 pr-4">
              <FiSearch className="w-5 h-5 text-gray-400 flex-shrink-0" />
              <input
                type="text"
                placeholder="Search products..."
                className="flex-1 py-4 px-3 outline-none bg-transparent text-gray-700 placeholder-gray-400 text-sm font-medium"
                value={filters.searchQuery}
                onChange={e => setFilters(prev => ({ ...prev, searchQuery: e.target.value }))}
              />
              {filters.searchQuery && (
                <button onClick={() => setFilters(prev => ({ ...prev, searchQuery: '' }))} className="p-2 hover:bg-gray-100 rounded-full">
                  <FiX className="w-4 h-4 text-gray-400" />
                </button>
              )}
            </div>

            <div className="flex items-center gap-4 border-l-2 border-gray-200 pl-5 pr-4 flex-shrink-0">
              <div className="flex items-center gap-1 border-2 border-gray-200 rounded-lg p-0.5 bg-gray-50">
                <button
                  onClick={() => handleViewModeChange('list')}
                  className={`p-2 rounded-md transition-all ${viewMode === 'list' ? 'bg-green-600 text-white shadow-md' : 'text-gray-500 hover:text-gray-700 hover:bg-white'}`}
                  title="List View"
                >
                  <FiList className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleViewModeChange('grid')}
                  className={`p-2 rounded-md transition-all ${viewMode === 'grid' ? 'bg-green-600 text-white shadow-md' : 'text-gray-500 hover:text-gray-700 hover:bg-white'}`}
                  title="Grid View"
                >
                  <FiGrid className="w-5 h-5" />
                </button>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500 hidden xl:inline font-medium">Sort:</span>
                <select
                  className="border-2 border-gray-200 outline-none bg-white text-sm text-gray-700 cursor-pointer focus:ring-2 focus:ring-green-500 focus:border-green-500 py-2 px-3 rounded-lg font-medium hover:border-gray-300 transition-all"
                  value={filters.sortBy}
                  onChange={e => handleSortChange(e.target.value as FilterOptions['sortBy'])}
                >
                  {sortOptions.map(o => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile sort dropdown */}
        {showMobileSort && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white border-2 border-gray-200 rounded-xl shadow-xl z-50 sm:hidden animate-slideDown">
            <div className="p-2">
              {sortOptions.map(o => (
                <button
                  key={o.value}
                  onClick={() => { handleSortChange(o.value as FilterOptions['sortBy']); setShowMobileSort(false); }}
                  className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-all flex items-center justify-between ${
                    filters.sortBy === o.value ? 'bg-green-600 text-white' : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {o.label}
                  {filters.sortBy === o.value && <FiCheck className="w-4 h-4" />}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ══ DESKTOP FILTER PANEL ══ */}
        {isFilterOpen && (
          <div
            ref={filterPanelRef}
            className="absolute top-full left-0 right-0 mt-2 border-2 border-gray-200 rounded-xl bg-white shadow-2xl z-50 hidden sm:block animate-slideDown"
          >
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">

                {/* Price Range */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-bold text-gray-900 mb-4">
                    <FaTag className="w-4 h-4 text-green-600" />
                    Price Range
                  </label>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-sm bg-green-50 px-3 py-2.5 rounded-lg border border-green-100">
                      <span className="text-gray-700 font-semibold">PKR {filters.minPrice.toLocaleString()}</span>
                      <span className="text-gray-400 text-xs">to</span>
                      <span className="text-gray-700 font-semibold">PKR {filters.maxPrice.toLocaleString()}</span>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-xs text-gray-500 mb-1.5">
                          <span>Min Price</span>
                          <span className="font-medium">PKR {filters.minPrice.toLocaleString()}</span>
                        </div>
                        <input
                          type="range" min={0} max={5000} step={100}
                          value={filters.minPrice}
                          onChange={e => {
                            const val = Math.min(Number(e.target.value), filters.maxPrice - 100);
                            setFilters(prev => ({ ...prev, minPrice: val }));
                          }}
                          className="w-full h-2 bg-gray-200 rounded-full appearance-none cursor-pointer accent-green-600"
                        />
                      </div>
                      <div>
                        <div className="flex justify-between text-xs text-gray-500 mb-1.5">
                          <span>Max Price</span>
                          <span className="font-medium">PKR {filters.maxPrice.toLocaleString()}</span>
                        </div>
                        <input
                          type="range" min={0} max={5000} step={100}
                          value={filters.maxPrice}
                          onChange={e => {
                            const val = Math.max(Number(e.target.value), filters.minPrice + 100);
                            setFilters(prev => ({ ...prev, maxPrice: val }));
                          }}
                          className="w-full h-2 bg-gray-200 rounded-full appearance-none cursor-pointer accent-green-600"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { label: 'Under 500',   min: 0,    max: 500  },
                        { label: '500–1,000',   min: 500,  max: 1000 },
                        { label: '1,000–2,000', min: 1000, max: 2000 },
                        { label: 'Above 2,000', min: 2000, max: 5000 },
                      ].map(preset => {
                        const active = filters.minPrice === preset.min && filters.maxPrice === preset.max;
                        return (
                          <button
                            key={preset.label}
                            onClick={() => setFilters(prev => ({ ...prev, minPrice: preset.min, maxPrice: preset.max }))}
                            className={`text-xs px-2 py-2 rounded-lg border font-medium transition-all ${
                              active ? 'bg-green-600 text-white border-green-600' : 'border-gray-200 text-gray-600 hover:border-green-400 hover:text-green-700'
                            }`}
                          >
                            {preset.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Categories */}
                {categories.length > 0 && (
                  <div>
                    <label className="block text-sm font-bold text-gray-900 mb-4">Categories</label>
                    <div className="space-y-1 max-h-52 overflow-y-auto pr-1 custom-scrollbar">
                      {categories.map(cat => {
                        const isSelected = filters.categories.includes(cat) || currentCategory === cat;
                        return (
                          <label
                            key={cat}
                            className={`flex items-center gap-3 cursor-pointer px-2 py-2.5 rounded-lg hover:bg-gray-50 transition-colors ${isSelected ? 'bg-green-50' : ''}`}
                          >
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => {
                                const newCats = isSelected ? [] : [cat];
                                setFilters(prev => ({ ...prev, categories: newCats }));
                                const params = new URLSearchParams(searchParams.toString());
                                params.delete('categories');
                                if (newCats.length === 1) {
                                  params.set('category', newCats[0]);
                                } else {
                                  params.delete('category');
                                }
                                router.push(`${pathname}?${params.toString()}`, { scroll: false });
                              }}
                              className="h-4 w-4 rounded border-2 border-gray-300 accent-green-600 cursor-pointer flex-shrink-0"
                            />
                            <span className={`text-sm capitalize font-medium ${isSelected ? 'text-green-700' : 'text-gray-700'}`}>
                              {cat.replace(/-/g, ' ')}
                            </span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Availability */}
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-4">Availability</label>
                  <div className="space-y-1">
                    {[
                      { key: 'showInStock'     as keyof FilterOptionsType, label: 'In Stock Only' },
                      { key: 'showOnSale'      as keyof FilterOptionsType, label: 'On Sale Only' },
                      { key: 'showBestSellers' as keyof FilterOptionsType, label: 'Best Sellers' },
                      { key: 'showNewArrivals' as keyof FilterOptionsType, label: 'New Arrivals' },
                    ].map(item => (
                      <label
                        key={item.key}
                        className={`flex items-center gap-3 cursor-pointer px-2 py-2.5 rounded-lg hover:bg-gray-50 transition-colors ${filters[item.key] ? 'bg-green-50' : ''}`}
                      >
                        <input
                          type="checkbox"
                          checked={(filters[item.key as keyof FilterOptionsType] as boolean) || false}
                          onChange={e => setFilters(prev => ({ ...prev, [item.key]: e.target.checked }))}
                          className="h-4 w-4 rounded border-2 border-gray-300 accent-green-600 cursor-pointer flex-shrink-0"
                        />
                        <span className={`text-sm font-medium ${filters[item.key] ? 'text-green-700' : 'text-gray-700'}`}>
                          {item.label}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Rating */}
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-4">Minimum Rating</label>
                  <div className="space-y-1">
                    {[4.5, 4.0, 3.5, 3.0].map(rating => (
                      <button
                        key={rating}
                        onClick={() => { setFilters(prev => ({ ...prev, sortBy: 'rating' })); setIsFilterOpen(false); }}
                        className="flex items-center gap-2 w-full text-left px-2 py-2.5 rounded-lg hover:bg-green-50 transition-colors group"
                      >
                        <div className="flex items-center gap-0.5">
                          {[...Array(5)].map((_, i) => (
                            <FaStar key={i} className={`w-3.5 h-3.5 ${i < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-200'}`} />
                          ))}
                        </div>
                        <span className="text-sm text-gray-600 font-medium group-hover:text-green-700">{rating}+ stars</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between mt-6 pt-5 border-t border-gray-100">
                <span className="text-sm text-gray-500 font-medium">
                  {getActiveFilterCount()} {getActiveFilterCount() === 1 ? 'filter' : 'filters'} active
                </span>
                <div className="flex gap-3">
                  <button
                    onClick={() => { clearFilters(); setIsFilterOpen(false); }}
                    className="px-5 py-2.5 text-sm text-gray-700 border-2 border-gray-200 rounded-lg hover:bg-gray-50 transition-all font-semibold"
                  >
                    Reset All
                  </button>
                  <button
                    onClick={() => setIsFilterOpen(false)}
                    className="px-5 py-2.5 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all font-semibold shadow-md"
                  >
                    Done
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ══ MOBILE FILTER MODAL ══ */}
        {isMobileFilterOpen && (
          <div className="fixed inset-0 z-[60] sm:hidden">
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm animate-fadeIn" onClick={() => setIsMobileFilterOpen(false)} />
            <div className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-2xl animate-slideUp flex flex-col" style={{ maxHeight: 'calc(100dvh - 80px)' }}>
              <div className="sticky top-0 bg-white border-b border-gray-200 px-5 py-4 flex items-center justify-between z-10 flex-shrink-0">
                <h3 className="text-lg font-bold text-gray-900">Filters &amp; Sort</h3>
                <button onClick={() => setIsMobileFilterOpen(false)} className="p-2 hover:bg-gray-100 rounded-full">
                  <FiX className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              <div className="p-5 space-y-7 overflow-y-auto flex-1">
                {/* Sort */}
                <div>
                  <p className="text-sm font-bold text-gray-900 mb-3">Sort By</p>
                  <div className="space-y-1">
                    {sortOptions.map(o => (
                      <button
                        key={o.value}
                        onClick={() => setTempFilters(prev => ({ ...prev, sortBy: o.value as FilterOptions['sortBy'] }))}
                        className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                          tempFilters.sortBy === o.value ? 'bg-green-600 text-white' : 'text-gray-700 hover:bg-gray-50 border border-gray-100'
                        }`}
                      >
                        {o.label}
                        {tempFilters.sortBy === o.value && <FiCheck className="w-4 h-4" />}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price Range */}
                <div>
                  <p className="text-sm font-bold text-gray-900 mb-3">Price Range</p>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between bg-green-50 px-3 py-2.5 rounded-lg border border-green-100">
                      <span className="text-sm font-semibold text-gray-700">PKR {tempFilters.minPrice.toLocaleString()}</span>
                      <span className="text-xs text-gray-400">to</span>
                      <span className="text-sm font-semibold text-gray-700">PKR {tempFilters.maxPrice.toLocaleString()}</span>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-xs text-gray-500 mb-1.5">
                          <span>Min</span><span className="font-medium">PKR {tempFilters.minPrice.toLocaleString()}</span>
                        </div>
                        <input type="range" min={0} max={5000} step={100} value={tempFilters.minPrice}
                          onChange={e => {
                            const val = Math.min(Number(e.target.value), tempFilters.maxPrice - 100);
                            setTempFilters(prev => ({ ...prev, minPrice: val }));
                          }}
                          className="w-full h-2 bg-gray-200 rounded-full appearance-none cursor-pointer accent-green-600"
                        />
                      </div>
                      <div>
                        <div className="flex justify-between text-xs text-gray-500 mb-1.5">
                          <span>Max</span><span className="font-medium">PKR {tempFilters.maxPrice.toLocaleString()}</span>
                        </div>
                        <input type="range" min={0} max={5000} step={100} value={tempFilters.maxPrice}
                          onChange={e => {
                            const val = Math.max(Number(e.target.value), tempFilters.minPrice + 100);
                            setTempFilters(prev => ({ ...prev, maxPrice: val }));
                          }}
                          className="w-full h-2 bg-gray-200 rounded-full appearance-none cursor-pointer accent-green-600"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { label: 'Under 500',   min: 0,    max: 500  },
                        { label: '500–1,000',   min: 500,  max: 1000 },
                        { label: '1,000–2,000', min: 1000, max: 2000 },
                        { label: 'Above 2,000', min: 2000, max: 5000 },
                      ].map(preset => {
                        const active = tempFilters.minPrice === preset.min && tempFilters.maxPrice === preset.max;
                        return (
                          <button key={preset.label}
                            onClick={() => setTempFilters(prev => ({ ...prev, minPrice: preset.min, maxPrice: preset.max }))}
                            className={`text-xs px-2 py-2 rounded-lg border font-medium transition-all ${
                              active ? 'bg-green-600 text-white border-green-600' : 'border-gray-200 text-gray-600 hover:border-green-400'
                            }`}
                          >
                            {preset.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Categories */}
                {categories.length > 0 && (
                  <div>
                    <p className="text-sm font-bold text-gray-900 mb-3">Categories</p>
                    <div className="space-y-1 max-h-48 overflow-y-auto custom-scrollbar">
                      {categories.map(cat => {
                        const isSelected = tempFilters.categories.includes(cat);
                        return (
                          <label key={cat} className={`flex items-center gap-3 cursor-pointer px-2 py-2.5 rounded-lg hover:bg-gray-50 ${isSelected ? 'bg-green-50' : ''}`}>
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => {
                                setTempFilters(prev => ({
                                  ...prev,
                                  categories: isSelected ? [] : [cat],
                                }));
                              }}
                              className="h-4 w-4 rounded border-2 border-gray-300 accent-green-600 cursor-pointer flex-shrink-0"
                            />
                            <span className={`text-sm capitalize font-medium ${isSelected ? 'text-green-700' : 'text-gray-700'}`}>
                              {cat.replace(/-/g, ' ')}
                            </span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Availability */}
                <div>
                  <p className="text-sm font-bold text-gray-900 mb-3">Availability</p>
                  <div className="space-y-1">
                    {[
                      { key: 'showInStock'     as keyof FilterOptionsType, label: 'In Stock Only' },
                      { key: 'showOnSale'      as keyof FilterOptionsType, label: 'On Sale Only' },
                      { key: 'showBestSellers' as keyof FilterOptionsType, label: 'Best Sellers' },
                      { key: 'showNewArrivals' as keyof FilterOptionsType, label: 'New Arrivals' },
                    ].map(item => (
                      <label key={item.key} className={`flex items-center gap-3 cursor-pointer px-2 py-2.5 rounded-lg hover:bg-gray-50 ${tempFilters[item.key] ? 'bg-green-50' : ''}`}>
                        <input
                          type="checkbox"
                          checked={(tempFilters[item.key as keyof FilterOptionsType] as boolean) || false}
                          onChange={e => setTempFilters(prev => ({ ...prev, [item.key]: e.target.checked }))}
                          className="h-4 w-4 rounded border-2 border-gray-300 accent-green-600 cursor-pointer flex-shrink-0"
                        />
                        <span className={`text-sm font-medium ${tempFilters[item.key] ? 'text-green-700' : 'text-gray-700'}`}>
                          {item.label}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4 flex gap-3">
                <button
                  onClick={() => setTempFilters({ searchQuery: '', minPrice: 0, maxPrice: 5000, categories: [], sortBy: 'default', showOnSale: false, showInStock: true, showNewArrivals: false, showBestSellers: false })}
                  className="flex-1 py-3 text-sm text-gray-700 border-2 border-gray-200 rounded-xl font-semibold hover:bg-gray-50 transition-all"
                >
                  Reset
                </button>
                <button
                  onClick={applyMobileFilters}
                  className="flex-1 py-3 text-sm bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition-all shadow-md"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ══ ACTIVE FILTER TAGS ══ */}
      {getActiveFilterCount() > 0 && (
        <div className="flex flex-wrap items-center gap-2 mt-4">
          <span className="text-xs text-gray-500 font-semibold">Active:</span>

          {filters.searchQuery && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-100 text-green-800 rounded-full text-xs font-medium">
              <FiSearch className="w-3 h-3" />
              "{filters.searchQuery}"
              <button onClick={() => setFilters(prev => ({ ...prev, searchQuery: '' }))} className="hover:bg-green-200 rounded-full p-0.5 ml-0.5"><FiX className="w-2.5 h-2.5" /></button>
            </span>
          )}

          {(filters.minPrice > 0 || filters.maxPrice < 5000) && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
              <FaTag className="w-3 h-3" />
              PKR {filters.minPrice.toLocaleString()} – {filters.maxPrice.toLocaleString()}
              <button onClick={() => setFilters(prev => ({ ...prev, minPrice: 0, maxPrice: 5000 }))} className="hover:bg-blue-200 rounded-full p-0.5 ml-0.5"><FiX className="w-2.5 h-2.5" /></button>
            </span>
          )}

          {filters.categories.map(cat => (
            <span key={cat} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-purple-100 text-purple-800 rounded-full text-xs font-medium capitalize">
              {cat.replace(/-/g, ' ')}
              <button onClick={() => setFilters(prev => ({ ...prev, categories: prev.categories.filter(c => c !== cat) }))} className="hover:bg-purple-200 rounded-full p-0.5 ml-0.5"><FiX className="w-2.5 h-2.5" /></button>
            </span>
          ))}

          {filters.sortBy !== 'default' && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-100 text-amber-800 rounded-full text-xs font-medium">
              <FaSortAmountDown className="w-3 h-3" />
              {sortOptions.find(o => o.value === filters.sortBy)?.label}
              <button onClick={() => setFilters(prev => ({ ...prev, sortBy: 'default' }))} className="hover:bg-amber-200 rounded-full p-0.5 ml-0.5"><FiX className="w-2.5 h-2.5" /></button>
            </span>
          )}

          {filters.showOnSale && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-100 text-red-800 rounded-full text-xs font-medium">
              On Sale
              <button onClick={() => setFilters(prev => ({ ...prev, showOnSale: false }))} className="hover:bg-red-200 rounded-full p-0.5 ml-0.5"><FiX className="w-2.5 h-2.5" /></button>
            </span>
          )}

          {filters.showBestSellers && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">
              Best Sellers
              <button onClick={() => setFilters(prev => ({ ...prev, showBestSellers: false }))} className="hover:bg-yellow-200 rounded-full p-0.5 ml-0.5"><FiX className="w-2.5 h-2.5" /></button>
            </span>
          )}

          {filters.showNewArrivals && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-sky-100 text-sky-800 rounded-full text-xs font-medium">
              New Arrivals
              <button onClick={() => setFilters(prev => ({ ...prev, showNewArrivals: false }))} className="hover:bg-sky-200 rounded-full p-0.5 ml-0.5"><FiX className="w-2.5 h-2.5" /></button>
            </span>
          )}

          <button onClick={clearFilters} className="text-xs text-red-500 hover:text-red-700 font-bold ml-1 hover:underline flex items-center gap-1">
            <FiRefreshCw className="w-3 h-3" /> Clear all
          </button>
        </div>
      )}

      <div className="sm:hidden mt-3 text-sm text-gray-500 font-medium flex items-center gap-1.5">
        <FaBox className="w-3.5 h-3.5" />
        {productCount} {productCount === 1 ? 'item' : 'items'} found
      </div>

      <style jsx global>{`
        @keyframes slideDown { from { opacity:0; transform:translateY(-8px); } to { opacity:1; transform:translateY(0); } }
        @keyframes slideUp   { from { opacity:0; transform:translateY(100%); } to { opacity:1; transform:translateY(0); } }
        @keyframes fadeIn    { from { opacity:0; } to { opacity:1; } }
        .animate-slideDown { animation: slideDown 0.25s ease-out; }
        .animate-slideUp   { animation: slideUp   0.3s  ease-out; }
        .animate-fadeIn    { animation: fadeIn    0.2s  ease-out; }
        .custom-scrollbar::-webkit-scrollbar { width:5px; }
        .custom-scrollbar::-webkit-scrollbar-track { background:#f1f5f9; border-radius:10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background:#16a34a; border-radius:10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background:#15803d; }
      `}</style>
    </div>
  );
}

export default function SearchFilterBar(props: {
  onFilterChange: (filters: FilterOptions) => void;
  onViewModeChange: (mode: 'grid' | 'list') => void;
  productCount?: number;
  categories?: string[];
  initialSearchQuery?: string;
}) {
  return (
    <Suspense fallback={
      <div className="mb-4 sm:mb-6">
        <div className="flex items-center border-2 border-gray-200 rounded-xl px-4 py-4 bg-white animate-pulse">
          <div className="flex-1 h-5 bg-gray-200 rounded" />
        </div>
      </div>
    }>
      <SearchFilterBarContent {...props} />
    </Suspense>
  );
}
