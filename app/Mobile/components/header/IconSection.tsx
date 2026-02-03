// app/Mobile/components/Header/IconsSection.tsx
"use client";

import Link from 'next/link';
import { useCart } from '../../../context/CartContext';
import { 
  FaShoppingCart,
  FaUser,
  FaTruck
} from 'react-icons/fa';
import { RiShoppingCartLine, RiUserLine, RiTruckLine } from 'react-icons/ri';

interface IconsSectionProps {
  variant?: 'filled' | 'outline';
}

export default function IconsSection({ variant = 'outline' }: IconsSectionProps) {
  const { getCartCount } = useCart();
  const cartCount = getCartCount();

  const icons = [
    {
      name: 'Track Order',
      href: '/track-order',
      icon: variant === 'filled' ? <FaTruck className="w-5 h-5" /> : <RiTruckLine className="w-5 h-5" />,
      mobileOnly: true
    },
    {
      name: 'Cart',
      href: '/cart',
      icon: variant === 'filled' ? <FaShoppingCart className="w-5 h-5" /> : <RiShoppingCartLine className="w-5 h-5" />,
      badge: cartCount > 0 ? cartCount : null
    },
    {
      name: 'Profile',
      href: '/login',
      icon: variant === 'filled' ? <FaUser className="w-5 h-5" /> : <RiUserLine className="w-5 h-5" />,
    },
  ];

  return (
    <div className="flex items-center gap-3">
      {icons.map((item) => (
        <Link
          key={item.name}
          href={item.href}
          className={`relative p-2 rounded-lg transition-all duration-200 hover:bg-gray-100 active:bg-gray-200 ${
            item.mobileOnly ? 'md:hidden' : ''
          }`}
          aria-label={item.name}
        >
          {item.icon}
          {item.badge && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
              {item.badge > 9 ? '9+' : item.badge}
            </span>
          )}
        </Link>
      ))}
    </div>
  );
}