"use client";

import { useRef, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ProductCard from "@components/ProductCard";
import MobileProductCard from "@/components/Mobile/components/ProductCard";
import ForwardArrow from "@components/ForwardArrow";
import BackwardArrow from "@components/BackwardArrow";
import { useCardsToShow, cardWidthStyle } from "@/hooks/useCardsToShow";
import { apiProductToLegacy } from "@/types/product";
import type { ApiCategory, ApiProduct, Product } from "@/types/product";

interface CategoryProductRowProps {
  category: ApiCategory;
  products: ApiProduct[];
  variant?: "desktop" | "mobile";
}

function getViewAllHref(category: ApiCategory): string {
  return category.slug ? `/${category.slug}` : `/shop?category=${category.id}`;
}

export default function CategoryProductRow({
  category,
  products,
  variant = "desktop",
}: CategoryProductRowProps) {
  const router = useRouter();
  const sliderRef = useRef<HTMLDivElement>(null);
  const cardsToShow = useCardsToShow(5);
  const legacyProducts: Product[] = products.map(apiProductToLegacy);

  const [canScrollLeft, setCanScrollLeft] = useState(false);
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
    const step = card ? card.offsetWidth + (variant === "mobile" ? 12 : 24) : 320;
    el.scrollBy({ left: dir === "right" ? step : -step, behavior: "smooth" });
  };

  useEffect(() => {
    const el = sliderRef.current;
    if (!el) return;
    checkScroll();
    el.addEventListener("scroll", checkScroll, { passive: true });
    return () => el.removeEventListener("scroll", checkScroll);
  }, [products]);

  const viewAllHref = getViewAllHref(category);

  if (variant === "mobile") {
    return (
      <section className="py-4">
        <div className="px-4 mb-3 flex items-center justify-between">
          <h2 className="text-base font-bold text-gray-900">{category.name}</h2>
          <button
            type="button"
            onClick={() => router.push(viewAllHref)}
            className="text-xs font-semibold text-green-700 hover:text-green-600 transition"
          >
            View All →
          </button>
        </div>

        <div
          ref={sliderRef}
          className="flex gap-3 overflow-x-auto no-scrollbar pl-4 pr-8"
        >
          {legacyProducts.map((product, index) => (
            <div
              key={product.id}
              className="card-item flex-shrink-0"
              style={{ width: "65vw", maxWidth: "280px" }}
            >
              <MobileProductCard product={product} priority={index < 2} />
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="mx-[4%] my-8">
      <div className="max-w-[1920px] mx-auto">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-2xl lg:text-3xl 2xl:text-4xl font-semibold">
            {category.name}
          </h2>
          <div className="flex items-center gap-3">
            <div
              className="flex items-center gap-3 cursor-pointer group"
              onClick={() => router.push(viewAllHref)}
            >
              <span className="font-semibold group-hover:text-green-700 transition-colors">
                View All
              </span>
              <div className="w-9 h-9 flex items-center justify-center rounded-full bg-black/10 group-hover:bg-green-700 group-hover:text-white transition-all text-lg font-bold">
                ›
              </div>
            </div>
            <div className="flex gap-2">
              <BackwardArrow disabled={!canScrollLeft} onClick={() => scroll("left")} />
              <ForwardArrow disabled={!canScrollRight} onClick={() => scroll("right")} />
            </div>
          </div>
        </div>

        <div
          ref={sliderRef}
          className="flex gap-6 overflow-x-auto scroll-smooth no-scrollbar pb-4"
        >
          {legacyProducts.map((product, index) => (
            <div
              key={product.id}
              className="card-item flex-shrink-0"
              style={{ width: cardWidthStyle(cardsToShow) }}
            >
              <ProductCard product={product} priority={index < 3} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
