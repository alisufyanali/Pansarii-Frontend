// app/Desktop/components/navbar/skeleton-loading.tsx
import React from 'react';

const NavbarSkeleton = () => {
  return (
    <header className="w-full fixed top-0 left-0 z-40 animate-pulse">
      {/* Top Header Skeleton */}
      <div className="bg-gray-200 py-2">
        <div className="mx-[4%]">
          <div className="flex items-center justify-between">
            {/* Left - Social Icons Skeleton */}
            <div className="flex items-center gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="w-4 h-4 bg-gray-300 rounded-full" />
              ))}
            </div>

            {/* Center - Text Skeleton */}
            <div className="hidden md:block">
              <div className="w-48 h-4 bg-gray-300 rounded" />
            </div>

            {/* Right - WhatsApp Skeleton */}
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 bg-gray-300 rounded-full" />
              <div className="hidden sm:block w-24 h-3 bg-gray-300 rounded" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Navbar Skeleton */}
      <div className="bg-white">
        {/* Upper Navbar Skeleton */}
        <div className="mx-[4%] py-4">
          <div className="flex items-center justify-between gap-6">
            {/* Logo Skeleton */}
            <div className="w-48 h-12 bg-gray-200 rounded" />

            {/* Desktop Search Bar Skeleton */}
            <div className="flex-1 max-w-2xl hidden lg:block">
              <div className="w-full h-12 bg-gray-100 rounded-full" />
            </div>

            {/* Right - Cart, Sign In, Track Order Skeleton */}
            <div className="flex items-center gap-4">
              {/* Track Order Skeleton */}
              <div className="hidden xl:flex items-center gap-2 px-4 py-2">
                <div className="w-5 h-5 bg-gray-200 rounded-full" />
                <div className="w-20 h-3 bg-gray-200 rounded" />
              </div>

              {/* Sign In Skeleton */}
              <div className="flex items-center gap-2 px-4 py-2">
                <div className="w-5 h-5 bg-gray-200 rounded-full" />
                <div className="hidden lg:block w-12 h-3 bg-gray-200 rounded" />
              </div>

              {/* Cart Button Skeleton */}
              <div className="flex items-center gap-2 px-4 py-2">
                <div className="relative">
                  <div className="w-5 h-5 bg-gray-200 rounded-full" />
                  <div className="absolute -top-2 -right-2 w-5 h-5 bg-gray-300 rounded-full" />
                </div>
                <div className="hidden lg:flex flex-col items-start gap-1">
                  <div className="w-8 h-3 bg-gray-200 rounded" />
                  <div className="w-16 h-2 bg-gray-100 rounded" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Lower Navbar Skeleton */}
        <div>
          <div className="mx-[4%] py-3">
            <div className="flex items-center justify-between">
              {/* Categories Button Skeleton */}
              <div className="flex items-center gap-3 px-6 py-2.5 bg-gray-200 rounded-full w-40">
                <div className="w-4 h-4 bg-gray-300 rounded" />
                <div className="w-20 h-3 bg-gray-300 rounded" />
                <div className="w-3 h-3 bg-gray-300 rounded" />
              </div>

              {/* Center - Navigation Links Skeleton */}
              <nav className="hidden lg:flex items-center gap-8">
                {[...Array(7)].map((_, i) => (
                  <div key={i} className="w-12 h-3 bg-gray-200 rounded" />
                ))}
              </nav>

              {/* Right - Become Affiliate Button Skeleton */}
              <div className="hidden lg:flex items-center gap-2 px-6 py-2.5 bg-gray-200 rounded-full w-44">
                <div className="w-4 h-4 bg-gray-300 rounded" />
                <div className="w-28 h-3 bg-gray-300 rounded" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Search Bar Skeleton */}
      <div className="lg:hidden bg-white px-4 py-3">
        <div className="w-full h-10 bg-gray-100 rounded-full" />
      </div>

      {/* Simple Mobile Navigation Skeleton */}
      <div className="lg:hidden bg-white">
        <div className="mx-[4%] py-2">
          <nav className="flex items-center justify-around">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="w-12 h-3 bg-gray-200 rounded" />
            ))}
          </nav>
        </div>
      </div>

      {/* Spacer for content below */}
      <div className="h-px" />
    </header>
  );
};

export default NavbarSkeleton;