"use client";

import VideoProductCard from '@/app/Desktop/components/VideoProductCard';
import { allProducts } from '@/app/Desktop/data/products'; // Import your products data here

interface VideoProduct {
  id: string | number;
  topImage: string;
  productImage: string;
  video: string;
  nameEn: string;
  nameUr: string;
  views?: string;
  sale?: string;
  price: number | string;
  oldPrice?: number | string;
}

export default function VideoProducts() {
  // Get products from data/products.ts and add video fields
  const videoProducts: VideoProduct[] = allProducts.slice(0, 4).map((product) => ({
    id: product.id,
    topImage: product.img,
    productImage: product.img,
    video: '/images/review.mp4', // Add your video URL here
    nameEn: product.nameEn,
    nameUr: product.nameUr,
    views: '860', // You can make this dynamic
    sale: product.sale || '',
    price: product.price,
    oldPrice: product.oldPrice || undefined,
  }));

  return (
    <section className="my-8 md:my-10 lg:my-12 2xl:my-16 px-4 sm:px-6 lg:px-8">
      {/* Centered Container for 4K */}
      <div className="max-w-[1920px] mx-auto">

        {/* Heading */}
        <div className="text-center mb-6 md:mb-8 lg:mb-10">
          <h2 className="text-2xl md:text-3xl lg:text-4xl 2xl:text-5xl font-semibold font-poppins">
            Video <span className="text-[#197B33]">Products</span>
          </h2>
          <p className="text-sm md:text-base lg:text-lg 2xl:text-xl text-gray-600 mt-2">
            Watch and explore our featured products
          </p>
        </div>

        {/* Responsive Grid - 4 cards */}
        <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4 lg:gap-5 2xl:gap-6">
          {videoProducts.map((product) => (
            <VideoProductCard key={product.id} product={product} />
          ))}
        </div>

      </div>
    </section>
  );
}