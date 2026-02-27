import VideoProductCard2 from "../../components/VideoProductCard2";
import { videoProducts } from "../../data/videoProducts";

export default function VideoProductsSection() {
  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6 text-center sm:text-left">
        Related Products
      </h2>
      
      {/* Horizontal scroll container */}
      <div className="flex overflow-x-auto gap-3 sm:gap-4 pb-4 snap-x scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
        {videoProducts.map((videoProduct) => (
          <div 
            key={videoProduct.id} 
            className="flex-none w-[85%] xs:w-[70%] sm:w-[45%] md:w-[30%] lg:w-[23%] snap-start"
          >
            <VideoProductCard2 product={videoProduct} />
          </div>
        ))}
      </div>
    </div>
  );
}