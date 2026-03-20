// components/CategoryMenuButton.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { FiGrid, FiChevronDown, FiChevronRight } from 'react-icons/fi';
import { HiOutlineShoppingBag } from 'react-icons/hi';
import Link from 'next/link';

interface CategoryMenuButtonProps {
  categories: {
    name: string;
    count: number;
    slug: string;
  }[];
}

export default function CategoryMenuButton({ categories }: CategoryMenuButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const totalProducts = categories.reduce((sum, cat) => sum + cat.count, 0);

  return (
    <div ref={menuRef} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-colors"
      >
        <FiGrid className="w-5 h-5 text-gray-700" />
        <span className="text-sm font-medium text-gray-700">
          All Categories
        </span>
        <FiChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-80 bg-white rounded-xl shadow-2xl border border-gray-200 z-50 max-h-[70vh] overflow-y-auto">
          {/* Header */}
          <div className="p-4 border-b bg-gradient-to-r from-green-50 to-emerald-50">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-gray-900">Browse Categories</h3>
                <p className="text-sm text-gray-600 mt-0.5">
                  {categories.length} categories • {totalProducts} products
                </p>
              </div>
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <FiGrid className="w-5 h-5 text-green-700" />
              </div>
            </div>
          </div>

          {/* Categories List */}
          <div className="p-2">
            {categories.map((category, index) => (
              <Link
                key={category.slug}
                href={`/shop?category=${category.slug}`}
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-between p-3 rounded-lg hover:bg-green-50 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center group-hover:bg-green-100 transition-colors">
                    <HiOutlineShoppingBag className="w-5 h-5 text-gray-600 group-hover:text-green-700" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 group-hover:text-green-700">
                      {category.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {category.count} {category.count === 1 ? 'product' : 'products'}
                    </p>
                  </div>
                </div>
                <FiChevronRight className="w-4 h-4 text-gray-400 group-hover:text-green-600" />
              </Link>
            ))}
          </div>

          {/* Footer */}
          <div className="p-4 border-t bg-gray-50">
            <Link
              href="/shop"
              onClick={() => setIsOpen(false)}
              className="block w-full text-center py-2.5 bg-green-700 text-white rounded-lg hover:bg-green-600 transition-colors font-medium text-sm"
            >
              View All Products
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}