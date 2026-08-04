"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getCategoriesCached } from "@/lib/products";
import type { ApiCategory } from "@/types/product";

// ─── Skeleton ─────────────────────────────────────────────────────────────────
// Matches desktop CategorySkeleton exactly

function CategorySkeleton() {
  return (
    <div className="flex flex-col items-center w-full animate-pulse">
      <div className="w-[75%] h-[80px] bg-gray-200 rounded mt-4" />
      <div className="w-full h-[50px] bg-gray-100 rounded mt-2" />
    </div>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function Categories() {
  const router = useRouter();
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
    <section className="py-4 px-[4%]">
      {/* Header — matches desktop exactly */}
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-semibold">
          Shop By <span className="me-color-y">Category</span>
        </h2>
        <div
          className="flex items-center gap-3 cursor-pointer group"
          onClick={() => router.push("/category")}
        >
          <span className="text-black font-semibold group-hover:text-[#197B33] transition-colors text-sm">
            View All
          </span>
          <div className="w-9 h-9 flex items-center justify-center rounded-full bg-[#1A1A1A1A] group-hover:bg-[#197B33] group-hover:text-white transition-all">
            <span className="text-base font-bold">{">"}</span>
          </div>
        </div>
      </div>

      {/* Cards grid — 3 cols mobile, 6 cols md+ (matches desktop) */}
      <div className="grid grid-cols-3 md:grid-cols-6 gap-3 lg:gap-6">
        {isLoading
          ? [...Array(6)].map((_, i) => <CategorySkeleton key={i} />)
          : categories.map((category, index) => {
              const imageSrc = (
                category as ApiCategory & { image?: string }
              ).image;

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
                      width={120}
                      height={80}
                      className="object-contain w-[75%] h-auto drop-shadow-md mt-4"
                      loading="lazy"
                      quality={60}
                    />
                  ) : (
                    <Image
                      src={`/images/category-${index + 1}.png`}
                      alt={category.name}
                      width={120}
                      height={80}
                      className="object-contain w-[75%] h-auto drop-shadow-md mt-4"
                      loading="lazy"
                      quality={60}
                    />
                  )}

                  {/* Label — matches desktop */}
                  <div className="w-full h-[50px] bg-white flex flex-col items-center justify-center rounded">
                    <span className="text-[13px] font-medium leading-tight text-center px-1">
                      {category.name}
                    </span>
                    {category.products_count !== undefined && (
                      <span className="text-[11px] text-gray-500">
                        {category.products_count} items
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
      </div>
    </section>
  );
}
