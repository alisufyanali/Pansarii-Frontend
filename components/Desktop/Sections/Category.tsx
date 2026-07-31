"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getCategoriesCached } from "@/lib/products";
import type { ApiCategory } from "@/types/product";

const FALLBACK_COLORS = [
  '#FFEBEE', '#F3E5F5', '#E8EAF6',
  '#E3F2FD', '#E8F5E9', '#FFF3E0',
];

// Skeleton card shown while categories are loading
function CategorySkeleton() {
  return (
    <div className="flex flex-col items-center w-full animate-pulse">
      <div className="w-full aspect-[191/201] rounded-t-[40%] bg-gray-200 mb-2" />
      <div className="w-full h-[50px] bg-gray-100 rounded" />
    </div>
  );
}

export default function Category() {
  const router = useRouter();
  const CategoryImage = '/images/category.png';
  const [categories, setCategories] = useState<ApiCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getCategoriesCached()
      .then((cats) => setCategories(cats.slice(0, 6)))
      .catch(() => setCategories([]))
      .finally(() => setIsLoading(false));
  }, []);

  const handleCategoryClick = (slug: string) => {
    router.push(`/category?cat=${slug}`);
  };

  return (
    <div className="py-4 px-[4%]">
      <div className="max-w-[1920px] mx-auto">

        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-3xl 2xl:text-4xl font-semibold">
            Shop By <span className="me-color-y">Category</span>
          </h1>
          <div
            className="flex items-center gap-4 cursor-pointer group"
            onClick={() => router.push('/category')}
          >
            <span className="text-black font-semibold group-hover:text-[#197B33] transition-colors 2xl:text-lg">
              View All
            </span>
            <div className="w-10 h-10 flex items-center justify-center rounded-full bg-[#1A1A1A1A] group-hover:bg-[#197B33] group-hover:text-white transition-all">
              <span className="text-lg font-bold">{'>'}</span>
            </div>
          </div>
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-3 md:grid-cols-6 gap-4 lg:gap-6">
          {isLoading
            ? [...Array(6)].map((_, i) => <CategorySkeleton key={i} />)
            : categories.map((category, index) => {
              const bgColor = FALLBACK_COLORS[index % FALLBACK_COLORS.length];
              // Use the API image if present; no static PNG fallback
              const imageSrc = (category as ApiCategory & { image?: string }).image;

              return (
                <div
                  key={category.id}
                  className="flex flex-col items-center w-full cursor-pointer hover:scale-105 transition-transform"
                  onClick={() => handleCategoryClick(category.slug)}
                >
                  {/* Image area */}
                 
                    {imageSrc ? (
                      <Image
                        src={imageSrc}
                        alt={category.name}
                        width={170}
                        height={120}
                        className="object-contain w-[75%] h-auto drop-shadow-md mt-4"
                        loading="lazy"
                        quality={60}
                      />
                    ) : (
                      /* No image from API — show a coloured placeholder circle */
                      // <div
                      //   className="w-[60%] aspect-square rounded-full mt-4 opacity-30"
                      //   style={{ backgroundColor: '#197B33' }}
                      // />
                      <Image
                        src={CategoryImage + "-" + (index + 1) }
                        alt={"category.name"}
                        width={170}
                        height={120}
                        className="object-contain w-[75%] h-auto drop-shadow-md mt-4"
                        loading="lazy"
                        quality={60}
                      />
                    )}

                  {/* Label */}
                  <div className="w-full h-[50px] bg-white   flex flex-col items-center justify-center rounded">
                    <span className="text-[16px] font-medium leading-tight text-center px-1">
                      {category.name}
                    </span>
                    {category.products_count !== undefined && (
                      <span className="text-[12px] text-gray-500">
                        {category.products_count} items
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
        </div>

      </div>
    </div>
  );
}
