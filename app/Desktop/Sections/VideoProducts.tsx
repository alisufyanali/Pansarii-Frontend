"use client";

import VideoProductCard from '@components/VideoProductCard';

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
  const skincareImg = '/images/Skincare.png';
  const productImg  = '/images/product.png';
  const productVideo = '/images/review.mp4';

  const videoProducts: VideoProduct[] = [
    { id: 1, topImage: skincareImg, productImage: productImg, video: productVideo, nameEn: 'Orange Oil',    nameUr: 'نارنجی کا تیل', views: '860', sale: '20% OFF', price: 1149, oldPrice: 1299 },
    { id: 2, topImage: skincareImg, productImage: productImg, video: productVideo, nameEn: 'Green Oil',     nameUr: 'سبز تیل',      views: '920', sale: '15% OFF', price: 999,  oldPrice: 1200 },
    { id: 3, topImage: skincareImg, productImage: productImg, video: productVideo, nameEn: 'Black Oil',     nameUr: 'کالی تیل',     views: '780', sale: '10% OFF', price: 1099, oldPrice: 1299 },
    { id: 4, topImage: skincareImg, productImage: productImg, video: productVideo, nameEn: 'Chamomile Oil', nameUr: 'کملی تیل',     views: '650', sale: '25% OFF', price: 899,  oldPrice: 1199 },
  ];

  return (
    <section className="my-8 md:my-10 lg:my-12 2xl:my-16 mx-[4%]">
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

        {/* 4 cards always visible — no scroll */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 lg:gap-5 2xl:gap-6">
          {videoProducts.map((product) => (
            <VideoProductCard key={product.id} product={product} />
          ))}
        </div>

      </div>
    </section>
  );
}