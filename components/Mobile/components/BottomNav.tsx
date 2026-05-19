"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  RiHomeLine, RiHomeFill,
  RiSearchLine, RiSearchFill,
  RiShoppingBagLine, RiShoppingBagFill,
  RiHeartLine, RiHeartFill,
  RiUserLine, RiUserFill,
} from 'react-icons/ri';

const navItems = [
  { label: 'Home',     href: '/',         IconOff: RiHomeLine,         IconOn: RiHomeFill         },
  { label: 'Search',   href: '/shop',     IconOff: RiSearchLine,       IconOn: RiSearchFill       },
  { label: 'Cart',     href: '/cart',     IconOff: RiShoppingBagLine,  IconOn: RiShoppingBagFill  },
  { label: 'Wishlist', href: '/wishlist', IconOff: RiHeartLine,        IconOn: RiHeartFill        },
  { label: 'Profile',  href: '/profile',  IconOff: RiUserLine,         IconOn: RiUserFill         },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-100 shadow-[0_-2px_12px_rgba(0,0,0,0.06)]">
      <div className="flex items-center justify-around px-2 py-2 max-w-lg mx-auto">
        {navItems.map(({ label, href, IconOff, IconOn }) => {
          const isActive = href === '/' ? pathname === '/' : pathname.startsWith(href);
          const Icon = isActive ? IconOn : IconOff;

          /* Profile tab gets a filled green pill when active */
          if (label === 'Profile' && isActive) {
            return (
              <Link
                key={label}
                href={href}
                className="flex flex-col items-center gap-0.5 min-w-[52px]"
                aria-label={label}
              >
                <div className="w-11 h-11 rounded-full bg-green-500 flex items-center justify-center shadow-md">
                  <Icon className="w-5 h-5 text-white" />
                </div>
              </Link>
            );
          }

          return (
            <Link
              key={label}
              href={href}
              className="flex flex-col items-center gap-0.5 min-w-[52px]"
              aria-label={label}
            >
              <Icon
                className={`w-5 h-5 transition-colors ${
                  isActive ? 'text-green-600' : 'text-gray-500'
                }`}
              />
              <span
                className={`text-[10px] font-medium transition-colors ${
                  isActive ? 'text-green-600' : 'text-gray-500'
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
