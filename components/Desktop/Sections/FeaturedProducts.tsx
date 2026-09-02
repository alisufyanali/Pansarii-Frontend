"use client";

import ProductSection from "./ProductSection";
import { apiProductToLegacy } from "@/types/product";
import type { ApiProduct, Product } from "@/types/product";

interface FeaturedProductsProps {
  /**
   * Products from data.featured_products in the /api/homepage response.
   * Undefined = API hasn't returned yet → show skeleton.
   * Empty array = API returned but no featured products → render nothing.
   */
  products: ApiProduct[] | undefined;
}

function FeaturedProductsSkeleton() {
  return (
    <div className="mt-12 mx-[4%]">
      <div className="max-w-[1920px] mx-auto">
        <div className="mt-10 mb-6 flex items-center justify-between">
          <div className="h-8 w-56 bg-gray-200 rounded animate-pulse" />
          <div className="flex gap-2">
            <div className="w-9 h-9 rounded-full bg-gray-200 animate-pulse" />
            <div className="w-9 h-9 rounded-full bg-gray-200 animate-pulse" />
          </div>
        </div>
        <div className="flex gap-6 overflow-hidden pb-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex-shrink-0 w-52 rounded-2xl border border-gray-100 animate-pulse">
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
  // Still waiting for the homepage API response
  if (products === undefined) return <FeaturedProductsSkeleton />;

  // API returned but no featured products configured — hide section entirely
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

/** Self-fetching wrapper for pages that do not receive homepage data from a parent. */
export function FeaturedProductsLoader() {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { useState, useEffect } = require('react') as typeof import('react');
  const [products, setProducts] = useState<ApiProduct[] | undefined>(undefined);

  useEffect(() => {
    let active = true;
    // Re-use the homepage endpoint so we don't add a separate API call
    import('@/lib/homepage').then(({ getHomepageData }) =>
      getHomepageData().then(data => {
        if (active) setProducts(data.featured_products ?? []);
      })
    );
    return () => { active = false; };
  }, []);

  return <FeaturedProducts products={products} />;
}
