"use client";

import { useRef, useState, useEffect } from "react";
import ProductCard2 from "@components/ProductCard2";
import ForwardArrow from "@components/ForwardArrow";
import BackwardArrow from "@components/BackwardArrow";
import { bestSellers } from "@/app/Desktop/data/products";

export default function FeaturedProducts() {
  // Real best sellers from products data (isBestSeller: true)
  // ProductCard2 expects `hoverimg` (lowercase) — fallback to same img
  const featuredProducts = bestSellers.map(p => ({ ...p, hoverimg: p.img }));

  const sliderRef = useRef<HTMLDivElement | null>(null);
  const [canScrollLeft, setCanScrollLeft] = useState<boolean>(false);
  const [canScrollRight, setCanScrollRight] = useState<boolean>(true);

  const checkScroll = (): void => {
    const el = sliderRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
  };

  const scroll = (direction: "left" | "right"): void => {
    const el = sliderRef.current;
    if (!el) return;
    const cardElement = el.querySelector('.card-item') as HTMLElement;
    if (!cardElement) return;
    const cardWidth = cardElement.clientWidth + 24;
    el.scrollBy({
      left: direction === "right" ? cardWidth : -cardWidth,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    const el = sliderRef.current;
    if (!el) return;
    checkScroll();
    el.addEventListener("scroll", checkScroll);
    return () => el.removeEventListener("scroll", checkScroll);
  }, []);

  return (
    <section className="mt-8 font-poppins mx-[4%] my-4">
      <div className="max-w-[1920px] mx-auto">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-2xl 2xl:text-3xl font-semibold my-4 mb-4">
            Featured <span className="me-color-y">Products</span>
          </h2>
          <div className="flex gap-2">
            <BackwardArrow disabled={!canScrollLeft} onClick={() => scroll("left")} />
            <ForwardArrow disabled={!canScrollRight} onClick={() => scroll("right")} />
          </div>
        </div>

        {/* ProductCard2 handles its own click → /product/:id */}
        <div
          ref={sliderRef}
          className="flex gap-6 overflow-x-auto scroll-smooth no-scrollbar pb-4"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {featuredProducts.map((product) => (
            <div
              key={product.id}
              className="flex-shrink-0 card-item"
              style={{
                width: 'clamp(260px, calc((min(100vw, 1920px) - 8vw - 72px) / 4), 440px)',
              }}
            >
              <ProductCard2 product={product} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}