'use client';

import { FaCheckCircle, FaLeaf, FaSnowflake } from 'react-icons/fa';
import PageBanner from '@/components/PageBanner';

const sections = [
  {
    Icon: FaCheckCircle,
    heading: 'Quality Assurance & Freshness',
    body: 'Quality Assurance is a Core Value and every representative at PansariInn is 100% committed to your satisfaction. PansariInn makes sure we only source the highest quality products that we can find. We receive shipments on a weekly basis to ensure that our Herbs, Spices, Oils, Capsules and other all-natural products are as fresh as possible. After each product is packed into its respective package, it is then closed tightly and heat sealed to ensure peak freshness until it is opened by you.',
  },
  {
    Icon: FaLeaf,
    heading: 'Chemical-Free & Pesticide-Free Sourcing',
    body: 'When sourcing our products, we make sure they are grown without the use of any chemicals and are Pesticides-Free. You can be sure that the product you receive is at peak freshness and is pure, safe, and is just the raw product itself — nothing else.',
  },
  {
    Icon: FaSnowflake,
    heading: 'Storage Recommendations',
    body: 'When you receive your order, we recommend storing it in a Cool, Dry Place. Any heat, light and humidity can affect the product and its shelf life.',
  },
];

export default function OurCommitmentToQualityPage() {
  return (
    <div className="min-h-screen bg-gray-50">

      <PageBanner
        icon={<FaCheckCircle className="w-8 h-8" />}
        title="Our Commitment To Quality"
        subtitle="Pure. Fresh. Authentic."
        description="Every product we source, pack, and deliver meets our uncompromising quality standards."
      />

      {/* Main content */}
      <section className="py-10 bg-white">
        <div className="max-w-3xl mx-auto px-[4%] space-y-6">
          {sections.map(({ Icon, heading, body }, i) => (
            <div
              key={i}
              className="bg-gray-50 rounded-xl border border-gray-200 p-6 flex gap-4"
            >
              {/* Icon badge */}
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mt-0.5">
                <Icon className="w-5 h-5 text-green-700" />
              </div>

              {/* Text */}
              <div>
                <h2 className="text-base font-bold text-gray-900 mb-2">{heading}</h2>
                <p className="text-sm text-gray-600 leading-relaxed">{body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Trust badges */}
      <section className="py-8">
        <div className="max-w-3xl mx-auto px-[4%]">
          <div className="grid sm:grid-cols-3 gap-4 text-center">
            {[
              { label: 'Weekly Restocking',  sub: 'Always fresh products' },
              { label: 'Heat Sealed',        sub: 'Freshness locked in'   },
              { label: 'Pesticide-Free',     sub: 'Pure & natural sourcing'},
            ].map(({ label, sub }) => (
              <div key={label} className="bg-white rounded-xl border border-gray-200 p-4">
                <FaCheckCircle className="w-5 h-5 text-green-700 mx-auto mb-2" />
                <p className="text-sm font-bold text-gray-900">{label}</p>
                <p className="text-xs text-gray-500 mt-0.5">{sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
