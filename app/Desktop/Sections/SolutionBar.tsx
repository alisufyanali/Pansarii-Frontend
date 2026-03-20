"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import BackwardArrow from "@components/BackwardArrow";
import ForwardArrow from "@components/ForwardArrow";
import { categories } from "@/app/Desktop/data/categories";

export default function SolutionBar() {
  const router = useRouter();
  const pic = '/images/Skincare.png';
  const sliderRef = useRef<HTMLDivElement | null>(null);
  const autoSlideRef = useRef<NodeJS.Timeout | null>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [isHovering, setIsHovering] = useState(false);
  const isHoveringRef = useRef(false);

  // Keep ref in sync with state (avoids stale closure in interval)
  useEffect(() => {
    isHoveringRef.current = isHovering;
  }, [isHovering]);

  const checkScroll = useCallback(() => {
    const el = sliderRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
  }, []);

  // Returns the width of one card + its gap
  const getScrollAmount = useCallback(() => {
    const el = sliderRef.current;
    if (!el) return 300;
    const gap = 20;
    const cardsVisible = 5;
    const cardWidth = (el.clientWidth - gap * (cardsVisible - 1)) / cardsVisible;
    return cardWidth + gap;
  }, []);

  const stopAutoSlide = useCallback(() => {
    if (autoSlideRef.current) {
      clearInterval(autoSlideRef.current);
      autoSlideRef.current = null;
    }
  }, []);

  const startAutoSlide = useCallback(() => {
    stopAutoSlide();
    autoSlideRef.current = setInterval(() => {
      if (isHoveringRef.current) return;
      const el = sliderRef.current;
      if (!el) return;

      const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 2;
      if (atEnd) {
        el.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        el.scrollBy({ left: getScrollAmount(), behavior: "smooth" });
      }
    }, 4000);
  }, [stopAutoSlide, getScrollAmount]);

  const scroll = useCallback((direction: "left" | "right") => {
    const el = sliderRef.current;
    if (!el) return;
    const amount = getScrollAmount();
    el.scrollBy({
      left: direction === "right" ? amount : -amount,
      behavior: "smooth",
    });
    // Restart auto-slide timer after manual interaction
    startAutoSlide();
  }, [getScrollAmount, startAutoSlide]);

  const handleCategoryClick = (category: string) => {
    router.push(`/shop?category=${category}`);
  };

  useEffect(() => {
    const el = sliderRef.current;
    if (!el) return;
    checkScroll();
    el.addEventListener("scroll", checkScroll, { passive: true });
    window.addEventListener("resize", checkScroll);
    startAutoSlide();

    return () => {
      el.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
      stopAutoSlide();
    };
  }, [checkScroll, startAutoSlide, stopAutoSlide]);

  return (
    <section className="mx-[4%] my-10">
      <div className="max-w-[1920px] mx-auto">

        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-3xl 2xl:text-4xl font-semibold">
            Find your <span className="me-color-y">Solutions</span>
          </h2>
          <div className="flex gap-2">
            <BackwardArrow disabled={!canScrollLeft} onClick={() => scroll("left")} />
            <ForwardArrow disabled={!canScrollRight} onClick={() => scroll("right")} />
          </div>
        </div>

        {/* Slider */}
        <div
          ref={sliderRef}
          className="flex overflow-x-auto scroll-smooth pb-4"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none", gap: "20px" }}
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          {categories.map((card, index) => (
            <div
              key={index}
              onClick={() => handleCategoryClick(card.category)}
              className={`relative flex flex-col justify-end flex-shrink-0 rounded-2xl overflow-hidden cursor-pointer group
                transition-transform duration-300 hover:scale-[1.03] hover:shadow-2xl
                ${card.offset ? "mt-8" : ""}
              `}
              style={{
                // Exactly 5 cards with 20px gaps: (container - 4*20) / 5
                width: "calc((min(92vw, 1766px) - 80px) / 5)",
                height: "290px",
              }}
            >
              {/* Background image */}
              <img
                src={pic}
                alt={card.title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />

              {/* Green gradient overlay at bottom */}
              <div
                className="absolute inset-0 z-10"
                style={{
                  background:
                    "linear-gradient(to top, rgba(25, 123, 51, 0.92) 0%, rgba(0,0,0,0.35) 50%, rgba(0,0,0,0.1) 100%)",
                }}
              />

              {/* Card content */}
              <div className="relative z-20 p-4">
                <p className="text-white text-sm 2xl:text-base font-semibold leading-snug drop-shadow">
                  {card.title}
                </p>
                <span className="inline-block mt-1 text-xs text-green-200 font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
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