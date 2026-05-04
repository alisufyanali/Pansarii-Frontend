"use client";

import VideoProductCard from "@/app/Desktop/components/VideoProductCard";
import { allProducts } from "@/app/Desktop/data/products";

export default function VideoProductsSection() {
  // Get ONLY FIRST 5 products from data/products.ts and add video fields
  const videoProducts = allProducts.slice(0, 5).map((product) => ({
    id: product.id,
    video: '/images/review.mp4',
    topImage: product.img,
    productImage: product.img,
    nameEn: product.nameEn,
    nameUr: product.nameUr,
    price: product.price,
    oldPrice: product.oldPrice,
    sale: product.sale,
    views: '860',
  }));

  return (
    <section className="w-full py-6 sm:py-8 lg:py-10 bg-gray-50">
      <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8">
        
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-4 sm:mb-6 text-center lg:text-left">
          Related Products
        </h2>
        
        {/* Grid Layout - Shows 5 products (same as home VideoProducts) */}
        <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 lg:gap-5">
          {videoProducts.map((videoProduct) => (
            <VideoProductCard key={videoProduct.id} product={videoProduct} />
          ))}
        </div>
      </div>
    </section>
  );
}