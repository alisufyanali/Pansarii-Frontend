// app/shop/page.tsx
'use client';

import { Suspense, useState, useMemo, useEffect, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { Product, FilterOptions, filterProducts, getCategoriesFromProducts, getPriceRangeFromProducts } from "../../utils/filterProducts";
import { allProducts } from "@/app/Desktop/data/products";

// ─── Dynamic import at MODULE level (never inside useMemo/render) ─────────────
const DynamicShopContent = dynamic(() => import('./ShopContent'), {
  loading: () => <ProductGridSkeleton count={20} />,
  ssr: false,
});

// ─── Skeleton helpers ─────────────────────────────────────────────────────────

function ProductGridSkeleton({ count = 12 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-5 2xl:grid-cols-5 gap-3 sm:gap-4 lg:gap-6 2xl:gap-8">
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

function ShopLoading() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-screen-2xl px-3 sm:px-4 lg:px-6 2xl:px-10 py-4 sm:py-6">
        {/* Results Banner Skeleton */}
        <div className="mb-6">
          <div className="bg-gray-100 border border-gray-200 rounded-xl p-6 shadow-sm animate-pulse">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-3">
                <div className="h-6 bg-gray-200 rounded w-64" />
                <div className="flex items-center gap-2">
                  <div className="h-4 bg-gray-200 rounded w-32" />
                  <div className="h-4 bg-gray-200 rounded w-16" />
                </div>
              </div>
              <div className="flex gap-3">
                <div className="h-8 bg-gray-200 rounded-lg w-20" />
                <div className="h-8 bg-gray-200 rounded-lg w-24" />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-4">
          <div className="mb-6"><div className="h-12 bg-gray-200 rounded-lg animate-pulse" /></div>
          <div className="mb-6">
            <div className="flex gap-2 overflow-x-auto pb-2">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-10 bg-gray-200 rounded-full animate-pulse w-24 flex-shrink-0" />
              ))}
            </div>
          </div>
          <div className="my-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-2">
              <div className="h-6 bg-gray-200 rounded animate-pulse w-64" />
              <div className="h-4 bg-gray-200 rounded animate-pulse w-48" />
            </div>
            <div className="h-5 bg-gray-200 rounded animate-pulse w-40" />
          </div>
          {/* 25 cards for 4K (5x5), 12 for smaller */}
          <ProductGridSkeleton count={25} />
          <div className="mt-6 sm:mt-8 flex justify-center">
            <div className="h-8 sm:h-10 bg-gray-200 rounded-lg animate-pulse w-48 sm:w-64" />
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── ShopContent ──────────────────────────────────────────────────────────────

function ShopContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const initialSearchQuery = searchParams.get('search') || '';
  const initialCategory = searchParams.get('category') || '';
  const initialCategories = searchParams.get('categories')?.split(',') || [];

  const safeProducts = useMemo(() => {
    if (!allProducts || !Array.isArray(allProducts)) return [];
    return allProducts.map(product => ({ ...product, inStock: product.inStock !== false }));
  }, []);

  const categories = useMemo(() => getCategoriesFromProducts(safeProducts), [safeProducts]);
  const priceRange = useMemo(() => getPriceRangeFromProducts(safeProducts), [safeProducts]);

  const [filters, setFilters] = useState<FilterOptions>(() => ({
    searchQuery: initialSearchQuery,
    minPrice: 0,
    maxPrice: priceRange.max || 5000,
    categories: initialCategory ? [initialCategory] : initialCategories.length > 0 ? initialCategories : [],
    sortBy: 'default',
    showOnSale: false,
    showInStock: true,
    showNewArrivals: false,
    showBestSellers: false,
  }));

  useEffect(() => {
    if (priceRange.max && priceRange.max !== filters.maxPrice) {
      setFilters(prev => ({ ...prev, maxPrice: priceRange.max }));
    }
  }, [priceRange.max]);

  const [currentPage, setCurrentPage] = useState(1);

  // Responsive products per page: 25 on 4K (5x5), 20 on large desktop, 12 on laptop
  const [productsPerPage, setProductsPerPage] = useState(20);

  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      if (w >= 2560) setProductsPerPage(25);      // 4K: 5 cols × 5 rows
      else if (w >= 1280) setProductsPerPage(20); // Laptop+: 5 cols × 4 rows
      else if (w >= 768) setProductsPerPage(12);  // Tablet: 3 cols × 4 rows
      else setProductsPerPage(10);                // Mobile: 2 cols × 5 rows
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  const filteredProducts = useMemo(() => filterProducts(safeProducts, filters), [safeProducts, filters]);

  const { totalPages, indexOfLastProduct, indexOfFirstProduct, currentProducts } = useMemo(() => {
    const total = Math.ceil(filteredProducts.length / productsPerPage) || 1;
    const last = Math.min(currentPage * productsPerPage, filteredProducts.length);
    const first = (currentPage - 1) * productsPerPage;
    return {
      totalPages: total,
      indexOfLastProduct: last,
      indexOfFirstProduct: first,
      currentProducts: filteredProducts.slice(first, last),
    };
  }, [filteredProducts, currentPage, productsPerPage]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const params = new URLSearchParams();
      if (filters.searchQuery.trim()) params.set('search', filters.searchQuery.trim());
      if (filters.categories.length === 1) params.set('category', filters.categories[0]);
      else if (filters.categories.length > 1) params.set('categories', filters.categories.join(','));
      const newUrl = params.toString() ? `/shop?${params.toString()}` : '/shop';
      if (newUrl !== window.location.pathname + window.location.search) {
        router.replace(newUrl, { scroll: false });
      }
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [filters.searchQuery, filters.categories, router]);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleFilterChange = useCallback((newFilters: FilterOptions) => {
    setFilters(newFilters);
    setCurrentPage(1);
  }, []);

  const handleClearFilters = useCallback(() => {
    setFilters({
      searchQuery: '',
      minPrice: 0,
      maxPrice: priceRange.max || 5000,
      categories: [],
      sortBy: 'default',
      showOnSale: false,
      showInStock: true,
      showNewArrivals: false,
      showBestSellers: false,
    });
    setCurrentPage(1);
    router.push('/shop');
  }, [priceRange.max, router]);

  if (safeProducts.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="mx-auto max-w-screen-2xl px-3 sm:px-4 lg:px-6 2xl:px-10 py-4 sm:py-6">
          <div className="bg-white rounded-lg p-4">
            <div className="mb-6"><div className="h-12 bg-gray-200 rounded-lg animate-pulse" /></div>
            <div className="mb-6">
              <div className="flex gap-2 overflow-x-auto pb-2">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-10 bg-gray-200 rounded-full animate-pulse w-24 flex-shrink-0" />
                ))}
              </div>
            </div>
            <ProductGridSkeleton count={productsPerPage} />
            <div className="mt-6 sm:mt-8 flex justify-center">
              <div className="h-8 sm:h-10 bg-gray-200 rounded-lg animate-pulse w-48 sm:w-64" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white ">
      <div className="pt-4">
        <DynamicShopContent
          categories={categories}
          filters={filters}
          setFilters={handleFilterChange}
          filteredProducts={filteredProducts}
          currentProducts={currentProducts}
          currentPage={currentPage}
          totalPages={totalPages}
          indexOfFirstProduct={indexOfFirstProduct}
          indexOfLastProduct={indexOfLastProduct}
          productsPerPage={productsPerPage}
          onPageChange={handlePageChange}
          initialSearchQuery={initialSearchQuery}
          allProducts={safeProducts}
        />
      </div>
    </div>
  );
}

export default function Shop() {
  return (
    <Suspense fallback={<ShopLoading />}>
      <ShopContent />
    </Suspense>
  );
}