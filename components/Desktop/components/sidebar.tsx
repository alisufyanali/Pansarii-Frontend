"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishList';
import type { WishlistItem } from '@/app/context/WishList';
import { allProducts } from '@/data/products';
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
  FaExchangeAlt,
  FaShoppingBag
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
  const [addedItems, setAddedItems] = useState<Set<string>>(new Set());
  
  const [updatingItems, setUpdatingItems] = useState<Set<string>>(new Set());
  const updateTimeoutRef = useRef<{ [key: string]: NodeJS.Timeout }>({});

  const cartTotal = getCartTotal();
  const cartCount = getCartCount();
  const wishlistCount = getWishlistCount();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
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
    if (updatingItems.has(itemKey) || item.quantity >= 99) return;
    if (updateTimeoutRef.current[itemKey]) clearTimeout(updateTimeoutRef.current[itemKey]);
    setUpdatingItems(prev => new Set(prev).add(itemKey));
    updateQuantity(item.id, item.size, item.quantity + 1);
    updateTimeoutRef.current[itemKey] = setTimeout(() => {
      setUpdatingItems(prev => { const s = new Set(prev); s.delete(itemKey); return s; });
    }, 300);
  };

  const handleDecrement = (item: CartItem) => {
    const itemKey = `${item.id}-${item.size}`;
    if (updatingItems.has(itemKey)) return;
    if (updateTimeoutRef.current[itemKey]) clearTimeout(updateTimeoutRef.current[itemKey]);
    setUpdatingItems(prev => new Set(prev).add(itemKey));
    if (item.quantity <= 1) {
      removeFromCart(item.id, item.size);
      setUpdatingItems(prev => { const s = new Set(prev); s.delete(itemKey); return s; });
    } else {
      updateQuantity(item.id, item.size, item.quantity - 1);
      updateTimeoutRef.current[itemKey] = setTimeout(() => {
        setUpdatingItems(prev => { const s = new Set(prev); s.delete(itemKey); return s; });
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
    setAddedItems(prev => new Set(prev).add(String(product.id)));
    setTimeout(() => {
      setAddedItems(prev => { const s = new Set(prev); s.delete(String(product.id)); return s; });
    }, 1500);
  };

  const handleMoveToCart = (item: WishlistItem) => {
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

  const handleLoginRedirect = () => { onClose(); router.push('/login?redirect=wishlist'); };
  const handleMoveAllToCart = () => { wishlistItems.forEach(item => handleMoveToCart(item)); };
  const handleViewWishlist = () => { onClose(); router.push('/wishlist'); };
  const handleViewCart = () => { onClose(); router.push('/cart'); };
  const handleContinueShopping = () => { onClose(); };
  const isItemUpdating = (item: CartItem) => updatingItems.has(`${item.id}-${item.size}`);

  const savings = cartItems.reduce((sum, item) => {
    if (item.oldPrice) return sum + ((item.oldPrice - item.price) * item.quantity);
    return sum;
  }, 0);

  return (
    <>
      {/* Overlay */}
      <div 
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />

      {/* Sidebar — uses flex column so footer is always at bottom */}
      <div className={`fixed right-0 top-0 h-full w-full sm:w-[400px] bg-white shadow-2xl z-[101] flex flex-col transform transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>

        {/* ── HEADER (fixed) ── */}
        <div className="flex-shrink-0 bg-green-700 text-white">
          {/* Tabs */}
          <div className="flex">
            <button
              onClick={() => setActiveMenu('cart')}
              className={`flex-1 py-3.5 flex items-center justify-center gap-2 text-sm font-semibold transition border-b-2 ${
                activeMenu === 'cart' 
                  ? 'border-white bg-green-800' 
                  : 'border-transparent hover:bg-green-600'
              }`}
            >
              <FaShoppingCart className="w-4 h-4" />
              Cart
              {cartCount > 0 && (
                <span className="bg-white text-green-700 text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                  {cartCount > 9 ? '9+' : cartCount}
                </span>
              )}
            </button>
            <button
              onClick={() => {
                if (!isLoggedIn) { handleLoginRedirect(); return; }
                setActiveMenu('wishlist');
              }}
              className={`flex-1 py-3.5 flex items-center justify-center gap-2 text-sm font-semibold transition border-b-2 ${
                activeMenu === 'wishlist' 
                  ? 'border-white bg-green-800' 
                  : 'border-transparent hover:bg-green-600'
              }`}
            >
              <FaHeart className="w-4 h-4" />
              Wishlist
              {wishlistCount > 0 && (
                <span className="bg-white text-green-700 text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                  {wishlistCount > 9 ? '9+' : wishlistCount}
                </span>
              )}
            </button>
            <button 
              onClick={onClose}
              className="px-4 hover:bg-green-600 transition border-b-2 border-transparent"
              aria-label="Close"
            >
              <FaTimes className="w-4 h-4" />
            </button>
          </div>

          {/* Subtitle strip */}
          <div className="px-4 py-2.5 flex items-center justify-between">
            <p className="text-sm text-green-100 font-medium">
              {activeMenu === 'cart'
                ? cartCount === 0 ? 'Your cart is empty' : `${cartCount} item${cartCount !== 1 ? 's' : ''} in cart`
                : wishlistCount === 0 ? 'No saved items' : `${wishlistCount} saved item${wishlistCount !== 1 ? 's' : ''}`
              }
            </p>
            {activeMenu === 'cart' && cartCount > 0 && savings > 0 && (
              <span className="text-xs bg-amber-400 text-amber-900 px-2 py-0.5 rounded-full font-semibold">
                You save PKR {savings.toLocaleString()}
              </span>
            )}
          </div>
        </div>

        {/* ── SCROLLABLE CONTENT (flex-1 fills remaining space) ── */}
        <div className="flex-1 overflow-y-auto overscroll-contain">
          <div className="p-4 space-y-3">

            {/* ─ CART CONTENT ─ */}
            {activeMenu === 'cart' && (
              <>
                {cartCount === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16 text-center">
                    <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mb-5">
                      <FaShoppingBag className="w-9 h-9 text-green-300" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-1">Your cart is empty</h3>
                    <p className="text-gray-500 text-sm mb-6 max-w-48">Looks like you haven't added anything yet.</p>
                    <button
                      onClick={handleContinueShopping}
                      className="px-6 py-2.5 bg-green-700 text-white rounded-full hover:bg-green-600 transition text-sm font-semibold shadow"
                    >
                      Start Shopping
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {cartItems.map((item) => {
                      const isUpdating = isItemUpdating(item);
                      const discount = item.oldPrice ? Math.round((1 - item.price / item.oldPrice) * 100) : 0;
                      return (
                        <div key={`${item.id}-${item.size}`} className="flex gap-3 p-3 bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                          {/* Image */}
                          <div className="w-[70px] h-[70px] flex-shrink-0 relative rounded-lg overflow-hidden bg-gray-50">
                            <Image src={item.img} alt={item.nameEn} fill className="object-cover" sizes="70px" />
                            {discount > 0 && (
                              <div className="absolute top-1 left-1 bg-red-500 text-white text-[9px] font-bold px-1 rounded">
                                -{discount}%
                              </div>
                            )}
                          </div>

                          {/* Details */}
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-start gap-1">
                              <div className="min-w-0">
                                <h4 className="font-semibold text-gray-900 text-sm leading-tight line-clamp-2">{item.nameEn}</h4>
                                {item.size && item.size !== 'Standard' && (
                                  <span className="text-[11px] text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded mt-1 inline-block">{item.size}</span>
                                )}
                              </div>
                              {/* Actions */}
                              <div className="flex items-center gap-1.5 flex-shrink-0">
                                <button
                                  onClick={() => toggleWishlist({ id: item.id, nameEn: item.nameEn, nameUr: item.nameUr, price: item.price, img: item.img })}
                                  className="w-6 h-6 flex items-center justify-center text-gray-300 hover:text-red-400 transition"
                                  disabled={isUpdating}
                                >
                                  <FaHeart className={`w-3.5 h-3.5 ${isInWishlist(item.id) ? 'text-red-500' : ''}`} />
                                </button>
                                <button
                                  onClick={() => removeFromCart(item.id, item.size)}
                                  className="w-6 h-6 flex items-center justify-center text-gray-300 hover:text-red-500 transition"
                                  disabled={isUpdating}
                                >
                                  <FaTrash className="w-3 h-3" />
                                </button>
                              </div>
                            </div>

                            {/* Price + Qty row */}
                            <div className="flex items-center justify-between mt-2">
                              <div className="flex items-baseline gap-1.5">
                                <span className="font-bold text-green-700 text-sm">
                                  PKR {(item.price * item.quantity).toLocaleString()}
                                </span>
                                {item.oldPrice && (
                                  <span className="text-[11px] text-gray-400 line-through">
                                    PKR {(item.oldPrice * item.quantity).toLocaleString()}
                                  </span>
                                )}
                              </div>

                              {/* Qty control */}
                              <div className={`flex items-center rounded-lg border transition-colors ${isUpdating ? 'border-gray-200 bg-gray-50' : 'border-gray-200 bg-white'}`}>
                                <button
                                  onClick={() => handleDecrement(item)}
                                  disabled={isUpdating}
                                  className="w-7 h-7 flex items-center justify-center text-gray-500 hover:text-green-700 hover:bg-green-50 rounded-l-lg transition disabled:opacity-40"
                                >
                                  <FaMinus className="w-2.5 h-2.5" />
                                </button>
                                <span className="w-8 text-center text-sm font-bold text-gray-900 select-none">
                                  {isUpdating ? (
                                    <span className="flex justify-center">
                                      <span className="w-3 h-3 border border-gray-400 border-t-transparent rounded-full animate-spin inline-block" />
                                    </span>
                                  ) : item.quantity}
                                </span>
                                <button
                                  onClick={() => handleIncrement(item)}
                                  disabled={isUpdating || item.quantity >= 99}
                                  className="w-7 h-7 flex items-center justify-center text-gray-500 hover:text-green-700 hover:bg-green-50 rounded-r-lg transition disabled:opacity-40"
                                >
                                  <FaPlus className="w-2.5 h-2.5" />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Suggestions */}
                {suggestedProducts.length > 0 && (
                  <div className="mt-2 pt-4 border-t border-dashed border-gray-200">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">You might also like</p>
                    <div className="space-y-2">
                      {suggestedProducts.map((product) => (
                        <div key={product.id} className="flex items-center gap-3 p-2.5 bg-gray-50 hover:bg-green-50 rounded-xl transition group">
                          <div className="relative w-11 h-11 flex-shrink-0 rounded-lg overflow-hidden">
                            <Image src={product.img} alt={product.nameEn} fill className="object-cover" sizes="44px" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-800 truncate">{product.nameEn}</p>
                            <div className="flex items-center gap-1.5">
                              <span className="text-sm font-bold text-green-700">PKR {product.price.toLocaleString()}</span>
                              {product.oldPrice && <span className="text-xs text-gray-400 line-through">PKR {product.oldPrice.toLocaleString()}</span>}
                            </div>
                          </div>
                          <button
                            onClick={() => handleAddSuggestedProduct(product)}
                            className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition ${
                              addedItems.has(String(product.id))
                                ? 'bg-green-700 text-white scale-110'
                                : 'bg-white text-green-700 border border-green-200 hover:bg-green-700 hover:text-white group-hover:border-green-700'
                            }`}
                          >
                            {addedItems.has(String(product.id)) ? '✓' : '+'}
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}

            {/* ─ WISHLIST CONTENT ─ */}
            {activeMenu === 'wishlist' && (
              <>
                {!isLoggedIn ? (
                  <div className="flex flex-col items-center justify-center py-16 text-center">
                    <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mb-5">
                      <FaUser className="w-9 h-9 text-red-200" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-1">Login Required</h3>
                    <p className="text-gray-500 text-sm mb-6 max-w-52">Sign in to view and manage your saved items.</p>
                    <button onClick={handleLoginRedirect} className="w-full max-w-56 py-2.5 bg-green-700 text-white rounded-full font-semibold flex items-center justify-center gap-2 hover:bg-green-600 transition mb-3 shadow">
                      <FaSignInAlt className="w-4 h-4" />
                      Sign In
                    </button>
                    <button onClick={() => setActiveMenu('cart')} className="text-sm text-gray-500 hover:text-green-700 transition underline">
                      Back to cart
                    </button>
                  </div>
                ) : wishlistCount === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16 text-center">
                    <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mb-5">
                      <FaHeart className="w-9 h-9 text-red-200" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-1">Nothing saved yet</h3>
                    <p className="text-gray-500 text-sm mb-6 max-w-48">Tap the heart on products to save them here.</p>
                    <button onClick={handleContinueShopping} className="px-6 py-2.5 bg-green-700 text-white rounded-full hover:bg-green-600 transition text-sm font-semibold shadow">
                      Browse Products
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {wishlistItems.map((item) => (
                      <div key={item.id} className="flex gap-3 p-3 bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                        <div className="w-[70px] h-[70px] flex-shrink-0 relative rounded-lg overflow-hidden bg-gray-50">
                          <Image src={item.img} alt={item.nameEn} fill className="object-cover" sizes="70px" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start">
                            <div className="min-w-0 pr-1">
                              <h4 className="font-semibold text-gray-900 text-sm line-clamp-2">{item.nameEn}</h4>
                              {item.category && <p className="text-xs text-gray-400 mt-0.5">{item.category}</p>}
                            </div>
                            <button onClick={() => removeFromWishlist(item.id)} className="w-6 h-6 flex items-center justify-center text-gray-300 hover:text-red-500 transition flex-shrink-0">
                              <FaTrash className="w-3 h-3" />
                            </button>
                          </div>
                          <div className="flex items-center justify-between mt-2">
                            <div className="flex items-baseline gap-1.5">
                              <span className="font-bold text-green-700 text-sm">PKR {item.price.toLocaleString()}</span>
                              {item.oldPrice && <span className="text-[11px] text-gray-400 line-through">PKR {item.oldPrice.toLocaleString()}</span>}
                            </div>
                            <button
                              onClick={() => handleMoveToCart(item)}
                              className="flex items-center gap-1.5 py-1.5 px-3 bg-green-700 text-white text-xs font-semibold rounded-lg hover:bg-green-600 transition"
                            >
                              <FaShoppingCart className="w-2.5 h-2.5" />
                              Add to Cart
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* ── FOOTER (flex-shrink-0, always at bottom) ── */}

        {/* Cart Footer */}
        {activeMenu === 'cart' && cartCount > 0 && (
          <div className="flex-shrink-0 border-t border-gray-100 bg-white p-4 space-y-3">
            {/* Order summary */}
            <div className="bg-gray-50 rounded-xl p-3 space-y-1.5">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Subtotal ({cartCount} items)</span>
                <span className="font-medium text-gray-900">PKR {cartTotal.toLocaleString()}</span>
              </div>
              {savings > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-green-600">You save</span>
                  <span className="text-green-600 font-semibold">- PKR {savings.toLocaleString()}</span>
                </div>
              )}
              <div className="border-t border-gray-200 pt-1.5 flex justify-between font-bold">
                <span className="text-gray-900">Total</span>
                <span className="text-green-700 text-base">PKR {cartTotal.toLocaleString()}</span>
              </div>
            </div>

            {/* Buttons */}
            <button
              onClick={handleCheckout}
              disabled={isCheckingOut || updatingItems.size > 0}
              className="w-full py-3 bg-green-700 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-green-600 active:scale-[0.98] transition disabled:opacity-60 disabled:cursor-not-allowed shadow-lg shadow-green-200"
            >
              {isCheckingOut ? (
                <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Processing...</>
              ) : (
                <><FaCreditCard className="w-4 h-4" />Proceed to Checkout<FaArrowRight className="w-3.5 h-3.5" /></>
              )}
            </button>

            <div className="flex gap-2">
              <button
                onClick={handleViewCart}
                className="flex-1 py-2 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition text-sm font-medium"
              >
                View Cart
              </button>
              <button
                onClick={clearCart}
                disabled={updatingItems.size > 0}
                className="flex-1 py-2 border border-gray-200 text-red-500 rounded-xl hover:bg-red-50 transition text-sm font-medium disabled:opacity-50"
              >
                Clear Cart
              </button>
            </div>
          </div>
        )}

        {/* Wishlist Footer */}
        {activeMenu === 'wishlist' && isLoggedIn && wishlistCount > 0 && (
          <div className="flex-shrink-0 border-t border-gray-100 bg-white p-4 space-y-2.5">
            <button
              onClick={handleMoveAllToCart}
              className="w-full py-3 bg-green-700 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-green-600 active:scale-[0.98] transition shadow-lg shadow-green-200"
            >
              <FaExchangeAlt className="w-4 h-4" />
              Move All to Cart
            </button>
            <button
              onClick={handleViewWishlist}
              className="w-full py-2.5 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition text-sm font-medium"
            >
              View Full Wishlist
            </button>
          </div>
        )}
      </div>
    </>
  );
}
