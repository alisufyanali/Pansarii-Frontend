"use client";

import { useState, useEffect } from 'react';
import { useDeviceDetection } from '@/hooks/useDeviceDetection';
import MobileProductCard from '@/components/Mobile/components/ProductCard';
import DesktopProductCard from '../../components/ProductCard';
import { getRecommendedProducts } from '@/lib/products';
import type { Product } from '@/types/product';

// ─── Skeleton ────────────────────────────────────────────────────────────────

function RecommendedSkeleton({ isMobile }: { isMobile: boolean }) {
  if (isMobile) {
    return (
      <div className="flex overflow-x-auto gap-4 pb-4 scrollbar-hide">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex-none w-[160px] animate-pulse">
            <div className="w-full aspect-square bg-gray-200 rounded-xl" />
            <div className="p-2 space-y-2">
              <div className="h-3 bg-gray-200 rounded w-3/4" />
              <div className="h-3 bg-gray-200 rounded w-1/2" />
            </div>
          </div>
        ))}
      </div>
    );
  }
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 gap-6">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="animate-pulse bg-white rounded-lg border border-gray-200">
          <div className="aspect-square bg-gray-200 rounded-t-lg" />
          <div className="p-3 space-y-2">
            <div className="h-4 bg-gray-200 rounded w-3/4" />
            <div className="h-8 bg-gray-200 rounded mt-2" />
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Component ───────────────────────────────────────────────────────────────

interface Props {
  productId?: number;
}

export default function RecommendedProductsSection({ productId }: Props) {
  const { isMobile, isLoading: deviceLoading } = useDeviceDetection();
  const [products,  setProducts]  = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();
    setIsLoading(true);
    getRecommendedProducts(productId, { signal: controller.signal })
      .then(data => setProducts(data.slice(0, 10)))
      .catch(() => setProducts([]))
      .finally(() => setIsLoading(false));
    return () => controller.abort();
  }, [productId]);

  // Hide section entirely when done loading and nothing came back
  if (!isLoading && !deviceLoading && products.length === 0) return null;

  // Show skeleton while either fetch or device detection is still pending
  const showSkeleton = isLoading || deviceLoading;

  return (
    <div className="w-full px-4 py-12">
      <h2 className="text-2xl font-bold text-gray-900 mb-8 max-w-7xl mx-auto">
        Recommended For You
      </h2>
      <div className="max-w-7xl mx-auto">
        {showSkeleton ? (
          <RecommendedSkeleton isMobile={isMobile} />
        ) : isMobile ? (
          /* Mobile — horizontal scroll */
          <div className="flex overflow-x-auto gap-4 pb-4 scrollbar-hide">
            {products.map(product => (
              <div key={product.id} className="flex-none w-[160px]">
                <MobileProductCard product={product} />
              </div>
            ))}
          </div>
        ) : (
          /* Desktop — responsive grid that accommodates any count cleanly */
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {products.map(product => (
              <div key={product.id} className="w-full">
                <DesktopProductCard product={product} />
              </div>
            ))}
          </div>
        )}
      </div>

      <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}
