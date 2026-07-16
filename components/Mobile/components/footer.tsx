"use client";

import { useState, FormEvent } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  FaTruck, FaMapMarkerAlt, FaShieldAlt, FaClock, FaLeaf,
  FaFacebook, FaTwitter, FaYoutube, FaInstagram,
  FaChevronDown, FaChevronUp, FaArrowRight, FaCheckCircle,
} from 'react-icons/fa';
import { SOCIAL_LINKS } from '@/lib/social-links';

// ── Data ──────────────────────────────────────────────────────────────────────

const iconData = [
  { icon: FaTruck, label: 'Free Shipping' },
  { icon: FaMapMarkerAlt, label: 'Nationwide' },
  { icon: FaShieldAlt, label: '100% Authentic' },
  { icon: FaClock, label: 'Quick Delivery' },
  { icon: FaLeaf, label: 'Eco-Friendly' },
];

const socialLinks = [
  { name: 'Facebook', Icon: FaFacebook, url: SOCIAL_LINKS.facebook },
  { name: 'Twitter', Icon: FaTwitter, url: SOCIAL_LINKS.twitter },
  { name: 'YouTube', Icon: FaYoutube, url: SOCIAL_LINKS.youtube },
  { name: 'Instagram', Icon: FaInstagram, url: SOCIAL_LINKS.instagram },
];

const linkGroups = [
  {
    title: 'Quick Links',
    links: [
      { name: 'About Us', url: '/aboutus' },
      { name: 'Our Story', url: '/our-story' },
      { name: 'Blog', url: '/blog' },
    ],
  },
  {
    title: 'Shop',
    links: [
      { name: 'Skincare', url: '/beauty-corner' },
      { name: 'Haircare', url: '/shop?category=Herb' },
      { name: 'Oils', url: '/oils' },
      { name: 'Supplements', url: '/shop?category=Supplements' },
      { name: 'Best Sellers', url: '/shop' },
    ],
  },
  {
    title: 'Customer Service',
    links: [
      { name: 'Track Order', url: '/track-order' },
      { name: 'Returns', url: '/returns' },
      { name: 'Shipping Info', url: '/shipping-info' },
      { name: 'FAQs', url: '/faqs' },
      { name: 'Contact Us', url: '/contact' },
    ],
  },
];

// ── Accordion item ────────────────────────────────────────────────────────────

function AccordionGroup({ title, links }: { title: string; links: { name: string; url: string }[] }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-gray-200">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between py-4 px-4 text-left"
      >
        <span className="text-sm font-semibold text-gray-900">{title}</span>
        {open
          ? <FaChevronUp className="w-3.5 h-3.5 text-gray-500" />
          : <FaChevronDown className="w-3.5 h-3.5 text-gray-500" />
        }
      </button>

      {open && (
        <ul className="px-4 pb-4 space-y-3">
          {links.map(link => (
            <li key={link.name}>
              <Link href={link.url} className="text-sm text-gray-500 hover:text-green-700 transition-colors">
                {link.name}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// ── Main footer ───────────────────────────────────────────────────────────────

export default function MobileFooter() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setSubmitting] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const [error, setError] = useState('');

  const validate = (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email.trim()) return setError('Email is required');
    if (!validate(email)) return setError('Please enter a valid email');
    setSubmitting(true);
    setTimeout(() => {
      setSubscribed(true);
      setEmail('');
      setSubmitting(false);
      setTimeout(() => setSubscribed(false), 5000);
    }, 1000);
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white font-poppins">

      {/* ── Icon bar ── */}
      <div className="bg-green-700 py-5 px-4">
        <div className="grid grid-cols-3 gap-y-4 gap-x-2 place-items-center max-w-xs mx-auto">
          {iconData.map(({ icon: Icon, label }) => (
            <div key={label} className="flex flex-col items-center gap-1">
              <div className="w-10 h-10 rounded-full border-2 border-white/40 flex items-center justify-center">
                <Icon className="w-4 h-4 text-white" />
              </div>
              <p className="text-white font-semibold text-[10px] leading-tight mt-1 text-center">
                {label}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Newsletter ── */}
      <div className="px-5 py-6 bg-cream text-center">
        <h3 className="text-base font-bold text-gray-900 mb-1">Join Our Mailing List</h3>
        <p className="text-xs text-gray-500 leading-relaxed mb-4 max-w-xs mx-auto">
          Find out all about our latest offers, new products, and the science of Ayurveda in our newsletters!
        </p>

        {subscribed ? (
          <div className="flex items-center justify-center gap-2 bg-green-50 border border-green-100 rounded-xl p-3 max-w-xs mx-auto">
            <FaCheckCircle className="text-green-500 w-4 h-4 flex-shrink-0" />
            <p className="text-green-700 font-medium text-sm">Successfully subscribed!</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="max-w-xs mx-auto">
            <div className={`flex items-center bg-white rounded-full border ${error ? 'border-red-400' : 'border-gray-300'} px-4 py-2.5 shadow-sm`}>
              <input
                type="email"
                placeholder="Enter Your Email"
                value={email}
                onChange={e => { setEmail(e.target.value); setError(''); }}
                disabled={isSubmitting}
                className="flex-1 text-sm text-gray-700 bg-transparent outline-none placeholder-gray-400"
              />
              <button
                type="submit"
                disabled={isSubmitting}
                className="ml-2 flex-shrink-0 text-gray-500 hover:text-green-700 transition-colors disabled:opacity-50"
                aria-label="Subscribe"
              >
                <FaArrowRight className="w-4 h-4" />
              </button>
            </div>
            {error && <p className="text-red-500 text-xs mt-1.5 text-left px-1">{error}</p>}
          </form>
        )}

        {/* Social icons */}
        <div className="flex items-center justify-center gap-4 mt-5">
          {socialLinks.map(({ name, Icon, url }) => (
            <a
              key={name}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={name}
              className="w-9 h-9 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:border-green-700 hover:text-green-700 transition-all"
            >
              <Icon className="w-3.5 h-3.5" />
            </a>
          ))}
        </div>
      </div>

      {/* ── Accordion link groups ── */}
      <div className="border-t border-gray-200">
        {linkGroups.map(group => (
          <AccordionGroup key={group.title} title={group.title} links={group.links} />
        ))}
      </div>

      {/* ── Also available on ── */}
      {/* <div className="px-4 py-5 text-center border-t border-gray-100">
        <p className="text-xs text-gray-500 mb-3 font-medium">Also available on</p>
        <div className="flex items-center justify-center gap-4">
          <div className="h-10 px-3 bg-orange-500 rounded-lg flex items-center justify-center">
            <span className="text-white text-[10px] font-bold leading-tight text-center">TATA 1mg</span>
          </div>
          <div className="h-10 px-3 bg-yellow-400 rounded-lg flex items-center justify-center">
            <span className="text-blue-700 text-[10px] font-bold">Flipkart</span>
          </div>
          <div className="h-10 px-3 bg-white border border-gray-200 rounded-lg flex items-center justify-center">
            <span className="text-gray-900 text-[10px] font-bold">Amazon</span>
          </div>
        </div>
      </div> */}

      {/* ── Copyright ── */}
      <div className="px-4 py-4 border-t border-gray-100 text-center">
        <p className="text-xs text-gray-400 leading-relaxed">
          © {currentYear} | Pansari Inn | All Rights Reserved 
        </p>
      </div>

    </footer>
  );
}
