"use client";

import ProductCard from "../../components/ProductCard";
import { recommendedProducts } from "../../data/recommendedProducts";

export default function RecommendedProductsSection() {
  // Take only first 4 products
  const displayedProducts = recommendedProducts.slice(0, 4);

  return (
    <div className="w-full px-4 py-12 overflow-hidden">
      <h2 className="text-2xl font-bold text-gray-900 mb-8 max-w-7xl mx-auto">
        Recommended For You
      </h2>
      <div className="max-w-7xl mx-auto">
        {/* Horizontal scroll container */}
        <div className="flex overflow-x-auto gap-6 pb-4 snap-x scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
          {displayedProducts.map((product) => (
            <div 
              key={product.id} 
              className="flex-none w-[85%] xs:w-[70%] sm:w-[45%] md:w-[30%] lg:w-[23%] snap-start"
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}