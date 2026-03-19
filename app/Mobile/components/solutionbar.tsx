// solutionbar.tsx
import React from 'react';

interface Category {
  id: number;
  name: string;
  bgColor: string;
  borderColor: string;
  hoverBorderColor: string;
  imageBgColor: string;
  imageHoverColor: string;
}

interface SolutionBarProps {
  categories?: Category[];
}

const SolutionBar: React.FC<SolutionBarProps> = ({ categories = [] }) => {
  // Default data for Pansari Inn Pakistan
  const defaultCategories: Category[] = [
    {
      id: 1,
      name: "Grocery",
      bgColor: "bg-amber-50",
      borderColor: "border-amber-300",
      hoverBorderColor: "hover:border-amber-600",
      imageBgColor: "bg-amber-500",
      imageHoverColor: "hover:bg-amber-600"
    },
    {
      id: 2,
      name: "Vegetables",
      bgColor: "bg-emerald-50",
      borderColor: "border-emerald-300",
      hoverBorderColor: "hover:border-emerald-600",
      imageBgColor: "bg-emerald-500",
      imageHoverColor: "hover:bg-emerald-600"
    },
    {
      id: 3,
      name: "Fruits",
      bgColor: "bg-rose-50",
      borderColor: "border-rose-300",
      hoverBorderColor: "hover:border-rose-600",
      imageBgColor: "bg-rose-500",
      imageHoverColor: "hover:bg-rose-600"
    }
  ];

  const displayCategories = categories.length > 0 ? categories : defaultCategories;

  return (
    <div className="flex justify-center items-center gap-4 min-h-screen bg-gray-50 p-4">
      {displayCategories.map((category) => (
        <div
          key={category.id}
          className={`
            w-[32vw]
            h-[30vh]
            flex
            flex-col
            items-center
            justify-center
            p-6
            rounded-xl
            ${category.bgColor}
            border-2
            ${category.borderColor}
            transition-all
            duration-300
            ${category.hoverBorderColor}
            hover:border-4
            hover:shadow-2xl
            hover:scale-105
            cursor-pointer
            relative
            overflow-hidden
            group
          `}
        >
          {/* Decorative background pattern (optional) */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300 bg-pattern"></div>
          
          {/* Rounded picture/avatar with category initial */}
          <div 
            className={`
              w-[120px]
              h-[120px]
              rounded-full
              ${category.imageBgColor}
              mb-4
              flex
              items-center
              justify-center
              ${category.imageHoverColor}
              transition-all
              duration-300
              shadow-lg
              text-white
              font-bold
              text-3xl
              border-4
              border-white
              group-hover:scale-110
              group-hover:shadow-xl
            `}
          >
            {category.name.charAt(0)}
          </div>
          
          {/* Category name from data */}
          <div className="text-center font-sans font-semibold text-gray-800 text-xl group-hover:text-gray-900 transition-colors duration-300">
            {category.name}
          </div>
          
          {/* Urdu translation (optional - adds local touch) */}
          <div className="text-center font-sans text-sm text-gray-500 mt-1 font-urdu">
            {getUrduTranslation(category.name)}
          </div>
        </div>
      ))}
    </div>
  );
};

// Helper function for Urdu translations
const getUrduTranslation = (categoryName: string): string => {
  const translations: { [key: string]: string } = {
    "Grocery": "گروسری",
    "Vegetables": "سبزیاں",
    "Fruits": "پھل",
    "Dairy": "ڈیری",
    "Bakery": "بیکری",
    "Meat": "گوشت",
    "Spices": "مصالحے",
    "Rice": "چاول",
    "Flour": "آٹا",
    "Oil": "تیل",
    "Beverages": "مشروبات",
    "Snacks": "اسنیکس"
  };
  
  return translations[categoryName] || "";
};

export default SolutionBar;