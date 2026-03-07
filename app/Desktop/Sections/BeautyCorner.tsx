"use client";

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
      {/* Banner */}
      <section
        className="w-full relative"
        style={{ height: '90vh', minHeight: '40rem', maxHeight: '90rem' }}
      >
        <img src={beautyCornerImg} alt="Beauty Corner" className="w-full h-full object-cover" />
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