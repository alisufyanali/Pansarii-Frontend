"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { categories } from "@/app/Desktop/data/categories";

export default function Category() {
  const router = useRouter();
  const CategoryImage = '/images/category.png';

  const bgColors = [
    '#FFEBEE',
    '#F3E5F5',
    '#E8EAF6',
    '#E3F2FD',
    '#E8F5E9',
    '#FFF3E0',
  ];

  // Show first 6 categories (or fewer if not enough)
  const displayCategories = categories.slice(0, 6);

  return (
    <div className="p-4 mx-[4%]">
      <div className="max-w-[1920px] mx-auto">

        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-3xl 2xl:text-4xl font-semibold">
            Shop By <span className="me-color-y">Category</span>
          </h1>

          {/* View All → /category */}
          <div
            className="flex items-center gap-4 cursor-pointer group"
            onClick={() => router.push('/category')}
          >
            <span className="text-black font-semibold group-hover:text-[#197B33] transition-colors 2xl:text-lg">
              View All
            </span>
            <div className="w-10 h-10 flex items-center justify-center rounded-full bg-[#1A1A1A1A] text-dark group-hover:bg-[#197B33] group-hover:text-white transition-all">
              <span className="text-lg font-bold">{'>'}</span>
            </div>
          </div>
        </div>

        {/* Cards */}
        <div className="flex flex-wrap gap-6 justify-center">
          {displayCategories.map((card, index) => (
            <div
              key={index}
              className="flex-1 min-w-[120px] max-w-[200px] flex flex-col items-center w-full cursor-pointer group"
              onClick={() => router.push(`/shop?category=${card.category}`)}
            >
              {/* Image container */}
              <div
                className="w-full aspect-[191/201] mb-2 flex items-center justify-center transition-transform duration-300 group-hover:scale-[1.03]"
                style={{
                  borderTopLeftRadius: "113px",
                  borderTopRightRadius: "113px",
                  backgroundColor: bgColors[index % bgColors.length],
                }}
              >
                <Image
                  src={CategoryImage}
                  alt={card.title}
                  width={170}
                  height={120}
                  className="object-contain mr-7 mt-6"
                  style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))' }}
                />
              </div>

              {/* Label */}
              <div className="w-full h-[50px] bg-white shadow-[0_4px_13.3px_0_rgba(0,0,0,0.24)] flex items-center justify-center rounded text-[16px] font-medium group-hover:text-[#197B33] transition-colors">
                {card.title}
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}