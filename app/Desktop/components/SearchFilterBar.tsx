// components/SearchFilterBar.tsx
'use client';

import { useState, useEffect, useCallback, useRef, Suspense } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { FilterOptions } from '../utils/filterProducts';
import { 
  FiFilter, 
  FiSearch, 
  FiX, 
  FiGrid, 
  FiList,
  FiChevronDown,
  FiSliders,
  FiChevronUp
} from 'react-icons/fi';
import { FaStar } from 'react-icons/fa';

// Create an inner component that uses useSearchParams
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
  const { useSearchParams } = require('next/navigation');
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
  });
  const [tempFilters, setTempFilters] = useState<FilterOptions>(filters);
  const [showMobileSort, setShowMobileSort] = useState(false);

  const isInitialMount = useRef(true);
  const initialSearchQueryRef = useRef(initialSearchQuery);
  const filterPanelRef = useRef<HTMLDivElement>(null);
  
  // Update local filters when initialSearchQuery changes
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    
    if (initialSearchQuery !== initialSearchQueryRef.current) {
      initialSearchQueryRef.current = initialSearchQuery;
      setFilters(prev => ({ 
        ...prev, 
        searchQuery: initialSearchQuery 
      }));
    }
  }, [initialSearchQuery]);

  // Initialize categories from URL on mount only
  useEffect(() => {
    const urlCategory = searchParams.get('category');
    const urlCategories = searchParams.get('categories')?.split(',') || [];
    
    const initialCategories = urlCategory 
      ? [urlCategory] 
      : urlCategories.length > 0 
        ? urlCategories 
        : [];
    
    setFilters(prev => ({ 
      ...prev, 
      categories: initialCategories 
    }));
    setTempFilters(prev => ({ 
      ...prev, 
      categories: initialCategories 
    }));
  }, []);

  // Listen for URL changes to update categories
  useEffect(() => {
    const urlCategory = searchParams.get('category');
    const urlCategories = searchParams.get('categories')?.split(',') || [];
    
    const newCategories = urlCategory 
      ? [urlCategory] 
      : urlCategories.length > 0 
        ? urlCategories 
        : [];
    
    // Only update if categories have changed
    if (JSON.stringify(newCategories) !== JSON.stringify(filters.categories)) {
      setFilters(prev => ({ 
        ...prev, 
        categories: newCategories 
      }));
      setTempFilters(prev => ({ 
        ...prev, 
        categories: newCategories 
      }));
    }
  }, [searchParams]);

  // Close filter panel when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (filterPanelRef.current && !filterPanelRef.current.contains(event.target as Node)) {
        setIsFilterOpen(false);
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Prevent body scroll when mobile filter is open
  useEffect(() => {
    if (isMobileFilterOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileFilterOpen]);

  const sortOptions = [
    { value: 'default', label: 'Default' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'rating', label: 'Highest Rated' },
    { value: 'name', label: 'Alphabetically A-Z' },
  ];

  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }
    
    debounceTimeoutRef.current = setTimeout(() => {
      onFilterChange(filters);
    }, 300);

    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, [filters, onFilterChange]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters(prev => ({ ...prev, searchQuery: e.target.value }));
  };

  const handlePriceChange = (min: number, max: number) => {
    setTempFilters(prev => ({ ...prev, minPrice: min, maxPrice: max }));
  };

  const handleSortChange = (sortBy: FilterOptions['sortBy']) => {
    setFilters(prev => ({ ...prev, sortBy }));
    setShowMobileSort(false);
  };

  const handleViewModeChange = (mode: 'grid' | 'list') => {
    setViewMode(mode);
    onViewModeChange(mode);
  };

  const applyMobileFilters = () => {
    setFilters(tempFilters);
    setIsMobileFilterOpen(false);
    onFilterChange(tempFilters);
  };

  const clearFilters = useCallback(() => {
    const newFilters = {
      searchQuery: '',
      minPrice: 0,
      maxPrice: 5000,
      categories: [],
      sortBy: 'default' as const,
      showOnSale: false,
      showInStock: true,
    };
    setFilters(newFilters);
    setTempFilters(newFilters);
    
    // Clear URL params but keep category if it exists
    const params = new URLSearchParams(searchParams.toString());
    params.delete('search');
    params.delete('categories');
    router.push(`${pathname}?${params.toString()}`);
  }, [router, pathname, searchParams]);

  const getActiveFilterCount = () => {
    let count = 0;
    if (filters.searchQuery) count++;
    if (filters.minPrice > 0 || filters.maxPrice < 5000) count++;
    if (filters.categories.length > 0) count++;
    if (filters.sortBy !== 'default') count++;
    if (filters.showOnSale) count++;
    if (!filters.showInStock) count++;
    return count;
  };

  // Get current category from URL
  const currentCategory = searchParams.get('category');

  return (
    <div className="mb-4 sm:mb-6 relative">
      {/* Main Search Input Container */}
      <div className="relative">
        <div className="flex flex-col sm:flex-row sm:items-center border border-[#E1E3E1] rounded-lg bg-white shadow-sm">
          
          {/* Mobile Layout */}
          <div className="flex items-center w-full sm:hidden">
            {/* Filter Button - Mobile */}
            <button
              onClick={() => setIsMobileFilterOpen(true)}
              className="flex items-center justify-center gap-1.5 px-3 py-3 border-r border-[#E1E3E1] text-gray-700"
              aria-label="Open filters"
            >
              <FiSliders className="w-5 h-5" />
              <span className="text-sm font-medium">Filter</span>
              {getActiveFilterCount() > 0 && (
                <span className="ml-1 px-1.5 py-0.5 bg-green-700 text-white text-xs rounded-full">
                  {getActiveFilterCount()}
                </span>
              )}
            </button>

            {/* Search Input - Mobile */}
            <div className="flex-1 flex items-center px-3">
              <FiSearch className="w-5 h-5 text-gray-400 mr-2 flex-shrink-0" />
              <input
                type="text"
                placeholder="Search products..."
                className="flex-1 w-full py-3 outline-none bg-transparent text-gray-700 placeholder-gray-400 text-sm"
                value={filters.searchQuery}
                onChange={handleSearchChange}
                aria-label="Search products"
              />
              {filters.searchQuery && (
                <button
                  onClick={() => setFilters(prev => ({ ...prev, searchQuery: '' }))}
                  className="ml-1 p-1 hover:bg-gray-100 rounded"
                  aria-label="Clear search"
                >
                  <FiX className="w-4 h-4 text-gray-400" />
                </button>
              )}
            </div>

            {/* Sort Button - Mobile */}
            <button
              onClick={() => setShowMobileSort(!showMobileSort)}
              className="flex items-center gap-1 px-3 py-3 border-l border-[#E1E3E1] text-gray-700"
            >
              <span className="text-sm">Sort</span>
              {showMobileSort ? (
                <FiChevronUp className="w-4 h-4" />
              ) : (
                <FiChevronDown className="w-4 h-4" />
              )}
            </button>
          </div>

          {/* Desktop Layout */}
          <div className="hidden sm:flex items-center w-full">
            {/* Left: Filter Button */}
            <div className="flex items-center gap-2 px-4">
              <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="flex items-center gap-2 text-gray-700 hover:text-gray-900 relative"
                aria-label="Open filters"
              >
                <FiFilter className="w-5 h-5" />
                <span className="text-sm font-medium">Filter</span>
                {getActiveFilterCount() > 0 && (
                  <span className="ml-1 px-1.5 py-0.5 bg-green-700 text-white text-xs rounded-full">
                    {getActiveFilterCount()}
                  </span>
                )}
              </button>
              
              <span className="hidden lg:inline text-sm text-gray-500 ml-2">
                {productCount} {productCount === 1 ? 'item' : 'items'}
              </span>
            </div>

            {/* Center: Search Input */}
            <div className="flex-1 flex items-center border-l border-[#E1E3E1] pl-4">
              <FiSearch className="w-5 h-5 text-gray-400 mr-3 flex-shrink-0" />
              
              <input
                type="text"
                placeholder="Search products..."
                className="flex-1 w-full py-3 outline-none bg-transparent text-gray-700 placeholder-gray-400 text-sm"
                value={filters.searchQuery}
                onChange={handleSearchChange}
                aria-label="Search products"
              />
              
              {filters.searchQuery && (
                <button
                  onClick={() => setFilters(prev => ({ ...prev, searchQuery: '' }))}
                  className="ml-2 p-1 hover:bg-gray-100 rounded"
                  aria-label="Clear search"
                >
                  <FiX className="w-4 h-4 text-gray-400" />
                </button>
              )}
            </div>

            {/* Right: View Mode and Sort */}
            <div className="flex items-center gap-4 ml-4 border-l border-[#E1E3E1] pl-4">
              {/* View Mode Toggle */}
              <div className="flex items-center gap-1 border border-gray-200 rounded-lg p-0.5">
                <button
                  onClick={() => handleViewModeChange('list')}
                  className={`p-1.5 rounded transition-colors ${
                    viewMode === 'list' 
                      ? 'bg-green-100 text-green-700' 
                      : 'text-gray-400 hover:text-gray-600'
                  }`}
                  title="List View"
                  aria-label="Switch to list view"
                >
                  <FiList className="w-4 h-4 lg:w-5 lg:h-5" />
                </button>
                
                <button
                  onClick={() => handleViewModeChange('grid')}
                  className={`p-1.5 rounded transition-colors ${
                    viewMode === 'grid' 
                      ? 'bg-green-100 text-green-700' 
                      : 'text-gray-400 hover:text-gray-600'
                  }`}
                  title="Grid View"
                  aria-label="Switch to grid view"
                >
                  <FiGrid className="w-4 h-4 lg:w-5 lg:h-5" />
                </button>
              </div>

              {/* Sort Dropdown */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500 hidden xl:inline">Sort by:</span>
                <select
                  className="border-none outline-none bg-transparent text-sm text-gray-700 cursor-pointer focus:ring-0 py-2 pr-6"
                  value={filters.sortBy}
                  onChange={(e) => handleSortChange(e.target.value as FilterOptions['sortBy'])}
                  aria-label="Sort products by"
                >
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Sort Dropdown */}
        {showMobileSort && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-[#E1E3E1] rounded-lg shadow-lg z-50 sm:hidden">
            <div className="p-2">
              {sortOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleSortChange(option.value as FilterOptions['sortBy'])}
                  className={`w-full text-left px-4 py-3 rounded-lg text-sm ${
                    filters.sortBy === option.value
                      ? 'bg-green-50 text-green-700 font-medium'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Desktop Filter Panel */}
        {isFilterOpen && (
          <div 
            ref={filterPanelRef}
            className="absolute top-full left-0 right-0 mt-2 border border-[#E1E3E1] rounded-lg bg-white shadow-xl z-50 hidden sm:block"
          >
            <div className="p-4 lg:p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
                
                {/* Price Range */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price Range (PKR)
                  </label>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs lg:text-sm">
                      <span className="text-gray-600">PKR {filters.minPrice}</span>
                      <span className="text-gray-600">PKR {filters.maxPrice}</span>
                    </div>
                    <div className="space-y-2">
                      <input
                        type="range"
                        min="0"
                        max="5000"
                        step="100"
                        value={filters.minPrice}
                        onChange={(e) => handlePriceChange(Number(e.target.value), filters.maxPrice)}
                        className="w-full h-1.5 bg-gray-300 rounded-full appearance-none cursor-pointer"
                      />
                      <input
                        type="range"
                        min="0"
                        max="5000"
                        step="100"
                        value={filters.maxPrice}
                        onChange={(e) => handlePriceChange(filters.minPrice, Number(e.target.value))}
                        className="w-full h-1.5 bg-gray-300 rounded-full appearance-none cursor-pointer"
                      />
                    </div>
                  </div>
                </div>

                {/* Categories */}
                {categories.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Categories
                    </label>
                    <div className="space-y-2 max-h-32 lg:max-h-40 overflow-y-auto pr-2">
                      {categories.map((category) => {
                        const isSelected = filters.categories.includes(category) || currentCategory === category;
                        return (
                          <div key={category} className="flex items-center">
                            <input
                              type="checkbox"
                              id={`cat-${category}`}
                              checked={isSelected}
                              onChange={() => {
                                const params = new URLSearchParams(searchParams.toString());
                                if (isSelected) {
                                  params.delete('category');
                                } else {
                                  params.set('category', category);
                                }
                                router.push(`${pathname}?${params.toString()}`);
                              }}
                              className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
                            />
                            <label 
                              htmlFor={`cat-${category}`} 
                              className="ml-2 text-xs lg:text-sm text-gray-700 cursor-pointer capitalize"
                            >
                              {category.replace('-', ' ')}
                            </label>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Availability */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Availability
                  </label>
                  <div className="space-y-2 lg:space-y-3">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="in-stock"
                        checked={filters.showInStock}
                        onChange={(e) => setFilters(prev => ({ ...prev, showInStock: e.target.checked }))}
                        className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
                      />
                      <label htmlFor="in-stock" className="ml-2 text-xs lg:text-sm text-gray-700 cursor-pointer">
                        In Stock Only
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="on-sale"
                        checked={filters.showOnSale}
                        onChange={(e) => setFilters(prev => ({ ...prev, showOnSale: e.target.checked }))}
                        className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
                      />
                      <label htmlFor="on-sale" className="ml-2 text-xs lg:text-sm text-gray-700 cursor-pointer">
                        On Sale Only
                      </label>
                    </div>
                  </div>
                </div>

                {/* Rating Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Minimum Rating
                  </label>
                  <div className="space-y-1 lg:space-y-2">
                    {[4.5, 4.0, 3.5, 3.0].map((rating) => (
                      <button
                        key={rating}
                        onClick={() => {
                          handleSortChange('rating');
                          setIsFilterOpen(false);
                        }}
                        className="flex items-center gap-2 w-full text-left px-2 py-1.5 rounded hover:bg-gray-100 transition-colors"
                      >
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <FaStar
                              key={i}
                              className={`w-3 h-3 lg:w-4 lg:h-4 ${i < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-300'}`}
                            />
                          ))}
                        </div>
                        <span className="text-xs lg:text-sm text-gray-600">& above</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Filter Actions */}
              <div className="flex items-center justify-end gap-3 mt-4 lg:mt-6 pt-4 border-t border-[#E1E3E1]">
                <button
                  onClick={() => {
                    clearFilters();
                    setIsFilterOpen(false);
                  }}
                  className="px-3 lg:px-4 py-2 text-xs lg:text-sm text-gray-600 border border-[#E1E3E1] rounded-lg hover:bg-gray-100 transition-colors"
                >
                  Reset All
                </button>
                <button
                  onClick={() => setIsFilterOpen(false)}
                  className="px-3 lg:px-4 py-2 text-xs lg:text-sm bg-green-700 text-white rounded-lg hover:bg-green-800 transition-colors"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Mobile Filter Modal */}
        {isMobileFilterOpen && (
          <div className="fixed inset-0 z-50 sm:hidden">
            {/* Backdrop */}
            <div 
              className="fixed inset-0 bg-black bg-opacity-50"
              onClick={() => setIsMobileFilterOpen(false)}
            />
            
            {/* Modal */}
            <div className="fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b border-[#E1E3E1] p-4 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
                <button
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  <FiX className="w-5 h-5 text-gray-500" />
                </button>
              </div>
              
              <div className="p-4 space-y-6">
                {/* Price Range */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Price Range (PKR)
                  </label>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">PKR {tempFilters.minPrice}</span>
                      <span className="text-gray-600">PKR {tempFilters.maxPrice}</span>
                    </div>
                    <div className="space-y-2">
                      <input
                        type="range"
                        min="0"
                        max="5000"
                        step="100"
                        value={tempFilters.minPrice}
                        onChange={(e) => handlePriceChange(Number(e.target.value), tempFilters.maxPrice)}
                        className="w-full h-1.5 bg-gray-300 rounded-full appearance-none cursor-pointer"
                      />
                      <input
                        type="range"
                        min="0"
                        max="5000"
                        step="100"
                        value={tempFilters.maxPrice}
                        onChange={(e) => handlePriceChange(tempFilters.minPrice, Number(e.target.value))}
                        className="w-full h-1.5 bg-gray-300 rounded-full appearance-none cursor-pointer"
                      />
                    </div>
                  </div>
                </div>

                {/* Categories */}
                {categories.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Categories
                    </label>
                    <div className="space-y-2">
                      {categories.map((category) => {
                        const isSelected = tempFilters.categories.includes(category) || currentCategory === category;
                        return (
                          <div key={category} className="flex items-center">
                            <input
                              type="checkbox"
                              id={`mobile-cat-${category}`}
                              checked={isSelected}
                              onChange={() => {
                                const newCategories = isSelected
                                  ? tempFilters.categories.filter(c => c !== category)
                                  : [...tempFilters.categories, category];
                                setTempFilters(prev => ({ ...prev, categories: newCategories }));
                              }}
                              className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
                            />
                            <label 
                              htmlFor={`mobile-cat-${category}`} 
                              className="ml-2 text-sm text-gray-700 cursor-pointer capitalize"
                            >
                              {category.replace('-', ' ')}
                            </label>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Availability */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Availability
                  </label>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="mobile-in-stock"
                        checked={tempFilters.showInStock}
                        onChange={(e) => setTempFilters(prev => ({ ...prev, showInStock: e.target.checked }))}
                        className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
                      />
                      <label htmlFor="mobile-in-stock" className="ml-2 text-sm text-gray-700 cursor-pointer">
                        In Stock Only
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="mobile-on-sale"
                        checked={tempFilters.showOnSale}
                        onChange={(e) => setTempFilters(prev => ({ ...prev, showOnSale: e.target.checked }))}
                        className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
                      />
                      <label htmlFor="mobile-on-sale" className="ml-2 text-sm text-gray-700 cursor-pointer">
                        On Sale Only
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer Actions */}
              <div className="sticky bottom-0 bg-white border-t border-[#E1E3E1] p-4 flex gap-3">
                <button
                  onClick={() => {
                    clearFilters();
                    setTempFilters({
                      searchQuery: '',
                      minPrice: 0,
                      maxPrice: 5000,
                      categories: [],
                      sortBy: 'default',
                      showOnSale: false,
                      showInStock: true,
                    });
                  }}
                  className="flex-1 py-3 text-sm text-gray-600 border border-[#E1E3E1] rounded-lg hover:bg-gray-100 transition-colors"
                >
                  Reset
                </button>
                <button
                  onClick={applyMobileFilters}
                  className="flex-1 py-3 text-sm bg-green-700 text-white rounded-lg hover:bg-green-800 transition-colors"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Active Filters Display */}
      {getActiveFilterCount() > 0 && (
        <div className="flex flex-wrap items-center gap-2 mt-3">
          <span className="text-xs text-gray-500">Active filters:</span>
          
          {filters.searchQuery && (
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 rounded-full text-xs">
              Search: {filters.searchQuery}
              <button
                onClick={() => setFilters(prev => ({ ...prev, searchQuery: '' }))}
                className="ml-1 hover:text-gray-900"
              >
                <FiX className="w-3 h-3" />
              </button>
            </span>
          )}
          
          {(filters.minPrice > 0 || filters.maxPrice < 5000) && (
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 rounded-full text-xs">
              PKR {filters.minPrice} - PKR {filters.maxPrice}
              <button
                onClick={() => setFilters(prev => ({ ...prev, minPrice: 0, maxPrice: 5000 }))}
                className="ml-1 hover:text-gray-900"
              >
                <FiX className="w-3 h-3" />
              </button>
            </span>
          )}
          
          {filters.categories.map(cat => (
            <span key={cat} className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 rounded-full text-xs capitalize">
              {cat.replace('-', ' ')}
              <button
                onClick={() => {
                  const newCategories = filters.categories.filter(c => c !== cat);
                  setFilters(prev => ({ ...prev, categories: newCategories }));
                }}
                className="ml-1 hover:text-gray-900"
              >
                <FiX className="w-3 h-3" />
              </button>
            </span>
          ))}
          
          {filters.sortBy !== 'default' && (
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 rounded-full text-xs">
              {sortOptions.find(o => o.value === filters.sortBy)?.label}
              <button
                onClick={() => setFilters(prev => ({ ...prev, sortBy: 'default' }))}
                className="ml-1 hover:text-gray-900"
              >
                <FiX className="w-3 h-3" />
              </button>
            </span>
          )}
          
          {filters.showOnSale && (
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 rounded-full text-xs">
              On Sale
              <button
                onClick={() => setFilters(prev => ({ ...prev, showOnSale: false }))}
                className="ml-1 hover:text-gray-900"
              >
                <FiX className="w-3 h-3" />
              </button>
            </span>
          )}
          
          {!filters.showInStock && (
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 rounded-full text-xs">
              Out of Stock
              <button
                onClick={() => setFilters(prev => ({ ...prev, showInStock: true }))}
                className="ml-1 hover:text-gray-900"
              >
                <FiX className="w-3 h-3" />
              </button>
            </span>
          )}
          
          <button
            onClick={clearFilters}
            className="text-xs text-red-600 hover:text-red-700 font-medium ml-2"
          >
            Clear all
          </button>
        </div>
      )}

      {/* Mobile Product Count */}
      <div className="sm:hidden mt-2 text-xs text-gray-500">
        {productCount} {productCount === 1 ? 'item' : 'items'} found
      </div>
    </div>
  );
}

// Main component with Suspense wrapper
export default function SearchFilterBar({
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
  return (
    <Suspense fallback={
      <div className="mb-4 sm:mb-6">
        <div className="flex items-center border border-[#E1E3E1] rounded-lg px-4 py-3 bg-white animate-pulse">
          <div className="flex-1 h-5 sm:h-6 bg-gray-200 rounded"></div>
        </div>
      </div>
    }>
      <SearchFilterBarContent
        onFilterChange={onFilterChange}
        onViewModeChange={onViewModeChange}
        productCount={productCount}
        categories={categories}
        initialSearchQuery={initialSearchQuery}
      />
    </Suspense>
  );
}