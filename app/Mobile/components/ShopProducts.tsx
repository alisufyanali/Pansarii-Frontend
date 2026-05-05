"use client";

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { FiSearch } from 'react-icons/fi';
import MobileProductCard from './ProductCard';
import { allProducts } from '@/app/Desktop/data/products';

const menuTabs = [
  { id: 'all',           label: 'All'          },
  { id: 'new',           label: 'New In'       },
  { id: 'bestsellers',   label: 'Best Sellers' },
  { id: 'Oils',          label: 'Oils'         },
  { id: 'Herb',          label: 'Herbs'        },
  { id: 'Beauty Corner', label: 'Beauty'       },
  { id: 'Supplements',   label: 'Supplements'  },
];

export default function ShopProducts() {
  const [activeTab,  setActiveTab]  = useState('all');
  const tabScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (tabScrollRef.current) {
      const el = tabScrollRef.current.querySelector(`[data-tab="${activeTab}"]`);
      if (el) {
        const parent = tabScrollRef.current;
        const elLeft = (el as HTMLElement).offsetLeft;
        const elWidth = (el as HTMLElement).offsetWidth;
        parent.scrollLeft = elLeft - parent.offsetWidth / 2 + elWidth / 2;
      }
    }
  }, [activeTab]);

  const filteredProducts = (() => {
    switch (activeTab) {
      case 'all':         return allProducts.slice(0, 12);
      case 'new':         return allProducts.filter(p => p.isNew).slice(0, 12);
      case 'bestsellers': return allProducts.filter(p => p.isBestSeller).slice(0, 12);
      default:            return allProducts.filter(p => p.category === activeTab).slice(0, 12);
    }
  })();

  return (
    <div className="bg-white mt-2 rounded-t-2xl shadow-sm">

      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-5 pb-2">
        <h2 className="text-base font-bold text-gray-900">
          Shop <span className="me-color-y">Products</span>
        </h2>
        <Link
          href={`/shop${activeTab !== 'all' ? `?category=${activeTab}` : ''}`}
          className="text-sm text-green-700 font-medium"
        >
          View All
        </Link>
      </div>

      {/* Tabs */}
      <div className="sticky top-0 z-20 bg-white border-b border-gray-100">
        <div
          ref={tabScrollRef}
          className="flex gap-2 overflow-x-auto px-4 py-2.5 no-scrollbar"
        >
          {menuTabs.map(tab => (
            <button
              key={tab.id}
              data-tab={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-1.5 rounded-full whitespace-nowrap text-sm font-medium transition-all flex-shrink-0 ${
                activeTab === tab.id
                  ? 'bg-green-700 text-white'
                  : 'bg-gray-100 text-gray-600 active:scale-95'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Products */}
      <div className="px-4 pt-4 pb-6">
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 gap-3">
            {filteredProducts.map(product => (
              <MobileProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <FiSearch className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 text-sm">No products found</p>
          </div>
        )}

        {filteredProducts.length > 0 && (
          <div className="text-center mt-5">
            <Link
              href={`/shop${activeTab !== 'all' ? `?category=${activeTab}` : ''}`}
              className="inline-block px-8 py-2.5 bg-green-700 text-white text-sm font-medium rounded-full hover:bg-green-600 transition-colors active:scale-95"
            >
              View All Products
            </Link>
          </div>
        )}
      </div>

    </div>
  );
}
