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
  FiChevronDown 
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

  const isInitialMount = useRef(true);
  const initialSearchQueryRef = useRef(initialSearchQuery);
  
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
    }
  }, [searchParams]);

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
    setFilters(prev => ({ ...prev, minPrice: min, maxPrice: max }));
  };

  const handleSortChange = (sortBy: FilterOptions['sortBy']) => {
    setFilters(prev => ({ ...prev, sortBy }));
  };

  const handleViewModeChange = (mode: 'grid' | 'list') => {
    setViewMode(mode);
    onViewModeChange(mode);
  };

  const clearFilters = useCallback(() => {
    setFilters({
      searchQuery: '',
      minPrice: 0,
      maxPrice: 5000,
      categories: [],
      sortBy: 'default',
      showOnSale: false,
      showInStock: true,
    });
    
    // Clear URL params but keep category if it exists
    const params = new URLSearchParams(searchParams.toString());
    params.delete('search');
    params.delete('categories');
    // Keep 'category' param if it exists (for tabs)
    router.push(`${pathname}?${params.toString()}`);
  }, [router, pathname, searchParams]);

  // Get current category from URL
  const currentCategory = searchParams.get('category');

  return (
    <div className="mb-6">
      {/* Main Search Input Container */}
      <div className="relative">
        <div className="flex items-center border border-[#E1E3E1] rounded-lg px-4 py-3 bg-white">
          {/* Left: Filter Button */}
          <div className="flex items-center gap-2 mr-4">
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="flex items-center gap-2 text-gray-700 hover:text-gray-900"
              aria-label="Open filters"
            >
              <FiFilter className="w-5 h-5" />
              <span className="hidden sm:inline text-sm font-medium">Filter</span>
            </button>
            
            <span className="hidden md:inline text-sm text-gray-500 ml-2">
              {productCount} {productCount === 1 ? 'item' : 'items'}
            </span>
          </div>

          {/* Center: Search Input */}
          <div className="flex-1 flex items-center">
            <FiSearch className="w-5 h-5 text-gray-400 mr-3" />
            
            <input
              type="text"
              placeholder="Search products..."
              className="flex-1 w-full outline-none bg-transparent text-gray-700 placeholder-gray-400"
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
          <div className="flex items-center gap-4 ml-4">
            {/* View Mode Toggle */}
            <div className="flex items-center gap-2 border border-gray-200 rounded-lg p-1">
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
                <FiList className="w-5 h-5" />
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
                <FiGrid className="w-5 h-5" />
              </button>
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500 hidden sm:inline">Sort by:</span>
              <select
                className="border-none outline-none bg-transparent text-sm text-gray-700 cursor-pointer focus:ring-0"
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

        {/* Filter Panel */}
        {isFilterOpen && (
          <div className="absolute top-full left-0 right-0 mt-1 border border-[#E1E3E1] rounded-lg bg-white shadow-lg z-50">
            <div className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                
                {/* Price Range */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price Range (PKR)
                  </label>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
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

                {/* Categories - Now reflects current category from tabs */}
                {categories.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Categories
                    </label>
                    <div className="space-y-2 max-h-40 overflow-y-auto pr-2">
                      {categories.map((category) => {
                        const isSelected = filters.categories.includes(category) || currentCategory === category;
                        return (
                          <div key={category} className="flex items-center">
                            <input
                              type="checkbox"
                              id={`cat-${category}`}
                              checked={isSelected}
                              onChange={() => {
                                // This will update URL through the main shop component
                                // The actual category change is handled by CategoryTabs
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Availability
                  </label>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="in-stock"
                        checked={filters.showInStock}
                        onChange={(e) => setFilters(prev => ({ ...prev, showInStock: e.target.checked }))}
                        className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
                      />
                      <label htmlFor="in-stock" className="ml-2 text-sm text-gray-700 cursor-pointer">
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
                      <label htmlFor="on-sale" className="ml-2 text-sm text-gray-700 cursor-pointer">
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
                  <div className="space-y-2">
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
                              className={`w-4 h-4 ${i < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-300'}`}
                            />
                          ))}
                        </div>
                        <span className="text-sm text-gray-600">& above</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Filter Actions */}
              <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-[#E1E3E1]">
                <button
                  onClick={() => {
                    clearFilters();
                    setIsFilterOpen(false);
                  }}
                  className="px-4 py-2 text-sm text-gray-600 border border-[#E1E3E1] rounded-lg hover:bg-gray-100 transition-colors"
                >
                  Reset All
                </button>
                <button
                  onClick={() => setIsFilterOpen(false)}
                  className="px-4 py-2 text-sm bg-green-700 text-white rounded-lg hover:bg-green-800 transition-colors"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </div>
        )}
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
      <div className="mb-6">
        <div className="flex items-center border border-[#E1E3E1] rounded-lg px-4 py-3 bg-white animate-pulse">
          <div className="flex-1 h-6 bg-gray-200 rounded"></div>
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