"use client";

import { useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { allProducts } from "@/app/Desktop/data/products";

const CATEGORY_SLUG_MAP: Record<string, string> = {
  'Herb':          'herbs',
  'Oils':          'oils',
  'Supplements':   'supplements',
  'Beauty Corner': 'beauty-corner',
  'Dawakhana':     'dawakhana',
  'Remedies':      'remedies',
  'Murrabajat':    'murrabajat',
  'Arqiyaat':      'arqiyaat',
};

const BG_COLORS = [
  '#E8D5F5', // purple
  '#FFE8C8', // amber
  '#D5EDD5', // green
  '#D5E8F5', // blue
  '#F5D5D5', // pink
  '#F5F0D5', // yellow
  '#D5F5F0', // teal
  '#F5D5F0', // lavender
];

export default function Categories() {
  const router    = useRouter();
  const sliderRef = useRef<HTMLDivElement>(null);
  const isTouch   = useRef(false);

  const categories = Array.from(new Set(allProducts.map(p => p.category)))
    .filter(Boolean)
    .map((category, i) => ({
      name:    category,
      slug:    CATEGORY_SLUG_MAP[category] || category.toLowerCase().replace(/\s+/g, '-'),
      bgColor: BG_COLORS[i % BG_COLORS.length],
      img:     '/images/category.png',
    }));

  // Auto-slide every 2.5s — only scrolls the slider horizontally, never the page
  useEffect(() => {
    const t = setInterval(() => {
      if (isTouch.current) return;
      const el = sliderRef.current;
      if (!el) return;
      const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 2;
      if (atEnd) {
        // Jump back to start without affecting page scroll
        el.scrollLeft = 0;
      } else {
        const card = el.querySelector('.cat-card') as HTMLElement;
        const step = card ? card.offsetWidth + 12 : 130;
        el.scrollLeft += step;
      }
    }, 2500);
    return () => clearInterval(t);
  }, []);

  return (
    <section className="py-4">

      {/* Header */}
      <div className="px-4 mb-3 text-center">
        <h2 className="text-base font-bold text-gray-900">
          Shop by <span className="text-[#FAA944]">Category</span>
        </h2>
      </div>

      {/* Slider — 3 cards visible, no nav buttons */}
      <div
        ref={sliderRef}
        className="flex gap-3 overflow-x-auto no-scrollbar pl-4 pr-4"
        onTouchStart={() => { isTouch.current = true; }}
        onTouchEnd={() => { setTimeout(() => { isTouch.current = false; }, 2000); }}
      >
        {categories.map((cat, i) => (
          <button
            key={cat.name}
            className="cat-card flex-shrink-0 cursor-pointer active:scale-95 transition-transform"
            style={{ width: 'calc((100vw - 56px) / 3)' }}
            onClick={() => router.push(`/${cat.slug}`)}
          >
            {/* Arch card */}
            <div
              className="w-full relative overflow-hidden flex flex-col items-start justify-start pt-3 px-2"
              style={{
                backgroundColor: cat.bgColor,
                borderRadius: '50% 50% 12px 12px / 40% 40% 12px 12px',
                aspectRatio: '3/4',
              }}
            >
              {/* Category name — top left */}
              <p className="text-[10px] font-bold text-gray-800 uppercase
               leading-tight text-center z-10 px-5 mt-5">
                {cat.name}
              </p>

              {/* Product image — bottom center, overflowing slightly */}
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[85%]">
                <img
                  src={cat.img}
                  alt={cat.name}
                  className="w-full h-auto object-contain"
                />
              </div>
            </div>
          </button>
        ))}
      </div>

    </section>
  );
}
