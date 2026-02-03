// app/Mobile/components/MenuModal.tsx
"use client";

import Link from 'next/link';
import { allProducts } from '@/app/Desktop/data/products';
import { 
  FaTimes,
  FaUser,
  FaChevronDown,
  FaLeaf,
  FaShoppingBag,
  FaGift,
  FaTruck,
  FaStar
} from 'react-icons/fa';

interface MenuModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MenuModal({ isOpen, onClose }: MenuModalProps) {
  if (!isOpen) return null;
  
  const menuLinks = [
    { name: 'Shop', href: '/shop', icon: <FaShoppingBag className="w-4 h-4" /> },
    { name: 'Categories', href: '/categories', icon: <FaLeaf className="w-4 h-4" /> },
    { name: 'Offers', href: '/offers', icon: <FaGift className="w-4 h-4" /> },
    { name: 'Rewards', href: '/rewards', icon: <FaStar className="w-4 h-4" /> },
    { name: 'Track Order', href: '/track-order', icon: <FaTruck className="w-4 h-4" /> },
    { name: 'Blog', href: '/blog', icon: <FaLeaf className="w-4 h-4" /> },
    { name: 'Affiliate', href: '/affiliate', icon: <FaUser className="w-4 h-4" /> },
  ];

  // Get unique categories
  const categories = [...new Set(allProducts.map(p => p.category).filter(Boolean))].slice(0, 4);

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
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-12 h-1 bg-gray-300 rounded-full"></div>
        </div>
        
        {/* Menu Header */}
        <div className="px-6 py-4 border-b">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-800">Menu</h2>
            <button 
              onClick={onClose}
              className="p-2 rounded-full hover:bg-gray-100"
              aria-label="Close menu"
            >
              <FaTimes className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>
        
        {/* Scrollable Content */}
        <div className="overflow-y-auto max-h-[calc(85vh-120px)]">
          <div className="px-4 py-2">
            {/* User Info */}
            <Link 
              href="/login" 
              onClick={onClose}
              className="flex items-center gap-3 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl mb-4 hover:from-green-100 hover:to-emerald-100 transition-colors"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center shadow-md">
                <FaUser className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-800">Welcome!</p>
                <p className="text-sm text-gray-600">Sign in to access your account</p>
              </div>
              <FaChevronDown className="w-4 h-4 text-gray-400 transform -rotate-90" />
            </Link>
            
            {/* Menu Items */}
            <div className="space-y-1">
              {menuLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={onClose}
                  className="flex items-center gap-3 p-4 hover:bg-gray-50 rounded-xl transition-colors active:bg-gray-100"
                >
                  <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center text-green-600">
                    {link.icon}
                  </div>
                  <span className="font-medium text-gray-700 flex-1">{link.name}</span>
                  <FaChevronDown className="w-4 h-4 text-gray-400 transform -rotate-90" />
                </Link>
              ))}
            </div>
            
            {/* Categories Section */}
            <div className="mt-6 p-4 bg-gradient-to-r from-green-50/50 to-emerald-50/50 rounded-xl">
              <div className="flex items-center gap-2 mb-3">
                <FaLeaf className="w-5 h-5 text-green-600" />
                <h3 className="font-bold text-gray-800">Shop by Category</h3>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {categories.map((category, index) => {
                  if (!category) return null;
                  const categoryCount = allProducts.filter(p => p.category === category).length;
                  
                  return (
                    <Link
                      key={index}
                      href={`/category/${category.toLowerCase().replace(/\s+/g, '-')}`}
                      onClick={onClose}
                      className="p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow active:scale-95 border border-gray-100"
                    >
                      <p className="text-sm font-medium text-gray-700 line-clamp-1">
                        {category}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {categoryCount} item{categoryCount !== 1 ? 's' : ''}
                      </p>
                    </Link>
                  );
                })}
              </div>
              <Link 
                href="/categories" 
                onClick={onClose}
                className="block w-full mt-3 py-2 text-center text-sm font-medium text-green-600 hover:text-green-700 hover:bg-green-50 rounded-lg transition-colors"
              >
                View All Categories →
              </Link>
            </div>
          </div>
        </div>
        
        {/* Contact Info */}
        <div className="px-6 py-4 bg-gray-50 border-t">
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-1">Need help? Call us</p>
            <a 
              href="tel:+923001234567" 
              className="text-green-600 font-bold text-lg hover:text-green-700 active:text-green-800"
            >
              +92 300 1234567
            </a>
            <p className="text-xs text-gray-500 mt-2">Available 9 AM - 11 PM</p>
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