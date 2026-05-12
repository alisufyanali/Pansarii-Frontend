"use client";

import { useState, useEffect, Suspense, lazy } from 'react';

// Lazy load all sections — they only load after skeleton disappears
const Banner          = lazy(() => import("../../../components/Desktop/Sections/Banner"));
const SolutionBar     = lazy(() => import("../../../components/Desktop/Sections/SolutionBar"));
const FeaturedProducts = lazy(() => import("../../../components/Desktop/Sections/FeaturedProducts"));
const Category        = lazy(() => import("../../../components/Desktop/Sections/Category"));
const NewArrivals     = lazy(() => import("../../../components/Desktop/Sections/NewArrivals"));
const BeautyCorner    = lazy(() => import("../../../components/Desktop/Sections/BeautyCorner"));
const PansariInn      = lazy(() => import("../../../components/Desktop/Sections/Pureinnoils"));
const ComboDeal       = lazy(() => import("../../../components/Desktop/Sections/ComboDeal"));
const VideoProducts   = lazy(() => import("../../../components/Desktop/Sections/VideoProducts"));
const Review          = lazy(() => import("../../../components/Desktop/Sections/Review"));
const Blog            = lazy(() => import("../../../components/Desktop/Sections/Blog"));

// ─── Generic shimmer block ────────────────────────────────────────────────────
function Shimmer({ className = '', style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <div className={`bg-gray-200 rounded-lg animate-pulse ${className}`} style={style} />
  );
}

// ─── Reusable skeleton row (header + cards) ───────────────────────────────────
function SectionSkeleton({
  cards = 4,
  cardH = 'h-64',
  hasViewAll = false,
}: {
  cards?: number;
  cardH?: string;
  hasViewAll?: boolean;
}) {
  return (
    <div className="mx-[4%] my-8">
      <div className="max-w-[1920px] mx-auto">
        {/* Header */}
        <div className="mb-5 flex items-center justify-between">
          <Shimmer className="h-8 w-48" />
          {hasViewAll
            ? <Shimmer className="h-9 w-36 rounded-full" />
            : (
              <div className="flex gap-2">
                <Shimmer className="w-10 h-10 rounded-full" />
                <Shimmer className="w-10 h-10 rounded-full" />
              </div>
            )
          }
        </div>
        {/* Cards */}
        <div className="flex gap-6 overflow-hidden pb-4">
          {[...Array(cards)].map((_, i) => (
            <Shimmer
              key={i}
              className={`flex-shrink-0 ${cardH}`}
              style={{ width: `calc((min(100vw, 1920px) - 8vw - ${(cards - 1) * 24}px) / ${cards})` } as React.CSSProperties}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Section with banner skeleton ─────────────────────────────────────────────
function BannerSectionSkeleton({ cards = 5 }: { cards?: number }) {
  return (
    <div className="mt-12 animate-pulse">
      <Shimmer className="w-full h-[70vh] min-h-[30rem] max-h-[45rem] rounded-none" />
      <SectionSkeleton cards={cards} cardH="h-72" hasViewAll />
    </div>
  );
}

// ─── Full page skeleton ───────────────────────────────────────────────────────
function PageSkeleton() {
  return (
    <div className="animate-pulse">
      {/* Banner */}
      <Shimmer className="w-full h-[60vh] min-h-[420px] max-h-[680px] rounded-none" />

      {/* SolutionBar */}
      <SectionSkeleton cards={5} cardH="h-[clamp(180px,18vw,240px)]" />

      {/* Featured Products */}
      <SectionSkeleton cards={4} cardH="h-64" />

      {/* Category */}
      <div className="mx-[4%] my-8">
        <div className="max-w-[1920px] mx-auto">
          <Shimmer className="h-8 w-48 mb-5" />
          <div className="grid grid-cols-3 md:grid-cols-6 gap-4 lg:gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="flex flex-col gap-2">
                <Shimmer className="w-full aspect-[191/201] rounded-t-[40%]" />
                <Shimmer className="w-full h-[50px]" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* New Arrivals */}
      <SectionSkeleton cards={5} cardH="h-64" />

      {/* BeautyCorner */}
      <BannerSectionSkeleton cards={4} />

      {/* PureInn Oils + Herbal */}
      <BannerSectionSkeleton cards={5} />
      <BannerSectionSkeleton cards={5} />

      {/* Combo Deal */}
      <BannerSectionSkeleton cards={4} />

      {/* Video Products */}
      <SectionSkeleton cards={5} cardH="h-[clamp(260px,28vw,400px)]" />

      {/* Reviews */}
      <SectionSkeleton cards={4} cardH="h-[clamp(200px,22vw,300px)]" />

      {/* Blog */}
      <div className="mx-[4%] my-8">
        <div className="max-w-[1920px] mx-auto">
          <div className="mb-5 flex items-center justify-between">
            <div className="flex flex-col gap-2">
              <Shimmer className="h-8 w-48" />
              <Shimmer className="h-4 w-64" />
            </div>
            <Shimmer className="h-9 w-36 rounded-full" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex flex-col gap-2">
                <Shimmer className="w-full aspect-video rounded-2xl" />
                <Shimmer className="h-4 w-3/4" />
                <Shimmer className="h-3 w-full" />
                <Shimmer className="h-3 w-2/3" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function HomePage() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setIsLoading(false), 1200);
    return () => clearTimeout(t);
  }, []);

  if (isLoading) return <PageSkeleton />;

  return (
    <Suspense fallback={<PageSkeleton />}>
      <Banner />
      <SolutionBar />
      <FeaturedProducts />
      <Category />
      <NewArrivals />
      <BeautyCorner />
      <PansariInn />
      <ComboDeal />
      <VideoProducts />
      <Review />
      <Blog />
    </Suspense>
  );
}
