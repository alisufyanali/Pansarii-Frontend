"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { getCategoriesCached } from "@/lib/products";
import type { ApiCategory } from "@/types/product";

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function CategorySkeleton() {
  return (
    <div
      className="flex-shrink-0 flex flex-col items-center animate-pulse"
      style={{ width: "calc(33.33% - 8px)" }}
    >
      <div className="w-[75%] h-[72px] bg-gray-200 rounded mt-4" />
      <div className="w-full h-[50px] bg-gray-100 rounded mt-2" />
    </div>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function Categories() {
  const router    = useRouter();
  const sliderRef = useRef<HTMLDivElement>(null);
  const [categories, setCategories] = useState<ApiCategory[]>([]);
  const [isLoading, setIsLoading]   = useState(true);
  const [activePage, setActivePage] = useState(0);

  useEffect(() => {
    getCategoriesCached()
      .then((cats) => setCategories(cats.slice(0, 6)))
      .catch(() => setCategories([]))
      .finally(() => setIsLoading(false));
  }, []);

  // Track which "page" of 3 is visible — drives the dot indicators
  useEffect(() => {
    const el = sliderRef.current;
    if (!el) return;
    const onScroll = () => {
      const pageWidth = el.clientWidth;
      if (pageWidth === 0) return;
      const page = Math.round(el.scrollLeft / pageWidth);
      setActivePage(page);
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  const handleCategoryClick = (slug: string) => {
    router.push(`/category?cat=${slug}`);
  };

  const totalPages = Math.ceil((isLoading ? 6 : categories.length) / 3);

  return (
    <section className="py-4">
      {/* Header */}
      <div className="px-[4%] mb-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold">
          Shop By <span className="me-color-y">Category</span>
        </h2>
        <div
          className="flex items-center gap-2 cursor-pointer group"
          onClick={() => router.push("/category")}
        >
          <span className="text-black font-semibold group-hover:text-[#197B33] transition-colors text-sm">
            View All
          </span>
          <div className="w-8 h-8 flex items-center justify-center rounded-full bg-[#1A1A1A1A] group-hover:bg-[#197B33] group-hover:text-white transition-all">
            <span className="text-sm font-bold">{">"}</span>
          </div>
        </div>
      </div>

      {/* Slider wrapper — edge fades hint at off-screen content */}
      <div className="relative">

        {/* Left fade — visible when not on first page */}
        <div
          className={`pointer-events-none absolute left-0 top-0 h-full w-8 z-10 transition-opacity duration-200
            bg-gradient-to-r from-gray-50 to-transparent
            ${activePage === 0 ? "opacity-0" : "opacity-100"}`}
        />

        {/* Right fade — visible when not on last page */}
        <div
          className={`pointer-events-none absolute right-0 top-0 h-full w-8 z-10 transition-opacity duration-200
            bg-gradient-to-l from-gray-50 to-transparent
            ${activePage >= totalPages - 1 ? "opacity-0" : "opacity-100"}`}
        />

        {/* Horizontal scroll container */}
        <div
          ref={sliderRef}
          className="flex overflow-x-auto no-scrollbar px-[4%] gap-3"
          style={{
            scrollSnapType: "x mandatory",
            WebkitOverflowScrolling: "touch",
          }}
        >
          {isLoading
            ? [...Array(6)].map((_, i) => <CategorySkeleton key={i} />)
            : categories.map((category, index) => {
                const imageSrc = (category as ApiCategory & { image?: string }).image;

                return (
                  <div
                    key={category.id}
                    className="flex-shrink-0 flex flex-col items-center cursor-pointer active:scale-95 transition-transform"
                    style={{
                      width: "calc(33.33% - 8px)",
                      scrollSnapAlign: "start",
                    }}
                    onClick={() => handleCategoryClick(category.slug)}
                  >
                    {/* Image */}
                    <Image
                      src={imageSrc ?? `/images/category-${index + 1}.png`}
                      alt={category.name}
                      width={120}
                      height={72}
                      className="object-contain w-[75%] h-[72px] drop-shadow-md mt-4"
                      loading={index < 3 ? "eager" : "lazy"}
                      quality={60}
                    />

                    {/* Label */}
                    <div className="w-full min-h-[50px] bg-white flex flex-col items-center justify-center rounded mt-2 px-1">
                      <span className="text-[12px] font-medium leading-tight text-center">
                        {category.name}
                      </span>
                      {category.products_count !== undefined && (
                        <span className="text-[10px] text-gray-500 mt-0.5">
                          {category.products_count} items
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
        </div>
      </div>

      {/* Dot indicators */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-1.5 mt-3">
          {[...Array(totalPages)].map((_, i) => (
            <span
              key={i}
              className={`block rounded-full transition-all duration-300 ${
                i === activePage
                  ? "w-4 h-1.5 bg-green-700"
                  : "w-1.5 h-1.5 bg-gray-300"
              }`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
