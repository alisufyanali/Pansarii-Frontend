"use client";

import Image from 'next/image';
import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import {
  FaLock, FaCreditCard, FaCheckCircle,
  FaShieldAlt, FaTruck, FaTag, FaMoneyBillWave, FaUniversity,
} from 'react-icons/fa';
import { toast } from 'react-toastify';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { createOrder, createGuestOrder } from '@/lib/orders';
import { validateCoupon, type CouponResult } from '@/lib/coupons';
import { getCities, DEFAULT_SHIPPING, type City } from '@/lib/cities';
import { useCartStockValidation } from '@/lib/stockValidation';
import { normalizePkPhone, PAK_PHONE_ERROR } from '@/lib/phone';
import { isValidEmail } from '@/lib/validation';

type CheckoutMode = 'pending' | 'guest' | 'auth';

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Extract all field errors from a Laravel 422 response into a flat Record. */
function extractAllFieldErrors(err: unknown): Record<string, string> {
  const axiosErr = err as {
    response?: { data?: { errors?: Record<string, string[]> } };
  };
  const raw = axiosErr?.response?.data?.errors;
  if (!raw || typeof raw !== 'object') return {};
  const out: Record<string, string> = {};
  for (const [key, msgs] of Object.entries(raw)) {
    if (Array.isArray(msgs) && msgs[0]) out[key] = msgs[0];
  }
  return out;
}

/**
 * Scroll to and focus the first element in the DOM that has a
 * data-field-error="<key>" attribute from the given keys list.
 * Keys are checked in `order` so the topmost form field wins.
 */
function scrollToFirstError(keys: string[], order: string[]): void {
  const sorted = order.filter(k => keys.includes(k)).concat(
    keys.filter(k => !order.includes(k)),
  );
  for (const key of sorted) {
    const el = document.querySelector(`[data-field-error="${key}"]`) as HTMLElement | null;
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      // Try to focus the nearest input/textarea sibling above the error
      const field = el.previousElementSibling as HTMLElement | null;
      if (field && 'focus' in field) field.focus();
      return;
    }
  }
}

// ─── City combobox ────────────────────────────────────────────────────────────

interface CityComboboxProps {
  cities: City[];
  citiesLoading: boolean;
  selectedCityId: number | null;
  onSelect: (city: City | null) => void;
  hasError: boolean;
  inputCls: string;
}

function CityCombobox({
  cities, citiesLoading, selectedCityId, onSelect, hasError, inputCls,
}: CityComboboxProps) {
  const selectedCity = cities.find(c => c.id === selectedCityId) ?? null;
  const [query,   setQuery]   = useState('');
  const [isOpen,  setIsOpen]  = useState(false);
  const [focused, setFocused] = useState(false);

  const displayValue = isOpen ? query : (selectedCity?.name ?? '');
  const filtered = query.trim() === ''
    ? cities
    : cities.filter(c => c.name.toLowerCase().includes(query.toLowerCase().trim()));

  const handleSelect = (city: City) => {
    onSelect(city);
    setQuery('');
    setIsOpen(false);
  };

  const handleBlur = () => {
    setTimeout(() => { setIsOpen(false); setFocused(false); setQuery(''); }, 150);
  };

  const errCls = hasError ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : '';

  return (
    <div className="relative">
      <input type="hidden" name="city" value={selectedCityId ?? ''} />
      <div className="relative">
        <input
          type="text"
          autoComplete="off"
          placeholder={citiesLoading ? 'Loading cities…' : 'Search city…'}
          disabled={citiesLoading}
          value={displayValue}
          onChange={e => { setQuery(e.target.value); setIsOpen(true); if (e.target.value === '') onSelect(null); }}
          onFocus={() => { setFocused(true); setIsOpen(true); }}
          onBlur={handleBlur}
          className={`${inputCls} pr-8 ${!selectedCity && !focused ? 'text-gray-400' : ''} ${errCls}`}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          aria-autocomplete="list"
        />
        <svg className={`pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </div>
      {isOpen && !citiesLoading && (
        <ul role="listbox" className="absolute z-30 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-52 overflow-y-auto text-sm">
          {filtered.length === 0
            ? <li className="px-3 py-2.5 text-gray-400 text-xs">No cities match &quot;{query}&quot;</li>
            : filtered.map(city => (
              <li key={city.id} role="option" aria-selected={city.id === selectedCityId}
                onMouseDown={() => handleSelect(city)}
                className={`flex justify-between items-center px-3 py-2.5 cursor-pointer transition-colors ${city.id === selectedCityId ? 'bg-green-50 text-green-800 font-semibold' : 'hover:bg-gray-50 text-gray-800'}`}>
                <span>{city.name}</span>
                <span className="text-[11px] text-gray-400 ml-2 flex-shrink-0">PKR {city.shipping_charge} shipping</span>
              </li>
            ))
          }
        </ul>
      )}
    </div>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function CheckoutPage() {
  const router = useRouter();
  const { cartItems, getCartTotal, clearCart, isCartLoading, syncFromApi, updateQuantity, removeFromCart } = useCart();
  const { isAuthenticated, isLoading: authLoading, user } = useAuth();
  const { isValidating: isStockValidating, validate: validateStock } = useCartStockValidation();

  const [checkoutMode, setCheckoutMode] = useState<CheckoutMode>('pending');
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);

  // ── Guest contact fields ──────────────────────────────────────────────────
  const [guestName,  setGuestName]  = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [guestPhone, setGuestPhone] = useState('');

  // ── Auth contact fields (controlled so errors can render) ─────────────────
  const [authName,  setAuthName]  = useState('');
  const [authEmail, setAuthEmail] = useState('');
  const [phoneValue, setPhoneValue] = useState<string>('');

  // ── Unified field errors — every key from backend 422 lives here ──────────
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  // Helper: clear one key when the user starts editing that field
  const clearError = useCallback((key: string) => {
    setFieldErrors(prev => {
      if (!prev[key]) return prev;
      const next = { ...prev };
      delete next[key];
      return next;
    });
  }, []);

  // ── Other form state ──────────────────────────────────────────────────────
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [selectedCityId,   setSelectedCityId]   = useState<number | null>(null);
  const [selectedCityName, setSelectedCityName] = useState('');
  const [cityShipping,     setCityShipping]     = useState<number | null>(null);
  const [cities,           setCities]           = useState<City[]>([]);
  const [citiesLoading,    setCitiesLoading]    = useState(true);
  const [orderNote,     setOrderNote]     = useState('');
  const [address,       setAddress]       = useState('');
  const [isSubmitting,  setIsSubmitting]  = useState(false);
  const [submitError,   setSubmitError]   = useState('');

  // Load cities
  useEffect(() => {
    getCities().then(c => setCities(c)).catch(() => setCities([])).finally(() => setCitiesLoading(false));
  }, []);

  // Coupon state
  const [promoCode,     setPromoCode]     = useState('');
  const [promoApplied,  setPromoApplied]  = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState<CouponResult | null>(null);
  const [discount,      setDiscount]      = useState(0);
  const [promoError,    setPromoError]    = useState('');
  const [promoLoading,  setPromoLoading]  = useState(false);

  const subtotal = getCartTotal();
  const rawShipping = subtotal > 5000 ? 0 : (cityShipping ?? DEFAULT_SHIPPING);
  const shippingFree = appliedCoupon?.discount_type === 'freeship';
  const calculatedShipping = shippingFree ? 0 : rawShipping;
  const total = subtotal + calculatedShipping - discount;

  // ── Set checkout mode ─────────────────────────────────────────────────────
  useEffect(() => {
    if (authLoading) return;
    if (isAuthenticated) {
      if (user?.must_change_password) { router.replace('/change-password'); return; }
      setCheckoutMode('auth');
      if (user?.phone) setPhoneValue(user.phone);
      if (user?.name)  setAuthName(user.name);
      if (user?.email) setAuthEmail(user.email);
    } else {
      setShowCheckoutModal(true);
    }
  }, [authLoading, isAuthenticated, user, router]);

  useEffect(() => {
    if (!authLoading && isAuthenticated) syncFromApi();
  }, [authLoading, isAuthenticated, syncFromApi]);

  // ── Coupon ────────────────────────────────────────────────────────────────
  const handleApplyPromo = async () => {
    if (!promoCode.trim()) return;
    setPromoLoading(true);
    setPromoError('');
    try {
      const result = await validateCoupon(promoCode.trim(), subtotal);
      setDiscount(result.discount_amount);
      setAppliedCoupon(result);
      setPromoApplied(true);
      toast.success('Coupon applied successfully!');
    } catch (err) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message
        || 'Invalid or expired coupon code.';
      setPromoError(msg);
      setPromoApplied(false);
      setAppliedCoupon(null);
      setDiscount(0);
    } finally {
      setPromoLoading(false);
    }
  };

  const handleRemovePromo = () => {
    setPromoCode(''); setPromoApplied(false); setAppliedCoupon(null);
    setDiscount(0); setPromoError('');
  };

  // ── Client-side pre-validation (guest) ───────────────────────────────────
  const validateGuestFields = (): boolean => {
    const errs: Record<string, string> = {};
    if (!guestName.trim())                          errs.name  = 'Full name is required';
    if (guestEmail && !isValidEmail(guestEmail))    errs.email = 'Email is invalid';
    if (!normalizePkPhone(guestPhone))              errs.phone = guestPhone ? PAK_PHONE_ERROR : 'Phone number is required';
    setFieldErrors(prev => ({ ...prev, ...errs }));
    return Object.keys(errs).length === 0;
  };

  // ── DOM-order for scroll-to-first-error ──────────────────────────────────
  // Must match the top-to-bottom visual order of fields in the form.
  const FIELD_ORDER = [
    'name', 'email', 'phone',
    'shipping_address', 'city_id',
    'order_note', 'payment_method',
    'items',
  ];

  // ── Submit ────────────────────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');

    const cartIsClean = await validateStock(cartItems, removeFromCart, updateQuantity);
    if (!cartIsClean) {
      setSubmitError('Some items in your cart were updated due to stock changes. Please review your cart and try again.');
      setTimeout(() => {
        document.querySelector('[data-checkout-error]')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 100);
      return;
    }

    if (checkoutMode === 'guest' && !validateGuestFields()) {
      setTimeout(() => scrollToFirstError(
        Object.keys(fieldErrors).concat(['name', 'email', 'phone'].filter(k => !fieldErrors[k])),
        FIELD_ORDER,
      ), 50);
      return;
    }

    if (checkoutMode === 'auth') {
      let hasErr = false;
      const errs: Record<string, string> = {};
      if (!phoneValue)                  { errs.phone = 'Phone number is required';  hasErr = true; }
      else if (!normalizePkPhone(phoneValue)) { errs.phone = PAK_PHONE_ERROR;        hasErr = true; }
      if (hasErr) {
        setFieldErrors(prev => ({ ...prev, ...errs }));
        setTimeout(() => scrollToFirstError(Object.keys(errs), FIELD_ORDER), 50);
        return;
      }
    }

    if (!selectedCityId) {
      setFieldErrors(prev => ({ ...prev, city_id: 'Please select a city' }));
      setTimeout(() => scrollToFirstError(['city_id'], FIELD_ORDER), 50);
      return;
    }

    setIsSubmitting(true);

    const fullAddress = [
      checkoutMode === 'guest' ? guestName.trim() : authName.trim(),
      address,
      selectedCityName,
    ].filter(Boolean).join(', ');

    const items = cartItems.map(item => ({
      product_id:         Number(item.id),
      product_variant_id: item.variantId,
      quantity:           item.quantity,
      price:              item.price,
      discount:           0,
    }));

    try {
      if (checkoutMode === 'guest') {
        const order = await createGuestOrder({
          name:             guestName.trim(),
          email:            guestEmail.trim(),
          phone:            guestPhone,
          shipping_address: fullAddress,
          city_id:          selectedCityId ?? undefined,
          payment_method:   paymentMethod,
          order_note:       orderNote || undefined,
          shipping_charges: calculatedShipping,
          invoice_discount: discount > 0 ? discount : undefined,
          items,
        });

        sessionStorage.setItem('last-guest-order', JSON.stringify({
          ...order,
          _customer_name:  guestName.trim(),
          _customer_email: guestEmail.trim(),
          _customer_phone: guestPhone,
          _order_note:     orderNote || undefined,
          items: order.items?.length
            ? order.items
            : cartItems.map((item, idx) => ({
                id:           idx + 1,
                product_id:   Number(item.id),
                product_name: item.nameEn,
                variant_name: item.size || undefined,
                quantity:     item.quantity,
                price:        item.price,
                subtotal:     item.price * item.quantity,
                thumbnail:    item.img || undefined,
              })),
        }));

        await clearCart();

        if (order.account_created) {
          toast.success("Order placed! We've created an account for you — check your email for login details.");
        } else {
          toast.success('Order placed successfully!');
        }

        const p = new URLSearchParams();
        p.set('orderId', String(order.id));
        if (order.order_number) p.set('order_number', order.order_number);
        if (guestPhone)         p.set('phone', guestPhone);
        if (guestEmail.trim())  p.set('email', guestEmail.trim());
        p.set('mode', 'guest');
        router.push(`/order-confirmation?${p.toString()}`);
      } else {
        const order = await createOrder({
          phone:            phoneValue || undefined,
          shipping_address: fullAddress,
          city_id:          selectedCityId ?? undefined,
          payment_method:   paymentMethod,
          order_note:       orderNote || undefined,
          shipping_charges: calculatedShipping,
          invoice_discount: discount > 0 ? discount : undefined,
          items,
        });

        await clearCart();

        const p = new URLSearchParams();
        p.set('orderId', String(order.id));
        if (order.order_number) p.set('order_number', order.order_number);
        p.set('mode', 'auth');
        router.push(`/order-confirmation?${p.toString()}`);
      }
    } catch (err) {
      console.error('Order submission error:', err);

      const axiosErr = err as { response?: { status?: number; data?: { message?: string } } };
      const status   = axiosErr?.response?.status;
      const data     = axiosErr?.response?.data;

      const topMsg = data?.message
        || (status === undefined
          ? "We couldn't place your order. Please check your connection and try again."
          : status === 500
          ? 'A server error occurred. Please try again in a moment, or contact support.'
          : 'Failed to place your order. Please try again.');

      if (status === 422) {
        toast.error(topMsg);

        // Store EVERY key from the backend errors object — no whitelist.
        const allErrors = extractAllFieldErrors(err);
        if (Object.keys(allErrors).length) {
          setFieldErrors(prev => ({ ...prev, ...allErrors }));
          setTimeout(() => scrollToFirstError(Object.keys(allErrors), FIELD_ORDER), 50);
        }
        // Don't set submitError for 422 — toast + inline fields are enough.
        return;
      }

      toast.error(topMsg);
      setSubmitError(topMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── Shared styles ─────────────────────────────────────────────────────────
  const inputCls = "w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-700/20 focus:border-green-600 transition bg-white";
  const labelCls = "block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide";
  const errInputCls = (key: string) => fieldErrors[key] ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : '';
  const ErrMsg = ({ fieldKey }: { fieldKey: string }) =>
    fieldErrors[fieldKey]
      ? <p className="mt-1 text-xs text-red-500" data-field-error={fieldKey}>{fieldErrors[fieldKey]}</p>
      : null;

  // ── Items-level errors (items.0.quantity, items.1.price, etc.) ────────────
  const itemErrors = Object.entries(fieldErrors)
    .filter(([k]) => k.startsWith('items.') || k === 'items')
    .map(([k, v]) => {
      // items.N.field → try to resolve product name from cart
      const match = k.match(/^items\.(\d+)\./);
      if (match) {
        const idx = Number(match[1]);
        const name = cartItems[idx]?.nameEn ?? `Item ${idx + 1}`;
        return `${name}: ${v}`;
      }
      return v;
    });

  // ── Loading skeleton ──────────────────────────────────────────────────────
  if (authLoading || (checkoutMode === 'auth' && isCartLoading)) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-5xl mx-auto px-4 py-3">
            <div className="h-3.5 w-48 bg-gray-200 rounded animate-pulse" />
          </div>
        </div>
        <div className="max-w-5xl mx-auto px-4 py-6">
          <div className="h-7 w-36 bg-gray-200 rounded animate-pulse mb-6" />
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] xl:grid-cols-[1fr_400px] gap-6">
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 animate-pulse">
                  <div className="h-4 w-40 bg-gray-200 rounded mb-4" />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2 h-10 bg-gray-200 rounded-lg" />
                    <div className="h-10 bg-gray-200 rounded-lg" />
                    <div className="h-10 bg-gray-200 rounded-lg" />
                  </div>
                </div>
              ))}
            </div>
            <div className="lg:sticky lg:top-6 h-fit">
              <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 animate-pulse">
                <div className="h-4 w-28 bg-gray-200 rounded mb-4" />
                <div className="space-y-3 mb-4">
                  {[...Array(2)].map((_, i) => (
                    <div key={i} className="flex gap-3">
                      <div className="w-12 h-12 bg-gray-200 rounded-lg flex-shrink-0" />
                      <div className="flex-1 space-y-1.5">
                        <div className="h-3 bg-gray-200 rounded w-3/4" />
                        <div className="h-3 bg-gray-200 rounded w-1/2" />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="h-12 w-full bg-gray-200 rounded-full" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Guest / login modal ───────────────────────────────────────────────────
  if (checkoutMode === 'pending' && showCheckoutModal) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/50" aria-hidden />
          <div role="dialog" aria-modal="true" aria-labelledby="checkout-choice-title"
            className="relative bg-white rounded-2xl shadow-xl p-6 max-w-md w-full">
            <h2 id="checkout-choice-title" className="text-xl font-bold text-gray-900 mb-2 text-center">
              How would you like to checkout?
            </h2>
            <p className="text-sm text-gray-500 text-center mb-6">
              Sign in to your account or continue without creating one.
            </p>
            <div className="flex flex-col gap-3">
              <Link href="/login?returnTo=/checkout"
                className="w-full py-3 bg-green-700 text-white font-semibold rounded-full text-center hover:bg-green-600 transition text-sm">
                Login to my account
              </Link>
              <button type="button" onClick={() => { setCheckoutMode('guest'); setShowCheckoutModal(false); }}
                className="w-full py-3 border border-gray-300 text-gray-700 font-semibold rounded-full hover:bg-gray-50 transition text-sm">
                Continue as Guest
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Empty cart ────────────────────────────────────────────────────────────
  if (!isCartLoading && cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center max-w-sm">
          <div className="text-6xl mb-4">🛒</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
          <p className="text-gray-500 mb-6 text-sm">Add some products to your cart before checking out.</p>
          <Link href="/shop" className="inline-block px-8 py-3 bg-green-700 text-white font-semibold rounded-full hover:bg-green-600 transition">
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-50">
      <style jsx global>{`
        .PhoneInput{width:100%;display:flex;align-items:center;gap:8px}
        .PhoneInputInput{flex:1;padding:.625rem .75rem;border:1px solid #e5e7eb;border-radius:.5rem;font-size:.875rem;outline:none;transition:all .2s;background:#fff;color:#111827}
        .PhoneInputInput:focus{border-color:#15803d;box-shadow:0 0 0 2px rgba(21,128,61,.12)}
        .PhoneInputCountry{padding:.625rem .75rem;border:1px solid #e5e7eb;border-radius:.5rem;background:#fff;cursor:pointer;display:flex;align-items:center;gap:4px}
      `}</style>

      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-[1600px] mx-auto px-[4%] py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-lg font-bold text-gray-900">Checkout</h1>
            <div className="flex items-center gap-1.5 text-green-700">
              <FaLock className="w-3.5 h-3.5" />
              <span className="text-xs font-semibold">Secure Checkout</span>
            </div>
          </div>
          <div className="flex items-center gap-2 mt-4">
            {[
              { label: 'Cart',     step: 1, done: true   },
              { label: 'Checkout', step: 2, active: true },
              { label: 'Complete', step: 3               },
            ].map((s, i, arr) => (
              <div key={s.label} className="flex items-center gap-2">
                <div className="flex items-center gap-1.5">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${s.done || s.active ? 'bg-green-700 text-white' : 'bg-gray-200 text-gray-500'}`}>
                    {s.done ? <FaCheckCircle className="w-3.5 h-3.5" /> : s.step}
                  </div>
                  <span className={`text-xs font-medium ${s.done || s.active ? 'text-gray-900' : 'text-gray-400'}`}>{s.label}</span>
                </div>
                {i < arr.length - 1 && <div className={`w-8 h-0.5 ${s.done ? 'bg-green-700' : 'bg-gray-200'}`} />}
              </div>
            ))}
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="max-w-[1600px] mx-auto px-[4%] py-6">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] xl:grid-cols-[1fr_400px] 2xl:grid-cols-[1fr_440px] gap-5">

            {/* ── LEFT ── */}
            <div className="flex flex-col gap-4">

              {/* ── Guest contact ── */}
              {checkoutMode === 'guest' && (
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
                  <h2 className="text-sm font-bold text-gray-900 mb-4">Your Details</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Name */}
                    <div className="sm:col-span-2">
                      <label className={labelCls}>Full Name *</label>
                      <input
                        name="guest_name" type="text"
                        value={guestName}
                        onChange={e => { setGuestName(e.target.value); clearError('name'); }}
                        className={`${inputCls} ${errInputCls('name')}`}
                        placeholder="Ahmed Khan"
                      />
                      <ErrMsg fieldKey="name" />
                    </div>
                    {/* Email */}
                    <div>
                      <label className={labelCls}>Email Address <span className="normal-case font-normal text-gray-400">(optional)</span></label>
                      <input
                        name="guest_email" type="email"
                        value={guestEmail}
                        onChange={e => { setGuestEmail(e.target.value); clearError('email'); }}
                        className={`${inputCls} ${errInputCls('email')}`}
                        placeholder="ahmed@example.com"
                      />
                      <ErrMsg fieldKey="email" />
                    </div>
                    {/* Phone */}
                    <div>
                      <label className={labelCls}>Phone Number *</label>
                      <PhoneInput
                        international defaultCountry="PK"
                        name="guest_phone"
                        value={guestPhone}
                        onChange={v => {
                          const val = v || '';
                          setGuestPhone(val);
                          clearError('phone');
                        }}
                        onBlur={() => {
                          if (!guestPhone) {
                            setFieldErrors(prev => ({ ...prev, phone: 'Phone number is required' }));
                          } else if (!normalizePkPhone(guestPhone)) {
                            setFieldErrors(prev => ({ ...prev, phone: PAK_PHONE_ERROR }));
                          }
                        }}
                        placeholder="Enter phone number"
                      />
                      <ErrMsg fieldKey="phone" />
                      <p className="mt-1.5 text-[11px] text-gray-400 leading-snug">
                        This will also be your account password if we create one for you
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* ── Auth contact (fully controlled) ── */}
              {checkoutMode === 'auth' && (
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
                  <h2 className="text-sm font-bold text-gray-900 mb-4">Contact Information</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Name */}
                    <div className="sm:col-span-2">
                      <label className={labelCls}>Full Name *</label>
                      <input
                        name="name" type="text" required
                        value={authName}
                        onChange={e => { setAuthName(e.target.value); clearError('name'); }}
                        className={`${inputCls} ${errInputCls('name')}`}
                        placeholder="Ahmed Khan"
                      />
                      <ErrMsg fieldKey="name" />
                    </div>
                    {/* Email — optional, only show error if backend sends one */}
                    <div>
                      <label className={labelCls}>Email Address <span className="normal-case font-normal text-gray-400">(optional)</span></label>
                      <input
                        name="email" type="email"
                        value={authEmail}
                        onChange={e => { setAuthEmail(e.target.value); clearError('email'); }}
                        className={`${inputCls} ${errInputCls('email')}`}
                        placeholder="ahmed@example.com"
                      />
                      <ErrMsg fieldKey="email" />
                    </div>
                    {/* Phone */}
                    <div>
                      <label className={labelCls}>Phone Number *</label>
                      <PhoneInput
                        international defaultCountry="PK"
                        name="phone"
                        value={phoneValue}
                        onChange={v => {
                          const val = v || '';
                          setPhoneValue(val);
                          clearError('phone');
                        }}
                        onBlur={() => {
                          if (!phoneValue)                      setFieldErrors(prev => ({ ...prev, phone: 'Phone number is required' }));
                          else if (!normalizePkPhone(phoneValue)) setFieldErrors(prev => ({ ...prev, phone: PAK_PHONE_ERROR }));
                        }}
                        placeholder="Enter phone number"
                      />
                      <ErrMsg fieldKey="phone" />
                    </div>
                  </div>
                </div>
              )}

              {/* ── Shipping address ── */}
              <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
                <h2 className="text-sm font-bold text-gray-900 mb-4">Shipping Address</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Street address */}
                  <div>
                    <label className={labelCls}>Street Address *</label>
                    <input
                      name="address" type="text" required
                      value={address}
                      onChange={e => { setAddress(e.target.value); clearError('shipping_address'); }}
                      className={`${inputCls} ${errInputCls('shipping_address')}`}
                      placeholder="House/Flat no, Street name, Area"
                    />
                    <ErrMsg fieldKey="shipping_address" />
                  </div>
                  {/* City */}
                  <div>
                    <label className={labelCls}>City *</label>
                    <CityCombobox
                      cities={cities}
                      citiesLoading={citiesLoading}
                      selectedCityId={selectedCityId}
                      hasError={!!fieldErrors['city_id']}
                      onSelect={city => {
                        setSelectedCityId(city?.id ?? null);
                        setSelectedCityName(city?.name ?? '');
                        setCityShipping(city?.shipping_charge ?? null);
                        clearError('city_id');
                      }}
                      inputCls={inputCls}
                    />
                    {/* Show backend error if present, else show shipping hint */}
                    {fieldErrors['city_id']
                      ? <p className="mt-1 text-xs text-red-500" data-field-error="city_id">{fieldErrors['city_id']}</p>
                      : !selectedCityId && !citiesLoading
                        ? <p className="mt-1 text-[11px] text-amber-600">Select city to calculate shipping charges</p>
                        : null
                    }
                  </div>
                  {/* Order note */}
                  <div className="sm:col-span-2">
                    <label className={labelCls}>Order Note <span className="normal-case font-normal text-gray-400">(optional)</span></label>
                    <textarea
                      rows={2}
                      value={orderNote}
                      onChange={e => { setOrderNote(e.target.value); clearError('order_note'); }}
                      className={`${inputCls} resize-none ${errInputCls('order_note')}`}
                      placeholder="e.g., Call before delivery, leave at reception…"
                    />
                    <ErrMsg fieldKey="order_note" />
                  </div>
                </div>
              </div>

              {/* ── Payment method ── */}
              <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
                <h2 className="text-sm font-bold text-gray-900 mb-4">Payment Method</h2>
                {fieldErrors['payment_method'] && (
                  <p className="mb-3 text-xs text-red-500" data-field-error="payment_method">
                    {fieldErrors['payment_method']}
                  </p>
                )}
                <div className="flex flex-col gap-2.5">
                  {[
                    { value: 'cod',    icon: 'cod',  label: 'Cash on Delivery', sub: 'Pay when you receive'                      },
                    { value: 'online', icon: null,   label: 'Online Payment',   sub: 'Credit/Debit Card · JazzCash · EasyPaisa' },
                    { value: 'bank',   icon: 'bank', label: 'Bank Transfer',    sub: 'Direct bank deposit'                       },
                  ].map(opt => (
                    <label key={opt.value}
                      className={`flex items-center gap-3 p-3.5 border rounded-xl cursor-pointer transition ${paymentMethod === opt.value ? 'border-green-600 bg-green-50' : 'border-gray-200 hover:border-gray-300 bg-white'}`}>
                      <input type="radio" name="payment" value={opt.value}
                        checked={paymentMethod === opt.value}
                        onChange={e => { setPaymentMethod(e.target.value); clearError('payment_method'); }}
                        className="w-4 h-4 accent-green-700 flex-shrink-0" />
                      <div className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
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

              {/* ── Items-level errors ── */}
              {itemErrors.length > 0 && (
                <div
                  className="bg-red-50 border border-red-200 rounded-xl p-4"
                  data-field-error="items"
                >
                  <p className="text-xs font-semibold text-red-700 mb-1.5">Cart item errors from server:</p>
                  <ul className="space-y-1">
                    {itemErrors.map((msg, i) => (
                      <li key={i} className="text-xs text-red-600">• {msg}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* ── RIGHT: summary ── */}
            <div className="lg:sticky lg:top-[144px] h-fit flex flex-col gap-3">
              <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
                <h2 className="text-sm font-bold text-gray-900 mb-4">Order Summary</h2>

                {/* Items */}
                <div className="relative mb-4">
                  <div className={`flex flex-col gap-3 overflow-y-auto pb-1 ${cartItems.length > 4 ? 'max-h-[272px] lg:max-h-none' : ''}`}>
                    {cartItems.map(item => (
                      <div key={`${item.id}-${item.size}`} className="flex gap-3">
                        <div className="relative w-12 h-12 flex-shrink-0 rounded-lg overflow-hidden border border-gray-100 bg-gray-50">
                          <Image src={item.img} alt={item.nameEn} fill className="object-cover" sizes="48px" />
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
                  {cartItems.length > 4 && (
                    <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-8 lg:hidden"
                      style={{ background: 'linear-gradient(to bottom, transparent, rgba(255,255,255,0.95))' }}
                      aria-hidden />
                  )}
                  <div className="mt-1 border-b border-gray-100" />
                </div>

                {/* Coupon */}
                <div className="py-4 border-b border-gray-100">
                  <label className="block text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wide">Coupon Code</label>
                  <div className="flex gap-2">
                    <div className="flex-1 relative">
                      <FaTag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text" value={promoCode}
                        onChange={e => setPromoCode(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), handleApplyPromo())}
                        placeholder="Enter coupon code"
                        disabled={promoApplied}
                        className={`${inputCls} pl-9`}
                      />
                    </div>
                    {!promoApplied
                      ? <button type="button" onClick={handleApplyPromo}
                          disabled={!promoCode.trim() || promoLoading}
                          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition font-medium text-sm disabled:opacity-50">
                          {promoLoading ? '…' : 'Apply'}
                        </button>
                      : <button type="button" onClick={handleRemovePromo}
                          className="px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition font-medium text-sm">
                          Remove
                        </button>
                    }
                  </div>
                  {promoError   && <p className="text-xs text-red-500 mt-2">{promoError}</p>}
                  {promoApplied && <p className="text-xs text-green-600 mt-2">✓ Coupon applied — saving PKR {discount.toLocaleString()}</p>}
                </div>

                {/* Totals */}
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
                    <span className="flex items-center gap-1"><FaTruck className="w-3 h-3" /> Shipping</span>
                    {selectedCityId === null && !shippingFree
                      ? <span className="text-xs text-amber-600 font-medium">Select city to calculate</span>
                      : <span className={`font-medium ${calculatedShipping === 0 ? 'text-green-600' : 'text-gray-900'}`}>
                          {calculatedShipping === 0 ? 'FREE' : `PKR ${calculatedShipping}`}
                        </span>
                    }
                  </div>
                </div>

                <div className="flex justify-between pt-3.5 mb-4">
                  <span className="text-sm font-bold text-gray-900">Total</span>
                  <span className="text-base font-bold text-gray-900">PKR {total.toLocaleString()}</span>
                </div>

                {submitError && (
                  <p data-checkout-error className="text-xs text-red-500 mb-2 text-center">{submitError}</p>
                )}

                <button type="submit" disabled={isSubmitting || isStockValidating}
                  className={`w-full py-3 rounded-full text-sm font-bold text-white transition shadow-sm ${(isSubmitting || isStockValidating) ? 'bg-green-600 opacity-70 cursor-not-allowed' : 'bg-green-700 hover:bg-green-600 hover:shadow-md'}`}>
                  {isStockValidating ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Checking stock…
                    </span>
                  ) : isSubmitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Placing Order…
                    </span>
                  ) : 'Place Order'}
                </button>

                <div className="mt-3 flex items-center justify-center gap-1.5 text-[11px] text-gray-400">
                  <FaShieldAlt className="w-3 h-3 text-green-500" />
                  Secure &amp; encrypted · By placing you agree to our terms
                </div>
              </div>

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
