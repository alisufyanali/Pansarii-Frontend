'use client';

import { FaTruck, FaClock, FaBoxOpen, FaShieldAlt, FaLeaf, FaLock, FaThermometerHalf } from 'react-icons/fa';
import Link from 'next/link';
import PageBanner from '@/components/PageBanner';

const deliveryZones = [
  { zone: 'Major Cities',  cities: ['Karachi', 'Lahore', 'Islamabad', 'Rawalpindi', 'Faisalabad'], time: '2–3 business days', cost: 'PKR 150' },
  { zone: 'Other Cities',  cities: ['Multan', 'Peshawar', 'Quetta', 'Sialkot', 'Gujranwala'],     time: '3–5 business days', cost: 'PKR 200' },
  { zone: 'Remote Areas',  cities: ['All other areas'],                                             time: '5–7 business days', cost: 'PKR 250' },
];

const processSteps = [
  { title: 'Order Confirmation', desc: 'Email confirmation immediately after placing your order.',                    time: 'Instant'         },
  { title: 'Processing',         desc: 'Our team carefully packages your products ensuring quality and safety.',      time: '1–2 hours'       },
  { title: 'Dispatch',           desc: 'Your order is handed over to our trusted courier partners.',                  time: 'Within 24 hours' },
  { title: 'In Transit',         desc: 'Track your package in real-time using the tracking number sent to your email.',time: '2–7 days'        },
  { title: 'Delivery',           desc: 'Our courier partner delivers the package to your doorstep.',                  time: 'Varies by zone'  },
];

const packagingFeatures = [
  { Icon: FaBoxOpen,          title: 'Secure Packaging',    desc: 'Double-layer bubble wrap and sturdy boxes for fragile items' },
  { Icon: FaThermometerHalf,  title: 'Temperature Control', desc: 'Special packaging for heat-sensitive herbal products' },
  { Icon: FaLeaf,             title: 'Eco-Friendly',        desc: 'Recyclable and biodegradable packaging materials' },
  { Icon: FaLock,             title: 'Tamper-Proof',        desc: 'All packages are sealed with security tape' },
];

const policies = [
  { title: 'Order Processing Time',  content: 'Orders are processed Monday to Saturday (9 AM – 6 PM). Orders placed after 6 PM or on Sunday will be processed the next business day.' },
  { title: 'Delivery Attempts',      content: 'Our courier partners make up to 3 delivery attempts. If unsuccessful, the package will be returned to our warehouse.' },
  { title: 'Delivery Issues',        content: 'If you face any delivery issues, contact our customer support immediately at +92 304 5779900 or support@pansariin.pk' },
  { title: 'Address Changes',        content: 'Address cannot be changed once the order is dispatched. Please ensure your delivery address is correct before placing an order.' },
];

const faqs = [
  { q: 'Can I change my delivery address?',    a: 'Address can only be changed before the order is dispatched. Contact us immediately if you need to make changes.' },
  { q: 'Do you deliver on weekends?',          a: 'Yes, our courier partners deliver on Saturdays. Sunday deliveries depend on the courier partner and location.' },
  { q: 'What if I\'m not home during delivery?', a: 'The courier will attempt delivery up to 3 times. You can also arrange for someone else to receive the package.' },
  { q: 'How can I track my order?',            a: 'You\'ll receive a tracking number via email and SMS. Use this number on our website or the courier\'s website to track your package.' },
];

export default function ShippingInfoPage() {
  return (
    <div className="min-h-screen bg-gray-50">

      <PageBanner
        icon={<FaTruck className="w-8 h-8" />}
        title="Shipping Information"
        subtitle="Fast & Reliable Delivery Across Pakistan"
        description="We deliver authentic herbal products to your doorstep with care and speed."
      />

      {/* Free Shipping Banner */}
      <div className="bg-green-600 text-white py-2.5 text-center text-sm font-medium">
        Free shipping on all orders above PKR 2,000
      </div>

      {/* Delivery Zones */}
      <section className="py-8 bg-white">
        <div className="max-w-4xl mx-auto px-[4%]">
          <h2 className="text-xl font-bold text-gray-900 mb-5 text-center">Delivery Zones & Charges</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {deliveryZones.map((zone, i) => (
              <div key={i} className="bg-gray-50 rounded-xl border border-gray-200 p-5 hover:border-green-500 transition">
                <h3 className="text-base font-bold text-gray-900 mb-3 text-center">{zone.zone}</h3>
                <div className="space-y-2 mb-3">
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <FaClock className="w-3.5 h-3.5 text-green-600 flex-shrink-0" />
                    {zone.time}
                  </div>
                  <div className="flex items-center gap-2 text-sm font-semibold text-gray-900">
                    <FaTruck className="w-3.5 h-3.5 text-green-600 flex-shrink-0" />
                    {zone.cost}
                  </div>
                </div>
                <p className="text-xs text-gray-500">{zone.cities.join(', ')}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Shipping Process */}
      <section className="py-8">
        <div className="max-w-4xl mx-auto px-[4%]">
          <h2 className="text-xl font-bold text-gray-900 mb-6 text-center">Shipping Process</h2>
          <div className="relative">
            <div className="hidden md:block absolute top-5 left-5 right-5 h-0.5 bg-green-200" />
            <div className="grid md:grid-cols-5 gap-4 relative">
              {processSteps.map((step, i) => (
                <div key={i} className="text-center">
                  <div className="w-10 h-10 mx-auto mb-3 rounded-full bg-green-700 text-white flex items-center justify-center font-bold text-sm relative z-10">
                    {i + 1}
                  </div>
                  <h3 className="text-xs font-bold text-gray-900 mb-1">{step.title}</h3>
                  <p className="text-xs text-gray-500 mb-1">{step.desc}</p>
                  <p className="text-xs text-green-600 font-semibold">{step.time}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Packaging */}
      <section className="py-8 bg-white">
        <div className="max-w-4xl mx-auto px-[4%]">
          <h2 className="text-xl font-bold text-gray-900 mb-5 text-center">Our Packaging Promise</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {packagingFeatures.map(({ Icon, title, desc }, i) => (
              <div key={i} className="bg-gray-50 rounded-xl p-4 text-center">
                <Icon className="w-6 h-6 text-green-700 mx-auto mb-2" />
                <h3 className="text-sm font-bold text-gray-900 mb-1">{title}</h3>
                <p className="text-xs text-gray-500">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tracking */}
      <section className="py-8">
        <div className="max-w-3xl mx-auto px-[4%]">
          <div className="bg-green-50 border border-green-200 rounded-xl p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-2 text-center">Track Your Order</h2>
            <p className="text-sm text-gray-600 text-center mb-4">Stay updated with real-time tracking information</p>
            <ol className="space-y-2">
              {[
                "You'll receive a tracking number via email and SMS",
                'Click the tracking link or visit our website',
                'Enter your tracking number',
                'View real-time status updates',
              ].map((step, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-green-700 text-white flex items-center justify-center text-xs font-bold">{i + 1}</span>
                  <span className="text-sm text-gray-700">{step}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* Policies */}
      <section className="py-8 bg-white">
        <div className="max-w-3xl mx-auto px-[4%]">
          <h2 className="text-xl font-bold text-gray-900 mb-5 text-center">Shipping Policies</h2>
          <div className="space-y-3">
            {policies.map((p, i) => (
              <div key={i} className="bg-gray-50 rounded-xl p-4">
                <h3 className="text-sm font-bold text-gray-900 mb-1">{p.title}</h3>
                <p className="text-sm text-gray-600">{p.content}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-8">
        <div className="max-w-3xl mx-auto px-[4%]">
          <h2 className="text-xl font-bold text-gray-900 mb-5 text-center">Frequently Asked Questions</h2>
          <div className="space-y-3">
            {faqs.map((item, i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-200 p-4">
                <h3 className="text-sm font-bold text-gray-900 mb-1">{item.q}</h3>
                <p className="text-sm text-gray-600">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-8 bg-green-700 text-white text-center">
        <div className="max-w-xl mx-auto px-[4%]">
          <h2 className="text-lg font-bold mb-2">Still Have Questions?</h2>
          <p className="text-sm text-green-100 mb-4">Our customer support team is here to help you with any shipping concerns.</p>
          <Link href="/contact" className="inline-block px-6 py-2.5 bg-white text-green-700 rounded-lg hover:bg-gray-100 transition font-semibold text-sm">
            Contact Support
          </Link>
        </div>
      </section>

    </div>
  );
}
