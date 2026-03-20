"use client";

import { useRef, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ProductCard from "@components/ProductCard";
import ForwardArrow from "@components/ForwardArrow";
import BackwardArrow from "@components/BackwardArrow";
import { newArrivals } from "@/app/Desktop/data/products";

export default function NewArrivals() {
  const router = useRouter();

  // Real new arrivals from products data (isNew: true)
  const products = newArrivals;

  const sliderRef = useRef<HTMLDivElement | null>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    const el = sliderRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
  };

  const scroll = (direction: "left" | "right") => {
    const el = sliderRef.current;
    if (!el) return;
    const cardEl = el.querySelector('.card-item') as HTMLElement;
    const cardWidth = cardEl ? cardEl.offsetWidth + 24 : 344;
    el.scrollBy({ left: direction === "right" ? cardWidth : -cardWidth, behavior: "smooth" });
  };

  useEffect(() => {
    const el = sliderRef.current;
    if (!el) return;
    checkScroll();
    el.addEventListener("scroll", checkScroll);
    return () => el.removeEventListener("scroll", checkScroll);
  }, []);

  return (
    <section className="NewArrivals mt-12 mx-[4%]">
      <div className="max-w-[1920px] mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl 2xl:text-3xl font-semibold">
            New <span className="me-color-y">Arrivals</span>
          </h2>
          <div className="flex gap-2">
            <BackwardArrow disabled={!canScrollLeft} onClick={() => scroll("left")} />
            <ForwardArrow disabled={!canScrollRight} onClick={() => scroll("right")} />
          </div>
        </div>

        {/* ProductCard handles its own click → /product/:id */}
        <div
          ref={sliderRef}
          className="flex gap-6 overflow-x-auto scroll-smooth no-scrollbar pb-4"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {products.map((product) => (
            <div
              key={product.id}
              className="card-item flex-shrink-0"
              style={{
                width: 'clamp(260px, calc((min(100vw, 1920px) - 8vw - 72px) / 4), 460px)',
              }}
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}