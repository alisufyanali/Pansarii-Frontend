"use client";

import Image from 'next/image';
import { useState, useEffect } from 'react';
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
import { useAuth, extractFieldErrors } from '@/context/AuthContext';
import { createOrder, createGuestOrder } from '@/lib/orders';
import { validateCoupon, type CouponResult } from '@/lib/coupons';
import { getCities, DEFAULT_SHIPPING, type City } from '@/lib/cities';

type CheckoutMode = 'pending' | 'guest' | 'auth';

// ── City searchable combobox ───────────────────────────────────────────────────

interface CityComboboxProps {
  cities: City[];
  citiesLoading: boolean;
  selectedCityId: number | null;
  onSelect: (city: City | null) => void;
  inputCls: string;
}

function CityCombobox({ cities, citiesLoading, selectedCityId, onSelect, inputCls }: CityComboboxProps) {
  const selectedCity = cities.find(c => c.id === selectedCityId) ?? null;

  const [query,    setQuery]    = useState('');
  const [isOpen,   setIsOpen]   = useState(false);
  const [focused,  setFocused]  = useState(false);

  // Display value: when dropdown is open show the typed query; when closed show
  // the selected city name (or empty for placeholder).
  const displayValue = isOpen ? query : (selectedCity?.name ?? '');

  const filtered = query.trim() === ''
    ? cities
    : cities.filter(c => c.name.toLowerCase().includes(query.toLowerCase().trim()));

  const handleSelect = (city: City) => {
    onSelect(city);
    setQuery('');
    setIsOpen(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setIsOpen(true);
    if (e.target.value === '') onSelect(null);
  };

  const handleBlur = () => {
    // Delay so click on option registers before blur closes the dropdown
    setTimeout(() => {
      setIsOpen(false);
      setFocused(false);
      // If user blurred without selecting and there's a partial query, reset
      setQuery('');
    }, 150);
  };

  return (
    <div className="relative">
      {/* Hidden native input so form name="city" is still present for validation */}
      <input type="hidden" name="city" value={selectedCityId ?? ''} />

      <div className="relative">
        <input
          type="text"
          autoComplete="off"
          placeholder={citiesLoading ? 'Loading cities…' : 'Search city…'}
          disabled={citiesLoading}
          value={displayValue}
          onChange={handleInputChange}
          onFocus={() => { setFocused(true); setIsOpen(true); }}
          onBlur={handleBlur}
          className={`${inputCls} pr-8 ${!selectedCity && !focused ? 'text-gray-400' : ''}`}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          aria-autocomplete="list"
        />
        {/* Chevron */}
        <svg
          className={`pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </div>

      {isOpen && !citiesLoading && (
        <ul
          role="listbox"
          className="absolute z-30 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-52 overflow-y-auto text-sm"
        >
          {filtered.length === 0 ? (
            <li className="px-3 py-2.5 text-gray-400 text-xs">No cities match &quot;{query}&quot;</li>
          ) : (
            filtered.map(city => (
              <li
                key={city.id}
                role="option"
                aria-selected={city.id === selectedCityId}
                onMouseDown={() => handleSelect(city)}
                className={`flex justify-between items-center px-3 py-2.5 cursor-pointer transition-colors ${
                  city.id === selectedCityId
                    ? 'bg-green-50 text-green-800 font-semibold'
                    : 'hover:bg-gray-50 text-gray-800'
                }`}
              >
                <span>{city.name}</span>
                <span className="text-[11px] text-gray-400 ml-2 flex-shrink-0">
                  PKR {city.shipping_charge} shipping
                </span>
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
}

interface GuestFields {
  name: string;
  email: string;
  phone: string;
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function CheckoutPage() {
  const router = useRouter();
  const { cartItems, getCartTotal, clearCart, isCartLoading, syncFromApi } = useCart();
  const { isAuthenticated, isLoading: authLoading, user } = useAuth();

  const [checkoutMode, setCheckoutMode] = useState<CheckoutMode>('pending');
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);

  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [guestFieldErrors, setGuestFieldErrors] = useState<Partial<GuestFields>>({});

  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [phoneValue,    setPhoneValue]    = useState<string>('');
  const [selectedCityId,   setSelectedCityId]   = useState<number | null>(null);
  const [selectedCityName, setSelectedCityName] = useState('');
  const [cityShipping,     setCityShipping]     = useState<number | null>(null);
  const [cities,           setCities]           = useState<City[]>([]);
  const [citiesLoading,    setCitiesLoading]    = useState(true);
  const [orderNote,     setOrderNote]     = useState('');
  const [isSubmitting,  setIsSubmitting]  = useState(false);
  const [submitError,   setSubmitError]   = useState('');

  // Load cities on mount
  useEffect(() => {
    getCities()
      .then(c => setCities(c))
      .catch(() => setCities([]))
      .finally(() => setCitiesLoading(false));
  }, []);

  // Coupon state
  const [promoCode,      setPromoCode]      = useState('');
  const [promoApplied,   setPromoApplied]   = useState(false);
  const [appliedCoupon,  setAppliedCoupon]  = useState<CouponResult | null>(null);
  const [discount,       setDiscount]       = useState(0);
  const [promoError,     setPromoError]     = useState('');
  const [promoLoading,   setPromoLoading]   = useState(false);

  const subtotal = getCartTotal();
  // cityShipping is null until user picks a city; fall back to DEFAULT_SHIPPING
  // for the order total. Free shipping still applies above PKR 5000.
  const rawShipping = subtotal > 5000 ? 0 : (cityShipping ?? DEFAULT_SHIPPING);
  const shippingFree = appliedCoupon?.discount_type === 'freeship';
  const calculatedShipping = shippingFree ? 0 : rawShipping;
  const total = subtotal + calculatedShipping - discount;

  // ── Set checkout mode on auth resolve ─────────────────────────────────────
  useEffect(() => {
    if (authLoading) return;
    if (isAuthenticated) {
      setCheckoutMode('auth');
      // Pre-fill phone from stored user profile
      if (user?.phone) setPhoneValue(user.phone);
    } else {
      setShowCheckoutModal(true);
    }
  }, [authLoading, isAuthenticated, user]);

  // ── Refresh cart from API when checkout mounts (logged-in users) ───────────
  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      syncFromApi();
    }
  }, [authLoading, isAuthenticated, syncFromApi]);

  // ── Coupon handlers ───────────────────────────────────────────────────────
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
    setPromoCode('');
    setPromoApplied(false);
    setAppliedCoupon(null);
    setDiscount(0);
    setPromoError('');
  };

  // ── Guest field validation ──────────────────────────────────────────────────
  const validateGuestFields = (): boolean => {
    const errs: Partial<GuestFields> = {};
    if (!guestName.trim()) errs.name = 'Full name is required';
    if (!guestEmail.trim()) errs.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(guestEmail)) errs.email = 'Email is invalid';
    if (!guestPhone) errs.phone = 'Phone number is required';
    setGuestFieldErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleGuestFieldChange = (field: keyof GuestFields, value: string) => {
    if (field === 'name') setGuestName(value);
    else if (field === 'email') setGuestEmail(value);
    else setGuestPhone(value);
    if (guestFieldErrors[field]) {
      setGuestFieldErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleContinueAsGuest = () => {
    setCheckoutMode('guest');
    setShowCheckoutModal(false);
  };

  // ── Order submission ──────────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');

    if (checkoutMode === 'guest' && !validateGuestFields()) return;

    // City is required — show inline error if not selected
    if (!selectedCityId) {
      setSubmitError('Please select a city to calculate shipping charges before placing your order.');
      // Scroll the city select into view
      const cityEl = document.querySelector('[name="city"]') as HTMLElement | null;
      cityEl?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    setIsSubmitting(true);

    const form    = e.target as HTMLFormElement;
    const data    = new FormData(form);
    const name    = checkoutMode === 'guest'
      ? guestName.trim()
      : ((data.get('name') as string) || '');
    const address = (data.get('address') as string) || '';

    const fullAddress = [name, address, selectedCityName].filter(Boolean).join(', ');

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
          // Persist cart items in the session so the confirmation page can show
          // them even though the order-creation response doesn't include items.
          // This must be stored BEFORE clearCart() is called.
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

        router.push(`/order-confirmation?orderId=${order.id}`);
      } else {
        const order = await createOrder({
          phone:             phoneValue || undefined,
          shipping_address:  fullAddress,
          city_id:           selectedCityId ?? undefined,
          payment_method:    paymentMethod,
          order_note:        orderNote || undefined,
          shipping_charges:  calculatedShipping,
          invoice_discount:  discount > 0 ? discount : undefined,
          items,
        });

        await clearCart();
        router.push(`/order-confirmation?orderId=${order.id}`);
      }
    } catch (err) {
      const e422 = err as { response?: { status?: number; data?: { message?: string } } };
      const msg = e422?.response?.data?.message || 'Failed to place order. Please try again.';

      if (checkoutMode === 'guest') {
        const fields = extractFieldErrors<GuestFields>(err);
        if (Object.keys(fields).length) {
          setGuestFieldErrors(fields);
        } else if (e422?.response?.status === 422) {
          toast.error(msg);
        } else {
          setSubmitError(msg);
        }
      } else if (e422?.response?.status === 422) {
        toast.error(msg);
      } else {
        setSubmitError(msg);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── Shared styles ─────────────────────────────────────────────────────────
  const inputCls = "w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-700/20 focus:border-green-600 transition bg-white";
  const labelCls = "block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide";

  // ── Show loading while auth or cart resolves ─────────────────────────────
  if (authLoading || (checkoutMode === 'auth' && isCartLoading)) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-green-700" />
      </div>
    );
  }

  // ── Guest / login choice modal (unauthenticated only) ─────────────────────
  if (checkoutMode === 'pending' && showCheckoutModal) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/50" aria-hidden />
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="checkout-choice-title"
            className="relative bg-white rounded-2xl shadow-xl p-6 max-w-md w-full"
          >
            <h2 id="checkout-choice-title" className="text-xl font-bold text-gray-900 mb-2 text-center">
              How would you like to checkout?
            </h2>
            <p className="text-sm text-gray-500 text-center mb-6">
              Sign in to your account or continue without creating one.
            </p>
            <div className="flex flex-col gap-3">
              <Link
                href="/login?returnTo=/checkout"
                className="w-full py-3 bg-green-700 text-white font-semibold rounded-full text-center hover:bg-green-600 transition text-sm"
              >
                Login to my account
              </Link>
              <button
                type="button"
                onClick={handleContinueAsGuest}
                className="w-full py-3 border border-gray-300 text-gray-700 font-semibold rounded-full hover:bg-gray-50 transition text-sm"
              >
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
              { label: 'Cart',     step: 1, done: true        },
              { label: 'Checkout', step: 2, active: true      },
              { label: 'Complete', step: 3                    },
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

              {/* Guest contact — top of form in guest mode */}
              {checkoutMode === 'guest' && (
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
                  <h2 className="text-sm font-bold text-gray-900 mb-4">Your Details</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2">
                      <label className={labelCls}>Full Name *</label>
                      <input
                        name="guest_name"
                        type="text"
                        value={guestName}
                        onChange={e => handleGuestFieldChange('name', e.target.value)}
                        className={`${inputCls} ${guestFieldErrors.name ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : ''}`}
                        placeholder="Ahmed Khan"
                      />
                      {guestFieldErrors.name && (
                        <p className="mt-1 text-xs text-red-500">{guestFieldErrors.name}</p>
                      )}
                    </div>
                    <div>
                      <label className={labelCls}>Email Address *</label>
                      <input
                        name="guest_email"
                        type="email"
                        value={guestEmail}
                        onChange={e => handleGuestFieldChange('email', e.target.value)}
                        className={`${inputCls} ${guestFieldErrors.email ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : ''}`}
                        placeholder="ahmed@example.com"
                      />
                      {guestFieldErrors.email && (
                        <p className="mt-1 text-xs text-red-500">{guestFieldErrors.email}</p>
                      )}
                    </div>
                    <div>
                      <label className={labelCls}>Phone Number *</label>
                      <PhoneInput
                        international
                        defaultCountry="PK"
                        value={guestPhone}
                        onChange={v => handleGuestFieldChange('phone', v || '')}
                        placeholder="Enter phone number"
                      />
                      {guestFieldErrors.phone && (
                        <p className="mt-1 text-xs text-red-500">{guestFieldErrors.phone}</p>
                      )}
                      <p className="mt-1.5 text-[11px] text-gray-400 leading-snug">
                        This will also be your account password if we create one for you
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Contact — authenticated checkout only */}
              {checkoutMode === 'auth' && (
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
                  <h2 className="text-sm font-bold text-gray-900 mb-4">Contact Information</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2">
                      <label className={labelCls}>Full Name *</label>
                      <input
                        name="name"
                        type="text"
                        required
                        defaultValue={user?.name ?? ''}
                        className={inputCls}
                        placeholder="Ahmed Khan"
                      />
                    </div>
                    <div>
                      <label className={labelCls}>Email Address *</label>
                      <input
                        name="email"
                        type="email"
                        required
                        defaultValue={user?.email ?? ''}
                        className={inputCls}
                        placeholder="ahmed@example.com"
                      />
                    </div>
                    <div>
                      <label className={labelCls}>Phone Number *</label>
                      <PhoneInput
                        international
                        defaultCountry="PK"
                        value={phoneValue}
                        onChange={v => setPhoneValue(v || '')}
                        placeholder="Enter phone number"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Shipping */}
              <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
                <h2 className="text-sm font-bold text-gray-900 mb-4">Shipping Address</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={labelCls}>Street Address *</label>
                    <input name="address" type="text" required className={inputCls} placeholder="House/Flat no, Street name, Area" />
                  </div>
                  <div>
                    <label className={labelCls}>City *</label>
                    <CityCombobox
                      cities={cities}
                      citiesLoading={citiesLoading}
                      selectedCityId={selectedCityId}
                      onSelect={(city) => {
                        setSelectedCityId(city?.id ?? null);
                        setSelectedCityName(city?.name ?? '');
                        setCityShipping(city?.shipping_charge ?? null);
                      }}
                      inputCls={inputCls}
                    />
                    {!selectedCityId && !citiesLoading && (
                      <p className="mt-1 text-[11px] text-amber-600">
                        Select city to calculate shipping charges
                      </p>
                    )}
                  </div>
                  <div className="sm:col-span-2">
                    <label className={labelCls}>Order Note <span className="normal-case font-normal text-gray-400">(optional)</span></label>
                    <textarea
                      rows={2}
                      value={orderNote}
                      onChange={e => setOrderNote(e.target.value)}
                      className={`${inputCls} resize-none`}
                      placeholder="e.g., Call before delivery, leave at reception…"
                    />
                  </div>
                </div>
              </div>

              {/* Payment */}
              <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
                <h2 className="text-sm font-bold text-gray-900 mb-4">Payment Method</h2>
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
                        onChange={e => setPaymentMethod(e.target.value)}
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
            </div>

            {/* ── RIGHT: Summary ── */}
            <div className="lg:sticky lg:top-[144px] h-fit flex flex-col gap-3">
              <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
                <h2 className="text-sm font-bold text-gray-900 mb-4">Order Summary</h2>

                {/* Items */}
                <div className="relative mb-4">
                  {/* Scrollable items list — capped on mobile so the coupon/total
                      sections below remain reachable without the list overflowing */}
                  <div
                    className={`flex flex-col gap-3 overflow-y-auto pb-1 ${
                      cartItems.length > 4 ? 'max-h-[272px] lg:max-h-none' : ''
                    }`}
                  >
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
                  {/* Bottom-fade scroll cue — only rendered when list is long enough
                      to be capped (> 4 items) and only visible on mobile (lg hides it) */}
                  {cartItems.length > 4 && (
                    <div
                      className="pointer-events-none absolute bottom-0 left-0 right-0 h-8 lg:hidden"
                      style={{
                        background: 'linear-gradient(to bottom, transparent, rgba(255,255,255,0.95))',
                      }}
                      aria-hidden
                    />
                  )}
                  {/* Divider sits outside the scrollable area so it's always visible */}
                  <div className="mt-1 border-b border-gray-100" />
                </div>

                {/* Coupon */}
                <div className="py-4 border-b border-gray-100">
                  <label className="block text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wide">Coupon Code</label>
                  <div className="flex gap-2">
                    <div className="flex-1 relative">
                      <FaTag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        value={promoCode}
                        onChange={e => setPromoCode(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), handleApplyPromo())}
                        placeholder="Enter coupon code"
                        disabled={promoApplied}
                        className={`${inputCls} pl-9`}
                      />
                    </div>
                    {!promoApplied ? (
                      <button type="button" onClick={handleApplyPromo}
                        disabled={!promoCode.trim() || promoLoading}
                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition font-medium text-sm disabled:opacity-50">
                        {promoLoading ? '…' : 'Apply'}
                      </button>
                    ) : (
                      <button type="button" onClick={handleRemovePromo}
                        className="px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition font-medium text-sm">
                        Remove
                      </button>
                    )}
                  </div>
                  {promoError && <p className="text-xs text-red-500 mt-2">{promoError}</p>}
                  {promoApplied && <p className="text-xs text-green-600 mt-2">✓ Coupon applied — saving PKR {discount.toLocaleString()}</p>}
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
                    <span className="flex items-center gap-1"><FaTruck className="w-3 h-3" /> Shipping</span>
                    {selectedCityId === null && !shippingFree ? (
                      <span className="text-xs text-amber-600 font-medium">Select city to calculate</span>
                    ) : (
                      <span className={`font-medium ${calculatedShipping === 0 ? 'text-green-600' : 'text-gray-900'}`}>
                        {calculatedShipping === 0 ? 'FREE' : `PKR ${calculatedShipping}`}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex justify-between pt-3.5 mb-4">
                  <span className="text-sm font-bold text-gray-900">Total</span>
                  <span className="text-base font-bold text-gray-900">PKR {total.toLocaleString()}</span>
                </div>

                {submitError && <p className="text-xs text-red-500 mb-2 text-center">{submitError}</p>}

                <button type="submit" disabled={isSubmitting}
                  className={`w-full py-3 rounded-full text-sm font-bold text-white transition shadow-sm ${isSubmitting ? 'bg-green-600 opacity-70 cursor-not-allowed' : 'bg-green-700 hover:bg-green-600 hover:shadow-md'}`}>
                  {isSubmitting ? (
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