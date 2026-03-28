"use client";

import { useRef, useState, useEffect } from "react";
import ProductCard2 from '@components/ProductCard2';
import ForwardArrow from '@components/ForwardArrow';
import BackwardArrow from '@components/BackwardArrow';
import { allProducts } from "@/app/Desktop/data/products";

export default function ComboDeal() {
  const banner4Img = '/images/Banner4.png';
  
  // Filter products for combo deals
  const allComboProducts = allProducts
    .filter(p => p.category === 'Supplements') // Change this as needed
    .map(p => ({ ...p, hoverimg: p.img }));
  
  const [cardsToShow, setCardsToShow] = useState(4);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

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

  // Update scroll buttons state based on current index
  useEffect(() => {
    setCanScrollLeft(currentIndex > 0);
    setCanScrollRight(currentIndex + cardsToShow < allComboProducts.length);
  }, [currentIndex, cardsToShow, allComboProducts.length]);

  const scroll = (direction: "left" | "right") => {
    if (direction === "left" && canScrollLeft) {
      setCurrentIndex(prev => Math.max(0, prev - 1));
    } else if (direction === "right" && canScrollRight) {
      setCurrentIndex(prev => Math.min(allComboProducts.length - cardsToShow, prev + 1));
    }
  };

  const visibleProducts = allComboProducts.slice(currentIndex, currentIndex + cardsToShow);

  if (allComboProducts.length === 0) {
    return (
      <div className="mt-12">
        <section
          className="w-full relative"
          style={{ height: "70vh", minHeight: "30rem", maxHeight: "45rem"}}
        >
          <img src={banner4Img} alt="Combo Deals" className="w-full h-full object-cover" />
        </section>
        <div className="mx-[4%] text-center py-20">
          <p className="text-gray-500">No combo deals available at the moment.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-12">
      {/* Banner */}
      <section
        className="w-full relative"
        style={{ height: "70vh", minHeight: "30rem", maxHeight: "45rem"}}
      >
        <img src={banner4Img} alt="Combo Deals" className="w-full h-full object-cover" />
      </section>

      {/* Content */}
      <div className="mx-[4%]">
        <div className="max-w-[1920px] mx-auto">
          {/* Section Heading */}
          <div className="flex items-center justify-between mt-12 mb-4">
            <h2 className="text-3xl 2xl:text-4xl font-semibold font-poppins">
              Combo <span className="me-color-y">Deals</span>
            </h2>
            <div className="flex gap-2">
              <BackwardArrow disabled={!canScrollLeft} onClick={() => scroll("left")} />
              <ForwardArrow disabled={!canScrollRight} onClick={() => scroll("right")} />
            </div>
          </div>

          {/* Product Cards Grid */}
          <div
            className="grid gap-6 2xl:gap-8 pb-20"
            style={{ gridTemplateColumns: `repeat(${cardsToShow}, minmax(0, 1fr))` }}
          >
            {visibleProducts.map((product) => (
              <ProductCard2 key={product.id} product={product} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}