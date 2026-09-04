// app/cart/page.tsx
"use client";

import SafeImage from '@/components/SafeImage';
import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { FaTrash, FaShoppingCart, FaShieldAlt, FaTruck, FaArrowLeft, FaExclamationTriangle } from 'react-icons/fa';
import { useCart } from '@/context/CartContext';
import { useCartStockValidation } from '@/lib/stockValidation';

function CartContent() {
  const { cartItems, updateQuantity, removeFromCart, getCartTotal, getCartCount, isCartLoading } = useCart();
  const { isValidating, warnings, validate } = useCartStockValidation();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  // Run stock validation once the cart has finished loading
  useEffect(() => {
    if (!mounted || isCartLoading || cartItems.length === 0) return;
    validate(cartItems, removeFromCart, updateQuantity);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mounted, isCartLoading]);

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

      {/* pb-24 on mobile clears the fixed BottomNav; sm:pb-12 on larger screens */}
      <div className="max-w-[1600px] mx-auto px-[4%] pb-24 sm:pb-12">

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

              {/* Mobile: show validation warning at the top of the items column
                  so it's immediately visible without scrolling to the summary */}
              {warnings.size > 0 && (
                <div className="sm:hidden rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-800 flex items-center gap-2">
                  <FaExclamationTriangle className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
                  Some items were updated due to stock changes. Please review before checking out.
                </div>
              )}

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
              <div className="relative bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">

                {/* Validation overlay — spins while check-stock is in flight */}
                {isValidating && (
                  <div className="absolute inset-0 z-10 bg-white/70 flex items-center justify-center rounded-xl">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <svg className="animate-spin w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Checking stock…
                    </div>
                  </div>
                )}

                <div className="divide-y divide-gray-50">
                  {cartItems.map((item) => {
                    const key = `${item.id}-${item.size}`;
                    const warning = warnings.get(key);

                    return (
                      <div key={key} className={`p-4 sm:p-5 hover:bg-gray-50/50 transition ${warning ? 'bg-amber-50/40' : ''}`}>
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

                                {/* ── Inline stock warning ── */}
                                {warning && (
                                  <div className="flex items-center gap-1 mt-1">
                                    <FaExclamationTriangle className="w-3 h-3 text-amber-500 flex-shrink-0" />
                                    <span className="text-xs text-amber-700 font-medium">{warning.message}</span>
                                  </div>
                                )}
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
                    );
                  })}
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
                    <span className="flex items-center gap-1.5">
                      <FaTruck className="w-3 h-3 text-gray-400" />
                      Shipping
                    </span>
                    {getCartTotal() >= 5000 ? (
                      <span className="font-medium text-green-600">FREE</span>
                    ) : (
                      <span className="text-right">
                        <span className="font-medium text-gray-900">PKR {shipping}</span>
                        <span className="block text-[11px] text-gray-400 leading-tight">est. · final at checkout</span>
                      </span>
                    )}
                  </div>
                  <div className="border-t border-gray-100 pt-3 flex justify-between">
                    <span className="font-bold text-gray-900">Estimated Total</span>
                    <span className="font-bold text-gray-900 text-base">PKR {total.toLocaleString()}</span>
                  </div>
                </div>

                {/* Checkout CTA — disabled while validation is running */}
                {warnings.size > 0 ? (
                  <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-800 text-center">
                    <FaExclamationTriangle className="inline w-3 h-3 mr-1 text-amber-500" />
                    Some items were updated. Please review before checking out.
                  </div>
                ) : (
                  <Link
                    href="/checkout"
                    aria-disabled={isValidating}
                    className={`mt-4 flex items-center justify-center w-full bg-green-700 text-white py-3 rounded-full text-sm font-bold transition shadow-sm hover:shadow-md ${
                      isValidating ? 'opacity-50 pointer-events-none' : 'hover:bg-green-600'
                    }`}
                  >
                    {isValidating ? 'Checking stock…' : 'Proceed to Checkout →'}
                  </Link>
                )}

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
