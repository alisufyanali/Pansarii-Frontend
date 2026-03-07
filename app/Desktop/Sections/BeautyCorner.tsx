"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import ProductCard from "@components/ProductCard";

export default function BeautyCorner() {
  const beautyCornerImg = '/images/beautycorner.png';
  const productimg = '/images/product.png';
  const productHoverImg = '/images/product-hover.png';

  const products = [
    { img: productimg, hoverImg: productHoverImg, nameEn: 'Organic Lavender Essential Oil', nameUr: 'روغن باکان بيد', description: 'Natural DHT Blocker | With Saw...', rating: 4.7, reviews: 406, price: 1149, oldPrice: 1499, sale: '20% OFF' },
    { img: productimg, hoverImg: productHoverImg, nameEn: 'Green Tea Extract', nameUr: 'گرین ٹی کا عرق', description: 'Boosts metabolism...', rating: 4.6, reviews: 320, price: 999 },
    { img: productimg, hoverImg: productHoverImg, nameEn: 'Chamomile Essential Oil', nameUr: 'کیمومائل تیل', description: 'Relaxing & soothing oil...', rating: 4.8, reviews: 210, price: 1199, sale: '15% OFF' },
    { img: productimg, hoverImg: productHoverImg, nameEn: 'Mint Herbal Oil', nameUr: 'پودینے کا تیل', description: 'Refreshing oil...', rating: 4.5, reviews: 180, price: 899 },
    { img: productimg, hoverImg: productHoverImg, nameEn: 'Rosehip Oil', nameUr: 'گلاب ہپ تیل', description: 'Anti-aging...', rating: 4.6, reviews: 220, price: 1099 },
    { img: productimg, hoverImg: productHoverImg, nameEn: 'Argan Oil', nameUr: 'ارگن کا تیل', description: 'Hair & skin care...', rating: 4.7, reviews: 150, price: 1299 },
    { img: productimg, hoverImg: productHoverImg, nameEn: 'Jojoba Oil', nameUr: 'جوجوبا تیل', description: 'Moisturizing...', rating: 4.5, reviews: 180, price: 999 },
    { img: productimg, hoverImg: productHoverImg, nameEn: 'Tea Tree Oil', nameUr: 'ٹی ٹری آئل', description: 'Acne control...', rating: 4.6, reviews: 210, price: 1199 },
  ];

  const [cardsToShow, setCardsToShow] = useState(4);

  const updateCardsToShow = () => {
    const width = window.innerWidth;
    if (width >= 2560) setCardsToShow(8);
    else if (width >= 1920) setCardsToShow(6);
    else if (width >= 1280) setCardsToShow(4);
    else if (width >= 768) setCardsToShow(2);
    else setCardsToShow(1);
  };

  useEffect(() => {
    updateCardsToShow();
    window.addEventListener("resize", updateCardsToShow);
    return () => window.removeEventListener("resize", updateCardsToShow);
  }, []);

  return (
    <div className="mt-12">
      {/* Banner - Following the same structure as the first banner */}
      <section className="relative w-full h-[90vh] flex">
        {/* Background Image */}
        <div className="absolute inset-0 w-full h-full">
          <Image
            src={beautyCornerImg}
            alt="Beauty Corner Banner"
            fill
            className="object-cover object-top"
            priority
          />
        </div>

        {/* Dark overlay - keep empty as per original */}
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
                ✨ Natural Beauty
              </p>

              <h1
                className="text-5xl md:text-6xl 2xl:text-7xl 4xl:text-8xl font-bold"
                style={{ color: "#005316", fontFamily: "Lexend, sans-serif" }}
              >
                Beauty Corner
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
                Discover natural beauty products 🌸 | Organic Skincare | Herbal Cosmetics | Cruelty-free
              </p>

              <div className="mt-6 flex gap-4">
                <a
                  href="/shop"
                  className="flex items-center justify-center font-semibold hover:opacity-90 transition-opacity text-sm 2xl:text-base 4xl:text-lg"
                  style={{
                    backgroundColor: "#FAA944",
                    color: "#000000",
                    padding: "16px 24px",
                    borderRadius: "45px",
                    fontFamily: "Poppins, sans-serif",
                  }}
                >
                  Shop Now <span className="ml-2 text-lg">&gt;</span>
                </a>
                <a
                  href="/beauty-tips"
                  className="flex items-center justify-center font-semibold hover:opacity-90 transition-opacity text-sm 2xl:text-base 4xl:text-lg"
                  style={{
                    backgroundColor: "#197B33",
                    color: "#ffffff",
                    padding: "16px 24px",
                    borderRadius: "45px",
                    fontFamily: "Poppins, sans-serif",
                  }}
                >
                  Beauty Tips <span className="ml-2 text-lg">&gt;</span>
                </a>
              </div>
            </div>

            {/* Right Column - Empty */}
            <div className="w-1/2"></div>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <div className="mx-[4%]">
        <div className="max-w-[1920px] mx-auto">
          {/* Heading and View All */}
          <div className="mt-16 mb-6 flex items-center justify-between">
            <h2 className="text-3xl 2xl:text-4xl font-semibold font-poppins me-color-g">
              Beauty <span className="text-[#197B33]">Corner</span>
            </h2>

            <div className="flex items-center gap-4 cursor-pointer group">
              <span className="text-black font-semibold group-hover:text-[#197B33] transition-colors 2xl:text-lg">
                View All
              </span>
              <div className="w-10 h-10 flex items-center justify-center rounded-full bg-[#1A1A1A1A] text-dark group-hover:bg-[#197B33] group-hover:text-white transition-all">
                <span className="text-lg font-bold">{'>'}</span>
              </div>
            </div>
          </div>

          {/* Product Cards Grid */}
          <div
            className="grid gap-6 2xl:gap-8 pb-20"
            style={{ gridTemplateColumns: `repeat(${cardsToShow}, minmax(0, 1fr))` }}
          >
            {products.slice(0, cardsToShow).map((product, index) => (
              <ProductCard key={index} product={product} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}