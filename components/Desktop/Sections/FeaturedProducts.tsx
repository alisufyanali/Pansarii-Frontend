"use client";

import { useState, useEffect } from "react";
import ProductSection from "./ProductSection";
import { getHomepageData } from "@/lib/homepage";
import { apiProductToLegacy } from "@/types/product";
import { useCardsToShow, cardWidthStyle } from "@/hooks/useCardsToShow";
import type { ApiProduct, Product } from "@/types/product";

interface FeaturedProductsProps {
  /**
   * Products from data.featured_products in the /api/homepage response.
   * Undefined = API hasn't returned yet → show skeleton.
   * Empty array = API returned but no featured products → render nothing.
   */
  products: ApiProduct[] | undefined;
}

/** Skeleton that structurally matches what ProductSection renders */
function FeaturedProductsSkeleton() {
  const cardsToShow = useCardsToShow(5);
  const cardWidth   = cardWidthStyle(cardsToShow);
  return (
    <div className="mt-12 mx-[4%]">
      <div className="max-w-[1920px] mx-auto">
        {/* Header — mirrors ProductSection header with viewAllHref set */}
        <div className="mt-10 mb-6 flex items-center justify-between">
          <div className="h-8 w-56 bg-gray-200 rounded animate-pulse" />
          {/* ViewAll placeholder — same space as the "View All ›" group */}
          <div className="flex items-center gap-3">
            <div className="h-5 w-16 bg-gray-200 rounded animate-pulse" />
            <div className="w-9 h-9 rounded-full bg-gray-200 animate-pulse" />
          </div>
        </div>
        {/* Slider row — overflow-x-auto scroll-smooth no-scrollbar matches real */}
        <div className="flex gap-6 overflow-x-auto scroll-smooth no-scrollbar pb-4">
          {[...Array(cardsToShow)].map((_, i) => (
            <div
              key={i}
              className="flex-shrink-0 rounded-2xl border border-gray-100 animate-pulse bg-white"
              style={{ width: cardWidth }}
            >
              <div className="h-44 bg-gray-200 rounded-t-2xl" />
              <div className="p-3 space-y-2">
                <div className="h-3 bg-gray-200 rounded w-3/4" />
                <div className="h-3 bg-gray-200 rounded w-1/2" />
                <div className="h-8 bg-gray-200 rounded-full mt-2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function FeaturedProducts({ products }: FeaturedProductsProps) {
  if (products === undefined) return <FeaturedProductsSkeleton />;
  if (products.length === 0) return null;

  const legacyProducts: Product[] = products.map(apiProductToLegacy);

  return (
    <ProductSection
      title="Featured"
      titleHighlight="Products"
      products={legacyProducts}
      viewAllHref="/shop?featured=true"
    />
  );
}

/**
 * Self-fetching wrapper — for pages that do not receive homepageData from
 * a parent (e.g. the old app/(home)/desktop/page.tsx static route).
 * Mirrors the NewArrivalsLoader pattern exactly.
 */
export function FeaturedProductsLoader() {
  const [products, setProducts] = useState<ApiProduct[] | undefined>(undefined);

  useEffect(() => {
    let active = true;
    getHomepageData().then(data => {
      if (active) setProducts(data.featured_products ?? []);
    });
    return () => { active = false; };
  }, []);

  return <FeaturedProducts products={products} />;
}
