"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import { FaLock, FaCreditCard, FaCheckCircle, FaChevronDown } from 'react-icons/fa';

export default function CheckoutPage() {
  const router = useRouter();
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [phoneValue, setPhoneValue] = useState<string>('');
  const [selectedCity, setSelectedCity] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Pakistani cities data - exact same as original
  const pakistaniCities = [
    // Punjab
    { value: 'lahore', label: 'Lahore', province: 'Punjab' },
    { value: 'faisalabad', label: 'Faisalabad', province: 'Punjab' },
    { value: 'rawalpindi', label: 'Rawalpindi', province: 'Punjab' },
    { value: 'multan', label: 'Multan', province: 'Punjab' },
    { value: 'gujranwala', label: 'Gujranwala', province: 'Punjab' },
    { value: 'sialkot', label: 'Sialkot', province: 'Punjab' },
    { value: 'bahawalpur', label: 'Bahawalpur', province: 'Punjab' },
    { value: 'sargodha', label: 'Sargodha', province: 'Punjab' },
    
    // Sindh
    { value: 'karachi', label: 'Karachi', province: 'Sindh' },
    { value: 'hyderabad', label: 'Hyderabad', province: 'Sindh' },
    { value: 'sukkur', label: 'Sukkur', province: 'Sindh' },
    { value: 'larkana', label: 'Larkana', province: 'Sindh' },
    { value: 'navabshah', label: 'Nawabshah', province: 'Sindh' },
    
    // KPK
    { value: 'peshawar', label: 'Peshawar', province: 'KPK' },
    { value: 'mardan', label: 'Mardan', province: 'KPK' },
    { value: 'abbottabad', label: 'Abbottabad', province: 'KPK' },
    { value: 'swat', label: 'Swat', province: 'KPK' },
    { value: 'nowshera', label: 'Nowshera', province: 'KPK' },
    
    // Balochistan
    { value: 'quetta', label: 'Quetta', province: 'Balochistan' },
    { value: 'gwadar', label: 'Gwadar', province: 'Balochistan' },
    { value: 'turbat', label: 'Turbat', province: 'Balochistan' },
    
    // Islamabad & AJK
    { value: 'islamabad', label: 'Islamabad', province: 'Islamabad Capital Territory' },
    { value: 'muzaffarabad', label: 'Muzaffarabad', province: 'Azad Jammu & Kashmir' },
    { value: 'mirpur', label: 'Mirpur', province: 'Azad Jammu & Kashmir' },
  ];

  const cartItems = [
    {
      id: 1,
      img: '/images/product.png',
      nameEn: 'Cold Pressed Almond Oil',
      price: 899,
      quantity: 2,
      size: '30ml'
    },
    {
      id: 2,
      img: '/images/product.png',
      nameEn: 'Organic Coconut Oil',
      price: 749,
      quantity: 1,
      size: '50ml'
    }
  ];

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = 200;
  const total = subtotal + shipping;

  // handleSubmit - exact same as original
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Generate order ID
    const orderId = `ORD-${Date.now().toString().slice(-8)}`;
    
    // Prepare order data
    const orderData = {
      orderId,
      orderDate: new Date().toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      }),
      estimatedDelivery: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      }),
      items: cartItems,
      subtotal,
      shipping,
      total,
      shippingAddress: {
        name: (e.target as any).name.value,
        phone: phoneValue,
        email: (e.target as any).email.value,
        address: (e.target as any).address.value,
        city: selectedCity,
        postalCode: (e.target as any).postalCode.value,
      },
      paymentMethod: paymentMethod === 'cod' ? 'Cash on Delivery' : 
                     paymentMethod === 'online' ? 'Online Payment' : 'Bank Transfer'
    };

    // Save order to localStorage - exact same as original
    localStorage.setItem(`order-${orderId}`, JSON.stringify(orderData));
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Redirect to order confirmation page
    router.push(`/order-confirmation?orderId=${orderId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Custom CSS for phone input styling - exact same as original */}
      <style jsx global>{`
        .PhoneInput {
          width: 100%;
        }
        
        .PhoneInputInput {
          width: 100%;
          padding: 0.75rem 1rem;
          border: 1px solid #d1d5db;
          border-radius: 0.5rem;
          font-size: 1rem;
          outline: none;
          transition: all 0.2s;
        }
        
        .PhoneInputInput:focus {
          border-color: #15803d;
          ring: 2px;
          ring-color: #15803d;
          box-shadow: 0 0 0 2px rgba(21, 128, 61, 0.1);
        }
        
        .PhoneInputCountry {
          margin-right: 0.5rem;
          padding: 0.75rem;
          border: 1px solid #d1d5db;
          border-radius: 0.5rem;
          background: white;
          cursor: pointer;
          transition: all 0.2s;
        }
        
        .PhoneInputCountry:hover {
          border-color: #9ca3af;
        }
        
        .PhoneInputCountrySelect {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          opacity: 0;
          cursor: pointer;
        }
        
        .PhoneInputCountryIcon {
          width: 1.5rem;
          height: 1.5rem;
          margin-right: 0.5rem;
        }
        
        .PhoneInputCountrySelectArrow {
          margin-left: 0.25rem;
          opacity: 0.6;
          width: 0.5rem;
          height: 0.5rem;
        }
      `}</style>

      {/* Header */}
      <div className="bg-white border-b">
        <div className="mx-[2%] sm:mx-[4%] py-4 sm:py-6">
          <div className="flex items-center justify-between">
            <h1 className="text-xl sm:text-3xl font-bold text-gray-900">Checkout</h1>
            <div className="flex items-center gap-2 text-green-700">
              <FaLock className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="font-semibold text-sm sm:text-base">Secure Checkout</span>
            </div>
          </div>
          {/* Progress Steps */}
          <div className="flex items-center gap-2 sm:gap-4 mt-4 sm:mt-6">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <div className="w-7 h-7 sm:w-8 sm:h-8 bg-green-700 text-white rounded-full flex items-center justify-center font-bold">
                <FaCheckCircle className="w-3 h-3 sm:w-4 sm:h-4" />
              </div>
              <span className="font-medium text-gray-900 text-sm sm:text-base">Cart</span>
            </div>
            <div className="w-8 sm:w-12 h-0.5 bg-green-700"></div>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <div className="w-7 h-7 sm:w-8 sm:h-8 bg-green-700 text-white rounded-full flex items-center justify-center font-bold text-sm">
                2
              </div>
              <span className="font-medium text-gray-900 text-sm sm:text-base">Checkout</span>
            </div>
            <div className="w-8 sm:w-12 h-0.5 bg-gray-300"></div>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gray-300 text-gray-600 rounded-full flex items-center justify-center font-bold text-sm">
                3
              </div>
              <span className="font-medium text-gray-500 text-sm sm:text-base">Complete</span>
            </div>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="mx-[2%] sm:mx-[4%] py-5 sm:py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 sm:gap-8">
            {/* Left Column - Forms */}
            <div className="lg:col-span-2 space-y-4 sm:space-y-6">
              
              {/* Contact Information */}
              <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
                <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-5 sm:mb-6">Contact Information</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      name="name"
                      type="text"
                      required
                      className="w-full px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-700 text-sm sm:text-base"
                      placeholder="Ahmed Khan"
                    />
                  </div>
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      name="email"
                      type="email"
                      required
                      className="w-full px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-700 text-sm sm:text-base"
                      placeholder="ahmed@example.com"
                    />
                  </div>
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                      Phone Number *
                    </label>
                    <PhoneInput
                      international
                      defaultCountry="PK"
                      value={phoneValue}
                      onChange={(value) => setPhoneValue(value || '')}
                      required
                      placeholder="Enter phone number"
                      className="phone-input-wrapper"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Select your country and enter your phone number
                    </p>
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
                <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-5 sm:mb-6">Shipping Address</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                      Street Address *
                    </label>
                    <input
                      name="address"
                      type="text"
                      required
                      className="w-full px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-700 text-sm sm:text-base"
                      placeholder="House/Flat no, Street name, Area"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                        City *
                      </label>
                      <div className="relative">
                        <select
                          name="city"
                          value={selectedCity}
                          onChange={(e) => setSelectedCity(e.target.value)}
                          required
                          className="w-full px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-700 appearance-none bg-white text-sm sm:text-base"
                        >
                          <option value="">Select your city</option>
                          <optgroup label="Punjab">
                            {pakistaniCities.filter(city => city.province === 'Punjab').map(city => (
                              <option key={city.value} value={city.value}>
                                {city.label}
                              </option>
                            ))}
                          </optgroup>
                          <optgroup label="Sindh">
                            {pakistaniCities.filter(city => city.province === 'Sindh').map(city => (
                              <option key={city.value} value={city.value}>
                                {city.label}
                              </option>
                            ))}
                          </optgroup>
                          <optgroup label="Khyber Pakhtunkhwa">
                            {pakistaniCities.filter(city => city.province === 'KPK').map(city => (
                              <option key={city.value} value={city.value}>
                                {city.label}
                              </option>
                            ))}
                          </optgroup>
                          <optgroup label="Balochistan">
                            {pakistaniCities.filter(city => city.province === 'Balochistan').map(city => (
                              <option key={city.value} value={city.value}>
                                {city.label}
                              </option>
                            ))}
                          </optgroup>
                          <optgroup label="Other">
                            {pakistaniCities.filter(city => 
                              city.province === 'Islamabad Capital Territory' || 
                              city.province === 'Azad Jammu & Kashmir'
                            ).map(city => (
                              <option key={city.value} value={city.value}>
                                {city.label}
                              </option>
                            ))}
                          </optgroup>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                          <FaChevronDown className="h-3 w-3 sm:h-4 sm:w-4" />
                        </div>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                        Area/Sector
                      </label>
                      <input
                        name="area"
                        type="text"
                        className="w-full px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-700 text-sm sm:text-base"
                        placeholder="Gulshan, DHA, etc."
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                      Postal Code
                    </label>
                    <input
                      name="postalCode"
                      type="text"
                      className="w-full px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-700 text-sm sm:text-base"
                      placeholder="75500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                      Delivery Instructions (Optional)
                    </label>
                    <textarea
                      name="instructions"
                      rows={3}
                      className="w-full px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-700 text-sm sm:text-base"
                      placeholder="e.g., Call before delivery, Leave at reception, etc."
                    ></textarea>
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
                <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-5 sm:mb-6">Payment Method</h2>
                <div className="space-y-3 sm:space-y-4">
                  {/* Cash on Delivery */}
                  <label className={`flex items-center gap-3 sm:gap-4 p-3 sm:p-4 border-2 rounded-lg cursor-pointer transition ${
                    paymentMethod === 'cod' ? 'border-green-700 bg-green-50' : 'border-gray-300 hover:border-gray-400'
                  }`}>
                    <input
                      type="radio"
                      name="payment"
                      value="cod"
                      checked={paymentMethod === 'cod'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-4 h-4 sm:w-5 sm:h-5 text-green-700"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 sm:gap-3">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-100 rounded-lg flex items-center justify-center text-lg sm:text-xl">
                          💵
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 text-sm sm:text-base">Cash on Delivery</p>
                          <p className="text-xs sm:text-sm text-gray-600">Pay when you receive</p>
                        </div>
                      </div>
                    </div>
                  </label>

                  {/* Online Payment */}
                  <label className={`flex items-center gap-3 sm:gap-4 p-3 sm:p-4 border-2 rounded-lg cursor-pointer transition ${
                    paymentMethod === 'online' ? 'border-green-700 bg-green-50' : 'border-gray-300 hover:border-gray-400'
                  }`}>
                    <input
                      type="radio"
                      name="payment"
                      value="online"
                      checked={paymentMethod === 'online'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-4 h-4 sm:w-5 sm:h-5 text-green-700"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 sm:gap-3">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                          <FaCreditCard className="text-lg sm:text-2xl text-gray-600" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 text-sm sm:text-base">Online Payment</p>
                          <p className="text-xs sm:text-sm text-gray-600">Credit/Debit Card, JazzCash, EasyPaisa</p>
                        </div>
                      </div>
                    </div>
                  </label>

                  {/* Bank Transfer */}
                  <label className={`flex items-center gap-3 sm:gap-4 p-3 sm:p-4 border-2 rounded-lg cursor-pointer transition ${
                    paymentMethod === 'bank' ? 'border-green-700 bg-green-50' : 'border-gray-300 hover:border-gray-400'
                  }`}>
                    <input
                      type="radio"
                      name="payment"
                      value="bank"
                      checked={paymentMethod === 'bank'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-4 h-4 sm:w-5 sm:h-5 text-green-700"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 sm:gap-3">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-100 rounded-lg flex items-center justify-center text-lg sm:text-xl">
                          🏦
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 text-sm sm:text-base">Bank Transfer</p>
                          <p className="text-xs sm:text-sm text-gray-600">Direct bank deposit</p>
                        </div>
                      </div>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            {/* Right Column - Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-sm lg:sticky lg:top-24">
                <div className="p-4 sm:p-6">
                  <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-5 sm:mb-6">Order Summary</h2>

                  {/* Cart Items */}
                  <div className="space-y-3 sm:space-y-4 mb-6 border-b pb-6">
                    {cartItems.map((item) => (
                      <div key={item.id} className="flex gap-3 sm:gap-4">
                        <div className="w-14 h-14 sm:w-16 sm:h-16 flex-shrink-0">
                          <img 
                            src={item.img}
                            alt={item.nameEn}
                            className="w-full h-full object-cover rounded-lg border"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-gray-900 text-xs sm:text-sm truncate">{item.nameEn}</h4>
                          <p className="text-xs text-gray-500">Size: {item.size}</p>
                          <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <p className="font-semibold text-gray-900 text-sm sm:text-base">
                            PKR {(item.price * item.quantity).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Price Breakdown */}
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between text-sm sm:text-base text-gray-600">
                      <span>Subtotal</span>
                      <span className="font-semibold">PKR {subtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm sm:text-base text-gray-600">
                      <span>Shipping</span>
                      <span className="font-semibold">PKR {shipping}</span>
                    </div>
                    <div className="border-t pt-3">
                      <div className="flex justify-between text-lg sm:text-xl font-bold text-gray-900">
                        <span>Total</span>
                        <span>PKR {total.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  {/* Place Order Button */}
                  <button 
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full bg-green-700 text-white py-3 sm:py-4 rounded-full font-bold text-base sm:text-lg transition shadow-lg hover:shadow-xl transform ${
                      isSubmitting ? 'opacity-70 cursor-not-allowed' : 'hover:scale-105 hover:bg-green-600'
                    }`}
                  >
                    {isSubmitting ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="animate-spin h-4 w-4 sm:h-5 sm:w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processing...
                      </span>
                    ) : (
                      'Place Order'
                    )}
                  </button>

                  <p className="text-xs text-gray-500 text-center mt-4">
                    By placing your order, you agree to our terms and conditions
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}