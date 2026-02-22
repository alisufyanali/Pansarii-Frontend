// app/cart/page.tsx
"use client";

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { FaTrash, FaShoppingCart, FaHeart } from 'react-icons/fa';
import { useCart } from '../context/CartContext';

function CartContent() {
  const { cartItems, updateQuantity, removeFromCart, getCartTotal, getCartCount } = useCart();
  const [mounted, setMounted] = useState(false);

  // Wait for component to mount before rendering cart - exact same as original
  useEffect(() => {
    setMounted(true);
  }, []);

  const shipping = getCartTotal() > 5000 ? 0 : 200;
  const total = getCartTotal() + shipping;

  // Show loading state until mounted - exact same as original
  if (!mounted) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-700 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading cart...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="mx-[4%] py-4">
          <p className="text-xs sm:text-sm text-gray-600">
            <Link href="/" className="hover:text-green-700">Home</Link>
            {' '}/{' '}
            <span className="text-gray-900 font-medium">Shopping Cart</span>
          </p>
        </div>
      </div>

      <div className="mx-[2%] sm:mx-[4%] py-5 sm:py-8">
        {cartItems.length === 0 ? (
          // Empty Cart
          <div className="bg-white rounded-xl shadow-sm p-8 sm:p-12 text-center border border-gray-200">
            <FaShoppingCart className="w-16 h-16 sm:w-24 sm:h-24 mx-auto text-gray-300 mb-6" />
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">Your cart is empty</h2>
            <p className="text-gray-600 mb-6 text-sm sm:text-base">Add some products to get started!</p>
            <Link 
              href="/shop"
              className="inline-block bg-green-700 text-white px-6 sm:px-8 py-3 rounded-full font-semibold hover:bg-green-600 transition"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 sm:gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                {/* Header */}
                <div className="border-b px-4 sm:px-6 py-4">
                  <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                    Shopping Cart ({getCartCount()} items)
                  </h1>
                </div>

                {/* Items */}
                <div className="divide-y">
                  {cartItems.map((item) => (
                    <div key={`${item.id}-${item.size}`} className="p-4 sm:p-6 hover:bg-gray-50 transition">
                      <div className="flex gap-3 sm:gap-6">
                        {/* Image */}
                        <div className="w-20 h-20 sm:w-28 sm:h-28 flex-shrink-0">
                          <img 
                            src={item.img}
                            alt={item.nameEn}
                            className="w-full h-full object-cover rounded-lg border border-gray-200"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = '/images/product.png';
                            }}
                          />
                        </div>

                        {/* Details */}
                        <div className="flex-1 flex flex-col justify-between min-w-0">
                          <div>
                            <h3 className="text-sm sm:text-lg font-semibold text-gray-900 mb-1 truncate">
                              {item.nameEn}
                            </h3>
                            <p className="text-xs sm:text-sm text-gray-600 mb-1">{item.nameUr}</p>
                            <p className="text-xs sm:text-sm text-gray-500">Size: {item.size}</p>
                          </div>

                          <div className="flex flex-col sm:flex-row sm:items-center justify-between mt-3 sm:mt-4 gap-3 sm:gap-0">
                            {/* Quantity */}
                            <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden w-fit">
                              <button
                                onClick={() => updateQuantity(item.id, item.size, -1)}
                                className="px-3 sm:px-4 py-1.5 sm:py-2 hover:bg-gray-100 transition text-gray-700 text-sm sm:text-base"
                                disabled={item.quantity === 1}
                              >
                                −
                              </button>
                              <span className="px-4 sm:px-6 py-1.5 sm:py-2 border-x border-gray-300 font-semibold min-w-[48px] sm:min-w-[60px] text-center text-gray-900 text-sm sm:text-base">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => updateQuantity(item.id, item.size, 1)}
                                className="px-3 sm:px-4 py-1.5 sm:py-2 hover:bg-gray-100 transition text-gray-700 text-sm sm:text-base"
                              >
                                +
                              </button>
                            </div>

                            {/* Price */}
                            <div className="text-left sm:text-right">
                              <p className="text-lg sm:text-xl font-bold text-gray-900">
                                PKR {(item.price * item.quantity).toLocaleString()}
                              </p>
                              <p className="text-xs sm:text-sm text-gray-500">
                                PKR {item.price.toLocaleString()} each
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col gap-2 sm:gap-3">
                          <button
                            onClick={() => removeFromCart(item.id, item.size)}
                            className="p-1.5 sm:p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                            title="Remove"
                          >
                            <FaTrash className="w-4 h-4 sm:w-5 sm:h-5" />
                          </button>
                          <button
                            className="p-1.5 sm:p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition"
                            title="Move to Wishlist"
                          >
                            <FaHeart className="w-4 h-4 sm:w-5 sm:h-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Continue Shopping */}
                <div className="p-4 sm:p-6 border-t">
                  <Link 
                    href="/shop"
                    className="inline-flex items-center text-green-700 font-semibold hover:text-green-600 transition text-sm sm:text-base"
                  >
                    ← Continue Shopping
                  </Link>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 lg:sticky lg:top-24">
                <div className="p-4 sm:p-6">
                  <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-6">Order Summary</h2>

                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between text-gray-600 text-sm sm:text-base">
                      <span>Subtotal</span>
                      <span className="font-semibold">PKR {getCartTotal().toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-gray-600 text-sm sm:text-base">
                      <span>Shipping</span>
                      <span className="font-semibold">
                        {shipping === 0 ? 'FREE' : `PKR ${shipping}`}
                      </span>
                    </div>
                    {shipping > 0 && getCartTotal() < 5000 && (
                      <p className="text-xs sm:text-sm text-amber-600 bg-amber-50 p-3 rounded-lg">
                        Add PKR {(5000 - getCartTotal()).toLocaleString()} more for free shipping!
                      </p>
                    )}
                    <div className="border-t pt-4">
                      <div className="flex justify-between text-lg sm:text-xl font-bold text-gray-900">
                        <span>Total</span>
                        <span>PKR {total.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  {/* Promo Code */}
                  <div className="mb-6">
                    <input
                      type="text"
                      placeholder="Enter promo code"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-700 mb-3 text-gray-900 text-sm sm:text-base"
                    />
                    <button className="w-full py-3 border border-green-700 text-green-700 rounded-lg font-semibold hover:bg-green-50 transition text-sm sm:text-base">
                      Apply Code
                    </button>
                  </div>

                  {/* Checkout Button */}
                  <Link 
                    href="/checkout"
                    className="block w-full bg-green-700 text-white text-center py-3 sm:py-4 rounded-full font-bold text-base sm:text-lg hover:bg-green-600 transition shadow-lg hover:shadow-xl"
                  >
                    Proceed to Checkout
                  </Link>

                  {/* Security Badge */}
                  <div className="mt-6 text-center">
                    <p className="text-xs sm:text-sm text-gray-500 flex items-center justify-center gap-2">
                      <svg className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      Secure Checkout
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function CartPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-700 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading cart...</p>
        </div>
      </div>
    }>
      <CartContent />
    </Suspense>
  );
}