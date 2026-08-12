// app/shop/page.tsx
'use client';

import { Suspense, useState, useEffect, useCallback, useMemo } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import type { Product } from '@/types/product';
import { FilterOptions, getCategoriesFromProducts, getPriceRangeFromProducts } from '@/utils/filterProducts';
import { allProducts } from '@/data/products';

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

  // API state
  const [apiProducts, setApiProducts] = useState<Product[]>([]);
  const [apiCategories, setApiCategories] = useState<{ id: number; name: string; slug: string; products_count?: number }[]>([]);
  const [apiMeta, setApiMeta] = useState<{ current_page: number; last_page: number; total: number; per_page?: number } | null>(null);
  const [isApiLoading, setIsApiLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(() => Number(searchParams.get('page')) || 1);

  // Responsive products per page
  const [productsPerPage, setProductsPerPage] = useState(20);
  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      if (w >= 2560) setProductsPerPage(25);
      else if (w >= 1280) setProductsPerPage(20);
      else if (w >= 768) setProductsPerPage(12);
      else setProductsPerPage(10);
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  const [filters, setFilters] = useState<FilterOptions>(() => ({
    searchQuery: initialSearchQuery,
    minPrice: 0,
    maxPrice: 5000,
    categories: initialCategory ? [initialCategory] : [],
    sortBy: 'default',
    showOnSale: false,
    showInStock: true,
    showNewArrivals: false,
    showBestSellers: false,
  }));

  // Fetch categories once
  useEffect(() => {
    import('@/lib/products').then(({ getCategoriesCached }) => {
      getCategoriesCached().then(cats => setApiCategories(cats));
    });
  }, []);

  // Stable resolved category ID — only changes when the selected category name/slug actually changes
  const selectedCategoryId = useMemo(() => {
    if (filters.categories.length !== 1) return undefined;
    return apiCategories.find(
      c => c.name === filters.categories[0] || c.slug === filters.categories[0],
    )?.id;
  }, [filters.categories, apiCategories]);

  // Fetch products when filters/page change
  useEffect(() => {
    setIsApiLoading(true);
    const controller = new AbortController();

    const sortMap: Record<string, { sort_by?: string; sort_order?: 'asc' | 'desc' }> = {
      'price-low':  { sort_by: 'price', sort_order: 'asc'  },
      'price-high': { sort_by: 'price', sort_order: 'desc' },
      'rating':     { sort_by: 'rating', sort_order: 'desc' },
      'name':       { sort_by: 'name', sort_order: 'asc'   },
    };
    const sortParams = sortMap[filters.sortBy] || {};

    import('@/lib/products').then(({ getProducts }) => {
      getProducts({
        search:      filters.searchQuery || undefined,
        category_id: selectedCategoryId,
        min_price:   filters.minPrice > 0 ? filters.minPrice : undefined,
        max_price:   filters.maxPrice < 5000 ? filters.maxPrice : undefined,
        per_page:    productsPerPage,
        page:        currentPage,
        ...sortParams,
      }, { signal: controller.signal }).then(res => {
        setApiProducts(res.data.map(p => {
          const price = p.variants?.length ? Math.min(...p.variants.map(v => v.price)) : (p.sale_price ?? p.price);
          return {
            id: p.id,
            img: p.thumbnail || '/images/product.png',
            nameEn: p.name,
            nameUr: p.name,
            description: p.description || '',
            rating: p.rating || 4.5,
            reviews: p.reviews_count || 0,
            price,
            oldPrice: p.sale_price && p.price > p.sale_price ? p.price : null,
            sale: p.sale_price ? `${Math.round(((p.price - p.sale_price) / p.price) * 100)}% OFF` : null,
            category: p.category?.name,
            inStock: p.variants?.some(v => v.stock > 0) ?? true,
            isBestSeller: p.featured,
            variants: p.variants,
            sizes: p.variants?.length ? p.variants.map(v => v.name) : undefined,
          };
        }));
        setApiMeta(res.meta);
      }).finally(() => setIsApiLoading(false));
    });

    return () => controller.abort();
  }, [filters, currentPage, productsPerPage, selectedCategoryId]);

  // URL sync — push (not replace) so each page/filter state is a distinct history entry
  // and the browser Back button restores the exact URL the user left from.
  useEffect(() => {
    const t = setTimeout(() => {
      const params = new URLSearchParams();
      if (filters.searchQuery.trim()) params.set('search', filters.searchQuery.trim());
      if (filters.categories.length === 1) params.set('category', filters.categories[0]);
      if (currentPage > 1) params.set('page', String(currentPage));
      const newUrl = params.toString() ? `/shop?${params.toString()}` : '/shop';
      if (newUrl !== window.location.pathname + window.location.search) {
        router.push(newUrl, { scroll: false });
      }
    }, 300);
    return () => clearTimeout(t);
  }, [filters.searchQuery, filters.categories, currentPage, router]);

  // Re-sync currentPage from URL when searchParams change (Back/Forward navigation).
  // useState lazy initializer only runs once; this effect keeps state in sync with
  // the URL after history navigation restores a different ?page= value.
  useEffect(() => {
    const pageFromUrl = Number(searchParams.get('page')) || 1;
    setCurrentPage(prev => prev !== pageFromUrl ? pageFromUrl : prev);
  }, [searchParams]);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleFilterChange = useCallback((newFilters: FilterOptions) => {
    setFilters(prev => {
      // SearchFilterBar owns: search, price, sort, sale, stock flags.
      // Categories are owned exclusively by handleCategorySelect below.
      // Always discard whatever categories SearchFilterBar emits and keep prev.categories,
      // so a sort/search/price change never clobbers the active category tab.
      const merged: FilterOptions = { ...newFilters, categories: prev.categories };

      const filtersChanged =
        prev.searchQuery !== merged.searchQuery ||
        prev.minPrice !== merged.minPrice ||
        prev.maxPrice !== merged.maxPrice ||
        prev.sortBy !== merged.sortBy ||
        prev.showOnSale !== merged.showOnSale ||
        prev.showInStock !== merged.showInStock ||
        prev.showNewArrivals !== merged.showNewArrivals ||
        prev.showBestSellers !== merged.showBestSellers;

      if (filtersChanged) setCurrentPage(1);
      return merged;
    });
  }, []);

  // Dedicated category setter — writes categories directly to state, bypassing
  // handleFilterChange (which preserves prev.categories to prevent SearchFilterBar
  // from resetting tab selection on sort/search changes).
  const handleCategorySelect = useCallback((category: string) => {
    setFilters(prev => ({
      ...prev,
      categories: (category && category !== 'all') ? [category] : [],
    }));
    setCurrentPage(1);
  }, []);

  const handleClearFilters = useCallback(() => {
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
    setCurrentPage(1);
    router.push('/shop');
  }, [router]);

  const totalPages = apiMeta?.last_page ?? 1;
  const indexOfFirstProduct = ((apiMeta?.current_page ?? 1) - 1) * (apiMeta?.per_page ?? productsPerPage);
  const indexOfLastProduct = Math.min(indexOfFirstProduct + (apiMeta?.per_page ?? productsPerPage), apiMeta?.total ?? apiProducts.length);

  // Categories for filter bar — use API categories if available
  const filterCategories = apiCategories.length > 0
    ? apiCategories.map(c => ({
        name: c.name,
        slug: c.slug,
        products_count: c.products_count ?? 0,
      }))
    : getCategoriesFromProducts(apiProducts.length > 0 ? apiProducts : (allProducts as Product[])).map(name => {
        const count = (apiProducts.length > 0 ? apiProducts : (allProducts as Product[]))
          .filter(p => p.category === name).length;
        return {
          name,
          slug: name.toLowerCase().replace(/\s+/g, '-'),
          products_count: count,
        };
      });

  const priceRange = getPriceRangeFromProducts(apiProducts.length > 0 ? apiProducts : (allProducts as Product[]));

  // suppress unused warning — priceRange is available for future use
  void priceRange;

  return (
    <div className="min-h-screen bg-white">
      <div className="pt-4">
        <DynamicShopContent
          categories={filterCategories}
          filters={filters}
          setFilters={handleFilterChange}
          onCategorySelect={handleCategorySelect}
          filteredProducts={apiProducts}
          currentProducts={apiProducts}
          totalProductCount={apiMeta?.total ?? 0}
          currentPage={apiMeta?.current_page ?? currentPage}
          totalPages={totalPages}
          indexOfFirstProduct={indexOfFirstProduct}
          indexOfLastProduct={indexOfLastProduct}
          productsPerPage={productsPerPage}
          onPageChange={handlePageChange}
          initialSearchQuery={initialSearchQuery}
          allProducts={apiProducts.length > 0 ? apiProducts : (allProducts as Product[])}
          isLoading={isApiLoading}
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
