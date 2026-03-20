// app/Mobile/components/MenuModal.tsx
"use client";

import Link from 'next/link';
import { allProducts } from '@/app/Desktop/data/products';
import { 
  FaTimes,
  FaUser,
  FaChevronRight,
  FaLeaf,
  FaShoppingBag,
  FaGift,
  FaTruck,
  FaStar,
  FaBook
} from 'react-icons/fa';

// Category slug mapping
const CATEGORY_SLUG_MAP: { [key: string]: string } = {
  'Herb': 'herbs',
  'Oils': 'oils',
  'Supplements': 'supplements',
  'Beauty Corner': 'beauty-corner',
  'Dawakhana': 'dawakhana',
  'Remedies': 'remedies',
  'Murrabajat': 'murrabajat',
  'Arqiyaat': 'arqiyaat',
};

interface MenuModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MenuModal({ isOpen, onClose }: MenuModalProps) {
  if (!isOpen) return null;
  
  const menuLinks = [
    { name: 'Shop', href: '/shop', icon: <FaShoppingBag className="w-3.5 h-3.5" /> },
    { name: 'Categories', href: '/category', icon: <FaLeaf className="w-3.5 h-3.5" /> },
    { name: 'New Arrivals', href: '/new-arrivals', icon: <FaStar className="w-3.5 h-3.5" /> },
    { name: 'Offers', href: '/offers', icon: <FaGift className="w-3.5 h-3.5" /> },
    { name: 'Track Order', href: '/track-order', icon: <FaTruck className="w-3.5 h-3.5" /> },
    { name: 'Blog', href: '/blog', icon: <FaBook className="w-3.5 h-3.5" /> },
  ];

  // Get categories from products data
  const categories = Array.from(new Set(allProducts.map(p => p.category)))
    .filter(Boolean)
    .slice(0, 6)
    .map(category => ({
      name: category,
      slug: CATEGORY_SLUG_MAP[category] || category.toLowerCase().replace(/\s+/g, '-'),
      count: allProducts.filter(p => p.category === category).length
    }));

  return (
    <div className="fixed inset-0 z-50">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-black/50 animate-fadeIn"
        onClick={onClose}
      />
      
      {/* Menu Panel - Slides from bottom */}
      <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl shadow-2xl animate-slideUp max-h-[85vh]">
        {/* Drag handle */}
        <div className="flex justify-center pt-2 pb-1">
          <div className="w-10 h-1 bg-gray-300 rounded-full"></div>
        </div>
        
        {/* Menu Header */}
        <div className="px-4 py-3 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-gray-900">Menu</h2>
            <button 
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-gray-100 transition"
              aria-label="Close menu"
            >
              <FaTimes className="w-4 h-4 text-gray-500" />
            </button>
          </div>
        </div>
        
        {/* Scrollable Content */}
        <div className="overflow-y-auto max-h-[calc(85vh-100px)]">
          <div className="px-4 py-3">
            
            {/* User Info */}
            <Link 
              href="/login" 
              onClick={onClose}
              className="flex items-center gap-3 p-3 bg-green-50 rounded-lg mb-3 hover:bg-green-100 transition-colors"
            >
              <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
                <FaUser className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-900">Welcome!</p>
                <p className="text-xs text-gray-600">Sign in to your account</p>
              </div>
              <FaChevronRight className="w-3 h-3 text-gray-400" />
            </Link>
            
            {/* Menu Items */}
            <div className="space-y-1 mb-4">
              {menuLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={onClose}
                  className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors active:bg-gray-100"
                >
                  <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center text-green-600">
                    {link.icon}
                  </div>
                  <span className="text-sm font-medium text-gray-700 flex-1">{link.name}</span>
                  <FaChevronRight className="w-3 h-3 text-gray-400" />
                </Link>
              ))}
            </div>
            
            {/* Categories Section */}
            <div className="p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2 mb-3">
                <FaLeaf className="w-4 h-4 text-green-600" />
                <h3 className="text-sm font-bold text-gray-900">Shop by Category</h3>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {categories.map((category) => (
                  <Link
                    key={category.slug}
                    href={`/${category.slug}`}
                    onClick={onClose}
                    className="p-2.5 bg-white rounded-lg hover:shadow-md transition-all active:scale-95 border border-gray-100 hover:border-green-200"
                  >
                    <p className="text-xs font-semibold text-gray-900 line-clamp-1">
                      {category.name}
                    </p>
                    <p className="text-[10px] text-gray-500 mt-0.5">
                      {category.count} items
                    </p>
                  </Link>
                ))}
              </div>
              <Link 
                href="/category" 
                onClick={onClose}
                className="block w-full mt-2 py-2 text-center text-xs font-medium text-green-600 hover:text-green-700 hover:bg-white rounded-lg transition-colors"
              >
                View All Categories →
              </Link>
            </div>

            {/* Bottom Links */}
            <div className="mt-3 pt-3 border-t border-gray-100 space-y-2">
              <Link 
                href="/our-story" 
                onClick={onClose}
                className="block text-xs text-gray-600 hover:text-green-600 transition"
              >
                Our Story
              </Link>
              <Link 
                href="/contact" 
                onClick={onClose}
                className="block text-xs text-gray-600 hover:text-green-600 transition"
              >
                Contact Us
              </Link>
              <Link 
                href="/faqs" 
                onClick={onClose}
                className="block text-xs text-gray-600 hover:text-green-600 transition"
              >
                FAQs
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* CSS Animations */}
      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slideUp {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        
        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }
        
        .line-clamp-1 {
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}