// app/Mobile/components/categories.tsx
"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { allProducts } from "@/app/Desktop/data/products";

export default function SolutionBar() {
  const router = useRouter();

  // Different background colors for each card
  const bgColors = [
    '#FFEBEE', // Red
    '#F3E5F5', // Purple
    '#E8EAF6', // Indigo
    '#E3F2FD', // Blue
    '#E8F5E9', // Green
    '#FFF3E0', // Orange
  ];

  // Generate categories - only show 3 for mobile
  const categories = [
    {
      id: "all",
      name: "All Products",
      bgColor: bgColors[0],
      image: "/images/category.png",
      count: allProducts.length
    },
    ...Array.from(new Set(allProducts.map(p => p.category)))
      .filter(Boolean)
      .map((category, index) => ({
        id: category.toLowerCase().replace(/\s+/g, '-'),
        name: category,
        bgColor: bgColors[(index + 1) % bgColors.length],
        image: "/images/category.png",
        count: allProducts.filter(p => p.category === category).length
      }))
  ].slice(0, 3); // Only take first 3 categories

  const handleCategoryClick = (categoryId: string) => {
    router.push(`/shop?category=${categoryId}`);
  };

  return (
    <section className="px-4 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold mb-2">
          Shop By <span className="text-green-700">Category</span>
        </h1>
        <p className="text-gray-500 text-sm">Browse our product categories</p>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
        {categories.map((category) => (
          <div 
            key={category.id}
            className="flex-shrink-0 w-[calc(33.333%-16px)] min-w-[100px] cursor-pointer"
            onClick={() => handleCategoryClick(category.id)}
          >
            <div className="flex flex-col items-center w-full">
              {/* Top colored section with larger image */}
              <div
                className="w-full aspect-square mb-3 flex items-end justify-center relative"
                style={{
                  borderTopLeftRadius: "40px",
                  borderTopRightRadius: "40px",
                  backgroundColor: category.bgColor,
                }}
              >
                <div className="absolute bottom-0 w-full flex justify-center">
                  <Image
                    src={category.image}
                    alt={category.name}
                    width={140}
                    height={140}
                    className="object-contain"
                    style={{ 
                      filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.15))'
                    }}
                  />
                </div>
              </div>
              
              {/* Bottom white section with text */}
              <div className="w-full bg-white shadow-md flex flex-col items-center justify-center rounded-lg px-2 py-3">
                <h3 className="font-semibold text-gray-900 text-sm text-center line-clamp-1">
                  {category.name}
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                  {category.count} items
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </section>
  );
}