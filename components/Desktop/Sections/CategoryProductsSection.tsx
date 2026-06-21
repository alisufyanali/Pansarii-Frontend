"use client";

import { Suspense, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { getHomepageCategoryProducts } from "@/lib/products";
import type { HomepageCategorySection } from "@/lib/products";

const CategoryProductRow = dynamic(() => import("./CategoryProductRow"), {
  ssr: false,
  loading: () => <CategoryRowSkeleton variant="desktop" />,
});

interface CategoryProductsSectionProps {
  variant?: "desktop" | "mobile";
}

function CategoryRowSkeleton({ variant }: { variant: "desktop" | "mobile" }) {
  if (variant === "mobile") {
    return (
      <section className="py-4">
        <div className="px-4 mb-3 flex items-center justify-between">
          <div className="h-5 w-32 bg-gray-200 rounded animate-pulse" />
          <div className="h-4 w-16 bg-gray-200 rounded animate-pulse" />
        </div>
        <div className="flex gap-3 pl-4 pr-8 overflow-hidden">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="flex-shrink-0 bg-gray-100 rounded-2xl animate-pulse"
              style={{ width: "65vw", maxWidth: "280px", height: "220px" }}
            />
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="mx-[4%] my-8">
      <div className="max-w-[1920px] mx-auto">
        <div className="mb-5 flex items-center justify-between">
          <div className="h-8 w-48 bg-gray-200 rounded animate-pulse" />
          <div className="h-9 w-32 bg-gray-200 rounded animate-pulse" />
        </div>
        <div className="flex gap-6 overflow-hidden pb-4">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="flex-shrink-0 rounded-2xl border border-gray-200 animate-pulse bg-white"
              style={{ width: "calc((100% - 96px) / 5)" }}
            >
              <div className="h-44 bg-gray-200 rounded-t-2xl" />
              <div className="p-3 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto" />
                <div className="h-3 bg-gray-200 rounded w-1/2 mx-auto" />
                <div className="h-10 bg-gray-200 rounded-full mt-2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function SectionLoadingFallback({ variant }: { variant: "desktop" | "mobile" }) {
  return (
    <>
      <CategoryRowSkeleton variant={variant} />
      <CategoryRowSkeleton variant={variant} />
    </>
  );
}

export default function CategoryProductsSection({
  variant = "desktop",
}: CategoryProductsSectionProps) {
  const [sections, setSections] = useState<HomepageCategorySection[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getHomepageCategoryProducts()
      .then(data => {
        const filtered = (data ?? []).filter(
          section => section.products && section.products.length > 0,
        );
        setSections(filtered);
      })
      .catch(err => {
        if (process.env.NODE_ENV === "development") {
          console.warn("[homepage] category-products API unavailable:", err);
        }
        setSections([]);
      })
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) {
    return <SectionLoadingFallback variant={variant} />;
  }

  if (sections.length === 0) {
    return null;
  }

  return (
    <>
      {sections.map(section => (
        <Suspense
          key={section.category.id}
          fallback={<CategoryRowSkeleton variant={variant} />}
        >
          <CategoryProductRow
            category={section.category}
            products={section.products}
            variant={variant}
          />
        </Suspense>
      ))}
    </>
  );
}
