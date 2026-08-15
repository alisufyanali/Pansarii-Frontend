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

  // ── URL is the single source of truth for category and page ────────────────
  // Reading directly from searchParams (not from filters state) eliminates
  // the circular re-triggering between SearchFilterBar's internal category
  // state and this component's filter state.
  const categoryFromUrl = searchParams.get('category') || '';
  const pageFromUrl     = Number(searchParams.get('page')) || 1;
  const searchFromUrl   = searchParams.get('search') || '';

  // API state
  const [apiProducts, setApiProducts]   = useState<Product[]>([]);
  const [apiCategories, setApiCategories] = useState<{ id: number; name: string; slug: string; products_count?: number }[]>([]);
  const [apiMeta, setApiMeta]           = useState<{ current_page: number; last_page: number; total: number; per_page?: number } | null>(null);
  const [isApiLoading, setIsApiLoading] = useState(true);
  const [currentPage, setCurrentPage]   = useState(pageFromUrl);

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

  // Non-category filters live in local state — SearchFilterBar owns these.
  // Category is NOT stored here; it comes from the URL (categoryFromUrl above).
  const [filters, setFilters] = useState<FilterOptions>(() => ({
    searchQuery: searchFromUrl,
    minPrice: 0,
    maxPrice: 5000,
    categories: categoryFromUrl ? [categoryFromUrl] : [],
    sortBy: 'default',
    showOnSale: false,
    showInStock: true,
    showNewArrivals: false,
    showBestSellers: false,
  }));

  // Fetch categories once on mount
  useEffect(() => {
    import('@/lib/products').then(({ getCategoriesCached }) => {
      getCategoriesCached().then(cats => setApiCategories(cats));
    });
  }, []);

  // Resolve category ID from URL — single source of truth.
  // Matches by slug first (URL uses slugs), then by name.
  const selectedCategoryId = useMemo(() => {
    if (!categoryFromUrl) return undefined;
    return apiCategories.find(
      c => c.slug === categoryFromUrl || c.name === categoryFromUrl,
    )?.id;
  }, [categoryFromUrl, apiCategories]);

  // Re-sync currentPage from URL on Back/Forward navigation
  useEffect(() => {
    setCurrentPage(prev => prev !== pageFromUrl ? pageFromUrl : prev);
  }, [pageFromUrl]);

  // Fetch products — fully wrapped in try/catch/finally so isApiLoading
  // is ALWAYS reset regardless of success, abort, or dynamic import failure
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

    // Issue 5 fix: always send both bounds when either is non-default.
    // Previously, max_price was skipped when maxPrice === 5000, which meant
    // the "Above 2000" preset (min=2000, max=5000) sent only min_price and no
    // upper cap — causing the API to return products above 5000 too.
    // Now: send both params whenever the range differs from the absolute default
    // (minPrice>0 OR maxPrice<5000), keeping them undefined only when neither
    // slider has been moved at all.
    const priceActive = filters.minPrice > 0 || filters.maxPrice < 5000;
    const minPriceParam = priceActive ? filters.minPrice : undefined;
    const maxPriceParam = priceActive ? filters.maxPrice : undefined;

    let settled = false;

    import('@/lib/products')
      .then(({ getProducts }) =>
        getProducts({
          search:      filters.searchQuery || undefined,
          category_id: selectedCategoryId,
          min_price:   minPriceParam,
          max_price:   maxPriceParam,
          per_page:    productsPerPage,
          page:        currentPage,
          ...sortParams,
        }, { signal: controller.signal }),
      )
      .then(res => {
        if (controller.signal.aborted) return;
        setApiProducts(res.data.map(p => {
          const price = p.variants?.length ? Math.min(...p.variants.map(v => v.price)) : (p.sale_price ?? p.price);
          return {
            id: p.id,
            slug: p.slug,
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
      })
      .catch(err => {
        // Swallow AbortError silently — it's an intentional cleanup, not a failure.
        // All other errors (network, 4xx/5xx, import failure) clear the product list
        // so the UI shows "no results" rather than stale data.
        if (controller.signal.aborted) return;
        console.error('[shop] fetch failed:', err);
        setApiProducts([]);
        setApiMeta(null);
      })
      .finally(() => {
        // Always reset loading — this runs even if the dynamic import itself
        // throws (e.g. chunk load error), fixing the "stuck spinner" bug.
        if (!settled) {
          settled = true;
          setIsApiLoading(false);
        }
      });

    return () => {
      controller.abort();
      // If the promise chain hasn't settled yet (e.g. still awaiting import),
      // ensure loading is cleared so unmounting doesn't leave a stuck state.
      if (!settled) {
        settled = true;
        setIsApiLoading(false);
      }
    };
  }, [filters, currentPage, productsPerPage, selectedCategoryId]);

  // URL sync — write search/category/page back to URL so deep links and
  // Back/Forward work. Category comes from categoryFromUrl (already in URL);
  // we only need to sync search and page.
  useEffect(() => {
    const t = setTimeout(() => {
      const params = new URLSearchParams();
      if (filters.searchQuery.trim()) params.set('search', filters.searchQuery.trim());
      // Preserve whatever category is already in the URL — don't re-derive it
      // from filters.categories to avoid the circular update loop.
      if (categoryFromUrl) params.set('category', categoryFromUrl);
      if (currentPage > 1) params.set('page', String(currentPage));
      const newUrl = params.toString() ? `/shop?${params.toString()}` : '/shop';
      if (newUrl !== window.location.pathname + window.location.search) {
        router.push(newUrl, { scroll: false });
      }
    }, 300);
    return () => clearTimeout(t);
  }, [filters.searchQuery, categoryFromUrl, currentPage, router]);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
    // Push new page to URL immediately (don't wait for the debounced effect)
    const params = new URLSearchParams(searchParams.toString());
    if (page > 1) params.set('page', String(page));
    else params.delete('page');
    router.push(`/shop?${params.toString()}`, { scroll: false });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [router, searchParams]);

  const handleFilterChange = useCallback((newFilters: FilterOptions) => {
    setFilters(prev => {
      // SearchFilterBar owns: search, price, sort, sale/stock/new/bestseller flags.
      // Category is owned by the URL (categoryFromUrl) — never stored in filters.categories.
      // Discard whatever categories SearchFilterBar emits so it can never clobber the
      // active category tab.
      const merged: FilterOptions = { ...newFilters, categories: [] };

      const filtersChanged =
        prev.searchQuery !== merged.searchQuery ||
        prev.minPrice    !== merged.minPrice    ||
        prev.maxPrice    !== merged.maxPrice    ||
        prev.sortBy      !== merged.sortBy      ||
        prev.showOnSale  !== merged.showOnSale  ||
        prev.showInStock !== merged.showInStock ||
        prev.showNewArrivals  !== merged.showNewArrivals  ||
        prev.showBestSellers  !== merged.showBestSellers;

      if (filtersChanged) setCurrentPage(1);
      return merged;
    });
  }, []);

  // Category selection writes directly to the URL — the URL is the source of
  // truth; selectedCategoryId is derived from it. This removes the circular
  // dependency between SearchFilterBar's internal URL-watching effect and
  // this component's filters.categories state.
  const handleCategorySelect = useCallback((category: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete('page'); // reset to page 1 on category change
    if (category && category !== 'all') {
      params.set('category', category);
    } else {
      params.delete('category');
    }
    router.push(params.toString() ? `/shop?${params.toString()}` : '/shop', { scroll: false });
    setCurrentPage(1);
  }, [router, searchParams]);

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
  const indexOfLastProduct  = Math.min(indexOfFirstProduct + (apiMeta?.per_page ?? productsPerPage), apiMeta?.total ?? apiProducts.length);

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
  void priceRange; // available for future use

  // Build the filters object to pass down — include the active category from
  // the URL so CategoryTabs highlights the correct tab.
  const filtersWithCategory: FilterOptions = {
    ...filters,
    categories: categoryFromUrl ? [categoryFromUrl] : [],
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="pt-4">
        <DynamicShopContent
          categories={filterCategories}
          filters={filtersWithCategory}
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
          initialSearchQuery={searchFromUrl}
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
