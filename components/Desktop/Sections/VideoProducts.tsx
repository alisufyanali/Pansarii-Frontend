"use client";

import { useRef, useState, useEffect } from "react";
import VideoProductCard from "@components/VideoProductCard";
import ForwardArrow from "@components/ForwardArrow";
import BackwardArrow from "@components/BackwardArrow";
import {
  mapApiProductToVideoCard,
  DEFAULT_VIDEO_PRODUCTS,
} from "@/lib/products";
import type { ApiProduct } from "@/types/product";

export default function VideoProducts({ products }: { products?: ApiProduct[] }) {
  const sliderRef        = useRef<HTMLDivElement>(null);
  const [canScrollLeft,  setCanScrollLeft]  = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const displayProducts = (products && products.length > 0
    ? products.map(mapApiProductToVideoCard)
    : DEFAULT_VIDEO_PRODUCTS);

  const checkScroll = () => {
    const el = sliderRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
  };

  const scroll = (dir: "left" | "right") => {
    const el = sliderRef.current;
    if (!el) return;
    const card = el.querySelector(".card-item") as HTMLElement;
    const step = card ? card.offsetWidth + 24 : 300;
    el.scrollBy({ left: dir === "right" ? step : -step, behavior: "smooth" });
  };

  useEffect(() => {
    const el = sliderRef.current;
    if (!el) return;
    checkScroll();
    el.addEventListener("scroll", checkScroll, { passive: true });
    return () => el.removeEventListener("scroll", checkScroll);
  }, [displayProducts]);

  return (
    <section className="mx-[4%] my-8">
      <div className="max-w-[1920px] mx-auto">

        {/* Header — same pattern as other sections */}
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="text-2xl lg:text-3xl 2xl:text-4xl font-semibold">
              Video <span className="me-color-y">Products</span>
            </h2>
            <p className="text-sm text-gray-500 mt-0.5">Watch and explore our featured products</p>
          </div>
          <div className="flex gap-2">
            <BackwardArrow disabled={!canScrollLeft}  onClick={() => scroll("left")}  />
            <ForwardArrow  disabled={!canScrollRight} onClick={() => scroll("right")} />
          </div>
        </div>

        {/* 5-card slider */}
        <div
          ref={sliderRef}
          className="flex gap-6 overflow-x-auto scroll-smooth no-scrollbar pb-4"
        >
          {displayProducts.map(product => (
            <div
              key={product.id}
              className="card-item flex-shrink-0"
              style={{
                width: "calc((min(100vw, 1920px) - 8vw - 96px) / 5)",
              }}
            >
              <VideoProductCard product={product} />
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
