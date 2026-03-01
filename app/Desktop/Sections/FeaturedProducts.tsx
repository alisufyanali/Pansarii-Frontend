"use client";

import { useRef, useState, useEffect } from "react";
import ProductCard2 from "@components/ProductCard2";
import ForwardArrow from "@components/ForwardArrow";
import BackwardArrow from "@components/BackwardArrow";

interface Product {
  id: string | number;
  nameEn: string;
  nameUr: string;
  rating: number;
  reviews: number;
  price: number;
  oldPrice?: number | null;
  img: string;
  hoverimg: string;
}

export default function FeaturedProducts() {
  const featuredProducts: Product[] = [
    { id: 1, nameEn: "Hibiscus Tea", nameUr: "ہیبسکس چائے", rating: 4.7, reviews: 406, price: 1149, oldPrice: 1499, img: "/images/category.png", hoverimg: "/images/product.png" },
    { id: 2, nameEn: "Green Oil", nameUr: "سبز تیل", rating: 4.5, reviews: 210, price: 999, oldPrice: 1299, img: "/images/category.png", hoverimg: "/images/product.png" },
    { id: 3, nameEn: "Orange Oil", nameUr: "نارنجی کا تیل", rating: 4.8, reviews: 320, price: 1149, img: "/images/category.png", hoverimg: "/images/product.png" },
    { id: 4, nameEn: "Herbal Soap", nameUr: "جڑی بوٹیوں کا صابن", rating: 4.6, reviews: 150, price: 599, oldPrice: 799, img: "/images/category.png", hoverimg: "/images/product.png" },
    { id: 5, nameEn: "Hibiscus Tea", nameUr: "ہیبسکس چائے", rating: 4.7, reviews: 406, price: 1149, oldPrice: 1499, img: "/images/category.png", hoverimg: "/images/product.png" },
    { id: 6, nameEn: "Green Oil", nameUr: "سبز تیل", rating: 4.5, reviews: 210, price: 999, oldPrice: 1299, img: "/images/category.png", hoverimg: "/images/product.png" },
    { id: 7, nameEn: "Orange Oil", nameUr: "نارنجی کا تیل", rating: 4.8, reviews: 320, price: 1149, img: "/images/category.png", hoverimg: "/images/product.png" },
    { id: 8, nameEn: "Herbal Soap", nameUr: "جڑی بوٹیوں کا صابن", rating: 4.6, reviews: 150, price: 599, oldPrice: 799, img: "/images/category.png", hoverimg: "/images/product.png" },
  ];

  const sliderRef = useRef<HTMLDivElement | null>(null);
  const [canScrollLeft, setCanScrollLeft] = useState<boolean>(false);
  const [canScrollRight, setCanScrollRight] = useState<boolean>(true);

  const checkScroll = (): void => {
    const el = sliderRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
  };

  const scroll = (direction: "left" | "right"): void => {
    const el = sliderRef.current;
    if (!el) return;
    const cardElement = el.querySelector('.card-item') as HTMLElement;
    if (!cardElement) return;
    const cardWidth = cardElement.clientWidth + 24; // 24 = gap-6
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
    <section className="mt-8 font-poppins mx-[4%] my-4">
      <div className="max-w-[1920px] mx-auto">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-2xl 2xl:text-3xl font-semibold my-4 mb-4">
            Featured <span className="text-green-700">Products</span>
          </h2>
          <div className="flex gap-2">
            <BackwardArrow disabled={!canScrollLeft} onClick={() => scroll("left")} />
            <ForwardArrow disabled={!canScrollRight} onClick={() => scroll("right")} />
          </div>
        </div>

        <div
          ref={sliderRef}
          className="flex gap-6 overflow-x-auto scroll-smooth no-scrollbar pb-4"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {featuredProducts.map((product) => (
            <div
              key={product.id}
              className="flex-shrink-0 card-item"
              style={{
                // 4 cards on laptop minimum, grows with screen on larger displays
                width: 'clamp(260px, calc((min(100vw, 1920px) - 8vw - 72px) / 4), 440px)',
              }}
            >
              <ProductCard2 product={product} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}