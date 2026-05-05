'use client';

import { useState, useEffect } from 'react';
import HeroBanner          from '@/app/Mobile/components/HeroBanner';
import Categories          from '@/app/Mobile/components/categories';
import SolutionBar         from '@/app/Mobile/components/solutionbar';
import MobileFeaturedProducts from '@/app/Mobile/components/FeaturedProducts';
import ShopProducts        from '@/app/Mobile/components/ShopProducts';
import MobileVideoProducts from '@/app/Mobile/components/VideoProducts';
import MobileComboDeal     from '@/app/Mobile/components/ComboDeal';
import MobileReviews       from '@/app/Mobile/components/Reviews';
import MobileBlogSection   from '@/app/Mobile/components/BlogSection';

export default function MobileHomePage() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setIsLoading(false), 600);
    return () => clearTimeout(t);
  }, []);

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
      <HeroBanner />
      <SolutionBar />
      <MobileFeaturedProducts />
      <Categories />
      <ShopProducts />
      <MobileComboDeal />
      <MobileVideoProducts />
      <MobileReviews />
      <MobileBlogSection />
    </div>
  );
}
