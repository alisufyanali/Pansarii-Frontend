"use client";

/**
 * Order Cancellation — 3-step flow
 * ─────────────────────────────────
 * Step 1 : Reason selection  (URL: /cancel-order?orderId=XXX)
 * Step 2 : Confirmation bottom-sheet
 * Step 3 : Success screen
 *
 * Order data is fetched from GET /orders/{id}.
 * Cancellation is sent to PATCH /orders/{id}/cancel.
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
import { toast } from 'react-toastify';
import { getOrderById, cancelOrder, type ApiOrder } from '@/lib/orders';

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

function canCancel(order: ApiOrder): boolean {
  return order.status !== 'shipped' && order.status !== 'delivered' && order.status !== 'cancelled';
}

function todayFormatted(): string {
  return new Date().toLocaleDateString('en-PK', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

function formatDate(dateStr: string): string {
  try {
    return new Date(dateStr).toLocaleDateString('en-PK', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return dateStr;
  }
}

// ── Step 1 — Reason selection ─────────────────────────────────────────────────

function ReasonStep({
  order,
  onNext,
}: {
  order: ApiOrder;
  onNext: (reason: string, comment: string) => void;
}) {
  const router = useRouter();
  const [selected, setSelected] = useState(REASONS[0]);
  const [comment, setComment] = useState('');
  const cancellable = canCancel(order);

  const firstItem = order.items?.[0];

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
            <p className="text-xs font-bold text-amber-800">Order #{order.order_number}</p>
            <p className="text-[11px] text-amber-600 mt-0.5">Placed: {formatDate(order.created_at)}</p>
            <p className="text-sm font-black text-amber-900 mt-1">Total: {fmt(order.grand_total)}</p>
          </div>
          {firstItem?.thumbnail && (
            <div className="w-14 h-14 rounded-xl overflow-hidden bg-white border border-amber-200 flex-shrink-0">
              <Image
                src={firstItem.thumbnail}
                alt={firstItem.product_name}
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
  isSubmitting,
}: {
  order: ApiOrder;
  reason: string;
  onConfirm: () => void;
  onBack: () => void;
  isSubmitting: boolean;
}) {
  const firstItem = order.items?.[0];

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
              <p className="text-sm font-bold text-gray-800">Order #{order.order_number}</p>
              <p className="text-[11px] text-gray-400 mt-0.5">Placed on {formatDate(order.created_at)}</p>
            </div>
            <span className="text-[11px] font-semibold px-3 py-1 rounded-full bg-green-500 text-white capitalize">
              {order.status}
            </span>
          </div>
          {firstItem && (
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                {firstItem.thumbnail ? (
                  <Image src={firstItem.thumbnail} alt={firstItem.product_name} width={56} height={56} className="object-cover w-full h-full" />
                ) : (
                  <div className="w-full h-full bg-gray-200" />
                )}
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-800">{firstItem.product_name}</p>
                {firstItem.variant_name && (
                  <p className="text-xs text-gray-400 mt-0.5">{firstItem.variant_name} · Qty {firstItem.quantity}</p>
                )}
                <p className="text-xs font-bold text-gray-900 mt-0.5">{fmt(firstItem.price)}</p>
              </div>
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl p-4 border border-gray-100 mt-3">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Shipping Address</p>
          <p className="text-xs text-gray-500 leading-relaxed">
            {order.shipping_address ?? 'Pansari Inn Delivery Network, Pakistan'}
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
          Order #{order.order_number} will be permanently cancelled.
        </p>
        <p className="text-xs text-gray-500 text-center leading-relaxed mb-1">
          Reason: <span className="font-semibold text-gray-700">{reason}</span>
        </p>
        <p className="text-xs text-gray-400 text-center leading-relaxed mb-6">
          Your refund will be processed within 5–7 business days.
        </p>

        <button
          onClick={onConfirm}
          disabled={isSubmitting}
          className="w-full py-4 bg-red-500 hover:bg-red-600 active:bg-red-700 text-white text-sm font-bold rounded-2xl transition-colors mb-3 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
          ) : 'Yes, Cancel Order'}
        </button>
        <button
          onClick={onBack}
          disabled={isSubmitting}
          className="w-full py-3.5 border border-gray-200 text-gray-700 text-sm font-semibold rounded-2xl hover:bg-gray-50 transition-colors disabled:opacity-50"
        >
          Keep My Order
        </button>
      </div>
    </div>
  );
}

// ── Step 3 — Success ──────────────────────────────────────────────────────────

function SuccessStep({ order }: { order: ApiOrder }) {
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
            Your order <span className="font-bold text-gray-700">#{order.order_number}</span> has been
            successfully cancelled. Refund of{' '}
            <span className="font-bold text-gray-700">{fmt(order.grand_total)}</span> will be credited
            within 5–7 business days.
          </p>
        </div>

        {/* Cancellation details card */}
        <div className="w-full bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3.5 border-b border-gray-100">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
              Order Number
            </span>
            <span className="text-xs font-black text-gray-900">#{order.order_number}</span>
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
  const [order, setOrder] = useState<ApiOrder | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [step, setStep] = useState<'reason' | 'confirm' | 'success'>('reason');
  const [selectedReason, setSelectedReason] = useState('');
  const [selectedComment, setSelectedComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const orderId = searchParams.get('orderId');
    if (!orderId) {
      router.push('/orders');
      return;
    }

    getOrderById(Number(orderId))
      .then((data) => setOrder(data))
      .catch(() => {
        toast.error('Order not found.');
        router.push('/orders');
      })
      .finally(() => setIsLoading(false));
  }, [searchParams, router]);

  const handleReasonNext = (reason: string, comment: string) => {
    setSelectedReason(reason);
    setSelectedComment(comment);
    setStep('confirm');
  };

  const handleConfirm = async () => {
    if (!order) return;
    setIsSubmitting(true);
    try {
      await cancelOrder(order.id, selectedReason, selectedComment || undefined);
      // Update local state to reflect the new status
      setOrder((prev) => prev ? { ...prev, status: 'cancelled' } : prev);
      setStep('success');
    } catch {
      toast.error('Failed to cancel the order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-green-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!order) return null;

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
        isSubmitting={isSubmitting}
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
