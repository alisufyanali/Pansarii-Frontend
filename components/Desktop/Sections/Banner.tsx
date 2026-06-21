"use client";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import ForwardArrow from "@components/ForwardArrow";
import BackwardArrow from "@components/BackwardArrow";
import {
  getSlides,
  mapApiSlideToBanner,
  DEFAULT_SLIDES,
  type BannerSlide,
} from "@/lib/slides";

function BannerSkeleton() {
  return (
    <section className="relative w-full overflow-hidden h-[70vh] min-h-[460px] max-h-[680px] bg-gray-200 animate-pulse" />
  );
}

function SlideBackground({ slide, priority }: { slide: BannerSlide; priority: boolean }) {
  if (slide.video) {
    return (
      <video
        src={slide.video}
        className="absolute inset-0 w-full h-full object-cover"
        autoPlay
        muted
        loop
        playsInline
        poster={slide.image}
      />
    );
  }

  return (
    <Image
      src={slide.image}
      alt={slide.title ?? "Banner"}
      fill
      className="object-fill"
      priority={priority}
      fetchPriority={priority ? "high" : "low"}
      sizes="100vw"
      quality={70}
    />
  );
}

export default function Banner() {
  const [slides, setSlides] = useState<BannerSlide[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    getSlides()
      .then(apiSlides => {
        const mapped = (apiSlides ?? [])
          .filter(s => s.image || s.video)
          .map(mapApiSlideToBanner);
        setSlides(mapped.length > 0 ? mapped : null);
      })
      .catch(() => setSlides(null))
      .finally(() => setLoading(false));
  }, []);

  const displaySlides = slides ?? DEFAULT_SLIDES;

  const handleNext = () => setCurrent(c => (c + 1) % displaySlides.length);
  const handlePrev = () => setCurrent(c => (c - 1 + displaySlides.length) % displaySlides.length);

  useEffect(() => {
    if (displaySlides.length <= 1) return;
    const t = setInterval(() => setCurrent(c => (c + 1) % displaySlides.length), 5000);
    return () => clearInterval(t);
  }, [displaySlides.length]);

  useEffect(() => {
    if (current >= displaySlides.length) setCurrent(0);
  }, [displaySlides.length, current]);

  if (loading) return <BannerSkeleton />;

  const slide = displaySlides[current];

  return (
    <section className="relative w-full overflow-hidden h-[70vh] min-h-[460px] max-h-[680px]">

      {/* Background image or video */}
      <div className="absolute w-full h-full duration-500">
        <SlideBackground slide={slide} priority={current === 0} />
      </div>

      {/* Subtle left-side gradient so text is readable */}
      <div className="absolute inset-0 z-[1] bg-gradient-to-r from-white/60 via-white/20 to-transparent" />

      {/* Content */}
      <div className="relative z-10 h-full flex items-center px-[4%]">
        <div className="w-full max-w-[1920px] mx-auto flex">

          {/* Left column */}
          <div className="w-1/2 flex flex-col justify-center gap-3 xl:gap-4 transition-opacity duration-300">

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
      {displaySlides.length > 1 && (
        <div className="absolute left-4 top-1/2 -translate-y-1/2 z-20">
          <BackwardArrow onClick={handlePrev} disabled={false} />
        </div>
      )}

      {/* Next arrow */}
      {displaySlides.length > 1 && (
        <div className="absolute right-4 top-1/2 -translate-y-1/2 z-20">
          <ForwardArrow onClick={handleNext} disabled={false} />
        </div>
      )}

      {/* Dot indicators */}
      {displaySlides.length > 1 && (
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 flex gap-2" role="group" aria-label="Banner slides">
          {displaySlides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              aria-label={`Go to slide ${i + 1}`}
              aria-current={i === current ? 'true' : 'false'}
              className={`rounded-full transition-all duration-300 ${
                i === current
                  ? "w-6 h-2 bg-green-700"
                  : "w-2 h-2 bg-white/60 hover:bg-white"
              }`}
            />
          ))}
        </div>
      )}

    </section>
  );
}
