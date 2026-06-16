"use client";

import { useRef, useState, useEffect } from "react";
import ProductCard from "@components/ProductCard";
import ForwardArrow from "@components/ForwardArrow";
import BackwardArrow from "@components/BackwardArrow";
import { getFeaturedProducts } from "@/lib/products";
import { useCardsToShow, cardWidthStyle } from "@/hooks/useCardsToShow";
import type { Product } from "@/types/product";
import { bestSellers } from "@/data/products";

function FeaturedSkeleton({ count }: { count: number }) {
  return (
    <div className="flex gap-6 overflow-hidden pb-4">
      {[...Array(count)].map((_, i) => (
        <div key={i} className="flex-shrink-0 rounded-2xl border border-gray-200 animate-pulse bg-white" style={{ width: `calc((100% - ${(count-1)*24}px) / ${count})` }}>
          <div className="h-44 bg-gray-200 rounded-t-2xl" />
          <div className="p-3 space-y-2">
            <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto" />
            <div className="h-3 bg-gray-200 rounded w-1/2 mx-auto" />
            <div className="h-10 bg-gray-200 rounded-full mt-2" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function FeaturedProducts() {
  const sliderRef   = useRef<HTMLDivElement>(null);
  const cardsToShow = useCardsToShow(5);
  const [products, setProducts] = useState<Product[]>(() => bestSellers as Product[]);
  const [isLoading, setIsLoading] = useState(true);

  const [canScrollLeft,  setCanScrollLeft]  = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  useEffect(() => {
    getFeaturedProducts().then(data => {
      setProducts(data.length > 0 ? data : bestSellers as Product[]);
    }).catch(() => {
      setProducts(bestSellers as Product[]);
    }).finally(() => setIsLoading(false));
  }, []);

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
  }, [products]);

  return (
    <section className="mx-[4%] my-8">
      <div className="max-w-[1920px] mx-auto">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-2xl lg:text-3xl 2xl:text-4xl font-semibold">
            Featured <span className="me-color-y">Products</span>
          </h2>
          <div className="flex gap-2">
            <BackwardArrow disabled={!canScrollLeft || isLoading} onClick={() => scroll("left")} />
            <ForwardArrow  disabled={!canScrollRight || isLoading} onClick={() => scroll("right")} />
          </div>
        </div>

        {isLoading ? (
          <FeaturedSkeleton count={cardsToShow} />
        ) : (
          <div ref={sliderRef} className="flex gap-6 overflow-x-auto scroll-smooth no-scrollbar pb-4">
            {products.map((product, index) => (
              <div key={product.id} className="card-item flex-shrink-0" style={{ width: cardWidthStyle(cardsToShow) }}>
                <ProductCard product={product} priority={index < 3} />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
