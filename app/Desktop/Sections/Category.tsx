import Image from "next/image";

export default function Category() {
  const cards = [];
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
  
  for (let i = 0; i < 6; i++) {
    cards.push(
      <div
        key={i}
        className="flex flex-col items-center w-full"
      >
        <div
          className="w-full aspect-[191/201] mb-2 flex items-center justify-center"
          style={{
            borderTopLeftRadius: "113px",
            borderTopRightRadius: "113px",
            backgroundColor: bgColors[i], // Dynamic background color
          }}
        >
          <Image
            src={CategoryImage}
            alt="Category"
            width={170} // Increased from 100 to 130
            height={120} // Increased from 100 to 130
            className="object-contain mr-7 mt-6"
            style={{ 
              filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))' // Adds clarity
            }}
          />
        </div>
        <div className="w-full h-[50px] bg-white shadow-[0_4px_13.3px_0_rgba(0,0,0,0.24)] flex items-center justify-center rounded text-[16px] font-medium">
          Product {i + 1}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 mx-[4%]">
      {/* Improved heading to match BeautyCorner style */}
      <div className="max-w-[1920px] mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-3xl 2xl:text-4xl font-semibold">
            Shop By <span className="me-color-y">Category</span>
          </h1>
          
          {/* Optional: Add View All button like BeautyCorner */}
          <div className="flex items-center gap-4 cursor-pointer group">
            <span className="text-black font-semibold group-hover:text-[#197B33] transition-colors 2xl:text-lg">
              View All
            </span>
            <div className="w-10 h-10 flex items-center justify-center rounded-full bg-[#1A1A1A1A] text-dark group-hover:bg-[#197B33] group-hover:text-white transition-all">
              <span className="text-lg font-bold">{'>'}</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Cards container - exactly as you had it */}
      <div className="flex flex-wrap gap-6 justify-center">
        {cards.map((card, index) => (
          <div key={index} className="flex-1 min-w-[120px] max-w-[200px]">
            {card}
          </div>
        ))}
      </div>
    </div>
  );
}