"use client";

import { useRef, MouseEvent } from 'react';
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
  const carouselRef = useRef<HTMLDivElement>(null);

  const skincareImg = '/images/Skincare.png';
  const productImg = '/images/product.png';
  const productVideo = '/images/review.mp4';

  const videoProducts: VideoProduct[] = [
    { id: 1, topImage: skincareImg, productImage: productImg, video: productVideo, nameEn: 'Orange Oil', nameUr: 'نارنجی کا تیل', views: '860', sale: '20% OFF', price: 1149, oldPrice: 1299 },
    { id: 2, topImage: skincareImg, productImage: productImg, video: productVideo, nameEn: 'Green Oil', nameUr: 'سبز تیل', views: '920', sale: '15% OFF', price: 999, oldPrice: 1200 },
    { id: 3, topImage: skincareImg, productImage: productImg, video: productVideo, nameEn: 'Black Oil', nameUr: 'کالی تیل', views: '780', sale: '10% OFF', price: 1099, oldPrice: 1299 },
    { id: 4, topImage: skincareImg, productImage: productImg, video: productVideo, nameEn: 'Chamomile Oil', nameUr: 'کملی تیل', views: '650', sale: '25% OFF', price: 899, oldPrice: 1199 },
    { id: 5, topImage: skincareImg, productImage: productImg, video: productVideo, nameEn: 'Lavender Oil', nameUr: 'لیونڈر تیل', views: '500', sale: '30% OFF', price: 1249, oldPrice: 1499 },
  ];

  let isDown = false;
  let startX: number;
  let scrollLeft: number;

  const onMouseDown = (e: MouseEvent<HTMLDivElement>): void => {
    if (!carouselRef.current) return;
    isDown = true;
    startX = e.pageX - carouselRef.current.offsetLeft;
    scrollLeft = carouselRef.current.scrollLeft;
  };

  const onMouseLeave = (): void => { isDown = false; };
  const onMouseUp = (): void => { isDown = false; };

  const onMouseMove = (e: MouseEvent<HTMLDivElement>): void => {
    if (!isDown || !carouselRef.current) return;
    e.preventDefault();
    const x = e.pageX - carouselRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    carouselRef.current.scrollLeft = scrollLeft - walk;
  };

  return (
    <section className="my-8 md:my-10 lg:my-12 2xl:my-16 mx-[4%]">
      <div className="max-w-[1920px] mx-auto">
        <div className="text-center mb-6 md:mb-8 lg:mb-10">
          <h2 className="text-2xl md:text-3xl lg:text-4xl 2xl:text-5xl font-semibold font-poppins">
            Video <span className="text-[#197B33]">Products</span>
          </h2>
          <p className="text-sm md:text-base lg:text-lg 2xl:text-xl text-gray-600 mt-2">
            Watch and explore our featured products
          </p>
        </div>

        <div
          ref={carouselRef}
          className="flex gap-4 md:gap-5 lg:gap-6 overflow-x-auto overflow-y-hidden scroll-smooth no-scrollbar cursor-grab select-none pb-4"
          onMouseDown={onMouseDown}
          onMouseLeave={onMouseLeave}
          onMouseUp={onMouseUp}
          onMouseMove={onMouseMove}
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {videoProducts.map((product) => (
            <div
              key={product.id}
              className="flex-shrink-0 w-[260px] sm:w-[280px] md:w-[300px] lg:w-[320px] xl:w-[340px] 2xl:w-[380px]"
            >
              <VideoProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}