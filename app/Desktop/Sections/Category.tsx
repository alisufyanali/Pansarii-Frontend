"use client";

import Image from "next/image";
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

export default function Category() {
  const router = useRouter();
  const CategoryImage = '/images/category.png';
  
  // Different background colors for each card
  const bgColors = [
    '#FFEBEE', // Red
    '#F3E5F5', // Purple
    '#E8EAF6', // Indigo
    '#E3F2FD', // Blue
    '#E8F5E9', // Green
    '#FFF3E0', // Orange
  ];

  // Get categories from products data
  const categories = Array.from(new Set(allProducts.map(p => p.category)))
    .filter(Boolean)
    .slice(0, 6) // Show first 6 categories
    .map((category, index) => ({
      name: category,
      slug: CATEGORY_SLUG_MAP[category] || category.toLowerCase().replace(/\s+/g, '-'),
      bgColor: bgColors[index % bgColors.length],
      count: allProducts.filter(p => p.category === category).length
    }));

  const handleCategoryClick = (slug: string) => {
    router.push(`/${slug}`);
  };

  return (
    <div className="p-4 mx-[4%]">
      <div className="max-w-[1920px] mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-3xl 2xl:text-4xl font-semibold">
            Shop By <span className="me-color-y">Category</span>
          </h1>
          
          {/* View All → redirects to /category */}
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
      </div>
      
      {/* Cards container */}
      <div className="flex flex-wrap gap-6 justify-center">
        {categories.map((category, index) => (
          <div 
            key={index} 
            className="flex-1 min-w-[120px] max-w-[200px]"
          >
            <div
              className="flex flex-col items-center w-full cursor-pointer hover:scale-105 transition-transform"
              onClick={() => handleCategoryClick(category.slug)}
            >
              <div
                className="w-full aspect-[191/201] mb-2 flex items-center justify-center"
                style={{
                  borderTopLeftRadius: "113px",
                  borderTopRightRadius: "113px",
                  backgroundColor: category.bgColor,
                }}
              >
                <Image
                  src={CategoryImage}
                  alt={category.name}
                  width={170}
                  height={120}
                  className="object-contain mr-7 mt-6"
                  style={{ 
                    filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))'
                  }}
                />
              </div>
              <div className="w-full h-[50px] bg-white shadow-[0_4px_13.3px_0_rgba(0,0,0,0.24)] flex flex-col items-center justify-center rounded">
                <span className="text-[16px] font-medium">{category.name}</span>
                <span className="text-[12px] text-gray-500">{category.count} items</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}