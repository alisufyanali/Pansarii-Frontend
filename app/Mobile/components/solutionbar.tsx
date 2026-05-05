"use client";

import { useRef, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
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

const CATEGORY_COLORS: Record<string, { bg: string; border: string; activeBorder: string }> = {
  'Herb':          { bg: 'bg-green-50',  border: 'border-green-100',  activeBorder: 'border-green-500'  },
  'Oils':          { bg: 'bg-yellow-50', border: 'border-yellow-100', activeBorder: 'border-yellow-500' },
  'Supplements':   { bg: 'bg-blue-50',   border: 'border-blue-100',   activeBorder: 'border-blue-500'   },
  'Beauty Corner': { bg: 'bg-pink-50',   border: 'border-pink-100',   activeBorder: 'border-pink-500'   },
  'Dawakhana':     { bg: 'bg-purple-50', border: 'border-purple-100', activeBorder: 'border-purple-500' },
  'Remedies':      { bg: 'bg-lime-50',   border: 'border-lime-100',   activeBorder: 'border-lime-500'   },
  'Murrabajat':    { bg: 'bg-orange-50', border: 'border-orange-100', activeBorder: 'border-orange-500' },
  'Arqiyaat':      { bg: 'bg-cyan-50',   border: 'border-cyan-100',   activeBorder: 'border-cyan-500'   },
};

const CATEGORY_ICONS: Record<string, string> = {
  'Herb':          '🌿',
  'Oils':          '🛢️',
  'Supplements':   '💊',
  'Beauty Corner': '💄',
  'Dawakhana':     '🏥',
  'Remedies':      '💚',
  'Murrabajat':    '🍯',
  'Arqiyaat':      '💧',
};

export default function SolutionBar() {
  const router    = useRouter();
  const sliderRef = useRef<HTMLDivElement>(null);
  const [active,  setActive] = useState(0);

  const categories = Array.from(new Set(allProducts.map(p => p.category)))
    .filter(Boolean)
    .map((category) => ({
      name:  category,
      slug:  CATEGORY_SLUG_MAP[category] || category.toLowerCase().replace(/\s+/g, '-'),
      icon:  CATEGORY_ICONS[category]    || '📦',
      color: CATEGORY_COLORS[category]   || { bg: 'bg-gray-50', border: 'border-gray-100', activeBorder: 'border-gray-400' },
      img:   '/images/Skincare.png',
    }));

  // Auto-slide every 3s — only horizontal, never scrolls the page
  useEffect(() => {
    const t = setInterval(() => {
      setActive(prev => {
        const next = (prev + 1) % categories.length;
        const el = sliderRef.current;
        if (el) {
          const card = el.children[next] as HTMLElement;
          if (card) {
            // Only scroll the slider horizontally
            el.scrollLeft = card.offsetLeft - el.offsetLeft;
          }
        }
        return next;
      });
    }, 3000);
    return () => clearInterval(t);
  }, [categories.length]);

  return (
    <section className="px-4 py-4">

      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-base font-bold text-gray-900  ">
          Find Your <span className="text-gray-900">Solutions</span>
        </h2>
      </div>

      {/* Slider — 3 visible, 4th peeking */}
      <div
        ref={sliderRef}
        className="flex gap-3 overflow-x-auto no-scrollbar pb-1"
      >
        {categories.map((cat, i) => (
          <button
            key={cat.name}
            onClick={() => { setActive(i); router.push(`/${cat.slug}`); }}
            className={`
              flex-shrink-0 flex flex-col items-center rounded-2xl border-2 p-3 transition-all active:scale-95
              ${cat.color.bg}
              ${i === active ? cat.color.activeBorder : cat.color.border}
            `}
            style={{ width: 'calc((100vw - 32px - 24px) / 3.4)' }}
          >
            {/* Circle image */}
            <div className={`w-16 h-16 rounded-full overflow-hidden border-2 mb-2 ${i === active ? cat.color.activeBorder : 'border-white'}`}>
              <img
                src={cat.img}
                alt={cat.name}
                className="w-full h-full object-cover"
              />
            </div>
            <span className="text-xs font-semibold text-gray-800 text-center leading-tight line-clamp-2">
              {cat.name}
            </span>
          </button>
        ))}
      </div>

    </section>
  );
}
