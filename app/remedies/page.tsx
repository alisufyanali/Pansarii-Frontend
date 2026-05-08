'use client';

import { useState, useEffect } from 'react';
import { allProducts } from '@/app/Desktop/data/products';
import ProductCard from '@/app/Desktop/components/ProductCard';
import ProductDetailsModal from '@/app/Desktop/components/ProductDetailsModal';
import SearchFilterBar from '@/app/Desktop/components/SearchFilterBar';
import { FilterOptions } from '@/app/Desktop/utils/filterProducts';
import { FaStar, FaCheckCircle, FaEye, FaLeaf } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import MobileProductCard from '@/app/Mobile/components/ProductCard';

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
              <div className="flex justify-between items-center">
                <div className="h-4 bg-gray-200 rounded w-16" />
                <div className="w-7 h-7 bg-gray-200 rounded-full" />
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="hidden sm:grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-4 gap-4 lg:gap-6 2xl:gap-8">
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

export default function RemediesCategoryPage() {
  const router = useRouter();
  const categoryName = "Remedies";
  
  // Filter products for this category
  const categoryProducts = allProducts.filter(p => p.category === categoryName);
  const productCount = categoryProducts.length;

  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filteredProducts, setFilteredProducts] = useState<any[]>(categoryProducts);
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

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
    setFilteredProducts(categoryProducts);
    setTimeout(() => setIsLoading(false), 600);
  }, []);

  const applyFilters = (newFilters: FilterOptions) => {
    let products = [...categoryProducts];
    
    // Search filter
    if (newFilters.searchQuery) {
      const q = newFilters.searchQuery.toLowerCase();
      products = products.filter((p) =>
        p.nameEn.toLowerCase().includes(q) || 
        p.nameUr.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
      );
    }
    
    // Price filter
    products = products.filter((p) => p.price >= newFilters.minPrice && p.price <= newFilters.maxPrice);
    
    // Sale filter
    if (newFilters.showOnSale) {
      products = products.filter((p) => p.sale);
    }
    
    // Sort
    switch (newFilters.sortBy) {
      case 'price-low': products.sort((a, b) => a.price - b.price); break;
      case 'price-high': products.sort((a, b) => b.price - a.price); break;
      case 'rating': products.sort((a, b) => (b.rating || 0) - (a.rating || 0)); break;
      case 'name': products.sort((a, b) => a.nameEn.localeCompare(b.nameEn)); break;
    }
    
    setFilteredProducts(products);
    setCurrentPage(1);
  };

  const handleFilterChange = (newFilters: FilterOptions) => {
    setFilters(newFilters);
    setSearchQuery(newFilters.searchQuery || '');
    applyFilters(newFilters);
  };

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const paginatedProducts = filteredProducts.slice((currentPage - 1) * productsPerPage, currentPage * productsPerPage);

  const clearFilters = () => {
    const reset: FilterOptions = { 
      searchQuery: '', minPrice: 0, maxPrice: 5000, categories: [], 
      sortBy: 'default', showOnSale: false, showInStock: true, 
      showNewArrivals: false, showBestSellers: false 
    };
    setFilters(reset);
    setFilteredProducts(categoryProducts);
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Category Hero */}
      <div className="bg-gradient-to-r from-purple-50 to-violet-50 border-b border-purple-100">
        <div className="max-w-[1920px] mx-auto px-[4%] py-6 sm:py-10">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-purple-100 rounded-2xl flex items-center justify-center">
              {/* <FaHeartbeat className="w-6 h-6 sm:w-8 sm:h-8 text-purple-600" /> */}
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl 2xl:text-4xl font-bold text-gray-900 mb-1">Remedies</h1>
              <p className="text-sm sm:text-base text-gray-600">Natural healing and wellness remedies</p>
              <div className="flex items-center gap-3 mt-2">
                <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                  {productCount} Products
                </span>
                <span className="text-sm text-gray-500">Natural • Traditional • Healing</span>
              </div>
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
          categories={[]}
          initialSearchQuery={searchQuery}
        //   hideCategoryFilter={true}
        />
      </div>

      {/* Category breadcrumb */}
      <div className="bg-white border-b border-gray-200 mt-4">
        <div className="max-w-[1920px] mx-auto px-[4%] py-3">
          <div className="flex items-center gap-2 text-sm">
            <button onClick={() => router.push('/category')} className="text-gray-500 hover:text-purple-600">Categories</button>
            <span className="text-gray-400">/</span>
            <span className="text-purple-700 font-medium">Remedies</span>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-[1920px] mx-auto px-[4%] py-6 sm:py-8">

        {/* Results header */}
        <div className="mb-5 sm:mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-lg sm:text-xl 2xl:text-2xl font-bold text-gray-900">
              All Remedies
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
                  <MobileProductCard 
                    key={product.id} 
                    product={product} 
                  />
                ))}
              </div>
              {/* Desktop grid */}
              <div className="hidden sm:grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-4 gap-4 lg:gap-6 2xl:gap-8">
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
                        {product.description && <p className="text-xs sm:text-sm text-purple-700 mb-3 line-clamp-2">{product.description}</p>}
                        <div className="flex items-center gap-3 mb-3">
                          <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded">
                            <FaStar className="w-3.5 h-3.5 text-yellow-400" />
                            <span className="font-semibold text-sm">{product.rating || 4.5}</span>
                          </div>
                          <div className="flex items-center gap-1 text-purple-600">
                            <FaCheckCircle className="w-3.5 h-3.5" />
                            <span className="text-xs sm:text-sm">{product.reviews || 0} Reviews</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-gray-100">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xl sm:text-2xl font-bold text-gray-900">PKR {product.price.toLocaleString()}</span>
                          {product.oldPrice && <span className="text-sm text-gray-400 line-through">PKR {product.oldPrice.toLocaleString()}</span>}
                          {product.oldPrice && <span className="px-2 py-0.5 bg-purple-100 text-purple-700 rounded-full text-xs font-semibold">Save {Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)}%</span>}
                        </div>
                        <button className="px-6 py-2.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition font-semibold flex items-center justify-center gap-2 text-sm w-full sm:w-auto"
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
            <div className="flex justify-center mb-4">
              <svg className="w-14 h-14 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"/></svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No remedies found</h3>
            <p className="text-gray-500 mb-6">{filters.searchQuery ? `No results for "${filters.searchQuery}"` : 'Try adjusting your filters'}</p>
            <button onClick={clearFilters} className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition font-medium">Clear Filters</button>
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
                className={`w-10 h-10 flex items-center justify-center rounded-lg border text-sm font-medium ${currentPage === page ? 'bg-purple-600 text-white border-purple-600' : 'border-gray-300 hover:bg-gray-50'}`}>
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

      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}