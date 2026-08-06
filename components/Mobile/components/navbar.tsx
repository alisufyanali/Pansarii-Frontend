// components/Mobile/components/navbar.tsx
"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import {
  HiHome,
  HiShoppingBag,
  HiUser,
  HiMenu,
  HiOutlineHome,
  HiOutlineShoppingBag,
  HiOutlineUser,
  HiOutlineMenu,
} from 'react-icons/hi';

interface NavbarProps {
  setIsMenuOpen: (isOpen: boolean) => void;
}

export default function Navbar({ setIsMenuOpen }: NavbarProps) {
  const pathname = usePathname();
  const { getCartCount } = useCart();
  const { isAuthenticated, isLoading: authLoading } = useAuth();

  const cartCount = getCartCount();

  const staticLinks = [
    {
      name: 'Home',
      href: '/',
      icon: <HiOutlineHome className="w-6 h-6" />,
      activeIcon: <HiHome className="w-6 h-6" />,
    },
    {
      name: 'Menu',
      href: '#',
      icon: <HiOutlineMenu className="w-6 h-6" />,
      activeIcon: <HiMenu className="w-6 h-6" />,
      isButton: true,
      onClick: () => setIsMenuOpen(true),
    },
    {
      name: 'Cart',
      href: '/cart',
      icon: (
        <div className="relative">
          <HiOutlineShoppingBag className="w-6 h-6" />
          {cartCount > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-black text-white text-xs rounded-full flex items-center justify-center font-bold border-2 border-white">
              {cartCount > 9 ? '9+' : cartCount}
            </span>
          )}
        </div>
      ),
      activeIcon: (
        <div className="relative">
          <HiShoppingBag className="w-6 h-6" />
          {cartCount > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-black text-white text-xs rounded-full flex items-center justify-center font-bold border-2 border-white">
              {cartCount > 9 ? '9+' : cartCount}
            </span>
          )}
        </div>
      ),
    },
  ];

  const isActive = (path: string) => {
    if (path === '/' && pathname === '/') return true;
    if (path !== '/' && pathname.startsWith(path)) return true;
    return false;
  };

  // Determine auth-driven link for the last nav slot
  // Mirrors desktop navbar: shows Profile when authenticated, Sign In when not.
  // Hidden until authLoading resolves to avoid flash of wrong state.
  const authHref   = isAuthenticated ? '/profile' : '/login';
  const authLabel  = isAuthenticated ? 'Profile'  : 'Sign In';
  const authActive = isActive(authHref);

  return (
    <>
      {/* Clean Floating Navbar */}
      <nav className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50 w-[92%] max-w-sm">
        {/* Subtle Shadow */}
        <div className="absolute inset-0 bg-black/5 blur-lg rounded-2xl -z-10 translate-y-1" />

        {/* Main Container */}
        <div className="bg-white border border-gray-200 rounded-2xl shadow-lg">

          {/* Navigation Items */}
          <div className="flex items-center justify-around p-2">

            {/* Static links (Home, Menu, Cart) */}
            {staticLinks.map((item) => {
              const active = isActive(item.href);

              if (item.isButton) {
                return (
                  <button
                    key={item.name}
                    onClick={item.onClick}
                    className={`flex flex-col items-center justify-center p-3 rounded-xl transition-all duration-200 ${
                      active ? 'bg-emerald-50' : 'hover:bg-gray-50'
                    }`}
                    aria-label={item.name}
                  >
                    <div
                      className={`p-2 rounded-lg transition-all duration-200 ${
                        active ? 'bg-emerald-100 text-emerald-600' : 'text-gray-600'
                      }`}
                    >
                      {active ? item.activeIcon : item.icon}
                    </div>
                    <span
                      className={`mt-1 text-xs font-medium transition-all duration-200 ${
                        active ? 'text-emerald-600' : 'text-gray-600'
                      }`}
                    >
                      {item.name}
                    </span>
                    {active && (
                      <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-1" />
                    )}
                  </button>
                );
              }

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex flex-col items-center justify-center p-3 rounded-xl transition-all duration-200 ${
                    active ? 'bg-emerald-50' : 'hover:bg-gray-50'
                  }`}
                  aria-label={item.name}
                >
                  <div
                    className={`p-2 rounded-lg transition-all duration-200 ${
                      active ? 'bg-emerald-100 text-emerald-600' : 'text-gray-600'
                    }`}
                  >
                    {active ? item.activeIcon : item.icon}
                  </div>
                  <span
                    className={`mt-1 text-xs font-medium transition-all duration-200 ${
                      active ? 'text-emerald-600' : 'text-gray-600'
                    }`}
                  >
                    {item.name}
                  </span>
                  {active && (
                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-1" />
                  )}
                </Link>
              );
            })}

            {/* Auth slot — mirrors desktop: hidden while loading, then auth-aware */}
            {!authLoading && (
              <Link
                href={authHref}
                className={`flex flex-col items-center justify-center p-3 rounded-xl transition-all duration-200 ${
                  authActive ? 'bg-emerald-50' : 'hover:bg-gray-50'
                }`}
                aria-label={authLabel}
              >
                <div
                  className={`p-2 rounded-lg transition-all duration-200 ${
                    authActive
                      ? 'bg-emerald-100 text-emerald-600'
                      : isAuthenticated
                      ? 'text-emerald-600'
                      : 'text-gray-600'
                  }`}
                >
                  {authActive ? (
                    <HiUser className="w-6 h-6" />
                  ) : (
                    <HiOutlineUser className="w-6 h-6" />
                  )}
                </div>
                <span
                  className={`mt-1 text-xs font-medium transition-all duration-200 ${
                    authActive
                      ? 'text-emerald-600'
                      : isAuthenticated
                      ? 'text-emerald-600'
                      : 'text-gray-600'
                  }`}
                >
                  {authLabel}
                </span>
                {authActive && (
                  <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-1" />
                )}
              </Link>
            )}

            {/* Placeholder while auth resolves — prevents layout shift */}
            {authLoading && (
              <div className="flex flex-col items-center justify-center p-3 rounded-xl opacity-0 pointer-events-none">
                <div className="p-2">
                  <HiOutlineUser className="w-6 h-6" />
                </div>
                <span className="mt-1 text-xs font-medium">·</span>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Bottom Spacer */}
      <div className="h-20" />
    </>
  );
}
