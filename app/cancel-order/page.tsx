"use client";

/**
 * Order Cancellation — 3-step flow
 * ─────────────────────────────────
 * Step 1 : Reason selection  (URL: /cancel-order?orderId=XXX)
 * Step 2 : Confirmation bottom-sheet
 * Step 3 : Success screen
 *
 * Data is read from localStorage (same shape as order-confirmation page).
 * On confirm, the order's status is updated to 'cancelled' in localStorage.
 * Replace the localStorage logic with a real API call when backend is ready.
 */

import { Suspense, useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  RiArrowLeftLine,
  RiShoppingCartLine,
  RiAlertLine,
  RiDeleteBin6Line,
  RiCheckboxCircleFill,
} from 'react-icons/ri';

// ── Types ─────────────────────────────────────────────────────────────────────

interface OrderItem {
  id: number;
  nameEn: string;
  img: string;
  price: number;
  quantity: number;
  size: string;
}

interface Order {
  orderId: string;
  orderDate: string;
  items: OrderItem[];
  total: number;
  paymentStatus: string;
  paymentMethod: string;
  status?: string;
}

type Step = 'reason' | 'confirm' | 'success';

// ── Cancel reasons ────────────────────────────────────────────────────────────

const REASONS = [
  'Changed my mind',
  'Found a better price elsewhere',
  'Ordered by mistake',
  'Delivery time is too long',
  'Payment issue',
  'Other',
];

// ── Helpers ───────────────────────────────────────────────────────────────────

function fmt(n: number) {
  return `PKR ${n.toLocaleString()}`;
}

function canCancel(order: Order): boolean {
  const s = order.status ?? order.paymentStatus;
  return s !== 'shipped' && s !== 'delivered' && s !== 'cancelled';
}

function generateCancellationId(): string {
  const now = new Date();
  return `CAN-${String(now.getFullYear()).slice(-4)}-${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}`;
}

function todayFormatted(): string {
  return new Date().toLocaleDateString('en-PK', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

// ── Step 1 — Reason selection ─────────────────────────────────────────────────

function ReasonStep({
  order,
  onNext,
}: {
  order: Order;
  onNext: (reason: string, comment: string) => void;
}) {
  const router = useRouter();
  const [selected, setSelected] = useState(REASONS[0]);
  const [comment, setComment] = useState('');
  const cancellable = canCancel(order);

  return (
    <div className="min-h-screen bg-gray-50 pb-28 font-poppins">

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
          <h1 className="text-base font-bold text-gray-900">Cancel Order</h1>
        </div>
        <Link href="/cart" aria-label="Cart">
          <RiShoppingCartLine className="w-5 h-5 text-gray-600" />
        </Link>
      </div>

      <div className="px-4 pt-4 space-y-4">

        {/* Order summary card */}
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-bold text-amber-800">Order #{order.orderId}</p>
            <p className="text-[11px] text-amber-600 mt-0.5">Placed: {order.orderDate}</p>
            <p className="text-sm font-black text-amber-900 mt-1">Total: {fmt(order.total)}</p>
          </div>
          {order.items[0] && (
            <div className="w-14 h-14 rounded-xl overflow-hidden bg-white border border-amber-200 flex-shrink-0">
              <Image
                src={order.items[0].img}
                alt={order.items[0].nameEn}
                width={56}
                height={56}
                className="object-cover w-full h-full"
              />
            </div>
          )}
        </div>

        {/* Warning if not cancellable */}
        {!cancellable && (
          <div className="bg-red-50 border border-red-200 rounded-2xl px-4 py-3 flex items-start gap-2">
            <RiAlertLine className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-red-600 font-medium">
              Orders can only be cancelled before they are shipped.
            </p>
          </div>
        )}

        {/* Reason list */}
        <div>
          <h2 className="text-sm font-bold text-gray-900 mb-3">Why are you cancelling?</h2>
          <div className="space-y-2">
            {REASONS.map((reason) => (
              <button
                key={reason}
                onClick={() => setSelected(reason)}
                disabled={!cancellable}
                className={`w-full flex items-center justify-between px-4 py-3.5 rounded-2xl border text-sm font-medium transition-colors ${
                  selected === reason
                    ? 'border-green-500 bg-green-50 text-green-800'
                    : 'border-gray-200 bg-white text-gray-700'
                } disabled:opacity-50`}
              >
                {reason}
                <span
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                    selected === reason ? 'border-green-600' : 'border-gray-300'
                  }`}
                >
                  {selected === reason && (
                    <span className="w-2.5 h-2.5 rounded-full bg-green-600" />
                  )}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Additional comments */}
        <div>
          <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">
            Additional Comments
          </label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            disabled={!cancellable}
            rows={3}
            placeholder="Write your reason here…"
            className="w-full px-4 py-3 bg-white border border-gray-200 rounded-2xl text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 resize-none disabled:opacity-50"
          />
        </div>

        {/* Continue button */}
        <button
          onClick={() => onNext(selected, comment)}
          disabled={!cancellable}
          className="w-full py-4 bg-red-500 hover:bg-red-600 active:bg-red-700 text-white text-sm font-bold rounded-2xl transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Continue to Cancel
        </button>

      </div>
    </div>
  );
}

// ── Step 2 — Confirmation bottom-sheet ───────────────────────────────────────

function ConfirmStep({
  order,
  reason,
  onConfirm,
  onBack,
}: {
  order: Order;
  reason: string;
  onConfirm: () => void;
  onBack: () => void;
}) {
  return (
    <div className="min-h-screen bg-gray-50 font-poppins flex flex-col">

      {/* Header */}
      <div className="bg-white px-4 pt-5 pb-4 flex items-center justify-between border-b border-gray-100">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center"
            aria-label="Go back"
          >
            <RiArrowLeftLine className="w-4 h-4 text-gray-700" />
          </button>
          <h1 className="text-base font-bold text-gray-900">Pansari Inn</h1>
        </div>
        <Link href="/cart" aria-label="Cart">
          <RiShoppingCartLine className="w-5 h-5 text-gray-600" />
        </Link>
      </div>

      {/* Order preview (blurred background feel) */}
      <div className="flex-1 px-4 pt-4 pb-2 opacity-60 pointer-events-none select-none">
        <div className="bg-white rounded-2xl p-4 border border-gray-100">
          <div className="flex items-start justify-between mb-3">
            <div>
              <p className="text-sm font-bold text-gray-800">Order #{order.orderId}</p>
              <p className="text-[11px] text-gray-400 mt-0.5">Placed on {order.orderDate}</p>
            </div>
            <span className="text-[11px] font-semibold px-3 py-1 rounded-full bg-green-500 text-white">
              Processing
            </span>
          </div>
          {order.items.slice(0, 1).map((item) => (
            <div key={item.id} className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                <Image src={item.img} alt={item.nameEn} width={56} height={56} className="object-cover w-full h-full" />
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-800">{item.nameEn}</p>
                <p className="text-xs text-gray-400 mt-0.5">{item.size} · Qty {item.quantity}</p>
                <p className="text-xs font-bold text-gray-900 mt-0.5">{fmt(item.price)}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl p-4 border border-gray-100 mt-3">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Shipping Address</p>
          <p className="text-xs text-gray-500 leading-relaxed">
            {order.items[0]?.nameEn ?? 'Customer'}<br />
            Pansari Inn Delivery Network<br />
            Pakistan
          </p>
        </div>
      </div>

      {/* Bottom sheet */}
      <div className="bg-white rounded-t-3xl shadow-2xl px-5 pt-6 pb-8 border-t border-gray-100">
        {/* Drag handle */}
        <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-5" />

        {/* Icon */}
        <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
          <RiDeleteBin6Line className="w-7 h-7 text-red-500" />
        </div>

        <h2 className="text-lg font-black text-gray-900 text-center mb-2">Cancel this order?</h2>
        <p className="text-xs text-gray-500 text-center leading-relaxed mb-1">
          Order #{order.orderId} will be permanently cancelled.
        </p>
        <p className="text-xs text-gray-500 text-center leading-relaxed mb-1">
          Reason: <span className="font-semibold text-gray-700">{reason}</span>
        </p>
        <p className="text-xs text-gray-400 text-center leading-relaxed mb-6">
          Your refund will be processed within 5–7 business days.
        </p>

        <button
          onClick={onConfirm}
          className="w-full py-4 bg-red-500 hover:bg-red-600 active:bg-red-700 text-white text-sm font-bold rounded-2xl transition-colors mb-3"
        >
          Yes, Cancel Order
        </button>
        <button
          onClick={onBack}
          className="w-full py-3.5 border border-gray-200 text-gray-700 text-sm font-semibold rounded-2xl hover:bg-gray-50 transition-colors"
        >
          Keep My Order
        </button>
      </div>
    </div>
  );
}

// ── Step 3 — Success ──────────────────────────────────────────────────────────

function SuccessStep({ order }: { order: Order }) {
  const cancellationId = generateCancellationId();
  const cancellationDate = todayFormatted();

  return (
    <div className="min-h-screen bg-gray-50 pb-28 font-poppins flex flex-col">

      {/* Header */}
      <div className="bg-white px-4 pt-5 pb-4 flex items-center justify-between border-b border-gray-100">
        <div className="flex items-center gap-3">
          <Link
            href="/orders"
            className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center"
            aria-label="Back to orders"
          >
            <RiArrowLeftLine className="w-4 h-4 text-gray-700" />
          </Link>
          <h1 className="text-base font-bold text-gray-900">Pansari Inn</h1>
        </div>
        <Link href="/cart" aria-label="Cart">
          <RiShoppingCartLine className="w-5 h-5 text-gray-600" />
        </Link>
      </div>

      {/* Success content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 text-center gap-4">

        {/* Green check circle */}
        <div className="w-20 h-20 rounded-full bg-green-500 flex items-center justify-center shadow-lg shadow-green-200">
          <RiCheckboxCircleFill className="w-12 h-12 text-white" />
        </div>

        <div>
          <h2 className="text-xl font-black text-gray-900 mb-2">Order Cancelled</h2>
          <p className="text-xs text-gray-500 leading-relaxed max-w-xs">
            Your order <span className="font-bold text-gray-700">#{order.orderId}</span> has been
            successfully cancelled. Refund of{' '}
            <span className="font-bold text-gray-700">{fmt(order.total)}</span> will be credited
            within 5–7 business days.
          </p>
        </div>

        {/* Cancellation details card */}
        <div className="w-full bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3.5 border-b border-gray-100">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
              Cancellation ID
            </span>
            <span className="text-xs font-black text-gray-900">{cancellationId}</span>
          </div>
          <div className="flex items-center justify-between px-4 py-3.5">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
              Cancellation Date
            </span>
            <span className="text-xs font-semibold text-gray-700">{cancellationDate}</span>
          </div>
        </div>

        {/* Action buttons */}
        <div className="w-full space-y-2.5 mt-2">
          <Link
            href="/shop"
            className="block w-full py-4 bg-gray-900 hover:bg-gray-800 text-white text-sm font-bold rounded-2xl text-center transition-colors"
          >
            Continue Shopping
          </Link>
          <Link
            href="/orders"
            className="block w-full py-3.5 border border-gray-200 text-gray-700 text-sm font-semibold rounded-2xl text-center hover:bg-gray-50 transition-colors"
          >
            View Order History
          </Link>
        </div>

        {/* Support link */}
        <p className="text-xs text-gray-400 mt-1">
          Need help?{' '}
          <Link href="/support" className="text-gray-700 font-semibold underline underline-offset-2">
            Contact Support
          </Link>
        </p>

      </div>
    </div>
  );
}

// ── Main orchestrator ─────────────────────────────────────────────────────────

function CancelOrderContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [order, setOrder] = useState<Order | null>(null);
  const [mounted, setMounted] = useState(false);
  const [step, setStep] = useState<Step>('reason');
  const [selectedReason, setSelectedReason] = useState('');

  useEffect(() => {
    setMounted(true);
    const orderId = searchParams.get('orderId');
    if (!orderId) { router.push('/orders'); return; }

    const raw = localStorage.getItem(`order-${orderId}`);
    if (raw) {
      setOrder(JSON.parse(raw));
    } else {
      router.push('/orders');
    }
  }, [searchParams, router]);

  const handleReasonNext = (reason: string, _comment: string) => {
    setSelectedReason(reason);
    setStep('confirm');
  };

  const handleConfirm = () => {
    if (!order) return;
    // Update status in localStorage
    const updated = { ...order, status: 'cancelled' };
    localStorage.setItem(`order-${order.orderId}`, JSON.stringify(updated));
    setOrder(updated);
    setStep('success');
  };

  // Loading
  if (!mounted || !order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-green-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (step === 'reason') {
    return <ReasonStep order={order} onNext={handleReasonNext} />;
  }
  if (step === 'confirm') {
    return (
      <ConfirmStep
        order={order}
        reason={selectedReason}
        onConfirm={handleConfirm}
        onBack={() => setStep('reason')}
      />
    );
  }
  return <SuccessStep order={order} />;
}

// ── Page export ───────────────────────────────────────────────────────────────

export default function CancelOrderPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-green-600 border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <CancelOrderContent />
    </Suspense>
  );
}
