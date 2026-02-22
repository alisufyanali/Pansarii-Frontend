// app/shop/ProductGrid.tsx
import { Product } from "../../utils/filterProducts";
import ProductCard from "../../components/ProductCard";
import { memo } from 'react';
import { FaStar, FaCheckCircle, FaShoppingCart } from 'react-icons/fa';

interface ProductGridProps {
  products: Product[];
  viewMode?: 'grid' | 'list';
  onAddToCart?: (product: Product) => void; // Add this prop
}

function ProductGrid({ products, viewMode = 'grid', onAddToCart }: ProductGridProps) {
  if (viewMode === 'list') {
    return (
      <div className="space-y-4">
        {products.map((product) => (
          <div 
            key={`${product.id}-${product.nameEn}`}
            className="bg-white rounded-lg border border-gray-200 hover:shadow-lg transition-shadow p-4"
          >
            <div className="flex gap-6">
              {/* Product Image */}
              <div className="w-48 h-48 flex-shrink-0">
                <img 
                  src={product.img}
                  alt={product.nameEn}
                  className="w-full h-full object-cover rounded-lg"
                  loading="lazy"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/images/product.png';
                  }}
                />
              </div>

              {/* Product Details */}
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {product.nameEn}
                  </h3>
                  <p className="text-lg text-gray-600 mb-3">{product.nameUr}</p>
                  {product.description && (
                    <p className="text-sm text-green-700 mb-4">{product.description}</p>
                  )}

                  {/* Rating & Reviews */}
                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex items-center gap-1">
                      <FaStar className="w-5 h-5 text-yellow-400" />
                      <span className="font-semibold">{product.rating}</span>
                    </div>
                    <div className="flex items-center gap-1 text-green-600">
                      <FaCheckCircle className="w-5 h-5" />
                      <span>{product.reviews} Reviews</span>
                    </div>
                  </div>

                  {/* Tags/Benefits */}
                  {product.tags && product.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {product.tags.slice(0, 3).map((tag, index) => (
                        <span 
                          key={index}
                          className="px-2 py-1 bg-green-50 text-green-700 rounded text-xs"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Price and Action */}
                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl font-bold text-gray-900">
                      PKR {product.price.toLocaleString()}
                    </span>
                    {product.oldPrice && (
                      <span className="text-lg text-gray-500 line-through">
                        PKR {product.oldPrice.toLocaleString()}
                      </span>
                    )}
                    {product.sale && (
                      <span className="px-3 py-1 bg-red-100 text-red-600 rounded-full text-sm font-semibold">
                        {product.sale}
                      </span>
                    )}
                  </div>

                  <button 
                    className="px-8 py-3 bg-green-700 text-white rounded-full hover:bg-green-600 transition font-semibold flex items-center gap-2"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      if (onAddToCart) {
                        onAddToCart(product);
                      }
                    }}
                  >
                    <FaShoppingCart className="w-4 h-4" />
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Grid View - Default
  return (
    <div className="grid grid-cols-2 
                   md:grid-cols-2 
                   lg:grid-cols-3 
                   xl:grid-cols-4
                   2xl:grid-cols-5
                   gap-4 sm:gap-6">
      {products.map((product) => (
        <div key={`${product.id}-${product.nameEn}`} className="w-full">
          {/* Render ProductCard WITHOUT onAddToCart prop */}
          <ProductCard product={product} />
          
          {/* Add a separate floating add to cart button for grid view */}
          <div className="relative">
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if (onAddToCart) {
                  onAddToCart(product);
                }
              }}
              className="absolute bottom-2 right-2 w-10 h-10 bg-green-700 text-white rounded-full flex items-center justify-center hover:bg-green-600 transition shadow-lg opacity-0 group-hover:opacity-100 focus:opacity-100"
              aria-label="Add to cart"
            >
              <FaShoppingCart className="w-4 h-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default memo(ProductGrid, (prevProps, nextProps) => {
  return (
    prevProps.products.length === nextProps.products.length &&
    prevProps.viewMode === nextProps.viewMode &&
    prevProps.onAddToCart === nextProps.onAddToCart &&
    prevProps.products.every((product, index) => 
      product.id === nextProps.products[index]?.id
    )
  );
});