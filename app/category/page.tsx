// app/category/page.tsx
'use client';

import Image from 'next/image';
import { Suspense, useState, useEffect, useCallback } from 'react';
import ProductCard from '@/components/Desktop/components/ProductCard';
import ProductDetailsModal from '@/components/Desktop/components/ProductDetailsModal';
import SearchFilterBar from '@/components/Desktop/components/SearchFilterBar';
import { FilterOptions } from '@/utils/filterProducts';
import { FaStar, FaCheckCircle, FaEye } from 'react-icons/fa';
import { useSearchParams, useRouter } from 'next/navigation';
import MobileProductCard from '@/components/Mobile/components/ProductCard';
import { getCategoriesCached, getProducts } from '@/lib/products';
import type { Product } from '@/types/product';
import { apiProductToLegacy } from '@/types/product';

const ALL_PRODUCTS_LABEL = 'All Products';

function mapApiProducts(data: Awaited<ReturnType<typeof getProducts>>['data']): Product[] {
  return data.map(p => ({
    ...apiProductToLegacy(p),
    inStock: p.variants?.some(v => v.stock > 0) ?? true,
  }));
}

// ─── Skeletons ────────────────────────────────────────────────────────────────
function GridSkeleton() {
  return (
    <>
      <div className="grid grid-cols-2 gap-3 sm:hidden">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-white rounded-xl border border-gray-100 animate-pulse">
            <div className="h-36 bg-gray-200 rounded-t-xl" />
            <div className="p-2.5 space-y-2">
              <div className="h-3 bg-gray-200 rounded w-3/4" />
              <div className="h-3 bg-gray-200 rounded w-1/2" />
            </div>
          </div>
        ))}
      </div>
      <div className="hidden sm:grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
        {[...Array(12)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg border border-gray-200 animate-pulse">
            <div className="aspect-square bg-gray-200 rounded-t-lg" />
            <div className="p-3 space-y-2">
              <div className="h-4 bg-gray-200 rounded w-3/4" />
              <div className="h-8 bg-gray-200 rounded mt-2" />
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export default function CategoryBrowsePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white"><GridSkeleton /></div>}>
      <CategoryBrowseContent />
    </Suspense>
  );
}

function CategoryBrowseContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const categoryParam = searchParams.get('cat');

  const [apiCategories, setApiCategories] = useState<{ id: number; name: string; slug: string }[]>([]);
  const [selectedCategory, setSelectedCategory] = useState(ALL_PRODUCTS_LABEL);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | undefined>(undefined);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [products, setProducts] = useState<Product[]>([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [productsPerPage, setProductsPerPage] = useState(20);

  const [filters, setFilters] = useState<FilterOptions>({
    searchQuery: '', minPrice: 0, maxPrice: 5000, categories: [],
    sortBy: 'default', showOnSale: false, showInStock: true,
    showNewArrivals: false, showBestSellers: false,
  });

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

  useEffect(() => {
    getCategoriesCached().then(cats => setApiCategories(cats));
  }, []);

  useEffect(() => {
    if (apiCategories.length === 0) return;
    if (categoryParam) {
      const match = apiCategories.find(
        c => c.slug === categoryParam || c.name.toLowerCase().replace(/\s+/g, '-') === categoryParam,
      );
      if (match) {
        setSelectedCategory(match.name);
        setSelectedCategoryId(match.id);
        return;
      }
    }
    setSelectedCategory(ALL_PRODUCTS_LABEL);
    setSelectedCategoryId(undefined);
  }, [categoryParam, apiCategories]);

  // Clamp currentPage when totalPages shrinks (e.g. filter reduces result set)
  useEffect(() => {
    if (totalPages > 0 && currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [totalPages, currentPage]);

  const fetchProducts = useCallback(async (signal?: AbortSignal) => {
    setIsLoading(true);

    const sortMap: Record<string, { sort_by?: string; sort_order?: 'asc' | 'desc' }> = {
      'price-low':  { sort_by: 'price', sort_order: 'asc'  },
      'price-high': { sort_by: 'price', sort_order: 'desc' },
      'rating':     { sort_by: 'rating', sort_order: 'desc' },
      'name':       { sort_by: 'name', sort_order: 'asc'   },
    };
    const sortParams = sortMap[filters.sortBy] || {};

    try {
      const res = await getProducts({
        search:      filters.searchQuery || undefined,
        category_id: selectedCategoryId,
        min_price:   filters.minPrice > 0 ? filters.minPrice : undefined,
        max_price:   filters.maxPrice < 5000 ? filters.maxPrice : undefined,
        per_page:    productsPerPage,
        page:        currentPage,
        ...sortParams,
      }, { signal });
      setProducts(mapApiProducts(res.data));
      setTotalProducts(res.meta.total);
      setTotalPages(res.meta.last_page);
    } catch {
      setProducts([]);
      setTotalProducts(0);
      setTotalPages(1);
    } finally {
      setIsLoading(false);
    }
  }, [filters, selectedCategoryId, currentPage, productsPerPage]);

  useEffect(() => {
    const controller = new AbortController();
    fetchProducts(controller.signal);
    return () => controller.abort();
  }, [fetchProducts]);

  const allCategories = [ALL_PRODUCTS_LABEL, ...apiCategories.map(c => c.name)];

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    setCurrentPage(1);
    if (category === ALL_PRODUCTS_LABEL) {
      setSelectedCategoryId(undefined);
      router.push('/category');
    } else {
      const cat = apiCategories.find(c => c.name === category);
      setSelectedCategoryId(cat?.id);
      const slug = cat?.slug ?? category.toLowerCase().replace(/\s+/g, '-');
      router.push(`/category?cat=${slug}`);
    }
  };

  const handleFilterChange = (newFilters: FilterOptions) => {
    setFilters(newFilters);
    setSearchQuery(newFilters.searchQuery || '');
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setSelectedCategory(ALL_PRODUCTS_LABEL);
    setSelectedCategoryId(undefined);
    router.push('/category');
    const reset: FilterOptions = {
      searchQuery: '', minPrice: 0, maxPrice: 5000, categories: [],
      sortBy: 'default', showOnSale: false, showInStock: true,
      showNewArrivals: false, showBestSellers: false,
    };
    setFilters(reset);
    setCurrentPage(1);
  };

  const from = totalProducts === 0 ? 0 : (currentPage - 1) * productsPerPage + 1;
  const to = Math.min(currentPage * productsPerPage, totalProducts);

  return (
    <div className="min-h-screen bg-gray-50">

      <div className="bg-white border-b border-gray-200">
        <div className="max-w-[1920px] mx-auto px-[4%] py-6 sm:py-10">
          <div>
            <h1 className="text-2xl sm:text-3xl 2xl:text-4xl font-bold text-gray-900 mb-1">Shop by Category</h1>
            <p className="text-sm sm:text-base text-gray-500">Browse our full collection of natural &amp; herbal products</p>
          </div>
        </div>
      </div>

      <div className="max-w-[1920px] mx-auto px-[4%] pt-6 sm:pt-8">
        <SearchFilterBar
          onFilterChange={handleFilterChange}
          onViewModeChange={setViewMode}
          productCount={totalProducts}
          categories={apiCategories.map(c => c.name)}
          initialSearchQuery={searchQuery}
        />
      </div>

      <div className="bg-white border-b border-gray-200 mt-4 sm:mt-6 sticky top-0 z-10 shadow-sm">
        <div className="max-w-[1920px] mx-auto px-[4%]">
          <div className="overflow-x-auto" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            <div className="flex space-x-2 py-3">
              {allCategories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => handleCategorySelect(cat)}
                  className={`flex-shrink-0 px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium rounded-full transition-all ${
                    selectedCategory === cat ? 'bg-[#197B33] text-white shadow-md' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1920px] mx-auto px-[4%] py-6 sm:py-8">
        <div className="mb-5 sm:mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-lg sm:text-xl 2xl:text-2xl font-bold text-gray-900">
              {selectedCategory === ALL_PRODUCTS_LABEL ? 'All Products' : selectedCategory}
            </h2>
            <p className="text-xs sm:text-sm text-gray-500">
              Showing {from}–{to} of {totalProducts} products
            </p>
          </div>
          {filters.sortBy !== 'default' && (
            <p className="text-xs sm:text-sm text-gray-600">Sorted by: <span className="font-medium">
              {filters.sortBy === 'price-low' && 'Price: Low to High'}
              {filters.sortBy === 'price-high' && 'Price: High to Low'}
              {filters.sortBy === 'rating' && 'Highest Rated'}
              {filters.sortBy === 'name' && 'Name (A-Z)'}
            </span></p>
          )}
        </div>

        {isLoading ? <GridSkeleton /> : products.length > 0 ? (
          viewMode === 'grid' ? (
            <>
              <div className="grid grid-cols-2 gap-3 sm:hidden">
                {products.map((product) => (
                  <MobileProductCard key={product.id} product={product} />
                ))}
              </div>
              <div className="hidden sm:grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
                {products.map((product) => (
                  <div key={product.id} className="w-full">
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="space-y-3 sm:space-y-4">
              {products.map((product) => (
                <div key={product.id} className="bg-white rounded-lg border border-gray-200 hover:shadow-lg transition-shadow p-3 sm:p-4 lg:p-6">
                  <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                    <div className="w-full sm:w-48 h-40 sm:h-48 flex-shrink-0 relative rounded-lg overflow-hidden">
                      <Image src={product.img} alt={product.nameEn} fill className="object-cover" sizes="192px" />
                      {product.sale && <div className="absolute top-2 left-2 px-2 py-0.5 bg-red-500 text-white text-xs font-bold rounded-full">{product.sale}</div>}
                    </div>
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-1">{product.nameEn}</h3>
                        <p className="text-sm text-gray-500 mb-2">{product.nameUr}</p>
                        {product.description && <p className="text-xs sm:text-sm text-green-700 mb-3 line-clamp-2">{product.description}</p>}
                        <div className="flex items-center gap-3 mb-3">
                          <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded">
                            <FaStar className="w-3.5 h-3.5 text-yellow-400" />
                            <span className="font-semibold text-sm">{product.rating || 4.5}</span>
                          </div>
                          <div className="flex items-center gap-1 text-green-600">
                            <FaCheckCircle className="w-3.5 h-3.5" />
                            <span className="text-xs sm:text-sm">{product.reviews || 0} Reviews</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-gray-100">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xl sm:text-2xl font-bold text-gray-900">PKR {product.price.toLocaleString()}</span>
                          {product.oldPrice && <span className="text-sm text-gray-400 line-through">PKR {product.oldPrice.toLocaleString()}</span>}
                        </div>
                        <button
                          className="px-6 py-2.5 bg-[#197B33] text-white rounded-lg hover:bg-[#156529] transition font-semibold flex items-center justify-center gap-2 text-sm w-full sm:w-auto"
                          onClick={() => { setSelectedProduct(product); setIsModalOpen(true); }}
                        >
                          <FaEye className="w-4 h-4" /> Quick View
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )
        ) : (
          <div className="text-center py-16">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-500 mb-6">{filters.searchQuery ? `No results for "${filters.searchQuery}"` : 'Try a different category'}</p>
            <button onClick={clearFilters} className="px-6 py-3 bg-[#197B33] text-white rounded-lg hover:bg-[#156529] transition font-medium">View All Products</button>
          </div>
        )}

        {!isLoading && totalPages > 1 && (
          <div className="mt-8 sm:mt-10 flex items-center justify-center gap-2">
            <button
              onClick={() => { setCurrentPage(p => Math.max(1, p - 1)); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              disabled={currentPage === 1}
              className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-300 disabled:opacity-40 hover:bg-gray-50 text-lg"
            >‹</button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => { setCurrentPage(page); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                className={`w-10 h-10 flex items-center justify-center rounded-lg border text-sm font-medium ${currentPage === page ? 'bg-[#197B33] text-white border-[#197B33]' : 'border-gray-300 hover:bg-gray-50'}`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => { setCurrentPage(p => Math.min(totalPages, p + 1)); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              disabled={currentPage === totalPages}
              className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-300 disabled:opacity-40 hover:bg-gray-50 text-lg"
            >›</button>
          </div>
        )}
      </div>

      {isModalOpen && selectedProduct && (
        <ProductDetailsModal product={selectedProduct} onClose={() => { setIsModalOpen(false); setSelectedProduct(null); }} />
      )}

      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}
