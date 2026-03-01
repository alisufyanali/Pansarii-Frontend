"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import BackwardArrow from "@components/BackwardArrow";
import ForwardArrow from "@components/ForwardArrow";
import { categories } from "@/app/Desktop/data/categories";

interface Category {
  title: string;
  category: string;
  offset: boolean;
}

export default function SolutionBar() {
  const router = useRouter();
  const pic = '/images/Skincare.png';
  const sliderRef = useRef<HTMLDivElement | null>(null);
  const autoSlideIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [isHovering, setIsHovering] = useState(false);

  const checkScroll = () => {
    const el = sliderRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
  };

  const scroll = useCallback((direction: "left" | "right") => {
    const el = sliderRef.current;
    if (!el) return;

    const containerWidth = el.clientWidth;
    const cardsToShow = 5;
    const gap = 16;
    const totalGapWidth = gap * (cardsToShow - 1);
    const cardWidth = (containerWidth - totalGapWidth) / cardsToShow;
    const scrollAmount = cardWidth + gap;

    el.scrollBy({
      left: direction === "right" ? scrollAmount : -scrollAmount,
      behavior: "smooth",
    });

    if (autoSlideIntervalRef.current) clearInterval(autoSlideIntervalRef.current);
    startAutoSlide();
  }, []);

  const startAutoSlide = useCallback(() => {
    if (autoSlideIntervalRef.current) clearInterval(autoSlideIntervalRef.current);

    autoSlideIntervalRef.current = setInterval(() => {
      if (isHovering) return;
      const el = sliderRef.current;
      if (!el) return;

      if (el.scrollLeft + el.clientWidth >= el.scrollWidth - 10) {
        el.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        scroll("right");
      }
    }, 1000);
  }, [isHovering, scroll]);

  const handleCategoryClick = (category: string) => {
    router.push(`/shop?category=${category}`);
    if (autoSlideIntervalRef.current) {
      clearInterval(autoSlideIntervalRef.current);
      setTimeout(() => startAutoSlide(), 2000);
    }
  };

  useEffect(() => {
    const el = sliderRef.current;
    if (!el) return;
    checkScroll();
    el.addEventListener("scroll", checkScroll);
    window.addEventListener('resize', checkScroll);
    startAutoSlide();

    return () => {
      el.removeEventListener("scroll", checkScroll);
      window.removeEventListener('resize', checkScroll);
      if (autoSlideIntervalRef.current) clearInterval(autoSlideIntervalRef.current);
    };
  }, [startAutoSlide]);

  const handleMouseEnter = () => {
    setIsHovering(true);
    if (autoSlideIntervalRef.current) clearInterval(autoSlideIntervalRef.current);
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
    startAutoSlide();
  };

  return (
    <section className="SolutionBar mx-[4%] my-8">
      <div className="max-w-[1920px] mx-auto">
        {/* Header */}
        <div className="top-solutionbar mb-6 flex items-center justify-between">
          <h2 className="text-3xl 2xl:text-4xl font-semibold">
            Find your <span className="me-color-y">Solutions</span>
          </h2>
          <div className="flex gap-2">
            <BackwardArrow disabled={!canScrollLeft} onClick={() => scroll("left")} />
            <ForwardArrow disabled={!canScrollRight} onClick={() => scroll("right")} />
          </div>
        </div>

        {/* Cards Container */}
        <div
          ref={sliderRef}
          className="slide flex overflow-x-auto scroll-smooth no-scrollbar pb-4"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {categories.map((card, index) => (
            <div
              key={index}
              onClick={() => handleCategoryClick(card.category)}
              className={`card-solution relative flex flex-col justify-end shrink-0 rounded-lg p-4 text-white cursor-pointer transition-transform hover:scale-105 ${
                card.offset ? 'mt-8' : ''
              }`}
              style={{
                /*
                  5 cards on laptop (lg), 5 on 2xl/4K too (fills the container width).
                  We compute card width as: (containerWidth - 4*gap) / 5
                  Container is 92vw (after 4% margins on each side), max 1920px.
                  So card = (min(92vw, 1920*0.92) - 4*16) / 5
                  Using CSS: calc((min(92vw, 1766px) - 64px) / 5)
                */
                width: 'calc((min(92vw, 1766px) - 64px) / 5)',
                marginRight: index === categories.length - 1 ? '0' : '16px',
                height: '270px',
                backgroundImage: `url(${pic})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <div
                className="absolute inset-0 rounded-lg z-10"
                style={{
                  background: "linear-gradient(184.89deg, rgba(0, 0, 0, 0) 58.68%, #197B33 96.06%)",
                }}
              />
              <div className="absolute inset-0 bg-black/40 rounded-lg" />
              <p className="relative z-10 mt-auto text-sm 2xl:text-base font-medium">
                {card.title}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}