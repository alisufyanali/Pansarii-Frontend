// app/track-order/page.tsx
"use client";

import { useState } from "react";
import { 
  FaSearch, 
  FaBox, 
  FaCheckCircle, 
  FaTruck, 
  FaHome, 
  FaClock, 
  FaMapMarkerAlt, 
  FaPhone, 
  FaEnvelope,
  FaChevronDown,
  FaChevronUp
} from "react-icons/fa";

type OrderStatus = "pending" | "confirmed" | "processing" | "shipped" | "out-for-delivery" | "delivered";

type Order = {
  orderNumber: string;
  status: OrderStatus;
  customer: {
    name: string;
    phone: string;
  };
  tracking: {
    status: OrderStatus;
    title: string;
    description: string;
    location: string;
    date: string;
    time: string;
    completed: boolean;
  }[];
  estimatedDelivery: string;
  shippingAddress: string;
  paymentMethod: string;
  items: {
    name: string;
    quantity: number;
    price: number;
    image: string;
  }[];
};

// Mock data
const mockOrders: Order[] = [
  {
    orderNumber: "PANS-789456",
    status: "shipped",
    customer: {
      name: "Ahmed Raza",
      phone: "+923001234567",
    },
    tracking: [
      {
        status: "pending",
        title: "Order Placed",
        description: "Your order has been placed successfully",
        location: "Karachi Warehouse",
        date: "Jan 15, 2024",
        time: "10:30 AM",
        completed: true,
      },
      {
        status: "confirmed",
        title: "Order Confirmed",
        description: "Your order has been confirmed",
        location: "Karachi Warehouse",
        date: "Jan 15, 2024",
        time: "11:45 AM",
        completed: true,
      },
      {
        status: "processing",
        title: "Processing",
        description: "Your order is being prepared and packed",
        location: "Karachi Warehouse",
        date: "Jan 16, 2024",
        time: "09:00 AM",
        completed: true,
      },
      {
        status: "shipped",
        title: "Shipped",
        description: "Your order has been shipped via TCS Express",
        location: "Karachi Hub",
        date: "Jan 17, 2024",
        time: "08:30 AM",
        completed: true,
      },
      {
        status: "out-for-delivery",
        title: "Out for Delivery",
        description: "Your order is out for delivery",
        location: "DHA Phase 5, Karachi",
        date: "Jan 18, 2024",
        time: "Expected: 2:00 PM - 5:00 PM",
        completed: false,
      },
      {
        status: "delivered",
        title: "Delivered",
        description: "Your order has been delivered",
        location: "Your Address",
        date: "Jan 18, 2024",
        time: "TBD",
        completed: false,
      },
    ],
    estimatedDelivery: "January 18, 2024",
    shippingAddress: "House #123, Street 45, DHA Phase 5, Karachi, Pakistan",
    paymentMethod: "Cash on Delivery",
    items: [
      {
        name: "Pure Honey - 100% Natural",
        quantity: 2,
        price: 999,
        image: "/products/honey.jpg"
      },
      {
        name: "Extra Virgin Coconut Oil",
        quantity: 1,
        price: 699,
        image: "/products/coconut-oil.jpg"
      },
    ],
  },
];

export default function TrackOrderPage() {
  const [orderNumber, setOrderNumber] = useState("");
  const [phone, setPhone] = useState("");
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [expandedItems, setExpandedItems] = useState(false);

  const handleSearch = () => {
    if (!orderNumber.trim() || !phone.trim()) {
      setError("Please enter both Order Number and Phone");
      return;
    }

    setLoading(true);
    setError("");

    // Simulate API call
    setTimeout(() => {
      const found = mockOrders.find(
        (o) =>
          o.orderNumber.toLowerCase() === orderNumber.toLowerCase() &&
          o.customer.phone.replace(/\s/g, "") === phone.replace(/\s/g, "")
      );

      if (found) {
        setOrder(found);
      } else {
        setError("Order not found. Please check your details.");
      }
      setLoading(false);
    }, 1000);
  };

  const getStatusIcon = (status: OrderStatus) => {
    const icons = {
      pending: <FaClock className="w-4 h-4 sm:w-5 sm:h-5" />,
      confirmed: <FaCheckCircle className="w-4 h-4 sm:w-5 sm:h-5" />,
      processing: <FaBox className="w-4 h-4 sm:w-5 sm:h-5" />,
      shipped: <FaTruck className="w-4 h-4 sm:w-5 sm:h-5" />,
      "out-for-delivery": <FaTruck className="w-4 h-4 sm:w-5 sm:h-5" />,
      delivered: <FaHome className="w-4 h-4 sm:w-5 sm:h-5" />,
    };
    return icons[status];
  };

  const getProgressPercentage = (order: Order) => {
    const completed = order.tracking.filter((t) => t.completed).length;
    return (completed / order.tracking.length) * 100;
  };

  const getStatusColor = (status: OrderStatus) => {
    const colors = {
      pending: "bg-yellow-100 text-yellow-800",
      confirmed: "bg-blue-100 text-blue-800",
      processing: "bg-purple-100 text-purple-800",
      shipped: "bg-indigo-100 text-indigo-800",
      "out-for-delivery": "bg-orange-100 text-orange-800",
      delivered: "bg-green-100 text-green-800",
    };
    return colors[status];
  };

  const formatCurrency = (amount: number) => {
    return `PKR ${amount.toLocaleString()}`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-green-700 text-white py-10 sm:py-12">
        <div className="max-w-3xl mx-auto px-[4%] text-center">
          <FaTruck className="w-8 h-8 mx-auto mb-3 text-white/80" />
          <h1 className="text-2xl sm:text-3xl font-bold mb-1">Track Your Order</h1>
          <p className="text-sm text-green-100">Enter your order details to get real-time tracking updates</p>
        </div>
      </div>

      {/* Search Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto border border-gray-200">
          <div className="space-y-4 sm:space-y-0 sm:grid sm:grid-cols-1 md:grid-cols-3 gap-4">
            {/* Order Number Input */}
            <div className="md:col-span-1">
              <label className="block text-xs sm:text-sm font-semibold text-gray-800 mb-1.5 sm:mb-2">
                Order Number
              </label>
              <input
                type="text"
                value={orderNumber}
                onChange={(e) => setOrderNumber(e.target.value)}
                placeholder="PANS-789456"
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:border-green-600 focus:ring-2 focus:ring-green-100 outline-none transition bg-white text-gray-900"
              />
            </div>

            {/* Phone Input */}
            <div className="md:col-span-1">
              <label className="block text-xs sm:text-sm font-semibold text-gray-800 mb-1.5 sm:mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+92 300 1234567"
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:border-green-600 focus:ring-2 focus:ring-green-100 outline-none transition bg-white text-gray-900"
              />
            </div>

            {/* Search Button */}
            <div className="md:col-span-1 flex items-end">
              <button
                onClick={handleSearch}
                disabled={loading}
                className="w-full bg-green-700 text-white py-2.5 sm:py-3 px-4 sm:px-6 rounded-lg text-sm sm:text-base font-semibold hover:bg-green-800 transition-all shadow hover:shadow-lg disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-2 border-white border-t-transparent"></div>
                ) : (
                  <>
                    <FaSearch className="w-3 h-3 sm:w-4 sm:h-4" />
                    Track Order
                  </>
                )}
              </button>
            </div>
          </div>

          {error && (
            <div className="mt-4 p-3 sm:p-4 bg-red-50 border-l-4 border-red-500 rounded">
              <p className="text-xs sm:text-sm text-red-800 font-medium">{error}</p>
            </div>
          )}
        </div>
      </div>

      {/* Order Tracking Result */}
      {order && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8 sm:pb-12 lg:pb-16">
          <div className="mx-auto">
            {/* Order Summary Card */}
            <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 mb-4 sm:mb-6 lg:mb-8 border border-gray-200">
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 lg:gap-6">
                <div className="w-full lg:flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2">
                    <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 break-all">
                      Order #{order.orderNumber}
                    </h2>
                    <span className={`px-2 sm:px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)} inline-block w-fit`}>
                      {order.status.toUpperCase().replace(/-/g, ' ')}
                    </span>
                  </div>
                  
                  {/* Mobile-friendly customer info */}
                  <div className="space-y-1.5 sm:space-y-2">
                    <p className="text-xs sm:text-sm text-gray-700">
                      <span className="font-medium">Customer:</span> {order.customer.name}
                    </p>
                    <p className="text-xs sm:text-sm text-gray-700 break-all">
                      <span className="font-medium">Phone:</span> {order.customer.phone}
                    </p>
                    <p className="text-xs sm:text-sm text-gray-700">
                      <span className="font-medium">Shipping:</span>{" "}
                      <span className="break-words">{order.shippingAddress}</span>
                    </p>
                    <p className="text-xs sm:text-sm text-gray-700">
                      <span className="font-medium">Payment:</span> {order.paymentMethod}
                    </p>
                  </div>
                </div>
                
                <div className="w-full lg:w-auto bg-green-50 p-3 sm:p-4 rounded-lg border border-green-200">
                  <p className="text-xs sm:text-sm text-gray-700 mb-0.5 sm:mb-1">Estimated Delivery</p>
                  <p className="text-base sm:text-lg lg:text-xl font-bold text-green-800">
                    {order.estimatedDelivery}
                  </p>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mt-4 sm:mt-6">
                <div className="flex justify-between items-center mb-1.5 sm:mb-2">
                  <span className="text-xs sm:text-sm font-semibold text-gray-800">
                    Order Progress
                  </span>
                  <span className="text-xs sm:text-sm font-bold text-green-800">
                    {Math.round(getProgressPercentage(order))}% Complete
                  </span>
                </div>
                <div className="h-1.5 sm:h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-green-500 to-emerald-600 rounded-full transition-all duration-1000"
                    style={{ width: `${getProgressPercentage(order)}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Two Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
              {/* Left Column - Timeline */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 border border-gray-200">
                  <h3 className="text-base sm:text-lg lg:text-xl font-bold text-gray-900 mb-4 sm:mb-6 flex items-center gap-2">
                    <FaTruck className="text-green-700 w-4 h-4 sm:w-5 sm:h-5" />
                    Tracking Timeline
                  </h3>

                  <div className="relative">
                    {/* Vertical Line - hidden on mobile, visible on sm and up */}
                    <div className="hidden sm:block absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-green-600 via-green-400 to-gray-300"></div>

                    {/* Timeline Items */}
                    <div className="space-y-4 sm:space-y-6 lg:space-y-8">
                      {order.tracking.map((item, index) => (
                        <div key={index} className="relative flex flex-col sm:flex-row gap-3 sm:gap-4 items-start">
                          {/* Icon Circle */}
                          <div
                            className={`relative z-10 w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-full flex items-center justify-center flex-shrink-0 transition-all border-2 ${
                              item.completed
                                ? "bg-green-600 border-green-600 text-white shadow"
                                : "bg-white border-gray-300 text-gray-400"
                            }`}
                          >
                            {getStatusIcon(item.status)}
                          </div>

                          {/* Content Card */}
                          <div
                            className={`flex-1 w-full p-3 sm:p-4 rounded-lg border transition-all ${
                              item.completed
                                ? "bg-green-50 border-green-200 shadow-sm"
                                : "bg-gray-50 border-gray-200"
                            }`}
                          >
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-2 mb-1 sm:mb-2">
                              <h4
                                className={`text-sm sm:text-base lg:text-lg font-semibold ${
                                  item.completed ? "text-gray-900" : "text-gray-600"
                                }`}
                              >
                                {item.title}
                              </h4>
                              <div className="flex items-center gap-2 text-xs">
                                <span
                                  className={`font-medium ${
                                    item.completed ? "text-gray-700" : "text-gray-500"
                                  }`}
                                >
                                  {item.date}
                                </span>
                                <span
                                  className={`font-medium ${
                                    item.completed ? "text-green-700" : "text-gray-500"
                                  }`}
                                >
                                  {item.time}
                                </span>
                              </div>
                            </div>
                            <p
                              className={`text-xs sm:text-sm mb-1.5 sm:mb-2 ${
                                item.completed ? "text-gray-700" : "text-gray-500"
                              }`}
                            >
                              {item.description}
                            </p>
                            <div className="flex items-center gap-1.5 sm:gap-2">
                              <FaMapMarkerAlt
                                className={`w-3 h-3 sm:w-4 sm:h-4 ${
                                  item.completed ? "text-green-600" : "text-gray-400"
                                }`}
                              />
                              <span
                                className={`text-xs sm:text-sm ${
                                  item.completed ? "text-gray-700" : "text-gray-500"
                                }`}
                              >
                                {item.location}
                              </span>
                            </div>

                            {/* Checkmark Badge */}
                            {item.completed && (
                              <div className="absolute -right-1 -top-1 sm:-right-2 sm:-top-2 w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 bg-green-600 rounded-full flex items-center justify-center shadow">
                                <FaCheckCircle className="w-2 h-2 sm:w-3 sm:h-3 text-white" />
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Order Details */}
              <div className="space-y-4 sm:space-y-6">
                {/* Order Items */}
                <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 border border-gray-200">
                  <h3 className="text-base sm:text-lg lg:text-xl font-bold text-gray-900 mb-3 sm:mb-4">
                    Order Items ({order.items.length})
                  </h3>
                  
                  {/* Mobile: Show first 2 items, then expandable */}
                  <div className="space-y-3 sm:space-y-4">
                    {order.items.slice(0, expandedItems ? order.items.length : 2).map((item, index) => (
                      <div key={index} className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-gray-50 rounded-lg">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-green-100 rounded-md flex items-center justify-center flex-shrink-0">
                          <FaBox className="w-4 h-4 sm:w-5 sm:h-5 text-green-700" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 text-xs sm:text-sm truncate">
                            {item.name}
                          </p>
                          <div className="flex justify-between items-center mt-0.5 sm:mt-1">
                            <span className="text-gray-700 text-xs">
                              Qty: {item.quantity}
                            </span>
                            <span className="font-semibold text-green-800 text-xs sm:text-sm">
                              {formatCurrency(item.price * item.quantity)}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    {/* Show more/less button on mobile */}
                    {order.items.length > 2 && (
                      <button
                        onClick={() => setExpandedItems(!expandedItems)}
                        className="w-full flex items-center justify-center gap-1.5 py-2 text-xs sm:text-sm text-green-700 font-medium sm:hidden"
                      >
                        {expandedItems ? (
                          <>
                            Show Less <FaChevronUp className="w-3 h-3" />
                          </>
                        ) : (
                          <>
                            Show {order.items.length - 2} More Items <FaChevronDown className="w-3 h-3" />
                          </>
                        )}
                      </button>
                    )}
                    
                    <div className="pt-2 sm:pt-3 border-t border-gray-200">
                      <div className="flex justify-between items-center">
                        <span className="font-semibold text-gray-900 text-sm sm:text-base">Total</span>
                        <span className="text-base sm:text-lg lg:text-xl font-bold text-green-800">
                          {formatCurrency(order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0))}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Help Card */}
                <div className="bg-gradient-to-br from-green-700 to-emerald-800 rounded-xl shadow-lg p-4 sm:p-6">
                  <h3 className="text-base sm:text-lg lg:text-xl font-bold text-white mb-2 sm:mb-3">
                    Need Help?
                  </h3>
                  <p className="text-green-100 mb-4 sm:mb-6 text-xs sm:text-sm">
                    Our customer support team is here to assist you
                  </p>
                  <div className="space-y-2 sm:space-y-3">
                    <a
                      href="tel:+922112345678"
                      className="flex items-center gap-2 sm:gap-3 bg-white/10 hover:bg-white/20 text-white p-2 sm:p-3 rounded-lg transition group"
                    >
                      <div className="w-8 h-8 sm:w-9 sm:h-9 lg:w-10 lg:h-10 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                        <FaPhone className="w-3 h-3 sm:w-4 sm:h-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-xs sm:text-sm">Call Support</p>
                        <p className="text-xs text-green-200 break-all">+92 21 1234 5678</p>
                      </div>
                    </a>
                    <a
                      href="mailto:support@pansariinn.com"
                      className="flex items-center gap-2 sm:gap-3 bg-white/10 hover:bg-white/20 text-white p-2 sm:p-3 rounded-lg transition group"
                    >
                      <div className="w-8 h-8 sm:w-9 sm:h-9 lg:w-10 lg:h-10 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                        <FaEnvelope className="w-3 h-3 sm:w-4 sm:h-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-xs sm:text-sm">Email Us</p>
                        <p className="text-xs text-green-200 break-all">support@pansariinn.com</p>
                      </div>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!order && !loading && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
          <div className="max-w-2xl mx-auto text-center">
            <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
              <FaBox className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-green-700" />
            </div>
            <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-2 sm:mb-4">
              Track Your Order
            </h3>
            <p className="text-sm sm:text-base text-gray-700 mb-6 sm:mb-8 px-4">
              Enter your order number and phone number above to see real-time tracking updates
            </p>
            
            {/* Feature steps - grid on mobile, row on larger */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 px-4">
              <div className="bg-white p-4 sm:p-5 rounded-lg shadow-sm border border-gray-200">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3">
                  <FaSearch className="w-4 h-4 sm:w-5 sm:h-5 text-green-700" />
                </div>
                <p className="font-semibold text-gray-900 text-xs sm:text-sm">Enter Details</p>
                <p className="text-gray-600 text-xs mt-1">Order number & phone</p>
              </div>
              <div className="bg-white p-4 sm:p-5 rounded-lg shadow-sm border border-gray-200">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3">
                  <FaTruck className="w-4 h-4 sm:w-5 sm:h-5 text-green-700" />
                </div>
                <p className="font-semibold text-gray-900 text-xs sm:text-sm">Track Progress</p>
                <p className="text-gray-600 text-xs mt-1">Real-time updates</p>
              </div>
              <div className="bg-white p-4 sm:p-5 rounded-lg shadow-sm border border-gray-200">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3">
                  <FaHome className="w-4 h-4 sm:w-5 sm:h-5 text-green-700" />
                </div>
                <p className="font-semibold text-gray-900 text-xs sm:text-sm">Receive Order</p>
                <p className="text-gray-600 text-xs mt-1">Safe delivery</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}