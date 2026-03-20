"use client";

import { useDeviceDetection } from '../../../utils/screen-detection';
import MobileProductCard from '../../../Mobile/components/ProductCard';
import DesktopProductCard from '../../../Desktop/components/ProductCard';
import { recommendedProducts } from "../../data/recommendedProducts";

export default function RecommendedProductsSection() {
  const { isMobile, isLoading } = useDeviceDetection();
  const displayedProducts = recommendedProducts.slice(0, 4);

  if (isLoading) return null;

  return (
    <div className="w-full px-4 py-12">
      <h2 className="text-2xl font-bold text-gray-900 mb-8 max-w-7xl mx-auto">
        Recommended For You
      </h2>
      <div className="max-w-7xl mx-auto">
        {/* Mobile View - Horizontal Scroll */}
        {isMobile && (
          <div className="flex overflow-x-auto gap-4 pb-4 scrollbar-hide">
            {displayedProducts.map((product) => (
              <div key={product.id} className="flex-none w-[160px]">
                <MobileProductCard product={product} />
              </div>
            ))}
          </div>
        )}

        {/* Desktop View - Grid Layout */}
        {!isMobile && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {displayedProducts.map((product) => (
              <div key={product.id} className="w-full">
                <DesktopProductCard product={product} />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Hide scrollbar */}
      <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}