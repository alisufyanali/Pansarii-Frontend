"use client";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import ForwardArrow from "@components/ForwardArrow";
import BackwardArrow from "@components/BackwardArrow";

interface BannerSlide {
  image: string;
  badge?: string;
  title?: string;
  description?: string;
  primaryBtn?: { label: string; href: string };
  secondaryBtn?: { label: string; href: string };
}

const slides: BannerSlide[] = [
  {
    image: "/images/Banner.png",
    badge: "✨ 100% Natural & Authentic",
    title: "Pansari Inn",
    description: "Nature heals 🌿 Handmade | Herbal Haircare | Plant Based Skincare | Women owned family business",
    primaryBtn:   { label: "Shop Now",         href: "/shop"      },
    secondaryBtn: { label: "Explore Remedies", href: "/remedies"  },
  },
  {
    image: "/images/Banner2.png",
    badge: "🌿 100% Organic",
    title: "Pure Herbal Oils",
    description: "Cold pressed, unrefined & full of nature's goodness. Trusted by thousands of families.",
    primaryBtn:   { label: "Shop Oils",  href: "/shop?category=oils" },
    secondaryBtn: { label: "Learn More", href: "/blog"               },
  },
  {
    image: "/images/Banner3.png",
    badge: "🎁 Special Offers",
    title: "Beauty Corner",
    description: "Discover handcrafted skincare made from the finest herbs & botanicals.",
    primaryBtn:   { label: "Explore",     href: "/shop?category=beauty" },
    secondaryBtn: { label: "View Offers", href: "/offers"               },
  },
];

export default function Banner() {
  const [current,   setCurrent]   = useState(0);
  const [animating, setAnimating] = useState(false);
  const [direction, setDirection] = useState<"left" | "right">("right");

  const goTo = (index: number, dir: "left" | "right") => {
    if (animating) return;
    setDirection(dir);
    setAnimating(true);
    setTimeout(() => { setCurrent(index); setAnimating(false); }, 400);
  };

  const handleNext = () => goTo((current + 1) % slides.length, "right");
  const handlePrev = () => goTo((current - 1 + slides.length) % slides.length, "left");

  useEffect(() => {
    const t = setInterval(() => goTo((current + 1) % slides.length, "right"), 5000);
    return () => clearInterval(t);
  }, [current, animating]);

  const slide = slides[current];

  const contentStyle = {
    opacity:   animating ? 0 : 1,
    transform: animating
      ? `translateX(${direction === "right" ? "-24px" : "24px"})`
      : "translateX(0)",
    transition: "opacity 0.4s ease, transform 0.4s ease",
  };

  return (
    <section className="relative w-full overflow-hidden h-[60vh] min-h-[420px] max-h-[680px]">

      {/* Background image */}
      <div
        className="absolute inset-0 w-full h-full"
        style={{
          opacity:   animating ? 0 : 1,
          transform: animating
            ? `translateX(${direction === "right" ? "-40px" : "40px"})`
            : "translateX(0)",
          transition: "opacity 0.5s ease, transform 0.5s ease",
        }}
      >
        <Image
          src={slide.image}
          alt={slide.title ?? "Banner"}
          fill
          className="object-cover object-center"
          priority
        />
      </div>

      {/* Subtle left-side gradient so text is readable */}
      <div className="absolute inset-0 z-[1] bg-gradient-to-r from-white/60 via-white/20 to-transparent" />

      {/* Content */}
      <div className="relative z-10 h-full flex items-center px-[4%]">
        <div className="w-full max-w-[1920px] mx-auto flex">

          {/* Left column */}
          <div className="w-1/2 flex flex-col justify-center gap-3 xl:gap-4" style={contentStyle}>

            {slide.badge && (
              <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#6C3F3F] bg-white/70 backdrop-blur-sm px-3 py-1 rounded-full w-fit">
                {slide.badge}
              </span>
            )}

            {slide.title && (
              <h1 className="text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl font-bold leading-tight text-[#005316] font-poppins">
                {slide.title}
              </h1>
            )}

            {slide.description && (
              <p className="text-sm lg:text-base xl:text-lg font-medium max-w-md xl:max-w-lg text-gray-800 leading-relaxed font-poppins">
                {slide.description}
              </p>
            )}

            {/* Buttons */}
            <div className="flex items-center gap-3 mt-2">
              {slide.primaryBtn && (
                <Link
                  href={slide.primaryBtn.href}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#FAA944] text-black font-semibold text-sm xl:text-base hover:bg-amber-500 transition-colors shadow-md hover:shadow-lg font-poppins"
                >
                  {slide.primaryBtn.label}
                  <span className="text-base font-bold">›</span>
                </Link>
              )}
              {slide.secondaryBtn && (
                <Link
                  href={slide.secondaryBtn.href}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#197B33] text-white font-semibold text-sm xl:text-base hover:bg-green-700 transition-colors shadow-md hover:shadow-lg font-poppins"
                >
                  {slide.secondaryBtn.label}
                  <span className="text-base font-bold">›</span>
                </Link>
              )}
            </div>

          </div>

          {/* Right column — image shows through */}
          <div className="w-1/2" />
        </div>
      </div>

      {/* Prev arrow */}
      <div className="absolute left-4 top-1/2 -translate-y-1/2 z-20">
        <BackwardArrow onClick={handlePrev} disabled={false} />
      </div>

      {/* Next arrow */}
      <div className="absolute right-4 top-1/2 -translate-y-1/2 z-20">
        <ForwardArrow onClick={handleNext} disabled={false} />
      </div>

      {/* Dot indicators */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i, i > current ? "right" : "left")}
            aria-label={`Go to slide ${i + 1}`}
            className={`rounded-full transition-all duration-300 ${
              i === current
                ? "w-6 h-2 bg-green-700"
                : "w-2 h-2 bg-white/60 hover:bg-white"
            }`}
          />
        ))}
      </div>

    </section>
  );
}
