// LinkColumns.tsx
'use client';

import { useState } from 'react';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';

interface LinkColumnsProps {
  textStyle: React.CSSProperties;
  buttonColor: string;
  isMobile?: boolean;
}

const linkGroups = [
  {
    title: 'Quick Links',
    links: [
      { name: 'About Us', url: '/about' },
      { name: 'Our Story', url: '/story' },
      { name: 'Ingredients', url: '/ingredients' },
      { name: 'Blog', url: '/blog' },
      { name: 'Careers', url: '/careers' }
    ]
  },
  {
    title: 'Shop',
    links: [
      { name: 'Skincare', url: '/shop/skincare' },
      { name: 'Haircare', url: '/shop/haircare' },
      { name: 'Oils', url: '/shop/oils' },
      { name: 'Supplements', url: '/shop/supplements' },
      { name: 'Best Sellers', url: '/shop/best-sellers' }
    ]
  },
  {
    title: 'Customer Service',
    links: [
      { name: 'Track Order', url: '/track-order' },
      { name: 'Returns', url: '/returns' },
      { name: 'Shipping Info', url: '/shipping' },
      { name: 'FAQs', url: '/faqs' }
    ]
  }
];

export default function LinkColumns({ textStyle, buttonColor, isMobile = false }: LinkColumnsProps) {
  const [openDropdowns, setOpenDropdowns] = useState<string[]>([]);

  const toggleDropdown = (title: string) => {
    setOpenDropdowns(prev =>
      prev.includes(title)
        ? prev.filter(t => t !== title)
        : [...prev, title]
    );
  };

  // Mobile view with dropdowns
  if (isMobile) {
    return (
      <div className="w-full space-y-4 lg:hidden">
        {linkGroups.map((group) => {
          const isOpen = openDropdowns.includes(group.title);
          
          return (
            <div key={group.title} className="border border-gray-200 rounded-lg overflow-hidden">
              <button
                onClick={() => toggleDropdown(group.title)}
                className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
                style={{ color: buttonColor }}
              >
                <span className="font-bold text-sm uppercase tracking-wide">
                  {group.title}
                </span>
                {isOpen ? (
                  <FaChevronUp className="w-4 h-4" />
                ) : (
                  <FaChevronDown className="w-4 h-4" />
                )}
              </button>
              
              {isOpen && (
                <div className="p-4 bg-white">
                  <ul className="space-y-3">
                    {group.links.map((link) => (
                      <li key={link.name}>
                        <a 
                          href={link.url}
                          style={{ ...textStyle, fontSize: '14px' }}
                          className="hover:text-[#197B33] transition-colors duration-200 inline-block"
                        >
                          {link.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  }

  // Desktop view (original grid layout)
  return (
    <div className="hidden lg:grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-4 lg:gap-8 w-full">
      {linkGroups.map((group) => (
        <div key={group.title} className="min-w-0">
          <h4 
            className="font-bold mb-3 sm:mb-4 text-sm sm:text-base lg:text-lg"
            style={{ 
              fontFamily: 'Poppins',
              letterSpacing: '0.4px',
              textTransform: 'uppercase',
              color: buttonColor
            }}
          >
            {group.title}
          </h4>
          <ul className="space-y-2 sm:space-y-3">
            {group.links.map((link) => (
              <li key={link.name}>
                <a 
                  href={link.url}
                  style={{ 
                    ...textStyle, 
                    fontSize: 'clamp(12px, 2vw, 14px)',
                    lineHeight: '1.5'
                  }} 
                  className="hover:text-[#197B33] transition-colors duration-200 inline-block"
                >
                  {link.name}
                </a>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}