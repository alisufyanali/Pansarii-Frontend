'use client';

import { FaUndo, FaClock, FaCheckCircle, FaTimesCircle, FaPhone, FaEnvelope, FaWhatsapp, FaBoxOpen, FaSearch, FaMoneyBillWave } from 'react-icons/fa';
import PageBanner from '@/components/PageBanner';

const stepIcons = [FaPhone, FaCheckCircle, FaBoxOpen, FaSearch, FaMoneyBillWave];

const data = {
  returnWindow: 7,
  eligible: [
    'Unopened and unused products in original packaging',
    'Products with manufacturing defects',
    'Wrong items delivered',
    'Damaged items received',
    'Products not matching the description',
  ],
  nonEligible: [
    'Opened herbal products (for hygiene reasons)',
    'Used or consumed products',
    'Products without original packaging',
    'Items marked as non-returnable',
    'Products purchased during final sale',
  ],
  steps: [
    { title: 'Initiate Return',      desc: 'Contact customer service within 7 days of delivery via phone, email, or WhatsApp.' },
    { title: 'Get Approval',         desc: 'Our team reviews your request and provides return authorization within 24 hours.' },
    { title: 'Pack & Ship',          desc: 'Carefully pack the item in original packaging and ship it back to our warehouse.' },
    { title: 'Inspection',           desc: 'We inspect the returned item within 2–3 business days of receiving it.' },
    { title: 'Refund Processing',    desc: 'Once approved, refund is processed within 5–7 business days.' },
  ],
  refundMethods: [
    { method: 'Bank Transfer',          time: '5–7 business days', desc: 'Direct refund to your bank account' },
    { method: 'Store Credit',           time: 'Instant',           desc: 'Immediate credit for future purchases' },
    { method: 'Original Payment Method',time: '7–10 business days',desc: 'Refund to the card/account used for purchase' },
  ],
  conditions: [
    'Product must be in its original condition and packaging',
    'All tags and labels must be intact',
    'Return shipping costs are the customer\'s responsibility (unless item is defective)',
    'Refund amount excludes original shipping charges',
    'No returns accepted after 7 days from delivery date',
  ],
};

export default function ReturnPolicyPage() {
  return (
    <div className="min-h-screen bg-gray-50">

      <PageBanner
        icon={<FaUndo className="w-8 h-8" />}
        title="Return & Refund Policy"
        subtitle="Your Satisfaction is Our Priority"
        description="We want you to be completely satisfied with your purchase. Here's everything you need to know about returns and refunds."
      />

      {/* Return Window */}
      <section className="py-8 bg-white">
        <div className="max-w-2xl mx-auto px-[4%]">
          <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
            <FaClock className="w-8 h-8 text-green-700 mx-auto mb-3" />
            <h2 className="text-lg font-bold text-gray-900 mb-1">Return Window</h2>
            <div className="text-4xl font-bold text-green-700 mb-1">{data.returnWindow} Days</div>
            <p className="text-sm text-gray-600">Return most items within 7 days of delivery for a full refund.</p>
          </div>
        </div>
      </section>

      {/* Eligible vs Non-Eligible */}
      <section className="py-8">
        <div className="max-w-4xl mx-auto px-[4%]">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl border border-green-200 p-6">
              <div className="flex items-center gap-2 mb-4">
                <FaCheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                <h3 className="text-base font-bold text-gray-900">Eligible for Return</h3>
              </div>
              <ul className="space-y-2">
                {data.eligible.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                    <FaCheckCircle className="w-3.5 h-3.5 text-green-500 mt-0.5 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-white rounded-xl border border-red-200 p-6">
              <div className="flex items-center gap-2 mb-4">
                <FaTimesCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                <h3 className="text-base font-bold text-gray-900">Non-Eligible for Return</h3>
              </div>
              <ul className="space-y-2">
                {data.nonEligible.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                    <FaTimesCircle className="w-3.5 h-3.5 text-red-400 mt-0.5 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Return Process */}
      <section className="py-8 bg-white">
        <div className="max-w-4xl mx-auto px-[4%]">
          <h2 className="text-xl font-bold text-gray-900 mb-6 text-center">Return Process</h2>
          <div className="space-y-4">
            {data.steps.map((step, i) => {
              const Icon = stepIcons[i];
              return (
                <div key={i} className="flex gap-4 items-start">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-green-100 text-green-700 flex items-center justify-center font-bold text-sm">
                    {i + 1}
                  </div>
                  <div className="flex-1 bg-gray-50 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-1">
                      <Icon className="w-4 h-4 text-green-600 flex-shrink-0" />
                      <h3 className="text-sm font-bold text-gray-900">{step.title}</h3>
                    </div>
                    <p className="text-sm text-gray-600">{step.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Refund Methods */}
      <section className="py-8">
        <div className="max-w-4xl mx-auto px-[4%]">
          <h2 className="text-xl font-bold text-gray-900 mb-6 text-center">Refund Methods</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {data.refundMethods.map((m, i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-200 p-5 text-center hover:shadow-md transition">
                <h3 className="text-sm font-bold text-gray-900 mb-1">{m.method}</h3>
                <div className="text-green-700 font-semibold text-sm mb-2">{m.time}</div>
                <p className="text-xs text-gray-500">{m.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Terms */}
      <section className="py-8 bg-white">
        <div className="max-w-3xl mx-auto px-[4%]">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Terms & Conditions</h2>
          <ul className="space-y-2">
            {data.conditions.map((c, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                <span className="text-green-600 mt-0.5 flex-shrink-0">•</span>
                {c}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Contact */}
      <section className="py-8 bg-green-700 text-white">
        <div className="max-w-3xl mx-auto px-[4%] text-center">
          <h2 className="text-lg font-bold mb-4">Need Help with Returns?</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
            {[
              { Icon: FaPhone,    label: 'Phone',     value: '+92 304 5779900' },
              { Icon: FaEnvelope, label: 'Email',     value: 'returns@pansariin.pk' },
              { Icon: FaWhatsapp, label: 'WhatsApp',  value: '+92 304 5779900' },
              { Icon: FaClock,    label: 'Hours',     value: 'Mon–Sat: 9AM–6PM' },
            ].map(({ Icon, label, value }) => (
              <div key={label}>
                <Icon className="w-4 h-4 mx-auto mb-1 text-green-200" />
                <div className="font-semibold">{label}</div>
                <div className="text-green-100 text-xs">{value}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
