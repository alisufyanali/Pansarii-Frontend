import VideoProductCard2 from "../../components/VideoProductCard2";
import { videoProducts } from "../../data/videoProducts";

export default function VideoProductsSection() {
  // Take only first 4 products (or adjust as needed)
  const displayedProducts = videoProducts.slice(0, 4);

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6 text-center sm:text-left">
        Related Products
      </h2>
      
      {/* Responsive grid - all cards visible at once */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6">
        {displayedProducts.map((videoProduct) => (
          <div 
            key={videoProduct.id} 
            className="w-full flex justify-center"
          >
            <VideoProductCard2 product={videoProduct} />
          </div>
        ))}
      </div>
    </div>
  );
}