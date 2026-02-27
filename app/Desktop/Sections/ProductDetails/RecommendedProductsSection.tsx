"use client";

import ProductCard from "../../components/ProductCard";
import { recommendedProducts } from "../../data/recommendedProducts";

export default function RecommendedProductsSection() {
  // Take only first 4 products
  const displayedProducts = recommendedProducts.slice(0, 4);

  return (
    <div className="w-full px-4 py-12">
      <h2 className="text-2xl font-bold text-gray-900 mb-8 max-w-7xl mx-auto">
        Recommended For You
      </h2>
      <div className="max-w-7xl mx-auto">
        {/* Responsive grid - all cards visible at once */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {displayedProducts.map((product) => (
            <div key={product.id} className="w-full">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}