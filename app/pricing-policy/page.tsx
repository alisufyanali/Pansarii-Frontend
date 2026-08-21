'use client';

import { FaTag } from 'react-icons/fa';
import PageBanner from '@/components/PageBanner';

const policyPoints = [
  'Product prices listed are current, however these are subject to change without advance notice.',
  'All prices on this website are processed in Pakistani Rupees.',
  'All orders are acknowledged at current pricing. We will bill at the price in effect at the time of shipping.',
];

export default function PricingPolicyPage() {
  return (
    <div className="min-h-screen bg-gray-50">

      <PageBanner
        icon={<FaTag className="w-8 h-8" />}
        title="Pricing Policy"
        subtitle="Transparent Pricing, Always"
        description="Everything you need to know about how we price and bill your orders."
      />

      {/* Main content */}
      <section className="py-10 bg-white">
        <div className="max-w-3xl mx-auto px-[4%]">
          <div className="bg-gray-50 rounded-xl border border-gray-200 p-6">
            <h2 className="text-base font-bold text-gray-900 mb-4">Our Pricing Guidelines</h2>
            <ul className="space-y-4">
              {policyPoints.map((point, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-green-700 text-white flex items-center justify-center text-xs font-bold mt-0.5">
                    {i + 1}
                  </span>
                  <span className="text-sm text-gray-600 leading-relaxed">{point}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Note box */}
      <section className="pb-10">
        <div className="max-w-3xl mx-auto px-[4%]">
          <div className="bg-green-50 border border-green-200 rounded-xl p-5">
            <h3 className="text-sm font-bold text-gray-900 mb-1">Have a pricing question?</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              If you have any concerns about pricing or have been charged differently than expected,
              please contact our support team at{' '}
              <a
                href="mailto:chat@pansariinn.pk"
                className="text-green-700 font-medium hover:underline"
              >
                chat@pansariinn.pk
              </a>{' '}
              or call us at{' '}
              <a
                href="tel:+923045779900"
                className="text-green-700 font-medium hover:underline"
              >
                +92 304 5779900
              </a>
              .
            </p>
          </div>
        </div>
      </section>

    </div>
  );
}
