// app/Mobile/components/Navbar.tsx
"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCart } from '../../context/CartContext';
import { 
  FaHome,
  FaShoppingCart,
  FaUser,
  FaSearch,
  FaTh,
  FaWindowMaximize,
  FaBars,
  FaThLarge
} from 'react-icons/fa';

interface NavbarProps {
  setIsMenuOpen: (isOpen: boolean) => void;
  setIsSearchOpen: (isOpen: boolean) => void;
}

export default function Navbar({ setIsMenuOpen, setIsSearchOpen }: NavbarProps) {
  const pathname = usePathname();
  const { getCartCount } = useCart();
  
  const cartCount = getCartCount();
  
  const bottomNavLinks = [
    { 
      name: 'Home', 
      href: '/', 
      icon: <FaHome className="w-5 h-5" />
    },
    { 
      name: 'Search', 
      href: '#',
      icon: <FaSearch className="w-5 h-5" />,
      isButton: true,
      onClick: () => setIsSearchOpen(true)
    },
    { 
      name: 'Menu', 
      href: '#',
      icon: <FaTh className="w-6 h-6" />, // Grid icon for menu
      isButton: true,
      onClick: () => setIsMenuOpen(true),
      isCenter: true
    },
    { 
      name: 'Cart', 
      href: '/cart', 
      icon: (
        <div className="relative">
          <FaShoppingCart className="w-5 h-5" />
          {cartCount > 0 && (
            <span className="absolute -top-2 -right-2 w-5 h-5 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs rounded-full flex items-center justify-center font-bold border-2 border-white shadow-md">
              {cartCount > 9 ? '9+' : cartCount}
            </span>
          )}
        </div>
      )
    },
    { 
      name: 'Account', 
      href: '/login', 
      icon: <FaUser className="w-5 h-5" />
    },
  ];

  const isActive = (path: string) => {
    if (path === '/' && pathname === '/') return true;
    if (path !== '/' && pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <>
      {/* Floating Navbar Container */}
      <nav className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-40 w-[94%] max-w-md">
        {/* Shadow/Glow Effect Behind */}
        <div className="absolute inset-0 bg-gradient-to-r from-green-400/20 to-emerald-500/20 blur-xl rounded-2xl -z-10"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-green-300/10 to-emerald-400/10 blur-lg rounded-2xl -z-10 translate-y-1"></div>
        
        {/* Glass Morphism Navbar */}
        <div className="relative bg-white/95 backdrop-blur-md border border-white/30 rounded-2xl shadow-xl shadow-green-900/10">
          
          {/* Decorative Top Dots */}
          <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 flex space-x-1">
            {[1, 2, 3].map((dot) => (
              <div 
                key={dot}
                className="w-1.5 h-1.5 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full"
              ></div>
            ))}
          </div>
          
          {/* Navigation Items */}
          <div className="flex items-center justify-between px-2 py-3">
            {bottomNavLinks.map((item, index) => {
              const active = isActive(item.href);
              
              if (item.isCenter) {
                return (
                  <button
                    key={item.name}
                    onClick={item.onClick}
                    className="relative -top-8 mx-1 w-16 h-16 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white flex flex-col items-center justify-center shadow-xl hover:shadow-2xl transition-all duration-300 active:scale-95 border-4 border-white"
                    aria-label={item.name || "Open Menu"}
                  >
                    <div className="w-7 h-7">
                      {item.icon}
                    </div>
                    {item.name && (
                      <span className="text-xs mt-1 font-semibold">{item.name}</span>
                    )}
                    
                    {/* Floating Animation */}
                    <div className="absolute inset-0 rounded-full border-2 border-green-300/40 animate-pulse"></div>
                  </button>
                );
              }
              
              if (item.isButton) {
                return (
                  <button
                    key={item.name}
                    onClick={item.onClick}
                    className={`flex flex-col items-center justify-center px-3 py-2 rounded-xl transition-all duration-200 ${
                      active 
                        ? 'text-green-600 bg-green-50/80' 
                        : 'text-gray-600 hover:text-green-600 hover:bg-green-50/50'
                    }`}
                    aria-label={item.name}
                  >
                    <div className="w-5 h-5">
                      {item.icon}
                    </div>
                    <span className="text-xs mt-1 font-medium">{item.name}</span>
                    
                    {/* Active Indicator */}
                    {active && (
                      <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                    )}
                  </button>
                );
              }
              
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`relative flex flex-col items-center justify-center px-3 py-2 rounded-xl transition-all duration-200 ${
                    active 
                      ? 'text-green-600 bg-green-50/80' 
                      : 'text-gray-600 hover:text-green-600 hover:bg-green-50/50'
                  }`}
                  aria-label={item.name}
                >
                  <div className="w-5 h-5">
                    {item.icon}
                  </div>
                  <span className="text-xs mt-1 font-medium">{item.name}</span>
                  
                  {/* Active Indicator */}
                  {active && (
                    <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                  )}
                </Link>
              );
            })}
          </div>
          
          {/* Bottom Decorative Line */}
          <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-green-400/10 to-emerald-500/10 rounded-full"></div>
        </div>
      </nav>
      
      {/* Safety Spacer for Bottom Content */}
      <div className="h-20"></div>
    </>
  );
}