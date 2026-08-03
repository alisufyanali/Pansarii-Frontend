"use client";

import { useRef, useState, useEffect } from "react";
import VideoProductCard from "@components/VideoProductCard";
import ForwardArrow from "@components/ForwardArrow";
import BackwardArrow from "@components/BackwardArrow";
import { useCardsToShow, cardWidthStyle } from "@/hooks/useCardsToShow";
import { getRelatedProducts } from "@/lib/products";
import { mapApiProductToVideoCard } from "@/lib/products";
import type { Product } from "@/types/product";
import type { VideoProductCardData } from "@/lib/products";

// ─── Skeleton ────────────────────────────────────────────────────────────────

function RelatedSkeleton({ count }: { count: number }) {
  return (
    <div className="flex gap-6 overflow-hidden pb-4">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="flex-shrink-0 animate-pulse rounded-xl overflow-hidden bg-white border border-gray-100"
          style={{ width: 220 }}
        >
          <div className="w-full aspect-square bg-gray-200" />
          <div className="p-3 space-y-2">
            <div className="h-3 bg-gray-200 rounded w-3/4" />
            <div className="h-3 bg-gray-200 rounded w-1/2" />
            <div className="h-8 bg-gray-200 rounded mt-2" />
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Helper: map legacy Product to VideoProductCardData ───────────────────────

function productToVideoCard(p: Product): VideoProductCardData {
  return {
    id:           p.id,
    video:        '/images/review.mp4',
    topImage:     p.img,
    productImage: p.img,
    nameEn:       p.nameEn,
    nameUr:       p.nameUr,
    price:        p.price,
    oldPrice:     p.oldPrice ?? undefined,
    sale:         p.sale ?? undefined,
    views:        p.reviews ? String(p.reviews) : undefined,
    slug:         p.slug ?? p.nameEn.toLowerCase().replace(/\s+/g, '-'),
  };
}

// ─── Component ───────────────────────────────────────────────────────────────

interface Props {
  productSlug?: string;
}

export default function VideoProductsSection({ productSlug }: Props) {
  const sliderRef   = useRef<HTMLDivElement>(null);
  const cardsToShow = useCardsToShow(5);

  const [canScrollLeft,  setCanScrollLeft]  = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [products,       setProducts]       = useState<VideoProductCardData[]>([]);
  const [isLoading,      setIsLoading]      = useState(true);

  useEffect(() => {
    if (!productSlug) {
      setIsLoading(false);
      return;
    }
    const controller = new AbortController();
    setIsLoading(true);
    getRelatedProducts(productSlug, { signal: controller.signal })
      .then(data => {
        setProducts(data.map(productToVideoCard));
      })
      .catch(() => setProducts([]))
      .finally(() => setIsLoading(false));
    return () => controller.abort();
  }, [productSlug]);

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
  }, [products]);

  // Hide section entirely when API returns empty and loading is done
  if (!isLoading && products.length === 0) return null;

  return (
    <section className="w-full py-8 bg-gray-50">
      <div className="max-w-[1920px] mx-auto px-[4%]">

        <div className="flex items-center justify-between mb-5">
          <h2 className="text-2xl lg:text-3xl font-semibold text-gray-900">
            Related <span className="me-color-y">Products</span>
          </h2>
          {!isLoading && (
            <div className="flex gap-2">
              <BackwardArrow disabled={!canScrollLeft}  onClick={() => scroll("left")}  />
              <ForwardArrow  disabled={!canScrollRight} onClick={() => scroll("right")} />
            </div>
          )}
        </div>

        {isLoading ? (
          <RelatedSkeleton count={cardsToShow} />
        ) : (
          <div
            ref={sliderRef}
            className="flex gap-6 overflow-x-auto scroll-smooth no-scrollbar pb-4"
          >
            {products.map(product => (
              <div
                key={product.id}
                className="vid-item flex-shrink-0"
                style={{ width: cardWidthStyle(cardsToShow) }}
              >
                <VideoProductCard product={product} />
              </div>
            ))}
          </div>
        )}

      </div>
    </section>
  );
}
