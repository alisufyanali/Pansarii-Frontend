"use client";

import { useRef, useEffect, useState } from 'react';
import { FaStar } from 'react-icons/fa';
import { reviews } from '@/app/Desktop/data/reviews';

export default function MobileReviews() {
  const sliderRef  = useRef<HTMLDivElement>(null);
  const isTouch    = useRef(false);
  const [active, setActive] = useState(0);

  // Auto-slide every 4s
  useEffect(() => {
    const t = setInterval(() => {
      if (isTouch.current) return;
      const el = sliderRef.current;
      if (!el) return;
      const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 2;
      if (atEnd) { el.scrollLeft = 0; setActive(0); }
      else {
        const card = el.querySelector('.rev-card') as HTMLElement;
        const step = card ? card.offsetWidth + 16 : 300;
        el.scrollLeft += step;
        setActive(p => (p + 1) % reviews.length);
      }
    }, 4000);
    return () => clearInterval(t);
  }, []);

  return (
    <section className="py-4 bg-[#fdf6f0]">
      {/* Header */}
      <div className="px-4 mb-4 text-center">
        <h2 className="text-base font-bold text-gray-900">
          Loved By Over <span className="text-[#FAA944]">+70,000</span> Smiles!
        </h2>
      </div>

      {/* Slider — 1 card full width */}
      <div
        ref={sliderRef}
        className="flex gap-4 overflow-x-auto no-scrollbar px-4"
        onTouchStart={() => { isTouch.current = true; }}
        onTouchEnd={() => { setTimeout(() => { isTouch.current = false; }, 2000); }}
      >
        {reviews.map((review, i) => (
          <div
            key={review.id}
            className="rev-card flex-shrink-0 bg-white rounded-2xl p-4 shadow-sm"
            style={{ width: 'calc(100vw - 48px)' }}
          >
            {/* Title */}
            <h3 className="text-sm font-bold text-gray-900 mb-2 line-clamp-2">
              {review.title}
            </h3>

            {/* Text */}
            <p className="text-xs text-gray-600 leading-relaxed line-clamp-4 mb-4">
              {review.text}
            </p>

            {/* Reviewer */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full border-2 border-green-600 overflow-hidden flex-shrink-0">
                <img src={review.img} alt={review.name} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-gray-900 truncate">{review.name}</p>
                <p className="text-[11px] text-gray-400 truncate">{review.designation}</p>
                {/* Stars */}
                <div className="flex items-center gap-0.5 mt-0.5">
                  {[...Array(5)].map((_, j) => (
                    <FaStar
                      key={j}
                      className={`w-3 h-3 ${j < Math.round(review.rating ?? 5) ? 'text-yellow-400' : 'text-gray-200'}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Dot indicators */}
      <div className="flex items-center justify-center gap-1.5 mt-4">
        {reviews.slice(0, 6).map((_, i) => (
          <div
            key={i}
            className={`rounded-full transition-all ${
              i === active % 6
                ? 'w-5 h-1.5 bg-amber-400'
                : 'w-1.5 h-1.5 bg-gray-300'
            }`}
          />
        ))}
      </div>
    </section>
  );
}
