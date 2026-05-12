"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

const banners = [
  { id: 1, image: '/images/Banner.png',  title: 'Premium Ayurvedic', subtitle: 'Natural & Organic', link: '/shop'       },
  { id: 2, image: '/images/Banner2.png', title: 'Summer Sale',       subtitle: 'Up to 50% OFF',    link: '/offers'     },
  { id: 3, image: '/images/Banner3.png', title: 'New Collection',    subtitle: 'Fresh Arrivals',   link: '/newarrival' },
];

const fallbackColors = [
  'from-green-600 to-emerald-500',
  'from-orange-600 to-red-500',
  'from-purple-600 to-pink-500',
];

export default function HeroBanner() {
  const [current,   setCurrent]   = useState(0);
  const [imgErrors, setImgErrors] = useState<Record<number, boolean>>({});

  useEffect(() => {
    const t = setInterval(() => setCurrent(p => (p + 1) % banners.length), 5000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="relative mx-4 mt-4 rounded-2xl overflow-hidden h-48">
      {banners.map((banner, index) => (
        <Link
          key={banner.id}
          href={banner.link}
          className={`absolute inset-0 transition-opacity duration-700 ${
            index === current ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        >
          {!imgErrors[index] ? (
            <>
              <Image
                src={banner.image}
                alt={banner.title}
                fill
                className="object-cover object-center"
                priority={index === 0}
                onError={() => setImgErrors(prev => ({ ...prev, [index]: true }))}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent flex flex-col items-center justify-end pb-6 text-white">
                <h2 className="text-xl font-bold drop-shadow">{banner.title}</h2>
                <p className="text-sm opacity-90 drop-shadow">{banner.subtitle}</p>
              </div>
            </>
          ) : (
            <div className={`w-full h-full bg-gradient-to-br ${fallbackColors[index]} flex flex-col items-center justify-center text-white px-6`}>
              <h2 className="text-2xl font-bold mb-1">{banner.title}</h2>
              <p className="text-sm opacity-90">{banner.subtitle}</p>
            </div>
          )}
        </Link>
      ))}

      {/* Dots */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
        {banners.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrent(idx)}
            className={`h-1.5 rounded-full transition-all ${
              idx === current ? 'w-6 bg-white' : 'w-1.5 bg-white/60'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
