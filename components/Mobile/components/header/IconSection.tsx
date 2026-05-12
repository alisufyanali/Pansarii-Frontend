"use client";

import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { RiShoppingCartLine, RiUserLine } from 'react-icons/ri';

export default function IconsSection() {
  const { getCartCount } = useCart();
  const cartCount = getCartCount();

  return (
    <div className="flex items-center gap-1">
      <Link
        href="/login"
        className="p-2 text-gray-600 hover:text-green-700 transition-colors"
        aria-label="Account"
      >
        <RiUserLine className="w-5 h-5" />
      </Link>

      <Link
        href="/cart"
        className="relative p-2 text-gray-600 hover:text-green-700 transition-colors"
        aria-label="Cart"
      >
        <RiShoppingCartLine className="w-5 h-5" />
        {cartCount > 0 && (
          <span className="absolute top-0.5 right-0.5 w-4 h-4 bg-green-700 text-white text-[9px] rounded-full flex items-center justify-center font-bold">
            {cartCount > 9 ? '9+' : cartCount}
          </span>
        )}
      </Link>
    </div>
  );
}
