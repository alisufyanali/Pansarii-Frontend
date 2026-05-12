"use client";

import { Suspense, useEffect, useState } from 'react';
import Image from 'next/image';
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
    if (!order) return;

    // Create a new window for the invoice
    const invoiceWindow = window.open('', '_blank');
    if (!invoiceWindow) {
      alert('Please allow popups to download the invoice');
      return;
    }

    // Generate invoice HTML
    const invoiceHtml = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Invoice - ${order.orderId}</title>
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          
          body {
            font-family: 'Arial', 'Helvetica', sans-serif;
            line-height: 1.6;
            color: #333;
            background: #fff;
            padding: 40px 20px;
          }
          
          .invoice-container {
            max-width: 800px;
            margin: 0 auto;
            background: white;
          }
          
          /* Header */
          .invoice-header {
            text-align: center;
            margin-bottom: 30px;
            padding-bottom: 20px;
            border-bottom: 2px solid #e5e7eb;
          }
          
          .store-name {
            font-size: 28px;
            font-weight: bold;
            color: #166534;
            margin-bottom: 8px;
          }
          
          .store-tagline {
            font-size: 14px;
            color: #6b7280;
          }
          
          /* Invoice Title */
          .invoice-title {
            text-align: center;
            margin-bottom: 30px;
          }
          
          .invoice-title h1 {
            font-size: 24px;
            color: #1f2937;
            margin-bottom: 8px;
          }
          
          .invoice-title p {
            color: #6b7280;
            font-size: 14px;
          }
          
          /* Order Info */
          .order-info {
            background: #f9fafb;
            padding: 20px;
            border-radius: 8px;
            margin-bottom: 30px;
            display: flex;
            justify-content: space-between;
            flex-wrap: wrap;
            gap: 20px;
          }
          
          .info-section {
            flex: 1;
            min-width: 200px;
          }
          
          .info-section h3 {
            font-size: 14px;
            font-weight: 600;
            color: #6b7280;
            margin-bottom: 8px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }
          
          .info-section p {
            font-size: 14px;
            color: #1f2937;
            margin-bottom: 4px;
          }
          
          .info-section .bold {
            font-weight: 600;
            font-size: 16px;
            color: #166534;
          }
          
          /* Items Table */
          .items-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 30px;
          }
          
          .items-table th {
            background: #f9fafb;
            padding: 12px;
            text-align: left;
            font-size: 12px;
            font-weight: 600;
            color: #6b7280;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            border-bottom: 1px solid #e5e7eb;
          }
          
          .items-table td {
            padding: 12px;
            border-bottom: 1px solid #f3f4f6;
            font-size: 14px;
          }
          
          .items-table .product-cell {
            font-weight: 500;
          }
          
          .items-table .size-cell {
            color: #6b7280;
            font-size: 12px;
          }
          
          /* Totals */
          .totals {
            text-align: right;
            margin-bottom: 30px;
            padding-top: 20px;
            border-top: 1px solid #e5e7eb;
          }
          
          .totals-row {
            display: flex;
            justify-content: flex-end;
            margin-bottom: 8px;
          }
          
          .totals-label {
            font-size: 14px;
            color: #6b7280;
            width: 120px;
            text-align: left;
          }
          
          .totals-value {
            font-size: 14px;
            color: #1f2937;
            width: 120px;
            text-align: right;
            font-weight: 500;
          }
          
          .grand-total {
            margin-top: 12px;
            padding-top: 12px;
            border-top: 2px solid #e5e7eb;
          }
          
          .grand-total .totals-label {
            font-size: 18px;
            font-weight: 700;
            color: #1f2937;
          }
          
          .grand-total .totals-value {
            font-size: 20px;
            font-weight: 700;
            color: #166534;
          }
          
          /* Shipping Address */
          .shipping-section {
            margin-bottom: 30px;
            padding: 20px;
            background: #f9fafb;
            border-radius: 8px;
          }
          
          .shipping-section h3 {
            font-size: 14px;
            font-weight: 600;
            color: #6b7280;
            margin-bottom: 12px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }
          
          .shipping-details {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 12px;
          }
          
          .shipping-detail-item {
            font-size: 14px;
          }
          
          .shipping-detail-label {
            font-weight: 600;
            color: #6b7280;
            margin-right: 8px;
          }
          
          /* Footer */
          .invoice-footer {
            text-align: center;
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #e5e7eb;
            font-size: 12px;
            color: #9ca3af;
          }
          
          @media print {
            body {
              padding: 0;
              margin: 0;
            }
            .invoice-container {
              margin: 0;
              padding: 20px;
            }
          }
        </style>
      </head>
      <body>
        <div class="invoice-container">
          <!-- Header -->
          <div class="invoice-header">
            <div class="store-name">PANSARI</div>
            <div class="store-tagline">Premium Quality Products</div>
          </div>
          
          <!-- Invoice Title -->
          <div class="invoice-title">
            <h1>INVOICE</h1>
            <p>Thank you for your purchase!</p>
          </div>
          
          <!-- Order Info -->
          <div class="order-info">
            <div class="info-section">
              <h3>Order Information</h3>
              <p><strong>Order ID:</strong> ${order.orderId}</p>
              <p><strong>Order Date:</strong> ${order.orderDate}</p>
              <p><strong>Estimated Delivery:</strong> ${order.estimatedDelivery}</p>
            </div>
            <div class="info-section">
              <h3>Payment Method</h3>
              <p>${order.paymentMethod}</p>
            </div>
          </div>
          
          <!-- Items Table -->
          <table class="items-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Size</th>
                <th>Quantity</th>
                <th>Unit Price</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              ${order.items.map(item => `
                <tr>
                  <td class="product-cell">${item.nameEn}</td>
                  <td class="size-cell">${item.size}</td>
                  <td>${item.quantity}</td>
                  <td>PKR ${item.price.toLocaleString()}</td>
                  <td>PKR ${(item.price * item.quantity).toLocaleString()}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          
          <!-- Totals -->
          <div class="totals">
            <div class="totals-row">
              <span class="totals-label">Subtotal:</span>
              <span class="totals-value">PKR ${order.subtotal.toLocaleString()}</span>
            </div>
            <div class="totals-row">
              <span class="totals-label">Shipping:</span>
              <span class="totals-value">${order.shipping === 0 ? 'FREE' : `PKR ${order.shipping}`}</span>
            </div>
            <div class="totals-row grand-total">
              <span class="totals-label">Total:</span>
              <span class="totals-value">PKR ${order.total.toLocaleString()}</span>
            </div>
          </div>
          
          <!-- Shipping Address -->
          <div class="shipping-section">
            <h3>Shipping Address</h3>
            <div class="shipping-details">
              <div class="shipping-detail-item">
                <span class="shipping-detail-label">Name:</span>
                ${order.shippingAddress.name}
              </div>
              <div class="shipping-detail-item">
                <span class="shipping-detail-label">Phone:</span>
                ${order.shippingAddress.phone}
              </div>
              <div class="shipping-detail-item">
                <span class="shipping-detail-label">Email:</span>
                ${order.shippingAddress.email}
              </div>
              <div class="shipping-detail-item">
                <span class="shipping-detail-label">Address:</span>
                ${order.shippingAddress.address}, ${order.shippingAddress.city} ${order.shippingAddress.postalCode}
              </div>
            </div>
          </div>
          
          <!-- Footer -->
          <div class="invoice-footer">
            <p>Thank you for shopping with PANSARI!</p>
            <p>For any inquiries, please contact us at support@pansari.com</p>
          </div>
        </div>
      </body>
      </html>
    `;

    // Write to the new window and trigger print/save
    invoiceWindow.document.write(invoiceHtml);
    invoiceWindow.document.close();
    
    // Wait for content to load then trigger print dialog
    invoiceWindow.onload = () => {
      invoiceWindow.print();
    };
  };

  if (!mounted || !order) {
    return <OrderConfirmationLoading />;
  }

  return (
    <div className="min-h-screen bg-gray-50 print:bg-white">
      <div className="mx-[4%] py-8">
        {/* Success Banner */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-6 text-center print:hidden">
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
          <div className="lg:col-span-2 space-y-6 print:col-span-3">
            {/* Order Items - Moved to top for easy viewing */}
            {order.items.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4">Order Items</h2>
                
                <div className="space-y-4">
                  {order.items.map((item) => (
                    <div key={`${item.id}-${item.size}`} className="flex gap-4 pb-4 border-b last:border-b-0">
                      <div className="relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden border border-gray-200">
                        <Image
                          src={item.img}
                          alt={item.nameEn}
                          fill
                          className="object-cover"
                          sizes="80px"
                        />
                      </div>
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

            {/* Order Timeline */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 print:hidden">
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
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6 print:hidden">
            {/* Actions - Moved to top of sidebar */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="space-y-3">
                <button
                  onClick={handleDownload}
                  className="w-full py-3 bg-green-700 text-white rounded-lg hover:bg-green-600 transition font-medium flex items-center justify-center gap-2"
                >
                  <FaDownload className="w-4 h-4" />
                  Download Invoice
                </button>
                {/* <button
                  onClick={handlePrint}
                  className="w-full py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition font-medium flex items-center justify-center gap-2"
                >
                  <FaPrint className="w-4 h-4" />
                  Print Order
                </button> */}
                <Link
                  href="/"
                  className="block w-full py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium text-center flex items-center justify-center gap-2"
                >
                  <FaHome className="w-4 h-4" />
                  Back to Home
                </Link>
              </div>
            </div>

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
          </div>
        </div>
      </div>
    </div>
  );
}

function OrderConfirmationLoading() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-[4%] py-8">
        <div className="bg-white rounded-2xl border border-gray-200 p-8 mb-6 animate-pulse">
          <div className="w-20 h-20 bg-gray-200 rounded-full mx-auto mb-4" />
          <div className="h-8 w-48 bg-gray-200 rounded mx-auto mb-3" />
          <div className="h-4 w-72 bg-gray-200 rounded mx-auto mb-4" />
          <div className="h-16 w-48 bg-gray-200 rounded-lg mx-auto" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl border border-gray-200 p-6 animate-pulse">
              <div className="h-6 w-32 bg-gray-200 rounded mb-4" />
              {[...Array(2)].map((_, i) => (
                <div key={i} className="flex gap-4 pb-4 border-b mb-4">
                  <div className="w-20 h-20 bg-gray-200 rounded-lg flex-shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4" />
                    <div className="h-3 bg-gray-200 rounded w-1/4" />
                  </div>
                  <div className="space-y-2">
                    <div className="h-4 w-20 bg-gray-200 rounded" />
                    <div className="h-3 w-12 bg-gray-200 rounded" />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-gray-200 p-6 animate-pulse">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-10 bg-gray-200 rounded-lg mb-3" />
              ))}
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-6 animate-pulse">
              <div className="h-6 w-32 bg-gray-200 rounded mb-4" />
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex justify-between mb-3">
                  <div className="h-4 w-20 bg-gray-200 rounded" />
                  <div className="h-4 w-24 bg-gray-200 rounded" />
                </div>
              ))}
            </div>
          </div>
        </div>
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