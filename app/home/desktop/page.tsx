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

// Skeletal Loading Components
function BannerSkeleton() {
  return (
    <section className="relative w-full h-screen flex animate-pulse">
      <div className="absolute inset-0 w-full h-full bg-gray-200"></div>
      <div className="relative z-10 flex w-full" style={{ marginLeft: '4%', marginRight: '4%' }}>
        <div className="w-1/2 flex flex-col justify-center px-12 gap-4">
          <div className="h-6 bg-gray-300 rounded w-48"></div>
          <div className="h-16 bg-gray-300 rounded w-64"></div>
          <div className="h-4 bg-gray-300 rounded w-80"></div>
          <div className="h-4 bg-gray-300 rounded w-96"></div>
          <div className="mt-6 flex gap-4">
            <div className="h-12 bg-gray-300 rounded-full w-32"></div>
            <div className="h-12 bg-gray-300 rounded-full w-40"></div>
          </div>
        </div>
        <div className="w-1/2"></div>
      </div>
    </section>
  );
}

function SolutionBarSkeleton() {
  return (
    <section className="SolutionBar mx-[4%] my-8 animate-pulse">
      <div className="top-solutionbar mb-6 flex items-center justify-between">
        <div className="h-8 bg-gray-200 rounded w-48"></div>
        <div className="flex gap-2">
          <div className="w-10 h-10 bg-gray-200 rounded"></div>
          <div className="w-10 h-10 bg-gray-200 rounded"></div>
        </div>
      </div>
      <div className="slide flex overflow-x-auto pb-4">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className={`shrink-0 rounded-lg p-4 ${i % 2 === 0 ? 'mt-8' : ''}`}
            style={{
              width: 'calc(19% - 12.8px)',
              marginRight: i === 4 ? '0' : '16px',
              height: '270px',
              backgroundColor: '#e5e7eb',
            }}
          />
        ))}
      </div>
    </section>
  );
}

function FeaturedProductsSkeleton() {
  return (
    <section className="mt-8 font-poppins mx-[4%] my-4 animate-pulse">
      <div className="mb-4 flex items-center justify-between">
        <div className="h-8 bg-gray-200 rounded w-48"></div>
        <div className="flex gap-2">
          <div className="w-10 h-10 bg-gray-200 rounded"></div>
          <div className="w-10 h-10 bg-gray-200 rounded"></div>
        </div>
      </div>
      <div className="flex gap-6 overflow-x-auto pb-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="flex-shrink-0" style={{ width: '280px' }}>
            <div className="bg-gray-200 rounded-lg h-96"></div>
          </div>
        ))}
      </div>
    </section>
  );
}

function CategorySkeleton() {
  return (
    <div className="p-4 mx-[4%] animate-pulse">
      <div className="mb-6">
        <div className="h-8 bg-gray-200 rounded w-48"></div>
      </div>
      <div className="flex flex-wrap gap-6 justify-center">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="flex-1 min-w-[120px] max-w-[200px]">
            <div
              className="w-full aspect-[191/201] mb-2 bg-gray-200 rounded-t-[113px]"
            />
            <div className="w-full h-[50px] bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>
    </div>
  );
}

function NewArrivalsSkeleton() {
  return (
    <section className="NewArrivals mt-12 mx-[4%] animate-pulse">
      <div className="mb-6 flex items-center justify-between">
        <div className="h-8 bg-gray-200 rounded w-48"></div>
        <div className="flex gap-2">
          <div className="w-10 h-10 bg-gray-200 rounded"></div>
          <div className="w-10 h-10 bg-gray-200 rounded"></div>
        </div>
      </div>
      <div className="flex gap-6 overflow-x-auto">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="flex-shrink-0 w-[320px] md:w-[280px] lg:w-[320px]">
            <div className="bg-gray-200 rounded-lg h-96"></div>
          </div>
        ))}
      </div>
    </section>
  );
}

function BeautyCornerSkeleton() {
  return (
    <div className="mt-12 animate-pulse">
      <section className="w-full h-[680px] relative bg-gray-200"></section>
      <div className="mx-[4%]">
        <div className="mt-16 mb-6 flex items-center justify-between">
          <div className="h-8 bg-gray-200 rounded w-48"></div>
          <div className="flex items-center gap-4">
            <div className="h-6 bg-gray-200 rounded w-16"></div>
            <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
          </div>
        </div>
        <div className="grid gap-6 pb-20 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-gray-200 rounded-lg h-96"></div>
          ))}
        </div>
      </div>
    </div>
  );
}

function PansariInnSkeleton() {
  return (
    <>
      <div className="mt-12 animate-pulse">
        <section className="w-full h-[680px] relative bg-gray-200"></section>
        <div className="mx-[4%]">
          <div className="mt-16 mb-6 flex items-center justify-between">
            <div className="h-8 bg-gray-200 rounded w-48"></div>
            <div className="flex items-center gap-4">
              <div className="h-6 bg-gray-200 rounded w-16"></div>
              <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
            </div>
          </div>
          <div className="grid gap-6 pb-20 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-gray-200 rounded-lg h-96"></div>
            ))}
          </div>
        </div>
      </div>
      <div className="mt-12 animate-pulse">
        <section className="w-full h-[680px] relative bg-gray-200"></section>
        <div className="mx-[4%]">
          <div className="mt-16 mb-6 flex items-center justify-between">
            <div className="h-8 bg-gray-200 rounded w-48"></div>
            <div className="flex items-center gap-4">
              <div className="h-6 bg-gray-200 rounded w-16"></div>
              <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
            </div>
          </div>
          <div className="grid gap-6 pb-20 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-gray-200 rounded-lg h-96"></div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

function ComboDealSkeleton() {
  return (
    <div className="mt-12 animate-pulse">
      <section className="w-full h-[1104px] relative bg-gray-200"></section>
      <div className="mx-[4%]">
        <div className="flex items-center justify-between mt-12 mb-4">
          <div className="h-8 bg-gray-200 rounded w-48"></div>
          <div className="flex gap-2">
            <div className="w-10 h-10 bg-gray-200 rounded"></div>
            <div className="w-10 h-10 bg-gray-200 rounded"></div>
          </div>
        </div>
        <div className="flex gap-6 overflow-x-auto pb-20">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex-shrink-0 w-[300px]">
              <div className="bg-gray-200 rounded-lg h-96"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function VideoProductsSkeleton() {
  return (
    <section className="my-12 mx-[4%] animate-pulse">
      <div className="text-center mb-8">
        <div className="h-8 bg-gray-200 rounded w-48 inline-block"></div>
      </div>
      <div className="flex gap-6 overflow-x-auto">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="flex-shrink-0 w-[350px]">
            <div className="bg-gray-200 rounded-lg h-[400px]"></div>
          </div>
        ))}
      </div>
    </section>
  );
}

function ReviewSkeleton() {
  return (
    <section className="my-12 mx-[4%] animate-pulse">
      <div className="text-center mb-16">
        <div className="h-12 bg-gray-200 rounded w-96 mx-auto mb-4"></div>
        <div className="h-6 bg-gray-200 rounded w-[500px] mx-auto"></div>
      </div>
      <div className="flex gap-6 overflow-x-auto pb-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="flex-shrink-0 w-[412px] h-[303px] bg-gray-200 rounded-lg"></div>
        ))}
      </div>
    </section>
  );
}

function BlogSkeleton() {
  return (
    <section className="my-16 mx-[4%] animate-pulse">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10">
        <div>
          <div className="h-10 bg-gray-200 rounded w-48 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-64"></div>
        </div>
        <div className="mt-4 md:mt-0 h-12 bg-gray-200 rounded-lg w-40"></div>
      </div>
      <div className="flex gap-6 overflow-x-auto pb-6">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="flex-shrink-0 w-[350px]">
            <div className="bg-gray-200 rounded-lg h-[300px]"></div>
          </div>
        ))}
      </div>
    </section>
  );
}

// Main HomePage Component with Loading State
export default function HomePage() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate initial loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="animate-pulse">
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
      </div>
    );
  }

  return (
    <>
      <Banner />
      <SolutionBar />
      <FeaturedProducts/>
      <Category/>
      <NewArrivals/>
      <BeautyCorner/>
      <PansariInn/>
      <ComboDeal/>
      <VideoProducts/>
      <Review/>
      <Blog/>
    </>
  );
}