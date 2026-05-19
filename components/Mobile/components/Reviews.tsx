"use client";

import Image from 'next/image';
import { useRef, useEffect, useState } from 'react';
import { FaStar, FaTimes } from 'react-icons/fa';
import { reviews } from '@/data/reviews';

// ── Image lightbox ────────────────────────────────────────────────────────────
function Lightbox({ images, startIndex, onClose }: {
  images: string[];
  startIndex: number;
  onClose: () => void;
}) {
  const [current, setCurrent] = useState(startIndex);

  return (
    <div
      className="fixed inset-0 z-[100] bg-black/90 flex flex-col items-center justify-center"
      onClick={onClose}
    >
      {/* Close */}
      <button
        className="absolute top-4 right-4 text-white p-2"
        onClick={onClose}
      >
        <FaTimes className="w-5 h-5" />
      </button>

      {/* Main image */}
      <div className="relative w-full max-w-sm aspect-[4/3] max-h-[60vh] px-4 mx-auto" onClick={e => e.stopPropagation()}>
        <Image
          src={images[current]}
          alt="Review"
          fill
          className="rounded-xl object-contain"
          sizes="100vw"
        />
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-2 mt-4 px-4" onClick={e => e.stopPropagation()}>
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`relative w-14 h-14 rounded-lg overflow-hidden border-2 transition-all ${
                i === current ? 'border-amber-400' : 'border-white/30'
              }`}
            >
              <Image src={img} alt="" fill className="object-cover" sizes="56px" />
            </button>
          ))}
        </div>
      )}

      {/* Counter */}
      <p className="text-white/60 text-xs mt-3">{current + 1} / {images.length}</p>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function MobileReviews() {
  const sliderRef = useRef<HTMLDivElement>(null);
  const isTouch   = useRef(false);
  const [active,   setActive]   = useState(0);
  const [lightbox, setLightbox] = useState<{ images: string[]; index: number } | null>(null);

  // Auto-slide every 4s
  useEffect(() => {
    const t = setInterval(() => {
      if (isTouch.current) return;
      const el = sliderRef.current;
      if (!el) return;
      const card = el.querySelector('.rev-card') as HTMLElement;
      const step = card ? card.offsetWidth + 16 : 300;
      const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 2;
      el.scrollTo({ left: atEnd ? 0 : el.scrollLeft + step, behavior: 'smooth' });
      setActive(p => atEnd ? 0 : (p + 1) % reviews.length);
    }, 4000);
    return () => clearInterval(t);
  }, []);

  return (
    <>
      <section className="py-4 bg-cream">

        {/* Header */}
        <div className="px-4 mb-4 text-center">
          <h2 className="text-base font-bold text-gray-900">
            Loved By Over <span className="me-color-y">+70,000</span> Smiles!
          </h2>
        </div>

        {/* Slider */}
        <div
          ref={sliderRef}
          className="flex gap-4 overflow-x-auto no-scrollbar px-4"
          onTouchStart={() => { isTouch.current = true; }}
          onTouchEnd={() => { setTimeout(() => { isTouch.current = false; }, 2000); }}
        >
          {reviews.map((review, i) => {
            const imgs: string[] = (review as any).images ?? [review.img];

            return (
              <div
                key={review.id}
                className="rev-card flex-shrink-0 bg-white rounded-2xl p-4 shadow-sm"
                style={{ width: 'calc((100vw - 56px) / 2)' }}
              >
                {/* Stars */}
                <div className="flex items-center gap-0.5 mb-2">
                  {[...Array(5)].map((_, j) => (
                    <FaStar key={j} className={`w-3 h-3 ${j < Math.round(review.rating ?? 5) ? 'text-yellow-400' : 'text-gray-200'}`} />
                  ))}
                </div>

                {/* Title */}
                <h3 className="text-xs font-bold text-gray-900 mb-1.5 line-clamp-2 leading-snug">
                  {review.title}
                </h3>

                {/* Text */}
                <p className="text-[11px] text-gray-500 leading-relaxed line-clamp-3 mb-3">
                  {review.text}
                </p>

                {/* Review images — clickable */}
                {imgs.length > 0 && (
                  <div className="flex gap-1.5 mb-3">
                    {imgs.slice(0, 3).map((img, idx) => (
                      <button
                        key={idx}
                        onClick={() => setLightbox({ images: imgs, index: idx })}
                        className="relative w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 border border-gray-100"
                      >
                        <Image src={img} alt="Review" fill className="object-cover" sizes="40px" />
                      </button>
                    ))}
                    {imgs.length > 3 && (
                      <button
                        onClick={() => setLightbox({ images: imgs, index: 3 })}
                        className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-500 flex-shrink-0"
                      >
                        +{imgs.length - 3}
                      </button>
                    )}
                  </div>
                )}

                {/* Reviewer */}
                <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
                  <div className="relative w-8 h-8 rounded-full overflow-hidden flex-shrink-0 border-2 border-green-600">
                    <Image src={review.img} alt={review.name} fill className="object-cover" sizes="32px" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[11px] font-semibold text-gray-900 truncate">{review.name}</p>
                    <p className="text-[10px] text-gray-400 truncate">{review.designation}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Dots */}
        <div className="flex items-center justify-center gap-1.5 mt-4">
          {reviews.slice(0, 6).map((_, i) => (
            <div
              key={i}
              className={`rounded-full transition-all ${
                i === active % 6 ? 'w-5 h-1.5 bg-amber-400' : 'w-1.5 h-1.5 bg-gray-300'
              }`}
            />
          ))}
        </div>

      </section>

      {/* Lightbox */}
      {lightbox && (
        <Lightbox
          images={lightbox.images}
          startIndex={lightbox.index}
          onClose={() => setLightbox(null)}
        />
      )}
    </>
  );
}
