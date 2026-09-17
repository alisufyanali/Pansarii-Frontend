"use client";

import Image from "next/image";
import { useRef, useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import BackwardArrow from "@components/BackwardArrow";
import ForwardArrow from "@components/ForwardArrow";
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
  const router     = useRouter();
  const pic        = '/images/Skincare.png';
  const sliderRef  = useRef<HTMLDivElement>(null);
  const autoRef    = useRef<NodeJS.Timeout | null>(null);
  const hoverRef   = useRef(false);

  const [canScrollLeft,  setCanScrollLeft]  = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [isHovering,     setIsHovering]     = useState(false);

  const categories = Array.from(new Set(allProducts.map(p => p.category)))
    .filter(Boolean)
    .map((category, i) => ({
      title:    category,
      slug:     CATEGORY_SLUG_MAP[category] || category.toLowerCase().replace(/\s+/g, '-'),
      offset:   i % 2 === 1,
    }));

  useEffect(() => { hoverRef.current = isHovering; }, [isHovering]);

  const checkScroll = useCallback(() => {
    const el = sliderRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
  }, []);

  const getScrollAmount = useCallback(() => {
    const el = sliderRef.current;
    if (!el) return 220;
    return (el.clientWidth - 4 * 16) / 5 + 16;
  }, []);

  const stopAuto  = useCallback(() => { if (autoRef.current) { clearInterval(autoRef.current); autoRef.current = null; } }, []);

  const startAuto = useCallback(() => {
    stopAuto();
    autoRef.current = setInterval(() => {
      if (hoverRef.current) return;
      const el = sliderRef.current;
      if (!el) return;
      const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 2;
      el.scrollBy({ left: atEnd ? -el.scrollWidth : getScrollAmount(), behavior: "smooth" });
    }, 4000);
  }, [stopAuto, getScrollAmount]);

  const scroll = useCallback((dir: "left" | "right") => {
    sliderRef.current?.scrollBy({ left: dir === "right" ? getScrollAmount() : -getScrollAmount(), behavior: "smooth" });
    startAuto();
  }, [getScrollAmount, startAuto]);

  useEffect(() => {
    const el = sliderRef.current;
    if (!el) return;
    checkScroll();
    el.addEventListener("scroll", checkScroll, { passive: true });
    window.addEventListener("resize", checkScroll);
    startAuto();
    return () => {
      el.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
      stopAuto();
    };
  }, [checkScroll, startAuto, stopAuto]);

  return (
    <section className="mx-[4%] my-8">
      <div className="max-w-[1920px] mx-auto">

        {/* Header */}
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-2xl lg:text-3xl 2xl:text-4xl font-semibold">
            Find your <span className="me-color-y">Solutions</span>
          </h2>
          <div className="flex gap-2">
            <BackwardArrow disabled={!canScrollLeft}  onClick={() => scroll("left")}  />
            <ForwardArrow  disabled={!canScrollRight} onClick={() => scroll("right")} />
          </div>
        </div>

        {/* Slider */}
        <div
          ref={sliderRef}
          className="flex gap-4 overflow-x-auto scroll-smooth no-scrollbar pb-6"
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          {categories.map((card, i) => (
            <div
              key={i}
              onClick={() => router.push(`/${card.slug}`)}
              className="relative flex flex-col flex-shrink-0 rounded-2xl overflow-hidden cursor-pointer group transition-transform duration-300 hover:scale-[1.03] hover:shadow-xl"
              style={{ width: "calc((100vw * 0.92 - 4 * 1rem) / 5)" }}
            >
              {/* Image area — fixed aspect ratio so image never cuts */}
              <div
                className="relative w-full overflow-hidden bg-gray-100"
                style={{ aspectRatio: "3 / 4" }}
              >
                <Image
                  src={pic}
                  alt={card.title}
                  fill
                  className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 50vw, (max-width: 1920px) 20vw, 340px"
                  quality={75}
                  loading="lazy"
                />
              </div>

              {/* Green bottom bar */}
              <div className="bg-[#2d7a3a] flex items-center justify-between px-3 py-3 gap-2">
                <span className="text-white font-bold text-sm lg:text-base leading-tight">
                  {card.title}
                </span>
                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 7H11M11 7L7.5 3.5M11 7L7.5 10.5" stroke="#2d7a3a" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
