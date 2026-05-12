// app/wishlist/page.tsx
"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FaHeart, FaShoppingCart, FaTrash, FaStar, FaBox, FaExchangeAlt, FaUser, FaSignInAlt, FaArrowRight, FaCreditCard, FaTruck, FaShieldAlt } from 'react-icons/fa';
import { FiX } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishList';
import { allProducts } from '../components/Desktop/data/products';

// Suggested product shape — a subset of Product
interface SuggestedProduct {
  id: string | number;
  nameEn: string;
  img: string;
  price: number;
  oldPrice?: number | null;
  rating: number;
  category?: string;
  isBestSeller?: boolean;
  sale?: string | null;
}

export default function WishlistPage() {
  const [mounted, setMounted] = useState(false);
  const [suggestedProducts, setSuggestedProducts] = useState<SuggestedProduct[]>([]);
  const { 
    cartItems, 
    addToCart, 
    removeFromCart, 
    updateQuantity,
    getCartCount 
  } = useCart();
  
  const { 
    wishlistItems, 
    removeFromWishlist, 
    isInWishlist,
    toggleWishlist,
    getWishlistCount,
    clearWishlist 
  } = useWishlist();

  const cartCount = getCartCount();
  const wishlistCount = getWishlistCount();

  useEffect(() => {
    setMounted(true);
    
    // Get product suggestions based on wishlist items
    if (wishlistItems.length > 0) {
      // Get categories from wishlist items
      const wishlistCategories = Array.from(new Set(wishlistItems.map(item => item.category)));
      
      // Find related products from same categories
      const suggestions = allProducts
        .filter(product => 
          wishlistCategories.includes(product.category) && 
          !wishlistItems.some(item => item.id === product.id)
        )
        .slice(0, 3)
        .map(product => ({
          id: product.id,
          nameEn: product.nameEn,
          img: product.img,
          price: product.price,
          oldPrice: product.oldPrice,
          rating: product.rating,
          category: product.category,
          isBestSeller: product.isBestSeller,
          sale: product.sale
        }));
      
      setSuggestedProducts(suggestions);
    } else {
      // If wishlist is empty, show popular products
      const popularSuggestions = allProducts
        .filter(product => product.isBestSeller)
        .slice(0, 6)
        .map(product => ({
          id: product.id,
          nameEn: product.nameEn,
          img: product.img,
          price: product.price,
          oldPrice: product.oldPrice,
          rating: product.rating,
          category: product.category,
          isBestSeller: product.isBestSeller,
          sale: product.sale
        }));
      
      setSuggestedProducts(popularSuggestions);
    }
  }, [wishlistItems]);

  const handleMoveToCart = (item: { id: string | number; img: string; nameEn: string; nameUr?: string; price: number; category?: string }) => {
    addToCart({
      id: item.id,
      img: item.img,
      nameEn: item.nameEn,
      nameUr: item.nameUr || item.nameEn,
      price: item.price,
      size: '15ml',
      category: item.category || 'Wishlist',
    });
    removeFromWishlist(item.id);
  };

  const handleMoveAllToCart = () => {
    wishlistItems.forEach(item => {
      handleMoveToCart(item);
    });
  };

  const handleAddSuggestedToCart = (product: SuggestedProduct) => {
    addToCart({
      id: product.id,
      img: product.img,
      nameEn: product.nameEn,
      nameUr: product.nameEn,
      price: product.price,
      size: '15ml',
      category: product.category || 'Suggested',
    });
  };

  const handleToggleWishlist = (item: { id: string | number; nameEn: string; nameUr?: string; price: number; img: string; oldPrice?: number | null; category?: string }) => {
    toggleWishlist({
      id: item.id,
      nameEn: item.nameEn,
      nameUr: item.nameUr || item.nameEn,
      price: item.price,
      img: item.img,
      oldPrice: item.oldPrice,
      category: item.category,
    });
  };

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white border-b">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-3">
            <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
          </div>
        </div>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <div className="h-24 bg-gray-200 rounded-xl animate-pulse mb-6" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-200 overflow-hidden animate-pulse">
                <div className="aspect-square bg-gray-200" />
                <div className="p-4 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-3 bg-gray-200 rounded w-1/2" />
                  <div className="h-5 bg-gray-200 rounded w-1/3 mt-2" />
                  <div className="h-9 bg-gray-200 rounded mt-3" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Check if user is logged in (same logic as sidebar)
  const isLoggedIn = () => {
    if (typeof window === 'undefined') return false;
    const token = localStorage.getItem('pansari-auth-token');
    const user = localStorage.getItem('pansari-auth-user');
    return !!(token && user);
  };

  const loggedIn = isLoggedIn();

  if (!loggedIn) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Breadcrumb */}
        <div className="bg-white border-b">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
            <p className="text-xs sm:text-sm text-gray-600">
              <Link href="/" className="hover:text-green-700">Home</Link>
              {' '}/{' '}
              <span className="text-gray-900 font-medium">Wishlist</span>
            </p>
          </div>
        </div>

        {/* Login Required */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm p-6 sm:p-8 lg:p-12 text-center border border-gray-200 max-w-2xl mx-auto">
            <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 mx-auto mb-4 sm:mb-6 bg-red-50 rounded-full flex items-center justify-center">
              <FaUser className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-red-300" />
            </div>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-2 sm:mb-3">Login Required</h2>
            <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6 max-w-md mx-auto px-4">
              Please login to view and manage your wishlist. Your saved items will be available across all your devices.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto">
              <Link
                href="/login?redirect=wishlist"
                className="w-full sm:flex-1 px-4 sm:px-6 py-2.5 sm:py-3 bg-green-700 text-white rounded-lg text-sm sm:text-base font-medium flex items-center justify-center gap-2 hover:bg-green-600 transition"
              >
                <FaSignInAlt className="w-3 h-3 sm:w-4 sm:h-4" />
                Login to Continue
              </Link>
              <Link
                href="/shop"
                className="w-full sm:flex-1 px-4 sm:px-6 py-2.5 sm:py-3 border border-gray-300 text-gray-700 rounded-lg text-sm sm:text-base font-medium hover:bg-gray-50 transition"
              >
                Browse Products
              </Link>
            </div>
            <p className="text-gray-500 text-xs sm:text-sm mt-4 sm:mt-6">
              Don't have an account?{' '}
              <Link href="/signup" className="text-green-700 hover:text-green-600 font-medium">
                Sign up here
              </Link>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
          <p className="text-xs sm:text-sm text-gray-600">
            <Link href="/" className="hover:text-green-700">Home</Link>
            {' '}/{' '}
            <span className="text-gray-900 font-medium">Wishlist</span>
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
        {wishlistCount === 0 ? (
          // Empty Wishlist
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm p-6 sm:p-8 lg:p-12 text-center border border-gray-200 max-w-2xl mx-auto">
            <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 mx-auto mb-4 sm:mb-6 bg-red-50 rounded-full flex items-center justify-center">
              <FaHeart className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-red-300" />
            </div>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-2 sm:mb-3">Your wishlist is empty</h2>
            <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">Save your favorite products here!</p>
            <Link 
              href="/shop"
              className="inline-block px-6 sm:px-8 py-2.5 sm:py-3 bg-green-700 text-white rounded-lg text-sm sm:text-base font-medium hover:bg-green-600 transition"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="bg-gradient-to-r from-green-700 to-green-600 text-white rounded-lg sm:rounded-xl mb-4 sm:mb-6">
              <div className="p-4 sm:p-6 lg:p-8">
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 bg-white/20 rounded-full flex items-center justify-center">
                    <FaHeart className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7" />
                  </div>
                  <div>
                    <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold">My Wishlist</h1>
                    <p className="text-green-100 text-xs sm:text-sm lg:text-base mt-0.5 sm:mt-1">
                      {wishlistCount} item{wishlistCount !== 1 ? 's' : ''} saved
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mb-4 sm:mb-6">
              <button
                onClick={handleMoveAllToCart}
                className="w-full sm:flex-1 py-2.5 sm:py-3 bg-green-700 text-white rounded-lg text-sm sm:text-base font-medium flex items-center justify-center gap-2 hover:bg-green-600 transition"
              >
                <FaExchangeAlt className="w-3 h-3 sm:w-4 sm:h-4" />
                Move All to Cart
              </button>
              <button
                onClick={clearWishlist}
                className="w-full sm:flex-1 py-2.5 sm:py-3 border border-red-300 text-red-600 rounded-lg text-sm sm:text-base font-medium flex items-center justify-center gap-2 hover:bg-red-50 transition"
              >
                <FaTrash className="w-3 h-3 sm:w-4 sm:h-4" />
                Clear Wishlist
              </button>
            </div>

            {/* Wishlist Items Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-8">
              {wishlistItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-lg sm:rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
                >
                  {/* Product Image */}
                  <div className="relative aspect-square bg-gray-50">
                    <Image
                      src={item.img}
                      alt={item.nameEn}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                    <button
                      onClick={() => removeFromWishlist(item.id)}
                      className="absolute top-2 right-2 sm:top-3 sm:right-3 w-7 h-7 sm:w-8 sm:h-8 bg-white rounded-full flex items-center justify-center hover:bg-red-50 transition-colors shadow-sm"
                      aria-label={`Remove ${item.nameEn} from wishlist`}
                    >
                      <FiX className="w-3 h-3 sm:w-4 sm:h-4 text-red-600" />
                    </button>
                    {!item.inStock && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <span className="px-2 sm:px-3 py-1 sm:py-1.5 bg-gray-800 text-white text-xs sm:text-sm rounded-lg font-medium">
                          Out of Stock
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Product Details */}
                  <div className="p-3 sm:p-4">
                    <div className="flex justify-between items-start mb-1 sm:mb-2">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-gray-900 text-xs sm:text-sm line-clamp-2">
                          {item.nameEn}
                        </h3>
                        <p className="text-xs text-gray-500 mt-0.5">
                          {item.category || 'Product'}
                        </p>
                      </div>
                    </div>

                    {/* Rating */}
                    <div className="flex items-center gap-1 mb-2 sm:mb-3">
                      <FaStar className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-yellow-400" />
                      <span className="text-xs font-medium text-gray-900">
                        {item.rating || '4.5'}
                      </span>
                    </div>

                    {/* Price */}
                    <div className="mb-3 sm:mb-4">
                      <span className="font-bold text-green-700 text-sm sm:text-base">
                        PKR {item.price.toLocaleString()}
                      </span>
                      {item.oldPrice && (
                        <span className="text-xs sm:text-sm text-gray-400 line-through ml-1 sm:ml-2">
                          PKR {item.oldPrice.toLocaleString()}
                        </span>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleMoveToCart(item)}
                        disabled={!item.inStock}
                        className={`flex-1 py-1.5 sm:py-2 bg-green-700 text-white text-xs sm:text-sm font-medium rounded hover:bg-green-600 transition flex items-center justify-center gap-1 sm:gap-2 ${
                          !item.inStock ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                      >
                        <FaExchangeAlt className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                        <span className="hidden xs:inline">Move to Cart</span>
                      </button>
                      <button
                        onClick={() => handleToggleWishlist(item)}
                        className="w-8 h-8 sm:w-10 sm:h-10 border border-gray-300 text-gray-600 rounded hover:bg-gray-50 transition flex items-center justify-center"
                        aria-label="Remove from wishlist"
                      >
                        <FaTrash className="w-3 h-3 sm:w-4 sm:h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Continue Shopping */}
            <div className="text-center mb-6 sm:mb-8">
              <Link
                href="/shop"
                className="inline-flex items-center gap-1 sm:gap-2 text-green-700 text-sm sm:text-base font-medium hover:text-green-600 transition"
              >
                <FaBox className="w-3 h-3 sm:w-4 sm:h-4" />
                Continue Shopping
                <FaArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />
              </Link>
            </div>

            {/* Product Suggestions */}
            {suggestedProducts.length > 0 && (
              <div className="bg-white rounded-lg sm:rounded-xl border border-gray-200 p-4 sm:p-6 mb-6 sm:mb-8">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4 mb-4 sm:mb-6">
                  <div>
                    <h2 className="text-base sm:text-lg font-bold text-gray-900">Recommended for you</h2>
                    <p className="text-xs sm:text-sm text-gray-600">Products you might like</p>
                  </div>
                  <Link 
                    href="/shop"
                    className="text-green-700 text-xs sm:text-sm font-medium hover:text-green-600"
                  >
                    View All
                  </Link>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
                  {suggestedProducts.map((product) => (
                    <div
                      key={product.id}
                      className="group relative"
                    >
                      <div className="relative aspect-square bg-gray-50 rounded-lg overflow-hidden mb-2 sm:mb-3">
                        <Image
                          src={product.img}
                          alt={product.nameEn}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
                        />
                        <button
                          onClick={() => handleToggleWishlist(product)}
                          className="absolute top-1 right-1 sm:top-2 sm:right-2 w-6 h-6 sm:w-7 sm:h-7 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-colors opacity-0 group-hover:opacity-100"
                          aria-label="Toggle wishlist"
                        >
                          <FaHeart className={`w-3 h-3 sm:w-3.5 sm:h-3.5 ${isInWishlist(product.id) ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} />
                        </button>
                      </div>
                      
                      <div className="space-y-1">
                        <h3 className="text-xs sm:text-sm font-medium text-gray-900 line-clamp-2">
                          {product.nameEn}
                        </h3>
                        <div className="flex flex-col xs:flex-row xs:items-center gap-1 xs:gap-2">
                          <span className="font-bold text-green-700 text-xs sm:text-sm">
                            PKR {product.price.toLocaleString()}
                          </span>
                          {product.oldPrice && (
                            <span className="text-xs text-gray-400 line-through">
                              PKR {product.oldPrice.toLocaleString()}
                            </span>
                          )}
                        </div>
                        <button
                          onClick={() => handleAddSuggestedToCart(product)}
                          className="w-full py-1.5 sm:py-2 text-xs font-medium bg-green-700 text-white rounded hover:bg-green-600 transition mt-1 sm:mt-2"
                        >
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Cart Summary Footer */}
            <div className="bg-white rounded-lg sm:rounded-xl border border-gray-200 p-4 sm:p-6 mt-6 sm:mt-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
                {/* Cart Status */}
                <div>
                  <h3 className="text-sm sm:text-base font-medium text-gray-900 mb-2">Your Cart</h3>
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 sm:w-8 sm:h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <FaShoppingCart className="w-3 h-3 sm:w-4 sm:h-4 text-green-600" />
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm text-gray-900 font-medium">{cartCount} items</p>
                      <Link 
                        href="/cart" 
                        className="text-green-700 text-xs sm:text-sm hover:text-green-600"
                      >
                        View cart →
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Checkout CTA */}
                <div className="md:col-span-2">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
                    <div>
                      <p className="text-xs sm:text-sm text-gray-600">Ready to purchase?</p>
                      <p className="text-xs text-gray-500">Your wishlist items are waiting</p>
                    </div>
                    <div className="flex flex-col xs:flex-row gap-2 w-full sm:w-auto">
                      <Link
                        href="/cart"
                        className="px-4 sm:px-6 py-2 sm:py-3 border border-green-700 text-green-700 rounded-lg text-xs sm:text-sm font-medium hover:bg-green-50 transition text-center"
                      >
                        View Cart
                      </Link>
                      <Link
                        href="/checkout"
                        className="px-4 sm:px-6 py-2 sm:py-3 bg-green-700 text-white rounded-lg text-xs sm:text-sm font-medium hover:bg-green-600 transition flex items-center justify-center gap-2"
                      >
                        <FaCreditCard className="w-3 h-3 sm:w-4 sm:h-4" />
                        Checkout Now
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

              {/* Trust Badges */}
              <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 pt-4 sm:pt-6 mt-4 sm:mt-6 border-t">
                <div className="flex items-center gap-1 sm:gap-2 text-xs text-gray-500">
                  <FaTruck className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                  <span>Free Shipping over PKR 2,000</span>
                </div>
                <div className="flex items-center gap-1 sm:gap-2 text-xs text-gray-500">
                  <FaShieldAlt className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                  <span>Secure Payment</span>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}