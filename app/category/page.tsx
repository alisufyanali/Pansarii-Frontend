'use client';

import { useState, useEffect } from 'react';
import { newArrivalProducts, NewArrivalProduct } from '../Desktop/data/newproducts';
import ProductCard from '../Desktop/components/ProductCard';
import ProductDetailsModal from '../Desktop/components/ProductDetailsModal';
import SearchFilterBar from '../Desktop/components/SearchFilterBar';
import { FilterOptions } from '../Desktop/utils/filterProducts';
import { FaStar, FaCheckCircle, FaEye } from 'react-icons/fa';
import Image from 'next/image';


interface MobileCardProps {
  id: string;
  image: string;
  name: string;
  features: string[];
  price: number;
  currency?: string;
  onAddToCart?: (id: string) => void;
  className?: string;
}

function MobileCard({
  id,
  image,
  name,
  features,
  price,
  currency = 'PKR',
  onAddToCart,
  className = '',
}: MobileCardProps) {
  const formattedPrice = price.toLocaleString('en-PK');

  return (
    <div className={`bg-white rounded-xl shadow border border-gray-100 overflow-hidden ${className}`}>
      {/* Image — fixed height so next/image fill has a sized parent */}
      <div className="relative w-full h-36 bg-gray-50">
        <Image
          src={image}
          alt={name}
          fill
          className="object-contain p-2"
          sizes="(max-width: 640px) 50vw, 25vw"
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/images/product.png';
          }}
        />
      </div>

      {/* Details */}
      <div className="p-2.5">
        <h3 className="font-semibold text-xs text-gray-900 mb-1 line-clamp-2 min-h-[2.5rem]">
          {name}
        </h3>

        <div className="flex flex-wrap gap-x-1 mb-2">
          {features.slice(0, 2).map((feature, i) => (
            <span key={i} className="text-[10px] text-gray-400 leading-tight">
              {feature}{i < Math.min(features.length, 2) - 1 && ' •'}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm font-bold text-gray-900">
            {currency} {formattedPrice}
          </span>
          <button
            onClick={(e) => { e.preventDefault(); onAddToCart?.(id); }}
            className="w-7 h-7 rounded-full bg-[#197B33] flex items-center justify-center hover:bg-[#156529] active:scale-95 transition-all"
            aria-label={`Add ${name} to cart`}
          >
            <span className="text-white text-base font-bold leading-none">+</span>
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Map product → MobileCard props (no null/undefined type issues) ────────────
function toMobileProps(product: NewArrivalProduct, onAddToCart: (id: string) => void): MobileCardProps {
  return {
    id:       String(product.id),
    image:    product.img ?? '/images/product.png',
    name:     product.nameEn,
    features: ([product.nameUr, product.category, product.description] as (string | null | undefined)[])
                .filter((v): v is string => typeof v === 'string' && v.length > 0),
    price:    product.price,
    currency: 'PKR',
    onAddToCart,
  };
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function CategoriesPage() {
  const allCategories = [
    'All Products',
    ...Array.from(new Set(newArrivalProducts.map((p) => p.category))),
  ];

  const [selectedCategory, setSelectedCategory] = useState<string>('All Products');
  const [searchQuery,      setSearchQuery]      = useState<string>('');
  const [viewMode,         setViewMode]         = useState<'grid' | 'list'>('grid');
  const [filteredProducts, setFilteredProducts] = useState<NewArrivalProduct[]>([]);
  const [selectedProduct,  setSelectedProduct]  = useState<NewArrivalProduct | null>(null);
  const [isModalOpen,      setIsModalOpen]      = useState<boolean>(false);
  const [filters,          setFilters]          = useState<FilterOptions>({
    searchQuery:     '',
    minPrice:        0,
    maxPrice:        5000,
    categories:      [],
    sortBy:          'default',
    showOnSale:      false,
    showInStock:     true,
    showNewArrivals: false,
    showBestSellers: false,
  });

  useEffect(() => { setFilteredProducts(newArrivalProducts); }, []);

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    setFilters({ ...filters, categories: category === 'All Products' ? [] : [category] });
  };

  const handleFilterChange = (newFilters: FilterOptions) => {
    setFilters(newFilters);
    setSearchQuery(newFilters.searchQuery || '');

    let products = [...newArrivalProducts];

    if (selectedCategory !== 'All Products') {
      products = products.filter((p) => p.category === selectedCategory);
    }
    if (newFilters.searchQuery) {
      const q = newFilters.searchQuery.toLowerCase();
      products = products.filter(
        (p) =>
          p.nameEn.toLowerCase().includes(q) ||
          p.nameUr.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q),
      );
    }
    products = products.filter(
      (p) => p.price >= newFilters.minPrice && p.price <= newFilters.maxPrice,
    );
    if (newFilters.categories.length > 0) {
      products = products.filter((p) => newFilters.categories.includes(p.category));
    }
    if (newFilters.showOnSale) products = products.filter((p) => p.sale);

    switch (newFilters.sortBy) {
      case 'price-low':  products.sort((a, b) => a.price - b.price); break;
      case 'price-high': products.sort((a, b) => b.price - a.price); break;
      case 'rating':     products.sort((a, b) => b.rating - a.rating); break;
      case 'name':       products.sort((a, b) => a.nameEn.localeCompare(b.nameEn)); break;
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

  const getCount = (cat: string) =>
    cat === 'All Products'
      ? newArrivalProducts.length
      : newArrivalProducts.filter((p) => p.category === cat).length;

  const handleMobileAdd = (id: string) => console.log('Add to cart:', id);

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Hero */}
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

      {/* Search + Filter Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
        <SearchFilterBar
          onFilterChange={handleFilterChange}
          onViewModeChange={handleViewModeChange}
          productCount={filteredProducts.length}
          categories={allCategories.filter((c) => c !== 'All Products')}
          initialSearchQuery={searchQuery}
        />
      </div>

      {/* Category pill bar */}
      <div className="bg-white border-b border-gray-200 mt-4 sm:mt-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="overflow-x-auto">
            <div className="flex space-x-1 py-3">
              {allCategories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => handleCategorySelect(cat)}
                  className={`flex-shrink-0 px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium rounded-full transition ${
                    selectedCategory === cat
                      ? 'bg-green-700 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {cat}
                  <span className={`ml-1 text-xs ${selectedCategory === cat ? 'text-white/80' : 'text-gray-500'}`}>
                    ({getCount(cat)})
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-8">

        {/* Results header */}
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

        {/* ── Products ─────────────────────────────────────────────────────── */}
        {filteredProducts.length > 0 ? (
          viewMode === 'grid' ? (

            // GRID VIEW
            // ─────────────────────────────────────────────────────────────────
            // Strategy: render BOTH grids, hide one with CSS.
            // This avoids the hydration flash from useIsMobile and ensures
            // both card types always render correctly.
            <>
              {/* Mobile grid — visible only on <640px */}
              <div className="grid grid-cols-2 gap-3 sm:hidden">
                {filteredProducts.map((product) => (
                  <MobileCard
                    key={product.id}
                    {...toMobileProps(product, handleMobileAdd)}
                  />
                ))}
              </div>

              {/* Desktop grid — visible only on ≥640px */}
              <div className="hidden sm:grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                {filteredProducts.map((product) => (
                  <div key={product.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>
            </>

          ) : (

            // LIST VIEW — same on all screens, just stacks vertically on mobile
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
                        onError={(e) => { (e.target as HTMLImageElement).src = '/images/product.png'; }}
                      />
                    </div>

                    {/* Details */}
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
                          {product.nameEn}
                        </h3>
                        <p className="text-sm sm:text-lg text-gray-600 mb-2 sm:mb-3">{product.nameUr}</p>
                        {product.description && (
                          <p className="text-xs sm:text-sm text-green-700 mb-3 sm:mb-4">
                            {product.description}
                          </p>
                        )}
                        <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
                          <div className="flex items-center gap-1">
                            <FaStar className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400" />
                            <span className="font-semibold text-sm sm:text-base">{product.rating}</span>
                          </div>
                          <div className="flex items-center gap-1 text-green-600">
                            <FaCheckCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                            <span className="text-xs sm:text-base">{product.reviews} Reviews</span>
                          </div>
                        </div>
                      </div>

                      {/* Price + Quick View */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 mt-2 sm:mt-4">
                        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                          <span className="text-xl sm:text-2xl font-bold text-gray-900">
                            PKR {product.price.toLocaleString()}
                          </span>
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

          // EMPTY STATE
          <div className="text-center py-12">
            <div className="text-gray-400 text-5xl mb-4">🔍</div>
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">No products found</h3>
            <p className="text-sm sm:text-base text-gray-600 mb-4">
              {filters.searchQuery
                ? `No results found for "${filters.searchQuery}"`
                : 'Try selecting a different category'}
            </p>
            <button
              onClick={() => {
                setSelectedCategory('All Products');
                handleFilterChange({
                  searchQuery: '', minPrice: 0, maxPrice: 5000,
                  categories: [], sortBy: 'default',
                  showOnSale: false, showInStock: true,
                  showNewArrivals: false, showBestSellers: false,
                });
              }}
              className="px-6 py-3 bg-green-700 text-white rounded-lg hover:bg-green-600 transition-colors font-medium text-sm sm:text-base"
            >
              View All Products
            </button>
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && selectedProduct && (
        <ProductDetailsModal product={selectedProduct} onClose={handleCloseModal} />
      )}
    </div>
  );
}