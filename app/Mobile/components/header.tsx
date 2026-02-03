// app/Mobile/components/Header.tsx
"use client";

import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '../../context/CartContext';
import { 
  FaSearch,
  FaShoppingCart,
  FaEllipsisH
} from 'react-icons/fa';

interface HeaderProps {
  isMenuOpen: boolean;
  setIsMenuOpen: (isOpen: boolean) => void;
  isSearchOpen: boolean;
  setIsSearchOpen: (isOpen: boolean) => void;
}

export default function Header({ 
  isMenuOpen, 
  setIsMenuOpen, 
  isSearchOpen, 
  setIsSearchOpen 
}: HeaderProps) {
  const { getCartCount } = useCart();
  const cartCount = getCartCount();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm">
      <div className="flex items-center justify-between px-4 py-3">
        <button 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="p-2"
          aria-label="Open menu"
        >
          <FaEllipsisH className="w-6 h-6 text-gray-700" />
        </button>

        <Link href="/" className="flex-shrink-0" aria-label="Home">
          <div className="relative w-32 h-8">
            <Image
              src="/images/logo.png"
              alt="Logo"
              fill
              className="object-contain"
              priority
              sizes="128px"
            />
          </div>
        </Link>

        <div className="flex items-center gap-4">
          <button 
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            className="p-2"
            aria-label="Search"
          >
            <FaSearch className={`w-5 h-5 ${isSearchOpen ? 'text-green-600' : 'text-gray-700'}`} />
          </button>
          
          <Link 
            href="/cart" 
            className="p-2 relative"
            aria-label="Cart"
          >
            <FaShoppingCart className="w-5 h-5 text-gray-700" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                {cartCount > 9 ? '9+' : cartCount}
              </span>
            )}
          </Link>
        </div>
      </div>

      {isSearchOpen && (
        <div className="px-4 pb-3">
          <div className="relative">
            <input
              type="text"
              placeholder="Search for products..."
              className="w-full px-4 py-3 pl-12 bg-gray-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              autoFocus
            />
            <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <button 
              onClick={() => setIsSearchOpen(false)}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm font-medium"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </header>
  );
}