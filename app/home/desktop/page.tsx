"use client";
import Banner from "../../Desktop/Sections/Banner";
import BeautyCorner from "../../Desktop/Sections/BeautyCorner";
import Blog from "../../Desktop/Sections/Blog";
import Category from "../../Desktop/Sections/Category";
import ComboDeal from "../../Desktop/Sections/ComboDeal";
import FeaturedProducts from "../../Desktop/Sections/FeaturedProducts";
import NewArrivals from "../../Desktop/Sections/NewArrivals";
import PansariInn from "../../Desktop/Sections/Pureinnoils";
import Review from "../../Desktop/Sections/Review";
import SolutionBar from "../../Desktop/Sections/SolutionBar";
import VideoProducts from "../../Desktop/Sections/VideoProducts";
import { useState, useEffect } from 'react';

// ─── Skeleton helpers ────────────────────────────────────────────────────────

// Reusable horizontal scroll skeleton row
function HScrollSkeleton({ cardWidth, cardHeight = 'h-96', count = 5 }: {
  cardWidth: string;
  cardHeight?: string;
  count?: number;
}) {
  return (
    <div className="flex gap-6 overflow-hidden pb-4">
      {[...Array(count)].map((_, i) => (
        <div key={i} className={`flex-shrink-0 ${cardHeight} bg-gray-200 rounded-lg`} style={{ width: cardWidth }} />
      ))}
    </div>
  );
}

// Section header skeleton
function SectionHeaderSkeleton({ arrows = true }: { arrows?: boolean }) {
  return (
    <div className="mb-6 flex items-center justify-between">
      <div className="h-8 bg-gray-200 rounded w-48" />
      {arrows && (
        <div className="flex gap-2">
          <div className="w-10 h-10 bg-gray-200 rounded-full" />
          <div className="w-10 h-10 bg-gray-200 rounded-full" />
        </div>
      )}
    </div>
  );
}

// ─── Individual skeletons ─────────────────────────────────────────────────────

function BannerSkeleton() {
  return (
    <section className="relative w-full h-[90vh] flex animate-pulse">
      <div className="absolute inset-0 w-full h-full bg-gray-200" />
      <div className="relative z-10 flex w-full px-[4%]">
        <div className="max-w-[1920px] mx-auto flex w-full">
          <div className="w-1/2 flex flex-col justify-center px-4 xl:px-12 gap-4">
            <div className="h-5 bg-gray-300 rounded w-48" />
            <div className="h-16 bg-gray-300 rounded w-64" />
            <div className="h-4 bg-gray-300 rounded w-80" />
            <div className="h-4 bg-gray-300 rounded w-72" />
            <div className="mt-6 flex gap-4">
              <div className="h-12 bg-gray-300 rounded-full w-32" />
              <div className="h-12 bg-gray-300 rounded-full w-44" />
            </div>
          </div>
          <div className="w-1/2" />
        </div>
      </div>
    </section>
  );
}

function SolutionBarSkeleton() {
  return (
    <section className="mx-[4%] my-8 animate-pulse">
      <div className="max-w-[1920px] mx-auto">
        <SectionHeaderSkeleton />
        {/* 5 cards, alternating offset like real component */}
        <div className="flex gap-4 overflow-hidden pb-4">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className={`flex-shrink-0 rounded-lg bg-gray-200 ${i % 2 !== 0 ? 'mt-8' : ''}`}
              style={{
                width: 'calc((min(100vw, 1920px) - 8vw - 64px) / 5)',
                height: '270px',
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function FeaturedProductsSkeleton() {
  return (
    <section className="mt-8 mx-[4%] my-4 animate-pulse">
      <div className="max-w-[1920px] mx-auto">
        <SectionHeaderSkeleton />
        <HScrollSkeleton
          cardWidth="calc((min(100vw, 1920px) - 8vw - 96px) / 4)"
          count={4}
        />
      </div>
    </section>
  );
}

function CategorySkeleton() {
  return (
    <div className="p-4 mx-[4%] animate-pulse">
      <div className="max-w-[1920px] mx-auto">
        <div className="h-8 bg-gray-200 rounded w-48 mb-6" />
        {/* 5 cols on laptop */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 2xl:grid-cols-6 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="flex flex-col">
              <div className="w-full aspect-[191/201] bg-gray-200 rounded-t-[113px]" />
              <div className="w-full h-[50px] bg-gray-200 rounded mt-2" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function NewArrivalsSkeleton() {
  return (
    <section className="mt-12 mx-[4%] animate-pulse">
      <div className="max-w-[1920px] mx-auto">
        <SectionHeaderSkeleton />
        {/* 5 equal-width cards */}
        <HScrollSkeleton
          cardWidth="calc((min(100vw, 1920px) - 8vw - 96px) / 5)"
          count={5}
        />
      </div>
    </section>
  );
}

function BeautyCornerSkeleton() {
  return (
    <div className="mt-12 animate-pulse">
      {/* Banner 85vh */}
      <section className="w-full bg-gray-200" style={{ height: '85vh' }} />
      <div className="mx-[4%]">
        <div className="max-w-[1920px] mx-auto">
          <div className="mt-16 mb-6 flex items-center justify-between">
            <div className="h-8 bg-gray-200 rounded w-48" />
            <div className="flex items-center gap-4">
              <div className="h-5 bg-gray-200 rounded w-16" />
              <div className="w-10 h-10 bg-gray-200 rounded-full" />
            </div>
          </div>
          {/* 4 cards on laptop, scales up */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 2xl:grid-cols-6 gap-6 pb-20">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-gray-200 rounded-lg h-96" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function PansariInnSectionSkeleton({ bannerImg }: { bannerImg?: string }) {
  return (
    <div className="mt-12 animate-pulse">
      {/* Banner 85vh */}
      <section className="w-full bg-gray-200" style={{ height: '85vh' }} />
      <div className="mx-[4%]">
        <div className="max-w-[1920px] mx-auto">
          <div className="mt-16 mb-6 flex items-center justify-between">
            <div className="h-8 bg-gray-200 rounded w-48" />
            <div className="flex items-center gap-4">
              <div className="h-5 bg-gray-200 rounded w-16" />
              <div className="w-10 h-10 bg-gray-200 rounded-full" />
            </div>
          </div>
          {/* 5 equal-width cards matching PansariInn layout */}
          <div className="flex gap-6 flex-wrap pb-20">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="bg-gray-200 rounded-lg h-96"
                style={{
                  width: 'calc((min(100vw, 1920px) - 8vw - 96px) / 5)',
                  minWidth: '200px',
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function PansariInnSkeleton() {
  return (
    <>
      <PansariInnSectionSkeleton />
      <PansariInnSectionSkeleton />
    </>
  );
}

function ComboDealSkeleton() {
  return (
    <div className="mt-12 animate-pulse">
      {/* Banner same height as real component */}
      <section className="w-full bg-gray-200" style={{ height: '1104px' }} />
      <div className="mx-[4%]">
        <div className="max-w-[1920px] mx-auto">
          <SectionHeaderSkeleton />
          {/* 4 equal-width cards */}
          <HScrollSkeleton
            cardWidth="calc((min(100vw, 1920px) - 8vw - 96px) / 4)"
            count={4}
          />
        </div>
      </div>
    </div>
  );
}

function VideoProductsSkeleton() {
  return (
    <section className="my-12 mx-[4%] animate-pulse">
      <div className="max-w-[1920px] mx-auto">
        <div className="text-center mb-8">
          <div className="h-8 bg-gray-200 rounded w-48 inline-block" />
        </div>
        <HScrollSkeleton
          cardWidth="calc((min(100vw, 1920px) - 8vw - 96px) / 4)"
          cardHeight="h-[400px]"
          count={4}
        />
      </div>
    </section>
  );
}

function ReviewSkeleton() {
  return (
    <section className="my-12 mx-[4%] animate-pulse">
      <div className="max-w-[1920px] mx-auto">
        <div className="text-center mb-16">
          <div className="h-12 bg-gray-200 rounded w-96 mx-auto mb-4" />
          <div className="h-5 bg-gray-200 rounded w-[500px] mx-auto" />
        </div>
        {/* 3 equal review cards */}
        <HScrollSkeleton
          cardWidth="calc((min(100vw, 1920px) - 8vw - 96px) / 3)"
          cardHeight="h-[303px]"
          count={3}
        />
      </div>
    </section>
  );
}

function BlogSkeleton() {
  return (
    <section className="my-16 mx-[4%] animate-pulse">
      <div className="max-w-[1920px] mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10">
          <div>
            <div className="h-10 bg-gray-200 rounded w-48 mb-2" />
            <div className="h-4 bg-gray-200 rounded w-64" />
          </div>
          <div className="mt-4 md:mt-0 h-12 bg-gray-200 rounded-lg w-40" />
        </div>
        {/* 3-col grid matching Blog layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-gray-200 rounded-lg h-[300px]" />
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function HomePage() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <>
        <BannerSkeleton />
        <SolutionBarSkeleton />
        <FeaturedProductsSkeleton />
        <CategorySkeleton />
        <NewArrivalsSkeleton />
        <BeautyCornerSkeleton />
        <PansariInnSkeleton />
        <ComboDealSkeleton />
        <VideoProductsSkeleton />
        <ReviewSkeleton />
        <BlogSkeleton />
      </>
    );
  }

  return (
    <>
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
    </>
  );
}