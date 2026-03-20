// app/Mobile/components/categories.tsx
"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { allProducts } from "@/app/Desktop/data/products";

export default function Categories() {
  const router = useRouter();

  // Different background colors for each card
  const bgColors = [
    '#FFEBEE', // Light Red
    '#F3E5F5', // Light Purple
    '#E8EAF6', // Light Indigo
    '#E3F2FD', // Light Blue
    '#E8F5E9', // Light Green
    '#FFF3E0', // Light Orange
  ];

  // Generate categories from products data
  const categories = Array.from(new Set(allProducts.map(p => p.category)))
    .filter(Boolean)
    .slice(0, 6) // Show 6 categories
    .map((category, index) => ({
      id: category.toLowerCase().replace(/\s+/g, '-'),
      name: category,
      bgColor: bgColors[index % bgColors.length],
      image: "/images/category.png",
      count: allProducts.filter(p => p.category === category).length
    }));

  const handleCategoryClick = (categoryId: string) => {
    router.push(`/shop?category=${categoryId}`);
  };

  return (
    <section className="px-4 py-6">
      <div className="mb-4">
        <h2 className="text-xl font-bold mb-1">
          Shop By <span className="text-green-700">Category</span>
        </h2>
        <p className="text-gray-500 text-sm">Browse our product categories</p>
      </div>

      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
        {categories.map((category) => (
          <div 
            key={category.id}
            className="flex-shrink-0 w-28 cursor-pointer active:scale-95 transition-transform"
            onClick={() => handleCategoryClick(category.id)}
          >
            <div className="flex flex-col items-center w-full">
              {/* Top colored section with larger image - half circle top */}
              <div
                className="w-full h-24 flex items-end justify-center relative overflow-hidden"
                style={{
                  borderTopLeftRadius: "50%",
                  borderTopRightRadius: "50%",
                  backgroundColor: category.bgColor,
                }}
              >
                {/* Larger image that extends beyond the container */}
                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                  <Image
                    src={category.image}
                    alt={category.name}
                    width={120}
                    height={120}
                    className="object-contain"
                  />
                </div>
              </div>
              
              {/* Bottom white section with text - flat bottom (no rounded corners) */}
              <div className="w-full bg-white flex flex-col items-center justify-center px-2 py-3 border-x border-b border-gray-200">
                <h3 className="font-semibold text-gray-900 text-xs text-center line-clamp-2 leading-tight">
                  {category.name}
                </h3>
               
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