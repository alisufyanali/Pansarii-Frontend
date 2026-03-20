// app/Mobile/components/Header/IconsSection.tsx
"use client";

import Link from 'next/link';
import { useCart } from '../../../context/CartContext';
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
      icon: <RiTruckLine className="w-5 h-5" />,
      mobileOnly: true
    },
    {
      name: 'Cart',
      href: '/cart',
      icon: <RiShoppingCartLine className="w-5 h-5" />,
      badge: cartCount > 0 ? cartCount : null
    },
    {
      name: 'Profile',
      href: '/login',
      icon: <RiUserLine className="w-5 h-5" />,
    },
  ];

  return (
    <div className="flex items-center gap-1">
      {icons.map((item) => (
        <Link
          key={item.name}
          href={item.href}
          className={`relative p-2 rounded-lg transition-all duration-200 hover:bg-gray-50 active:bg-gray-100 text-gray-700 hover:text-green-600 ${
            item.mobileOnly ? 'md:hidden' : ''
          }`}
          aria-label={item.name}
        >
          {item.icon}
          {item.badge && (
            <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 bg-green-600 text-white text-[10px] rounded-full flex items-center justify-center font-bold">
              {item.badge > 9 ? '9+' : item.badge}
            </span>
          )}
        </Link>
      ))}
    </div>
  );
}