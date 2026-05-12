import React from 'react';

const DirectionToUse = () => {
  const steps = [
    {
      id: 1,
      text: "Shake well before use",
      emoji: "🔄"
    },
    {
      id: 2,
      text: "Mix 30ml of juice with 30ml of warm water",
      emoji: "🥤"
    },
    {
      id: 3,
      text: "Shake well before use",
      emoji: "✨"
    }
  ];

  return (
    <div className="mt-4 bg-gradient-to-br from-amber-50 to-orange-50 flex items-center justify-center">
      <div className="max-w-6xl mx-auto w-full">
        <h1 className="text-2xl font-bold mb-8 text-center">
          Directions to Use
        </h1>
        
        {/* Three divs in a horizontal line */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-4">
          {steps.map((step) => (
            <div 
              key={step.id}
              className="bg-[#FCEDDB] border border-[#FAA944] rounded-lg p-5 flex items-center gap-4 w-full md:w-auto md:flex-1 max-w-xs"
            >
              {/* Picture on the left */}
              <div className="flex-shrink-0 w-16 h-16 rounded-full border border-[#F18601] bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center">
                <span className="text-2xl">{step.emoji}</span>
              </div>
              
              {/* Text on the right */}
              <div>
                <p className="text-gray-800 font-medium">
                  {step.text}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DirectionToUse;