'use client';

import { useState } from 'react';
import Link from 'next/link';
import { FaLeaf, FaCheckCircle, FaBook, FaHandshake } from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import PageBanner from '@/components/PageBanner';
import { api, getApiErrorMessage } from '@/lib/axios';
import { isValidEmail } from '@/lib/validation';

const data = {
  journey: [
    "Founded in 2020, Pansariin.pk started with a simple mission: to make authentic, high-quality herbal products accessible to every Pakistani household. What began as a small family business in Karachi has grown into Pakistan's leading online platform for ayurvedic and herbal remedies.",
    "Our founders, inspired by centuries-old traditional medicine practices, recognized the growing disconnect between modern consumers and natural healing solutions. They set out to bridge this gap by creating a trusted marketplace where quality, authenticity, and customer education come first.",
    "Today, we serve thousands of customers across Pakistan, offering over 500 carefully curated products from trusted suppliers and manufacturers. Every product in our catalog is tested for purity and authenticity.",
  ],
  stats: [
    { number: '500+',  label: 'Products'         },
    { number: '100K+', label: 'Happy Customers'  },
    { number: '50+',   label: 'Cities Served'    },
    { number: '4.8★',  label: 'Average Rating'   },
  ],
  missionStatement: "To empower people to take control of their health through natural, authentic herbal products backed by traditional wisdom and modern quality standards.",
  values: [
    { Icon: FaLeaf,        title: '100% Natural',       desc: 'All our products are free from harmful chemicals and artificial additives.' },
    { Icon: FaCheckCircle, title: 'Quality Assured',    desc: 'Every product undergoes rigorous testing to ensure purity and safety.' },
    { Icon: FaBook,        title: 'Education First',    desc: 'We educate customers about herbal remedies to help them make informed decisions.' },
    { Icon: FaHandshake,   title: 'Trust & Transparency', desc: 'We build long-term relationships through honest communication and reliable service.' },
  ],
  milestones: [
    { year: '2020', title: 'Foundation',  desc: 'Pansariin.pk was founded in Karachi with 50 products' },
    { year: '2021', title: 'Expansion',   desc: 'Reached 10,000+ customers and expanded to 200+ products' },
    { year: '2022', title: 'Recognition', desc: "Won 'Best Herbal E-commerce Platform' award" },
    { year: '2023', title: 'Growth',      desc: 'Launched mobile app and reached 50,000+ customers' },
    { year: '2024', title: 'Innovation',  desc: 'Introduced AI-powered product recommendations' },
    { year: '2025', title: 'Present',     desc: '500+ products, 100,000+ happy customers nationwide' },
  ],
  team: [
    { name: 'Ahmed Ali Khan',  role: 'Founder & CEO',           bio: '15+ years in herbal medicine industry' },
    { name: 'Dr. Fatima Noor', role: 'Chief Medical Advisor',   bio: 'PhD in Ayurvedic Medicine' },
    { name: 'Bilal Hassan',    role: 'Head of Operations',      bio: 'Expert in supply chain management' },
    { name: 'Ayesha Rahman',   role: 'Customer Experience Lead',bio: 'Passionate about customer satisfaction' },
  ],
};

export default function OurStoryPage() {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterLoading, setNewsletterLoading] = useState(false);
  const [newsletterError, setNewsletterError] = useState('');

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setNewsletterError('');
    const email = newsletterEmail.trim();
    if (!email) {
      setNewsletterError('Email is required.');
      return;
    }
    if (!isValidEmail(email)) {
      setNewsletterError('Please enter a valid email address.');
      return;
    }

    setNewsletterLoading(true);
    try {
      const res = await api.post<{ success: boolean; message: string }>('/newsletter/subscribe', { email });
      toast.success(res.message || 'Successfully subscribed!');
      setNewsletterEmail('');
    } catch (err) {
      const msg = getApiErrorMessage(err) || 'Subscription failed. Try again.';
      setNewsletterError(msg);
      toast.error(msg);
    } finally {
      setNewsletterLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">

      <PageBanner
        icon={<FaLeaf className="w-8 h-8" />}
        title="Our Story"
        subtitle="Bringing Ancient Wisdom to Modern Life"
        description="Discover how Pansariin.pk became Pakistan's trusted source for authentic herbal and ayurvedic products."
      />

      {/* Journey */}
      <section className="py-8">
        <div className="max-w-3xl mx-auto px-[4%]">
          <h2 className="text-xl font-bold mb-5 text-gray-900 text-center">Our Journey</h2>
          <div className="space-y-4 text-sm text-gray-700 leading-relaxed">
            {data.journey.map((p, i) => <p key={i}>{p}</p>)}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-6 bg-gray-50">
        <div className="max-w-3xl mx-auto px-[4%]">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {data.stats.map((s, i) => (
              <div key={i} className="bg-white rounded-xl p-4 text-center shadow-sm">
                <div className="text-2xl font-bold text-green-700 mb-1">{s.number}</div>
                <div className="text-xs text-gray-500 font-medium">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission & Values */}
      <section className="py-8">
        <div className="max-w-4xl mx-auto px-[4%]">
          <div className="text-center mb-6">
            <h2 className="text-xl font-bold mb-2 text-gray-900">Our Mission</h2>
            <p className="text-sm text-gray-600 max-w-2xl mx-auto">{data.missionStatement}</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {data.values.map(({ Icon, title, desc }, i) => (
              <div key={i} className="bg-white border border-gray-200 rounded-xl p-4 text-center hover:shadow-md transition">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Icon className="w-4 h-4 text-green-700" />
                </div>
                <h3 className="font-bold text-gray-900 mb-1 text-sm">{title}</h3>
                <p className="text-xs text-gray-500">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Milestones */}
      <section className="py-8 bg-gray-50">
        <div className="max-w-3xl mx-auto px-[4%]">
          <h2 className="text-xl font-bold mb-6 text-gray-900 text-center">Our Milestones</h2>
          <div className="relative">
            <div className="hidden lg:block absolute left-1/2 -translate-x-1/2 h-full w-0.5 bg-green-200" />
            <div className="space-y-5">
              {data.milestones.map((m, i) => (
                <div key={i} className={`flex flex-col lg:flex-row gap-4 items-center ${i % 2 === 0 ? 'lg:flex-row-reverse' : ''}`}>
                  <div className={`flex-1 ${i % 2 === 0 ? 'lg:text-right' : ''}`}>
                    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
                      <div className="text-green-700 font-bold text-sm mb-1">{m.year}</div>
                      <h3 className="font-bold text-gray-900 text-sm mb-0.5">{m.title}</h3>
                      <p className="text-xs text-gray-500">{m.desc}</p>
                    </div>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-green-700 text-white flex items-center justify-center text-xs font-bold shadow z-10 flex-shrink-0">
                    {i + 1}
                  </div>
                  <div className="flex-1 hidden lg:block" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-8">
        <div className="max-w-4xl mx-auto px-[4%]">
          <div className="text-center mb-6">
            <h2 className="text-xl font-bold mb-1 text-gray-900">Our Leadership</h2>
            <p className="text-sm text-gray-500">Meet the passionate team behind Pansariin.pk</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {data.team.map((m, i) => (
              <div key={i} className="text-center">
                <div className="w-20 h-20 mx-auto mb-3 rounded-full bg-green-100 flex items-center justify-center">
                  <span className="text-2xl font-bold text-green-700">{m.name[0]}</span>
                </div>
                <h3 className="font-bold text-gray-900 text-sm mb-0.5">{m.name}</h3>
                <p className="text-green-700 text-xs font-medium mb-1">{m.role}</p>
                <p className="text-xs text-gray-500">{m.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-8 bg-green-700 text-white text-center">
        <div className="max-w-xl mx-auto px-[4%]">
          <h2 className="text-lg font-bold mb-2">Join Our Journey</h2>
          <p className="text-sm text-green-100 mb-4">Be part of Pakistan&apos;s herbal revolution. Start your wellness journey with us today.</p>
          <Link href="/shop" className="inline-block px-6 py-2.5 bg-white text-green-700 rounded-lg hover:bg-gray-100 transition font-semibold text-sm">
            Explore Products
          </Link>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-8 bg-gray-50">
        <div className="max-w-xl mx-auto px-[4%] text-center">
          <h2 className="text-lg font-bold mb-1 text-gray-900">Stay Updated</h2>
          <p className="text-sm text-gray-500 mb-4">Subscribe to our newsletter for the latest products and offers.</p>
          <form onSubmit={handleNewsletterSubmit} className="flex gap-2 max-w-sm mx-auto">
            <input
              type="email"
              required
              value={newsletterEmail}
              onChange={e => { setNewsletterEmail(e.target.value); setNewsletterError(''); }}
              placeholder="Enter your email"
              disabled={newsletterLoading}
              className={`flex-1 px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500
                ${newsletterError ? 'border-red-400' : 'border-gray-300'}`}
            />
            <button
              type="submit"
              disabled={newsletterLoading}
              className="px-5 py-2.5 bg-green-700 text-white rounded-lg text-sm font-semibold hover:bg-green-600 transition disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {newsletterLoading ? 'Subscribing…' : 'Subscribe'}
            </button>
          </form>
          {newsletterError && <p className="text-red-500 text-xs mt-2 max-w-sm mx-auto text-left px-1">{newsletterError}</p>}
        </div>
      </section>

      <ToastContainer position="top-right" autoClose={3000} theme="light" />
    </div>
  );
}
