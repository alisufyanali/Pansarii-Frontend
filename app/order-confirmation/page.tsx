"use client";

import { Suspense, useEffect, useRef, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { FaCheckCircle, FaBox, FaTruck, FaDownload, FaHome, FaStore } from 'react-icons/fa';
import { FiPackage } from 'react-icons/fi';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getOrderById, type ApiOrder } from '@/lib/orders';
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
  const address = {
    name:    order.shipping_address || 'Customer',
    address: order.shipping_address || '',
    city:    order.city || '',
    phone:   '',
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
    companyName:     'Pansari Inn',
    companyTagline:  'Premium Quality Products',
    companyEmail:    'support@pansariinn.com',
  };
}

// ── Timeline ──────────────────────────────────────────────────────────────────

const STEPS = [
  { icon: FaCheckCircle, label: 'Order Confirmed', sub: 'Your order has been received' },
  { icon: FiPackage,     label: 'Processing',      sub: "We're preparing your items"   },
  { icon: FaTruck,       label: 'Shipped',          sub: 'Your order is on the way'     },
  { icon: FaBox,         label: 'Delivered',        sub: ''                             },
];

function Timeline({ orderDate, estDelivery }: { orderDate: string; estDelivery: string }) {
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

  const [order,      setOrder]      = useState<ApiOrder | null>(null);
  const [fetchError, setFetchError] = useState('');
  const [loading,    setLoading]    = useState(true);

  useEffect(() => {
    const orderIdRaw = searchParams.get('orderId');
    if (!orderIdRaw) { router.push('/'); return; }

    const orderId = Number(orderIdRaw);
    if (isNaN(orderId)) { setFetchError('Invalid order ID.'); setLoading(false); return; }

    getOrderById(orderId)
      .then(data => setOrder(data))
      .catch(() => setFetchError('Could not load order details. The order may not exist or you may not have permission to view it.'))
      .finally(() => setLoading(false));
  }, [searchParams, router]);

  const handleDownload = () => {
    if (!order || !printRef.current) return;
    const win = window.open('', '_blank');
    if (!win) { toast.warning('Please allow popups to download the invoice'); return; }
    const html = `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"/><title>Invoice — ${order.order_number}</title><style>*{box-sizing:border-box;margin:0;padding:0}body{font-family:Arial,sans-serif;background:#fff}@media print{.inv-no-print{display:none!important}}</style></head><body>${printRef.current.innerHTML}</body></html>`;
    win.document.open(); win.document.write(html); win.document.close();
    win.onload = () => win.print();
  };

  if (loading) return <OrderConfirmationLoading />;

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
            <Timeline orderDate={orderDate} estDelivery={estDelivery} />
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
