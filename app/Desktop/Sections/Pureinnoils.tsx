"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ProductCard from '@components/ProductCard';
import { allProducts } from "@/app/Desktop/data/products";

export default function PansariInn() {
  const router = useRouter();
  const banner2Img = '/images/Banner2.png';
  const banner3Img = '/images/Banner3.png';

  // Define different product categories for each section
  const sections = [
    {
      title: 'PureInn',
      subtitle: 'Oils',
      bannerImg: banner2Img,
      products: allProducts.filter(p => p.category === 'Oils'),
      categoryFilter: 'Oils'
    },
    {
      title: 'PureInn',
      subtitle: 'Herbal Extracts',
      bannerImg: banner3Img,
      products: allProducts.filter(p => p.category === 'Herb'),
      categoryFilter: 'Herb'
    }
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

  return (
    <>
      {sections.map((section, index) => (
        <div key={index} className="mt-12">
          {/* Banner */}
          <section
            className="w-full relative"
            style={{ height: "70vh", minHeight: "30rem", maxHeight: "45rem" }}
          >
            <img src={section.bannerImg} alt={section.title} className="w-full h-full object-cover" />
          </section>

          {/* Content Section */}
          <div className="mx-[4%]">
            <div className="max-w-[1920px] mx-auto">
              {/* Heading and View All */}
              <div className="mt-16 mb-6 flex items-center justify-between">
                <h2 className="text-3xl 2xl:text-4xl font-semibold font-poppins ">
                  {section.title} <span className="me-color-y">{section.subtitle}</span>
                </h2>

                {/* View All → /shop filtered by category */}
                <div
                  className="flex items-center gap-4 cursor-pointer group"
                  onClick={() => router.push(`/shop?category=${encodeURIComponent(section.categoryFilter)}`)}
                >
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
                {section.products.length > 0 ? (
                  section.products.slice(0, cardsToShow).map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))
                ) : (
                  <div className="col-span-full text-center py-10 text-gray-500">
                    No products found in this category
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
    </>
  );
}