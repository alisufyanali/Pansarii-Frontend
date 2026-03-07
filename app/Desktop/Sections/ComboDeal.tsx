"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";
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
      {/* Banner - Following the same structure as the first banner */}
      <section className="relative w-full h-[90vh] flex">
        {/* Background Image */}
        <div className="absolute inset-0 w-full h-full">
          <Image
            src={banner4Img}
            alt="Combo Deals Banner"
            fill
            className="object-cover object-top"
            priority
          />
        </div>

        {/* Dark overlay */}
        <div className="absolute inset-0 z-[1]"></div>

        {/* Content Overlay */}
        <div className="relative z-10 flex w-full mt-auto mb-auto px-[4%]">
          <div className="w-full max-w-[1920px] mx-auto flex">
            {/* Left Column */}
            <div className="w-1/2 flex flex-col justify-center px-4 xl:px-12 gap-4">
              <p
                className="text-[18px] 2xl:text-[22px] 4xl:text-[28px] font-bold"
                style={{
                  fontFamily: "Lexend, sans-serif",
                  lineHeight: "100%",
                  letterSpacing: "0%",
                  color: "#6C3F3F",
                }}
              >
                🎉 Special Offers
              </p>

              <h1
                className="text-5xl md:text-6xl 2xl:text-7xl 4xl:text-8xl font-bold"
                style={{ color: "#005316", fontFamily: "Lexend, sans-serif" }}
              >
                Combo Deals
              </h1>

              <p
                className="text-[18px] 2xl:text-[22px] 4xl:text-[26px] font-medium max-w-lg 2xl:max-w-2xl"
                style={{
                  fontFamily: "Poppins, sans-serif",
                  lineHeight: "140%",
                  letterSpacing: "0%",
                  color: "#000000",
                }}
              >
                Save big with our exclusive combos 🛒 | Buy 2 Get 1 Free | Limited time offers | Free shipping
              </p>

              <div className="mt-6 flex gap-4">
                <a
                  href="/combo-deals"
                  className="flex items-center justify-center font-semibold hover:opacity-90 transition-opacity text-sm 2xl:text-base 4xl:text-lg"
                  style={{
                    backgroundColor: "#FAA944",
                    color: "#000000",
                    padding: "16px 24px",
                    borderRadius: "45px",
                    fontFamily: "Poppins, sans-serif",
                  }}
                >
                  View Combos <span className="ml-2 text-lg">&gt;</span>
                </a>
                <a
                  href="/all-products"
                  className="flex items-center justify-center font-semibold hover:opacity-90 transition-opacity text-sm 2xl:text-base 4xl:text-lg"
                  style={{
                    backgroundColor: "#197B33",
                    color: "#ffffff",
                    padding: "16px 24px",
                    borderRadius: "45px",
                    fontFamily: "Poppins, sans-serif",
                  }}
                >
                  All Products <span className="ml-2 text-lg">&gt;</span>
                </a>
              </div>
            </div>

            {/* Right Column - Empty */}
            <div className="w-1/2"></div>
          </div>
        </div>
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