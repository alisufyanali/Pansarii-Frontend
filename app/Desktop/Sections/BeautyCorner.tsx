"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ProductCard from "@components/ProductCard";
import { allProducts } from "@/app/Desktop/data/products";

export default function BeautyCorner() {
  const router = useRouter();
  const beautyCornerImg = '/images/beautycorner.png';

  // Real products filtered by category
  const products = allProducts.filter(p => p.category === 'Beauty & Skincare');

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
            <h2 className="text-3xl 2xl:text-4xl font-semibold font-poppins ">
              Beauty <span className="me-color-y">Corner</span>
            </h2>

            {/* View All → /shop filtered by Beauty & Skincare */}
            <div
              className="flex items-center gap-4 cursor-pointer group"
              onClick={() => router.push('/shop?category=Beauty+%26+Skincare')}
            >
              <span className="text-black font-semibold group-hover:text-[#197B33] transition-colors 2xl:text-lg">
                View All
              </span>
              <div className="w-10 h-10 flex items-center justify-center rounded-full bg-[#1A1A1A1A] text-dark group-hover:bg-[#197B33] group-hover:text-white transition-all">
                <span className="text-lg font-bold">{'>'}</span>
              </div>
            </div>
          </div>

          {/* Product Cards Grid — ProductCard handles its own click → /product/:id */}
          <div
            className="grid gap-6 2xl:gap-8 pb-20"
            style={{ gridTemplateColumns: `repeat(${cardsToShow}, minmax(0, 1fr))` }}
          >
            {products.slice(0, cardsToShow).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}