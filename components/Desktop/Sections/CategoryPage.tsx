'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { allProducts } from '@/data/products';
import type { Product, ApiCategory } from '@/types/product';
import { apiProductToLegacy } from '@/types/product';
import { getProducts, getCategoriesCached } from '@/lib/products';
import ProductCard from '@/components/Desktop/components/ProductCard';
import ProductDetailsModal from '@/components/Desktop/components/ProductDetailsModal';
import SearchFilterBar from '@/components/Desktop/components/SearchFilterBar';
import Pagination from '@/components/Desktop/Sections/shop/Pagination';
import MobileProductCard from '@/components/Mobile/components/ProductCard';
import { FilterOptions } from '@/utils/filterProducts';
import {
  FaStar, FaCheckCircle, FaEye,
  FaLeaf, FaPills, FaMortarPestle, FaSeedling, FaFlask, FaAppleAlt,
} from 'react-icons/fa';

// ─── Per-category config ──────────────────────────────────────────────────────

interface CategoryConfig {
  /** Display name shown in headings and breadcrumb */
  label: string;
  /** Short description shown under the heading */
  subtitle: string;
  /** Tag line shown next to product count */
  tags: string;
  /** Emoji or text shown in the empty-state */
  emptyEmoji: string;
  /** Tailwind gradient classes for the hero banner */
  heroBg: string;
  /** Tailwind border class for the hero banner */
  heroBorder: string;
  /** Tailwind bg class for the icon container */
  iconBg: string;
  /** Tailwind text-color class for the icon */
  iconColor: string;
  /** Tailwind bg class for the product-count badge */
  badgeBg: string;
  /** Tailwind text-color class for the product-count badge */
  badgeText: string;
  /** Tailwind text-color class for the description in list view */
  descColor: string;
  /** Tailwind text-color class for the review count in list view */
  reviewColor: string;
  /** Tailwind bg class for the save-badge in list view */
  saveBadgeBg: string;
  /** Tailwind text-color class for the save-badge in list view */
  saveBadgeText: string;
  /** Tailwind bg + hover classes for the Quick View button */
  btnClass: string;
  /** Tailwind bg + hover classes for the Clear Filters button */
  clearBtnClass: string;
  /** Tailwind bg + border classes for the active pagination button */
  paginationActive: string;
  /** Tailwind hover class for the breadcrumb link */
  breadcrumbHover: string;
  /** Tailwind text-color class for the breadcrumb current item */
  breadcrumbCurrent: string;
  /** Icon component */
  Icon: React.ComponentType<{ className?: string }>;
}

const CATEGORY_CONFIG: Record<string, CategoryConfig> = {
  Herb: {
    label: 'Herbs',
    subtitle: 'Natural herbs and botanical products for wellness',
    tags: 'Traditional • Natural • Organic',
    emptyEmoji: '🌿',
    heroBg: 'bg-gradient-to-r from-green-50 to-emerald-50',
    heroBorder: 'border-green-100',
    iconBg: 'bg-green-100',
    iconColor: 'text-green-600',
    badgeBg: 'bg-green-100',
    badgeText: 'text-green-700',
    descColor: 'text-green-700',
    reviewColor: 'text-green-600',
    saveBadgeBg: 'bg-green-100',
    saveBadgeText: 'text-green-700',
    btnClass: 'bg-[#197B33] hover:bg-[#156529]',
    clearBtnClass: 'bg-[#197B33] hover:bg-[#156529]',
    paginationActive: 'bg-[#197B33] text-white border-[#197B33]',
    breadcrumbHover: 'hover:text-green-600',
    breadcrumbCurrent: 'text-green-700',
    Icon: FaLeaf,
  },
  Dawakhana: {
    label: 'Dawakhana',
    subtitle: 'Traditional herbal remedies and medicines',
    tags: 'Unani • Traditional • Herbal',
    emptyEmoji: '⚕️',
    heroBg: 'bg-gradient-to-r from-amber-50 to-yellow-50',
    heroBorder: 'border-amber-100',
    iconBg: 'bg-amber-100',
    iconColor: 'text-amber-700',
    badgeBg: 'bg-amber-100',
    badgeText: 'text-amber-700',
    descColor: 'text-amber-700',
    reviewColor: 'text-amber-700',
    saveBadgeBg: 'bg-amber-100',
    saveBadgeText: 'text-amber-700',
    btnClass: 'bg-amber-700 hover:bg-amber-800',
    clearBtnClass: 'bg-amber-700 hover:bg-amber-800',
    paginationActive: 'bg-amber-700 text-white border-amber-700',
    breadcrumbHover: 'hover:text-amber-700',
    breadcrumbCurrent: 'text-amber-700',
    Icon: FaMortarPestle,
  },
  Murrabajat: {
    label: 'Murrabajat',
    subtitle: 'Traditional preserved fruit and herbal confections',
    tags: 'Preserved • Traditional • Sweet',
    emptyEmoji: '🍯',
    heroBg: 'bg-gradient-to-r from-orange-50 to-amber-50',
    heroBorder: 'border-orange-100',
    iconBg: 'bg-orange-100',
    iconColor: 'text-orange-600',
    badgeBg: 'bg-orange-100',
    badgeText: 'text-orange-700',
    descColor: 'text-orange-700',
    reviewColor: 'text-orange-600',
    saveBadgeBg: 'bg-orange-100',
    saveBadgeText: 'text-orange-700',
    btnClass: 'bg-orange-600 hover:bg-orange-700',
    clearBtnClass: 'bg-orange-600 hover:bg-orange-700',
    paginationActive: 'bg-orange-600 text-white border-orange-600',
    breadcrumbHover: 'hover:text-orange-600',
    breadcrumbCurrent: 'text-orange-700',
    Icon: FaAppleAlt,
  },
  Remedies: {
    label: 'Remedies',
    subtitle: 'Natural herbal remedies for everyday health',
    tags: 'Natural • Effective • Trusted',
    emptyEmoji: '🌱',
    heroBg: 'bg-gradient-to-r from-teal-50 to-cyan-50',
    heroBorder: 'border-teal-100',
    iconBg: 'bg-teal-100',
    iconColor: 'text-teal-600',
    badgeBg: 'bg-teal-100',
    badgeText: 'text-teal-700',
    descColor: 'text-teal-700',
    reviewColor: 'text-teal-600',
    saveBadgeBg: 'bg-teal-100',
    saveBadgeText: 'text-teal-700',
    btnClass: 'bg-teal-600 hover:bg-teal-700',
    clearBtnClass: 'bg-teal-600 hover:bg-teal-700',
    paginationActive: 'bg-teal-600 text-white border-teal-600',
    breadcrumbHover: 'hover:text-teal-600',
    breadcrumbCurrent: 'text-teal-700',
    Icon: FaSeedling,
  },
  Supplements: {
    label: 'Supplements',
    subtitle: 'Health and nutritional supplements',
    tags: 'Vitamins • Minerals • Protein',
    emptyEmoji: '💊',
    heroBg: 'bg-gradient-to-r from-blue-50 to-indigo-50',
    heroBorder: 'border-blue-100',
    iconBg: 'bg-blue-100',
    iconColor: 'text-blue-600',
    badgeBg: 'bg-blue-100',
    badgeText: 'text-blue-700',
    descColor: 'text-blue-700',
    reviewColor: 'text-blue-600',
    saveBadgeBg: 'bg-blue-100',
    saveBadgeText: 'text-blue-700',
    btnClass: 'bg-blue-600 hover:bg-blue-700',
    clearBtnClass: 'bg-blue-600 hover:bg-blue-700',
    paginationActive: 'bg-blue-600 text-white border-blue-600',
    breadcrumbHover: 'hover:text-blue-600',
    breadcrumbCurrent: 'text-blue-700',
    Icon: FaPills,
  },
  Arqiyaat: {
    label: 'Arqiyaat',
    subtitle: 'Distilled herbal extracts and floral waters',
    tags: 'Distilled • Pure • Aromatic',
    emptyEmoji: '🧪',
    heroBg: 'bg-gradient-to-r from-purple-50 to-violet-50',
    heroBorder: 'border-purple-100',
    iconBg: 'bg-purple-100',
    iconColor: 'text-purple-600',
    badgeBg: 'bg-purple-100',
    badgeText: 'text-purple-700',
    descColor: 'text-purple-700',
    reviewColor: 'text-purple-600',
    saveBadgeBg: 'bg-purple-100',
    saveBadgeText: 'text-purple-700',
    btnClass: 'bg-purple-600 hover:bg-purple-700',
    clearBtnClass: 'bg-purple-600 hover:bg-purple-700',
    paginationActive: 'bg-purple-600 text-white border-purple-600',
    breadcrumbHover: 'hover:text-purple-600',
    breadcrumbCurrent: 'text-purple-700',
    Icon: FaFlask,
  },
  Spices: {
    label: 'Spices',
    subtitle: 'Premium quality spices and seasonings for your kitchen',
    tags: 'Aromatic • Fresh • Natural',
    emptyEmoji: '🌶️',
    heroBg: 'bg-gradient-to-r from-red-50 to-orange-50',
    heroBorder: 'border-red-100',
    iconBg: 'bg-red-100',
    iconColor: 'text-red-600',
    badgeBg: 'bg-red-100',
    badgeText: 'text-red-700',
    descColor: 'text-red-700',
    reviewColor: 'text-red-600',
    saveBadgeBg: 'bg-red-100',
    saveBadgeText: 'text-red-700',
    btnClass: 'bg-red-600 hover:bg-red-700',
    clearBtnClass: 'bg-red-600 hover:bg-red-700',
    paginationActive: 'bg-red-600 text-white border-red-600',
    breadcrumbHover: 'hover:text-red-600',
    breadcrumbCurrent: 'text-red-700',
    Icon: FaLeaf,
  },
  'Beauty Corner': {
    label: 'Beauty Corner',
    subtitle: 'Natural beauty and skincare products',
    tags: 'Skincare • Makeup • Natural',
    emptyEmoji: '💄',
    heroBg: 'bg-gradient-to-r from-pink-50 to-rose-50',
    heroBorder: 'border-pink-100',
    iconBg: 'bg-pink-100',
    iconColor: 'text-pink-600',
    badgeBg: 'bg-pink-100',
    badgeText: 'text-pink-700',
    descColor: 'text-pink-700',
    reviewColor: 'text-pink-600',
    saveBadgeBg: 'bg-pink-100',
    saveBadgeText: 'text-pink-700',
    btnClass: 'bg-pink-600 hover:bg-pink-700',
    clearBtnClass: 'bg-pink-600 hover:bg-pink-700',
    paginationActive: 'bg-pink-600 text-white border-pink-600',
    breadcrumbHover: 'hover:text-pink-600',
    breadcrumbCurrent: 'text-pink-700',
    Icon: FaLeaf,
  },
};

// ─── Skeleton ─────────────────────────────────────────────────────────────────

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
              <div className="flex justify-between items-center">
                <div className="h-4 bg-gray-200 rounded w-16" />
                <div className="w-7 h-7 bg-gray-200 rounded-full" />
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="hidden sm:grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-4 gap-4 lg:gap-6 2xl:gap-8">
        {[...Array(12)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg border border-gray-200 animate-pulse">
            <div className="aspect-square bg-gray-200 rounded-t-lg" />
            <div className="p-3 space-y-2">
              <div className="h-4 bg-gray-200 rounded w-3/4" />
              <div className="h-3 bg-gray-200 rounded w-1/2" />
              <div className="h-8 bg-gray-200 rounded mt-2" />
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

// ─── Props ────────────────────────────────────────────────────────────────────

interface CategoryPageProps {
  /** Must match a key in CATEGORY_CONFIG and a category value in allProducts */
  categoryName: string;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function CategoryPage({ categoryName }: CategoryPageProps) {
  const router = useRouter();

  const config = CATEGORY_CONFIG[categoryName] ?? {
    label: categoryName,
    subtitle: '',
    tags: '',
    emptyEmoji: '📦',
    heroBg: 'bg-gradient-to-r from-gray-50 to-gray-100',
    heroBorder: 'border-gray-200',
    iconBg: 'bg-gray-100',
    iconColor: 'text-gray-600',
    badgeBg: 'bg-gray-100',
    badgeText: 'text-gray-700',
    descColor: 'text-gray-700',
    reviewColor: 'text-gray-600',
    saveBadgeBg: 'bg-gray-100',
    saveBadgeText: 'text-gray-700',
    btnClass: 'bg-green-700 hover:bg-green-600',
    clearBtnClass: 'bg-green-700 hover:bg-green-600',
    paginationActive: 'bg-green-700 text-white border-green-700',
    breadcrumbHover: 'hover:text-green-600',
    breadcrumbCurrent: 'text-green-700',
    Icon: FaLeaf,
  };

  const { Icon } = config;

  // ── Server-side state ─────────────────────────────────────────────────────
  // All products from the API for the current page — never the full set.
  const [pageProducts, setPageProducts] = useState<Product[]>([]);
  // API meta — drives totalPages and productCount display
  const [apiTotal,     setApiTotal]     = useState(0);
  const [apiLastPage,  setApiLastPage]  = useState(1);
  // productCount shown in the hero badge — uses API total when available
  const productCount = apiTotal > 0
    ? apiTotal
    : (allProducts.filter(p => p.category === categoryName) as Product[]).length;

  const [searchQuery,      setSearchQuery]      = useState('');
  const [viewMode,         setViewMode]         = useState<'grid' | 'list'>('grid');
  const [selectedProduct,  setSelectedProduct]  = useState<Product | null>(null);
  const [isModalOpen,      setIsModalOpen]      = useState(false);
  const [isLoading,        setIsLoading]        = useState(true);
  const [currentPage,      setCurrentPage]      = useState(1);
  const [productsPerPage,  setProductsPerPage]  = useState(20);
  const [categoryId,       setCategoryId]       = useState<number | null>(null);

  const [filters, setFilters] = useState<FilterOptions>({
    searchQuery: '', minPrice: 0, maxPrice: 5000, categories: [],
    sortBy: 'default', showOnSale: false, showInStock: true,
    showNewArrivals: false, showBestSellers: false,
  });

  // Responsive products-per-page — reset to page 1 when it changes
  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      if      (w >= 2560) setProductsPerPage(25);
      else if (w >= 1280) setProductsPerPage(20);
      else if (w >= 768)  setProductsPerPage(12);
      else                setProductsPerPage(10);
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  // Fetch category ID from API once
  useEffect(() => {
    getCategoriesCached().then(cats => {
      const found = cats.find(c =>
        c.name === categoryName ||
        c.slug === categoryName.toLowerCase().replace(/\s+/g, '-')
      );
      if (found) setCategoryId(found.id);
      else setCategoryId(0); // no match — static fallback
    }).catch(() => setCategoryId(0));
  }, [categoryName]);

  // Fetch the current page from the API whenever categoryId, page, or per_page changes.
  // Adding currentPage and productsPerPage to deps ensures clicking a pagination
  // button (which calls setCurrentPage) actually triggers a new API request.
  useEffect(() => {
    if (categoryId === null) return; // not resolved yet

    if (categoryId === 0) {
      // Static fallback — paginate locally
      const all = allProducts.filter(p => p.category === categoryName) as Product[];
      setApiTotal(all.length);
      setApiLastPage(Math.ceil(all.length / productsPerPage) || 1);
      setPageProducts(all.slice((currentPage - 1) * productsPerPage, currentPage * productsPerPage));
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    const sortMap: Record<string, { sort_by?: string; sort_order?: 'asc' | 'desc' }> = {
      'price-low':  { sort_by: 'price', sort_order: 'asc'  },
      'price-high': { sort_by: 'price', sort_order: 'desc' },
      'rating':     { sort_by: 'rating', sort_order: 'desc' },
      'name':       { sort_by: 'name',  sort_order: 'asc'  },
    };
    const sortParams = sortMap[filters.sortBy] || {};
    const priceActive = filters.minPrice > 0 || filters.maxPrice < 5000;

    getProducts({
      category_id: categoryId,
      search:    filters.searchQuery || undefined,
      min_price: priceActive ? filters.minPrice : undefined,
      max_price: priceActive ? filters.maxPrice : undefined,
      per_page:  productsPerPage,
      page:      currentPage,
      ...sortParams,
    }).then(res => {
      // Store API meta so totalPages is derived from res.meta.last_page,
      // not from the length of the current page's product array.
      setApiTotal(res.meta.total);
      setApiLastPage(res.meta.last_page);

      const products: Product[] = res.data.map(p => {
        const price = p.variants?.length
          ? Math.min(...p.variants.map(v => v.price))
          : (p.sale_price ?? p.price);
        return {
          id:          p.id,
          slug:        p.slug,
          img:         p.thumbnail || '/images/product.png',
          nameEn:      p.name,
          nameUr:      p.name,
          description: p.description || '',
          rating:      p.rating || 4.5,
          reviews:     p.reviews_count || 0,
          price,
          oldPrice:    p.sale_price && p.price > p.sale_price ? p.price : null,
          sale:        p.sale_price
            ? `${Math.round(((p.price - p.sale_price) / p.price) * 100)}% OFF`
            : null,
          category: p.category?.name,
          inStock:  p.variants?.some(v => v.stock > 0) ?? true,
          variants: p.variants,
          sizes:    p.variants?.length ? p.variants.map(v => v.name) : undefined,
        };
      });

      setPageProducts(
        products.length > 0
          ? products
          : (allProducts.filter(p => p.category === categoryName) as Product[])
      );
    }).catch(() => {
      setPageProducts(allProducts.filter(p => p.category === categoryName) as Product[]);
    }).finally(() => setIsLoading(false));
  }, [categoryId, categoryName, currentPage, productsPerPage, filters]);

  const handleFilterChange = (newFilters: FilterOptions) => {
    setFilters(newFilters);
    setSearchQuery(newFilters.searchQuery || '');
    setCurrentPage(1); // reset to page 1 whenever filters change
  };

  const clearFilters = () => {
    const reset: FilterOptions = {
      searchQuery: '', minPrice: 0, maxPrice: 5000, categories: [],
      sortBy: 'default', showOnSale: false, showInStock: true,
      showNewArrivals: false, showBestSellers: false,
    };
    setFilters(reset);
    setCurrentPage(1);
  };

  // totalPages and paginatedProducts now come from the API meta, not a
  // client-side slice of the local array. This is what was causing pagination
  // to never render — filteredProducts only held the current page's 20 items.
  const totalPages = apiLastPage;
  const paginatedProducts = pageProducts; // already the correct page from the API

  const from = apiTotal === 0 ? 0 : (currentPage - 1) * productsPerPage + 1;
  const to   = Math.min(currentPage * productsPerPage, apiTotal);

  const paginate = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ── Hero ── */}
      <div className={`${config.heroBg} border-b ${config.heroBorder}`}>
        <div className="max-w-[1920px] mx-auto px-[4%] py-6 sm:py-10">
          <div className="flex items-start gap-4">
            <div className={`w-12 h-12 sm:w-16 sm:h-16 ${config.iconBg} rounded-2xl flex items-center justify-center`}>
              <Icon className={`w-6 h-6 sm:w-8 sm:h-8 ${config.iconColor}`} />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl 2xl:text-4xl font-bold text-gray-900 mb-1">
                {config.label}
              </h1>
              <p className="text-sm sm:text-base text-gray-600">{config.subtitle}</p>
              <div className="flex items-center gap-3 mt-2">
                <span className={`px-3 py-1 ${config.badgeBg} ${config.badgeText} rounded-full text-sm font-medium`}>
                  {productCount} Products
                </span>
                <span className="text-sm text-gray-500">{config.tags}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Filter bar ── */}
      <div className="max-w-[1920px] mx-auto px-[4%] pt-6 sm:pt-8">
        <SearchFilterBar
          onFilterChange={handleFilterChange}
          onViewModeChange={setViewMode}
          productCount={apiTotal}
          categories={[]}
          initialSearchQuery={searchQuery}
        />
      </div>

      {/* ── Breadcrumb ── */}
      <div className="bg-white border-b border-gray-200 mt-4">
        <div className="max-w-[1920px] mx-auto px-[4%] py-3">
          <div className="flex items-center gap-2 text-sm">
            <button
              onClick={() => router.push('/category')}
              className={`text-gray-500 ${config.breadcrumbHover}`}
            >
              Categories
            </button>
            <span className="text-gray-400">/</span>
            <span className={`${config.breadcrumbCurrent} font-medium`}>{config.label}</span>
          </div>
        </div>
      </div>

      {/* ── Main content ── */}
      <div className="max-w-[1920px] mx-auto px-[4%] py-6 sm:py-8">

        {/* Results header */}
        <div className="mb-5 sm:mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-lg sm:text-xl 2xl:text-2xl font-bold text-gray-900">
              All {config.label}
            </h2>
            <p className="text-xs sm:text-sm text-gray-500">
              Showing {from}–{to} of {apiTotal} products
            </p>
          </div>
          {filters.sortBy !== 'default' && (
            <p className="text-xs sm:text-sm text-gray-600">
              Sorted by:{' '}
              <span className="font-medium">
                {filters.sortBy === 'price-low'  && 'Price: Low to High'}
                {filters.sortBy === 'price-high' && 'Price: High to Low'}
                {filters.sortBy === 'rating'     && 'Highest Rated'}
                {filters.sortBy === 'name'       && 'Name (A-Z)'}
              </span>
            </p>
          )}
        </div>

        {/* Products */}
        {isLoading ? (
          <GridSkeleton />
        ) : paginatedProducts.length > 0 ? (
          viewMode === 'grid' ? (
            <>
              {/* Mobile */}
              <div className="grid grid-cols-2 gap-3 sm:hidden">
                {paginatedProducts.map(product => (
                  <MobileProductCard key={product.id} product={product} />
                ))}
              </div>
              {/* Desktop */}
              <div className="hidden sm:grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-4 gap-4 lg:gap-6 2xl:gap-8">
                {paginatedProducts.map(product => (
                  <div key={product.id} className="w-full">
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>
            </>
          ) : (
            /* List view */
            <div className="space-y-3 sm:space-y-4">
              {paginatedProducts.map(product => (
                <div
                  key={product.id}
                  className="bg-white rounded-lg border border-gray-200 hover:shadow-lg transition-shadow p-3 sm:p-4 lg:p-6"
                >
                  <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                    {/* Image */}
                    <div className="relative w-full sm:w-48 h-40 sm:h-48 flex-shrink-0 rounded-lg overflow-hidden">
                      <Image
                        src={product.img}
                        alt={product.nameEn}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 100vw, 192px"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/images/product.png';
                        }}
                      />
                      {product.sale && (
                        <div className="absolute top-2 left-2 px-2 py-0.5 bg-red-500 text-white text-xs font-bold rounded-full">
                          {product.sale}
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-1">{product.nameEn}</h3>
                        <p className="text-sm text-gray-500 mb-2">{product.nameUr}</p>
                        {product.description && (
                          <p className={`text-xs sm:text-sm ${config.descColor} mb-3 line-clamp-2`}>
                            {product.description}
                          </p>
                        )}
                        <div className="flex items-center gap-3 mb-3">
                          <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded">
                            <FaStar className="w-3.5 h-3.5 text-yellow-400" />
                            <span className="font-semibold text-sm">{product.rating || 4.5}</span>
                          </div>
                          <div className={`flex items-center gap-1 ${config.reviewColor}`}>
                            <FaCheckCircle className="w-3.5 h-3.5" />
                            <span className="text-xs sm:text-sm">{product.reviews || 0} Reviews</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-gray-100">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xl sm:text-2xl font-bold text-gray-900">
                            PKR {product.price.toLocaleString()}
                          </span>
                          {product.oldPrice !== null && product.oldPrice !== undefined && (
                            <>
                              <span className="text-sm text-gray-400 line-through">
                                PKR {product.oldPrice.toLocaleString()}
                              </span>
                              <span className={`px-2 py-0.5 ${config.saveBadgeBg} ${config.saveBadgeText} rounded-full text-xs font-semibold`}>
                                Save {Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)}%
                              </span>
                            </>
                          )}
                        </div>
                        <button
                          className={`px-6 py-2.5 ${config.btnClass} text-white rounded-lg transition font-semibold flex items-center justify-center gap-2 text-sm w-full sm:w-auto`}
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
          /* Empty state */
          <div className="text-center py-16">
            <div className="text-6xl mb-4">{config.emptyEmoji}</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No {config.label.toLowerCase()} found
            </h3>
            <p className="text-gray-500 mb-6">
              {filters.searchQuery
                ? `No results for "${filters.searchQuery}"`
                : 'Try adjusting your filters'}
            </p>
            <button
              onClick={clearFilters}
              className={`px-6 py-3 ${config.clearBtnClass} text-white rounded-lg transition font-medium`}
            >
              Clear Filters
            </button>
          </div>
        )}

        {/* Pagination — uses windowed Pagination component (same as shop page) */}
        {!isLoading && totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={paginate}
          />
        )}
      </div>

      {/* Modal */}
      {isModalOpen && selectedProduct && (
        <ProductDetailsModal
          product={selectedProduct}
          onClose={() => { setIsModalOpen(false); setSelectedProduct(null); }}
        />
      )}
    </div>
  );
}
