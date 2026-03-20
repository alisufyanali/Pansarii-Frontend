// app/return/page.tsx
'use client';

import { FaUndo, FaBox, FaClock, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

// JSON Data
const returnPolicyData = {
  hero: {
    title: "Return & Refund Policy",
    subtitle: "Your Satisfaction is Our Priority",
    description: "We want you to be completely satisfied with your purchase. Here's everything you need to know about returns and refunds."
  },
  returnWindow: {
    title: "Return Window",
    days: 7,
    description: "You can return most items within 7 days of delivery for a full refund."
  },
  eligibleItems: {
    title: "Eligible for Return",
    items: [
      "Unopened and unused products in original packaging",
      "Products with manufacturing defects",
      "Wrong items delivered",
      "Damaged items received",
      "Products not matching the description"
    ]
  },
  nonEligibleItems: {
    title: "Non-Eligible for Return",
    items: [
      "Opened herbal products (for hygiene reasons)",
      "Used or consumed products",
      "Products without original packaging",
      "Items marked as non-returnable",
      "Products purchased during final sale"
    ]
  },
  process: {
    title: "Return Process",
    steps: [
      {
        step: 1,
        title: "Initiate Return",
        description: "Contact our customer service within 7 days of delivery via phone, email, or WhatsApp.",
        icon: "📞"
      },
      {
        step: 2,
        title: "Get Approval",
        description: "Our team will review your request and provide return authorization within 24 hours.",
        icon: "✅"
      },
      {
        step: 3,
        title: "Pack & Ship",
        description: "Carefully pack the item in its original packaging and ship it back to our warehouse.",
        icon: "📦"
      },
      {
        step: 4,
        title: "Inspection",
        description: "We'll inspect the returned item within 2-3 business days of receiving it.",
        icon: "🔍"
      },
      {
        step: 5,
        title: "Refund Processing",
        description: "Once approved, refund will be processed within 5-7 business days to your original payment method.",
        icon: "💰"
      }
    ]
  },
  refundMethods: [
    {
      method: "Bank Transfer",
      time: "5-7 business days",
      description: "Direct refund to your bank account"
    },
    {
      method: "Store Credit",
      time: "Instant",
      description: "Get immediate credit for future purchases"
    },
    {
      method: "Original Payment Method",
      time: "7-10 business days",
      description: "Refund to the card/account used for purchase"
    }
  ],
  conditions: [
    "Product must be in its original condition and packaging",
    "All tags and labels must be intact",
    "Return shipping costs are the customer's responsibility (unless the item is defective)",
    "Refund amount excludes original shipping charges",
    "No returns accepted after 7 days from delivery date"
  ],
  contact: {
    title: "Need Help with Returns?",
    phone: "+92 300 1234567",
    email: "returns@pansariin.pk",
    whatsapp: "+92 300 1234567",
    hours: "Mon-Sat: 9:00 AM - 6:00 PM"
  }
};

export default function ReturnPolicyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      
      {/* Hero */}
      <section className="bg-gradient-to-r from-green-800 to-emerald-800 text-white py-16">
        <div className="max-w-[1920px] mx-auto px-[4%]">
          <div className="max-w-3xl mx-auto text-center">
            <FaUndo className="w-16 h-16 mx-auto mb-6" />
            <h1 className="text-4xl sm:text-5xl font-bold mb-4">
              {returnPolicyData.hero.title}
            </h1>
            <p className="text-xl text-green-100 mb-4">
              {returnPolicyData.hero.subtitle}
            </p>
            <p className="text-lg text-green-100">
              {returnPolicyData.hero.description}
            </p>
          </div>
        </div>
      </section>

      {/* Return Window */}
      <section className="py-12 bg-white">
        <div className="max-w-4xl mx-auto px-[4%]">
          <div className="bg-green-50 border-2 border-green-200 rounded-xl p-8 text-center">
            <FaClock className="w-12 h-12 text-green-700 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {returnPolicyData.returnWindow.title}
            </h2>
            <div className="text-5xl font-bold text-green-700 mb-2">
              {returnPolicyData.returnWindow.days} Days
            </div>
            <p className="text-gray-700">
              {returnPolicyData.returnWindow.description}
            </p>
          </div>
        </div>
      </section>

      {/* Eligible vs Non-Eligible */}
      <section className="py-12">
        <div className="max-w-6xl mx-auto px-[4%]">
          <div className="grid md:grid-cols-2 gap-8">
            
            {/* Eligible */}
            <div className="bg-white rounded-xl border-2 border-green-200 p-8">
              <div className="flex items-center gap-3 mb-6">
                <FaCheckCircle className="w-8 h-8 text-green-600" />
                <h3 className="text-2xl font-bold text-gray-900">
                  {returnPolicyData.eligibleItems.title}
                </h3>
              </div>
              <ul className="space-y-3">
                {returnPolicyData.eligibleItems.items.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <span className="text-green-600 font-bold mt-1">✓</span>
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Non-Eligible */}
            <div className="bg-white rounded-xl border-2 border-red-200 p-8">
              <div className="flex items-center gap-3 mb-6">
                <FaTimesCircle className="w-8 h-8 text-red-600" />
                <h3 className="text-2xl font-bold text-gray-900">
                  {returnPolicyData.nonEligibleItems.title}
                </h3>
              </div>
              <ul className="space-y-3">
                {returnPolicyData.nonEligibleItems.items.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <span className="text-red-600 font-bold mt-1">✗</span>
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

          </div>
        </div>
      </section>

      {/* Return Process */}
      <section className="py-12 bg-white">
        <div className="max-w-6xl mx-auto px-[4%]">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            {returnPolicyData.process.title}
          </h2>
          
          <div className="space-y-6">
            {returnPolicyData.process.steps.map((step, idx) => (
              <div key={idx} className="flex gap-6 items-start">
                <div className="flex-shrink-0 w-16 h-16 rounded-full bg-green-100 text-green-700 flex items-center justify-center text-2xl font-bold">
                  {step.step}
                </div>
                <div className="flex-1 bg-gray-50 rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-3xl">{step.icon}</span>
                    <h3 className="text-xl font-bold text-gray-900">{step.title}</h3>
                  </div>
                  <p className="text-gray-700">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Refund Methods */}
      <section className="py-12">
        <div className="max-w-6xl mx-auto px-[4%]">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Refund Methods
          </h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            {returnPolicyData.refundMethods.map((method, idx) => (
              <div key={idx} className="bg-white rounded-xl border border-gray-200 p-6 text-center hover:shadow-lg transition">
                <h3 className="text-lg font-bold text-gray-900 mb-2">{method.method}</h3>
                <div className="text-green-700 font-bold mb-3">{method.time}</div>
                <p className="text-gray-600 text-sm">{method.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Terms & Conditions */}
      <section className="py-12 bg-white">
        <div className="max-w-4xl mx-auto px-[4%]">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Terms & Conditions
          </h2>
          <ul className="space-y-3">
            {returnPolicyData.conditions.map((condition, idx) => (
              <li key={idx} className="flex items-start gap-3 text-gray-700">
                <span className="text-green-600 mt-1">•</span>
                <span>{condition}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Contact */}
      <section className="py-12 bg-gradient-to-r from-green-700 to-emerald-700 text-white">
        <div className="max-w-4xl mx-auto px-[4%] text-center">
          <h2 className="text-3xl font-bold mb-6">{returnPolicyData.contact.title}</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <div className="font-bold mb-1">Phone</div>
              <div className="text-green-100">{returnPolicyData.contact.phone}</div>
            </div>
            <div>
              <div className="font-bold mb-1">Email</div>
              <div className="text-green-100">{returnPolicyData.contact.email}</div>
            </div>
            <div>
              <div className="font-bold mb-1">WhatsApp</div>
              <div className="text-green-100">{returnPolicyData.contact.whatsapp}</div>
            </div>
            <div>
              <div className="font-bold mb-1">Hours</div>
              <div className="text-green-100">{returnPolicyData.contact.hours}</div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}