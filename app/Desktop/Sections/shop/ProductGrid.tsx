// app/shop/ProductGrid.tsx
import { Product } from "../../utils/filterProducts";
import ProductCard from "../../../Desktop/components/ProductCard";
import ProductCardMobile from "../../../Mobile/components/ProductCard";
import ProductDetailsModal from "../../../Desktop/components/ProductDetailsModal";
import { memo, useState, useEffect } from 'react';
import { FaStar, FaCheckCircle, FaEye } from 'react-icons/fa';

interface ProductGridProps {
  products: Product[];
  viewMode?: 'grid' | 'list';
  onAddToCart?: (product: Product) => void;
  isMobile?: boolean;
}

function ProductGrid({ products, viewMode = 'grid', onAddToCart, isMobile = false }: ProductGridProps) {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => { setIsClient(true); }, []);

  const handleQuickView = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  // ─── List View ───────────────────────────────────────────────────────────────
  if (viewMode === 'list') {
    return (
      <>
        <div className="space-y-3 sm:space-y-4">
          {products.map((product) => (
            <div
              key={`${product.id}-${product.nameEn}`}
              className="bg-white rounded-lg sm:rounded-xl border border-gray-200 hover:border-green-300 hover:shadow-lg transition-all duration-300 p-3 sm:p-4 lg:p-6"
            >
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                {/* Image */}
                <div className="w-full sm:w-36 lg:w-48 h-48 sm:h-36 lg:h-48 flex-shrink-0 relative">
                  <img
                    src={product.img}
                    alt={product.nameEn}
                    className="w-full h-full object-cover rounded-lg"
                    loading="lazy"
                    onError={(e) => { (e.target as HTMLImageElement).src = '/images/product.png'; }}
                  />
                  {product.sale && (
                    <div className="absolute top-2 right-2 px-2 py-1 bg-red-500 text-white rounded-full text-xs font-bold shadow-md">
                      {product.sale}
                    </div>
                  )}
                </div>

                {/* Details */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-base sm:text-lg lg:text-xl font-bold text-gray-900 mb-1 sm:mb-2 hover:text-green-700 transition-colors cursor-pointer">
                      {product.nameEn}
                    </h3>
                    <p className="text-sm sm:text-base text-gray-600 mb-2 sm:mb-3">{product.nameUr}</p>
                    {product.description && (
                      <p className="text-xs sm:text-sm text-green-700 mb-3 sm:mb-4 line-clamp-2">{product.description}</p>
                    )}
                    <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
                      <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded">
                        <FaStar className="w-4 h-4 text-yellow-400" />
                        <span className="text-sm sm:text-base font-semibold text-gray-900">{product.rating}</span>
                      </div>
                      <div className="flex items-center gap-1 text-green-600">
                        <FaCheckCircle className="w-4 h-4" />
                        <span className="text-xs sm:text-sm font-medium">{product.reviews} Reviews</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col xs:flex-row xs:items-center justify-between gap-3 mt-3 sm:mt-4 pt-3 border-t border-gray-100">
                    <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                      <span className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">
                        PKR {product.price.toLocaleString()}
                      </span>
                      {product.oldPrice && (
                        <>
                          <span className="text-sm sm:text-base text-gray-500 line-through">
                            PKR {product.oldPrice.toLocaleString()}
                          </span>
                          <span className="px-2 sm:px-3 py-0.5 sm:py-1 bg-green-100 text-green-700 rounded-full text-xs sm:text-sm font-semibold">
                            Save {Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)}%
                          </span>
                        </>
                      )}
                    </div>
                    <button
                      className="px-4 sm:px-6 lg:px-8 py-2 sm:py-2.5 lg:py-3 bg-green-700 text-white rounded-lg hover:bg-green-800 active:scale-95 transition-all font-semibold flex items-center justify-center gap-1 sm:gap-2 text-xs sm:text-sm shadow-md hover:shadow-lg"
                      onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleQuickView(product); }}
                    >
                      <FaEye className="w-3 h-3 sm:w-4 sm:h-4" />
                      Quick View
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {isModalOpen && selectedProduct && (
          <ProductDetailsModal product={selectedProduct} onClose={handleCloseModal} />
        )}
      </>
    );
  }

  // ─── Grid View ───────────────────────────────────────────────────────────────
  if (!isClient) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-5 2xl:grid-cols-5 gap-3 sm:gap-4 lg:gap-6 2xl:gap-8 2xl:gap-8">
        {products.map((_, index) => (
          <div key={`skeleton-${index}`} className="w-full animate-pulse">
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="aspect-square bg-gray-200 rounded-t-xl" />
              <div className="p-3 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4" />
                <div className="h-3 bg-gray-200 rounded w-1/2" />
                <div className="h-8 bg-gray-200 rounded mt-3" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <>
      {/*
        Grid columns:
        - Mobile:        2 cols
        - sm (640px):    2 cols
        - md (768px):    3 cols
        - lg (1024px):   4 cols  ← laptop unchanged
        - xl (1280px):   5 cols  ← laptop unchanged
        - 2xl (1536px+): 5 cols  ← large desktop / 4K: 5 cols always
        Gap scales up on 2xl for more breathing room on large screens
      */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-5 2xl:grid-cols-5 gap-3 sm:gap-4 lg:gap-6 2xl:gap-8 2xl:gap-8">
        {products.map((product) => (
          <div key={`${product.id}-${product.nameEn}`} className="w-full">
            {isMobile ? (
              <ProductCardMobile
                id={product.id?.toString() || ''}
                image={product.img}
                hoverImg={product.hoverImg}
                name={product.nameEn}
                nameUr={product.nameUr}
                description={product.description}
                features={product.features?.map((f: string | { text: string }) => typeof f === 'string' ? f : f.text) || []}
                price={product.price}
                oldPrice={product.oldPrice || undefined}
                rating={product.rating}
                reviews={product.reviews}
                sale={product.sale || undefined}
                onAddToCart={onAddToCart ? (id) => {
                  const p = products.find(p => p.id?.toString() === id);
                  if (p) onAddToCart(p);
                } : undefined}
                product={product}
              />
            ) : (
              <ProductCard product={product} />
            )}
          </div>
        ))}
      </div>

      {isModalOpen && selectedProduct && (
        <ProductDetailsModal product={selectedProduct} onClose={handleCloseModal} />
      )}
    </>
  );
}

export default memo(ProductGrid, (prevProps, nextProps) => {
  return (
    prevProps.products.length === nextProps.products.length &&
    prevProps.viewMode === nextProps.viewMode &&
    prevProps.isMobile === nextProps.isMobile &&
    prevProps.products.every((product, index) => product.id === nextProps.products[index]?.id)
  );
});