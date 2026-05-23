"use client";

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { RiArrowLeftLine, RiShoppingCartLine, RiShoppingBagLine } from 'react-icons/ri';
import { api, getApiErrorMessage } from '@/lib/axios';

// ── Types ─────────────────────────────────────────────────────────────────────

type OrderStatus = 'delivered' | 'processing' | 'shipped' | 'cancelled' | 'pending';

interface OrderItem {
  id: string | number;
  nameEn: string;
  img: string;
  price: number;
  quantity: number;
  size: string;
}

interface Order {
  orderId: string;
  orderDate: string;
  estimatedDelivery: string;
  items: OrderItem[];
  total: number;
  paymentStatus: string;
  paymentMethod: string;
  status?: OrderStatus; // optional — derived from paymentStatus if absent
}

// ── Helpers ───────────────────────────────────────────────────────────────────

/** Derive a display status from stored order data */
function getStatus(order: Order): OrderStatus {
  if (order.status) return order.status;
  if (order.paymentStatus === 'paid') return 'delivered';
  if (order.paymentStatus === 'pending') return 'processing';
  return 'pending';
}

const STATUS_CONFIG: Record<
  OrderStatus,
  { label: string; bg: string; text: string }
> = {
  delivered:  { label: 'Delivered',  bg: 'bg-green-100',  text: 'text-green-700'  },
  processing: { label: 'Processing', bg: 'bg-green-500',   text: 'text-white'      },
  shipped:    { label: 'Shipped',    bg: 'bg-blue-100',   text: 'text-blue-700'   },
  cancelled:  { label: 'Cancelled',  bg: 'bg-red-100',    text: 'text-red-600'    },
  pending:    { label: 'Pending',    bg: 'bg-amber-100',  text: 'text-amber-700'  },
};

function fmt(n: number) {
  return `PKR ${n.toLocaleString()}`;
}

/** Read all orders saved by the checkout flow from localStorage */
function loadOrdersFromStorage(): Order[] {
  if (typeof window === 'undefined') return [];
  const orders: Order[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key?.startsWith('order-')) {
      try {
        const raw = localStorage.getItem(key);
        if (raw) orders.push(JSON.parse(raw));
      } catch {
        // skip malformed entries
      }
    }
  }
  // Sort newest first by orderId (lexicographic works for timestamp-based IDs)
  return orders.sort((a, b) => b.orderId.localeCompare(a.orderId));
}

// ── Status badge ──────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: OrderStatus }) {
  const cfg = STATUS_CONFIG[status];
  return (
    <span
      className={`text-[11px] font-semibold px-3 py-1 rounded-full ${cfg.bg} ${cfg.text}`}
    >
      {cfg.label}
    </span>
  );
}

// ── Order card ────────────────────────────────────────────────────────────────

function OrderCard({ order }: { order: Order }) {
  const status = getStatus(order);
  const visibleImgs = order.items.slice(0, 2);
  const extraCount = order.items.length - visibleImgs.length;

  return (
    <Link
      href={`/order-confirmation?orderId=${order.orderId}`}
      className="block bg-white rounded-2xl shadow-sm border border-gray-100 p-4 active:bg-gray-50 transition-colors"
    >
      {/* Top row: order ID + status badge */}
      <div className="flex items-start justify-between mb-1">
        <div>
          <p className="text-sm font-bold text-green-700">#{order.orderId}</p>
          <p className="text-[11px] text-gray-400 mt-0.5">{order.orderDate}</p>
        </div>
        <StatusBadge status={status} />
      </div>

      {/* Product thumbnails */}
      <div className="flex items-center gap-2 my-3">
        {visibleImgs.map((item) => (
          <div
            key={item.id}
            className="w-14 h-14 rounded-xl overflow-hidden bg-gray-100 border border-gray-200 flex-shrink-0"
          >
            <Image
              src={item.img}
              alt={item.nameEn}
              width={56}
              height={56}
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

      {/* Divider */}
      <div className="h-px bg-gray-100 mb-3" />

      {/* Total amount + cancel link */}
      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-400 font-medium">Total Amount</span>
        <span className="text-sm font-bold text-gray-900">{fmt(order.total)}</span>
      </div>

      {/* Cancel link — only for cancellable statuses */}
      {(status === 'processing' || status === 'pending') && (
        <div className="mt-2 flex justify-end">
          <Link
            href={`/cancel-order?orderId=${order.orderId}`}
            onClick={(e) => e.stopPropagation()}
            className="text-xs font-semibold text-red-500 hover:text-red-600 underline underline-offset-2"
          >
            Cancel Order
          </Link>
        </div>
      )}
    </Link>
  );
}

// ── Skeleton card ─────────────────────────────────────────────────────────────

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

// ── Page ──────────────────────────────────────────────────────────────────────

export default function OrderHistoryPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [mounted, setMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setMounted(true);

    async function fetchOrders() {
      setIsLoading(true);
      setError('');
      try {
        // Try API first
        const data = await api.get<Order[]>('/orders');
        setOrders(data);
      } catch (err) {
        // Fall back to localStorage
        console.warn('Orders API failed, using localStorage fallback:', getApiErrorMessage(err));
        setOrders(loadOrdersFromStorage());
        // Only show error if localStorage is also empty
        if (loadOrdersFromStorage().length === 0) {
          setError(getApiErrorMessage(err));
        }
      } finally {
        setIsLoading(false);
      }
    }

    fetchOrders();
  }, []);

  const totalOrders = orders.length;
  const inTransit = orders.filter((o) => {
    const s = getStatus(o);
    return s === 'shipped' || s === 'processing';
  }).length;

  // ── Loading ──────────────────────────────────────────────────────────────

  if (!mounted || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 pb-28 font-poppins">
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

  // ── Error state ──────────────────────────────────────────────────────────

  if (error && orders.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 pb-28 font-poppins flex flex-col">
        <div className="bg-white px-4 pt-5 pb-4 flex items-center justify-between border-b border-gray-100">
          <div className="flex items-center gap-3">
            <button onClick={() => router.back()} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center" aria-label="Go back">
              <RiArrowLeftLine className="w-4 h-4 text-gray-700" />
            </button>
            <h1 className="text-base font-bold text-gray-900">Order History</h1>
          </div>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center px-8 text-center gap-4">
          <p className="text-sm text-red-500">{error}</p>
          <button onClick={() => window.location.reload()} className="px-6 py-2.5 bg-green-600 text-white text-sm font-semibold rounded-2xl">
            Retry
          </button>
        </div>
      </div>
    );
  }

  // ── Empty state ──────────────────────────────────────────────────────────

  if (orders.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 pb-28 font-poppins flex flex-col">
        {/* Header */}
        <div className="bg-white px-4 pt-5 pb-4 flex items-center justify-between border-b border-gray-100">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.back()}
              className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center"
              aria-label="Go back"
            >
              <RiArrowLeftLine className="w-4 h-4 text-gray-700" />
            </button>
            <h1 className="text-base font-bold text-gray-900">Order History</h1>
          </div>
          <Link href="/cart" aria-label="Cart">
            <RiShoppingCartLine className="w-5 h-5 text-gray-600" />
          </Link>
        </div>

        {/* Empty */}
        <div className="flex-1 flex flex-col items-center justify-center px-8 text-center gap-4">
          <div className="w-20 h-20 rounded-full bg-green-50 flex items-center justify-center">
            <RiShoppingBagLine className="w-10 h-10 text-green-300" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900 mb-1">No orders yet</h2>
            <p className="text-sm text-gray-500">Your order history will appear here once you place an order.</p>
          </div>
          <Link
            href="/shop"
            className="mt-2 px-6 py-3 bg-green-600 text-white text-sm font-semibold rounded-2xl"
          >
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  // ── Filled list ──────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-gray-50 pb-28 font-poppins">

      {/* ── Header ── */}
      <div className="bg-white px-4 pt-5 pb-4 flex items-center justify-between border-b border-gray-100">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center"
            aria-label="Go back"
          >
            <RiArrowLeftLine className="w-4 h-4 text-gray-700" />
          </button>
          <h1 className="text-base font-bold text-gray-900">Order History</h1>
        </div>
        <Link href="/cart" aria-label="Cart">
          <RiShoppingCartLine className="w-5 h-5 text-gray-600" />
        </Link>
      </div>

      {/* ── Stats row ── */}
      <div className="px-4 pt-4 grid grid-cols-2 gap-3 mb-4">
        {/* Total Orders */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <p className="text-[11px] text-gray-400 font-medium mb-1">Total Orders</p>
          <p className="text-2xl font-black text-gray-900">
            {String(totalOrders).padStart(2, '0')}
          </p>
        </div>
        {/* In Transit */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <p className="text-[11px] text-gray-400 font-medium mb-1">In Transit</p>
          <p className="text-2xl font-black text-green-600">
            {String(inTransit).padStart(2, '0')}
          </p>
        </div>
      </div>

      {/* ── Order cards ── */}
      <div className="px-4 space-y-3">
        {orders.map((order) => (
          <OrderCard key={order.orderId} order={order} />
        ))}
      </div>
    </div>
  );
}
