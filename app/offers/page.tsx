// app/offers/page.tsx
"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  FaTag, 
  FaPercent, 
  FaFire, 
  FaClock,
  FaShoppingCart,
  FaStar,
  FaGift,
  FaBolt,
  FaCheckCircle,
  FaFilter,
  FaTimes
} from 'react-icons/fa';
import { FiCopy, FiCheck } from 'react-icons/fi';

interface Offer {
  id: string;
  type: 'discount' | 'bogo' | 'flash' | 'seasonal' | 'bundle';
  title: string;
  description: string;
  discount: string;
  code?: string;
  validUntil: string;
  minPurchase?: number;
  image: string;
  products?: string[];
  featured?: boolean;
}

const offers: Offer[] = [
  {
    id: '1',
    type: 'flash',
    title: 'Flash Sale: 40% OFF',
    description: 'Limited time offer on selected herbal products',
    discount: '40% OFF',
    code: 'FLASH40',
    validUntil: '2026-01-31',
    minPurchase: 2000,
    image: '/images/offers/flash-sale.jpg',
    featured: true
  },
  {
    id: '2',
    type: 'seasonal',
    title: 'Winter Wellness Sale',
    description: 'Get healthy this winter with special discounts',
    discount: '25% OFF',
    code: 'WINTER25',
    validUntil: '2026-02-28',
    minPurchase: 1500,
    image: '/images/offers/winter-sale.jpg',
    featured: true
  },
  {
    id: '3',
    type: 'bogo',
    title: 'Buy 1 Get 1 Free',
    description: 'On all honey products',
    discount: 'BOGO',
    code: 'HONEY2X',
    validUntil: '2026-02-15',
    image: '/images/offers/bogo.jpg'
  },
  {
    id: '4',
    type: 'discount',
    title: 'First Order Discount',
    description: 'New customers get 20% off their first purchase',
    discount: '20% OFF',
    code: 'NEW20',
    validUntil: '2026-12-31',
    minPurchase: 1000,
    image: '/images/offers/new-customer.jpg'
  },
  {
    id: '5',
    type: 'bundle',
    title: 'Skincare Bundle',
    description: 'Complete skincare routine at 30% off',
    discount: '30% OFF',
    code: 'SKIN30',
    validUntil: '2026-03-31',
    image: '/images/offers/bundle.jpg'
  },
  {
    id: '6',
    type: 'discount',
    title: 'Free Shipping',
    description: 'Free shipping on orders above PKR 5,000',
    discount: 'FREE SHIP',
    code: 'FREESHIP',
    validUntil: '2026-12-31',
    minPurchase: 5000,
    image: '/images/offers/free-shipping.jpg'
  }
];

// Skeletal Loading Components
function OffersPageSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50 animate-pulse">
      {/* Header Skeleton */}
      <div className="bg-white border-b">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <div className="space-y-2 sm:space-y-3">
              <div className="h-6 sm:h-8 bg-gray-200 rounded w-48 sm:w-64"></div>
              <div className="h-3 sm:h-4 bg-gray-200 rounded w-64 sm:w-96"></div>
            </div>
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-200 rounded-full"></div>
          </div>

          {/* Filter Tabs Skeleton */}
          <div className="flex items-center gap-2 mb-6 sm:mb-8 overflow-x-auto pb-2 scrollbar-hide">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="w-20 sm:w-24 h-8 sm:h-10 bg-gray-200 rounded-lg flex-shrink-0"></div>
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Featured Offers Skeleton */}
        <div className="mb-8 sm:mb-12">
          <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-200 rounded-full"></div>
            <div className="h-6 sm:h-8 bg-gray-200 rounded w-36 sm:w-48"></div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6">
                <div className="space-y-3 sm:space-y-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-2 flex-1">
                      <div className="h-5 sm:h-6 bg-gray-200 rounded w-24 sm:w-32"></div>
                      <div className="h-4 bg-gray-200 rounded w-32 sm:w-48"></div>
                      <div className="h-3 bg-gray-200 rounded w-48 sm:w-64"></div>
                    </div>
                    <div className="w-16 sm:w-20 h-8 sm:h-10 bg-gray-200 rounded-lg flex-shrink-0"></div>
                  </div>
                  
                  <div className="space-y-2 sm:space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                      <div className="flex items-center gap-2">
                        <div className="w-14 sm:w-16 h-3 sm:h-4 bg-gray-200 rounded"></div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-16 sm:w-20 h-3 sm:h-4 bg-gray-200 rounded"></div>
                      </div>
                    </div>
                    
                    <div className="h-10 sm:h-12 bg-gray-200 rounded-lg"></div>
                    
                    <div className="h-10 sm:h-12 bg-gray-200 rounded-lg"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* All Offers Grid Skeleton */}
        <div>
          <div className="h-6 sm:h-8 bg-gray-200 rounded w-36 sm:w-48 mb-4 sm:mb-6"></div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="p-4 sm:p-6 border-b border-gray-100 space-y-2 sm:space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-2 flex-1">
                      <div className="h-5 sm:h-6 bg-gray-200 rounded w-20 sm:w-24"></div>
                      <div className="h-4 bg-gray-200 rounded w-24 sm:w-32"></div>
                    </div>
                    <div className="w-12 sm:w-16 h-6 sm:h-8 bg-gray-200 rounded flex-shrink-0"></div>
                  </div>
                  <div className="h-3 bg-gray-200 rounded w-32 sm:w-48"></div>
                </div>

                <div className="p-4 sm:p-6">
                  <div className="space-y-2 sm:space-y-3 mb-3 sm:mb-4">
                    <div className="h-3 sm:h-4 bg-gray-200 rounded w-32 sm:w-40"></div>
                    <div className="h-3 sm:h-4 bg-gray-200 rounded w-36 sm:w-48"></div>
                  </div>

                  <div className="h-10 sm:h-12 bg-gray-200 rounded-lg mb-3 sm:mb-4"></div>

                  <div className="h-10 sm:h-12 bg-gray-200 rounded-lg"></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* How to Use Banner Skeleton */}
        <div className="mt-8 sm:mt-12 bg-white rounded-xl border border-gray-200 p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row items-start gap-3 sm:gap-4">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-200 rounded-full flex-shrink-0"></div>
            <div className="flex-1 w-full space-y-3 sm:space-y-4">
              <div className="h-5 sm:h-6 bg-gray-200 rounded w-36 sm:w-48"></div>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="text-center p-3 sm:p-4 border border-gray-100 rounded-lg space-y-2">
                    <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gray-200 rounded-full mx-auto"></div>
                    <div className="h-3 sm:h-4 bg-gray-200 rounded w-16 sm:w-20 mx-auto"></div>
                    <div className="h-2 sm:h-3 bg-gray-200 rounded w-20 sm:w-32 mx-auto"></div>
                  </div>
                ))}
              </div>
              <div className="h-2 sm:h-3 bg-gray-200 rounded w-48 sm:w-64"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function OffersPage() {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | Offer['type']>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [showMobileFilter, setShowMobileFilter] = useState(false);

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const getOfferIcon = (type: Offer['type']) => {
    switch (type) {
      case 'flash':
        return <FaBolt className="w-3 h-3 sm:w-4 sm:h-4" />;
      case 'seasonal':
        return <FaStar className="w-3 h-3 sm:w-4 sm:h-4" />;
      case 'bogo':
        return <FaGift className="w-3 h-3 sm:w-4 sm:h-4" />;
      case 'bundle':
        return <FaShoppingCart className="w-3 h-3 sm:w-4 sm:h-4" />;
      default:
        return <FaPercent className="w-3 h-3 sm:w-4 sm:h-4" />;
    }
  };

  const getOfferColor = (type: Offer['type']) => {
    switch (type) {
      case 'flash':
        return 'text-red-600 bg-red-50';
      case 'seasonal':
        return 'text-amber-600 bg-amber-50';
      case 'bogo':
        return 'text-purple-600 bg-purple-50';
      case 'bundle':
        return 'text-blue-600 bg-blue-50';
      default:
        return 'text-green-600 bg-green-50';
    }
  };

  const getFilterButtonClass = (type: string) => {
    const baseClass = "px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition whitespace-nowrap flex-shrink-0";
    if (filter === type) {
      if (type === 'flash') return `${baseClass} bg-red-600 text-white`;
      if (type === 'seasonal') return `${baseClass} bg-amber-600 text-white`;
      if (type === 'bogo') return `${baseClass} bg-purple-600 text-white`;
      if (type === 'bundle') return `${baseClass} bg-blue-600 text-white`;
      if (type === 'discount') return `${baseClass} bg-green-600 text-white`;
      return `${baseClass} bg-gray-900 text-white`;
    }
    return `${baseClass} bg-white text-gray-600 hover:bg-gray-100 border border-gray-200`;
  };

  const filteredOffers = filter === 'all' 
    ? offers 
    : offers.filter(offer => offer.type === filter);

  const featuredOffers = offers.filter(offer => offer.featured);

  // Show skeleton loading
  if (isLoading) {
    return <OffersPageSkeleton />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
                Special Offers
              </h1>
              <p className="text-sm sm:text-base text-gray-600 mt-1 sm:mt-2">
                Save big on your favorite herbal products
              </p>
            </div>
            <div className="hidden sm:block w-10 h-10 sm:w-12 sm:h-12 bg-green-50 rounded-full flex items-center justify-center">
              <FaTag className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
            </div>
          </div>

          {/* Desktop Filter Tabs */}
          <div className="hidden md:flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
            <button
              onClick={() => setFilter('all')}
              className={getFilterButtonClass('all')}
            >
              All Offers
            </button>
            {['flash', 'seasonal', 'bogo', 'bundle', 'discount'].map((type) => (
              <button
                key={type}
                onClick={() => setFilter(type as Offer['type'])}
                className={getFilterButtonClass(type)}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            ))}
          </div>

          {/* Mobile Filter Button */}
          <div className="md:hidden">
            <button
              onClick={() => setShowMobileFilter(true)}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 rounded-lg text-sm font-medium text-gray-700"
            >
              <FaFilter className="w-4 h-4" />
              Filter Offers
              <span className="ml-auto text-gray-500">
                {filter === 'all' ? 'All' : filter.charAt(0).toUpperCase() + filter.slice(1)}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Filter Modal */}
      {showMobileFilter && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setShowMobileFilter(false)} />
          <div className="fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Filter Offers</h3>
              <button
                onClick={() => setShowMobileFilter(false)}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <FaTimes className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-2">
              {['all', 'flash', 'seasonal', 'bogo', 'bundle', 'discount'].map((type) => (
                <button
                  key={type}
                  onClick={() => {
                    setFilter(type as typeof filter);
                    setShowMobileFilter(false);
                  }}
                  className={`w-full text-left px-4 py-3 rounded-lg ${
                    filter === type
                      ? type === 'flash' ? 'bg-red-600 text-white' :
                        type === 'seasonal' ? 'bg-amber-600 text-white' :
                        type === 'bogo' ? 'bg-purple-600 text-white' :
                        type === 'bundle' ? 'bg-blue-600 text-white' :
                        type === 'discount' ? 'bg-green-600 text-white' :
                        'bg-gray-900 text-white'
                      : 'bg-gray-50 text-gray-700'
                  }`}
                >
                  {type === 'all' ? 'All Offers' : type.charAt(0).toUpperCase() + type.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Featured Offers */}
        {featuredOffers.length > 0 && (
          <div className="mb-8 sm:mb-12">
            <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-red-500 to-orange-500 rounded-full flex items-center justify-center">
                <FaFire className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">
                Featured Deals
              </h2>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              {featuredOffers.map((offer) => (
                <div
                  key={offer.id}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 sm:gap-4 mb-3 sm:mb-4">
                    <div className="flex-1">
                      <div className={`inline-flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1 rounded-full text-xs font-semibold mb-2 sm:mb-3 ${getOfferColor(offer.type)}`}>
                        {getOfferIcon(offer.type)}
                        <span className="text-xs">{offer.type.toUpperCase()}</span>
                      </div>
                      <h3 className="text-base sm:text-lg lg:text-xl font-bold text-gray-900 mb-1 sm:mb-2">
                        {offer.title}
                      </h3>
                      <p className="text-sm sm:text-base text-gray-600">{offer.description}</p>
                    </div>
                    <div className={`text-xl sm:text-2xl font-bold px-3 sm:px-4 py-1 sm:py-2 rounded-lg text-center ${offer.type === 'flash' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
                      {offer.discount}
                    </div>
                  </div>
                  
                  <div className="space-y-2 sm:space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-600">
                      <div className="flex items-center gap-1 sm:gap-2">
                        <FaClock className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                        <span className="truncate">Valid until {new Date(offer.validUntil).toLocaleDateString()}</span>
                      </div>
                      {offer.minPurchase && (
                        <div className="flex items-center gap-1 sm:gap-2">
                          <FaShoppingCart className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                          <span>Min: PKR {offer.minPurchase.toLocaleString()}</span>
                        </div>
                      )}
                    </div>
                    
                    {offer.code && (
                      <div className="flex items-center justify-between bg-gray-50 rounded-lg p-2 sm:p-3">
                        <div className="min-w-0 flex-1 mr-2">
                          <p className="text-xs text-gray-500 mb-0.5">Promo Code</p>
                          <span className="font-mono font-bold text-gray-900 text-sm sm:text-base break-all">
                            {offer.code}
                          </span>
                        </div>
                        <button
                          onClick={() => copyCode(offer.code!)}
                          className="px-3 sm:px-4 py-1.5 sm:py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition text-xs sm:text-sm font-medium flex items-center gap-1 sm:gap-2 flex-shrink-0"
                        >
                          {copiedCode === offer.code ? (
                            <>
                              <FiCheck className="w-3 h-3 sm:w-4 sm:h-4" />
                              <span className="hidden xs:inline">Copied</span>
                            </>
                          ) : (
                            <>
                              <FiCopy className="w-3 h-3 sm:w-4 sm:h-4" />
                              <span className="hidden xs:inline">Copy</span>
                            </>
                          )}
                        </button>
                      </div>
                    )}
                    
                    <Link
                      href="/shop"
                      className="block w-full py-2 sm:py-3 bg-gray-900 text-white text-center rounded-lg hover:bg-gray-800 transition text-sm sm:text-base font-medium"
                    >
                      Shop Now
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* All Offers Grid */}
        <div>
          <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">
            All Offers
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {filteredOffers.map((offer) => (
              <div
                key={offer.id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
              >
                {/* Offer Header */}
                <div className="p-4 sm:p-6 border-b border-gray-100">
                  <div className="flex items-start justify-between gap-3 mb-2 sm:mb-3">
                    <div className="min-w-0 flex-1">
                      <div className={`inline-flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1 rounded-full text-xs font-semibold mb-1 sm:mb-2 ${getOfferColor(offer.type)}`}>
                        {getOfferIcon(offer.type)}
                        <span className="text-xs">{offer.type.toUpperCase()}</span>
                      </div>
                      <h3 className="text-sm sm:text-base lg:text-lg font-bold text-gray-900 truncate">
                        {offer.title}
                      </h3>
                    </div>
                    <span className={`text-base sm:text-lg lg:text-xl font-bold flex-shrink-0 ${offer.type === 'flash' ? 'text-red-600' : 'text-green-600'}`}>
                      {offer.discount}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-gray-600 line-clamp-2">
                    {offer.description}
                  </p>
                </div>

                {/* Offer Details */}
                <div className="p-4 sm:p-6">
                  <div className="space-y-2 sm:space-y-3 mb-3 sm:mb-4">
                    <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm text-gray-600">
                      <FaClock className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400 flex-shrink-0" />
                      <span className="truncate">Valid until {new Date(offer.validUntil).toLocaleDateString()}</span>
                    </div>
                    {offer.minPurchase && (
                      <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm text-gray-600">
                        <FaShoppingCart className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400 flex-shrink-0" />
                        <span className="truncate">Min: PKR {offer.minPurchase.toLocaleString()}</span>
                      </div>
                    )}
                  </div>

                  {/* Promo Code */}
                  {offer.code && (
                    <div className="mb-3 sm:mb-4">
                      <div className="flex items-center justify-between bg-gray-50 rounded-lg p-2 sm:p-3">
                        <div className="min-w-0 flex-1 mr-2">
                          <p className="text-xs text-gray-500 mb-0.5">Use code</p>
                          <span className="font-mono font-bold text-gray-900 text-xs sm:text-sm break-all">
                            {offer.code}
                          </span>
                        </div>
                        <button
                          onClick={() => copyCode(offer.code!)}
                          className="px-2 sm:px-3 py-1 sm:py-1.5 bg-gray-900 text-white rounded hover:bg-gray-800 transition text-xs font-medium flex items-center gap-1 flex-shrink-0"
                        >
                          {copiedCode === offer.code ? (
                            <FiCheck className="w-3 h-3" />
                          ) : (
                            <FiCopy className="w-3 h-3" />
                          )}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* CTA */}
                  <Link
                    href="/shop"
                    className="block w-full py-2 sm:py-3 bg-gray-900 text-white text-center rounded-lg hover:bg-gray-800 transition text-xs sm:text-sm font-medium"
                  >
                    View Products
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* No Results */}
          {filteredOffers.length === 0 && (
            <div className="text-center py-8 sm:py-12">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <FaTag className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" />
              </div>
              <h3 className="text-base sm:text-lg lg:text-xl font-semibold text-gray-900 mb-1 sm:mb-2">
                No offers found
              </h3>
              <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">
                Try selecting a different category
              </p>
              <button
                onClick={() => setFilter('all')}
                className="px-4 sm:px-6 py-2 sm:py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition text-sm sm:text-base font-medium"
              >
                Show All Offers
              </button>
            </div>
          )}
        </div>

        {/* How to Use Banner */}
        <div className="mt-8 sm:mt-12 bg-white rounded-xl border border-gray-200 p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row items-start gap-3 sm:gap-4">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-50 rounded-full flex items-center justify-center flex-shrink-0">
              <FaCheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
            </div>
            <div className="flex-1 w-full">
              <h3 className="text-sm sm:text-base font-medium text-gray-900 mb-2 sm:mb-3">
                How to Use Promo Codes
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4">
                {[
                  { step: '1', title: 'Add Products', desc: 'Select items and add to cart' },
                  { step: '2', title: 'Go to Checkout', desc: 'Proceed to checkout page' },
                  { step: '3', title: 'Apply Code', desc: 'Enter promo code in the field' },
                  { step: '4', title: 'Enjoy Savings', desc: 'Complete your purchase' }
                ].map((item) => (
                  <div key={item.step} className="text-center p-2 sm:p-4 border border-gray-100 rounded-lg">
                    <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gray-900 text-white rounded-full flex items-center justify-center text-xs sm:text-sm font-bold mx-auto mb-1 sm:mb-2">
                      {item.step}
                    </div>
                    <p className="font-medium text-gray-900 text-xs sm:text-sm mb-0.5 sm:mb-1">
                      {item.title}
                    </p>
                    <p className="text-xs text-gray-600 hidden sm:block">{item.desc}</p>
                    <p className="text-xs text-gray-600 sm:hidden">
                      {item.desc.split(' ').slice(0, 2).join(' ')}
                    </p>
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-3 sm:mt-4">
                * Terms and conditions apply. Offers cannot be combined unless specified.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}