"use client";

import { Suspense, useEffect, useRef, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  FaCheckCircle,
  FaBox,
  FaTruck,
  FaDownload,
  FaHome,
  FaStore,
} from 'react-icons/fa';
import { FiPackage } from 'react-icons/fi';
import Invoice, { type InvoiceData, type PaymentStatus } from '@/components/Invoice/Invoice';
import { api, getApiErrorMessage } from '@/lib/axios';

// ── Types ─────────────────────────────────────────────────────────────────────

/**
 * Shape returned by the Laravel API (or stored in localStorage).
 * billingAddress is optional — falls back to shippingAddress when absent
 * (common for COD orders where billing = shipping).
 */
interface OrderDetails {
  orderId: string;
  orderDate: string;
  dueDate?: string;
  estimatedDelivery: string;
  items: {
    id: number;
    nameEn: string;
    price: number;
    quantity: number;
    size: string;
    img: string;
  }[];
  subtotal: number;
  discount: number;
  shipping: number;
  tax: number;
  total: number;
  paymentStatus: PaymentStatus;
  paymentMethod: string;
  shippingAddress: {
    name: string;
    phone: string;
    email: string;
    address: string;
    city: string;
    postalCode?: string;
    deliveryNote?: string;
  };
  billingAddress?: {
    name: string;
    phone?: string;
    email?: string;
    address: string;
    city: string;
    postalCode?: string;
  };
}

// ── Map API order → InvoiceData ───────────────────────────────────────────────

function toInvoiceData(order: OrderDetails): InvoiceData {
  const billing = order.billingAddress ?? order.shippingAddress;
  return {
    orderId: order.orderId,
    orderDate: order.orderDate,
    dueDate: order.dueDate,
    estimatedDelivery: order.estimatedDelivery,
    paymentStatus: order.paymentStatus,
    paymentMethod: order.paymentMethod,
    items: order.items,
    subtotal: order.subtotal,
    discount: order.discount,
    shipping: order.shipping,
    tax: order.tax,
    total: order.total,
    billingAddress: {
      name: billing.name,
      address: billing.address,
      city: billing.city,
      postalCode: billing.postalCode,
      phone: billing.phone,
      email: billing.email,
    },
    shippingAddress: {
      name: order.shippingAddress.name,
      address: order.shippingAddress.address,
      city: order.shippingAddress.city,
      postalCode: order.shippingAddress.postalCode,
      phone: order.shippingAddress.phone,
      deliveryNote: order.shippingAddress.deliveryNote,
    },
    companyName: 'Pansari Inn',
    companyTagline: 'Premium Quality Products',
    companyEmail: 'support@pansariinn.com',
    // logoUrl: '/images/logo.png',  ← uncomment when logo asset is available
  };
}

// ── Timeline ──────────────────────────────────────────────────────────────────

const STEPS = [
  { icon: FaCheckCircle, label: 'Order Confirmed', sub: 'Your order has been received' },
  { icon: FiPackage,     label: 'Processing',      sub: "We're preparing your items"   },
  { icon: FaTruck,       label: 'Shipped',          sub: 'Your order is on the way'     },
  { icon: FaBox,         label: 'Delivered',        sub: ''                             },
];

function Timeline({ orderDate, estimatedDelivery }: { orderDate: string; estimatedDelivery: string }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 print:hidden">
      <h2 className="text-sm font-bold text-gray-900 mb-5">Order Status</h2>
      {STEPS.map(({ icon: Icon, label, sub }, i) => {
        const active = i === 0;
        const isLast = i === STEPS.length - 1;
        return (
          <div key={label} className="flex gap-3">
            <div className="flex flex-col items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${active ? 'bg-green-100' : 'bg-gray-100'}`}>
                <Icon className={`w-3.5 h-3.5 ${active ? 'text-green-600' : 'text-gray-400'}`} />
              </div>
              {!isLast && <div className="w-px flex-1 bg-gray-200 my-1" />}
            </div>
            <div className={`${isLast ? 'pb-0' : 'pb-5'}`}>
              <p className={`text-xs font-semibold ${active ? 'text-gray-900' : 'text-gray-400'}`}>{label}</p>
              <p className={`text-xs mt-0.5 ${active ? 'text-gray-500' : 'text-gray-400'}`}>
                {i === 0 ? orderDate : i === 3 ? `Expected: ${estimatedDelivery}` : sub}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ── Main content ──────────────────────────────────────────────────────────────

function OrderConfirmationContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [mounted, setMounted] = useState(false);
  const [fetchError, setFetchError] = useState('');
  const printRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    const orderId = searchParams.get('orderId');
    if (!orderId) { router.push('/'); return; }

    async function fetchOrder() {
      try {
        // Try API first
        const data = await api.get<OrderDetails>(`/orders/${orderId}`);
        setOrder({
          ...data,
          discount: data.discount ?? 0,
          tax: data.tax ?? 0,
          paymentStatus: data.paymentStatus ?? 'pending',
        });
        // Cache locally for offline/fallback use
        localStorage.setItem(`order-${orderId}`, JSON.stringify(data));
      } catch (err) {
        console.warn('Order confirmation API failed, using localStorage fallback:', getApiErrorMessage(err));
        // Fall back to localStorage
        const saved = localStorage.getItem(`order-${orderId}`);
        if (saved) {
          try {
            const parsed = JSON.parse(saved);
            setOrder({ discount: 0, tax: 0, paymentStatus: 'pending', ...parsed });
          } catch {
            setFetchError('Could not load order details.');
          }
        } else {
          setFetchError(getApiErrorMessage(err));
        }
      }
    }

    fetchOrder();
    localStorage.removeItem('pansari-cart');
  }, [searchParams, router]);

  /**
   * Opens a new window, renders the Invoice component HTML into it,
   * then triggers the browser print dialog.
   * Uses innerHTML of the hidden print-target div to avoid document.write.
   */
  const handleDownload = () => {
    if (!order || !printRef.current) return;
    const win = window.open('', '_blank');
    if (!win) { alert('Please allow popups to download the invoice'); return; }

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Invoice — ${order.orderId}</title>
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: Arial, Helvetica, sans-serif; background: #fff; }
    @media print {
      body { margin: 0; }
      .inv-no-print { display: none !important; }
    }
  </style>
</head>
<body>${printRef.current.innerHTML}</body>
</html>`;

    win.document.open();
    win.document.write(html);
    win.document.close();
    win.onload = () => win.print();
  };

  if (!mounted || !order) return <OrderConfirmationLoading />;

  if (fetchError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center max-w-sm">
          <p className="text-sm text-red-500 mb-4">{fetchError}</p>
          <button onClick={() => window.location.reload()} className="px-6 py-2.5 bg-green-600 text-white text-sm font-semibold rounded-full">
            Retry
          </button>
        </div>
      </div>
    );
  }

  const invoiceData = toInvoiceData(order);

  return (
    <div className="min-h-screen bg-gray-50 print:bg-white">
      <div className="max-w-5xl mx-auto px-4 py-8">

        {/* ── Success banner (screen only) ── */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6 text-center print:hidden">
          <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <FaCheckCircle className="w-7 h-7 text-green-600" />
          </div>
          <h1 className="text-xl font-bold text-gray-900 mb-1">Order Confirmed!</h1>
          <p className="text-sm text-gray-500">
            Thank you for your purchase. We'll start processing it right away.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* ── Invoice (main column) ── */}
          <div className="lg:col-span-2">
            {/* Hidden div used as print source — rendered off-screen */}
            <div ref={printRef} style={{ position: 'absolute', left: -9999, top: 0, width: 800 }} aria-hidden>
              <Invoice data={invoiceData} />
            </div>

            {/* Visible invoice card */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <Invoice data={invoiceData} />
            </div>
          </div>

          {/* ── Sidebar (screen only) ── */}
          <div className="lg:col-span-1 space-y-4 print:hidden">

            {/* Actions */}
            <div className="space-y-2">
              <button
                onClick={handleDownload}
                className="w-full py-2.5 bg-green-700 hover:bg-green-600 text-white rounded-lg font-medium text-sm flex items-center justify-center gap-2 transition-colors"
              >
                <FaDownload className="w-3.5 h-3.5" />
                Download / Print Invoice
              </button>
              <Link
                href="/shop"
                className="w-full py-2.5 border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg font-medium text-sm flex items-center justify-center gap-2 transition-colors"
              >
                <FaStore className="w-3.5 h-3.5" />
                Continue Shopping
              </Link>
              <Link
                href="/"
                className="w-full py-2.5 text-gray-500 hover:text-gray-700 rounded-lg font-medium text-sm flex items-center justify-center gap-2 transition-colors"
              >
                <FaHome className="w-3.5 h-3.5" />
                Back to Home
              </Link>
            </div>

            {/* Timeline */}
            <Timeline orderDate={order.orderDate} estimatedDelivery={order.estimatedDelivery} />
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Skeleton loader ───────────────────────────────────────────────────────────

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
              <div className="h-10 bg-gray-200 rounded w-full" />
              <div className="h-6 bg-gray-200 rounded w-3/4" />
              <div className="h-32 bg-gray-200 rounded w-full" />
              <div className="h-24 bg-gray-200 rounded w-full" />
            </div>
          </div>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-10 bg-gray-200 rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Page export ───────────────────────────────────────────────────────────────

export default function OrderConfirmationPage() {
  return (
    <Suspense fallback={<OrderConfirmationLoading />}>
      <OrderConfirmationContent />
    </Suspense>
  );
}
