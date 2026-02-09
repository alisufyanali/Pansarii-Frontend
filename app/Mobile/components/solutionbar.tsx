//solutionbar.tsx
import React from 'react';

const ImageCards = ({ cards = [] }) => {
  // Default data if no props provided
  const defaultCards = [
    {
      id: 1,
      title: "Card 1",
      description: "Text below picture",
      bgColor: "bg-red-100",
      hoverBorderColor: "hover:border-red-500",
      imageText: "Image 1"
    },
    {
      id: 2,
      title: "Card 2",
      description: "Text below picture",
      bgColor: "bg-green-100",
      hoverBorderColor: "hover:border-green-500",
      imageText: "Image 2"
    },
    {
      id: 3,
      title: "Card 3",
      description: "Text below picture",
      bgColor: "bg-blue-100",
      hoverBorderColor: "hover:border-blue-500",
      imageText: "Image 3"
    }
  ];

  const displayCards = cards.length > 0 ? cards : defaultCards;

  return (
    <div className="flex justify-center gap-5 p-5">
      {displayCards.map((card) => (
        <div
          key={card.id}
          className={`
            w-[200px] 
            h-[200px] 
            flex 
            flex-col 
            items-center 
            p-4 
            rounded 
            ${card.bgColor}
            border-2 
            border-transparent 
            transition-all 
            duration-300 
            hover:border-2 
            ${card.hoverBorderColor}
            hover:shadow-lg
            cursor-pointer
          `}
        >
          <div 
            className="
              w-[100px] 
              h-[100px] 
              rounded-full 
              bg-gray-300 
              mb-4 
              flex 
              items-center 
              justify-center
              hover:bg-gray-400
              transition-colors
              duration-300
            "
          >
            {card.imageText}
          </div>
          <div className="text-center font-sans">
            {card.description}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ImageCards;