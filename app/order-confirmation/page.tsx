"use client";

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  FaCheckCircle, 
  FaBox, 
  FaTruck, 
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaDownload,
  FaPrint,
  FaHome
} from 'react-icons/fa';
import { FiPackage, FiClock } from 'react-icons/fi';

interface OrderItem {
  id: number;
  nameEn: string;
  price: number;
  quantity: number;
  size: string;
  img: string;
}

interface OrderDetails {
  orderId: string;
  orderDate: string;
  estimatedDelivery: string;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  total: number;
  shippingAddress: {
    name: string;
    phone: string;
    email: string;
    address: string;
    city: string;
    postalCode: string;
  };
  paymentMethod: string;
}

function OrderConfirmationContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // Get order ID from URL
    const orderId = searchParams.get('orderId');
    
    if (!orderId) {
      // Redirect to home if no order ID
      router.push('/');
      return;
    }
    
    // Load order from localStorage
    const savedOrder = localStorage.getItem(`order-${orderId}`);
    
    if (savedOrder) {
      setOrder(JSON.parse(savedOrder));
    } else {
      // If no order found, redirect to home
      router.push('/');
    }

    // Clear cart after order
    localStorage.removeItem('pansari-cart');
  }, [searchParams, router]);

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    alert('Invoice download feature coming soon!');
  };

  if (!mounted || !order) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-700 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading order details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 print:bg-white">
      <div className="mx-[4%] py-8">
        {/* Success Banner */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-6 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaCheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Order Confirmed!
          </h1>
          <p className="text-gray-600 mb-4">
            Thank you for your order. We've received your order and will begin processing it soon.
          </p>
          <div className="inline-block bg-green-50 px-6 py-3 rounded-lg">
            <p className="text-sm text-gray-600">Order Number</p>
            <p className="text-2xl font-bold text-green-700">{order.orderId}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Timeline */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-6">Order Timeline</h2>
              
              <div className="space-y-4">
                {/* Step 1 - Confirmed */}
                <div className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <FaCheckCircle className="w-5 h-5 text-green-600" />
                    </div>
                    <div className="w-0.5 h-full bg-gray-200 mt-2"></div>
                  </div>
                  <div className="pb-8">
                    <h3 className="font-semibold text-gray-900">Order Confirmed</h3>
                    <p className="text-sm text-gray-600">{order.orderDate}</p>
                    <p className="text-xs text-gray-500 mt-1">Your order has been received</p>
                  </div>
                </div>

                {/* Step 2 - Processing */}
                <div className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                      <FiPackage className="w-5 h-5 text-gray-400" />
                    </div>
                    <div className="w-0.5 h-full bg-gray-200 mt-2"></div>
                  </div>
                  <div className="pb-8">
                    <h3 className="font-semibold text-gray-400">Processing</h3>
                    <p className="text-sm text-gray-400">Pending</p>
                    <p className="text-xs text-gray-400 mt-1">We're preparing your items</p>
                  </div>
                </div>

                {/* Step 3 - Shipped */}
                <div className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                      <FaTruck className="w-5 h-5 text-gray-400" />
                    </div>
                    <div className="w-0.5 h-full bg-gray-200 mt-2"></div>
                  </div>
                  <div className="pb-8">
                    <h3 className="font-semibold text-gray-400">Shipped</h3>
                    <p className="text-sm text-gray-400">Pending</p>
                    <p className="text-xs text-gray-400 mt-1">Your order is on the way</p>
                  </div>
                </div>

                {/* Step 4 - Delivered */}
                <div className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                      <FaBox className="w-5 h-5 text-gray-400" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-400">Delivered</h3>
                    <p className="text-sm text-gray-400">Expected: {order.estimatedDelivery}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Items */}
            {order.items.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4">Order Items</h2>
                
                <div className="space-y-4">
                  {order.items.map((item) => (
                    <div key={`${item.id}-${item.size}`} className="flex gap-4 pb-4 border-b last:border-b-0">
                      <img
                        src={item.img}
                        alt={item.nameEn}
                        className="w-20 h-20 object-cover rounded-lg border border-gray-200"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{item.nameEn}</h3>
                        <p className="text-xs text-gray-500 mt-1">Size: {item.size}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">
                          PKR {(item.price * item.quantity).toLocaleString()}
                        </p>
                        <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Order Summary */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Order Summary</h2>
              
              <div className="space-y-3 mb-4">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-semibold">PKR {order.subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span className="font-semibold">
                    {order.shipping === 0 ? 'FREE' : `PKR ${order.shipping}`}
                  </span>
                </div>
                <div className="border-t pt-3">
                  <div className="flex justify-between text-lg font-bold text-gray-900">
                    <span>Total</span>
                    <span>PKR {order.total.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-sm font-medium text-gray-700">Payment Method</p>
                <p className="text-sm text-gray-600 mt-1">{order.paymentMethod}</p>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Shipping Address</h2>
              
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <FaMapMarkerAlt className="w-4 h-4 text-gray-400 mt-1" />
                  <div>
                    <p className="font-medium text-gray-900">{order.shippingAddress.name}</p>
                    <p className="text-sm text-gray-600 mt-1">{order.shippingAddress.address}</p>
                    <p className="text-sm text-gray-600">
                      {order.shippingAddress.city}, {order.shippingAddress.postalCode}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <FaPhone className="w-4 h-4 text-gray-400" />
                  <p className="text-sm text-gray-600">{order.shippingAddress.phone}</p>
                </div>
                
                <div className="flex items-center gap-3">
                  <FaEnvelope className="w-4 h-4 text-gray-400" />
                  <p className="text-sm text-gray-600">{order.shippingAddress.email}</p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 print:hidden">
              <div className="space-y-3">
                <button
                  onClick={handlePrint}
                  className="w-full py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition font-medium flex items-center justify-center gap-2"
                >
                  <FaPrint className="w-4 h-4" />
                  Print Order
                </button>
                <button
                  onClick={handleDownload}
                  className="w-full py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium flex items-center justify-center gap-2"
                >
                  <FaDownload className="w-4 h-4" />
                  Download Invoice
                </button>
                <Link
                  href="/"
                  className="block w-full py-3 bg-green-700 text-white rounded-lg hover:bg-green-600 transition font-medium text-center flex items-center justify-center gap-2"
                >
                  <FaHome className="w-4 h-4" />
                  Back to Home
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Support Banner */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mt-6 print:hidden">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
              <FiClock className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Need Help?</h3>
              <p className="text-sm text-gray-600 mt-1">
                Contact our support team at{' '}
                <a href="tel:+923001234567" className="text-blue-600 hover:underline">
                  +92 300 1234567
                </a>{' '}
                or email{' '}
                <a href="mailto:support@pansariinn.com" className="text-blue-600 hover:underline">
                  support@pansariinn.com
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function OrderConfirmationLoading() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-700 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading order details...</p>
      </div>
    </div>
  );
}

// Main component with Suspense
export default function OrderConfirmationPage() {
  return (
    <Suspense fallback={<OrderConfirmationLoading />}>
      <OrderConfirmationContent />
    </Suspense>
  );
}