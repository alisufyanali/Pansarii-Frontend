"use client";

import Link from 'next/link';
import Image from 'next/image';
import { allProducts } from '@/data/products';
import {
  FaTimes, FaUser, FaChevronRight, FaLeaf,
  FaShoppingBag, FaStar, FaHeart, FaBook,
  FaFacebook, FaYoutube,
} from 'react-icons/fa';
import { FaXTwitter, FaInstagram } from 'react-icons/fa6';
import { SOCIAL_LINKS } from '@/lib/social-links';

const CATEGORY_SLUG_MAP: Record<string, string> = {
  'Herb':          'herbs',
  'Oils':          'oils',
  'Supplements':   'supplements',
  'Beauty Corner': 'beauty-corner',
  'Dawakhana':     'dawakhana',
  'Remedies':      'remedies',
  'Murrabajat':    'murrabajat',
  'Arqiyaat':      'arqiyaat',
};

const mainLinks = [
  { name: 'Shop All',     href: '/shop',       Icon: FaShoppingBag },
  { name: 'New Arrivals', href: '/newarrival', Icon: FaStar        },
  { name: 'Wishlist',     href: '/wishlist',   Icon: FaHeart       },
  { name: 'Blog',         href: '/blog',       Icon: FaBook        },
];

interface MenuModalProps {
  isOpen:  boolean;
  onClose: () => void;
}

export default function MenuModal({ isOpen, onClose }: MenuModalProps) {
  if (!isOpen) return null;

  const categories = Array.from(new Set(allProducts.map(p => p.category)))
    .filter(Boolean)
    .map(category => ({
      name:  category,
      slug:  CATEGORY_SLUG_MAP[category] || category.toLowerCase().replace(/\s+/g, '-'),
      count: allProducts.filter(p => p.category === category).length,
    }));

  return (
    <div className="fixed inset-0 z-[60]">
      {/* Backdrop with blur */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-fadeIn" 
        onClick={onClose} 
      />

      {/* Slide-in panel from left */}
      <div className="absolute left-0 top-0 bottom-0 w-[85%] max-w-[320px] bg-white shadow-2xl flex flex-col animate-slideInLeft">

        {/* Header with Logo */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div className="relative w-24 h-7">
            <Image 
              src="/images/logo.png" 
              alt="Pansari Inn" 
              fill 
              className="object-contain" 
              sizes="96px"
            />
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 active:bg-gray-200 transition-colors"
            aria-label="Close menu"
          >
            <FaTimes className="w-4 h-4 text-gray-600" />
          </button>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto">

          {/* Login CTA */}
          <div className="px-5 py-4 border-b border-gray-50">
            <Link
              href="/login"
              onClick={onClose}
              className="flex items-center gap-3 py-3 px-4 bg-green-50 rounded-xl active:bg-green-100 transition-colors"
            >
              <div className="w-10 h-10 bg-green-700 rounded-full flex items-center justify-center">
                <FaUser className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-900">Sign In</p>
                <p className="text-xs text-gray-500">Access your account</p>
              </div>
              <FaChevronRight className="w-3.5 h-3.5 text-gray-400" />
            </Link>
          </div>

          {/* Main Links */}
          <div className="px-5 py-3">
            {mainLinks.map(({ name, href, Icon }) => (
              <Link
                key={href}
                href={href}
                onClick={onClose}
                className="flex items-center gap-4 py-3.5 border-b border-gray-50 active:bg-gray-50 transition-colors"
              >
                <Icon className="w-5 h-5 text-green-700" />
                <span className="text-[15px] font-medium text-gray-800 flex-1">{name}</span>
                <FaChevronRight className="w-3.5 h-3.5 text-gray-300" />
              </Link>
            ))}
          </div>

          {/* Categories */}
          <div className="px-5 py-4 bg-gray-50">
            <div className="flex items-center gap-2 mb-3">
              <FaLeaf className="w-4 h-4 text-green-700" />
              <h3 className="text-sm font-bold text-gray-900">Categories</h3>
            </div>
            <div className="space-y-2">
              {categories.map(cat => (
                <Link
                  key={cat.slug}
                  href={`/${cat.slug}`}
                  onClick={onClose}
                  className="flex items-center justify-between py-2.5 px-3 bg-white rounded-lg border border-gray-100 active:border-green-200 active:shadow-sm transition-all"
                >
                  <span className="text-sm font-medium text-gray-800">{cat.name}</span>
                  <span className="text-xs text-gray-400">{cat.count}</span>
                </Link>
              ))}
            </div>
          </div>

        </div>

        {/* Social Media Icons - Fixed at bottom */}
        <div className="flex gap-5 justify-center py-4 border-t border-gray-100 bg-white">
          <a 
            href={SOCIAL_LINKS.facebook} 
            target="_blank" 
            rel="noopener noreferrer"
            className="hover:scale-110 active:scale-95 transition-transform"
            aria-label="Facebook"
          >
            <FaFacebook size={22} color="#1877F2" />
          </a>
          <a 
            href={SOCIAL_LINKS.instagram} 
            target="_blank" 
            rel="noopener noreferrer"
            className="hover:scale-110 active:scale-95 transition-transform"
            aria-label="Instagram"
          >
            <FaInstagram size={22} color="#E1306C" />
          </a>
          <a 
            href={SOCIAL_LINKS.youtube} 
            target="_blank" 
            rel="noopener noreferrer"
            className="hover:scale-110 active:scale-95 transition-transform"
            aria-label="YouTube"
          >
            <FaYoutube size={22} color="#FF0000" />
          </a>
          <a 
            href={SOCIAL_LINKS.twitter} 
            target="_blank" 
            rel="noopener noreferrer"
            className="hover:scale-110 active:scale-95 transition-transform"
            aria-label="Twitter"
          >
            <FaXTwitter size={22} color="#000000" />
          </a>
        </div>

      </div>
    </div>
  );
}
