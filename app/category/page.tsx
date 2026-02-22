// app/categories/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { newArrivalProducts, NewArrivalProduct } from '../Desktop/data/newproducts';
import ProductCard from '../Desktop/components/ProductCard';
import MobileProductCard from '../Mobile/components/ProductCard';
import ProductDetailsModal from '../Desktop/components/ProductDetailsModal';
import SearchFilterBar from '../Desktop/components/SearchFilterBar';
import { FilterOptions } from '../Desktop/utils/filterProducts';
import { FaStar, FaCheckCircle, FaEye } from 'react-icons/fa';

// ─── Detect mobile screen ──────────────────────────────────────────────────────
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);
  return isMobile;
}

// ─── Map NewArrivalProduct → MobileProductCard props ──────────────────────────
// MobileProductCard expects: { id: string, image: string, name: string,
//   features: string[], price: number, currency?, onAddToCart?, className? }
// Note: oldPrice can be null in product data — convert null → undefined
function toMobileProps(
  product: NewArrivalProduct,
  onAddToCart: (id: string) => void
) {
  return {
    id: String(product.id),
    image: product.img,
    name: product.nameEn,
    features: [product.nameUr, product.category, product.description].filter(
      (v): v is string => Boolean(v)
    ),
    price: product.price,
    currency: 'PKR' as const,
    onAddToCart,
  };
}

// ─── Main Page ─────────────────────────────────────────────────────────────────
export default function CategoriesPage() {
  const allCategories = [
    'All Products',
    ...Array.from(new Set(newArrivalProducts.map((p) => p.category))),
  ];

  const isMobile = useIsMobile();

  // ── State (identical to original) ───────────────────────────────────────────
  const [selectedCategory, setSelectedCategory] = useState<string>('All Products');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filteredProducts, setFilteredProducts] = useState<NewArrivalProduct[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<NewArrivalProduct | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [filters, setFilters] = useState<FilterOptions>({
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

  useEffect(() => {
    setFilteredProducts(newArrivalProducts);
  }, []);

  // ── Handlers (identical to original) ────────────────────────────────────────
  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    if (category === 'All Products') {
      setFilters({ ...filters, categories: [] });
    } else {
      setFilters({ ...filters, categories: [category] });
    }
  };

  const handleFilterChange = (newFilters: FilterOptions) => {
    setFilters(newFilters);
    setSearchQuery(newFilters.searchQuery || '');

    let products = [...newArrivalProducts];

    if (selectedCategory !== 'All Products') {
      products = products.filter((p) => p.category === selectedCategory);
    }

    if (newFilters.searchQuery) {
      const query = newFilters.searchQuery.toLowerCase();
      products = products.filter(
        (p) =>
          p.nameEn.toLowerCase().includes(query) ||
          p.nameUr.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query) ||
          p.category.toLowerCase().includes(query)
      );
    }

    products = products.filter(
      (p) => p.price >= newFilters.minPrice && p.price <= newFilters.maxPrice
    );

    if (newFilters.categories.length > 0) {
      products = products.filter((p) => newFilters.categories.includes(p.category));
    }

    if (newFilters.showOnSale) {
      products = products.filter((p) => p.sale);
    }

    switch (newFilters.sortBy) {
      case 'price-low':  products.sort((a, b) => a.price - b.price); break;
      case 'price-high': products.sort((a, b) => b.price - a.price); break;
      case 'rating':     products.sort((a, b) => b.rating - a.rating); break;
      case 'name':       products.sort((a, b) => a.nameEn.localeCompare(b.nameEn)); break;
      default: break;
    }

    setFilteredProducts(products);
  };

  const handleViewModeChange = (mode: 'grid' | 'list') => setViewMode(mode);

  const handleQuickView = (product: NewArrivalProduct) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  const getProductCountByCategory = (category: string) => {
    if (category === 'All Products') return newArrivalProducts.length;
    return newArrivalProducts.filter((p) => p.category === category).length;
  };

  // Simple add-to-cart handler for mobile card (no-op if no cart context)
  const handleMobileAddToCart = (id: string) => {
    console.log('Add to cart:', id);
  };

  // ── Render ───────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 text-center mb-2">
            Shop by Category
          </h1>
          <p className="text-sm sm:text-base text-gray-600 text-center">
            Browse our collection of natural products
          </p>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
        <SearchFilterBar
          onFilterChange={handleFilterChange}
          onViewModeChange={handleViewModeChange}
          productCount={filteredProducts.length}
          categories={allCategories.filter((cat) => cat !== 'All Products')}
          initialSearchQuery={searchQuery}
        />
      </div>

      {/* Category Menu Bar */}
      <div className="bg-white border-b border-gray-200 mt-4 sm:mt-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="overflow-x-auto">
            <div className="flex space-x-1 py-3">
              {allCategories.map((category) => (
                <button
                  key={category}
                  onClick={() => handleCategorySelect(category)}
                  className={`flex-shrink-0 px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium rounded-full transition ${
                    selectedCategory === category
                      ? 'bg-green-700 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category}
                  <span
                    className={`ml-1 text-xs ${
                      selectedCategory === category ? 'text-white/80' : 'text-gray-500'
                    }`}
                  >
                    ({getProductCountByCategory(category)})
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-8">
        {/* Results Header */}
        <div className="mb-5 sm:mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-gray-900">
              {selectedCategory === 'All Products' ? 'All Products' : selectedCategory}
            </h2>
            <p className="text-xs sm:text-sm text-gray-600">
              Showing {filteredProducts.length} products
            </p>
          </div>

          {filters.sortBy !== 'default' && (
            <div className="text-xs sm:text-sm text-gray-600 mt-2 sm:mt-0">
              Sorted by:{' '}
              <span className="font-medium">
                {filters.sortBy === 'price-low' && 'Price: Low to High'}
                {filters.sortBy === 'price-high' && 'Price: High to Low'}
                {filters.sortBy === 'rating' && 'Highest Rated'}
                {filters.sortBy === 'name' && 'Name (A-Z)'}
              </span>
            </div>
          )}
        </div>

        {/* Products Display */}
        {filteredProducts.length > 0 ? (
          viewMode === 'grid' ? (
            // ── Grid View ──────────────────────────────────────────────────────
            // Mobile (<640px)  → 2-col grid, MobileProductCard (imported)
            // Desktop (≥640px) → 2/3/4-col grid, ProductCard (Desktop)
            isMobile ? (
              <div className="grid grid-cols-2 gap-3">
                {filteredProducts.map((product) => (
                  <MobileProductCard
                    key={product.id}
                    {...toMobileProps(product, handleMobileAddToCart)}
                  />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                {filteredProducts.map((product) => (
                  <div
                    key={product.id}
                    className="bg-white rounded-lg border border-gray-200 overflow-hidden"
                  >
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>
            )
          ) : (
            // ── List View (identical to original) ──────────────────────────────
            <div className="space-y-3 sm:space-y-4">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className="bg-white rounded-lg border border-gray-200 hover:shadow-lg transition-shadow p-3 sm:p-4"
                >
                  <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                    {/* Image */}
                    <div className="w-full sm:w-48 h-40 sm:h-48 flex-shrink-0">
                      <img
                        src={product.img}
                        alt={product.nameEn}
                        className="w-full h-full object-cover rounded-lg"
                        loading="lazy"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/images/product.png';
                        }}
                      />
                    </div>

                    {/* Details */}
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
                          {product.nameEn}
                        </h3>
                        <p className="text-sm sm:text-lg text-gray-600 mb-2 sm:mb-3">
                          {product.nameUr}
                        </p>
                        {product.description && (
                          <p className="text-xs sm:text-sm text-green-700 mb-3 sm:mb-4">
                            {product.description}
                          </p>
                        )}

                        {/* Rating & Reviews */}
                        <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
                          <div className="flex items-center gap-1">
                            <FaStar className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400" />
                            <span className="font-semibold text-sm sm:text-base">
                              {product.rating}
                            </span>
                          </div>
                          <div className="flex items-center gap-1 text-green-600">
                            <FaCheckCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                            <span className="text-xs sm:text-base">{product.reviews} Reviews</span>
                          </div>
                        </div>
                      </div>

                      {/* Price & Quick View */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 mt-2 sm:mt-4">
                        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                          <span className="text-xl sm:text-2xl font-bold text-gray-900">
                            PKR {product.price.toLocaleString()}
                          </span>
                          {/* null-safe: oldPrice could be null */}
                          {product.oldPrice != null && (
                            <span className="text-sm sm:text-lg text-gray-500 line-through">
                              PKR {product.oldPrice.toLocaleString()}
                            </span>
                          )}
                          {product.sale && (
                            <span className="px-2 sm:px-3 py-1 bg-red-100 text-red-600 rounded-full text-xs sm:text-sm font-semibold">
                              {product.sale}
                            </span>
                          )}
                        </div>

                        <button
                          className="px-6 sm:px-8 py-2.5 sm:py-3 bg-green-700 text-white rounded-full hover:bg-green-600 transition font-semibold flex items-center justify-center gap-2 text-sm sm:text-base w-full sm:w-auto"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleQuickView(product);
                          }}
                        >
                          <FaEye className="w-4 h-4" />
                          Quick View
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )
        ) : (
          // ── Empty State (identical to original) ────────────────────────────
          <div className="text-center py-12">
            <div className="text-gray-400 text-5xl mb-4">🔍</div>
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
              No products found
            </h3>
            <p className="text-sm sm:text-base text-gray-600 mb-4">
              {filters.searchQuery
                ? `No results found for "${filters.searchQuery}"`
                : 'Try selecting a different category'}
            </p>
            <button
              onClick={() => {
                setSelectedCategory('All Products');
                handleFilterChange({
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
              }}
              className="px-6 py-3 bg-green-700 text-white rounded-lg hover:bg-green-600 transition-colors font-medium text-sm sm:text-base"
            >
              View All Products
            </button>
          </div>
        )}
      </div>

      {/* Product Details Modal */}
      {isModalOpen && selectedProduct && (
        <ProductDetailsModal product={selectedProduct} onClose={handleCloseModal} />
      )}
    </div>
  );
}