"use client";

import { useEffect, useState } from 'react';
import SafeImage from '@/components/SafeImage';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  RiArrowLeftLine, RiShoppingCartLine, RiShoppingBagLine,
} from 'react-icons/ri';
import { getOrders, type ApiOrder } from '@/lib/orders';

// ── Status config (Steps 7) ───────────────────────────────────────────────────

type OrderStatus   = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
type PaymentStatus = 'unpaid' | 'paid' | 'refunded';

const STATUS_CONFIG: Record<OrderStatus, { label: string; bg: string; text: string }> = {
  pending:    { label: 'Pending',    bg: 'bg-yellow-100', text: 'text-yellow-700' },
  processing: { label: 'Processing', bg: 'bg-blue-100',   text: 'text-blue-700'   },
  shipped:    { label: 'Shipped',    bg: 'bg-purple-100', text: 'text-purple-700' },
  delivered:  { label: 'Delivered',  bg: 'bg-green-100',  text: 'text-green-700'  },
  cancelled:  { label: 'Cancelled',  bg: 'bg-red-100',    text: 'text-red-600'    },
};

const PAYMENT_CONFIG: Record<PaymentStatus, { label: string; bg: string; text: string }> = {
  unpaid:   { label: 'Unpaid',   bg: 'bg-red-100',  text: 'text-red-600'   },
  paid:     { label: 'Paid',     bg: 'bg-green-100',text: 'text-green-700' },
  refunded: { label: 'Refunded', bg: 'bg-gray-100', text: 'text-gray-600'  },
};

function StatusBadge({ status }: { status: OrderStatus }) {
  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.pending;
  return <span className={`text-[11px] font-semibold px-3 py-1 rounded-full ${cfg.bg} ${cfg.text}`}>{cfg.label}</span>;
}

function PaymentBadge({ status }: { status: PaymentStatus }) {
  const cfg = PAYMENT_CONFIG[status] ?? PAYMENT_CONFIG.unpaid;
  return <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${cfg.bg} ${cfg.text}`}>{cfg.label}</span>;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatDate(dateStr: string): string {
  try {
    return new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  } catch { return dateStr; }
}

// ── Skeleton ──────────────────────────────────────────────────────────────────

function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-4 animate-pulse">
      <div className="flex justify-between mb-2">
        <div className="space-y-1.5">
          <div className="h-4 w-28 bg-gray-200 rounded" />
          <div className="h-3 w-20 bg-gray-200 rounded" />
        </div>
        <div className="h-6 w-20 bg-gray-200 rounded-full" />
      </div>
      <div className="flex gap-2 my-3">
        <div className="w-14 h-14 bg-gray-200 rounded-xl" />
        <div className="w-14 h-14 bg-gray-200 rounded-xl" />
      </div>
      <div className="h-px bg-gray-100 mb-3" />
      <div className="flex justify-between">
        <div className="h-3 w-20 bg-gray-200 rounded" />
        <div className="h-4 w-24 bg-gray-200 rounded" />
      </div>
    </div>
  );
}

// ── Order card ────────────────────────────────────────────────────────────────

function OrderCard({ order }: { order: ApiOrder }) {
  const status        = (order.status        || 'pending')  as OrderStatus;
  const paymentStatus = (order.payment_status || 'unpaid') as PaymentStatus;

  const items = order.items || [];
  const visibleItems = items.slice(0, 2);
  const extraCount   = items.length - visibleItems.length;

  const cancellable = status === 'pending' || status === 'processing';

  return (
    <Link
      href={`/order-confirmation?orderId=${order.id}`}
      className="block bg-white rounded-2xl shadow-sm border border-gray-100 p-4 active:bg-gray-50 transition-colors"
    >
      {/* Top row */}
      <div className="flex items-start justify-between mb-1">
        <div>
          <p className="text-sm font-bold text-green-700">#{order.order_number}</p>
          <p className="text-[11px] text-gray-400 mt-0.5">{formatDate(order.created_at)}</p>
        </div>
        <div className="flex flex-col items-end gap-1">
          <StatusBadge status={status} />
          <PaymentBadge status={paymentStatus} />
        </div>
      </div>

      {/* Item thumbnails */}
      {visibleItems.length > 0 && (
        <div className="flex items-center gap-2 my-3">
          {visibleItems.map(item => (
            <div key={item.id} className="w-14 h-14 rounded-xl overflow-hidden bg-gray-100 border border-gray-200 flex-shrink-0">
              <SafeImage
                src={item.thumbnail || '/images/product.png'}
                alt={item.product_name}
                width={56} height={56}
                className="object-cover w-full h-full"
              />
            </div>
          ))}
          {extraCount > 0 && (
            <div className="w-14 h-14 rounded-xl bg-gray-100 border border-gray-200 flex items-center justify-center flex-shrink-0">
              <span className="text-xs font-semibold text-gray-500">+{extraCount}</span>
            </div>
          )}
        </div>
      )}

      <div className="h-px bg-gray-100 mb-3" />

      {/* Total + cancel */}
      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-400 font-medium">Total Amount</span>
        <span className="text-sm font-bold text-gray-900">PKR {order.grand_total.toLocaleString()}</span>
      </div>

      {cancellable && (
        <div className="mt-2 flex justify-end">
          <Link
            href={`/cancel-order?orderId=${order.id}`}
            onClick={e => e.stopPropagation()}
            className="text-xs font-semibold text-red-500 hover:text-red-600 underline underline-offset-2"
          >
            Cancel Order
          </Link>
        </div>
      )}
    </Link>
  );
}

// ── Pagination ────────────────────────────────────────────────────────────────

function Pagination({ current, total, onChange }: { current: number; total: number; onChange: (p: number) => void }) {
  if (total <= 1) return null;
  return (
    <div className="flex items-center justify-center gap-2 mt-4 pb-4">
      <button onClick={() => onChange(current - 1)} disabled={current === 1}
        className="px-3 py-1.5 text-xs border border-gray-200 rounded-lg disabled:opacity-40 hover:bg-gray-50">
        ← Prev
      </button>
      <span className="text-xs text-gray-500">Page {current} of {total}</span>
      <button onClick={() => onChange(current + 1)} disabled={current === total}
        className="px-3 py-1.5 text-xs border border-gray-200 rounded-lg disabled:opacity-40 hover:bg-gray-50">
        Next →
      </button>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function OrderHistoryPage() {
  const router = useRouter();
  const [orders,      setOrders]     = useState<ApiOrder[]>([]);
  const [isLoading,   setIsLoading]  = useState(true);
  const [error,       setError]      = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages,  setTotalPages] = useState(1);

  useEffect(() => {
    setIsLoading(true);
    setError('');
    getOrders(currentPage, 10)
      .then(res => {
        setOrders(res.data || []);
        setTotalPages(res.meta?.last_page || 1);
      })
      .catch(() => setError('Could not load orders. Please try again.'))
      .finally(() => setIsLoading(false));
  }, [currentPage]);

  const inTransit = orders.filter(o =>
    o.status === 'shipped' || o.status === 'processing'
  ).length;

  // ── Loading ────────────────────────────────────────────────────────────────

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 pb-28">
        <div className="bg-white px-4 pt-5 pb-4 flex items-center gap-3 border-b border-gray-100">
          <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse" />
          <div className="h-5 w-32 bg-gray-200 rounded animate-pulse" />
        </div>
        <div className="px-4 pt-4 grid grid-cols-2 gap-3 mb-4">
          <div className="h-20 bg-gray-200 rounded-2xl animate-pulse" />
          <div className="h-20 bg-gray-200 rounded-2xl animate-pulse" />
        </div>
        <div className="px-4 space-y-3">
          {[...Array(3)].map((_, i) => <SkeletonCard key={i} />)}
        </div>
      </div>
    );
  }

  // ── Error ──────────────────────────────────────────────────────────────────

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 pb-28 flex flex-col">
        <div className="bg-white px-4 pt-5 pb-4 flex items-center gap-3 border-b border-gray-100">
          <button onClick={() => router.back()} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center" aria-label="Go back">
            <RiArrowLeftLine className="w-4 h-4 text-gray-700" />
          </button>
          <h1 className="text-base font-bold text-gray-900">Order History</h1>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center px-8 text-center gap-4">
          <p className="text-sm text-red-500">{error}</p>
          <button onClick={() => setCurrentPage(1)} className="px-6 py-2.5 bg-green-600 text-white text-sm font-semibold rounded-2xl">
            Retry
          </button>
        </div>
      </div>
    );
  }

  // ── Empty ──────────────────────────────────────────────────────────────────

  if (orders.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 pb-28 flex flex-col">
        <div className="bg-white px-4 pt-5 pb-4 flex items-center justify-between border-b border-gray-100">
          <div className="flex items-center gap-3">
            <button onClick={() => router.back()} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center" aria-label="Go back">
              <RiArrowLeftLine className="w-4 h-4 text-gray-700" />
            </button>
            <h1 className="text-base font-bold text-gray-900">Order History</h1>
          </div>
          <Link href="/cart" aria-label="Cart"><RiShoppingCartLine className="w-5 h-5 text-gray-600" /></Link>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center px-8 text-center gap-4">
          <div className="w-20 h-20 rounded-full bg-green-50 flex items-center justify-center">
            <RiShoppingBagLine className="w-10 h-10 text-green-300" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900 mb-1">No orders yet</h2>
            <p className="text-sm text-gray-500">Your order history will appear here once you place an order.</p>
          </div>
          <Link href="/shop" className="mt-2 px-6 py-3 bg-green-600 text-white text-sm font-semibold rounded-2xl">
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  // ── Filled ─────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-gray-50 pb-28">

      {/* Header */}
      <div className="bg-white px-4 pt-5 pb-4 flex items-center justify-between border-b border-gray-100">
        <div className="flex items-center gap-3">
          <button onClick={() => router.back()} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center" aria-label="Go back">
            <RiArrowLeftLine className="w-4 h-4 text-gray-700" />
          </button>
          <h1 className="text-base font-bold text-gray-900">Order History</h1>
        </div>
        <Link href="/cart" aria-label="Cart"><RiShoppingCartLine className="w-5 h-5 text-gray-600" /></Link>
      </div>

      {/* Stats */}
      <div className="px-4 pt-4 grid grid-cols-2 gap-3 mb-4">
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <p className="text-[11px] text-gray-400 font-medium mb-1">Total Orders</p>
          <p className="text-2xl font-black text-gray-900">{String(orders.length).padStart(2, '0')}</p>
        </div>
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <p className="text-[11px] text-gray-400 font-medium mb-1">In Transit</p>
          <p className="text-2xl font-black text-green-600">{String(inTransit).padStart(2, '0')}</p>
        </div>
      </div>

      {/* Order cards */}
      <div className="px-4 space-y-3">
        {orders.map(order => <OrderCard key={order.id} order={order} />)}
      </div>

      {/* Pagination */}
      <div className="px-4">
        <Pagination current={currentPage} total={totalPages} onChange={setCurrentPage} />
      </div>
    </div>
  );
}
