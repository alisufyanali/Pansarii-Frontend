"use client";

import { useRef, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ProductCard from "@components/ProductCard";
import ForwardArrow from "@components/ForwardArrow";
import BackwardArrow from "@components/BackwardArrow";
import { useCardsToShow, cardWidthStyle } from "@/app/Desktop/utils/useCardsToShow";

interface Product {
  id?: string | number;
  img: string;
  hoverImg?: string;
  nameEn: string;
  nameUr: string;
  description: string;
  rating: number;
  reviews: number;
  price: number;
  oldPrice?: number | null;
  sale?: string | null;
  [key: string]: any;
}

interface ProductSectionProps {
  title:          string;
  titleHighlight: string;
  products:       Product[];
  bannerImg?:     string;
  bannerAlt?:     string;
  /** "View All" link — if omitted, scroll arrows are shown */
  viewAllHref?:   string;
  /** Hard cap on visible cards (defaults to 5) */
  maxCards?:      number;
}

export default function ProductSection({
  title,
  titleHighlight,
  products,
  bannerImg,
  bannerAlt,
  viewAllHref,
  maxCards = 5,
}: ProductSectionProps) {
  const router      = useRouter();
  const sliderRef   = useRef<HTMLDivElement>(null);
  const cardsToShow = useCardsToShow(maxCards);

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
    <div className="mt-12">
      {/* Optional banner */}
      {bannerImg && (
        <section className="w-full h-[70vh] min-h-[30rem] max-h-[45rem]">
          <img src={bannerImg} alt={bannerAlt ?? title} className="w-full h-full object-cover" />
        </section>
      )}

      <div className="mx-[4%]">
        <div className="max-w-[1920px] mx-auto">

          {/* Header */}
          <div className="mt-10 mb-6 flex items-center justify-between">
            <h2 className="text-2xl lg:text-3xl 2xl:text-4xl font-semibold">
              {title} <span className="me-color-y">{titleHighlight}</span>
            </h2>

            {viewAllHref ? (
              <div
                className="flex items-center gap-3 cursor-pointer group"
                onClick={() => router.push(viewAllHref)}
              >
                <span className="font-semibold group-hover:text-green-700 transition-colors">View All</span>
                <div className="w-9 h-9 flex items-center justify-center rounded-full bg-black/10 group-hover:bg-green-700 group-hover:text-white transition-all text-lg font-bold">
                  ›
                </div>
              </div>
            ) : (
              <div className="flex gap-2">
                <BackwardArrow disabled={!canScrollLeft}  onClick={() => scroll("left")}  />
                <ForwardArrow  disabled={!canScrollRight} onClick={() => scroll("right")} />
              </div>
            )}
          </div>

          {/* Slider */}
          {products.length === 0 ? (
            <p className="text-center py-10 text-gray-500">No products found.</p>
          ) : (
            <div
              ref={sliderRef}
              className="flex gap-6 overflow-x-auto scroll-smooth no-scrollbar pb-4"
            >
              {products.map(product => (
                <div
                  key={product.id}
                  className="card-item flex-shrink-0"
                  style={{ width: cardWidthStyle(cardsToShow) }}
                >
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
