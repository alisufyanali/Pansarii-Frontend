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
      <div className="flex items-center gap-8 mb-6 flex-wrap">
        <h1 className="text-2xl font-semibold whitespace-nowrap my-5">
          Shop By <span className="text-green-700">Category</span>
        </h1>
        <div className="flex-1 flex flex-wrap gap-6 justify-start">
          {cards.map((card, index) => (
            <div key={index} className="flex-1 min-w-[120px] max-w-[200px]">
              {card}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}