'use client';

import dynamic from 'next/dynamic';
import { Suspense, useEffect, useState } from 'react';
import SolutionBar from './components/solutionbar';

import { getHomepageData, EMPTY_HOMEPAGE, type HomepageData } from '@/lib/homepage';

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

const MobileVideoProducts = dynamic(() => import('./components/VideoProducts'), { ssr: false });
const MobileComboDeal = dynamic(() => import('./components/ComboDeal'), { ssr: false });
const MobileReviews = dynamic(() => import('./components/Reviews'), { ssr: false });
const MobileBlogSection = dynamic(() => import('./components/BlogSection'), { ssr: false });

export default function MobileHome() {
  const [homepageData, setHomepageData] = useState<HomepageData>(EMPTY_HOMEPAGE);

  useEffect(() => {
    let active = true;
    getHomepageData().then(data => {
      if (active) setHomepageData(data);
    });
    return () => { active = false; };
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Suspense fallback={<HeroBannerFallback />}>
        <HeroBanner slides={homepageData.banners} />
      </Suspense>
      <SolutionBar />
      <Categories />
      <Suspense fallback={null}>
        <CategoryProductsSection variant="mobile" data={homepageData.category_products} />
      </Suspense>
      {/* <ShopProducts /> */}
      <MobileComboDeal />
      <Suspense fallback={null}>
        <MobileVideoProducts products={homepageData.video_products} />
      </Suspense>
      <Suspense fallback={null}>
        <MobileReviews reviews={homepageData.reviews} />
      </Suspense>
      <Suspense fallback={null}>
        <MobileBlogSection posts={homepageData.blogs} />
      </Suspense>
    </div>
  );
}
