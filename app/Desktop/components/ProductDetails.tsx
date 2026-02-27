// app/Desktop/components/ProductDetails.tsx
"use client";

import { useState, useRef, useEffect } from "react";
import { 
  FaStar, 
  FaCheckCircle, 
  FaShoppingCart, 
  FaSearchPlus, 
  FaSearchMinus,
  FaWhatsapp,
  FaHeart,
  FaRegHeart,
  FaBolt,
  FaTimes
} from "react-icons/fa";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishList";
import { toast } from 'react-toastify';

// Skeletal Loading Component for ProductDetails
function ProductDetailsSkeleton() {
  return (
    <div className="h-screen max-h-screen overflow-hidden bg-white animate-pulse">
      <div className="h-full max-h-full flex flex-col lg:flex-row gap-2 lg:gap-3 p-2">
        
        {/* Left Column - Images Skeleton */}
        <div className="lg:w-2/5 h-full flex flex-col relative">
          <div className="relative aspect-square rounded-lg overflow-hidden bg-gray-200 mb-3"></div>
          
          {/* Thumbnail Images Skeleton */}
          <div className="flex gap-2">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="w-12 h-12 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>

        {/* Right Column - Product Info Skeleton */}
        <div className="lg:w-3/5 h-full overflow-y-auto">
          <div className="space-y-4">
            {/* Product Names Skeleton */}
            <div className="space-y-2">
              <div className="h-8 bg-gray-200 rounded w-48"></div>
              <div className="h-4 bg-gray-200 rounded w-32"></div>
            </div>
            
            {/* Rating & Reviews Skeleton */}
            <div className="flex items-center gap-4">
              <div className="h-4 bg-gray-200 rounded w-24"></div>
              <div className="h-4 bg-gray-200 rounded w-20"></div>
            </div>

            {/* Price Skeleton */}
            <div className="flex items-center gap-2">
              <div className="h-8 bg-gray-200 rounded w-24"></div>
              <div className="h-6 bg-gray-200 rounded w-16"></div>
            </div>

            {/* Ayurvedic Info Section Skeleton */}
            <div className="flex flex-wrap gap-2">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="w-16 h-8 bg-gray-200 rounded"></div>
              ))}
            </div>

            {/* Features Skeleton */}
            <div className="grid grid-cols-2 gap-2">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="rounded p-2 bg-gray-100">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded w-32"></div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pansari Points Skeleton */}
            <div className="p-2 bg-gray-100 rounded">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-40"></div>
              </div>
            </div>

            {/* Size Selection Skeleton */}
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-16"></div>
              <div className="flex gap-2">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="w-12 h-8 bg-gray-200 rounded-full"></div>
                ))}
              </div>
            </div>

            {/* Quantity Skeleton */}
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-20"></div>
              <div className="flex items-center gap-4">
                <div className="w-32 h-8 bg-gray-200 rounded"></div>
                <div className="space-y-1">
                  <div className="h-3 bg-gray-200 rounded w-16"></div>
                  <div className="h-4 bg-gray-200 rounded w-20"></div>
                </div>
              </div>
            </div>

            {/* Action Buttons Skeleton */}
            <div className="space-y-2 pt-4">
              <div className="flex gap-2">
                <div className="h-10 bg-gray-200 rounded-lg flex-1"></div>
                <div className="h-10 bg-gray-200 rounded-lg flex-1"></div>
              </div>
              <div className="h-10 bg-gray-200 rounded-lg"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface FeatureItem {
  text: string;
  icon?: string;
  hasCheck?: boolean;
}

interface ProductDetailsProps {
  product: {
    img: string;
    additionalImages?: string[];
    nameEn: string;
    nameUr: string;
    description: string;
    rating: number;
    reviews: number;
    price: number;
    oldPrice?: number;
    sale?: string;
    features?: FeatureItem[];
    sizes?: string[];
    points?: number;
    benefits?: string[];
    infoLines?: string[];
    productId?: string | number;
    category?: string;
  };
}

export default function ProductDetails({ product }: ProductDetailsProps) {
  const { addToCart } = useCart();
  const { addToWishlist, isInWishlist, removeFromWishlist } = useWishlist();
  
  const [selectedImage, setSelectedImage] = useState(product.img);
  const [selectedSize, setSelectedSize] = useState(product.sizes?.[0] || '15ml');
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // Zoom state
  const [isZoomed, setIsZoomed] = useState<boolean>(false);
  const [zoomPosition, setZoomPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const imageRef = useRef<HTMLDivElement>(null);
  
  const additionalImages = product.additionalImages || [];
  const productId = product.productId;

  // Check if user is logged in
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const user = localStorage.getItem('user');
    setIsLoggedIn(!!(token && user));
    
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, []);

  // Check if product is in wishlist
  useEffect(() => {
    if (productId && isLoggedIn) {
      setIsWishlisted(isInWishlist(productId));
    }
  }, [productId, isInWishlist, isLoggedIn]);

  // Show skeleton loading
  if (isLoading) {
    return <ProductDetailsSkeleton />;
  }

  const handleImageClick = (image: string) => {
    setSelectedImage(image);
    setIsZoomed(false);
  };

  const increaseQuantity = () => {
    setQuantity(prev => prev + 1);
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  // Image hover for zoom effect
  const handleImageHover = (e: React.MouseEvent<HTMLDivElement>): void => {
    if (!isZoomed || !imageRef.current) return;

    const { left, top, width, height } = imageRef.current.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;

    setZoomPosition({ x, y });
  };

  const toggleZoom = () => {
    setIsZoomed(!isZoomed);
  };

  // Add to cart functionality
  const handleAddToCart = () => {
    if (!productId) {
      toast.error('Failed to add item to cart!', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
      });
      return;
    }

    // Add the product to cart with selected size and quantity
    for (let i = 0; i < quantity; i++) {
      addToCart({
        id: productId,
        img: selectedImage,
        nameEn: product.nameEn,
        nameUr: product.nameUr,
        price: product.price,
        size: selectedSize,
        category: product.category || "Herbal Oils"
      });
    }

    // Show success toast
    toast.success(`Added ${quantity} × ${product.nameEn} (${selectedSize}) to cart!`, {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      theme: "light",
    });
  };

  // Buy now functionality
  const handleBuyNow = () => {
    if (!productId) {
      toast.error('Failed to add item to cart!', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
      });
      return;
    }

    for (let i = 0; i < quantity; i++) {
      addToCart({
        id: productId,
        img: selectedImage,
        nameEn: product.nameEn,
        nameUr: product.nameUr,
        price: product.price,
        size: selectedSize,
        category: product.category || "Herbal Oils"
      });
    }

    // Show success toast with redirect message
    toast.success(
      <div>
        <div className="font-semibold">Added to cart! Redirecting...</div>
        <div className="text-sm opacity-90">{product.nameEn} (×{quantity})</div>
      </div>, 
      {
        position: "top-right",
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        theme: "light",
      }
    );

    setTimeout(() => {
      window.location.href = '/cart';
    }, 1600);
  };

  // Toggle wishlist with login check
  const handleWishlistToggle = () => {
    if (!productId) return;
    
    // Check if user is logged in
    if (!isLoggedIn) {
      toast.warning(
        <div>
          <div className="font-semibold">Please login to add to wishlist</div>
          <div className="text-sm opacity-90 mt-1">Save your favorite products by logging in</div>
        </div>,
        {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "light",
        }
      );
      
      // Redirect to login after a delay
      setTimeout(() => {
        window.location.href = '/login?redirect=' + encodeURIComponent(window.location.pathname);
      }, 1500);
      return;
    }
    
    if (isWishlisted) {
      removeFromWishlist(productId);
      setIsWishlisted(false);
      
      toast.info('Removed from wishlist', {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
      });
    } else {
      addToWishlist({
        id: productId,
        img: selectedImage,
        nameEn: product.nameEn,
        nameUr: product.nameUr,
        price: product.price,
        oldPrice: product.oldPrice,
        rating: product.rating,
        reviews: product.reviews,
        inStock: true,
        category: product.category || "Herbal Oils"
      });
      setIsWishlisted(true);
      
      toast.success('Added to wishlist!', {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
      });
    }
  };

  // WhatsApp order function
  const handleWhatsAppOrder = () => {
    const totalPrice = product.price * quantity;
    
    const message = `🌟 *New Order Request* 🌟\n\n` +
      `*Product:* ${product.nameEn}\n` +
      `*Price:* PKR ${product.price.toLocaleString()}\n` +
      `*Size:* ${selectedSize}\n` +
      `*Quantity:* ${quantity}\n` +
      `*Total:* PKR ${totalPrice.toLocaleString()}\n\n` +
      `*Customer Details:*\n` +
      `Please provide your:\n` +
      `1. Full Name\n` +
      `2. Delivery Address\n` +
      `3. Phone Number\n\n` +
      `_This order was placed via Pansari Inn website_`;
    
    const whatsappUrl = `https://wa.me/923001234567?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="h-screen max-h-screen overflow-hidden bg-white">
      <div className="h-full max-h-full flex flex-col lg:flex-row gap-2 lg:gap-3 p-2">
        
        {/* Left Column - Images */}
        <div className="lg:w-2/5 h-full flex flex-col relative">
          {/* Wishlist Button with login check */}
          <button
            onClick={handleWishlistToggle}
            className={`absolute top-2 left-2 z-20 p-2 rounded-full shadow-md transition-all duration-300 hover:scale-110 ${
              isWishlisted 
                ? 'bg-red-50 border border-red-200 hover:bg-red-100' 
                : 'bg-white/90 border border-gray-200 hover:bg-white'
            }`}
            title={!isLoggedIn ? "Login to add to wishlist" : isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
          >
            {isWishlisted ? (
              <FaHeart className="w-4 h-4 text-red-500" />
            ) : (
              <FaRegHeart className="w-4 h-4 text-gray-600" />
            )}
          </button>

          {/* Zoom Toggle Button */}
          <button
            onClick={toggleZoom}
            className="absolute top-2 right-2 z-20 bg-white/90 hover:bg-white p-1.5 rounded-full shadow-md transition-all z-20 border border-gray-200"
            title={isZoomed ? "Disable zoom" : "Enable zoom"}
          >
            {isZoomed ? (
              <FaSearchMinus className="w-3 h-3 text-gray-700" />
            ) : (
              <FaSearchPlus className="w-3 h-3 text-gray-700" />
            )}
          </button>

          {/* Main Image Container with Zoom */}
          <div className="relative aspect-square rounded-lg overflow-hidden bg-gray-50 mb-3">
            <div 
              ref={imageRef}
              className="relative w-full h-full cursor-zoom-in"
              onMouseEnter={() => setIsZoomed(true)}
              onMouseLeave={() => setIsZoomed(false)}
              onMouseMove={handleImageHover}
            >
              <img
                src={selectedImage}
                alt={product.nameEn}
                className="w-full h-full object-contain p-4 transition-transform duration-200"
                style={{
                  transform: isZoomed ? 'scale(1.5)' : 'scale(1)',
                  transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`,
                }}
              />
              
              {/* Zoom Indicator */}
              <div className="absolute bottom-3 right-3 bg-black/60 text-white p-2 rounded-full">
                <FaSearchPlus className="w-4 h-4" />
              </div>
              
              {/* Zoom Preview */}
              {isZoomed && (
                <div className="absolute top-3 left-3 bg-green-600 text-white text-xs px-2 py-1 rounded">
                  Zoom Active (2x)
                </div>
              )}
            </div>
          </div>

          {/* Thumbnail Images */}
          {additionalImages.length > 0 && (
            <div className="flex gap-2 overflow-x-auto">
              {[product.img, ...additionalImages].map((image, index) => (
                <button
                  key={index}
                  onClick={() => handleImageClick(image)}
                  className={`flex-shrink-0 w-12 h-12 rounded overflow-hidden border ${
                    selectedImage === image 
                      ? 'border-[#197B33] border-2' 
                      : 'border-gray-200 hover:border-gray-400'
                  }`}
                >
                  <img
                    src={image}
                    alt={`${product.nameEn} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column - Product Info */}
        <div className="lg:w-3/5 h-full overflow-y-auto">
          <div className="space-y-2">
            {/* Product Names */}
            <div className="mt-2">
              <h1 className="text-lg font-bold text-gray-900 leading-tight">{product.nameEn}</h1>
              <p className="text-xs text-gray-700 mt-0.5">{product.nameUr}</p>
            </div>
            
            {/* Benefits */}
            {product.benefits && product.benefits.length > 0 && (
              <div className="text-gray-600 text-[10px] flex flex-wrap items-center gap-x-1 mt-2">
                {product.benefits.map((benefit, index) => (
                  <span key={index}>
                    {benefit}
                    {index < product.benefits!.length - 1 && (
                      <span className="mx-1 text-gray-300">|</span>
                    )}
                  </span>
                ))}
              </div>
            )}

            {/* Rating & Reviews */}
            <div className="flex items-center gap-2 mt-2">
              <div className="flex items-center gap-1">
                <FaStar className="w-3 h-3 text-yellow-400" />
                <span className="font-semibold text-gray-900 text-xs">{product.rating}</span>
              </div>
              
              <div className="flex items-center gap-1">
                <FaCheckCircle className="w-3 h-3 text-green-500" />
                <span className="text-gray-700 text-[10px]">{product.reviews} Reviews</span>
              </div>
            </div>

            {/* Price */}
            <div className="mt-2">
              <div className="flex items-center gap-1 flex-wrap">
                <span className="text-lg font-bold text-gray-900">PKR {product.price.toLocaleString()}</span>
                {product.oldPrice && (
                  <span className="text-sm text-gray-500 line-through">PKR {product.oldPrice.toLocaleString()}</span>
                )}
                {product.sale && (
                  <span className="px-1.5 py-0.5 bg-red-100 text-red-600 rounded-full text-[10px] font-medium">
                    {product.sale}
                  </span>
                )}
              </div>
            </div>

            {/* Ayurvedic Info Section */}
            {product.infoLines && product.infoLines.length > 0 && (
              <div className="mt-2">
                <div className="flex flex-wrap gap-1">
                  {product.infoLines.map((line, index) => (
                    <div 
                      key={index} 
                      className="text-gray-800 text-[10px] border border-[#5F5F5F] rounded px-2 py-1 bg-white"
                    >
                      {line}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Features */}
            {product.features && product.features.length > 0 && (
              <div className="mt-2">
                <div className="grid grid-cols-2 gap-1">
                  {product.features.map((feature, index) => {
                    const hasCheck = feature.hasCheck !== undefined 
                      ? feature.hasCheck 
                      : feature.text.startsWith('✓');
                    
                    const featureText = feature.hasCheck !== undefined
                      ? feature.text
                      : feature.text.replace('✓', '').trim();
                    
                    return (
                      <div 
                        key={index} 
                        className="rounded p-1 flex items-center gap-1 bg-white hover:bg-gray-50 transition-colors"
                      >
                        <div className="w-6 h-6 rounded bg-gray-100 flex items-center justify-center flex-shrink-0">
                          {feature.icon ? (
                            <img 
                              src={feature.icon} 
                              alt={featureText}
                              className="w-3 h-3 object-contain"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.style.display = 'none';
                                target.parentElement!.innerHTML = hasCheck ? 
                                  '<div class="text-green-600 font-bold text-xs">✓</div>' : 
                                  '<div class="text-gray-400 font-bold text-xs">○</div>';
                              }}
                            />
                          ) : (
                            hasCheck ? (
                              <div className="text-green-600 font-bold text-xs">✓</div>
                            ) : (
                              <div className="text-gray-400 font-bold text-xs">○</div>
                            )
                          )}
                        </div>
                        
                        <span className="text-gray-700 text-[10px] font-medium flex-1 leading-tight">
                          {featureText}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Pansari Points */}
            {product.points && (
              <div className="mt-2">
                <div className="bg-[#6464641A] rounded p-1.5 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FaBolt className="w-3 h-3 text-amber-600" />
                    <span className="text-gray-800 text-[10px]">
                      Earn {product.points * quantity} Pansari Inn Points
                    </span>
                  </div>
                  <div className="w-3 h-3 rounded-full bg-[#646464] flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-[8px] font-bold">!</span>
                  </div>
                </div>
              </div>
            )}

            {/* Size Selection */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="mt-2">
                <h3 className="font-semibold text-gray-900 text-xs mb-1">Size</h3>
                <div className="flex flex-wrap gap-1">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-2 py-0.5 rounded-full border text-[10px] font-medium transition-all ${
                        selectedSize === size
                          ? 'bg-[#197B33] text-white border-[#197B33]'
                          : 'bg-white text-gray-700 border-gray-300 hover:border-[#197B33]'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className="mt-2">
              <h3 className="font-semibold text-gray-900 text-xs mb-1">Quantity</h3>
              <div className="flex items-center gap-4">
                <div className="flex items-center border border-gray-300 rounded">
                  <button
                    onClick={decreaseQuantity}
                    className="px-2 py-0.5 text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed text-xs"
                    disabled={quantity === 1}
                  >
                    -
                  </button>
                  <span className="px-2 py-0.5 border-x border-gray-300 min-w-[40px] text-center font-semibold text-xs">
                    {quantity}
                  </span>
                  <button
                    onClick={increaseQuantity}
                    className="px-2 py-0.5 text-gray-600 hover:bg-gray-100 text-xs"
                  >
                    +
                  </button>
                </div>
                
                {/* Subtotal Display */}
                <div className="text-xs ml-auto">
                  <div className="text-gray-700">Subtotal:</div>
                  <div className="font-bold text-green-700">PKR {(product.price * quantity).toLocaleString()}</div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-2 pt-2">
              {/* Primary Buttons Row */}
              <div className="flex flex-col sm:flex-row gap-1.5 mb-2">
                <button 
                  onClick={handleAddToCart}
                  className="flex-1 flex items-center justify-center gap-1 me-bgcolor-g text-white font-semibold py-2 px-3 rounded-full hover:opacity-90 transition-opacity text-xs"
                >
                  <FaShoppingCart className="w-3 h-3" />
                  Add to cart
                </button>
                <button 
                  onClick={handleBuyNow}
                  className="flex-1 flex items-center justify-center me-bgcolor-y text-gray-900 font-semibold py-2 px-3 rounded-full hover:opacity-90 transition-opacity text-xs"
                >
                  Buy it now
                </button>
              </div>
              
              {/* WhatsApp Button Row */}
              <div className="w-full">
                <button 
                  onClick={handleWhatsAppOrder}
                  className="w-full flex items-center justify-center gap-2 bg-white border-2 border-[#25D366] text-[#25D366] font-semibold py-2 px-3 rounded-full hover:bg-[#25D366] hover:text-white transition-all duration-300 text-xs group"
                >
                  <FaWhatsapp className="w-4 h-4" />
                  <span>Order on WhatsApp</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}