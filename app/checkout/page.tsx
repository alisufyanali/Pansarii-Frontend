"use client";

import Image from 'next/image';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import { FaLock, FaCreditCard, FaCheckCircle, FaChevronDown, FaShieldAlt, FaTruck, FaTag, FaMoneyBillWave, FaUniversity } from 'react-icons/fa';
import { useCart } from '../context/CartContext';

export default function CheckoutPage() {
  const router = useRouter();
  const { cartItems, getCartTotal, clearCart } = useCart();
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [phoneValue, setPhoneValue] = useState<string>('');
  const [selectedCity, setSelectedCity] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoType, setPromoType] = useState<string | null>(null);
  const [discount, setDiscount] = useState(0);
  const [promoError, setPromoError] = useState('');
  const [promoLoading, setPromoLoading] = useState(false);
  const [promoSuccessMsg, setPromoSuccessMsg] = useState('');

  const pakistaniCities = [
    { value: 'lahore',       label: 'Lahore',       province: 'Punjab' },
    { value: 'faisalabad',   label: 'Faisalabad',   province: 'Punjab' },
    { value: 'rawalpindi',   label: 'Rawalpindi',   province: 'Punjab' },
    { value: 'multan',       label: 'Multan',       province: 'Punjab' },
    { value: 'gujranwala',   label: 'Gujranwala',   province: 'Punjab' },
    { value: 'sialkot',      label: 'Sialkot',      province: 'Punjab' },
    { value: 'bahawalpur',   label: 'Bahawalpur',   province: 'Punjab' },
    { value: 'sargodha',     label: 'Sargodha',     province: 'Punjab' },
    { value: 'karachi',      label: 'Karachi',      province: 'Sindh'  },
    { value: 'hyderabad',    label: 'Hyderabad',    province: 'Sindh'  },
    { value: 'sukkur',       label: 'Sukkur',       province: 'Sindh'  },
    { value: 'larkana',      label: 'Larkana',      province: 'Sindh'  },
    { value: 'navabshah',    label: 'Nawabshah',    province: 'Sindh'  },
    { value: 'peshawar',     label: 'Peshawar',     province: 'KPK'    },
    { value: 'mardan',       label: 'Mardan',       province: 'KPK'    },
    { value: 'abbottabad',   label: 'Abbottabad',   province: 'KPK'    },
    { value: 'swat',         label: 'Swat',         province: 'KPK'    },
    { value: 'nowshera',     label: 'Nowshera',     province: 'KPK'    },
    { value: 'quetta',       label: 'Quetta',       province: 'Balochistan' },
    { value: 'gwadar',       label: 'Gwadar',       province: 'Balochistan' },
    { value: 'turbat',       label: 'Turbat',       province: 'Balochistan' },
    { value: 'islamabad',    label: 'Islamabad',    province: 'ICT'    },
    { value: 'muzaffarabad', label: 'Muzaffarabad', province: 'AJK'    },
    { value: 'mirpur',       label: 'Mirpur',       province: 'AJK'    },
  ];

  const subtotal = getCartTotal();
  const shipping = subtotal > 5000 ? 0 : 200;
  const total = subtotal + shipping - discount;

  // Type guard for promo API response
  interface PromoResponse {
    valid: boolean;
    type: string | null;
    value: number;
    message: string;
  }

  function isPromoResponse(data: unknown): data is PromoResponse {
    return (
      typeof data === 'object' &&
      data !== null &&
      'valid' in data &&
      'type' in data &&
      'value' in data &&
      'message' in data
    );
  }

  const handleApplyPromo = async () => {
    if (!promoCode.trim()) return;
    setPromoLoading(true);
    setPromoError('');
    try {
      const res = await fetch('/api/validate-promo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: promoCode, subtotal }),
      });
      const data: unknown = await res.json();
      
      if (!isPromoResponse(data)) {
        setPromoError('Invalid response from server');
        return;
      }

      if (data.valid) {
        // For freeship type, discount the shipping cost instead of subtotal
        const discountValue = data.type === 'freeship' ? shipping : data.value;
        setDiscount(discountValue);
        setPromoType(data.type);
        setPromoApplied(true);
        setPromoError('');
        setPromoSuccessMsg(data.message);
      } else {
        setPromoError(data.message);
        setPromoApplied(false);
        setPromoType(null);
        setDiscount(0);
      }
    } catch {
      setPromoError('Could not validate promo code. Please try again.');
    } finally {
      setPromoLoading(false);
    }
  };

  const handleRemovePromo = () => {
    setPromoCode('');
    setPromoApplied(false);
    setPromoType(null);
    setDiscount(0);
    setPromoError('');
    setPromoSuccessMsg('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const form = e.target as HTMLFormElement;
    const data = new FormData(form);
    const orderId = `ORD-${Date.now().toString().slice(-8)}`;
    const orderData = {
      orderId,
      orderDate: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
      estimatedDelivery: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
      items: cartItems,
      subtotal,
      shipping,
      discount,
      total: total,
      promoApplied: promoApplied ? promoCode : null,
      shippingAddress: {
        name: data.get('name') as string,
        phone: phoneValue,
        email: data.get('email') as string,
        address: data.get('address') as string,
        city: selectedCity,
        area: data.get('area') as string,
        postalCode: data.get('area') as string,
      },
      paymentMethod: paymentMethod === 'cod' ? 'Cash on Delivery' : paymentMethod === 'online' ? 'Online Payment' : 'Bank Transfer',
    };
    localStorage.setItem(`order-${orderId}`, JSON.stringify(orderData));
    await new Promise(r => setTimeout(r, 1500));
    clearCart();
    router.push(`/order-confirmation?orderId=${orderId}`);
  };

  // ── Shared input class ──────────────────────────────────────────────────────
  const inputCls = "w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-700/20 focus:border-green-600 transition bg-white";
  const labelCls = "block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide";

  // ── Empty cart state ────────────────────────────────────────────────────────
  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center max-w-sm">
          <div className="text-6xl mb-4">🛒</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
          <p className="text-gray-500 mb-6 text-sm">Add some products to your cart before checking out.</p>
          <Link
            href="/shop"
            className="inline-block px-8 py-3 bg-green-700 text-white font-semibold rounded-full hover:bg-green-600 transition"
          >
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Phone input global styles */}
      <style jsx global>{`
        .PhoneInput { width: 100%; display: flex; align-items: center; gap: 8px; }
        .PhoneInputInput { flex: 1; padding: 0.625rem 0.75rem; border: 1px solid #e5e7eb; border-radius: 0.5rem; font-size: 0.875rem; outline: none; transition: all 0.2s; background: white; color: #111827; }
        .PhoneInputInput:focus { border-color: #15803d; box-shadow: 0 0 0 2px rgba(21,128,61,0.12); }
        .PhoneInputCountry { padding: 0.625rem 0.75rem; border: 1px solid #e5e7eb; border-radius: 0.5rem; background: white; cursor: pointer; display: flex; align-items: center; gap: 4px; }
        .PhoneInputCountryIcon { width: 1.25rem; height: 1.25rem; }
        .PhoneInputCountrySelectArrow { opacity: 0.5; font-size: 0.625rem; }
        .PhoneInputCountrySelect { position: absolute; top: 0; left: 0; width: 100%; height: 100%; opacity: 0; cursor: pointer; }
      `}</style>

      {/* ── TOP HEADER ── */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-[1600px] mx-auto px-[4%] py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-lg font-bold text-gray-900">Checkout</h1>
            <div className="flex items-center gap-1.5 text-green-700">
              <FaLock className="w-3.5 h-3.5" />
              <span className="text-xs font-semibold">Secure Checkout</span>
            </div>
          </div>

          {/* Progress steps */}
          <div className="flex items-center gap-2 mt-4">
            {[
              { label: 'Cart',     step: 1, done: true  },
              { label: 'Checkout', step: 2, done: false, active: true },
              { label: 'Complete', step: 3, done: false },
            ].map((s, i, arr) => (
              <div key={s.label} className="flex items-center gap-2">
                <div className="flex items-center gap-1.5">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                    s.done || s.active ? 'bg-green-700 text-white' : 'bg-gray-200 text-gray-500'
                  }`}>
                    {s.done ? <FaCheckCircle className="w-3.5 h-3.5" /> : s.step}
                  </div>
                  <span className={`text-xs font-medium ${s.done || s.active ? 'text-gray-900' : 'text-gray-400'}`}>
                    {s.label}
                  </span>
                </div>
                {i < arr.length - 1 && (
                  <div className={`w-8 h-0.5 ${s.done ? 'bg-green-700' : 'bg-gray-200'}`} />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── MAIN FORM ── */}
      <form onSubmit={handleSubmit}>
        <div className="max-w-[1600px] mx-auto px-[4%] py-6">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] xl:grid-cols-[1fr_400px] 2xl:grid-cols-[1fr_440px] gap-5">

            {/* ── LEFT: Forms ── */}
            <div className="flex flex-col gap-4">

              {/* Contact Information */}
              <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
                <h2 className="text-sm font-bold text-gray-900 mb-4">Contact Information</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className={labelCls}>Full Name *</label>
                    <input name="name" type="text" required className={inputCls} placeholder="Ahmed Khan" />
                  </div>
                  <div>
                    <label className={labelCls}>Email Address *</label>
                    <input name="email" type="email" required className={inputCls} placeholder="ahmed@example.com" />
                  </div>
                  <div>
                    <label className={labelCls}>Phone Number *</label>
                    <PhoneInput international defaultCountry="PK"
                      value={phoneValue} onChange={v => setPhoneValue(v || '')}
                      placeholder="Enter phone number" />
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
                <h2 className="text-sm font-bold text-gray-900 mb-4">Shipping Address</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className={labelCls}>Street Address *</label>
                    <input name="address" type="text" required className={inputCls}
                      placeholder="House/Flat no, Street name, Area" />
                  </div>

                  {/* City */}
                  <div>
                    <label className={labelCls}>City *</label>
                    <div className="relative">
                      <select name="city" value={selectedCity}
                        onChange={e => setSelectedCity(e.target.value)}
                        required
                        className={`${inputCls} appearance-none pr-8`}>
                        <option value="">Select your city</option>
                        {[
                          { label: 'Punjab',             filter: (c: { province: string }) => c.province === 'Punjab' },
                          { label: 'Sindh',              filter: (c: { province: string }) => c.province === 'Sindh'  },
                          { label: 'Khyber Pakhtunkhwa', filter: (c: { province: string }) => c.province === 'KPK'    },
                          { label: 'Balochistan',        filter: (c: { province: string }) => c.province === 'Balochistan' },
                          { label: 'Other',              filter: (c: { province: string }) => c.province === 'ICT' || c.province === 'AJK' },
                        ].map(g => (
                          <optgroup key={g.label} label={g.label}>
                            {pakistaniCities.filter(g.filter).map(c => (
                              <option key={c.value} value={c.value}>{c.label}</option>
                            ))}
                          </optgroup>
                        ))}
                      </select>
                      <FaChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-400" />
                    </div>
                  </div>

                  {/* Area */}
                  <div>
                    <label className={labelCls}>Area / Sector</label>
                    <input name="area" type="text" className={inputCls} placeholder="Gulshan, DHA, etc." />
                  </div>

                  {/* Delivery instructions */}
                  <div className="sm:col-span-2">
                    <label className={labelCls}>Delivery Instructions <span className="normal-case font-normal text-gray-400">(optional)</span></label>
                    <textarea name="instructions" rows={2}
                      className={`${inputCls} resize-none`}
                      placeholder="e.g., Call before delivery, leave at reception…" />
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
                <h2 className="text-sm font-bold text-gray-900 mb-4">Payment Method</h2>
                <div className="flex flex-col gap-2.5">
                  {[
                    { value: 'cod',    icon: 'cod',  label: 'Cash on Delivery',   sub: 'Pay when you receive'                        },
                    { value: 'online', icon: null,   label: 'Online Payment',     sub: 'Credit/Debit Card · JazzCash · EasyPaisa'   },
                    { value: 'bank',   icon: 'bank', label: 'Bank Transfer',      sub: 'Direct bank deposit'                         },
                  ].map(opt => (
                    <label key={opt.value}
                      className={`flex items-center gap-3 p-3.5 border rounded-xl cursor-pointer transition ${
                        paymentMethod === opt.value
                          ? 'border-green-600 bg-green-50'
                          : 'border-gray-200 hover:border-gray-300 bg-white'
                      }`}>
                      <input type="radio" name="payment" value={opt.value}
                        checked={paymentMethod === opt.value}
                        onChange={e => setPaymentMethod(e.target.value)}
                        className="w-4 h-4 accent-green-700 flex-shrink-0" />
                      <div className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0 text-base">
                        {opt.icon === 'cod' ? <FaMoneyBillWave className="text-green-600" /> : opt.icon === 'bank' ? <FaUniversity className="text-blue-600" /> : <FaCreditCard className="text-gray-500" />}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{opt.label}</p>
                        <p className="text-xs text-gray-400">{opt.sub}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* ── RIGHT: Order summary ── */}
            <div className="lg:sticky lg:top-[144px] h-fit flex flex-col gap-3">

              <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
                <h2 className="text-sm font-bold text-gray-900 mb-4">Order Summary</h2>

                {/* Items */}
                <div className="flex flex-col gap-3 pb-4 border-b border-gray-100">
                  {cartItems.map(item => (
                    <div key={`${item.id}-${item.size}`} className="flex gap-3">
                      <div className="relative w-12 h-12 flex-shrink-0 rounded-lg overflow-hidden border border-gray-100 bg-gray-50">
                        <Image
                          src={item.img}
                          alt={item.nameEn}
                          fill
                          className="object-cover"
                          sizes="48px"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-gray-900 truncate">{item.nameEn}</p>
                        <p className="text-[11px] text-gray-400">{item.size} · Qty {item.quantity}</p>
                      </div>
                      <p className="text-xs font-bold text-gray-900 flex-shrink-0">
                        PKR {(item.price * item.quantity).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Promo Code Section */}
                <div className="py-4 border-b border-gray-100">
                  <label className="block text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wide">
                    Promo Code
                  </label>
                  <div className="flex gap-2">
                    <div className="flex-1 relative">
                      <FaTag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value)}
                        placeholder="Enter promo code"
                        disabled={promoApplied}
                        className={`${inputCls} pl-9`}
                      />
                    </div>
                    {!promoApplied ? (
                      <button
                        type="button"
                        onClick={handleApplyPromo}
                        disabled={!promoCode.trim() || promoLoading}
                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {promoLoading ? 'Checking…' : 'Apply'}
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={handleRemovePromo}
                        className="px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition font-medium text-sm"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                  {promoError && (
                    <p className="text-xs text-red-500 mt-2">{promoError}</p>
                  )}
                  {promoApplied && promoSuccessMsg && (
                    <p className="text-xs text-green-600 mt-2">✓ {promoSuccessMsg}</p>
                  )}
                </div>

                {/* Price breakdown */}
                <div className="flex flex-col gap-2.5 py-4 border-b border-gray-100 text-sm">
                  <div className="flex justify-between text-gray-500">
                    <span>Subtotal</span>
                    <span className="font-medium text-gray-900">PKR {subtotal.toLocaleString()}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount</span>
                      <span className="font-medium">- PKR {discount.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-gray-500">
                    <span className="flex items-center gap-1">
                      <FaTruck className="w-3 h-3" /> Shipping
                    </span>
                    <span className="font-medium text-gray-900">
                      {shipping === 0 || promoType === 'freeship' ? 'FREE' : `PKR ${shipping}`}
                    </span>
                  </div>
                </div>

                <div className="flex justify-between pt-3.5 mb-4">
                  <span className="text-sm font-bold text-gray-900">Total</span>
                  <span className="text-base font-bold text-gray-900">
                    PKR {total.toLocaleString()}
                  </span>
                </div>

                {/* Submit */}
                <button type="submit" disabled={isSubmitting}
                  className={`w-full py-3 rounded-full text-sm font-bold text-white transition shadow-sm ${
                    isSubmitting ? 'bg-green-600 opacity-70 cursor-not-allowed' : 'bg-green-700 hover:bg-green-600 hover:shadow-md'
                  }`}>
                  {isSubmitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Processing…
                    </span>
                  ) : 'Place Order'}
                </button>

                <div className="mt-3 flex items-center justify-center gap-1.5 text-[11px] text-gray-400">
                  <FaShieldAlt className="w-3 h-3 text-green-500" />
                  Secure &amp; encrypted · By placing you agree to our terms
                </div>
              </div>

              {/* Payment methods note */}
              <div className="bg-white rounded-xl border border-gray-100 shadow-sm px-5 py-3 text-center">
                <p className="text-[11px] text-gray-400">Cash on Delivery · Bank Transfer · JazzCash · Easypaisa</p>
              </div>

            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
