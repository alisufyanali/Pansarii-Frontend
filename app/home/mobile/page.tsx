'use client';

import HeroBanner          from '@/components/Mobile/components/HeroBanner';
import Categories          from '@/components/Mobile/components/categories';
import SolutionBar         from '@/components/Mobile/components/solutionbar';
import MobileFeaturedProducts from '@/components/Mobile/components/FeaturedProducts';
import ShopProducts        from '@/components/Mobile/components/ShopProducts';
import MobileVideoProducts from '@/components/Mobile/components/VideoProducts';
import MobileComboDeal     from '@/components/Mobile/components/ComboDeal';
import MobileReviews       from '@/components/Mobile/components/Reviews';
import MobileBlogSection   from '@/components/Mobile/components/BlogSection';

export default function MobileHomePage() {
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
