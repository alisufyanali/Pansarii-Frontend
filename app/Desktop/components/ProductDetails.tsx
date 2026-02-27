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
  FaTimes,
  FaChevronDown,
  FaChevronUp,
  FaInfoCircle,
  FaLeaf,
  FaBoxOpen
} from "react-icons/fa";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishList";
import { toast } from 'react-toastify';

// Skeletal Loading Component for ProductDetails
function ProductDetailsSkeleton() {
  return (
    <div className="min-h-screen bg-white animate-pulse">
      <div className="flex flex-col lg:flex-row gap-4 lg:gap-6 p-4 lg:p-6">
        
        {/* Left Column - Images Skeleton */}
        <div className="lg:w-2/5">
          <div className="relative aspect-square rounded-lg overflow-hidden bg-gray-200 mb-3"></div>
          
          {/* Thumbnail Images Skeleton */}
          <div className="flex gap-2">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="w-16 h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>

        {/* Right Column - Product Info Skeleton */}
        <div className="lg:w-3/5">
          <div className="space-y-4">
            <div className="h-8 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-6 bg-gray-200 rounded w-1/3"></div>
            
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-12 bg-gray-200 rounded"></div>
            ))}
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
  const [isMobile, setIsMobile] = useState(false);
  
  // Mobile dropdown states
  const [showFeatures, setShowFeatures] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [showBenefits, setShowBenefits] = useState(false);
  
  // Zoom state
  const [isZoomed, setIsZoomed] = useState<boolean>(false);
  const [zoomPosition, setZoomPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const imageRef = useRef<HTMLDivElement>(null);
  
  const additionalImages = product.additionalImages || [];
  const productId = product.productId;

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Check if user is logged in
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const user = localStorage.getItem('user');
    setIsLoggedIn(!!(token && user));
    
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

  const handleImageHover = (e: React.MouseEvent<HTMLDivElement>): void => {
    if (!isZoomed || !imageRef.current || isMobile) return;

    const { left, top, width, height } = imageRef.current.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;

    setZoomPosition({ x, y });
  };

  const toggleZoom = () => {
    if (!isMobile) {
      setIsZoomed(!isZoomed);
    }
  };

  const handleAddToCart = () => {
    if (!productId) {
      toast.error('Failed to add item to cart!');
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

    toast.success(`Added ${quantity} × ${product.nameEn} (${selectedSize}) to cart!`);
  };

  const handleBuyNow = () => {
    if (!productId) {
      toast.error('Failed to add item to cart!');
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

    toast.success('Added to cart! Redirecting...');
    setTimeout(() => {
      window.location.href = '/cart';
    }, 1600);
  };

  const handleWishlistToggle = () => {
    if (!productId) return;
    
    if (!isLoggedIn) {
      toast.warning('Please login to add to wishlist');
      setTimeout(() => {
        window.location.href = '/login?redirect=' + encodeURIComponent(window.location.pathname);
      }, 1500);
      return;
    }
    
    if (isWishlisted) {
      removeFromWishlist(productId);
      setIsWishlisted(false);
      toast.info('Removed from wishlist');
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
      toast.success('Added to wishlist!');
    }
  };

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

  // Collapsible Section Component
  const CollapsibleSection = ({ 
    title, 
    icon, 
    isOpen, 
    onToggle, 
    children 
  }: { 
    title: string; 
    icon: React.ReactNode; 
    isOpen: boolean; 
    onToggle: () => void; 
    children: React.ReactNode;
  }) => (
    <div className="border-t border-gray-200">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between py-3 px-4 hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-2">
          {icon}
          <span className="font-semibold text-gray-900 text-sm">{title}</span>
        </div>
        {isOpen ? (
          <FaChevronUp className="w-4 h-4 text-gray-500" />
        ) : (
          <FaChevronDown className="w-4 h-4 text-gray-500" />
        )}
      </button>
      {isOpen && (
        <div className="px-4 pb-4 animate-slideDown">
          {children}
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-white">
      <div className="flex flex-col lg:flex-row gap-4 lg:gap-6 p-3 sm:p-4 lg:p-6 max-w-7xl mx-auto">
        
        {/* Left Column - Images */}
        <div className="lg:w-2/5 relative">
          {/* Wishlist Button */}
          <button
            onClick={handleWishlistToggle}
            className={`absolute top-2 left-2 z-20 p-2 sm:p-2.5 rounded-full shadow-md transition-all duration-300 hover:scale-110 ${
              isWishlisted 
                ? 'bg-red-50 border border-red-200 hover:bg-red-100' 
                : 'bg-white/90 border border-gray-200 hover:bg-white'
            }`}
          >
            {isWishlisted ? (
              <FaHeart className="w-4 h-4 sm:w-5 sm:h-5 text-red-500" />
            ) : (
              <FaRegHeart className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
            )}
          </button>

          {/* Zoom Toggle Button - Hide on mobile */}
          {!isMobile && (
            <button
              onClick={toggleZoom}
              className="absolute top-2 right-2 z-20 bg-white/90 hover:bg-white p-2.5 rounded-full shadow-md transition-all border border-gray-200"
            >
              {isZoomed ? (
                <FaSearchMinus className="w-4 h-4 text-gray-700" />
              ) : (
                <FaSearchPlus className="w-4 h-4 text-gray-700" />
              )}
            </button>
          )}

          {/* Main Image */}
          <div className="relative aspect-square rounded-xl overflow-hidden bg-gray-50 mb-3 shadow-md">
            <div 
              ref={imageRef}
              className="relative w-full h-full"
              onMouseEnter={() => !isMobile && setIsZoomed(true)}
              onMouseLeave={() => !isMobile && setIsZoomed(false)}
              onMouseMove={handleImageHover}
            >
              <img
                src={selectedImage}
                alt={product.nameEn}
                className="w-full h-full object-contain p-4 sm:p-6 transition-transform duration-200"
                style={{
                  transform: isZoomed && !isMobile ? 'scale(1.5)' : 'scale(1)',
                  transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`,
                }}
              />
              
              {!isMobile && isZoomed && (
                <div className="absolute top-3 left-3 bg-green-600 text-white text-xs px-2 py-1 rounded">
                  Zoom Active (2x)
                </div>
              )}
            </div>
          </div>

          {/* Thumbnail Images */}
          {additionalImages.length > 0 && (
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {[product.img, ...additionalImages].map((image, index) => (
                <button
                  key={index}
                  onClick={() => handleImageClick(image)}
                  className={`flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden border-2 transition-all ${
                    selectedImage === image 
                      ? 'border-green-600 shadow-md' 
                      : 'border-gray-200 hover:border-gray-400'
                  }`}
                >
                  <img
                    src={image}
                    alt={`View ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column - Product Info */}
        <div className="lg:w-3/5">
          {/* MOBILE VIEW - Compact Essential Info */}
          {isMobile ? (
            <div className="space-y-3">
              {/* Essential Info - Always Visible */}
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900 leading-tight">{product.nameEn}</h1>
                <p className="text-sm text-gray-600 mt-1">{product.nameUr}</p>
              </div>

              {/* Rating & Price */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded">
                    <FaStar className="w-4 h-4 text-yellow-400" />
                    <span className="font-semibold text-gray-900 text-sm">{product.rating}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <FaCheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-gray-600 text-sm">{product.reviews}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-2xl font-bold text-gray-900">PKR {product.price.toLocaleString()}</span>
                {product.oldPrice && (
                  <>
                    <span className="text-base text-gray-500 line-through">PKR {product.oldPrice.toLocaleString()}</span>
                    <span className="px-2 py-0.5 bg-red-100 text-red-600 rounded-full text-xs font-semibold">
                      Save {Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)}%
                    </span>
                  </>
                )}
              </div>

              {/* Size Selection */}
              {product.sizes && product.sizes.length > 0 && (
                <div>
                  <h3 className="font-semibold text-gray-900 text-sm mb-2">Size</h3>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`px-4 py-2 rounded-lg border-2 text-sm font-medium transition-all ${
                          selectedSize === size
                            ? 'bg-green-600 text-white border-green-600 shadow-md'
                            : 'bg-white text-gray-700 border-gray-300 hover:border-green-600'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity */}
              <div>
                <h3 className="font-semibold text-gray-900 text-sm mb-2">Quantity</h3>
                <div className="flex items-center justify-between">
                  <div className="flex items-center border-2 border-gray-300 rounded-lg">
                    <button
                      onClick={decreaseQuantity}
                      className="px-4 py-2 text-gray-600 hover:bg-gray-100 disabled:opacity-50 text-base font-bold"
                      disabled={quantity === 1}
                    >
                      −
                    </button>
                    <span className="px-6 py-2 border-x-2 border-gray-300 font-semibold text-base min-w-[60px] text-center">
                      {quantity}
                    </span>
                    <button
                      onClick={increaseQuantity}
                      className="px-4 py-2 text-gray-600 hover:bg-gray-100 text-base font-bold"
                    >
                      +
                    </button>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-xs text-gray-600">Subtotal:</div>
                    <div className="text-lg font-bold text-green-700">PKR {(product.price * quantity).toLocaleString()}</div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-2">
                <div className="flex gap-2">
                  <button 
                    onClick={handleAddToCart}
                    className="flex-1 flex items-center justify-center gap-2 bg-green-700 text-white font-semibold py-3 rounded-lg hover:bg-green-800 transition-all shadow-md text-sm"
                  >
                    <FaShoppingCart className="w-4 h-4" />
                    Add to Cart
                  </button>
                  <button 
                    onClick={handleBuyNow}
                    className="flex-1 flex items-center justify-center bg-amber-500 text-gray-900 font-semibold py-3 rounded-lg hover:bg-amber-600 transition-all shadow-md text-sm"
                  >
                    Buy Now
                  </button>
                </div>
                
                <button 
                  onClick={handleWhatsAppOrder}
                  className="w-full flex items-center justify-center gap-2 bg-white border-2 border-[#25D366] text-[#25D366] font-semibold py-3 rounded-lg hover:bg-[#25D366] hover:text-white transition-all text-sm"
                >
                  <FaWhatsapp className="w-5 h-5" />
                  Order on WhatsApp
                </button>
              </div>

              {/* Collapsible Sections */}
              <div className="bg-white rounded-xl border border-gray-200 mt-4">
                {/* Features Dropdown */}
                {product.features && product.features.length > 0 && (
                  <CollapsibleSection
                    title="Key Features"
                    icon={<FaLeaf className="w-4 h-4 text-green-600" />}
                    isOpen={showFeatures}
                    onToggle={() => setShowFeatures(!showFeatures)}
                  >
                    <div className="grid grid-cols-1 gap-2">
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
                            className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                          >
                            <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center flex-shrink-0 shadow-sm">
                              {hasCheck ? (
                                <div className="text-green-600 font-bold">✓</div>
                              ) : (
                                <div className="text-gray-400 font-bold">○</div>
                              )}
                            </div>
                            <span className="text-gray-700 text-sm font-medium">
                              {featureText}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </CollapsibleSection>
                )}

                {/* Benefits Dropdown */}
                {product.benefits && product.benefits.length > 0 && (
                  <CollapsibleSection
                    title="Benefits"
                    icon={<FaInfoCircle className="w-4 h-4 text-blue-600" />}
                    isOpen={showBenefits}
                    onToggle={() => setShowBenefits(!showBenefits)}
                  >
                    <div className="space-y-2">
                      {product.benefits.map((benefit, index) => (
                        <div key={index} className="flex items-start gap-2 text-gray-700 text-sm">
                          <span className="text-green-600 mt-0.5">•</span>
                          <span>{benefit}</span>
                        </div>
                      ))}
                    </div>
                  </CollapsibleSection>
                )}

                {/* Product Details Dropdown */}
                {product.infoLines && product.infoLines.length > 0 && (
                  <CollapsibleSection
                    title="Product Details"
                    icon={<FaBoxOpen className="w-4 h-4 text-purple-600" />}
                    isOpen={showDetails}
                    onToggle={() => setShowDetails(!showDetails)}
                  >
                    <div className="space-y-2">
                      {product.infoLines.map((line, index) => (
                        <div key={index} className="px-3 py-2 bg-gray-50 rounded-lg text-sm text-gray-700">
                          {line}
                        </div>
                      ))}
                    </div>
                  </CollapsibleSection>
                )}

                {/* Pansari Points */}
                {product.points && (
                  <div className="border-t border-gray-200 p-4">
                    <div className="flex items-center gap-2 bg-amber-50 p-3 rounded-lg">
                      <FaBolt className="w-5 h-5 text-amber-600" />
                      <span className="text-gray-800 text-sm font-medium">
                        Earn {product.points * quantity} Pansari Inn Points with this purchase
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* DESKTOP VIEW - Full Info Visible */
            <div className="space-y-4">
              {/* Product Names */}
              <div>
                <h1 className="text-3xl font-bold text-gray-900 leading-tight">{product.nameEn}</h1>
                <p className="text-lg text-gray-600 mt-2">{product.nameUr}</p>
              </div>
              
              {/* Benefits */}
              {product.benefits && product.benefits.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {product.benefits.map((benefit, index) => (
                    <span 
                      key={index}
                      className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm font-medium"
                    >
                      {benefit}
                    </span>
                  ))}
                </div>
              )}

              {/* Rating & Reviews */}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 bg-yellow-50 px-3 py-2 rounded-lg">
                  <FaStar className="w-5 h-5 text-yellow-400" />
                  <span className="font-semibold text-gray-900">{product.rating}</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <FaCheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-gray-700">{product.reviews} Reviews</span>
                </div>
              </div>

              {/* Price */}
              <div className="flex items-center gap-3 flex-wrap">
                <span className="text-3xl font-bold text-gray-900">PKR {product.price.toLocaleString()}</span>
                {product.oldPrice && (
                  <>
                    <span className="text-xl text-gray-500 line-through">PKR {product.oldPrice.toLocaleString()}</span>
                    <span className="px-3 py-1 bg-red-100 text-red-600 rounded-full text-sm font-semibold">
                      Save {Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)}%
                    </span>
                  </>
                )}
              </div>

              {/* Product Info Lines */}
              {product.infoLines && product.infoLines.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {product.infoLines.map((line, index) => (
                    <div 
                      key={index} 
                      className="px-3 py-1.5 border border-gray-300 rounded-lg bg-white text-sm text-gray-800"
                    >
                      {line}
                    </div>
                  ))}
                </div>
              )}

              {/* Features */}
              {product.features && product.features.length > 0 && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Key Features</h3>
                  <div className="grid grid-cols-2 gap-3">
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
                          className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                          <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center flex-shrink-0 shadow-sm">
                            {hasCheck ? (
                              <div className="text-green-600 font-bold">✓</div>
                            ) : (
                              <div className="text-gray-400 font-bold">○</div>
                            )}
                          </div>
                          <span className="text-gray-700 text-sm font-medium">
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
                <div className="bg-amber-50 rounded-lg p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FaBolt className="w-5 h-5 text-amber-600" />
                    <span className="text-gray-800 font-medium">
                      Earn {product.points * quantity} Pansari Inn Points
                    </span>
                  </div>
                </div>
              )}

              {/* Size Selection */}
              {product.sizes && product.sizes.length > 0 && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Size</h3>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`px-6 py-2.5 rounded-lg border-2 text-sm font-medium transition-all ${
                          selectedSize === size
                            ? 'bg-green-600 text-white border-green-600 shadow-md'
                            : 'bg-white text-gray-700 border-gray-300 hover:border-green-600'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Quantity</h3>
                <div className="flex items-center gap-6">
                  <div className="flex items-center border-2 border-gray-300 rounded-lg">
                    <button
                      onClick={decreaseQuantity}
                      className="px-5 py-3 text-gray-600 hover:bg-gray-100 disabled:opacity-50 font-bold"
                      disabled={quantity === 1}
                    >
                      −
                    </button>
                    <span className="px-8 py-3 border-x-2 border-gray-300 font-semibold text-lg min-w-[80px] text-center">
                      {quantity}
                    </span>
                    <button
                      onClick={increaseQuantity}
                      className="px-5 py-3 text-gray-600 hover:bg-gray-100 font-bold"
                    >
                      +
                    </button>
                  </div>
                  
                  <div>
                    <div className="text-sm text-gray-600">Subtotal:</div>
                    <div className="text-2xl font-bold text-green-700">PKR {(product.price * quantity).toLocaleString()}</div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 pt-4">
                <div className="flex gap-3">
                  <button 
                    onClick={handleAddToCart}
                    className="flex-1 flex items-center justify-center gap-2 bg-green-700 text-white font-semibold py-4 rounded-lg hover:bg-green-800 transition-all shadow-md"
                  >
                    <FaShoppingCart className="w-5 h-5" />
                    Add to Cart
                  </button>
                  <button 
                    onClick={handleBuyNow}
                    className="flex-1 flex items-center justify-center gap-2 bg-amber-500 text-gray-900 font-semibold py-4 rounded-lg hover:bg-amber-600 transition-all shadow-md"
                  >
                    Buy Now
                  </button>
                </div>
                
                <button 
                  onClick={handleWhatsAppOrder}
                  className="w-full flex items-center justify-center gap-3 bg-white border-2 border-[#25D366] text-[#25D366] font-semibold py-4 rounded-lg hover:bg-[#25D366] hover:text-white transition-all"
                >
                  <FaWhatsapp className="w-6 h-6" />
                  Order on WhatsApp
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <style jsx global>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-slideDown {
          animation: slideDown 0.2s ease-out;
        }

        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }

        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}