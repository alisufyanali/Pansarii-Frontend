"use client";

import { Suspense, useEffect, useRef, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { FaCheckCircle, FaBox, FaTruck, FaDownload, FaHome, FaStore, FaWhatsapp } from 'react-icons/fa';
import { FiPackage } from 'react-icons/fi';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getOrderById, trackOrder, type ApiOrder } from '@/lib/orders';
import { normalizePkPhone } from '@/lib/phone';
import Invoice, { type InvoiceData, type PaymentStatus } from '@/components/Invoice/Invoice';

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatDate(dateStr: string): string {
  try {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric', month: 'long', day: 'numeric',
    });
  } catch {
    return dateStr;
  }
}

function estimatedDelivery(createdAt: string): string {
  try {
    const d = new Date(createdAt);
    d.setDate(d.getDate() + 5);
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  } catch {
    return '5-7 business days';
  }
}

function toInvoiceData(order: ApiOrder): InvoiceData {
  // ── Customer name ──────────────────────────────────────────────────────────
  // Priority:
  //   1. API field customer_name  — auth orders (backend now returns this)
  //   2. _customer_name           — guest orders (saved to sessionStorage at checkout)
  //   3. First segment of shipping_address before the first comma (legacy fallback)
  //   4. Literal 'Customer' if all else is empty
  const raw = order.shipping_address || '';
  const firstComma = raw.indexOf(',');
  const nameFromAddress = firstComma !== -1 ? raw.slice(0, firstComma).trim() : raw.trim();
  const streetRaw = firstComma !== -1 ? raw.slice(firstComma + 1).trim() : raw;

  const customerName =
    order.customer_name?.trim()  ||   // ← API field (auth orders)
    order._customer_name?.trim() ||   // ← sessionStorage field (guest orders)
    nameFromAddress               ||
    'Customer';

  // ── Phone ──────────────────────────────────────────────────────────────────
  const phone =
    order.customer_phone?.trim()  ||  // ← API field (auth orders)
    order._customer_phone?.trim() ||  // ← sessionStorage field (guest orders)
    '';

  // ── Email ──────────────────────────────────────────────────────────────────
  const customerEmail =
    order.customer_email?.trim()  ||  // ← API field (auth orders)
    order._customer_email?.trim() ||  // ← sessionStorage field (guest orders)
    '';

  // ── Order note ────────────────────────────────────────────────────────────
  const orderNote =
    order._order_note ||
    (typeof order.order_note === 'string' ? order.order_note : '') ||
    '';

  // ── Street address ─────────────────────────────────────────────────────────
  // The API provides a separate `order.city` field, so we must NOT duplicate
  // the city name inside `address` (which is displayed on its own line).
  // Strategy: strip the city name from the tail of `streetRaw` if present,
  // then trim any trailing commas/whitespace. This avoids the invoice showing
  // "Street, Karachi" on one line followed by "Karachi" on a duplicate line.
  const apiCity = (order.city || '').trim();
  let streetOnly = streetRaw.trim();

  // 1. If streetRaw ends with ", CityName" — strip that trailing segment
  if (apiCity) {
    const trailingCommaCity = new RegExp(
      `,\\s*${apiCity.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*$`,
      'i',
    );
    streetOnly = streetOnly.replace(trailingCommaCity, '').trim();
    // Also strip bare trailing city name (no comma needed if it's the whole thing)
    const bareCity = new RegExp(
      `^${apiCity.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*$`,
      'i',
    );
    if (bareCity.test(streetOnly)) streetOnly = '';
    // Strip trailing comma + country/region if present (e.g. ", Pakistan")
    // — common case where backend stored "Karachi, Pakistan" as shipping_address
    streetOnly = streetOnly.replace(/,\s*[^,]+$/, '').trim();
  }

  // 2. Cleanup any empty trailing comma artifacts
  streetOnly = streetOnly.replace(/,\s*,/g, ',').replace(/^,|,$/g, '').trim();

  const address = {
    name:    customerName,
    address: streetOnly,
    city:    apiCity,
    phone:        phone         || undefined,
    email:        customerEmail || undefined,
    deliveryNote: orderNote     || undefined,
  };
  return {
    orderId:           String(order.order_number),
    orderDate:         formatDate(order.created_at),
    estimatedDelivery: estimatedDelivery(order.created_at),
    paymentStatus:     (order.payment_status === 'paid' ? 'paid' : 'pending') as PaymentStatus,
    paymentMethod:     order.payment_method || 'Cash on Delivery',
    items: (order.items || []).map(i => ({
      id:       i.id,
      nameEn:   i.product_name,
      price:    i.price,
      quantity: i.quantity,
      size:     i.variant_name || 'Default',
      img:      i.thumbnail || '/images/product.png',
    })),
    subtotal:        order.subtotal,
    discount:        order.discount,
    shipping:        order.shipping,
    tax:             order.tax,
    total:           order.grand_total,
    billingAddress:  address,
    shippingAddress: address,
    logoUrl:         '/images/logo.png',
    companyName:     'Pansari Inn',
    companyTagline:  'Premium Quality Products',
    companyEmail:    'chat@pansariinn.com',
  };
}

// ── Timeline ──────────────────────────────────────────────────────────────────

const STEPS = [
  { icon: FaCheckCircle, label: 'Order Confirmed', sub: 'Your order has been received' },
  { icon: FiPackage,     label: 'Processing',      sub: "We're preparing your items"   },
  { icon: FaTruck,       label: 'Shipped',          sub: 'Your order is on the way'     },
  { icon: FaBox,         label: 'Delivered',        sub: ''                             },
];

const STATUS_STEP_INDEX: Record<string, number> = {
  pending:    0,
  processing: 1,
  shipped:    2,
  delivered:  3,
  cancelled:  0,  // show first step for cancelled (nothing progressed)
};

function Timeline({ orderDate, estDelivery, status }: { orderDate: string; estDelivery: string; status: string }) {
  // Derive which step is active from the live order.status field.
  // Previously this always hardcoded index 0, ignoring the actual status.
  const activeIndex = STATUS_STEP_INDEX[status?.toLowerCase()] ?? 0;
  const isCancelled = status?.toLowerCase() === 'cancelled';

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 print:hidden">
      <h2 className="text-sm font-bold text-gray-900 mb-5">Order Status</h2>
      {isCancelled && (
        <div className="mb-4 px-3 py-2 bg-red-50 border border-red-200 rounded-lg text-xs text-red-600 font-medium">
          This order has been cancelled.
        </div>
      )}
      {STEPS.map(({ icon: Icon, label, sub }, i) => {
        const isActive  = i === activeIndex && !isCancelled;
        const isDone    = i < activeIndex && !isCancelled;
        const isLast    = i === STEPS.length - 1;
        return (
          <div key={label} className="flex gap-3">
            <div className="flex flex-col items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                isDone   ? 'bg-green-600' :
                isActive ? 'bg-green-100' :
                           'bg-gray-100'
              }`}>
                <Icon className={`w-3.5 h-3.5 ${
                  isDone   ? 'text-white'  :
                  isActive ? 'text-green-600' :
                             'text-gray-400'
                }`} />
              </div>
              {!isLast && <div className={`w-px flex-1 my-1 ${isDone ? 'bg-green-300' : 'bg-gray-200'}`} />}
            </div>
            <div className={`${isLast ? 'pb-0' : 'pb-5'}`}>
              <p className={`text-xs font-semibold ${isActive || isDone ? 'text-gray-900' : 'text-gray-400'}`}>{label}</p>
              <p className={`text-xs mt-0.5 ${isActive || isDone ? 'text-gray-500' : 'text-gray-400'}`}>
                {i === 0 ? orderDate : i === 3 ? `Expected: ${estDelivery}` : sub}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ── Skeleton ──────────────────────────────────────────────────────────────────

function OrderConfirmationLoading() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 py-8 animate-pulse">
        <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6 flex flex-col items-center gap-3">
          <div className="w-14 h-14 bg-gray-200 rounded-full" />
          <div className="h-5 w-36 bg-gray-200 rounded" />
          <div className="h-4 w-56 bg-gray-200 rounded" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl border border-gray-200 p-8 space-y-4">
              {[...Array(4)].map((_, i) => <div key={i} className="h-8 bg-gray-200 rounded w-full" />)}
            </div>
          </div>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => <div key={i} className="h-10 bg-gray-200 rounded-lg" />)}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Main content ──────────────────────────────────────────────────────────────

function OrderConfirmationContent() {
  const searchParams = useSearchParams();
  const router       = useRouter();
  const printRef     = useRef<HTMLDivElement>(null);
  const fetchRanRef  = useRef(false);

  const [order,      setOrder]      = useState<ApiOrder | null>(null);
  const [fetchError, setFetchError] = useState('');
  const [loading,    setLoading]    = useState(true);

  // ── Phone-re-entry fallback UI (guest mode, URL missing phone param) ──
  const [needsPhoneEntry, setNeedsPhoneEntry] = useState(false);
  const [entryPhone,       setEntryPhone]       = useState('');
  const [entryOrderNumber, setEntryOrderNumber] = useState('');
  const [entryLoading,     setEntryLoading]     = useState(false);
  const [entryError,       setEntryError]       = useState('');

  useEffect(() => {
    if (fetchRanRef.current) return;
    fetchRanRef.current = true;

    const orderIdRaw   = searchParams.get('orderId');
    const orderNumber  = searchParams.get('order_number');
    const mode         = (searchParams.get('mode') as 'guest' | 'auth' | null) ?? null;
    const phone        = searchParams.get('phone') ?? '';
    const email        = searchParams.get('email') ?? '';

    if (!orderIdRaw) { router.push('/'); return; }

    const orderId = Number(orderIdRaw);
    if (isNaN(orderId)) {
      const frame = requestAnimationFrame(() => {
        setFetchError('Invalid order ID.');
        setLoading(false);
      });
      return () => cancelAnimationFrame(frame);
    }

    let cancelled = false;

    // ── Guest orders: prefer sessionStorage cache ──────────────────────────
    try {
      const cached = sessionStorage.getItem('last-guest-order');
      if (cached) {
        const parsed = JSON.parse(cached) as ApiOrder;
        if (parsed.id === orderId || (orderNumber && parsed.order_number === orderNumber)) {
          setOrder(parsed);
          setLoading(false);
          return;
        }
      }
    } catch {
      // fall through to API fetch
    }

    // ── API fallback ──────────────────────────────────────────────────────
    const resolveOrder = async (): Promise<ApiOrder> => {
      if (mode === 'guest') {
        // Guests are not authenticated — use the public track endpoint
        // with order_number + phone ONLY (email is NOT supported by backend,
        // see GET /api/orders/track contract).
        if (orderNumber) {
          const cleanPhone = normalizePkPhone(phone);
          if (cleanPhone) {
            // Always phone-only lookup — no email fallback
            return await trackOrder(orderNumber, cleanPhone, 'phone');
          }
          // Phone is missing from URL params: surface the phone re-entry UI.
          throw new Error('__NEEDS_PHONE_ENTRY__');
        }
        // Fallback without order_number — attempt authenticated fetch
        // (will 401 if no token, but interceptor skips redirect on this page).
        return await getOrderById(orderId);
      }

      // Authenticated mode — use standard auth fetch
      return await getOrderById(orderId);
    };

    resolveOrder()
      .then(data => { if (!cancelled) setOrder(data); })
      .catch(err => {
        if (cancelled) return;
        const msg = err instanceof Error ? err.message : '';
        if (msg === '__NEEDS_PHONE_ENTRY__') {
          setNeedsPhoneEntry(true);
          setEntryOrderNumber(orderNumber ?? '');
          return;
        }
        setFetchError(
          'Could not load order details. The order may not exist or you may not have permission to view it.',
        );
      })
      .finally(() => { if (!cancelled) setLoading(false); });

    return () => { cancelled = true; };
  }, [searchParams, router]);

  const handleDownload = () => {
    if (!order || !printRef.current) return;
    const win = window.open('', '_blank');
    if (!win) { toast.warning('Please allow popups to download the invoice'); return; }
    const html = `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"/><title>Invoice — ${order.order_number}</title><style>*{box-sizing:border-box;margin:0;padding:0}body{font-family:Arial,sans-serif;background:#fff}@media print{.inv-no-print{display:none!important}}</style></head><body>${printRef.current.innerHTML}</body></html>`;
    win.document.open(); win.document.write(html); win.document.close();
    win.onload = () => win.print();
  };

  const handlePhoneEntrySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEntryError('');
    const cleanPhone = normalizePkPhone(entryPhone);
    if (!cleanPhone) {
      setEntryError('Please enter a valid Pakistan phone number (e.g. 03XX-XXXXXXX)');
      return;
    }
    setEntryLoading(true);
    try {
      const data = await trackOrder(entryOrderNumber, cleanPhone, 'phone');
      setOrder(data);
      setNeedsPhoneEntry(false);
    } catch (_err) {
      setEntryError(
        'We could not find your order with this phone number. Please double-check the phone number you used at checkout, or contact support.',
      );
    } finally {
      setEntryLoading(false);
    }
  };

  if (loading) return <OrderConfirmationLoading />;

  // Phone re-entry fallback UI
  if (needsPhoneEntry) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-10 print:hidden">
        <div className="w-full max-w-md bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
          <div className="flex flex-col items-center text-center mb-5">
            <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mb-3">
              <FaBox className="w-6 h-6 text-amber-600" />
            </div>
            <h2 className="text-lg font-bold text-gray-900 mb-1">Confirm your phone number</h2>
            <p className="text-sm text-gray-500">
              We need the phone number you used at checkout to verify your guest order.
              {entryOrderNumber && (
                <span className="block mt-1 text-gray-600">
                  Order: <span className="font-semibold text-gray-800">#{entryOrderNumber}</span>
                </span>
              )}
            </p>
          </div>

          <form onSubmit={handlePhoneEntrySubmit} className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
                Phone Number *
              </label>
              <input
                type="tel"
                inputMode="tel"
                value={entryPhone}
                onChange={e => { setEntryPhone(e.target.value); setEntryError(''); }}
                placeholder="03XX-XXXXXXX or +923XX-XXXXXXX"
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-700/20 focus:border-green-600 transition bg-white"
                autoFocus
              />
            </div>
            {entryError && (
              <p className="text-xs text-red-500 bg-red-50 border border-red-100 rounded-md px-3 py-2">
                {entryError}
              </p>
            )}
            <button
              type="submit"
              disabled={entryLoading}
              className={`w-full py-2.5 rounded-lg text-sm font-bold text-white transition ${entryLoading ? 'bg-green-600 opacity-70 cursor-not-allowed' : 'bg-green-700 hover:bg-green-600'}`}
            >
              {entryLoading ? 'Verifying…' : 'Verify & View Order'}
            </button>
            <div className="pt-1 flex flex-col gap-2 text-xs">
              <Link
                href="/track-order"
                className="text-center text-gray-500 hover:text-gray-700 underline-offset-2 hover:underline"
              >
                Go to Track Order page
              </Link>
              <Link
                href="/shop"
                className="text-center text-green-700 font-semibold hover:text-green-600"
              >
                ← Back to shop
              </Link>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // Error state
  if (fetchError || !order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center max-w-sm">
          <div className="text-5xl mb-4">📦</div>
          <h2 className="text-lg font-bold text-gray-900 mb-2">Order not found</h2>
          <p className="text-sm text-gray-500 mb-6">{fetchError || 'The order could not be loaded.'}</p>
          <Link href="/orders" className="inline-block px-6 py-2.5 bg-green-700 text-white text-sm font-semibold rounded-full hover:bg-green-600 transition">
            View My Orders
          </Link>
        </div>
      </div>
    );
  }

  const invoiceData = toInvoiceData(order);
  const orderDate   = formatDate(order.created_at);
  const estDelivery = estimatedDelivery(order.created_at);

  return (
    <div className="min-h-screen bg-gray-50 print:bg-white">
      <div className="max-w-5xl mx-auto px-4 py-8">

        {/* Success banner */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6 text-center print:hidden">
          <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <FaCheckCircle className="w-7 h-7 text-green-600" />
          </div>
          <h1 className="text-xl font-bold text-gray-900 mb-1">Order Confirmed!</h1>
          <p className="text-sm text-gray-500">
            Order <span className="font-semibold text-gray-700">#{order.order_number}</span> has been placed successfully.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Invoice */}
          <div className="lg:col-span-2">
            <div ref={printRef} style={{ position: 'absolute', left: -9999, top: 0, width: 800 }} aria-hidden>
              <Invoice data={invoiceData} />
            </div>
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <Invoice data={invoiceData} />
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-4 print:hidden">
            <div className="space-y-2">
              <button onClick={handleDownload}
                className="w-full py-2.5 bg-green-700 hover:bg-green-600 text-white rounded-lg font-medium text-sm flex items-center justify-center gap-2 transition-colors">
                <FaDownload className="w-3.5 h-3.5" /> Download Invoice
              </button>
              <a
                href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}?text=${encodeURIComponent(
                  `Hi! I'd like to confirm my order.\n\nOrder Number: ${order.order_number}\n\nPlease confirm this order. Thank you!`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 bg-[#25D366] hover:bg-[#1da851] text-white rounded-lg font-medium text-sm flex items-center justify-center gap-2 transition-colors"
              >
                <FaWhatsapp className="w-4 h-4" /> Confirm via WhatsApp
              </a>
              <Link href="/orders"
                className="w-full py-2.5 border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg font-medium text-sm flex items-center justify-center gap-2 transition-colors">
                View My Orders
              </Link>
              <Link href="/shop"
                className="w-full py-2.5 border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg font-medium text-sm flex items-center justify-center gap-2 transition-colors">
                <FaStore className="w-3.5 h-3.5" /> Continue Shopping
              </Link>
              <Link href="/"
                className="w-full py-2.5 text-gray-500 hover:text-gray-700 rounded-lg font-medium text-sm flex items-center justify-center gap-2 transition-colors">
                <FaHome className="w-3.5 h-3.5" /> Back to Home
              </Link>
            </div>
            <Timeline orderDate={orderDate} estDelivery={estDelivery} status={order.status} />
          </div>
        </div>
      </div>
      <ToastContainer position="top-right" autoClose={3000} theme="light" />
    </div>
  );
}

export default function OrderConfirmationPage() {
  return (
    <Suspense fallback={<OrderConfirmationLoading />}>
      <OrderConfirmationContent />
    </Suspense>
  );
}
