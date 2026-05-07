"use client";

import { useRef, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FiChevronRight } from "react-icons/fi";
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

const CATEGORY_COLORS: Record<string, { bg: string; activeBg: string }> = {
  'Herb':          { bg: 'bg-green-50',  activeBg: 'bg-green-100'  },
  'Oils':          { bg: 'bg-yellow-50', activeBg: 'bg-yellow-100' },
  'Supplements':   { bg: 'bg-blue-50',   activeBg: 'bg-blue-100'   },
  'Beauty Corner': { bg: 'bg-pink-50',   activeBg: 'bg-pink-100'   },
  'Dawakhana':     { bg: 'bg-purple-50', activeBg: 'bg-purple-100' },
  'Remedies':      { bg: 'bg-lime-50',   activeBg: 'bg-lime-100'   },
  'Murrabajat':    { bg: 'bg-orange-50', activeBg: 'bg-orange-100' },
  'Arqiyaat':      { bg: 'bg-cyan-50',   activeBg: 'bg-cyan-100'   },
};

export default function SolutionBar() {
  const router    = useRouter();
  const sliderRef = useRef<HTMLDivElement>(null);
  const [active,  setActive] = useState(0);

  const categories = Array.from(new Set(allProducts.map(p => p.category)))
    .filter(Boolean)
    .map(category => ({
      name:  category,
      slug:  CATEGORY_SLUG_MAP[category] || category.toLowerCase().replace(/\s+/g, '-'),
      color: CATEGORY_COLORS[category]   || { bg: 'bg-gray-50', activeBg: 'bg-gray-100' },
      img:   '/images/Skincare.png',
    }));

  // Auto-slide — smooth scroll
  useEffect(() => {
    const t = setInterval(() => {
      setActive(prev => {
        const next = (prev + 1) % categories.length;
        const el = sliderRef.current;
        if (el) {
          const card = el.children[next] as HTMLElement;
          if (card) {
            el.scrollTo({ left: card.offsetLeft - 16, behavior: 'smooth' });
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
        <h2 className="text-base font-bold text-gray-900">
          Find Your <span className="me-color-y">Solutions</span>
        </h2>
        <Link href="/category" className="flex items-center gap-0.5 text-sm text-gray-500 font-medium">
          View all <FiChevronRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Slider */}
      <div
        ref={sliderRef}
        className="flex gap-3 overflow-x-auto no-scrollbar pb-1"
      >
        {categories.map((cat, i) => (
          <button
            key={cat.name}
            onClick={() => { setActive(i); router.push(`/${cat.slug}`); }}
            className={`
              flex-shrink-0 flex flex-col items-center rounded-2xl p-3
              transition-all duration-300 active:scale-95
              ${i === active ? cat.color.activeBg : cat.color.bg}
            `}
            style={{ width: 'calc((100vw - 32px - 24px) / 3.4)' }}
          >
            {/* Circle image — no border, shadow instead */}
            <div className="w-14 h-14 rounded-full overflow-hidden mb-2 shadow-sm">
              <img
                src={cat.img}
                alt={cat.name}
                className="w-full h-full object-cover"
              />
            </div>
            <span className="text-[11px] font-semibold text-gray-800 text-center leading-tight line-clamp-2">
              {cat.name}
            </span>
          </button>
        ))}
      </div>

    </section>
  );
}
