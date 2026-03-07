"use client";

import { useRef, useState, useEffect } from "react";
import ProductCard2 from '@components/ProductCard2';
import ForwardArrow from '@components/ForwardArrow';
import BackwardArrow from '@components/BackwardArrow';

export default function ComboDeal() {
  const banner4Img = '/images/Banner4.png';
  const productImg = '/images/product.png';
  const hoverimg = '/images/category.png';

  const comboProducts = [
    { img: productImg, nameEn: 'Hibiscus Tea', nameUr: 'ہیبسکس چائے', description: 'Natural Tea', rating: 4.7, reviews: 406, price: 1149, oldPrice: 1299, sale: '20% OFF', hoverimg },
    { img: productImg, nameEn: 'Green Tea', nameUr: 'گرین ٹی', description: 'Organic Tea', rating: 4.5, reviews: 320, price: 999, oldPrice: 1200, sale: '15% OFF', hoverimg },
    { img: productImg, nameEn: 'Black Tea', nameUr: 'کالی چائے', description: 'Strong Tea', rating: 4.8, reviews: 512, price: 1149, oldPrice: 1399, sale: '18% OFF', hoverimg },
    { img: productImg, nameEn: 'Chamomile Tea', nameUr: 'کملی چائے', description: 'Relaxing Tea', rating: 4.6, reviews: 280, price: 899, oldPrice: 1099, sale: '10% OFF', hoverimg },
    { img: productImg, nameEn: 'Hibiscus Tea', nameUr: 'ہیبسکس چائے', description: 'Natural Tea', rating: 4.7, reviews: 406, price: 1149, oldPrice: 1299, sale: '20% OFF', hoverimg },
    { img: productImg, nameEn: 'Green Tea', nameUr: 'گرین ٹی', description: 'Organic Tea', rating: 4.5, reviews: 320, price: 999, oldPrice: 1200, sale: '15% OFF', hoverimg },
    { img: productImg, nameEn: 'Black Tea', nameUr: 'کالی چائے', description: 'Strong Tea', rating: 4.8, reviews: 512, price: 1149, oldPrice: 1399, sale: '18% OFF', hoverimg },
    { img: productImg, nameEn: 'Hibiscus Tea', nameUr: 'ہیبسکس چائے', description: 'Natural Tea', rating: 4.7, reviews: 406, price: 1149, oldPrice: 1299, sale: '20% OFF', hoverimg },
    { img: productImg, nameEn: 'Green Tea', nameUr: 'گرین ٹی', description: 'Organic Tea', rating: 4.5, reviews: 320, price: 999, oldPrice: 1200, sale: '15% OFF', hoverimg },
    { img: productImg, nameEn: 'Black Tea', nameUr: 'کالی چائے', description: 'Strong Tea', rating: 4.8, reviews: 512, price: 1149, oldPrice: 1399, sale: '18% OFF', hoverimg },
    { img: productImg, nameEn: 'Green Tea', nameUr: 'گرین ٹی', description: 'Organic Tea', rating: 4.5, reviews: 320, price: 999, oldPrice: 1200, sale: '15% OFF', hoverimg },
    { img: productImg, nameEn: 'Black Tea', nameUr: 'کالی چائے', description: 'Strong Tea', rating: 4.8, reviews: 512, price: 1149, oldPrice: 1399, sale: '18% OFF', hoverimg },
    { img: productImg, nameEn: 'Green Tea', nameUr: 'گرین ٹی', description: 'Organic Tea', rating: 4.5, reviews: 320, price: 999, oldPrice: 1200, sale: '15% OFF', hoverimg },
    { img: productImg, nameEn: 'Black Tea', nameUr: 'کالی چائے', description: 'Strong Tea', rating: 4.8, reviews: 512, price: 1149, oldPrice: 1399, sale: '18% OFF', hoverimg },
  ];

  const sliderRef = useRef<HTMLDivElement | null>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    const el = sliderRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
  };

  const scroll = (direction: "left" | "right") => {
    const el = sliderRef.current;
    if (!el) return;
    const cardEl = el.querySelector('.card-item') as HTMLElement;
    const cardWidth = cardEl ? cardEl.offsetWidth + 24 : 324;
    el.scrollBy({
      left: direction === "right" ? cardWidth : -cardWidth,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    const el = sliderRef.current;
    if (!el) return;
    checkScroll();
    el.addEventListener("scroll", checkScroll);
    return () => el.removeEventListener("scroll", checkScroll);
  }, []);

  return (
    <div className="mt-12">
      {/* Banner */}
      <section
        className="w-full relative"
        style={{ height: '90vh', minHeight: '50rem', maxHeight: '90rem' }}
      >
        <img src={banner4Img} alt="Combo Deals" className="w-full h-full object-cover" />
      </section>

      {/* Content */}
      <div className="mx-[4%]">
        <div className="max-w-[1920px] mx-auto">
          {/* Section Heading */}
          <div className="flex items-center justify-between mt-12 mb-4">
            <h2 className="text-3xl 2xl:text-4xl font-semibold font-poppins">
              Combo <span className="text-[#197B33]">Deals</span>
            </h2>
            <div className="flex gap-2">
              <BackwardArrow disabled={!canScrollLeft} onClick={() => scroll("left")} />
              <ForwardArrow disabled={!canScrollRight} onClick={() => scroll("right")} />
            </div>
          </div>

          {/* Product Cards - Horizontal Slider */}
          <div
            ref={sliderRef}
            className="flex gap-6 overflow-x-auto scroll-smooth no-scrollbar pb-20"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {comboProducts.map((product, index) => (
              <div
                key={index}
                className="card-item flex-shrink-0"
                style={{
                  width: 'clamp(260px, calc((min(100vw, 1920px) - 8vw - 72px) / 4), 460px)',
                }}
              >
                <ProductCard2 product={product} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}