"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import BackwardArrow from "@components/BackwardArrow";
import ForwardArrow from "@components/ForwardArrow";
import { allProducts } from "@/app/Desktop/data/products";

const CATEGORY_SLUG_MAP: Record<string, string> = {
  'Herb':          'herbs',
  'Oils':          'oils',
  'Supplements':   'supplements',
  'Beauty Corner': 'beauty-corner',
  'Dawakhana':     'dawakhana',
  'Remedies':      'remedies',
  'Murrabajat':    'murrabajat',
  'Arqiyaat':      'arqiyaat',
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
              className={`
                relative flex flex-col justify-end flex-shrink-0 rounded-xl overflow-hidden
                cursor-pointer group transition-transform duration-300
                hover:scale-[1.03] hover:shadow-xl
                ${card.offset ? "mt-6" : ""}
              `}
              style={{
                /* 5 cards visible, 4 gaps of 16px */
                width: "calc((min(92vw, 1766px) - 64px) / 5)",
                height: "clamp(180px, 18vw, 240px)",
              }}
            >
              {/* Background image */}
              <img
                src={pic}
                alt={card.title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />

              {/* Gradient overlay */}
              <div className="absolute inset-0 z-10 bg-gradient-to-t from-green-800/90 via-black/30 to-black/10" />

              {/* Card label */}
              <div className="relative z-20 p-3">
                <p className="text-white text-sm font-semibold leading-snug drop-shadow">
                  {card.title}
                </p>
                <span className="inline-block mt-0.5 text-xs text-green-200 font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  Shop now →
                </span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
