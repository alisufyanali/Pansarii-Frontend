// app/cart/page.tsx
"use client";

import SafeImage from '@/components/SafeImage';
import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { FaTrash, FaShoppingCart, FaHeart, FaTag, FaShieldAlt, FaTruck, FaArrowLeft } from 'react-icons/fa';
import { useCart } from '@/context/CartContext';

function CartContent() {
  const { cartItems, updateQuantity, removeFromCart, getCartTotal, getCartCount, isCartLoading } = useCart();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  const shipping = getCartTotal() > 5000 ? 0 : 200;
  const total = getCartTotal() + shipping;

  // Show skeleton while waiting for mount OR API cart sync
  if (!mounted || isCartLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-[1600px] mx-auto px-[4%] py-3">
            <div className="h-4 w-48 bg-gray-200 rounded animate-pulse" />
          </div>
        </div>
        <div className="max-w-[1600px] mx-auto px-[4%] pt-6 pb-2">
          <div className="h-7 w-40 bg-gray-200 rounded animate-pulse" />
        </div>
        <div className="max-w-[1600px] mx-auto px-[4%] pb-12">
          <div className="mt-4 grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6">
            <div className="flex flex-col gap-3">
              <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden animate-pulse">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="p-4 sm:p-5 border-b border-gray-50 flex gap-3">
                    <div className="w-[72px] h-[72px] bg-gray-200 rounded-lg flex-shrink-0" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-3/4" />
                      <div className="h-3 bg-gray-200 rounded w-1/2" />
                      <div className="h-3 bg-gray-200 rounded w-1/3" />
                      <div className="flex justify-between mt-3">
                        <div className="h-8 w-24 bg-gray-200 rounded-lg" />
                        <div className="h-4 w-20 bg-gray-200 rounded" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 animate-pulse h-fit">
              <div className="h-5 w-32 bg-gray-200 rounded mb-4" />
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex justify-between">
                    <div className="h-4 w-24 bg-gray-200 rounded" />
                    <div className="h-4 w-20 bg-gray-200 rounded" />
                  </div>
                ))}
              </div>
              <div className="h-10 w-full bg-gray-200 rounded-full mt-6" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-[1600px] mx-auto px-[4%] py-3">
          <p className="text-xs text-gray-500">
            <Link href="/" className="hover:text-green-700 transition">Home</Link>
            <span className="mx-1.5 text-gray-300">/</span>
            <span className="text-gray-800 font-medium">Shopping Cart</span>
          </p>
        </div>
      </div>

      {/* Page title */}
      <div className="max-w-[1600px] mx-auto px-[4%] pt-6 pb-2">
        <h1 className="text-xl font-bold text-gray-900">
          Shopping Cart
          {cartItems.length > 0 && (
            <span className="ml-2 text-sm font-normal text-gray-400">({getCartCount()} items)</span>
          )}
        </h1>
      </div>

      <div className="max-w-[1600px] mx-auto px-[4%] pb-12">

        {/* ── EMPTY STATE ── */}
        {cartItems.length === 0 ? (
          <div className="mt-6 bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center max-w-lg mx-auto">
            <FaShoppingCart className="w-16 h-16 mx-auto text-gray-200 mb-5" />
            <h2 className="text-lg font-bold text-gray-900 mb-2">Your cart is empty</h2>
            <p className="text-sm text-gray-500 mb-6">Looks like you haven&apos;t added anything yet.</p>
            <Link href="/shop"
              className="inline-block bg-green-700 text-white px-8 py-2.5 rounded-full text-sm font-semibold hover:bg-green-600 transition">
              Browse Products
            </Link>
          </div>
        ) : (

          /* ── MAIN LAYOUT ── */
          <div className="mt-4 grid grid-cols-1 lg:grid-cols-[1fr_360px] xl:grid-cols-[1fr_400px] 2xl:grid-cols-[1fr_440px] gap-6">

            {/* ── LEFT: Cart items ── */}
            <div className="flex flex-col gap-3">

              {/* Free shipping progress bar */}
              {getCartTotal() < 5000 && (
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm px-5 py-3.5">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2 text-xs text-gray-600">
                      <FaTruck className="w-3.5 h-3.5 text-green-600" />
                      <span>Add <span className="font-semibold text-gray-900">PKR {(5000 - getCartTotal()).toLocaleString()}</span> more for free shipping</span>
                    </div>
                    <span className="text-xs text-gray-400">{Math.round((getCartTotal() / 5000) * 100)}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-green-600 rounded-full transition-all duration-500"
                      style={{ width: `${Math.min((getCartTotal() / 5000) * 100, 100)}%` }}
                    />
                  </div>
                </div>
              )}
              {getCartTotal() >= 5000 && (
                <div className="bg-green-50 border border-green-100 rounded-xl px-5 py-3 flex items-center gap-2">
                  <FaTruck className="w-3.5 h-3.5 text-green-600 flex-shrink-0" />
                <span className="text-xs font-medium text-green-700">You&apos;ve unlocked free shipping!</span>
                </div>
              )}

              {/* Items card */}
              <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="divide-y divide-gray-50">
                  {cartItems.map((item) => (
                    <div key={`${item.id}-${item.size}`} className="p-4 sm:p-5 hover:bg-gray-50/50 transition">
                      <div className="flex gap-3 sm:gap-4">

                        {/* Product image */}
                        <div className="w-18 h-18 sm:w-24 sm:h-24 flex-shrink-0 rounded-lg overflow-hidden border border-gray-100 bg-gray-50 relative"
                          style={{ width: '72px', height: '72px' }}>
                          <SafeImage
                            src={item.img}
                            alt={item.nameEn}
                            fill
                            className="object-cover"
                            sizes="72px"
                          />
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0">
                              <h3 className="text-sm font-semibold text-gray-900 truncate">{item.nameEn}</h3>
                              <p className="text-xs text-gray-400 mt-0.5">{item.nameUr}</p>
                              <p className="text-xs text-gray-400 mt-0.5">Size: <span className="text-gray-600">{item.size}</span></p>
                            </div>
                            {/* Action buttons */}
                            <div className="flex items-center gap-1 flex-shrink-0">
                              <button onClick={() => removeFromCart(item.id, item.size)}
                                className="p-1.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition" title="Remove">
                                <FaTrash className="w-3.5 h-3.5" />
                              </button>
                              
                            </div>
                          </div>

                          {/* Quantity + price row */}
                          <div className="flex items-center justify-between mt-3">
                            <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                              <button
                                onClick={() => {
                                  if (item.quantity <= 1) removeFromCart(item.id, item.size);
                                  else updateQuantity(item.id, item.size, item.quantity - 1);
                                }}
                                className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 transition text-gray-600 text-sm">−</button>
                              <span className="w-8 h-8 flex items-center justify-center border-x border-gray-200 text-sm font-semibold text-gray-900">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => updateQuantity(item.id, item.size, item.quantity + 1)}
                                className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 transition text-gray-600 text-sm">+</button>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-bold text-gray-900">PKR {(item.price * item.quantity).toLocaleString()}</p>
                              {item.quantity > 1 && (
                                <p className="text-[11px] text-gray-400">PKR {item.price.toLocaleString()} each</p>
                              )}
                            </div>
                          </div>
                        </div>

                      </div>
                    </div>
                  ))}
                </div>

                {/* Continue shopping */}
                <div className="px-5 py-3.5 border-t border-gray-50">
                  <Link href="/shop"
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-green-700 hover:text-green-600 transition">
                    <FaArrowLeft className="w-3 h-3" />
                    Continue Shopping
                  </Link>
                </div>
              </div>
            </div>

            {/* ── RIGHT: Order summary ── */}
            <div className="lg:sticky lg:top-[144px] h-fit flex flex-col gap-3">

              {/* Summary card */}
              <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
                <h2 className="text-sm font-bold text-gray-900 mb-4">Order Summary</h2>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal ({getCartCount()} items)</span>
                    <span className="font-medium text-gray-900">PKR {getCartTotal().toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <span className={`font-medium ${shipping === 0 ? 'text-green-600' : 'text-gray-900'}`}>
                      {shipping === 0 ? 'FREE' : `PKR ${shipping}`}
                    </span>
                  </div>
                  <div className="border-t border-gray-100 pt-3 flex justify-between">
                    <span className="font-bold text-gray-900">Total</span>
                    <span className="font-bold text-gray-900 text-base">PKR {total.toLocaleString()}</span>
                  </div>
                </div>

                {/* Promo code
                <div className="mt-4">
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <FaTag className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-300" />
                      <input type="text" value={promoCode} onChange={e => setPromoCode(e.target.value)}
                        placeholder="Promo code"
                        className="w-full pl-8 pr-3 py-2.5 border border-gray-200 rounded-lg text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-700/20 focus:border-green-600 transition" />
                    </div>
                    <button className="px-4 py-2.5 border border-green-700 text-green-700 rounded-lg text-xs font-semibold hover:bg-green-50 transition whitespace-nowrap">
                      Apply
                    </button>
                  </div>
                </div> */}

                {/* Checkout CTA */}
                <Link href="/checkout"
                  className="mt-4 flex items-center justify-center w-full bg-green-700 text-white py-3 rounded-full text-sm font-bold hover:bg-green-600 transition shadow-sm hover:shadow-md">
                  Proceed to Checkout →
                </Link>

                {/* Trust badges */}
                <div className="mt-4 flex items-center justify-center gap-1.5 text-xs text-gray-400">
                  <FaShieldAlt className="w-3 h-3 text-green-500" />
                  <span>Secure &amp; encrypted checkout</span>
                </div>
              </div>

              {/* Accepted payments note */}
              <div className="bg-white rounded-xl border border-gray-100 shadow-sm px-5 py-3.5 text-center">
                <p className="text-[11px] text-gray-400">Cash on Delivery · Bank Transfer · JazzCash · Easypaisa</p>
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
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-[1600px] mx-auto px-[4%] pt-6 pb-12">
          <div className="h-7 w-40 bg-gray-200 rounded animate-pulse mb-6" />
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6">
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden animate-pulse">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="p-5 border-b border-gray-50 flex gap-3">
                  <div className="w-[72px] h-[72px] bg-gray-200 rounded-lg flex-shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4" />
                    <div className="h-3 bg-gray-200 rounded w-1/2" />
                    <div className="h-8 w-24 bg-gray-200 rounded-lg mt-3" />
                  </div>
                </div>
              ))}
            </div>
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 animate-pulse h-fit">
              <div className="h-5 w-32 bg-gray-200 rounded mb-4" />
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex justify-between mb-3">
                  <div className="h-4 w-24 bg-gray-200 rounded" />
                  <div className="h-4 w-20 bg-gray-200 rounded" />
                </div>
              ))}
              <div className="h-10 w-full bg-gray-200 rounded-full mt-4" />
            </div>
          </div>
        </div>
      </div>
    }>
      <CartContent />
    </Suspense>
  );
}
