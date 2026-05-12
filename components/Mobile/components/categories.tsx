"use client";

import { useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { allProducts } from "@/components/Desktop/data/products";

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

// Pastel colors matching design reference
const BG_COLORS = [
  '#C8B8E8', // purple
  '#F5D08A', // amber
  '#A8D8A8', // green
  '#A8C8E8', // blue
  '#E8A8A8', // pink
  '#E8E0A0', // yellow
  '#A8E0D8', // teal
  '#D8A8E8', // lavender
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

  // Auto-slide — horizontal only, no page scroll
  useEffect(() => {
    const t = setInterval(() => {
      if (isTouch.current) return;
      const el = sliderRef.current;
      if (!el) return;
      const card = el.querySelector('.cat-card') as HTMLElement;
      const step = card ? card.offsetWidth + 12 : 130;
      const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 2;
      el.scrollTo({ left: atEnd ? 0 : el.scrollLeft + step, behavior: 'smooth' });
    }, 2500);
    return () => clearInterval(t);
  }, []);

  return (
    <section className="py-4">

      {/* Heading */}
      <div className="px-4 mb-4 text-center">
        <h2 className="text-lg font-bold text-gray-900">
          Shop by <span className="me-color-y">Category</span>
        </h2>
      </div>

      {/* Horizontal slider */}
      <div
        ref={sliderRef}
        className="flex gap-3 overflow-x-auto no-scrollbar px-4"
        onTouchStart={() => { isTouch.current = true; }}
        onTouchEnd={() => { setTimeout(() => { isTouch.current = false; }, 2000); }}
      >
        {categories.map(cat => (
          <button
            key={cat.name}
            className="cat-card flex-shrink-0 active:scale-95 transition-transform focus:outline-none"
            style={{ width: 'calc((100vw - 44px) / 3)' }}
            onClick={() => router.push(`/${cat.slug}`)}
          >
            {/*
              Arch card layout:
              - Top half: arch shape (large border-radius on top corners)
              - Category name: bold uppercase, top area
              - Product image: bottom, overflows the card
            */}
            <div className="relative flex flex-col items-center">

              {/* Arch shape — tall rectangle with very rounded top */}
              <div
                className="relative w-full overflow-visible"
                style={{
                  backgroundColor: cat.bgColor,
                  borderRadius: '999px 999px 16px 16px',
                  paddingTop: '16px',
                  paddingBottom: '40px',
                  minHeight: '140px',
                }}
              >
                {/* Category name — top center, bold uppercase */}
                <div className="px-2 text-center">
                  <p
                    className="font-black uppercase leading-tight tracking-wide"
                    style={{ fontSize: '11px', color: '#1a1a1a' }}
                  >
                    {cat.name.split(' ').map((word, i) => (
                      <span key={i} className="block">{word}</span>
                    ))}
                  </p>
                </div>
              </div>

              {/* Product image — overlaps bottom of arch */}
              <div
                className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[85%]"
                style={{ zIndex: 10 }}
              >
                <img
                  src={cat.img}
                  alt={cat.name}
                  className="w-full h-auto object-contain drop-shadow-lg"
                  style={{ maxHeight: '90px' }}
                />
              </div>

            </div>
          </button>
        ))}
      </div>

    </section>
  );
}
