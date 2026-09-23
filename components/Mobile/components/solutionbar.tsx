"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { FiChevronRight } from "react-icons/fi";
import { allProducts } from "@/data/products";

const CATEGORY_SLUG_MAP: Record<string, string> = {
  'Herb':          'herb',
  'Oils':          'oils',
  'Supplements':   'supplements',
  'Beauty Corner': 'beauty-corner',
  'Dawakhana':     'dawakhana',
  'Remedies':      'remedies',
  'Murrabajat':    'murrabajat',
  'Arqiyaat':      'arqiyaat',
  'Spices':        'spices',
};

export default function SolutionBar() {
  const router = useRouter();
  const pic = '/images/Skincare.png';
  const sliderRef = useRef<HTMLDivElement>(null);
  const autoRef = useRef<NodeJS.Timeout | null>(null);
  const [isInteracting, setIsInteracting] = useState(false);

  const categories = Array.from(new Set(allProducts.map(p => p.category)))
    .filter(Boolean)
    .map(category => ({
      name: category,
      slug: CATEGORY_SLUG_MAP[category] || category.toLowerCase().replace(/\s+/g, '-'),
    }));

  const stopAuto = useCallback(() => {
    if (autoRef.current) {
      clearInterval(autoRef.current);
      autoRef.current = null;
    }
  }, []);

  const startAuto = useCallback(() => {
    stopAuto();
    autoRef.current = setInterval(() => {
      const el = sliderRef.current;
      if (!el) return;

      const cardWidth = el.firstElementChild
        ? (el.firstElementChild as HTMLElement).offsetWidth + 12
        : 170;

      if (el.scrollLeft + el.clientWidth >= el.scrollWidth - 10) {
        el.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        el.scrollBy({ left: cardWidth, behavior: "smooth" });
      }
    }, 3500);
  }, [stopAuto]);

  useEffect(() => {
    if (!isInteracting) {
      startAuto();
    } else {
      stopAuto();
    }
    return () => stopAuto();
  }, [isInteracting, startAuto, stopAuto]);

  return (
    <section className="px-4 py-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-3.5">
        <h2 className="text-lg font-bold text-gray-900 tracking-tight">
          Find your <span className="me-color-y">Solutions</span>
        </h2>
        <Link 
          href="/category" 
          className="flex items-center gap-0.5 text-xs text-gray-500 hover:text-green-700 font-medium transition-colors"
        >
          View all <FiChevronRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Slider */}
      <div
        ref={sliderRef}
        onTouchStart={() => setIsInteracting(true)}
        onTouchEnd={() => setTimeout(() => setIsInteracting(false), 2000)}
        className="flex gap-3 overflow-x-auto scroll-smooth no-scrollbar pb-2 pt-0.5"
      >
        {categories.map((cat, i) => (
          <div
            key={i}
            onClick={() => router.push(`/${cat.slug}`)}
            className="flex-shrink-0 flex flex-col rounded-2xl overflow-hidden cursor-pointer shadow-sm active:scale-95 transition-all duration-200 border border-gray-100 bg-white"
            style={{ width: "165px" }}
          >
            {/* Image area — 3:4 portrait aspect ratio matching desktop */}
            <div
              className="relative w-full overflow-hidden bg-gray-100"
              style={{ aspectRatio: "3 / 4" }}
            >
              <Image
                src={pic}
                alt={cat.name}
                fill
                className="object-cover object-top"
                sizes="170px"
                quality={80}
                loading="lazy"
              />
            </div>

            {/* Green bottom bar matching desktop */}
            <div className="bg-[#2d7a3a] flex items-center justify-between px-3 py-2.5 gap-1.5">
              <span className="text-white font-bold text-xs truncate leading-tight">
                {cat.name}
              </span>
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-white flex items-center justify-center shadow-sm">
                <svg width="12" height="12" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3 7H11M11 7L7.5 3.5M11 7L7.5 10.5" stroke="#2d7a3a" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
