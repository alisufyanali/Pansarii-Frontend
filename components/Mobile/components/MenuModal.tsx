"use client";

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { allProducts } from '@/data/products';
import { getCategoriesCached } from '@/lib/products';
import { useAuth } from '@/context/AuthContext';
import {
  FaTimes, FaUser, FaChevronRight, FaLeaf,
  FaShoppingBag, FaStar, FaHeart, FaBook, FaTruck,
  FaFacebook, FaYoutube,
} from 'react-icons/fa';
import { FaXTwitter, FaInstagram } from 'react-icons/fa6';
import { SOCIAL_LINKS } from '@/lib/social-links';

const CATEGORY_SLUG_MAP: Record<string, string> = {
  'Herb':          'herb',
  'Oils':          'oils',
  'Supplements':   'supplements',
  'Beauty Corner': 'beauty-corner',
  'Dawakhana':     'dawakhana',
  'Remedies':      'remedies',
  'Murrabajat':    'murrabajat',
  'Arqiyaat':      'arqiyaat',
  'Spices':        'spices',
};

const mainLinks = [
  { name: 'Shop All',     href: '/shop',       Icon: FaShoppingBag },
  { name: 'New Arrivals', href: '/newarrival', Icon: FaStar        },
  { name: 'Wishlist',     href: '/wishlist',   Icon: FaHeart       },
  { name: 'Track Order',   href: '/track-order', Icon: FaTruck        },
  { name: 'Blog',         href: '/blog',       Icon: FaBook        },
];

interface MenuModalProps {
  isOpen:  boolean;
  onClose: () => void;
}

export default function MenuModal({ isOpen, onClose }: MenuModalProps) {
  const { isAuthenticated, isLoading: authLoading, user, logout } = useAuth();
  const [categories, setCategories] = useState<Array<{ name: string; slug: string; count?: number }>>(() =>
    Array.from(new Set(allProducts.map(p => p.category)))
      .filter(Boolean)
      .map(category => {
        const staticCount = allProducts.filter(p => p.category === category).length;
        return {
          name: category as string,
          slug: CATEGORY_SLUG_MAP[category as string] || (category as string).toLowerCase().replace(/\s+/g, '-'),
          count: staticCount > 0 ? staticCount : undefined,
        };
      }),
  );

  useEffect(() => {
    if (!isOpen) return;
    getCategoriesCached().then(cats => {
      if (cats.length > 0) {
        setCategories(cats.map(c => ({
          name: c.name,
          slug: CATEGORY_SLUG_MAP[c.name] || c.slug,
          count: typeof c.products_count === 'number' && c.products_count > 0
            ? c.products_count
            : undefined,
        })));
      }
    }).catch(() => {/* keep fallback */});
  }, [isOpen]);

  if (!isOpen) return null;

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

          {/* Login CTA — auth-aware: shows logged-in state or Sign In prompt */}
          <div className="px-5 py-4 border-b border-gray-50">
            {!authLoading && isAuthenticated ? (
              /* ── Logged in ── */
              <div className="flex items-center gap-3 py-3 px-4 bg-green-50 rounded-xl">
                <div className="w-10 h-10 bg-green-700 rounded-full flex items-center justify-center flex-shrink-0">
                  <FaUser className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate">
                    {user?.name ?? 'My Account'}
                  </p>
                  <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                </div>
                <div className="flex flex-col gap-1">
                  <Link
                    href="/profile"
                    onClick={onClose}
                    className="text-xs text-green-700 font-semibold hover:underline"
                  >
                    Profile
                  </Link>
                  <button
                    onClick={() => { onClose(); logout(); }}
                    className="text-xs text-red-500 font-medium hover:underline text-left"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            ) : (
              /* ── Logged out ── */
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
            )}
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
                  <span className="text-sm font-medium text-gray-800">
                    {cat.name}
                    {cat.count != null && cat.count > 0 && (
                      <span className="text-gray-400 font-normal ml-1">({cat.count})</span>
                    )}
                  </span>
                  <FaChevronRight className="w-3.5 h-3.5 text-gray-300" />
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
            aria-label="X"
          >
            <FaXTwitter size={22} color="#000000" />
          </a>
        </div>

      </div>
    </div>
  );
}
