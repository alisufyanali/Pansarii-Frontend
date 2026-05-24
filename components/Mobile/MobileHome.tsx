'use client';

import dynamic from 'next/dynamic';
import HeroBanner from './components/HeroBanner';
import SolutionBar from './components/solutionbar';

// Lazy load below-the-fold components
const Categories = dynamic(() => import('./components/categories'));
const MobileFeaturedProducts = dynamic(() => import('./components/FeaturedProducts'));
const ShopProducts = dynamic(() => import('./components/ShopProducts'));
const MobileVideoProducts = dynamic(() => import('./components/VideoProducts'));
const MobileComboDeal = dynamic(() => import('./components/ComboDeal'));
const MobileReviews = dynamic(() => import('./components/Reviews'));
const MobileBlogSection = dynamic(() => import('./components/BlogSection'));

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
