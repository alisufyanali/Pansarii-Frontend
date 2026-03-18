"use client";

import VideoProductCard2 from "@/app/Desktop/components/VideoProductCard2";
import { allProducts } from "@/app/Desktop/data/products"; // Import your products data here

export default function VideoProductsSection() {
  // Get products from data/products.ts and add video fields
  const videoProducts = allProducts.map((product) => ({
    id: product.id,
    video: '/images/review.mp4', // Add your video URL here or from product data
    topImage: product.img,
    productImage: product.img,
    nameEn: product.nameEn,
    nameUr: product.nameUr,
    price: product.price,
    oldPrice: product.oldPrice,
    sale: product.sale,
    views: '860', // You can make this dynamic
  }));

  return (
    <section className="w-full py-6 sm:py-8 lg:py-10 bg-gray-50">
      {/* Centered Container for 4K */}
      <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8">
        
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-4 sm:mb-6 text-center lg:text-left">
          Related Products
        </h2>
        
        {/* Horizontal scroll container - Responsive */}
        <div className="flex overflow-x-auto gap-3 sm:gap-4 lg:gap-5 pb-4 snap-x snap-mandatory scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 hover:scrollbar-thumb-gray-400">
          {videoProducts.map((videoProduct) => (
            <div 
              key={videoProduct.id} 
              className="flex-none w-[85%] xs:w-[70%] sm:w-[45%] md:w-[32%] lg:w-[23%] xl:w-[18%] snap-start"
            >
              <VideoProductCard2 product={videoProduct} />
            </div>
          ))}
        </div>
        
        {/* Scroll Hint - Mobile only */}
        <div className="lg:hidden text-center mt-4">
          <p className="text-xs text-gray-500">← Swipe to see more →</p>
        </div>
      </div>
    </section>
  );
}