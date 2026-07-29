"use client";

import { useState, FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { api, getApiErrorMessage } from '@/lib/axios';
import {
  RiArrowLeftLine,
  RiSearchLine,
  RiShoppingCartLine,
  RiAddLine,
  RiSubtractLine,
  RiSendPlaneFill,
  RiPhoneLine,
  RiMessage3Line,
  RiCheckboxCircleFill,
} from 'react-icons/ri';

// ── Data ──────────────────────────────────────────────────────────────────────

const FAQ_ITEMS = [
  {
    question: 'Shipping & Delivery',
    answer:
      'We deliver across Pakistan. Standard delivery takes 2–4 business days for major cities and 4–7 days for other areas. Free shipping on orders above PKR 2,000.',
  },
  {
    question: 'Returns & Refunds',
    answer:
      'You can return unopened products within 7 days of delivery. Refunds are processed within 3–5 business days after we receive the returned item.',
  },
  {
    question: 'Product Authenticity',
    answer:
      'All Pansari Inn products are 100% authentic and sourced directly from certified manufacturers. We guarantee the quality of every item we sell.',
  },
  {
    question: 'Payment Methods',
    answer:
      'We accept Cash on Delivery (COD), bank transfers, and major debit/credit cards. COD is available across Pakistan.',
  },
  {
    question: 'Order Tracking',
    answer:
      'Once your order is shipped, you will receive an SMS with a tracking number. You can also track your order from the Order History section in your profile.',
  },
];

const SUBJECT_OPTIONS = [
  'Technical Issue',
  'Order Problem',
  'Payment Issue',
  'Product Inquiry',
  'Return / Refund',
  'Other',
];

// ── FAQ accordion item ────────────────────────────────────────────────────────

function FaqItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-4 py-3.5 text-left"
      >
        <span className="text-sm font-semibold text-gray-800 pr-3">{question}</span>
        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center">
          {open ? (
            <RiSubtractLine className="w-3.5 h-3.5 text-gray-600" />
          ) : (
            <RiAddLine className="w-3.5 h-3.5 text-gray-600" />
          )}
        </span>
      </button>

      {open && (
        <div className="px-4 pb-4">
          <div className="h-px bg-gray-100 mb-3" />
          <p className="text-xs text-gray-500 leading-relaxed">{answer}</p>
        </div>
      )}
    </div>
  );
}

// ── Support form ──────────────────────────────────────────────────────────────

function SupportForm() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    subject: SUBJECT_OPTIONS[0],
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/contact', {
        subject: form.subject,
        message: `Name: ${form.name}\nEmail: ${form.email}\n\n${form.message}`,
      });
      setSubmitted(true);
      toast.success("Message sent! We'll reply within 1–3 hours.");
      setTimeout(() => setSubmitted(false), 4000);
      setForm({ name: '', email: '', subject: SUBJECT_OPTIONS[0], message: '' });
    } catch (err) {
      toast.error(getApiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      {/* Name */}
      <div>
        <label className="block text-[11px] font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">
          Full Name
        </label>
        <input
          type="text"
          name="name"
          required
          value={form.name}
          onChange={handleChange}
          placeholder="Ali Hassan"
          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
        />
      </div>

      {/* Email */}
      <div>
        <label className="block text-[11px] font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">
          Email Address
        </label>
        <input
          type="email"
          name="email"
          required
          value={form.email}
          onChange={handleChange}
          placeholder="ali@example.com"
          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
        />
      </div>

      {/* Subject dropdown */}
      <div>
        <label className="block text-[11px] font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">
          Support Category
        </label>
        <select
          name="subject"
          value={form.subject}
          onChange={handleChange}
          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent appearance-none"
        >
          {SUBJECT_OPTIONS.map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      </div>

      {/* Message */}
      <div>
        <label className="block text-[11px] font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">
          Message Detail
        </label>
        <textarea
          name="message"
          required
          value={form.message}
          onChange={handleChange}
          rows={4}
          placeholder="Describe your issue in detail…"
          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
        />
      </div>

      {/* Priority chips */}
      <div className="flex gap-2">
        {['#PRIORITY', '#TECHNICAL', '#BILLING'].map((tag) => (
          <span
            key={tag}
            className="text-[10px] font-semibold px-3 py-1 rounded-full bg-gray-100 text-gray-500"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Success message */}
      {submitted && (
        <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-xl px-4 py-3">
          <RiCheckboxCircleFill className="w-4 h-4 text-green-600 flex-shrink-0" />
          <p className="text-xs text-green-700 font-medium">
            Message sent! We'll reply within 1–3 hours.
          </p>
        </div>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={loading}
        className="w-full py-3.5 bg-gray-900 hover:bg-gray-800 active:bg-black text-white text-sm font-bold rounded-2xl flex items-center justify-center gap-2 transition-colors disabled:opacity-60"
      >
        {loading ? (
          <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
        ) : (
          <>
            Send Message
            <RiSendPlaneFill className="w-4 h-4" />
          </>
        )}
      </button>
    </form>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function SupportPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-50 pb-36 font-poppins">

      {/* ── Header ── */}
      <div className="bg-white px-4 pt-5 pb-4 flex items-center justify-between border-b border-gray-100">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center"
            aria-label="Go back"
          >
            <RiArrowLeftLine className="w-4 h-4 text-gray-700" />
          </button>
          <h1 className="text-base font-bold text-gray-900">Support</h1>
        </div>
        <div className="flex items-center gap-2">
          <button className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center" aria-label="Search">
            <RiSearchLine className="w-4 h-4 text-gray-600" />
          </button>
          <Link href="/cart" className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center" aria-label="Cart">
            <RiShoppingCartLine className="w-4 h-4 text-gray-600" />
          </Link>
        </div>
      </div>

      <div className="px-4 pt-5 space-y-5">

        {/* ── Hero text ── */}
        <div>
          <h2 className="text-xl font-black text-gray-900 mb-1">How can we help?</h2>
          <p className="text-xs text-gray-500 leading-relaxed">
            Find answers to common questions or get in touch with our specialist support team.
          </p>
        </div>

        {/* ── FAQ section ── */}
        <div>
          <h3 className="text-sm font-bold text-gray-900 mb-3">Frequently Asked Questions</h3>
          <div className="space-y-2">
            {FAQ_ITEMS.map((item) => (
              <FaqItem key={item.question} question={item.question} answer={item.answer} />
            ))}
          </div>
        </div>

        {/* ── Promo banner ── */}
        <div
          className="relative rounded-2xl overflow-hidden"
          style={{ minHeight: 110 }}
        >
          {/* Dark overlay background */}
          <div
            className="absolute inset-0 rounded-2xl"
            style={{
              background: 'linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)',
            }}
          />
          {/* Decorative circles */}
          <div className="absolute -top-6 -right-6 w-28 h-28 rounded-full bg-white/5" />
          <div className="absolute -bottom-4 -left-4 w-20 h-20 rounded-full bg-white/5" />
          <div className="relative px-5 py-5">
            <p className="text-white font-bold text-sm leading-snug">
              Expert assistance for every order.
            </p>
            <p className="text-gray-400 text-xs mt-1">
              Our team is available Mon–Sat, 9 AM – 6 PM
            </p>
          </div>
        </div>

        {/* ── Direct Support Request form ── */}
        <div>
          <h3 className="text-sm font-bold text-gray-900 mb-0.5">Direct Support Request</h3>
          <p className="text-[11px] text-gray-400 mb-4">Average response time: 1–3 hours</p>
          <SupportForm />
        </div>

      </div>

      {/* ── VIP Support sticky bar ── */}
      <div className="fixed bottom-16 left-0 right-0 px-4 z-30">
        <div className="bg-green-600 rounded-2xl px-4 py-3 flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
              <RiPhoneLine className="w-4.5 h-4.5 text-white" />
            </div>
            <div>
              <p className="text-white text-xs font-bold leading-tight">VIP Support Line</p>
              <p className="text-green-200 text-[10px]">24/7 Priority Channel</p>
            </div>
          </div>
          <a
            href={`tel:+${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}`}
            className="bg-white text-green-700 text-xs font-black px-4 py-2 rounded-xl"
          >
            CALL NOW
          </a>
        </div>
      </div>

      {/* ── Floating chat button ── */}
      <a
        href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}`}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-36 right-4 z-40 w-12 h-12 bg-green-500 rounded-full flex items-center justify-center shadow-xl"
        aria-label="Chat on WhatsApp"
      >
        <RiMessage3Line className="w-5 h-5 text-white" />
      </a>

    </div>
  );
}
