// app/new-arrivals/page.tsx
"use client";

import { useState, useEffect } from 'react';
import DesktopProductCard from '../Desktop/components/ProductCard';
import MobileProductCard from '../Mobile/components/ProductCard';
import { newArrivalProducts, NewArrivalProduct } from '../Desktop/data/newproducts';

// Hook to detect mobile screen
const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  return isMobile;
};

// Categories for filter
const categories = [
  'All Products',
  'Oils & Ghee',
  'Herbs & Spices',
  'Beauty & Skincare',
  'Honey & Sweeteners',
  'Tea & Beverages',
  'Supplements'
];

// Sort options
const sortOptions = [
  { value: 'newest', label: 'Newest First' },
  { value: 'price-low-high', label: 'Price: Low to High' },
  { value: 'price-high-low', label: 'Price: High to Low' },
  { value: 'popular', label: 'Most Popular' }
];

export default function NewArrivalsPage() {
  const isMobile = useIsMobile();
  const [selectedCategory, setSelectedCategory] = useState<string>('All Products');
  const [sortBy, setSortBy] = useState<string>('newest');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filteredProducts, setFilteredProducts] = useState<NewArrivalProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filter and sort products based on selections
  useEffect(() => {
    setIsLoading(true);
    
    let products = [...newArrivalProducts];
    
    // Filter by category
    if (selectedCategory !== 'All Products') {
      products = products.filter(product => 
        product.category === selectedCategory
      );
    }
    
    // Sort products
    switch (sortBy) {
      case 'price-low-high':
        products.sort((a, b) => a.price - b.price);
        break;
      case 'price-high-low':
        products.sort((a, b) => b.price - a.price);
        break;
      case 'popular':
        products.sort((a, b) => b.reviews - a.reviews);
        break;
      case 'newest':
      default:
        products.sort((a, b) => parseInt(b.id) - parseInt(a.id));
        break;
    }
    
    const newProducts = products.filter(product => product.isNew);
    setFilteredProducts(newProducts);
    
    setIsLoading(false);
  }, [selectedCategory, sortBy]);

  const bestSellingProducts = newArrivalProducts
    .filter(product => product.isBestSeller && product.isNew)
    .sort((a, b) => b.rating - a.rating);

  const handleCategoryFilter = (category: string) => {
    setSelectedCategory(category);
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortBy(e.target.value);
  };

  const toggleViewMode = (mode: 'grid' | 'list') => {
    setViewMode(mode);
  };

  const getProductCountByCategory = (category: string) => {
    if (category === 'All Products') {
      return newArrivalProducts.filter(p => p.isNew).length;
    }
    return newArrivalProducts.filter(p => p.isNew && p.category === category).length;
  };

  const stats = {
    totalNewProducts: newArrivalProducts.filter(p => p.isNew).length,
    bestSellersCount: newArrivalProducts.filter(p => p.isBestSeller && p.isNew).length,
    averageRating: Math.round(
      newArrivalProducts
        .filter(p => p.isNew)
        .reduce((acc, p) => acc + p.rating, 0) / 
      newArrivalProducts.filter(p => p.isNew).length * 10
    ) / 10,
    onSaleCount: newArrivalProducts.filter(p => p.isNew && p.sale).length
  };

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const email = formData.get('email') as string;
    console.log('Subscribing email:', email);
    alert('Thank you for subscribing to our newsletter!');
    (e.target as HTMLFormElement).reset();
  };

  const handleShopNow = () => {
    console.log('Navigating to shop');
  };

  const handleAddToCart = (productId: string) => {
    console.log(`Adding product ${productId} to cart`);
    const product = newArrivalProducts.find(p => p.id === productId);
    alert(`Added ${product?.nameEn || 'product'} to cart!`);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section - Responsive */}
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
              <span className="px-3 sm:px-4 py-1.5 bg-white/20 rounded-full text-xs sm:text-sm font-medium">
                🚀 Just Launched
              </span>
              <span className="px-3 sm:px-4 py-1.5 bg-white/20 rounded-full text-xs sm:text-sm font-medium">
                ⭐ Premium Quality
              </span>
              <span className="px-3 sm:px-4 py-1.5 bg-white/20 rounded-full text-xs sm:text-sm font-medium">
                📦 Free Shipping
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="mx-[4%] py-6 sm:py-8 md:py-12">
        {/* Filter Section - Responsive */}
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
                  {sortOptions.map(option => (
                    <option 
                      key={option.value} 
                      value={option.value}
                      className="text-gray-800"
                    >
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

          {/* Category Filter - Responsive horizontal scroll on mobile */}
          <div className="flex gap-2 mb-6 sm:mb-8 overflow-x-auto pb-2 scrollbar-hide">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => handleCategoryFilter(category)}
                className={`px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg text-xs sm:text-sm font-medium transition whitespace-nowrap flex-shrink-0 ${
                  selectedCategory === category
                    ? 'bg-green-700 text-white shadow-sm'
                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200 border border-gray-200'
                }`}
              >
                {category} ({getProductCountByCategory(category)})
              </button>
            ))}
          </div>
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="w-12 h-12 sm:w-16 sm:h-16 border-4 border-green-200 border-t-green-600 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-sm sm:text-base text-gray-600">Loading products...</p>
          </div>
        ) : (
          <>
            {/* Product Grid - Responsive */}
            <section className="mb-8 sm:mb-12">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 gap-3">
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900">
                    {selectedCategory === 'All Products' ? 'All New Arrivals' : selectedCategory}
                  </h3>
                  <p className="text-gray-600 text-xs sm:text-sm mt-1">
                    Showing {filteredProducts.length} products
                  </p>
                </div>
                
                {/* View Toggle - Hide on mobile */}
                {!isMobile && (
                  <div className="flex items-center gap-4">
                    <span className="text-gray-700 text-sm font-medium">View:</span>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => toggleViewMode('list')}
                        className={`p-2.5 rounded-lg ${
                          viewMode === 'list'
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
                        className={`p-2.5 rounded-lg ${
                          viewMode === 'grid'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                )}
              </div>
              
              {filteredProducts.length > 0 ? (
                <div className={`grid gap-4 sm:gap-6 ${
                  viewMode === 'grid' 
                    ? 'grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
                    : 'grid-cols-1'
                }`}>
                  {filteredProducts.map((product) => (
                    <div key={product.id} className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                      {isMobile ? (
                        <MobileProductCard
                          id={product.id}
                          name={product.nameEn}
                          image={product.img}
                          features={[
                            product.category || "General",
                            product.rating ? `${product.rating}★` : "New",
                            product.sale || "Premium"
                          ]}
                          price={product.price}
                          onAddToCart={handleAddToCart}
                        />
                      ) : (
                        <DesktopProductCard product={product} />
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-6 h-6 sm:w-8 sm:h-8 text-green-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h4 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">No products found</h4>
                  <p className="text-sm sm:text-base text-gray-600">Try selecting a different category</p>
                </div>
              )}
            </section>

            {/* Special Offer Banner - Responsive */}
            <section className="mb-8 sm:mb-12 bg-gradient-to-r from-green-700 to-emerald-700 rounded-xl p-4 sm:p-6 md:p-8">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4 sm:gap-6">
                <div className="text-center md:text-left">
                  <div className="flex flex-wrap justify-center md:justify-start items-center gap-2 mb-3">
                    <span className="px-2 sm:px-3 py-1 bg-white/20 rounded-full text-xs sm:text-sm font-medium">🚀 LAUNCH OFFER</span>
                    <span className="px-2 sm:px-3 py-1 bg-amber-500 text-white rounded-full text-xs sm:text-sm font-medium">LIMITED TIME</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">Launch Special!</h3>
                  <p className="text-sm sm:text-base text-green-100 mb-4">
                    Get 20% OFF on all new arrivals + Free Shipping on orders above PKR 1500
                  </p>
                  <button 
                    onClick={handleShopNow}
                    className="px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base bg-white text-green-800 font-semibold rounded-lg hover:bg-gray-100 transition shadow-md"
                  >
                    Shop Now & Save
                  </button>
                </div>
                <div className="text-center bg-white/10 p-4 sm:p-6 rounded-xl">
                  <div className="text-4xl sm:text-5xl font-bold text-white">20%</div>
                  <div className="text-base sm:text-lg text-green-100 font-medium">OFF</div>
                  <p className="text-green-200 text-xs sm:text-sm mt-2">New Arrivals</p>
                </div>
              </div>
            </section>

            {/* Best Selling New Products - Responsive */}
            <section className="mb-8 sm:mb-12">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 gap-3">
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900">
                    Best Selling New Products
                  </h3>
                  <p className="text-gray-600 text-xs sm:text-sm mt-1">
                    Most popular among our customers
                  </p>
                </div>
                <button className="text-green-700 font-medium text-xs sm:text-sm hover:text-green-800 text-left sm:text-right">
                  View All →
                </button>
              </div>
              
              {bestSellingProducts.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  {bestSellingProducts.slice(0, 6).map((product) => (
                    <div key={product.id} className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                      {isMobile ? (
                        <MobileProductCard
                          id={product.id}
                          name={product.nameEn}
                          image={product.img}
                          features={[
                            product.category || "General",
                            product.rating ? `${product.rating}★` : "New",
                            "Best Seller"
                          ]}
                          price={product.price}
                          onAddToCart={handleAddToCart}
                        />
                      ) : (
                        <DesktopProductCard product={product} />
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-xl">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-6 h-6 sm:w-8 sm:h-8 text-green-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                    </svg>
                  </div>
                  <h4 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">No Best Sellers Yet</h4>
                  <p className="text-sm sm:text-base text-gray-600">These products are new. Be the first to review!</p>
                </div>
              )}
            </section>
          </>
        )}

        {/* Benefits Section - Responsive */}
        <section className="mb-8 sm:mb-12 bg-gray-50 rounded-xl p-4 sm:p-6 md:p-8 border border-gray-200">
          <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6 sm:mb-8 text-center">
            Why Choose Our New Arrivals?
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
            {[
              {
                title: '100% Pure & Natural',
                description: 'No chemicals, no preservatives',
                icon: '🌿',
                color: 'text-green-700'
              },
              {
                title: 'Lab Tested',
                description: 'Quality certified products',
                icon: '🔬',
                color: 'text-blue-700'
              },
              {
                title: 'Made in Pakistan',
                description: 'Supporting local farmers',
                icon: '🇵🇰',
                color: 'text-amber-700'
              },
              {
                title: 'Fast Delivery',
                description: 'Free shipping over PKR 2000',
                icon: '🚚',
                color: 'text-emerald-700'
              }
            ].map((benefit, index) => (
              <div key={index} className="bg-white p-3 sm:p-4 md:p-5 rounded-lg border border-gray-200 shadow-sm text-center">
                <div className={`text-2xl sm:text-3xl mb-2 sm:mb-3 ${benefit.color}`}>{benefit.icon}</div>
                <h4 className="font-bold text-gray-900 mb-1 sm:mb-2 text-xs sm:text-sm md:text-base">{benefit.title}</h4>
                <p className="text-gray-700 text-xs sm:text-sm">{benefit.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Newsletter Section - Responsive */}
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
              className="flex-1 px-4 py-2.5 sm:py-3 text-sm sm:text-base rounded-lg text-gray-900 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <button 
              type="submit"
              className="px-4 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base bg-white text-green-800 font-semibold rounded-lg hover:bg-gray-100 transition shadow whitespace-nowrap"
            >
              Subscribe
            </button>
          </form>
          <p className="text-green-200 text-xs sm:text-sm mt-3 sm:mt-4">
            We respect your privacy. No spam ever.
          </p>
        </section>

        {/* Quick Stats - Responsive */}
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
    </div>
  );
}