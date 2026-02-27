"use client";

import ProductCard from "../../../Mobile/components/ProductCard";
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
        {/* Flex container without overflow - all cards visible */}
        <div className="flex flex-wrap justify-center gap-3 sm:gap-4 md:gap-5 lg:gap-6">
          {displayedProducts.map((product) => (
            <div 
              key={product.id} 
              className="w-[calc(50%-8px)] xs:w-[calc(50%-12px)] sm:w-[calc(33.333%-16px)] md:w-[calc(25%-18px)] lg:w-[calc(25%-24px)] min-w-[140px] max-w-[200px]"
            >
              <ProductCard
                id={product.id}
                image={product.img}
                name={product.nameEn}
                nameUr={product.nameUr}
                description={product.description}
                features={[product.description]} // Convert description to features array
                price={product.price}
                oldPrice={product.oldPrice}
                sale={product.sale}
                rating={product.rating}
                reviews={product.reviews}
                currency="PKR"
                product={product} // Pass full product for modal
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}