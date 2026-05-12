"use client";

import { useRef, useState, useEffect } from "react";
import VideoProductCard from "@components/VideoProductCard";
import ForwardArrow from "@components/ForwardArrow";
import BackwardArrow from "@components/BackwardArrow";
import { allProducts } from "@/components/Desktop/data/products";
import { useCardsToShow, cardWidthStyle } from "@/utils/useCardsToShow";

export default function VideoProductsSection() {
  const sliderRef   = useRef<HTMLDivElement>(null);
  const cardsToShow = useCardsToShow(5);

  const [canScrollLeft,  setCanScrollLeft]  = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const videoProducts = allProducts.slice(0, 8).map(p => ({
    id:           p.id,
    video:        '/images/review.mp4',
    topImage:     p.img,
    productImage: p.img,
    nameEn:       p.nameEn,
    nameUr:       p.nameUr,
    price:        p.price,
    oldPrice:     p.oldPrice,
    sale:         p.sale,
    views:        '860',
  }));

  const checkScroll = () => {
    const el = sliderRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
  };

  const scroll = (dir: "left" | "right") => {
    const el = sliderRef.current;
    if (!el) return;
    const card = el.querySelector(".vid-item") as HTMLElement;
    const step = card ? card.offsetWidth + 24 : 280;
    el.scrollBy({ left: dir === "right" ? step : -step, behavior: "smooth" });
  };

  useEffect(() => {
    const el = sliderRef.current;
    if (!el) return;
    checkScroll();
    el.addEventListener("scroll", checkScroll, { passive: true });
    return () => el.removeEventListener("scroll", checkScroll);
  }, []);

  return (
    <section className="w-full py-8 bg-gray-50">
      <div className="max-w-[1920px] mx-auto px-[4%]">

        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-2xl lg:text-3xl font-semibold text-gray-900">
            Related <span className="me-color-y">Products</span>
          </h2>
          <div className="flex gap-2">
            <BackwardArrow disabled={!canScrollLeft}  onClick={() => scroll("left")}  />
            <ForwardArrow  disabled={!canScrollRight} onClick={() => scroll("right")} />
          </div>
        </div>

        {/* Horizontal scroll slider — same pattern as other sections */}
        <div
          ref={sliderRef}
          className="flex gap-6 overflow-x-auto scroll-smooth no-scrollbar pb-4"
        >
          {videoProducts.map(product => (
            <div
              key={product.id}
              className="vid-item flex-shrink-0"
              style={{ width: cardWidthStyle(cardsToShow) }}
            >
              <VideoProductCard product={product} />
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
