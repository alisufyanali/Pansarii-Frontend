"use client";

import { useRef, useState, useEffect } from "react";
import ProductCard from "@components/ProductCard";
import ForwardArrow from "@components/ForwardArrow";
import BackwardArrow from "@components/BackwardArrow";
import { bestSellers } from "@/data/products";
import { useCardsToShow, cardWidthStyle } from "@/hooks/useCardsToShow";

export default function FeaturedProducts() {
  const sliderRef   = useRef<HTMLDivElement>(null);
  const cardsToShow = useCardsToShow(5);

  const [canScrollLeft,  setCanScrollLeft]  = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

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
    const step = card ? card.offsetWidth + 24 : 320;
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
    <section className="mx-[4%] my-8">
      <div className="max-w-[1920px] mx-auto">

        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-2xl lg:text-3xl 2xl:text-4xl font-semibold">
            Featured <span className="me-color-y">Products</span>
          </h2>
          <div className="flex gap-2">
            <BackwardArrow disabled={!canScrollLeft}  onClick={() => scroll("left")}  />
            <ForwardArrow  disabled={!canScrollRight} onClick={() => scroll("right")} />
          </div>
        </div>

        <div
          ref={sliderRef}
          className="flex gap-6 overflow-x-auto scroll-smooth no-scrollbar pb-4"
        >
          {bestSellers.map(product => (
            <div
              key={product.id}
              className="card-item flex-shrink-0"
              style={{ width: cardWidthStyle(cardsToShow) }}
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
