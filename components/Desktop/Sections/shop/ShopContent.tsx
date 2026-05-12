// app/shop/ShopContent.tsx
'use client';

import { useState, memo, lazy, Suspense, useEffect } from 'react';
import { FilterOptions, Product } from "../../../../utils/filterProducts";
import SearchFilterBar from "../../components/SearchFilterBar";
import CategoryTabs from "../../components/CategoryTabs";
import Pagination from "./Pagination";
import { useCart } from "../../../../app/context/CartContext";
import { toast } from 'react-toastify';

const ProductGrid = lazy(() => import('./ProductGrid'));

function ProductGridLoading({ count = 12 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-5 2xl:grid-cols-5 gap-3 sm:gap-4 lg:gap-6 2xl:gap-8 2xl:gap-8">
      {[...Array(count)].map((_, i) => (
        <div key={i} className="bg-white rounded-lg border border-gray-200 animate-pulse">
          <div className="aspect-square bg-gray-200 rounded-t-lg" />
          <div className="p-3 sm:p-4 space-y-2 sm:space-y-3">
            <div className="h-3 sm:h-4 bg-gray-200 rounded" />
            <div className="h-2 sm:h-3 bg-gray-200 rounded w-2/3" />
            <div className="h-3 sm:h-4 bg-gray-200 rounded w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
}

function ShopContentLoading() {
  return (
    <div className="mx-auto max-w-screen-2xl px-3 sm:px-4 lg:px-6 2xl:px-10 py-4 sm:py-6">
      <div className="mb-4 sm:mb-6">
        <div className="h-12 sm:h-14 bg-gray-200 rounded-lg animate-pulse" />
      </div>
      <div className="mb-4 sm:mb-6">
        <div className="flex gap-2 overflow-x-auto pb-2">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-8 sm:h-10 bg-gray-200 rounded-full animate-pulse w-16 sm:w-24 flex-shrink-0" />
          ))}
        </div>
      </div>
      <div className="my-4 sm:my-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div className="space-y-1 sm:space-y-2">
          <div className="h-5 sm:h-6 bg-gray-200 rounded animate-pulse w-48 sm:w-64" />
          <div className="h-3 sm:h-4 bg-gray-200 rounded animate-pulse w-36 sm:w-48" />
        </div>
        <div className="h-4 sm:h-5 bg-gray-200 rounded animate-pulse w-32 sm:w-40" />
      </div>
      <ProductGridLoading count={25} />
      <div className="mt-6 sm:mt-8 flex justify-center">
        <div className="h-8 sm:h-10 bg-gray-200 rounded-lg animate-pulse w-48 sm:w-64" />
      </div>
    </div>
  );
}

interface ShopContentProps {
  categories: string[];
  filters: FilterOptions;
  setFilters: (filters: FilterOptions) => void;
  filteredProducts: Product[];
  currentProducts: Product[];
  currentPage: number;
  totalPages: number;
  indexOfFirstProduct: number;
  indexOfLastProduct: number;
  productsPerPage: number;
  onPageChange: (page: number) => void;
  initialSearchQuery?: string;
  allProducts: Product[];
  isLoading?: boolean;
}

function ShopContent({
  categories = [],
  filters,
  setFilters,
  filteredProducts = [],
  currentProducts = [],
  currentPage,
  totalPages,
  indexOfFirstProduct,
  indexOfLastProduct,
  productsPerPage,
  onPageChange,
  initialSearchQuery = '',
  allProducts = [],
  isLoading = false,
}: ShopContentProps) {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isMobile, setIsMobile] = useState(false);
  const { addToCart } = useCart();

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  if (isLoading) return <ShopContentLoading />;

  const clearAllFilters = () => {
    setFilters({
      searchQuery: '',
      minPrice: 0,
      maxPrice: 5000,
      categories: [],
      sortBy: 'default',
      showOnSale: false,
      showInStock: true,
      showNewArrivals: false,
      showBestSellers: false,
    });
  };

  const handleCategoryChange = (category: string) => {
    setFilters({ ...filters, categories: (category && category !== 'all') ? [category] : [] });
  };

  const handleAddToCart = (product: Product) => {
    if (!product || !product.id) {
      toast.error('Failed to add item to cart!', { position: "top-right", autoClose: 3000 });
      return;
    }
    addToCart({
      id: product.id,
      img: product.img,
      nameEn: product.nameEn,
      nameUr: product.nameUr,
      price: product.price,
      size: product.sizes?.[0] || 'Default',
    });
    toast.success(
      <div><div className="font-semibold">Added to Cart!</div><div className="text-sm opacity-90">{product.nameEn}</div></div>,
      { position: "top-right", autoClose: 3000 }
    );
  };

  const categoryData = (categories || []).map(category => ({
    name: category.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase()),
    count: (allProducts || []).filter(p => p?.category?.toLowerCase() === category.toLowerCase()).length,
    slug: category,
  }));

  const getSortLabel = () => {
    switch (filters.sortBy) {
      case 'price-low': return 'Price: Low to High';
      case 'price-high': return 'Price: High to Low';
      case 'rating': return 'Highest Rated';
      case 'name': return 'Name (A-Z)';
      default: return 'Default';
    }
  };

  return (
    /*
      Container:
      - lg and below (laptop): max-w-screen-2xl, px-3..px-6   ← unchanged
      - 2xl (1536px+):         max-w-screen-2xl, px-10        ← wider padding for large screens
      - The grid inside always stays 5 cols on xl+ so cards get bigger naturally
    */
    <div className="mx-auto max-w-screen-2xl px-3 sm:px-4 lg:px-6 2xl:px-10 py-4 sm:py-6">
      {/* Search and Filter Bar */}
      <SearchFilterBar
        onFilterChange={setFilters}
        productCount={filteredProducts.length}
        categories={categories}
        onViewModeChange={setViewMode}
        initialSearchQuery={initialSearchQuery}
      />

      {/* Category Tabs */}
      <CategoryTabs
        categories={categoryData}
        activeCategory={filters.categories[0] || 'all'}
        onCategoryChange={handleCategoryChange}
      />

      {/* Results Info */}
      <div className="my-4 sm:my-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div>
          <h2 className="text-sm sm:text-base lg:text-lg 2xl:text-xl font-semibold text-gray-900">
            Showing {indexOfFirstProduct + 1}–{Math.min(indexOfLastProduct, filteredProducts.length)} of {filteredProducts.length} products
          </h2>
          {filters.searchQuery && (
            <p className="text-xs sm:text-sm text-gray-600 mt-0.5 sm:mt-1">
              Results for "<span className="font-medium">{filters.searchQuery}</span>"
            </p>
          )}
          {(filters.categories.length > 0 || filters.showOnSale || filters.minPrice > 0 || filters.maxPrice < 5000) && (
            <p className="text-xs sm:text-sm text-gray-500 mt-0.5 sm:mt-1">
              {filters.categories.length > 0 && `${filters.categories.length} category selected • `}
              {filters.showOnSale && `On sale only • `}
              {(filters.minPrice > 0 || filters.maxPrice < 5000) && `Price: PKR ${filters.minPrice} – PKR ${filters.maxPrice}`}
            </p>
          )}
        </div>
        {filters.sortBy !== 'default' && (
          <div className="text-xs sm:text-sm text-gray-600">
            Sorted by: <span className="font-medium">{getSortLabel()}</span>
          </div>
        )}
      </div>

      {/* Product Grid */}
      <Suspense fallback={<ProductGridLoading count={productsPerPage} />}>
        <ProductGrid
          products={currentProducts}
          viewMode={viewMode}
          onAddToCart={handleAddToCart}
          isMobile={isMobile}
        />
      </Suspense>

      {/* No Results */}
      {filteredProducts.length === 0 && (
        <div className="text-center py-8 sm:py-12 lg:py-16">
          <div className="flex justify-center mb-3 sm:mb-4">
            <svg className="w-12 h-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"/></svg>
          </div>
          <h3 className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-900 mb-2 sm:mb-3">No products found</h3>
          <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6 max-w-md mx-auto px-4">
            {filters.searchQuery
              ? `No results found for "${filters.searchQuery}". Try adjusting your search term.`
              : "Try adjusting your filters to find what you're looking for."}
          </p>
          <button
            onClick={clearAllFilters}
            className="mt-2 sm:mt-4 px-4 sm:px-6 py-2.5 sm:py-3 bg-[#197B33] text-white rounded-lg hover:bg-[#156529] transition-colors font-medium text-sm sm:text-base"
          >
            Clear All Filters & Search
          </button>
        </div>
      )}

      {/* Pagination */}
      {filteredProducts.length > 0 && (
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={onPageChange} />
      )}
    </div>
  );
}

export default memo(ShopContent);