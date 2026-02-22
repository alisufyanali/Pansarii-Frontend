// app/components/CategoryTabs.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

interface CategoryTabsProps {
  categories: Array<{
    name: string;
    count: number;
    slug: string;
  }>;
  activeCategory?: string;
  onCategoryChange?: (category: string) => void;
}

export default function CategoryTabs({ categories, activeCategory, onCategoryChange }: CategoryTabsProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState(activeCategory || 'all');
  const tabsRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);

  // Add "All Products" as the first tab
  const allTabs = [
    { name: 'All Products', count: categories.reduce((sum, cat) => sum + cat.count, 0), slug: 'all' },
    ...categories
  ];

  useEffect(() => {
    // Set active tab from URL or props
    const categoryFromUrl = searchParams.get('category');
    if (categoryFromUrl) {
      setActiveTab(categoryFromUrl);
    } else {
      setActiveTab('all');
    }
  }, [searchParams]);

  // Check for scroll arrows
  useEffect(() => {
    const checkScroll = () => {
      if (tabsRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = tabsRef.current;
        setShowLeftArrow(scrollLeft > 0);
        setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
      }
    };

    checkScroll();
    window.addEventListener('resize', checkScroll);
    tabsRef.current?.addEventListener('scroll', checkScroll);

    return () => {
      window.removeEventListener('resize', checkScroll);
      tabsRef.current?.removeEventListener('scroll', checkScroll);
    };
  }, []);

  const handleTabClick = (slug: string) => {
    setActiveTab(slug);
    
    if (onCategoryChange) {
      onCategoryChange(slug === 'all' ? '' : slug);
    } else {
      // Update URL
      const params = new URLSearchParams(searchParams.toString());
      if (slug === 'all') {
        params.delete('category');
      } else {
        params.set('category', slug);
      }
      router.push(`/shop?${params.toString()}`);
    }
  };

  const scroll = (direction: 'left' | 'right') => {
    if (tabsRef.current) {
      const scrollAmount = 200;
      tabsRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  if (allTabs.length <= 1) return null;

  return (
    <div className="relative mb-8">
      {/* Left Arrow */}
      {showLeftArrow && (
        <button
          onClick={() => scroll('left')}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-gradient-to-r from-white to-transparent pl-1 pr-4 py-2"
          aria-label="Scroll left"
        >
          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      )}

      {/* Right Arrow */}
      {showRightArrow && (
        <button
          onClick={() => scroll('right')}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-gradient-to-l from-white to-transparent pr-1 pl-4 py-2"
          aria-label="Scroll right"
        >
          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      )}

      {/* Tabs Container */}
      <div
        ref={tabsRef}
        className="flex gap-2 overflow-x-auto scrollbar-hide pb-2 px-1"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {allTabs.map((tab) => (
          <button
            key={tab.slug}
            onClick={() => handleTabClick(tab.slug)}
            className={`
              flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition-all
              ${activeTab === tab.slug
                ? 'bg-green-700 text-white shadow-md'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }
            `}
          >
            <span className="text-sm font-medium">{tab.name}</span>
            <span className={`
              text-xs px-2 py-0.5 rounded-full
              ${activeTab === tab.slug
                ? 'bg-green-600 text-white'
                : 'bg-gray-300 text-gray-700'
              }
            `}>
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}