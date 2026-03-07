"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import ProductCard from '@components/ProductCard';

export default function PansariInn() {
  const banner2Img = '/images/Banner2.png';
  const banner3Img = '/images/Banner3.png';
  const productImg = '/images/product.png';
  const productHoverImg = '/images/product-hover.png';

  const productsRow = [
    { img: productImg, hoverImg: productHoverImg, nameEn: 'Cold Pressed Almond Oil', nameUr: 'بادام کا تیل', description: 'Pure & Organic Almond Oil', rating: 4.8, reviews: 320, price: 899, oldPrice: 1099, sale: '15% OFF' },
    { img: productImg, hoverImg: productHoverImg, nameEn: 'Organic Coconut Oil', nameUr: 'ناریل کا تیل', description: 'Virgin Coconut Oil for Skin & Hair', rating: 4.7, reviews: 412, price: 749, oldPrice: 999, sale: '25% OFF' },
    { img: productImg, hoverImg: productHoverImg, nameEn: 'Black Seed Oil', nameUr: 'کلونجی کا تیل', description: 'Cold Pressed Black Seed Oil', rating: 4.9, reviews: 220, price: 1299, oldPrice: 1599, sale: '20% OFF' },
    { img: productImg, hoverImg: productHoverImg, nameEn: 'Argan Oil', nameUr: 'ارگن آئل', description: 'Moroccan Argan Oil', rating: 4.6, reviews: 305, price: 1399, oldPrice: 1699, sale: '18% OFF' },
    { img: productImg, hoverImg: productHoverImg, nameEn: 'Sesame Oil', nameUr: 'تل کا تیل', description: 'Cold Pressed Sesame Oil', rating: 4.5, reviews: 180, price: 699, oldPrice: 899, sale: '20% OFF' },
    { img: productImg, hoverImg: productHoverImg, nameEn: 'Mustard Oil', nameUr: 'سرسوں کا تیل', description: 'Organic Mustard Oil', rating: 4.7, reviews: 250, price: 799, oldPrice: 999, sale: '15% OFF' },
    { img: productImg, hoverImg: productHoverImg, nameEn: 'Argan Oil', nameUr: 'ارگن آئل', description: 'Moroccan Argan Oil', rating: 4.6, reviews: 305, price: 1399, oldPrice: 1699, sale: '18% OFF' },
    { img: productImg, hoverImg: productHoverImg, nameEn: 'Sesame Oil', nameUr: 'تل کا تیل', description: 'Cold Pressed Sesame Oil', rating: 4.5, reviews: 180, price: 699, oldPrice: 899, sale: '20% OFF' },
    { img: productImg, hoverImg: productHoverImg, nameEn: 'Argan Oil', nameUr: 'ارگن آئل', description: 'Moroccan Argan Oil', rating: 4.6, reviews: 305, price: 1399, oldPrice: 1699, sale: '18% OFF' },
    { img: productImg, hoverImg: productHoverImg, nameEn: 'Sesame Oil', nameUr: 'تل کا تیل', description: 'Cold Pressed Sesame Oil', rating: 4.5, reviews: 180, price: 699, oldPrice: 899, sale: '20% OFF' },
  ];

  const [cardsToShow, setCardsToShow] = useState(4);

  const updateLayout = () => {
    const width = window.innerWidth;
    if (width >= 1920) setCardsToShow(6);
    else if (width >= 1536) setCardsToShow(5);
    else if (width >= 1280) setCardsToShow(4);
    else if (width >= 1024) setCardsToShow(3);
    else if (width >= 768) setCardsToShow(2);
    else setCardsToShow(1);
  };

  useEffect(() => {
    updateLayout();
    window.addEventListener("resize", updateLayout);
    return () => window.removeEventListener("resize", updateLayout);
  }, []);

  const renderSection = (bannerTitle: string, bannerImg: string, title: string, products: any[]) => (
    <div className="mt-12">
      {/* Banner - Following the same structure as the first banner */}
      <section className="relative w-full h-[90vh] flex">
        {/* Background Image */}
        <div className="absolute inset-0 w-full h-full">
          <Image
            src={bannerImg}
            alt={`${bannerTitle} Banner`}
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
                🌿 Pure & Natural
              </p>

              <h1
                className="text-5xl md:text-6xl 2xl:text-7xl 4xl:text-8xl font-bold"
                style={{ color: "#005316", fontFamily: "Lexend, sans-serif" }}
              >
                {title}
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
                Cold pressed oils for health & beauty | 100% Organic | Chemical-free | Family tradition since 1980
              </p>

              <div className="mt-6 flex gap-4">
                <a
                  href="/shop/oils"
                  className="flex items-center justify-center font-semibold hover:opacity-90 transition-opacity text-sm 2xl:text-base 4xl:text-lg"
                  style={{
                    backgroundColor: "#FAA944",
                    color: "#000000",
                    padding: "16px 24px",
                    borderRadius: "45px",
                    fontFamily: "Poppins, sans-serif",
                  }}
                >
                  Shop Oils <span className="ml-2 text-lg">&gt;</span>
                </a>
                <a
                  href="/oil-guide"
                  className="flex items-center justify-center font-semibold hover:opacity-90 transition-opacity text-sm 2xl:text-base 4xl:text-lg"
                  style={{
                    backgroundColor: "#197B33",
                    color: "#ffffff",
                    padding: "16px 24px",
                    borderRadius: "45px",
                    fontFamily: "Poppins, sans-serif",
                  }}
                >
                  Oil Guide <span className="ml-2 text-lg">&gt;</span>
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
              PureInn <span className="text-[#197B33]">Oils</span>
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

  return (
    <>
      {renderSection('Pansari Inn Oils', banner2Img, 'Pansari Inn Oils', productsRow.slice(0, 6))}
      {renderSection('Pansari Inn Premium', banner3Img, 'Premium Collection', productsRow.slice(0, 6))}
    </>
  );
}