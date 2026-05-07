"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { RiHomeLine, RiHomeFill } from 'react-icons/ri';
import { HiOutlineViewGrid, HiViewGrid } from 'react-icons/hi';
import { IoBagOutline, IoBag } from 'react-icons/io5';
import { RiUserLine, RiUserFill } from 'react-icons/ri';

const navItems = [
  {
    label:      'Home',
    href:       '/',
    IconOff:    RiHomeLine,
    IconOn:     RiHomeFill,
  },
  {
    label:      'Menu',
    href:       '/category',
    IconOff:    HiOutlineViewGrid,
    IconOn:     HiViewGrid,
  },
  {
    label:      'Add Cart',
    href:       '/cart',
    IconOff:    IoBagOutline,
    IconOn:     IoBag,
  },
  {
    label:      'Sign in',
    href:       '/login',
    IconOff:    RiUserLine,
    IconOn:     RiUserFill,
  },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 px-4 w-full max-w-sm">
      <div className="bg-cream rounded-full shadow-xl px-4 py-3 flex items-center justify-around">
        {navItems.map(({ label, href, IconOff, IconOn }) => {
          const isActive = href === '/' ? pathname === '/' : pathname.startsWith(href);
          const Icon = isActive ? IconOn : IconOff;

          return (
            <Link
              key={label}
              href={href}
              className="flex flex-col items-center gap-0.5 min-w-[56px]"
            >
              <Icon
                className={`w-6 h-6 transition-colors ${
                  isActive ? 'text-green-700' : 'text-gray-600'
                }`}
              />
              <span
                className={`text-[10px] font-medium transition-colors ${
                  isActive ? 'text-green-700' : 'text-gray-600'
                }`}
              >
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
