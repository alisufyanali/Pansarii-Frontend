'use client';

import dynamic from 'next/dynamic';
import { Suspense, useEffect, useState } from 'react';

import { getHomepageData, EMPTY_HOMEPAGE, type HomepageData } from '@/lib/homepage';

const Banner = dynamic(() => import("./Sections/Banner"), { ssr: false });

function BannerFallback() {
  return (
    <section className="relative w-full overflow-hidden h-[70vh] min-h-[460px] max-h-[680px] bg-gray-200 animate-pulse" />
  );
}

// Lazy load below-the-fold sections only
const SolutionBar     = dynamic(() => import("./Sections/SolutionBar"), { ssr: false });
const CategoryProductsSection = dynamic(() => import("./Sections/CategoryProductsSection"), { ssr: false });
const Category        = dynamic(() => import("./Sections/Category"), { ssr: false });
const NewArrivals     = dynamic(() => import("./Sections/NewArrivals"), { ssr: false });
const BeautyCorner    = dynamic(() => import("./Sections/BeautyCorner"), { ssr: false });
const PansariInn      = dynamic(() => import("./Sections/Pureinnoils"), { ssr: false });
const ComboDeal       = dynamic(() => import("./Sections/ComboDeal"), { ssr: false });
const VideoProducts   = dynamic(() => import("./Sections/VideoProducts"), { ssr: false });
const Review          = dynamic(() => import("./Sections/Review"), { ssr: false });
const Blog            = dynamic(() => import("./Sections/Blog"), { ssr: false });

export default function DesktopHome() {
  const [homepageData, setHomepageData] = useState<HomepageData>(EMPTY_HOMEPAGE);

  useEffect(() => {
    let active = true;
    getHomepageData().then(data => {
      if (active) setHomepageData(data);
    });
    return () => { active = false; };
  }, []);

  return (
    <>
      <Suspense fallback={<BannerFallback />}>
        <Banner slides={homepageData.banners} />
      </Suspense>
      <SolutionBar />
      <Category />
      <NewArrivals products={homepageData.new_arrivals} />
      <Suspense fallback={null}>
        <CategoryProductsSection data={homepageData.category_products} />
      </Suspense>
      {/* <BeautyCorner />
      <PansariInn /> */}
      <ComboDeal />
      <Suspense fallback={null}>
        <VideoProducts products={homepageData.video_products} />
      </Suspense>
      <Suspense fallback={null}>
        <Review reviews={homepageData.reviews} />
      </Suspense>
      <Suspense fallback={null}>
        <Blog posts={homepageData.blogs} />
      </Suspense>
    </>
  );
}
