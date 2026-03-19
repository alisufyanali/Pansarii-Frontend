// app/Mobile/page.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Categories from '@/app/Mobile/components/categories';
import SolutionBar from '@/app/Mobile/components/solutionbar';
import MobileProductCard, { toMobileCardProps } from '@/app/Mobile/components/ProductCard';
import { allProducts } from '@/app/Desktop/data/products';

export default function MobileHomePage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [activeTab, setActiveTab] = useState('all');
  const tabScrollRef = useRef<HTMLDivElement>(null);

  // Hero Banners
  const banners = [
    {
      id: 1,
      title: 'Premium Ayurvedic',
      subtitle: 'Natural & Organic',
      color: 'from-green-600 to-emerald-500',
      link: '/shop'
    },
    {
      id: 2,
      title: 'Summer Sale',
      subtitle: 'Up to 50% OFF',
      color: 'from-orange-600 to-red-500',
      link: '/offers'
    },
    {
      id: 3,
      title: 'New Collection',
      subtitle: 'Fresh Arrivals',
      color: 'from-purple-600 to-pink-500',
      link: '/new-arrivals'
    },
  ];

  // Menu Tabs
  const menuTabs = [
    { id: 'all', label: 'All' },
    { id: 'new', label: 'New In' },
    { id: 'bestsellers', label: 'Best Sellers' },
    { id: 'Oils & Ghee', label: 'Oils' },
    { id: 'Herbs & Spices', label: 'Herbs' },
    { id: 'Honey & Sweeteners', label: 'Honey' },
    { id: 'Beauty & Skincare', label: 'Beauty' },
    { id: 'Tea & Beverages', label: 'Tea' },
  ];

  // Filter products based on active tab
  const getFilteredProducts = () => {
    switch(activeTab) {
      case 'all':
        return allProducts.slice(0, 12);
      case 'new':
        return allProducts.filter(p => p.isNew).slice(0, 12);
      case 'bestsellers':
        return allProducts.filter(p => p.isBestSeller).slice(0, 12);
      default:
        return allProducts.filter(p => p.category === activeTab).slice(0, 12);
    }
  };

  const filteredProducts = getFilteredProducts();

  // Auto-slide banners
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [banners.length]);

  // Auto-scroll to active tab
  useEffect(() => {
    if (tabScrollRef.current) {
      const activeElement = tabScrollRef.current.querySelector(`[data-tab="${activeTab}"]`);
      activeElement?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
  }, [activeTab]);

  return (
    <div className="min-h-screen ">
      
      {/* Hero Banner Slider */}
      <div className="relative h-48 overflow-hidden  rounded-2xl mx-4 mt-4">
        {banners.map((banner, index) => (
          <Link
            key={banner.id}
            href={banner.link}
            className={`absolute inset-0 transition-opacity duration-700 ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <div className={`w-full h-full bg-gradient-to-br ${banner.color} flex flex-col items-center justify-center text-white px-6`}>
              <h2 className="text-2xl font-bold mb-1">{banner.title}</h2>
              <p className="text-sm opacity-90">{banner.subtitle}</p>
            </div>
          </Link>
        ))}
        
        {/* Dots */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
          {banners.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`h-1.5 rounded-full transition-all ${
                idx === currentSlide ? 'w-6 bg-white' : 'w-1.5 bg-white/60'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Categories */}
      <div className="px-4 py-6">
        <Categories />
      </div>

      {/* Solution Bar */}
      <div className="px-4 py-4">
        <SolutionBar />
      </div>

      {/* Tabs - Sticky */}
      <div className="sticky top-0 z-20 bg-white border-y border-gray-200">
        <div 
          ref={tabScrollRef}
          className="flex gap-2 overflow-x-auto px-4 py-3 scrollbar-hide"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {menuTabs.map((tab) => (
            <button
              key={tab.id}
              data-tab={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-full whitespace-nowrap text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-green-700 text-white'
                  : 'bg-gray-100 text-gray-700 active:scale-95'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Products Section */}
      <div className="px-4 py-6">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">
            {menuTabs.find(t => t.id === activeTab)?.label || 'All'} Products
          </h2>
          <a 
            href={`/shop${activeTab !== 'all' ? `?category=${activeTab}` : ''}`}
            className="text-sm text-[#197B33] font-medium hover:underline"
          >
            View All →
          </a>
        </div>

        {/* Product Grid - 2 columns */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 gap-3">
            {filteredProducts.map((product) => (
              <MobileProductCard 
                key={product.id} 
                {...toMobileCardProps(product)} 
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="text-5xl mb-3">🔍</div>
            <p className="text-gray-500 text-sm">No products found</p>
          </div>
        )}

        {/* Load More Button */}
        {filteredProducts.length > 0 && (
          <div className="text-center mt-6">
            <a
              href={`/shop${activeTab !== 'all' ? `?category=${activeTab}` : ''}`}
              className="inline-block px-8 py-3 bg-green-700 text-white font-medium rounded-lg hover:bg-green-600 transition-colors active:scale-95"
            >
              View All Products
            </a>
          </div>
        )}
      </div>

      {/* CSS for hiding scrollbar */}
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