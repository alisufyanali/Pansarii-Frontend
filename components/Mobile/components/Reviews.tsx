"use client";

import Image from 'next/image';
import { useRef, useEffect, useState } from 'react';
import { FaStar, FaTimes } from 'react-icons/fa';
import {
  getHomepageReviews,
  mapHomepageReviewToCard,
  DEFAULT_REVIEWS,
  type ReviewCardData,
} from '@/lib/reviews';

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
      <button
        className="absolute top-4 right-4 text-white p-2"
        onClick={onClose}
      >
        <FaTimes className="w-5 h-5" />
      </button>

      <div className="relative w-full max-w-sm aspect-[4/3] max-h-[60vh] px-4 mx-auto" onClick={e => e.stopPropagation()}>
        <Image
          src={images[current]}
          alt="Review"
          fill
          className="rounded-xl object-contain"
          sizes="100vw"
        />
      </div>

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

      <p className="text-white/60 text-xs mt-3">{current + 1} / {images.length}</p>
    </div>
  );
}

function ReviewsSkeleton() {
  return (
    <section className="py-4 bg-cream">
      <div className="px-4 mb-4 h-5 w-48 bg-gray-200 rounded animate-pulse mx-auto" />
      <div className="flex gap-4 px-4 overflow-hidden">
        {[...Array(2)].map((_, i) => (
          <div key={i} className="flex-shrink-0 bg-gray-200 rounded-2xl animate-pulse" style={{ width: 'calc((100vw - 56px) / 2)', height: '180px' }} />
        ))}
      </div>
    </section>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function MobileReviews() {
  const sliderRef = useRef<HTMLDivElement>(null);
  const isTouch   = useRef(false);
  const [reviews, setReviews] = useState<ReviewCardData[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [active,   setActive]   = useState(0);
  const [lightbox, setLightbox] = useState<{ images: string[]; index: number } | null>(null);

  useEffect(() => {
    getHomepageReviews()
      .then(data => {
        const mapped = (data ?? []).map(mapHomepageReviewToCard);
        setReviews(mapped.length > 0 ? mapped : null);
      })
      .catch(() => setReviews(null))
      .finally(() => setLoading(false));
  }, []);

  const displayReviews = reviews ?? DEFAULT_REVIEWS;

  useEffect(() => {
    const t = setInterval(() => {
      if (isTouch.current) return;
      const el = sliderRef.current;
      if (!el) return;
      const card = el.querySelector('.rev-card') as HTMLElement;
      const step = card ? card.offsetWidth + 16 : 300;
      const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 2;
      el.scrollTo({ left: atEnd ? 0 : el.scrollLeft + step, behavior: 'smooth' });
      setActive(p => atEnd ? 0 : (p + 1) % displayReviews.length);
    }, 4000);
    return () => clearInterval(t);
  }, [displayReviews.length]);

  if (loading) return <ReviewsSkeleton />;

  return (
    <>
      <section className="py-4 bg-cream">

        <div className="px-4 mb-4 text-center">
          <h2 className="text-base font-bold text-gray-900">
            Loved By Over <span className="me-color-y">+70,000</span> Smiles!
          </h2>
        </div>

        <div
          ref={sliderRef}
          className="flex gap-4 overflow-x-auto no-scrollbar px-4"
          onTouchStart={() => { isTouch.current = true; }}
          onTouchEnd={() => { setTimeout(() => { isTouch.current = false; }, 2000); }}
        >
          {displayReviews.map((review, i) => {
            const imgs: string[] = review.images ?? [review.img];

            return (
              <div
                key={review.id ?? i}
                className="rev-card flex-shrink-0 bg-white rounded-2xl p-4 shadow-sm"
                style={{ width: 'calc((100vw - 56px) / 2)' }}
              >
                <div className="flex items-center gap-0.5 mb-2">
                  {[...Array(5)].map((_, j) => (
                    <FaStar key={j} className={`w-3 h-3 ${j < Math.round(review.rating ?? 5) ? 'text-yellow-400' : 'text-gray-200'}`} />
                  ))}
                </div>

                <h3 className="text-xs font-bold text-gray-900 mb-1.5 line-clamp-2 leading-snug">
                  {review.title}
                </h3>

                <p className="text-[11px] text-gray-500 leading-relaxed line-clamp-3 mb-3">
                  {review.text}
                </p>

                {review.productName && review.productImage && (
                  <div className="flex items-center gap-2 mb-3 p-2 bg-green-50 rounded-lg">
                    <div className="relative w-8 h-8 rounded-md overflow-hidden flex-shrink-0">
                      <Image src={review.productImage} alt={review.productName} fill className="object-cover" sizes="32px" />
                    </div>
                    <p className="text-[10px] font-medium text-green-800 line-clamp-2">{review.productName}</p>
                  </div>
                )}

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

        <div className="flex items-center justify-center gap-1.5 mt-4">
          {displayReviews.slice(0, 6).map((_, i) => (
            <div
              key={i}
              className={`rounded-full transition-all ${
                i === active % Math.min(displayReviews.length, 6) ? 'w-5 h-1.5 bg-amber-400' : 'w-1.5 h-1.5 bg-gray-300'
              }`}
            />
          ))}
        </div>

      </section>

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
