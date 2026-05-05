'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FiSearch } from 'react-icons/fi';
import Categories from '@/app/Mobile/components/categories';
import SolutionBar from '@/app/Mobile/components/solutionbar';
import MobileFeaturedProducts from '@/app/Mobile/components/FeaturedProducts';
import MobileVideoProducts from '@/app/Mobile/components/VideoProducts';
import MobileReviews from '@/app/Mobile/components/Reviews';
import MobileBlogSection from '@/app/Mobile/components/BlogSection';
import MobileProductCard from '@/app/Mobile/components/ProductCard';
import { allProducts } from '@/app/Desktop/data/products';

// ── Static data ───────────────────────────────────────────────────────────────

const banners = [
  { id: 1, image: '/images/Banner.png',  title: 'Premium Ayurvedic', subtitle: 'Natural & Organic', link: '/shop'       },
  { id: 2, image: '/images/Banner2.png', title: 'Summer Sale',       subtitle: 'Up to 50% OFF',    link: '/offers'     },
  { id: 3, image: '/images/Banner3.png', title: 'New Collection',    subtitle: 'Fresh Arrivals',   link: '/newarrival' },
];

const fallbackColors = [
  'from-green-600 to-emerald-500',
  'from-orange-600 to-red-500',
  'from-purple-600 to-pink-500',
];

const menuTabs = [
  { id: 'all',                label: 'All'          },
  { id: 'new',                label: 'New In'       },
  { id: 'bestsellers',        label: 'Best Sellers' },
  { id: 'Oils',               label: 'Oils'         },
  { id: 'Herb',               label: 'Herbs'        },
  { id: 'Beauty Corner',      label: 'Beauty'       },
  { id: 'Supplements',        label: 'Supplements'  },
];

// ── Main page ─────────────────────────────────────────────────────────────────

export default function MobileHomePage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [activeTab,    setActiveTab]    = useState('all');
  const [isLoading,    setIsLoading]    = useState(true);
  const [imgErrors,    setImgErrors]    = useState<Record<number, boolean>>({});
  const tabScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const t = setTimeout(() => setIsLoading(false), 600);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const t = setInterval(() => setCurrentSlide(p => (p + 1) % banners.length), 5000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    if (tabScrollRef.current) {
      const el = tabScrollRef.current.querySelector(`[data-tab="${activeTab}"]`);
      el?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
  }, [activeTab]);

  const filteredProducts = (() => {
    switch (activeTab) {
      case 'all':         return allProducts.slice(0, 12);
      case 'new':         return allProducts.filter(p => p.isNew).slice(0, 12);
      case 'bestsellers': return allProducts.filter(p => p.isBestSeller).slice(0, 12);
      default:            return allProducts.filter(p => p.category === activeTab).slice(0, 12);
    }
  })();

  if (isLoading) return (
    <div className="min-h-screen bg-gray-50 animate-pulse">
      <div className="h-48 bg-gray-200 rounded-2xl mx-4 mt-4" />
      <div className="flex gap-3 px-4 mt-4 overflow-hidden">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex-shrink-0 flex flex-col items-center gap-1">
            <div className="w-14 h-14 bg-gray-200 rounded-full" />
            <div className="w-10 h-2.5 bg-gray-200 rounded" />
          </div>
        ))}
      </div>
      <div className="h-10 bg-gray-200 mx-4 mt-4 rounded-lg" />
      <div className="flex gap-2 px-4 mt-4 overflow-hidden">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex-shrink-0 h-9 w-20 bg-gray-200 rounded-full" />
        ))}
      </div>
      <div className="grid grid-cols-2 gap-3 px-4 mt-6">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="bg-white rounded-xl border border-gray-100 overflow-hidden">
            <div className="h-36 bg-gray-200" />
            <div className="p-2.5 space-y-2">
              <div className="h-3 bg-gray-200 rounded w-3/4" />
              <div className="h-3 bg-gray-200 rounded w-1/2" />
              <div className="flex justify-between items-center mt-1">
                <div className="h-4 bg-gray-200 rounded w-16" />
                <div className="w-7 h-7 bg-gray-200 rounded-full" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ── Hero Banner ── */}
      <div className="relative mx-4 mt-4 rounded-2xl overflow-hidden h-48">
        {banners.map((banner, index) => (
          <Link
            key={banner.id}
            href={banner.link}
            className={`absolute inset-0 transition-opacity duration-700 ${
              index === currentSlide ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
          >
            {!imgErrors[index] ? (
              <>
                <Image
                  src={banner.image}
                  alt={banner.title}
                  fill
                  className="object-cover object-center"
                  priority={index === 0}
                  onError={() => setImgErrors(prev => ({ ...prev, [index]: true }))}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent flex flex-col items-center justify-end pb-6 text-white">
                  <h2 className="text-xl font-bold drop-shadow">{banner.title}</h2>
                  <p className="text-sm opacity-90 drop-shadow">{banner.subtitle}</p>
                </div>
              </>
            ) : (
              <div className={`w-full h-full bg-gradient-to-br ${fallbackColors[index]} flex flex-col items-center justify-center text-white px-6`}>
                <h2 className="text-2xl font-bold mb-1">{banner.title}</h2>
                <p className="text-sm opacity-90">{banner.subtitle}</p>
              </div>
            )}
          </Link>
        ))}

        {/* Dots */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
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


      {/* ── Solution Bar ── */}
      <SolutionBar />

      {/* ── Featured Products ── */}
      <MobileFeaturedProducts />

      {/* ── Categories ── */}
      <Categories />

      {/* ── Shop by Tab + Products ── */}
      <div className="bg-white mt-2 rounded-t-2xl shadow-sm">

        {/* Section heading */}
        <div className="flex items-center justify-between px-4 pt-5 pb-2">
          <h2 className="text-base font-bold text-gray-900">Shop <span className="me-color-y">Products</span></h2>
          <Link
            href={`/shop${activeTab !== 'all' ? `?category=${activeTab}` : ''}`}
            className="text-sm text-green-700 font-medium"
          >
            View All
          </Link>
        </div>

        {/* Tabs */}
        <div className="sticky top-0 z-20 bg-white border-b border-gray-100">
          <div
            ref={tabScrollRef}
            className="flex gap-2 overflow-x-auto px-4 py-2.5 no-scrollbar"
          >
            {menuTabs.map(tab => (
              <button
                key={tab.id}
                data-tab={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-1.5 rounded-full whitespace-nowrap text-sm font-medium transition-all flex-shrink-0 ${
                  activeTab === tab.id
                    ? 'bg-green-700 text-white'
                    : 'bg-gray-100 text-gray-600 active:scale-95'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Products grid */}
        <div className="px-4 pt-4 pb-6">
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-2 gap-3">
              {filteredProducts.map(product => (
                <MobileProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <FiSearch className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 text-sm">No products found</p>
            </div>
          )}

          {filteredProducts.length > 0 && (
            <div className="text-center mt-5">
              <Link
                href={`/shop${activeTab !== 'all' ? `?category=${activeTab}` : ''}`}
                className="inline-block px-8 py-2.5 bg-green-700 text-white text-sm font-medium rounded-full hover:bg-green-600 transition-colors active:scale-95"
              >
                View All Products
              </Link>
            </div>
          )}
        </div>

      </div>

      {/* ── Video Products ── */}
      <MobileVideoProducts />

      {/* ── Reviews ── */}
      <MobileReviews />

      {/* ── Blog ── */}
      <MobileBlogSection />

    </div>
  );
}
