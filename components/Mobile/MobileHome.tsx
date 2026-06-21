'use client';

import dynamic from 'next/dynamic';
import HeroBanner from './components/HeroBanner';
import SolutionBar from './components/solutionbar';

const CategoryProductsSection = dynamic(
  () => import('@/components/Desktop/Sections/CategoryProductsSection'),
  { ssr: false },
);

// Lazy load below-the-fold components with SSR disabled for faster initial load
const Categories = dynamic(() => import('./components/categories'), { ssr: false });
const ShopProducts = dynamic(() => import('./components/ShopProducts'), { ssr: false });
const MobileVideoProducts = dynamic(() => import('./components/VideoProducts'), { ssr: false });
const MobileComboDeal = dynamic(() => import('./components/ComboDeal'), { ssr: false });
const MobileReviews = dynamic(() => import('./components/Reviews'), { ssr: false });
const MobileBlogSection = dynamic(() => import('./components/BlogSection'), { ssr: false });

export default function MobileHome() {
  return (
    <div className="min-h-screen bg-gray-50">
      <HeroBanner />
      <SolutionBar />
      <CategoryProductsSection variant="mobile" />
      <Categories />
      <ShopProducts />
      <MobileComboDeal />
      <MobileVideoProducts />
      <MobileReviews />
      <MobileBlogSection />
    </div>
  );
}
