'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import SolutionBar from './components/solutionbar';

const HeroBanner = dynamic(() => import('./components/HeroBanner'), { ssr: false });

function HeroBannerFallback() {
  return (
    <div className="relative mx-4 mt-4 rounded-2xl overflow-hidden h-48 bg-gray-200 animate-pulse" />
  );
}

const CategoryProductsSection = dynamic(
  () => import('@/components/Desktop/Sections/CategoryProductsSection'),
  { ssr: false },
);

const Categories = dynamic(() => import('./components/categories'), { ssr: false });
const ShopProducts = dynamic(() => import('./components/ShopProducts'), { ssr: false });
const MobileVideoProducts = dynamic(() => import('./components/VideoProducts'), { ssr: false });
const MobileComboDeal = dynamic(() => import('./components/ComboDeal'), { ssr: false });
const MobileReviews = dynamic(() => import('./components/Reviews'), { ssr: false });
const MobileBlogSection = dynamic(() => import('./components/BlogSection'), { ssr: false });

export default function MobileHome() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Suspense fallback={<HeroBannerFallback />}>
        <HeroBanner />
      </Suspense>
      <SolutionBar />
      <Suspense fallback={null}>
        <CategoryProductsSection variant="mobile" />
      </Suspense>
      <Categories />
      <ShopProducts />
      <MobileComboDeal />
      <Suspense fallback={null}>
        <MobileVideoProducts />
      </Suspense>
      <Suspense fallback={null}>
        <MobileReviews />
      </Suspense>
      <Suspense fallback={null}>
        <MobileBlogSection />
      </Suspense>
    </div>
  );
}
