'use client';

import HeroBanner          from './components/HeroBanner';
import Categories          from './components/categories';
import SolutionBar         from './components/solutionbar';
import MobileFeaturedProducts from './components/FeaturedProducts';
import ShopProducts        from './components/ShopProducts';
import MobileVideoProducts from './components/VideoProducts';
import MobileComboDeal     from './components/ComboDeal';
import MobileReviews       from './components/Reviews';
import MobileBlogSection   from './components/BlogSection';

export default function MobileHome() {
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
