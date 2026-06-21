"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  getSlides,
  mapApiSlideToBanner,
  DEFAULT_MOBILE_SLIDES,
  type BannerSlide,
} from '@/lib/slides';

const fallbackColors = [
  'from-green-600 to-emerald-500',
  'from-orange-600 to-red-500',
  'from-purple-600 to-pink-500',
];

function HeroBannerSkeleton() {
  return (
    <div className="relative mx-4 mt-4 rounded-2xl overflow-hidden h-48 bg-gray-200 animate-pulse" />
  );
}

export default function HeroBanner() {
  const [slides, setSlides] = useState<BannerSlide[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [current, setCurrent] = useState(0);
  const [imgErrors, setImgErrors] = useState<Record<number, boolean>>({});

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

  const banners = slides ?? DEFAULT_MOBILE_SLIDES;

  useEffect(() => {
    if (banners.length <= 1) return;
    const t = setInterval(() => setCurrent(p => (p + 1) % banners.length), 5000);
    return () => clearInterval(t);
  }, [banners.length]);

  if (loading) return <HeroBannerSkeleton />;

  return (
    <div className="relative mx-4 mt-4 rounded-2xl overflow-hidden h-48">
      {banners.map((banner, index) => {
        const href = banner.link ?? banner.primaryBtn?.href ?? '/shop';
        const title = banner.title ?? 'Premium Ayurvedic';
        const subtitle = banner.subtitle ?? banner.description ?? 'Natural & Organic';

        return (
          <Link
            key={banner.id ?? index}
            href={href}
            className={`absolute inset-0 transition-opacity duration-700 ${
              index === current ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
          >
            {banner.video ? (
              <>
                <video
                  src={banner.video}
                  className="absolute inset-0 w-full h-full object-cover object-center"
                  autoPlay
                  muted
                  loop
                  playsInline
                  poster={banner.image}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent flex flex-col items-center justify-end pb-6 text-white">
                  <h2 className="text-xl font-bold drop-shadow">{title}</h2>
                  <p className="text-sm opacity-90 drop-shadow">{subtitle}</p>
                </div>
              </>
            ) : !imgErrors[index] ? (
              <>
                <Image
                  src={banner.image}
                  alt={title}
                  fill
                  className="object-cover object-center"
                  priority={index === 0}
                  fetchPriority={index === 0 ? "high" : "low"}
                  sizes="(max-width: 768px) 92vw, 50vw"
                  quality={70}
                  onError={() => setImgErrors(prev => ({ ...prev, [index]: true }))}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent flex flex-col items-center justify-end pb-6 text-white">
                  <h2 className="text-xl font-bold drop-shadow">{title}</h2>
                  <p className="text-sm opacity-90 drop-shadow">{subtitle}</p>
                </div>
              </>
            ) : (
              <div className={`w-full h-full bg-gradient-to-br ${fallbackColors[index % fallbackColors.length]} flex flex-col items-center justify-center text-white px-6`}>
                <h2 className="text-2xl font-bold mb-1">{title}</h2>
                <p className="text-sm opacity-90">{subtitle}</p>
              </div>
            )}
          </Link>
        );
      })}

      {/* Dots */}
      {banners.length > 1 && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10" role="group" aria-label="Banner slides">
          {banners.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrent(idx)}
              aria-label={`Go to slide ${idx + 1}`}
              aria-current={idx === current ? 'true' : 'false'}
              className={`h-1.5 rounded-full transition-all ${
                idx === current ? 'w-6 bg-white' : 'w-1.5 bg-white/60'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
