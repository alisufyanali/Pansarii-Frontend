// app/shipping-info/page.tsx
'use client';

import { FaTruck, FaMapMarkerAlt, FaClock, FaBoxOpen, FaShieldAlt } from 'react-icons/fa';

// JSON Data
const shippingData = {
  hero: {
    title: "Shipping Information",
    subtitle: "Fast & Reliable Delivery Across Pakistan",
    description: "We deliver authentic herbal products to your doorstep with care and speed."
  },
  deliveryZones: [
    {
      zone: "Major Cities",
      cities: ["Karachi", "Lahore", "Islamabad", "Rawalpindi", "Faisalabad"],
      time: "2-3 business days",
      cost: "PKR 150",
      icon: "🏙️"
    },
    {
      zone: "Other Cities",
      cities: ["Multan", "Peshawar", "Quetta", "Sialkot", "Gujranwala"],
      time: "3-5 business days",
      cost: "PKR 200",
      icon: "🏘️"
    },
    {
      zone: "Remote Areas",
      cities: ["All other areas"],
      time: "5-7 business days",
      cost: "PKR 250",
      icon: "🏔️"
    }
  ],
  freeShipping: {
    enabled: true,
    threshold: 2000,
    description: "Get FREE shipping on all orders above PKR 2,000"
  },
  process: {
    title: "Shipping Process",
    steps: [
      {
        title: "Order Confirmation",
        description: "You'll receive an email confirmation immediately after placing your order.",
        time: "Instant"
      },
      {
        title: "Processing",
        description: "Our team carefully packages your products ensuring quality and safety.",
        time: "1-2 hours"
      },
      {
        title: "Dispatch",
        description: "Your order is handed over to our trusted courier partners.",
        time: "Within 24 hours"
      },
      {
        title: "In Transit",
        description: "Track your package in real-time using the tracking number sent to your email.",
        time: "2-7 days"
      },
      {
        title: "Delivery",
        description: "Our courier partner delivers the package to your doorstep.",
        time: "Varies by zone"
      }
    ]
  },
  packaging: {
    title: "Our Packaging Promise",
    features: [
      {
        icon: "📦",
        title: "Secure Packaging",
        description: "Double-layer bubble wrap and sturdy boxes for fragile items"
      },
      {
        icon: "🌡️",
        title: "Temperature Control",
        description: "Special packaging for heat-sensitive herbal products"
      },
      {
        icon: "♻️",
        title: "Eco-Friendly",
        description: "We use recyclable and biodegradable packaging materials"
      },
      {
        icon: "🔒",
        title: "Tamper-Proof",
        description: "All packages are sealed with security tape"
      }
    ]
  },
  courierPartners: [
    { name: "TCS", logo: "/images/tcs-logo.png" },
    { name: "Leopards", logo: "/images/leopards-logo.png" },
    { name: "M&P", logo: "/images/mp-logo.png" },
    { name: "BlueEx", logo: "/images/blueex-logo.png" }
  ],
  tracking: {
    title: "Track Your Order",
    description: "Stay updated with real-time tracking information",
    steps: [
      "You'll receive a tracking number via email and SMS",
      "Click the tracking link or visit our website",
      "Enter your tracking number",
      "View real-time status updates"
    ]
  },
  policies: [
    {
      title: "Order Processing Time",
      content: "Orders are processed Monday to Saturday (9 AM - 6 PM). Orders placed after 6 PM or on Sunday will be processed the next business day."
    },
    {
      title: "Delivery Attempts",
      content: "Our courier partners make up to 3 delivery attempts. If unsuccessful, the package will be returned to our warehouse."
    },
    {
      title: "Delivery Issues",
      content: "If you face any delivery issues, contact our customer support immediately at +92 300 1234567 or support@pansariin.pk"
    },
    {
      title: "Address Changes",
      content: "Address cannot be changed once the order is dispatched. Please ensure your delivery address is correct before placing an order."
    }
  ],
  faq: [
    {
      question: "Can I change my delivery address?",
      answer: "Address can only be changed before the order is dispatched. Contact us immediately if you need to make changes."
    },
    {
      question: "Do you deliver on weekends?",
      answer: "Yes, our courier partners deliver on Saturdays. Sunday deliveries depend on the courier partner and location."
    },
    {
      question: "What if I'm not home during delivery?",
      answer: "The courier will attempt delivery up to 3 times. You can also arrange for someone else to receive the package."
    },
    {
      question: "How can I track my order?",
      answer: "You'll receive a tracking number via email and SMS. Use this number on our website or the courier's website to track your package."
    }
  ]
};

export default function ShippingInfoPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      
      {/* Hero */}
      <section className="bg-gradient-to-r from-green-800 to-emerald-800 text-white py-16">
        <div className="max-w-[1920px] mx-auto px-[4%]">
          <div className="max-w-3xl mx-auto text-center">
            <FaTruck className="w-16 h-16 mx-auto mb-6" />
            <h1 className="text-4xl sm:text-5xl font-bold mb-4">
              {shippingData.hero.title}
            </h1>
            <p className="text-xl text-green-100 mb-4">
              {shippingData.hero.subtitle}
            </p>
            <p className="text-lg text-green-100">
              {shippingData.hero.description}
            </p>
          </div>
        </div>
      </section>

      {/* Free Shipping Banner */}
      {shippingData.freeShipping.enabled && (
        <section className="bg-green-600 text-white py-4">
          <div className="max-w-[1920px] mx-auto px-[4%] text-center">
            <p className="text-lg font-semibold">
              🎉 {shippingData.freeShipping.description} 🎉
            </p>
          </div>
        </section>
      )}

      {/* Delivery Zones */}
      <section className="py-12 bg-white">
        <div className="max-w-6xl mx-auto px-[4%]">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Delivery Zones & Charges
          </h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            {shippingData.deliveryZones.map((zone, idx) => (
              <div key={idx} className="bg-gray-50 rounded-xl border-2 border-gray-200 p-6 hover:border-green-500 transition">
                <div className="text-4xl mb-4 text-center">{zone.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">
                  {zone.zone}
                </h3>
                <div className="space-y-3 mb-4">
                  <div className="flex items-center gap-2 text-gray-700">
                    <FaClock className="w-4 h-4 text-green-600" />
                    <span className="text-sm">{zone.time}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-700">
                    <FaTruck className="w-4 h-4 text-green-600" />
                    <span className="text-sm font-bold">{zone.cost}</span>
                  </div>
                </div>
                <div className="text-sm text-gray-600">
                  {zone.cities.map((city, i) => (
                    <span key={i}>
                      {city}
                      {i < zone.cities.length - 1 && ', '}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Shipping Process */}
      <section className="py-12">
        <div className="max-w-6xl mx-auto px-[4%]">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            {shippingData.process.title}
          </h2>
          
          <div className="relative">
            {/* Timeline line for desktop */}
            <div className="hidden md:block absolute top-8 left-0 right-0 h-1 bg-green-200"></div>
            
            <div className="grid md:grid-cols-5 gap-6 relative">
              {shippingData.process.steps.map((step, idx) => (
                <div key={idx} className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-600 text-white flex items-center justify-center font-bold text-xl relative z-10">
                    {idx + 1}
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">{step.title}</h3>
                  <p className="text-sm text-gray-600 mb-2">{step.description}</p>
                  <p className="text-xs text-green-600 font-semibold">{step.time}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Packaging */}
      <section className="py-12 bg-white">
        <div className="max-w-6xl mx-auto px-[4%]">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            {shippingData.packaging.title}
          </h2>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {shippingData.packaging.features.map((feature, idx) => (
              <div key={idx} className="bg-gray-50 rounded-xl p-6 text-center">
                <div className="text-4xl mb-3">{feature.icon}</div>
                <h3 className="font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tracking */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-[4%]">
          <div className="bg-green-50 border-2 border-green-200 rounded-xl p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 text-center">
              {shippingData.tracking.title}
            </h2>
            <p className="text-center text-gray-700 mb-6">
              {shippingData.tracking.description}
            </p>
            <ol className="space-y-3">
              {shippingData.tracking.steps.map((step, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-green-600 text-white flex items-center justify-center text-sm font-bold">
                    {idx + 1}
                  </span>
                  <span className="text-gray-700">{step}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* Policies */}
      <section className="py-12 bg-white">
        <div className="max-w-4xl mx-auto px-[4%]">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Shipping Policies
          </h2>
          
          <div className="space-y-6">
            {shippingData.policies.map((policy, idx) => (
              <div key={idx} className="bg-gray-50 rounded-xl p-6">
                <h3 className="font-bold text-gray-900 mb-2">{policy.title}</h3>
                <p className="text-gray-700">{policy.content}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-[4%]">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Frequently Asked Questions
          </h2>
          
          <div className="space-y-4">
            {shippingData.faq.map((item, idx) => (
              <div key={idx} className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="font-bold text-gray-900 mb-2">{item.question}</h3>
                <p className="text-gray-700">{item.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 bg-gradient-to-r from-green-700 to-emerald-700 text-white">
        <div className="max-w-4xl mx-auto px-[4%] text-center">
          <h2 className="text-3xl font-bold mb-4">Still Have Questions?</h2>
          <p className="text-lg text-green-100 mb-6">
            Our customer support team is here to help you with any shipping concerns.
          </p>
          <button className="px-8 py-4 bg-white text-green-700 rounded-lg hover:bg-gray-100 transition font-semibold text-lg">
            Contact Support
          </button>
        </div>
      </section>

    </div>
  );
}