// solutionbar.tsx
import React from 'react';

interface Category {
  id: number;
  name: string;
  bgColor: string;
  hoverBorderColor: string;
  imageBgColor: string;
  imageHoverColor: string;
}

interface SolutionBarProps {
  categories?: Category[];
}

const SolutionBar: React.FC<SolutionBarProps> = ({ categories = [] }) => {
  // Default data if no props provided
  const defaultCategories: Category[] = [
    {
      id: 1,
      name: "Technology",
      bgColor: "bg-purple-100",
      hoverBorderColor: "hover:border-purple-500",
      imageBgColor: "bg-purple-500",
      imageHoverColor: "hover:bg-purple-600"
    },
    {
      id: 2,
      name: "Design",
      bgColor: "bg-blue-100",
      hoverBorderColor: "hover:border-blue-500",
      imageBgColor: "bg-blue-500",
      imageHoverColor: "hover:bg-blue-600"
    },
    {
      id: 3,
      name: "Marketing",
      bgColor: "bg-green-100",
      hoverBorderColor: "hover:border-green-500",
      imageBgColor: "bg-green-500",
      imageHoverColor: "hover:bg-green-600"
    }
  ];

  const displayCategories = categories.length > 0 ? categories : defaultCategories;

  return (
    <div className="flex justify-center items-center gap-5 p-5 min-h-screen">
      {displayCategories.map((category) => (
        <div
          key={category.id}
          className={`
            w-[30vw]
            h-[30vh]
            flex
            flex-col
            items-center
            justify-center
            p-6
            rounded-lg
            ${category.bgColor}
            border-2
            border-transparent
            transition-all
            duration-300
            ${category.hoverBorderColor}
            hover:shadow-xl
            cursor-pointer
          `}
        >
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
              transition-colors
              duration-300
              shadow-md
              text-white
              font-bold
              text-2xl
            `}
          >
            {category.name.charAt(0)}
          </div>
          
          {/* Category name from data */}
          <div className="text-center font-sans font-medium text-gray-700 text-lg">
            {category.name}
          </div>
        </div>
      ))}
    </div>
  );
};

export default SolutionBar;