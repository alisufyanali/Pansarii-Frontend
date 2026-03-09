'use client';

import { useState, useEffect } from 'react';
import { newArrivalProducts, NewArrivalProduct } from '../Desktop/data/newproducts';
import ProductCard from '../Desktop/components/ProductCard';
import ProductDetailsModal from '../Desktop/components/ProductDetailsModal';
import SearchFilterBar from '../Desktop/components/SearchFilterBar';
import { FilterOptions } from '../Desktop/utils/filterProducts';
import { FaStar, FaCheckCircle, FaEye } from 'react-icons/fa';
import Image from 'next/image';

// ─── Mobile Card ─────────────────────────────────────────────────────────────
interface MobileCardProps {
  id: string; image: string; name: string; features: string[];
  price: number; oldPrice?: number; sale?: string; currency?: string;
  onAddToCart?: (id: string) => void;
}
function MobileCard({ id, image, name, features, price, oldPrice, sale, currency = 'PKR', onAddToCart }: MobileCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="relative w-full h-36 bg-gray-50">
        {sale && <div className="absolute top-2 left-2 z-10 px-1.5 py-0.5 bg-red-500 text-white text-[10px] font-bold rounded-full">{sale}</div>}
        <Image src={image} alt={name} fill className="object-contain p-2" sizes="50vw"
          onError={(e) => { (e.target as HTMLImageElement).src = '/images/product.png'; }} />
      </div>
      <div className="p-2.5">
        <h3 className="font-semibold text-xs text-gray-900 mb-1 line-clamp-2 min-h-[2.5rem]">{name}</h3>
        <div className="flex flex-wrap gap-x-1 mb-2">
          {features.slice(0, 2).map((f, i) => (
            <span key={i} className="text-[10px] text-gray-400">{f}{i < Math.min(features.length, 2) - 1 && ' •'}</span>
          ))}
        </div>
        <div className="flex items-center justify-between">
          <div>
            <span className="text-sm font-bold text-gray-900">{currency} {price.toLocaleString('en-PK')}</span>
            {oldPrice && <span className="text-[10px] text-gray-400 line-through ml-1">{currency} {oldPrice.toLocaleString('en-PK')}</span>}
          </div>
          <button onClick={(e) => { e.preventDefault(); onAddToCart?.(id); }}
            className="w-7 h-7 rounded-full bg-[#197B33] flex items-center justify-center hover:bg-[#156529] active:scale-95 transition-all">
            <span className="text-white text-base font-bold leading-none">+</span>
          </button>
        </div>
      </div>
    </div>
  );
}

function toMobileProps(product: NewArrivalProduct, onAddToCart: (id: string) => void): MobileCardProps {
  return {
    id: String(product.id), image: product.img ?? '/images/product.png', name: product.nameEn,
    features: ([product.nameUr, product.category, product.description] as (string | null | undefined)[])
      .filter((v): v is string => typeof v === 'string' && v.length > 0),
    price: product.price, oldPrice: product.oldPrice ?? undefined,
    sale: product.sale ?? undefined, currency: 'PKR', onAddToCart,
  };
}

// ─── Skeletons ────────────────────────────────────────────────────────────────
function GridSkeleton() {
  return (
    <>
      {/* Mobile skeleton */}
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
      {/* Desktop skeleton */}
      <div className="hidden sm:grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 lg:gap-6 2xl:gap-8">
        {[...Array(20)].map((_, i) => (
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

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function CategoriesPage() {
  const allCategories = ['All Products', ...Array.from(new Set(newArrivalProducts.map((p) => p.category)))];

  const [selectedCategory, setSelectedCategory] = useState('All Products');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filteredProducts, setFilteredProducts] = useState<NewArrivalProduct[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<NewArrivalProduct | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  // Matches shop: 20 on laptop, 25 on 4K
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

  const [filters, setFilters] = useState<FilterOptions>({
    searchQuery: '', minPrice: 0, maxPrice: 5000, categories: [],
    sortBy: 'default', showOnSale: false, showInStock: true,
    showNewArrivals: false, showBestSellers: false,
  });

  useEffect(() => {
    setFilteredProducts(newArrivalProducts);
    setTimeout(() => setIsLoading(false), 600);
  }, []);

  const applyFilters = (newFilters: FilterOptions, category = selectedCategory) => {
    let products = [...newArrivalProducts];
    if (category !== 'All Products') products = products.filter((p) => p.category === category);
    if (newFilters.searchQuery) {
      const q = newFilters.searchQuery.toLowerCase();
      products = products.filter((p) =>
        p.nameEn.toLowerCase().includes(q) || p.nameUr.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) || p.category.toLowerCase().includes(q)
      );
    }
    products = products.filter((p) => p.price >= newFilters.minPrice && p.price <= newFilters.maxPrice);
    if (newFilters.categories.length > 0) products = products.filter((p) => newFilters.categories.includes(p.category));
    if (newFilters.showOnSale) products = products.filter((p) => p.sale);
    switch (newFilters.sortBy) {
      case 'price-low': products.sort((a, b) => a.price - b.price); break;
      case 'price-high': products.sort((a, b) => b.price - a.price); break;
      case 'rating': products.sort((a, b) => b.rating - a.rating); break;
      case 'name': products.sort((a, b) => a.nameEn.localeCompare(b.nameEn)); break;
    }
    setFilteredProducts(products);
    setCurrentPage(1);
  };

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    applyFilters(filters, category);
  };

  const handleFilterChange = (newFilters: FilterOptions) => {
    setFilters(newFilters);
    setSearchQuery(newFilters.searchQuery || '');
    applyFilters(newFilters);
  };

  const getCount = (cat: string) =>
    cat === 'All Products' ? newArrivalProducts.length : newArrivalProducts.filter((p) => p.category === cat).length;

  const handleMobileAdd = (id: string) => console.log('Add to cart:', id);

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const paginatedProducts = filteredProducts.slice((currentPage - 1) * productsPerPage, currentPage * productsPerPage);

  const clearFilters = () => {
    setSelectedCategory('All Products');
    const reset: FilterOptions = { searchQuery: '', minPrice: 0, maxPrice: 5000, categories: [], sortBy: 'default', showOnSale: false, showInStock: true, showNewArrivals: false, showBestSellers: false };
    setFilters(reset);
    applyFilters(reset, 'All Products');
  };

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Hero */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-[1920px] mx-auto px-[4%] py-6 sm:py-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl 2xl:text-4xl font-bold text-gray-900 mb-1">Shop by Category</h1>
              <p className="text-sm sm:text-base text-gray-500">Browse our full collection of natural & herbal products</p>
            </div>
            <div className="flex gap-3">
              {[
                { label: `${newArrivalProducts.length}+`, sub: 'Products', bg: 'bg-green-50', color: 'text-green-700' },
                { label: `${allCategories.length - 1}`, sub: 'Categories', bg: 'bg-amber-50', color: 'text-amber-700' },
                { label: '100%', sub: 'Natural', bg: 'bg-blue-50', color: 'text-blue-700' },
              ].map((s) => (
                <div key={s.sub} className={`${s.bg} px-4 py-2 rounded-lg text-center`}>
                  <div className={`font-bold text-lg ${s.color}`}>{s.label}</div>
                  <div className="text-xs text-gray-500">{s.sub}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Search + Filter Bar */}
      <div className="max-w-[1920px] mx-auto px-[4%] pt-6 sm:pt-8">
        <SearchFilterBar
          onFilterChange={handleFilterChange}
          onViewModeChange={setViewMode}
          productCount={filteredProducts.length}
          categories={allCategories.filter((c) => c !== 'All Products')}
          initialSearchQuery={searchQuery}
        />
      </div>

      {/* Category pill bar — sticky */}
      <div className="bg-white border-b border-gray-200 mt-4 sm:mt-6 sticky top-0 z-10 shadow-sm">
        <div className="max-w-[1920px] mx-auto px-[4%]">
          <div className="overflow-x-auto">
            <div className="flex space-x-2 py-3">
              {allCategories.map((cat) => (
                <button key={cat} onClick={() => handleCategorySelect(cat)}
                  className={`flex-shrink-0 px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium rounded-full transition-all ${
                    selectedCategory === cat ? 'bg-[#197B33] text-white shadow-md' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}>
                  {cat} <span className={`ml-1 text-xs ${selectedCategory === cat ? 'text-white/75' : 'text-gray-400'}`}>({getCount(cat)})</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-[1920px] mx-auto px-[4%] py-6 sm:py-8">

        {/* Results header */}
        <div className="mb-5 sm:mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-lg sm:text-xl 2xl:text-2xl font-bold text-gray-900">
              {selectedCategory === 'All Products' ? 'All Products' : selectedCategory}
            </h2>
            <p className="text-xs sm:text-sm text-gray-500">
              Showing {filteredProducts.length === 0 ? 0 : (currentPage - 1) * productsPerPage + 1}–{Math.min(currentPage * productsPerPage, filteredProducts.length)} of {filteredProducts.length} products
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

        {/* Products */}
        {isLoading ? <GridSkeleton /> : filteredProducts.length > 0 ? (
          viewMode === 'grid' ? (
            <>
              {/* Mobile grid */}
              <div className="grid grid-cols-2 gap-3 sm:hidden">
                {paginatedProducts.map((product) => (
                  <MobileCard key={product.id} {...toMobileProps(product, handleMobileAdd)} />
                ))}
              </div>
              {/* Desktop grid — exactly matches shop: lg:grid-cols-5 */}
             <div className="hidden sm:grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-4 gap-4 lg:gap-6 2xl:gap-8">
              
              {/* <div className="hidden sm:grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 lg:gap-6 2xl:gap-8"> */}
                {paginatedProducts.map((product) => (
                  <div key={product.id} className="w-full">
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>
            </>
          ) : (
            // List view
            <div className="space-y-3 sm:space-y-4">
              {paginatedProducts.map((product) => (
                <div key={product.id} className="bg-white rounded-lg border border-gray-200 hover:shadow-lg transition-shadow p-3 sm:p-4 lg:p-6">
                  <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                    <div className="w-full sm:w-48 h-40 sm:h-48 flex-shrink-0 relative">
                      <img src={product.img} alt={product.nameEn} className="w-full h-full object-cover rounded-lg" loading="lazy"
                        onError={(e) => { (e.target as HTMLImageElement).src = '/images/product.png'; }} />
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
                            <span className="font-semibold text-sm">{product.rating}</span>
                          </div>
                          <div className="flex items-center gap-1 text-green-600">
                            <FaCheckCircle className="w-3.5 h-3.5" />
                            <span className="text-xs sm:text-sm">{product.reviews} Reviews</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-gray-100">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xl sm:text-2xl font-bold text-gray-900">PKR {product.price.toLocaleString()}</span>
                          {product.oldPrice && <span className="text-sm text-gray-400 line-through">PKR {product.oldPrice.toLocaleString()}</span>}
                          {product.oldPrice && <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs font-semibold">Save {Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)}%</span>}
                        </div>
                        <button className="px-6 py-2.5 bg-[#197B33] text-white rounded-lg hover:bg-[#156529] transition font-semibold flex items-center justify-center gap-2 text-sm w-full sm:w-auto"
                          onClick={() => { setSelectedProduct(product); setIsModalOpen(true); }}>
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
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-500 mb-6">{filters.searchQuery ? `No results for "${filters.searchQuery}"` : 'Try a different category'}</p>
            <button onClick={clearFilters} className="px-6 py-3 bg-[#197B33] text-white rounded-lg hover:bg-[#156529] transition font-medium">View All Products</button>
          </div>
        )}

        {/* Pagination */}
        {!isLoading && totalPages > 1 && (
          <div className="mt-8 sm:mt-10 flex items-center justify-center gap-2">
            <button onClick={() => { setCurrentPage(p => Math.max(1, p - 1)); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              disabled={currentPage === 1}
              className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-300 disabled:opacity-40 hover:bg-gray-50 text-lg">‹</button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button key={page} onClick={() => { setCurrentPage(page); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                className={`w-10 h-10 flex items-center justify-center rounded-lg border text-sm font-medium ${currentPage === page ? 'bg-[#197B33] text-white border-[#197B33]' : 'border-gray-300 hover:bg-gray-50'}`}>
                {page}
              </button>
            ))}
            <button onClick={() => { setCurrentPage(p => Math.min(totalPages, p + 1)); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              disabled={currentPage === totalPages}
              className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-300 disabled:opacity-40 hover:bg-gray-50 text-lg">›</button>
          </div>
        )}
      </div>

      {isModalOpen && selectedProduct && (
        <ProductDetailsModal product={selectedProduct} onClose={() => { setIsModalOpen(false); setSelectedProduct(null); }} />
      )}
    </div>
  );
}