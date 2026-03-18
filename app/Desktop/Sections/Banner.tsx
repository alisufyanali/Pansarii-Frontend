"use client";
import Image from "next/image";
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

// ── Mock data — replace with your API/JSON fetch ──────────────────────────
const slides: BannerSlide[] = [
  {
    image: "/images/Banner.png",
    badge: "✨ 100% Natural & Authentic",
    title: "Pansari Inn",
    description: "Nature heals 🌿 Handmade | Herbal Haircare | Plant Based Skincare | Women owned family business",
    primaryBtn: { label: "Shop Now", href: "/shop" },
    secondaryBtn: { label: "Explore Remedies", href: "/remedies" },
  },
  {
    image: "/images/Banner2.png",
    badge: "🌿 100% Organic",
    title: "Pure Herbal Oils",
    description: "Cold pressed, unrefined & full of nature's goodness. Trusted by thousands of families.",
    primaryBtn: { label: "Shop Oils", href: "/shop?category=oils" },
    secondaryBtn: { label: "Learn More", href: "/blog" },
  },
  {
    image: "/images/Banner3.png",
    badge: "🎁 Special Offers",
    title: "Beauty Corner",
    description: "Discover handcrafted skincare made from the finest herbs & botanicals.",
    primaryBtn: { label: "Explore", href: "/shop?category=beauty" },
    secondaryBtn: { label: "View Offers", href: "/offers" },
  },
];
// ─────────────────────────────────────────────────────────────────────────

export default function Banner() {
  const [current, setCurrent] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [direction, setDirection] = useState<"left" | "right">("right");

  const goTo = (index: number, dir: "left" | "right") => {
    if (animating) return;
    setDirection(dir);
    setAnimating(true);
    setTimeout(() => {
      setCurrent(index);
      setAnimating(false);
    }, 400);
  };

  const handleNext = () => {
    if (current < slides.length - 1) goTo(current + 1, "right");
  };

  const handlePrev = () => {
    if (current > 0) goTo(current - 1, "left");
  };

  // Auto-play every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      const next = (current + 1) % slides.length;
      goTo(next, "right");
    }, 5000);
    return () => clearInterval(timer);
  }, [current, animating]);

  const slide = slides[current];

  return (
    <section
      className="relative w-full flex overflow-hidden "
      style={{ height: "70vh", minHeight: "30rem", maxHeight: "45rem" }}
    >
      {/* Background Image with fade + slide animation */}
      <div
        className="absolute inset-0 w-full h-full transition-all duration-500 ease-in-out"
        style={{
          opacity: animating ? 0 : 1,
          transform: animating
            ? `translateX(${direction === "right" ? "-40px" : "40px"})`
            : "translateX(0)",
        }}
      >
        <Image
          src={slide.image}
          alt={slide.title || "Banner"}
          fill
          className="object-cover object-center"
          priority
        />
      </div>

      {/* Dark overlay */}
      <div className="absolute inset-0 z-[1]" />

      {/* Content */}
      <div className="relative z-10 flex w-full mt-auto mb-auto px-[4%]">
        <div className="w-full max-w-[1920px] mx-auto flex">

          {/* Left Column — text content animates with slide */}
          <div
            className="w-1/2 flex flex-col justify-center px-4 xl:px-12 gap-4 transition-all duration-500 ease-in-out"
            style={{
              opacity: animating ? 0 : 1,
              transform: animating
                ? `translateX(${direction === "right" ? "-24px" : "24px"})`
                : "translateX(0)",
            }}
          >
            {slide.badge && (
              <p
                className="text-[18px] 2xl:text-[22px] font-bold"
                style={{
                  fontFamily: "Lexend, sans-serif",
                  lineHeight: "100%",
                  color: "#6C3F3F",
                }}
              >
                {slide.badge}
              </p>
            )}

            {slide.title && (
              <h1
                className="text-5xl md:text-6xl 2xl:text-7xl font-bold"
                style={{ color: "#005316", fontFamily: "Lexend, sans-serif" }}
              >
                {slide.title}
              </h1>
            )}

            {slide.description && (
              <p
                className="text-[18px] 2xl:text-[22px] font-medium max-w-lg 2xl:max-w-2xl"
                style={{
                  fontFamily: "Poppins, sans-serif",
                  lineHeight: "140%",
                  color: "#000000",
                }}
              >
                {slide.description}
              </p>
            )}

            <div className="mt-6 flex gap-4">
              {slide.primaryBtn && (
                <a
                  href={slide.primaryBtn.href}
                  className="flex items-center justify-center font-semibold hover:opacity-90 transition-opacity text-sm 2xl:text-base"
                  style={{
                    backgroundColor: "#FAA944",
                    color: "#000000",
                    padding: "16px 24px",
                    borderRadius: "45px",
                    fontFamily: "Poppins, sans-serif",
                  }}
                >
                  {slide.primaryBtn.label} <span className="ml-2 text-lg">&gt;</span>
                </a>
              )}
              {slide.secondaryBtn && (
                <a
                  href={slide.secondaryBtn.href}
                  className="flex items-center justify-center font-semibold hover:opacity-90 transition-opacity text-sm 2xl:text-base"
                  style={{
                    backgroundColor: "#197B33",
                    color: "#ffffff",
                    padding: "16px 24px",
                    borderRadius: "45px",
                    fontFamily: "Poppins, sans-serif",
                  }}
                >
                  {slide.secondaryBtn.label} <span className="ml-2 text-lg">&gt;</span>
                </a>
              )}
            </div>
          </div>

          {/* Right Column — image shows through */}
          <div className="w-1/2" />
        </div>
      </div>

      {/* Left Arrow */}
      <div className="absolute left-4 top-1/2 -translate-y-1/2 z-20">
        <BackwardArrow onClick={handlePrev} disabled={current === 0} />
      </div>

      {/* Right Arrow */}
      <div className="absolute right-4 top-1/2 -translate-y-1/2 z-20">
        <ForwardArrow onClick={handleNext} disabled={current === slides.length - 1} />
      </div>

      {/* Dot indicators */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i, i > current ? "right" : "left")}
            className="transition-all duration-300 rounded-full"
            style={{
              width: i === current ? "24px" : "8px",
              height: "8px",
              backgroundColor: i === current ? "#197B33" : "rgba(255,255,255,0.6)",
            }}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
}