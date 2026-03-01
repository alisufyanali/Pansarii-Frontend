"use client";
import { useRef, useState, useEffect } from "react";
import ProductCard from "@components/ProductCard";
import ForwardArrow from "@components/ForwardArrow";
import BackwardArrow from "@components/BackwardArrow";

export default function NewArrivals() {
  const productImage = '/images/product.png';
  const productHoverImage = '/images/product-hover.png';

  const products = [
    { img: productImage, hoverImg: productHoverImage, nameEn: "Organic Lavender Essential Oil", nameUr: "روغن باكان بيد", description: "Natural DHT Blocker | With Saw...", rating: 4.7, reviews: 406, price: 1149, sale: "20% OFF" },
    { img: productImage, hoverImg: productHoverImage, nameEn: "Green Tea Extract", nameUr: "گرین ٹی کا عرق", description: "Boosts metabolism and energy...", rating: 4.6, reviews: 320, price: 999 },
    { img: productImage, hoverImg: productHoverImage, nameEn: "Chamomile Essential Oil", nameUr: "کیمومائل تیل", description: "Relaxing & soothing oil...", rating: 4.8, reviews: 210, price: 1199, sale: "15% OFF" },
    { img: productImage, hoverImg: productHoverImage, nameEn: "Mint Herbal Oil", nameUr: "پودینے کا تیل", description: "Refreshing oil for daily use...", rating: 4.5, reviews: 180, price: 899 },
    { img: productImage, hoverImg: productHoverImage, nameEn: "Organic Lavender Essential Oil", nameUr: "روغن باكان بيد", description: "Natural DHT Blocker | With Saw...", rating: 4.7, reviews: 406, price: 1149, sale: "20% OFF" },
    { img: productImage, hoverImg: productHoverImage, nameEn: "Green Tea Extract", nameUr: "گرین ٹی کا عرق", description: "Boosts metabolism and energy...", rating: 4.6, reviews: 320, price: 999 },
    { img: productImage, hoverImg: productHoverImage, nameEn: "Chamomile Essential Oil", nameUr: "کیمومائل تیل", description: "Relaxing & soothing oil...", rating: 4.8, reviews: 210, price: 1199, sale: "15% OFF" },
    { img: productImage, hoverImg: productHoverImage, nameEn: "Mint Herbal Oil", nameUr: "پودینے کا تیل", description: "Refreshing oil for daily use...", rating: 4.5, reviews: 180, price: 899 },
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
    // Calculate card width dynamically based on container
    const cardEl = el.querySelector('.card-item') as HTMLElement;
    const cardWidth = cardEl ? cardEl.offsetWidth + 24 : 344; // 24 = gap-6
    el.scrollBy({ left: direction === "right" ? cardWidth : -cardWidth, behavior: "smooth" });
  };

  useEffect(() => {
    const el = sliderRef.current;
    if (!el) return;
    checkScroll();
    el.addEventListener("scroll", checkScroll);
    return () => el.removeEventListener("scroll", checkScroll);
  }, []);

  return (
    <section className="NewArrivals mt-12 mx-[4%]">
      <div className="max-w-[1920px] mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl 2xl:text-3xl font-semibold">
            New <span className="text-green-700">Arrivals</span>
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
          {products.map((product, i) => (
            /*
              Card width responsive:
              - Mobile: 280px
              - md: 260px
              - lg (laptop): fills 4 cards per view = calc((100vw * 0.92 - 3 * 24px) / 4)
              - 2xl: calc((min(100vw, 1920px) * 0.92 - 3 * 24px) / 4)
            */
            <div
              key={i}
              className="card-item flex-shrink-0"
              style={{
                width: 'clamp(260px, calc((min(100vw, 1920px) - 8vw - 72px) / 4), 460px)',
              }}
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}