"use client";

import { useCallback, useEffect, useState, type ChangeEvent, type FormEvent } from 'react';
import Link from 'next/link';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import DesktopProductCard from '@/components/Desktop/components/ProductCard';
import MobileProductCard from '@/components/Mobile/components/ProductCard';
import { api, getApiErrorMessage } from '@/lib/axios';
import { useDeviceDetection } from '@/hooks/useDeviceDetection';
import { isValidEmail } from '@/lib/validation';
import { getProducts, getCategoriesCached } from '@/lib/products';
import { apiProductToLegacy, type ApiCategory, type Product } from '@/types/product';
import {
  FaTruck,
  FaMapMarkerAlt,
  FaLeaf,
  FaStar,
  FaRocket,
  FaFlask
} from "react-icons/fa";

const PRODUCTS_PER_PAGE = 20;

const sortOptions = [
  { value: 'newest', label: 'Newest First' },
  { value: 'price-low-high', label: 'Price: Low to High' },
  { value: 'price-high-low', label: 'Price: High to Low' },
  { value: 'popular', label: 'Most Popular' }
];

function ProductGridSkeleton({ isMobile }: { isMobile: boolean }) {
  return (
    <div className={`grid gap-4 sm:gap-6 ${isMobile ? 'grid-cols-2' : 'grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'}`}>
      {Array.from({ length: 8 }).map((_, index) => (
        <div key={index} className="animate-pulse rounded-xl border border-gray-200 bg-white p-3">
          <div className="h-36 rounded-lg bg-gray-200" />
          <div className="mt-3 space-y-2">
            <div className="h-4 w-3/4 rounded bg-gray-200" />
            <div className="h-3 w-1/2 rounded bg-gray-100" />
            <div className="h-3 w-full rounded bg-gray-100" />
            <div className="h-8 rounded-full bg-gray-200" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function NewArrivalsPage() {
  const { isMobile } = useDeviceDetection();
  const [selectedCategory, setSelectedCategory] = useState('All Products');
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | undefined>(undefined);
  const [sortBy, setSortBy] = useState('newest');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [products, setProducts] = useState<Product[]>([]);
  const [apiCategories, setApiCategories] = useState<ApiCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [isNewsletterSubmitting, setIsNewsletterSubmitting] = useState(false);

  useEffect(() => {
    getCategoriesCached()
      .then((cats) => setApiCategories(cats))
      .catch(() => setApiCategories([]));
  }, []);

  const fetchProducts = useCallback(async (nextPage: number, signal?: AbortSignal) => {
    if (nextPage === 1) {
      setIsLoading(true);
    } else {
      setIsLoadingMore(true);
    }

    const sortMap: Record<string, { sort_by?: string; sort_order?: 'asc' | 'desc' }> = {
      newest: { sort_by: 'created_at', sort_order: 'desc' },
      'price-low-high': { sort_by: 'price', sort_order: 'asc' },
      'price-high-low': { sort_by: 'price', sort_order: 'desc' },
      popular: { sort_by: 'rating', sort_order: 'desc' },
    };

    try {
      const res = await getProducts({
        category_id: selectedCategoryId,
        per_page: PRODUCTS_PER_PAGE,
        page: nextPage,
        ...(sortMap[sortBy] || sortMap.newest),
      }, { signal });

      const mappedProducts = res.data.map(apiProductToLegacy);
      setProducts((prev) => (nextPage === 1 ? mappedProducts : [...prev, ...mappedProducts]));
      setTotalProducts(res.meta.total);
      setHasMore(res.meta.current_page < res.meta.last_page);
    } catch {
      if (nextPage === 1) {
        setProducts([]);
      }
      setTotalProducts(0);
      setHasMore(false);
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  }, [selectedCategoryId, sortBy]);

  useEffect(() => {
    const controller = new AbortController();
    void fetchProducts(page, controller.signal);
    return () => controller.abort();
  }, [fetchProducts, page]);

  const bestSellingProducts = products.filter((product) => product.isBestSeller).slice(0, 6);

  const handleCategoryFilter = (category: string) => {
    setSelectedCategory(category);
    if (category === 'All Products') {
      setSelectedCategoryId(undefined);
    } else {
      const match = apiCategories.find((item) => item.name === category);
      setSelectedCategoryId(match?.id);
    }
    setPage(1);
  };

  const handleSortChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setSortBy(e.target.value);
    setPage(1);
  };

  const toggleViewMode = (mode: 'grid' | 'list') => {
    setViewMode(mode);
  };

  const categoryButtons = [
    { name: 'All Products', count: totalProducts || apiCategories.reduce((sum, item) => sum + (item.products_count || 0), 0), categoryId: undefined },
    ...apiCategories.map((category) => ({
      name: category.name,
      count: category.products_count || 0,
      categoryId: category.id,
    })),
  ];

  const stats = {
    totalNewProducts: totalProducts || products.length,
    bestSellersCount: products.filter((product) => product.isBestSeller).length,
    averageRating: products.length > 0
      ? Number((products.reduce((acc, product) => acc + (product.rating || 0), 0) / products.length).toFixed(1))
      : 0,
    onSaleCount: products.filter((product) => Boolean(product.sale)).length,
  };

  const handleNewsletterSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const email = ((formData.get('email') as string) || '').trim();

    if (!email) {
      toast.error('Email is required.');
      return;
    }
    if (!isValidEmail(email)) {
      toast.error('Please enter a valid email address.');
      return;
    }

    setIsNewsletterSubmitting(true);
    try {
      const res = await api.post<{ success: boolean; message: string }>('/newsletter/subscribe', { email });
      toast.success(res.message || 'Thank you for subscribing to our newsletter!');
      (e.target as HTMLFormElement).reset();
    } catch (err) {
      toast.error(getApiErrorMessage(err) || 'Subscription failed. Please try again.');
    } finally {
      setIsNewsletterSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <section className="relative bg-gradient-to-r from-green-800 to-emerald-800 text-white">
        <div className="relative mx-[4%] py-8 sm:py-12 md:py-16">
          <div className="text-center max-w-3xl mx-auto px-4">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              New Arrivals
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-green-100 mb-6">
              Discover our latest collection of 100% Ayurvedic & Herbal products
            </p>
            <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
              <span className="px-3 sm:px-4 py-1.5 bg-white/20 rounded-full text-xs sm:text-sm font-medium flex items-center gap-2">
                <FaRocket className="text-sm" />
                Just Launched
              </span>

              <span className="px-3 sm:px-4 py-1.5 bg-white/20 rounded-full text-xs sm:text-sm font-medium flex items-center gap-2">
                <FaStar className="text-sm" />
                Premium Quality
              </span>

              <span className="px-3 sm:px-4 py-1.5 bg-white/20 rounded-full text-xs sm:text-sm font-medium flex items-center gap-2">
                <FaTruck className="text-sm" />
                Free Shipping
              </span>
            </div>
          </div>
        </div>
      </section>

      <main className="mx-[4%] py-6 sm:py-8 md:py-12">
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4 sm:mb-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                Latest Products
              </h2>
              <p className="text-sm sm:text-base text-gray-700 mt-1">
                Freshly added to our herbal collection
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative flex-1 sm:flex-none">
                <select
                  value={sortBy}
                  onChange={handleSortChange}
                  className="appearance-none bg-white border border-gray-300 rounded-lg px-3 sm:px-4 py-2 sm:py-2.5 pr-8 sm:pr-10 text-gray-800 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600 w-full"
                >
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value} className="text-gray-800">
                      {isMobile ? option.label : `Sort by: ${option.label}`}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2">
                  <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-2 mb-6 sm:mb-8 overflow-x-auto pb-2 scrollbar-hide">
            {categoryButtons.map((category) => (
              <button
                key={category.name}
                onClick={() => handleCategoryFilter(category.name)}
                className={`px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg text-xs sm:text-sm font-medium transition whitespace-nowrap flex-shrink-0 ${selectedCategory === category.name
                  ? 'bg-green-700 text-white shadow-sm'
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200 border border-gray-200'
                  }`}
              >
                {category.name} ({category.count})
              </button>
            ))}
          </div>
        </div>

        {isLoading ? (
          <ProductGridSkeleton isMobile={isMobile} />
        ) : products.length > 0 ? (
          <>
            <section className="mb-8 sm:mb-12">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 gap-3">
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900">
                    {selectedCategory === 'All Products' ? 'All New Arrivals' : selectedCategory}
                  </h3>
                  <p className="text-gray-600 text-xs sm:text-sm mt-1">
                    Showing {products.length} of {totalProducts} products
                  </p>
                </div>

                {!isMobile && (
                  <div className="flex items-center gap-4">
                    <span className="text-gray-700 text-sm font-medium">View:</span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => toggleViewMode('list')}
                        className={`p-2.5 rounded-lg ${viewMode === 'list'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                      </button>
                      <button
                        onClick={() => toggleViewMode('grid')}
                        className={`p-2.5 rounded-lg ${viewMode === 'grid'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 01-2 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <div className={`grid gap-4 sm:gap-6 ${viewMode === 'grid' ? 'grid-cols-2 lg:grid-cols-4 xl:grid-cols-5' : 'grid-cols-1'}`}>
                {products.map((product) => (
                  <div key={product.id} className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                    {isMobile ? <MobileProductCard product={product} /> : <DesktopProductCard product={product} />}
                  </div>
                ))}
              </div>

              {hasMore && (
                <div className="mt-6 flex justify-center">
                  <button
                    onClick={() => setPage((currentPage) => currentPage + 1)}
                    disabled={isLoadingMore}
                    className="rounded-full bg-green-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {isLoadingMore ? 'Loading...' : 'Load More'}
                  </button>
                </div>
              )}
            </section>


          </>
        ) : (
          <div className="text-center py-16">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 sm:w-8 sm:h-8 text-green-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h4 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">No new arrivals right now</h4>
            <p className="text-sm sm:text-base text-gray-600">Try selecting a different category or check back soon.</p>
          </div>
        )}

        <section className="mb-8 sm:mb-12 bg-gray-50 rounded-xl p-4 sm:p-6 md:p-8 border border-gray-200">
          <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6 sm:mb-8 text-center">
            Why Choose Our New Arrivals?
          </h3>

          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
            {[
              {
                title: "100% Pure & Natural",
                description: "No chemicals, no preservatives",
                icon: FaLeaf,
                color: "text-green-700",
              },
              {
                title: "Lab Tested",
                description: "Quality certified products",
                icon: FaFlask,
                color: "text-blue-700",
              },
              {
                title: "Made in Pakistan",
                description: "Supporting local farmers",
                icon: FaMapMarkerAlt,
                color: "text-purple-700",
              },
              {
                title: "Fast Delivery",
                description: "Free shipping over PKR 5,000",
                icon: FaTruck,
                color: "text-emerald-700",
              },
            ].map((benefit, index) => {
              const Icon = benefit.icon;

              return (
                <div
                  key={index}
                  className="bg-white p-3 sm:p-4 md:p-5 rounded-lg border border-gray-200 shadow-sm text-center"
                >
                  <div className="flex justify-center mb-3">
                    <Icon className={`text-3xl ${benefit.color}`} />
                  </div>

                  <h4 className="font-bold text-gray-900 mb-1 sm:mb-2 text-xs sm:text-sm md:text-base">
                    {benefit.title}
                  </h4>

                  <p className="text-gray-700 text-xs sm:text-sm">
                    {benefit.description}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        <section className="bg-gradient-to-r from-green-800 to-emerald-800 rounded-xl p-6 sm:p-8 text-center">
          <h3 className="text-xl sm:text-2xl font-bold text-white mb-2 sm:mb-3">
            Get Notified About New Arrivals
          </h3>
          <p className="text-sm sm:text-base text-green-100 mb-4 sm:mb-6 max-w-2xl mx-auto px-4">
            Be the first to know about our latest herbal products and exclusive offers
          </p>
          <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto px-4">
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              required
              disabled={isNewsletterSubmitting}
              className="flex-1 px-4 py-2.5 sm:py-3 text-sm sm:text-base rounded-lg text-gray-900 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-75"
            />
            <button
              type="submit"
              disabled={isNewsletterSubmitting}
              className="px-4 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base bg-white text-green-800 font-semibold rounded-lg hover:bg-gray-100 transition shadow whitespace-nowrap disabled:opacity-75 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isNewsletterSubmitting ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-green-800" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Subscribing...
                </>
              ) : 'Subscribe'}
            </button>
          </form>
          <p className="text-green-200 text-xs sm:text-sm mt-3 sm:mt-4">
            We respect your privacy. No spam ever.
          </p>
        </section>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mt-6 sm:mt-8">
          <div className="bg-green-50 p-3 sm:p-4 rounded-lg text-center">
            <div className="text-xl sm:text-2xl font-bold text-green-800">{stats.totalNewProducts}</div>
            <div className="text-xs sm:text-sm text-gray-700">New Products</div>
          </div>
          <div className="bg-emerald-50 p-3 sm:p-4 rounded-lg text-center">
            <div className="text-xl sm:text-2xl font-bold text-emerald-800">{stats.bestSellersCount}</div>
            <div className="text-xs sm:text-sm text-gray-700">Best Sellers</div>
          </div>
          <div className="bg-blue-50 p-3 sm:p-4 rounded-lg text-center">
            <div className="text-xl sm:text-2xl font-bold text-blue-800">{stats.averageRating}</div>
            <div className="text-xs sm:text-sm text-gray-700">Avg Rating</div>
          </div>
          <div className="bg-amber-50 p-3 sm:p-4 rounded-lg text-center">
            <div className="text-xl sm:text-2xl font-bold text-amber-800">20%</div>
            <div className="text-xs sm:text-sm text-gray-700">Launch Discount</div>
          </div>
        </div>
      </main>

      <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
      <ToastContainer position="top-right" autoClose={3000} theme="light" />
    </div>
  );
}
