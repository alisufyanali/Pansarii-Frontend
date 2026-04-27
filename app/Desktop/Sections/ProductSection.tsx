"use client";

import { useRef, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ProductCard from "@components/ProductCard";
import ForwardArrow from "@components/ForwardArrow";
import BackwardArrow from "@components/BackwardArrow";

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
  /** Section heading — first word black, second word yellow */
  title: string;
  titleHighlight: string;
  /** Products to display */
  products: Product[];
  /** Optional banner image shown above the section */
  bannerImg?: string;
  bannerAlt?: string;
  /** URL for "View All" button — if omitted, arrows are shown instead */
  viewAllHref?: string;
  /** Max cards visible at once (responsive) */
  maxCards?: number;
}

// Responsive cards-to-show hook
function useCardsToShow(max = 5) {
  const [cards, setCards] = useState(4);

  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      if (w >= 2560)      setCards(Math.min(max, 8));
      else if (w >= 1920) setCards(Math.min(max, 6));
      else if (w >= 1536) setCards(Math.min(max, 5));
      else if (w >= 1280) setCards(Math.min(max, 4));
      else if (w >= 1024) setCards(Math.min(max, 3));
      else if (w >= 768)  setCards(Math.min(max, 2));
      else                setCards(1);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [max]);

  return cards;
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
  const router = useRouter();
  const sliderRef = useRef<HTMLDivElement>(null);
  const cardsToShow = useCardsToShow(maxCards);

  const [canScrollLeft, setCanScrollLeft]   = useState(false);
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
    el.addEventListener("scroll", checkScroll);
    return () => el.removeEventListener("scroll", checkScroll);
  }, []);

  return (
    <div className="mt-12">
      {/* Optional banner */}
      {bannerImg && (
        <section className="w-full h-[70vh] min-h-[30rem] max-h-[45rem]">
          <img
            src={bannerImg}
            alt={bannerAlt ?? title}
            className="w-full h-full object-cover"
          />
        </section>
      )}

      {/* Content */}
      <div className="mx-[4%]">
        <div className="max-w-[1920px] mx-auto">

          {/* Header */}
          <div className="mt-10 mb-6 flex items-center justify-between">
            <h2 className="text-3xl 2xl:text-4xl font-semibold">
              {title} <span className="me-color-y">{titleHighlight}</span>
            </h2>

            {/* View All OR scroll arrows */}
            {viewAllHref ? (
              <div
                className="flex items-center gap-4 cursor-pointer group"
                onClick={() => router.push(viewAllHref)}
              >
                <span className="font-semibold group-hover:text-[#197B33] transition-colors 2xl:text-lg">
                  View All
                </span>
                <div className="w-10 h-10 flex items-center justify-center rounded-full bg-[#1A1A1A1A] group-hover:bg-[#197B33] group-hover:text-white transition-all">
                  <span className="text-lg font-bold">›</span>
                </div>
              </div>
            ) : (
              <div className="flex gap-2">
                <BackwardArrow disabled={!canScrollLeft}  onClick={() => scroll("left")}  />
                <ForwardArrow  disabled={!canScrollRight} onClick={() => scroll("right")} />
              </div>
            )}
          </div>

          {/* Product slider */}
          {products.length === 0 ? (
            <p className="text-center py-10 text-gray-500">No products found.</p>
          ) : (
            <div
              ref={sliderRef}
              className="flex gap-6 overflow-x-auto scroll-smooth no-scrollbar pb-4"
            >
              {products.map((product) => (
                <div
                  key={product.id}
                  className="card-item flex-shrink-0"
                  style={{
                    width: `calc((min(100vw, 1920px) - 8vw - ${(cardsToShow - 1) * 24}px) / ${cardsToShow})`,
                  }}
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
