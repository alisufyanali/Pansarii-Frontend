// app/Mobile/components/solutionbar.tsx
"use client";

import { useRouter } from "next/navigation";
import { allProducts } from "@/app/Desktop/data/products";

// Category slug mapping
const CATEGORY_SLUG_MAP: { [key: string]: string } = {
  'Herb': 'herbs',
  'Oils': 'oils',
  'Supplements': 'supplements',
  'Beauty Corner': 'beauty-corner',
  'Dawakhana': 'dawakhana',
  'Remedies': 'remedies',
  'Murrabajat': 'murrabajat',
  'Arqiyaat': 'arqiyaat',
};

export default function SolutionBar() {
  const router = useRouter();

  // Generate categories from products data
  const categories = Array.from(new Set(allProducts.map(p => p.category)))
    .filter(Boolean)
    .slice(0, 3) // Take first 3 categories
    .map((category, index) => ({
      id: category.toLowerCase().replace(/\s+/g, '-'),
      name: category,
      slug: CATEGORY_SLUG_MAP[category] || category.toLowerCase().replace(/\s+/g, '-'),
      count: allProducts.filter(p => p.category === category).length,
      icon: getCategoryIcon(category),
      color: getCategoryColor(index)
    }));

  const handleCategoryClick = (slug: string) => {
    router.push(`/${slug}`);
  };

  return (
    <section className="px-4 py-4">
      <div className="grid grid-cols-3 gap-2.5">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => handleCategoryClick(category.slug)}
            className="group relative overflow-hidden rounded-xl bg-white border border-gray-200 hover:border-green-500 transition-all duration-300 hover:shadow-md active:scale-95"
          >
            {/* Square Container */}
            <div className="aspect-square flex flex-col items-center justify-center p-3">
              {/* Icon/Emoji */}
              <div className={`w-12 h-12 rounded-full ${category.color} flex items-center justify-center text-2xl mb-2 group-hover:scale-110 transition-transform duration-300`}>
                {category.icon}
              </div>
              
              {/* Category Name */}
              <h3 className="font-semibold text-gray-900 text-[11px] text-center line-clamp-2 leading-tight mb-0.5">
                {category.name}
              </h3>
              
              {/* Item Count */}
              <p className="text-[9px] text-gray-500">
                {category.count} items
              </p>
            </div>

            {/* Hover Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-green-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </button>
        ))}
      </div>
    </section>
  );
}

// Helper function to get category icon
function getCategoryIcon(category: string): string {
  const icons: { [key: string]: string } = {
    "Herb": "🌿",
    "Oils": "🛢️",
    "Supplements": "💊",
    "Beauty Corner": "💄",
    "Dawakhana": "🏥",
    "Remedies": "💚",
    "Murrabajat": "🍯",
    "Arqiyaat": "💧",
    "Oils & Ghee": "🛢️",
    "Herbs & Spices": "🌿",
    "Honey & Sweeteners": "🍯",
    "Beauty & Skincare": "💄",
    "Tea & Beverages": "🍵",
    "Nuts & Seeds": "🥜",
    "Grains & Cereals": "🌾",
  };
  
  return icons[category] || "📦";
}

// Helper function to get category color
function getCategoryColor(index: number): string {
  const colors = [
    "bg-green-50",
    "bg-emerald-50",
    "bg-teal-50",
    "bg-lime-50",
    "bg-green-100",
    "bg-emerald-100",
  ];
  
  return colors[index % colors.length];
}