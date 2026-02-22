"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishList';
import { allProducts } from '@/app/Desktop/data/products';
import { 
  FaTimes, 
  FaShoppingCart, 
  FaPlus, 
  FaMinus, 
  FaTrash,
  FaCreditCard,
  FaArrowRight,
  FaStar,
  FaHeart,
  FaUser,
  FaSignInAlt,
  FaExchangeAlt
} from 'react-icons/fa';

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

interface SuggestedProduct {
  id: string;
  nameEn: string;
  img: string;
  price: number;
  oldPrice?: number;
  rating: number;
  isBestSeller: boolean;
  sale?: string;
}

interface CartItem {
  id: string | number;
  nameEn: string;
  nameUr: string;
  img: string;
  price: number;
  oldPrice?: number;
  category?: string;
  size: string;
  quantity: number;
}

export default function CartSidebar({ isOpen, onClose }: CartSidebarProps) {
  const router = useRouter();
  const { 
    cartItems, 
    updateQuantity, 
    removeFromCart, 
    getCartTotal,
    getCartCount,
    clearCart,
    addToCart
  } = useCart();
  
  const { 
    wishlistItems, 
    removeFromWishlist, 
    isInWishlist,
    toggleWishlist,
    getWishlistCount 
  } = useWishlist();
  
  const [activeMenu, setActiveMenu] = useState<'cart' | 'wishlist'>('cart');
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [suggestedProducts, setSuggestedProducts] = useState<SuggestedProduct[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  const [updatingItems, setUpdatingItems] = useState<Set<string>>(new Set());
  const updateTimeoutRef = useRef<{ [key: string]: NodeJS.Timeout }>({});

  const cartTotal = getCartTotal();
  const cartCount = getCartCount();
  const wishlistCount = getWishlistCount();

  // Prevent body scroll when sidebar is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const user = localStorage.getItem('user');
    setIsLoggedIn(!!(token && user));
  }, []);

  useEffect(() => {
    if (cartItems.length > 0) {
      const cartCategories = Array.from(new Set(cartItems.map(item => item.category)));
      
      const suggestions = allProducts
        .filter(product => 
          cartCategories.includes(product.category) && 
          !cartItems.some(item => item.id === product.id)
        )
        .slice(0, 3)
        .map(product => ({
          id: product.id,
          nameEn: product.nameEn,
          img: product.img,
          price: product.price,
          oldPrice: product.oldPrice,
          rating: product.rating,
          isBestSeller: product.isBestSeller,
          sale: product.sale
        }));
      
      setSuggestedProducts(suggestions);
    } else {
      const popularSuggestions = allProducts
        .filter(product => product.isBestSeller)
        .slice(0, 3)
        .map(product => ({
          id: product.id,
          nameEn: product.nameEn,
          img: product.img,
          price: product.price,
          oldPrice: product.oldPrice,
          rating: product.rating,
          isBestSeller: product.isBestSeller,
          sale: product.sale
        }));
      
      setSuggestedProducts(popularSuggestions);
    }
  }, [cartItems]);

  useEffect(() => {
    return () => {
      Object.values(updateTimeoutRef.current).forEach(timeout => clearTimeout(timeout));
    };
  }, []);

  const handleIncrement = (item: CartItem) => {
    const itemKey = `${item.id}-${item.size}`;
    
    if (updatingItems.has(itemKey)) {
      return;
    }
    
    if (item.quantity >= 99) {
      return;
    }
    
    if (updateTimeoutRef.current[itemKey]) {
      clearTimeout(updateTimeoutRef.current[itemKey]);
    }
    
    setUpdatingItems(prev => new Set(prev).add(itemKey));
    
    const newQuantity = item.quantity + 1;
    updateQuantity(item.id, item.size, newQuantity);
    
    updateTimeoutRef.current[itemKey] = setTimeout(() => {
      setUpdatingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(itemKey);
        return newSet;
      });
    }, 300);
  };

  const handleDecrement = (item: CartItem) => {
    const itemKey = `${item.id}-${item.size}`;
    
    if (updatingItems.has(itemKey)) {
      return;
    }
    
    if (updateTimeoutRef.current[itemKey]) {
      clearTimeout(updateTimeoutRef.current[itemKey]);
    }
    
    setUpdatingItems(prev => new Set(prev).add(itemKey));
    
    if (item.quantity <= 1) {
      removeFromCart(item.id, item.size);
      setUpdatingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(itemKey);
        return newSet;
      });
    } else {
      const newQuantity = item.quantity - 1;
      updateQuantity(item.id, item.size, newQuantity);
      
      updateTimeoutRef.current[itemKey] = setTimeout(() => {
        setUpdatingItems(prev => {
          const newSet = new Set(prev);
          newSet.delete(itemKey);
          return newSet;
        });
      }, 300);
    }
  };

  const handleCheckout = () => {
    setIsCheckingOut(true);
    setTimeout(() => {
      setIsCheckingOut(false);
      onClose();
      router.push('/checkout');
    }, 1000);
  };

  const handleAddSuggestedProduct = (product: SuggestedProduct) => {
    addToCart({
      id: product.id,
      nameEn: product.nameEn,
      nameUr: product.nameEn,
      img: product.img,
      price: product.price,
      oldPrice: product.oldPrice,
      category: 'Suggested',
      size: 'Standard'
    });
  };

  const handleMoveToCart = (item: any) => {
    addToCart({
      id: item.id,
      nameEn: item.nameEn,
      nameUr: item.nameUr,
      img: item.img,
      price: item.price,
      oldPrice: item.oldPrice,
      category: item.category || 'Wishlist',
      size: 'Standard'
    });
    removeFromWishlist(item.id);
  };

  const handleLoginRedirect = () => {
    onClose();
    router.push('/login?redirect=wishlist');
  };

  const handleMoveAllToCart = () => {
    wishlistItems.forEach(item => handleMoveToCart(item));
  };

  const handleViewWishlist = () => {
    onClose();
    router.push('/wishlist');
  };

  const handleViewCart = () => {
    onClose();
    router.push('/cart');
  };

  const handleContinueShopping = () => {
    onClose();
  };

  const isItemUpdating = (item: CartItem) => {
    return updatingItems.has(`${item.id}-${item.size}`);
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Blur Overlay */}
      <div 
        className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[100] transition-opacity"
        onClick={onClose}
      />

      {/* Cart/Wishlist Sidebar */}
      <div className={`fixed right-0 top-0 h-full w-full sm:w-96 bg-white shadow-2xl z-[101] transform transition-transform duration-300 overflow-hidden ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        {/* Header with Tabs - Fixed at top */}
        <div className="bg-green-700 text-white sticky top-0 z-10">
          {/* Tabs */}
          <div className="flex border-b border-green-600">
            <button
              onClick={() => setActiveMenu('cart')}
              className={`flex-1 py-3 flex items-center justify-center gap-2 font-medium transition ${
                activeMenu === 'cart' 
                  ? 'bg-green-800' 
                  : 'hover:bg-green-600'
              }`}
            >
              <FaShoppingCart className="w-4 h-4" />
              Cart
              {cartCount > 0 && (
                <span className="bg-white text-green-700 text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount > 9 ? '9+' : cartCount}
                </span>
              )}
            </button>
            <button
              onClick={() => {
                if (!isLoggedIn) {
                  handleLoginRedirect();
                  return;
                }
                setActiveMenu('wishlist');
              }}
              className={`flex-1 py-3 flex items-center justify-center gap-2 font-medium transition ${
                activeMenu === 'wishlist' 
                  ? 'bg-green-800' 
                  : 'hover:bg-green-600'
              }`}
            >
              <FaHeart className="w-4 h-4" />
              Wishlist
              {wishlistCount > 0 && (
                <span className="bg-white text-green-700 text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {wishlistCount > 9 ? '9+' : wishlistCount}
                </span>
              )}
            </button>
            <button 
              onClick={onClose}
              className="px-4 hover:bg-green-600 transition flex items-center"
              aria-label="Close sidebar"
            >
              <FaTimes className="w-4 h-4" />
            </button>
          </div>

          {/* Title */}
          <div className="p-4">
            <div className="flex items-center gap-3">
              {activeMenu === 'cart' ? (
                <>
                  <FaShoppingCart className="w-5 h-5" />
                  <div>
                    <h2 className="text-lg font-bold">Shopping Cart</h2>
                    <p className="text-xs text-green-100">
                      {cartCount} item{cartCount !== 1 ? 's' : ''}
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <FaHeart className="w-5 h-5" />
                  <div>
                    <h2 className="text-lg font-bold">My Wishlist</h2>
                    <p className="text-xs text-green-100">
                      {wishlistCount} item{wishlistCount !== 1 ? 's' : ''}
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="h-[calc(100vh-180px)] overflow-y-auto">
          <div className="p-4">
            {activeMenu === 'cart' ? (
              // CART CONTENT
              cartCount === 0 ? (
                // Empty Cart State
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FaShoppingCart className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Your cart is empty</h3>
                  <p className="text-gray-600 mb-6 text-sm">Add some products to get started</p>
                  <button
                    onClick={handleContinueShopping}
                    className="px-5 py-2.5 bg-green-700 text-white rounded-lg hover:bg-green-600 transition text-sm font-medium"
                  >
                    Continue Shopping
                  </button>
                </div>
              ) : (
                // Cart Items
                <div className="space-y-3">
                  {cartItems.map((item) => {
                    const isUpdating = isItemUpdating(item);
                    
                    return (
                      <div key={`${item.id}-${item.size}`} className="flex gap-3 p-3 bg-white border border-gray-200 rounded-lg">
                        {/* Product Image */}
                        <div className="w-16 h-16 flex-shrink-0 relative">
                          <Image
                            src={item.img}
                            alt={item.nameEn}
                            fill
                            className="object-cover rounded-lg"
                            sizes="64px"
                          />
                        </div>

                        {/* Product Details */}
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-medium text-gray-900 text-sm">{item.nameEn}</h4>
                              <p className="text-xs text-gray-500">{item.category}</p>
                              {item.size && item.size !== 'Standard' && (
                                <p className="text-xs text-gray-500">Size: {item.size}</p>
                              )}
                            </div>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => toggleWishlist({
                                  id: item.id,
                                  nameEn: item.nameEn,
                                  nameUr: item.nameUr,
                                  price: item.price,
                                  img: item.img
                                })}
                                className="text-gray-400 hover:text-red-500 disabled:opacity-50"
                                aria-label="Toggle wishlist"
                                disabled={isUpdating}
                              >
                                <FaHeart className={`w-3.5 h-3.5 ${isInWishlist(item.id) ? 'fill-red-500 text-red-500' : ''}`} />
                              </button>
                              <button
                                onClick={() => removeFromCart(item.id, item.size)}
                                className="text-gray-400 hover:text-red-500 disabled:opacity-50"
                                aria-label={`Remove ${item.nameEn}`}
                                disabled={isUpdating}
                              >
                                <FaTrash className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                          
                          {/* Price and Quantity */}
                          <div className="flex items-center justify-between mt-2">
                            <div>
                              <span className="font-bold text-green-700 text-sm">
                                PKR {(item.price * item.quantity).toLocaleString()}
                              </span>
                              {item.oldPrice && (
                                <span className="text-xs text-gray-400 line-through ml-1">
                                  PKR {(item.oldPrice * item.quantity).toLocaleString()}
                                </span>
                              )}
                            </div>
                            
                            {/* Quantity Controls */}
                            <div className="flex items-center gap-1 border border-gray-300 rounded-md select-none">
                              <button
                                onClick={() => handleDecrement(item)}
                                className="px-2 py-0.5 text-gray-600 hover:text-green-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                aria-label="Decrease quantity"
                                disabled={isUpdating}
                                type="button"
                              >
                                {isUpdating ? (
                                  <div className="w-2.5 h-2.5 border border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                                ) : (
                                  <FaMinus className="w-2.5 h-2.5" />
                                )}
                              </button>
                              <span className={`px-2 text-sm font-medium w-8 text-center select-none ${
                                isUpdating ? 'text-gray-400' : 'text-gray-900'
                              }`}>
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => handleIncrement(item)}
                                className="px-2 py-0.5 text-gray-600 hover:text-green-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                aria-label="Increase quantity"
                                disabled={isUpdating || item.quantity >= 99}
                                type="button"
                              >
                                {isUpdating ? (
                                  <div className="w-2.5 h-2.5 border border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                                ) : (
                                  <FaPlus className="w-2.5 h-2.5" />
                                )}
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )
            ) : (
              // WISHLIST CONTENT
              !isLoggedIn ? (
                // Login Required for Wishlist
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FaUser className="w-8 h-8 text-red-300" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Login Required</h3>
                  <p className="text-gray-600 mb-4 text-sm">Please login to view your wishlist</p>
                  <p className="text-gray-500 text-xs mb-6">
                    Your wishlist will be saved to your account for easy access across devices
                  </p>
                  <div className="space-y-3">
                    <button
                      onClick={handleLoginRedirect}
                      className="w-full py-2.5 bg-green-700 text-white rounded-lg font-medium flex items-center justify-center gap-2 hover:bg-green-600 transition"
                    >
                      <FaSignInAlt className="w-4 h-4" />
                      Login to Continue
                    </button>
                    <button
                      onClick={() => setActiveMenu('cart')}
                      className="w-full py-2.5 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition"
                    >
                      View Cart Instead
                    </button>
                  </div>
                </div>
              ) : wishlistCount === 0 ? (
                // Empty Wishlist State
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FaHeart className="w-8 h-8 text-red-300" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Your wishlist is empty</h3>
                  <p className="text-gray-600 mb-6 text-sm">Save your favorite products here!</p>
                  <button
                    onClick={handleContinueShopping}
                    className="px-5 py-2.5 bg-green-700 text-white rounded-lg hover:bg-green-600 transition text-sm font-medium"
                  >
                    Browse Products
                  </button>
                </div>
              ) : (
                // Wishlist Items
                <div className="space-y-3">
                  {wishlistItems.map((item) => (
                    <div key={item.id} className="flex gap-3 p-3 bg-white border border-gray-200 rounded-lg">
                      {/* Product Image */}
                      <div className="w-16 h-16 flex-shrink-0 relative">
                        <Image
                          src={item.img}
                          alt={item.nameEn}
                          fill
                          className="object-cover rounded-lg"
                          sizes="64px"
                        />
                      </div>

                      {/* Product Details */}
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium text-gray-900 text-sm line-clamp-1">{item.nameEn}</h4>
                            <p className="text-xs text-gray-500">{item.category || 'Product'}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => removeFromWishlist(item.id)}
                              className="text-gray-400 hover:text-red-500"
                              aria-label={`Remove ${item.nameEn} from wishlist`}
                            >
                              <FaTrash className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                        
                        {/* Price */}
                        <div className="mt-2 mb-3">
                          <span className="font-bold text-green-700 text-sm">
                            PKR {item.price.toLocaleString()}
                          </span>
                          {item.oldPrice && (
                            <span className="text-xs text-gray-400 line-through ml-1">
                              PKR {item.oldPrice.toLocaleString()}
                            </span>
                          )}
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleMoveToCart(item)}
                            className="flex-1 py-1.5 bg-green-700 text-white text-xs font-medium rounded hover:bg-green-600 transition flex items-center justify-center gap-1"
                          >
                            <FaExchangeAlt className="w-2.5 h-2.5" />
                            Move to Cart
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )
            )}

            {/* Product Suggestions Section (only for cart) */}
            {activeMenu === 'cart' && suggestedProducts.length > 0 && (
              <div className="mt-6 pt-4 border-t">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-gray-900 text-sm">Recommended for you</h3>
                  <div className="flex items-center gap-1">
                    <FaStar className="w-3 h-3 text-amber-400" />
                    <span className="text-xs text-gray-500">Popular</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  {suggestedProducts.map((product) => (
                    <div key={product.id} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg transition group">
                      {/* Product Image with Badge */}
                      <div className="relative w-12 h-12 flex-shrink-0">
                        <Image
                          src={product.img}
                          alt={product.nameEn}
                          fill
                          className="object-cover rounded"
                          sizes="48px"
                        />
                        {product.isBestSeller && (
                          <div className="absolute -top-1 -right-1 w-4 h-4 bg-amber-500 rounded-full flex items-center justify-center">
                            <FaStar className="w-2 h-2 text-white" />
                          </div>
                        )}
                      </div>

                      {/* Product Info */}
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-gray-900 truncate">
                          {product.nameEn}
                        </h4>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-sm font-bold text-green-700">
                            PKR {product.price.toLocaleString()}
                          </span>
                          {product.oldPrice && (
                            <span className="text-xs text-gray-400 line-through">
                              PKR {product.oldPrice.toLocaleString()}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Add to Cart Button */}
                      <button
                        onClick={() => handleAddSuggestedProduct(product)}
                        className="flex-shrink-0 w-8 h-8 bg-green-100 text-green-700 rounded-full flex items-center justify-center hover:bg-green-200 transition group-hover:scale-110"
                        aria-label={`Add ${product.nameEn} to cart`}
                      >
                        <span className="text-sm font-bold">+</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer - Different for cart and wishlist */}
        {activeMenu === 'cart' && cartCount > 0 && (
          <div className="sticky bottom-0 left-0 right-0 p-4 border-t bg-white">
            {/* Cart Summary */}
            <div className="space-y-2 mb-4">
              {/* Subtotal */}
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">PKR {cartTotal.toLocaleString()}</span>
              </div>

              {/* Total */}
              <div className="flex justify-between text-base font-bold pt-2 border-t">
                <span>Total</span>
                <span className="text-green-700">PKR {cartTotal.toLocaleString()}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <div className="flex gap-2">
                <button
                  onClick={clearCart}
                  className="flex-1 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition text-sm font-medium"
                  disabled={updatingItems.size > 0}
                >
                  Clear Cart
                </button>
                <button
                  onClick={handleViewCart}
                  className="flex-1 py-2 border border-green-700 text-green-700 text-center rounded-lg hover:bg-green-50 transition text-sm font-medium"
                >
                  View Cart
                </button>
              </div>

              <button
                onClick={handleCheckout}
                disabled={isCheckingOut || updatingItems.size > 0}
                className="w-full py-2.5 bg-green-700 text-white rounded-lg font-medium flex items-center justify-center gap-2 hover:bg-green-600 transition disabled:opacity-70 disabled:cursor-not-allowed text-sm"
              >
                {isCheckingOut ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <FaCreditCard className="w-3.5 h-3.5" />
                    Checkout Now
                    <FaArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {activeMenu === 'wishlist' && isLoggedIn && wishlistCount > 0 && (
          <div className="sticky bottom-0 left-0 right-0 p-4 border-t bg-white">
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Total items:</span>
                <span className="font-bold text-green-700">{wishlistCount}</span>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={handleMoveAllToCart}
                  className="flex-1 py-2.5 bg-green-700 text-white rounded-lg font-medium flex items-center justify-center gap-2 hover:bg-green-600 transition"
                >
                  <FaExchangeAlt className="w-4 h-4" />
                  Move All to Cart
                </button>
                <button
                  onClick={handleViewWishlist}
                  className="flex-1 py-2.5 border border-green-700 text-green-700 text-center rounded-lg hover:bg-green-50 transition font-medium flex items-center justify-center gap-2"
                >
                  <FaHeart className="w-4 h-4" />
                  View All
                </button>
              </div>

              <button
                onClick={handleContinueShopping}
                className="w-full py-2.5 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}