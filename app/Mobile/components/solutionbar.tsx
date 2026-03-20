// app/Mobile/components/solutionbar.tsx
"use client";

import { useRouter } from "next/navigation";
import { allProducts } from "@/app/Desktop/data/products";

export default function SolutionBar() {
  const router = useRouter();

  // Generate categories from products data
  const categories = Array.from(new Set(allProducts.map(p => p.category)))
    .filter(Boolean)
    .slice(0, 3) // Take first 3 categories
    .map((category, index) => ({
      id: category.toLowerCase().replace(/\s+/g, '-'),
      name: category,
      count: allProducts.filter(p => p.category === category).length,
      icon: getCategoryIcon(category),
      color: getCategoryColor(index)
    }));

  const handleCategoryClick = (categoryId: string) => {
    router.push(`/shop?category=${categoryId}`);
  };

  return (
    <section className="px-4 py-6">
      <div className="grid grid-cols-3 gap-3">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => handleCategoryClick(category.id)}
            className="group relative overflow-hidden rounded-2xl bg-white border-2 border-gray-200 hover:border-green-500 transition-all duration-300 hover:shadow-lg active:scale-95"
          >
            {/* Square Container */}
            <div className="aspect-square flex flex-col items-center justify-center p-4">
              {/* Icon/Emoji */}
              <div className={`w-16 h-16 rounded-full ${category.color} flex items-center justify-center text-3xl mb-3 group-hover:scale-110 transition-transform duration-300`}>
                {category.icon}
              </div>
              
              {/* Category Name */}
              <h3 className="font-semibold text-gray-900 text-xs text-center line-clamp-2 mb-1">
                {category.name}
              </h3>
              
              {/* Item Count */}
              <p className="text-[10px] text-gray-500">
                {category.count} items
              </p>
            </div>

            {/* Hover Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-green-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </button>
        ))}
      </div>
    </section>
  );
}

// Helper function to get category icon
function getCategoryIcon(category: string): string {
  const icons: { [key: string]: string } = {
    "Oils & Ghee": "🛢️",
    "Herbs & Spices": "🌿",
    "Honey & Sweeteners": "🍯",
    "Beauty & Skincare": "💄",
    "Tea & Beverages": "🍵",
    "Supplements": "💊",
    "Nuts & Seeds": "🥜",
    "Grains & Cereals": "🌾",
  };
  
  return icons[category] || "📦";
}

// Helper function to get category color
function getCategoryColor(index: number): string {
  const colors = [
    "bg-amber-100",
    "bg-emerald-100",
    "bg-rose-100",
    "bg-blue-100",
    "bg-purple-100",
    "bg-orange-100",
  ];
  
  return colors[index % colors.length];
}