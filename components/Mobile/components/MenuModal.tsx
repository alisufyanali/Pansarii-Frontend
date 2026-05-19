"use client";

import Link from 'next/link';
import { allProducts } from '@/components/Desktop/data/products';
import {
  FaTimes, FaUser, FaChevronRight, FaLeaf,
  FaShoppingBag, FaGift, FaTruck, FaStar,
  FaBook, FaPhone, FaQuestionCircle, FaHeart,
} from 'react-icons/fa';

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

const menuLinks = [
  { name: 'Shop All',     href: '/shop',         Icon: FaShoppingBag },
  { name: 'New Arrivals', href: '/newarrival',   Icon: FaStar        },
  { name: 'Offers',       href: '/offers',       Icon: FaGift        },
  { name: 'Wishlist',     href: '/wishlist',     Icon: FaHeart       },
  { name: 'Track Order',  href: '/track-order',  Icon: FaTruck       },
  { name: 'Blog',         href: '/blog',         Icon: FaBook        },
];

const bottomLinks = [
  { name: 'Our Story',     href: '/our-story'    },
  { name: 'Contact Us',    href: '/contact'      },
  { name: 'FAQs',          href: '/faqs'         },
  { name: 'Returns',       href: '/returns'      },
  { name: 'Cancel Order',  href: '/orders'       },
  { name: 'Support',       href: '/support'      },
];

interface MenuModalProps {
  isOpen:  boolean;
  onClose: () => void;
}

export default function MenuModal({ isOpen, onClose }: MenuModalProps) {
  if (!isOpen) return null;

  const categories = Array.from(new Set(allProducts.map(p => p.category)))
    .filter(Boolean)
    .slice(0, 6)
    .map(category => ({
      name:  category,
      slug:  CATEGORY_SLUG_MAP[category] || category.toLowerCase().replace(/\s+/g, '-'),
      count: allProducts.filter(p => p.category === category).length,
    }));

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      {/* Panel — slides up from bottom */}
      <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl shadow-2xl max-h-[85vh] flex flex-col animate-slideUp">

        {/* Drag handle */}
        <div className="flex justify-center pt-2.5 pb-1 flex-shrink-0">
          <div className="w-10 h-1 bg-gray-300 rounded-full" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 flex-shrink-0">
          <h2 className="text-base font-bold text-gray-900">Menu</h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Close menu"
          >
            <FaTimes className="w-4 h-4 text-gray-500" />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="overflow-y-auto flex-1 px-4 py-3 space-y-4">

          {/* Sign in CTA */}
          <Link
            href="/login"
            onClick={onClose}
            className="flex items-center gap-3 p-3 bg-green-50 rounded-xl hover:bg-green-100 transition-colors"
          >
            <div className="w-10 h-10 bg-green-700 rounded-full flex items-center justify-center flex-shrink-0">
              <FaUser className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900">Welcome!</p>
              <p className="text-xs text-gray-500">Sign in to your account</p>
            </div>
            <FaChevronRight className="w-3 h-3 text-gray-400 flex-shrink-0" />
          </Link>

          {/* Main nav links */}
          <div className="space-y-0.5">
            {menuLinks.map(({ name, href, Icon }) => (
              <Link
                key={href}
                href={href}
                onClick={onClose}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 active:bg-gray-100 transition-colors"
              >
                <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center text-green-700 flex-shrink-0">
                  <Icon className="w-3.5 h-3.5" />
                </div>
                <span className="text-sm font-medium text-gray-700 flex-1">{name}</span>
                <FaChevronRight className="w-3 h-3 text-gray-300 flex-shrink-0" />
              </Link>
            ))}
          </div>

          {/* Shop by Category */}
          <div className="bg-gray-50 rounded-xl p-3">
            <div className="flex items-center gap-2 mb-3">
              <FaLeaf className="w-3.5 h-3.5 text-green-700" />
              <h3 className="text-sm font-bold text-gray-900">Shop by Category</h3>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {categories.map(cat => (
                <Link
                  key={cat.slug}
                  href={`/${cat.slug}`}
                  onClick={onClose}
                  className="p-2.5 bg-white rounded-lg border border-gray-100 hover:border-green-200 hover:shadow-sm active:scale-95 transition-all"
                >
                  <p className="text-xs font-semibold text-gray-900 line-clamp-1">{cat.name}</p>
                  <p className="text-[10px] text-gray-400 mt-0.5">{cat.count} items</p>
                </Link>
              ))}
            </div>
            <Link
              href="/category"
              onClick={onClose}
              className="flex items-center justify-center gap-1 w-full mt-2.5 py-2 text-xs font-medium text-green-700 hover:bg-white rounded-lg transition-colors"
            >
              View All Categories
              <FaChevronRight className="w-2.5 h-2.5" />
            </Link>
          </div>

          {/* Footer links */}
          <div className="border-t border-gray-100 pt-3 grid grid-cols-2 gap-x-4 gap-y-2.5 pb-4">
            {bottomLinks.map(({ name, href }) => (
              <Link
                key={href}
                href={href}
                onClick={onClose}
                className="text-xs text-gray-500 hover:text-green-700 transition-colors"
              >
                {name}
              </Link>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}
