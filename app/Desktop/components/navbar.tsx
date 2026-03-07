// app/Desktop/components/navbar.tsx
"use client";

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';
import { usePathname, useSearchParams, useRouter } from 'next/navigation';
import SearchBarWrapper from './navbar/SearchBarWrapper';
import CartSidebar from './sidebar';
import { useCart } from '../../context/CartContext';

// Import React Icons
import { 
  FaFacebookF, 
  FaInstagram, 
  FaTwitter, 
  FaYoutube, 
  FaWhatsapp,
  FaShoppingCart,
  FaUser,
  FaTruck,
  FaBars,
  FaLeaf,
  FaGift,
  FaChevronDown,
  FaTimes,
  FaChevronRight,
  FaSearch
} from 'react-icons/fa';

// Import all products from data
import { allProducts } from '@/app/Desktop/data/products';

// Categories data - dynamically generated from products
const getCategoriesFromProducts = () => {
  const categoriesSet = new Set<string>();
  allProducts.forEach(product => {
    if (product.category) {
      categoriesSet.add(product.category);
    }
  });
  
  return Array.from(categoriesSet)
    .sort()
    .map(category => ({
      name: category,
      slug: category,
      count: allProducts.filter(p => p.category === category).length
    }));
};

// Navigation links
const navLinks = [
  { name: 'Home', href: '/' },
  { name: 'Shop', href: '/shop' },
  { name: 'By Concern', href: '/concern' },
  { name: 'Category', href: '/category' },
  { name: 'Offers', href: '/offers' },
  { name: 'Rewards', href: '/rewards' },
  { name: 'Blog', href: '/blog' },
];

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { getCartCount, getCartTotal } = useCart();
  const [isCategorySidebarOpen, setIsCategorySidebarOpen] = useState(false);
  const [isCartSidebarOpen, setIsCartSidebarOpen] = useState(false);
  const [categorySearch, setCategorySearch] = useState('');
  const [scrolled, setScrolled] = useState(false);
  const lastScrollY = useRef(0);

  // Get categories from products
  const categories = getCategoriesFromProducts();
  
  // Get current category from URL
  const currentCategory = searchParams.get('category');
  
  // Filter categories based on search
  const filteredCategories = categories.filter(category => 
    category.name.toLowerCase().includes(categorySearch.toLowerCase())
  );
  
  // Format mock products for search suggestions
  const mockProducts = allProducts.map(product => ({
    id: product.id.toString(),
    name: product.nameEn,
    slug: product.nameEn.toLowerCase().replace(/\s+/g, '-'),
    price: product.price,
    salePrice: product.oldPrice || undefined,
    image: product.img,
    category: product.category,
    rating: product.rating,
    isBestSeller: product.isBestSeller || false,
    description: product.description,
  }));

  // Scroll listener
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > 60) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (path: string) => {
    if (path === '/' && pathname === '/') return true;
    if (path !== '/' && pathname.startsWith(path)) return true;
    return false;
  };

  const cartCount = getCartCount();
  const cartTotal = getCartTotal();

  const openCartSidebar = () => setIsCartSidebarOpen(true);
  const closeCartSidebar = () => setIsCartSidebarOpen(false);
  const closeCategorySidebar = () => {
    setIsCategorySidebarOpen(false);
    setCategorySearch('');
  };

  const handleCategorySelect = (slug: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (slug === 'all') {
      params.delete('category');
    } else {
      params.set('category', slug);
    }
    const queryString = params.toString();
    const url = queryString ? `/shop?${queryString}` : '/shop';
    router.push(url);
    closeCategorySidebar();
  };
  
  const totalProducts = categories.reduce((sum, cat) => sum + cat.count, 0);

  /*
   * Shared 3-column grid used across ALL THREE BARS so columns lock perfectly:
   *
   *  Col A (auto)  │  Col B (fit-content / shrink)  │  Col C (auto)
   *  ──────────────┼────────────────────────────────┼──────────────────────
   *  TOP:  social icons          │ tagline centered  │ whatsapp + phone
   *  MID:  logo                  │ search bar        │ track + signin + cart
   *  BOT:  all-categories btn    │ nav links         │ affiliate btn
   *
   *  Col B uses "minmax(0,max-content)" so it shrinks to exactly the content
   *  width — search bar fills this, nav links are centered within it.
   *  Col A and Col C are "auto" — sized by their widest row item.
   */

// REPLACE:
const GRID = "grid grid-cols-[auto_480px_auto] items-center gap-x-6 justify-between";


  return (
    <>
      <header className="w-full fixed top-0 left-0 z-40">

        {/* ── TOP BAR ── */}
        <div
          className="bg-green-700 text-white overflow-hidden transition-all duration-300 ease-in-out"
          style={{
            maxHeight: scrolled ? '0px' : '48px',
            opacity: scrolled ? 0 : 1,
            pointerEvents: scrolled ? 'none' : 'auto',
          }}
        >
          <div className="w-full max-w-[1600px] mx-auto px-6 py-2">
            <div className={GRID}>

              {/* COL A — Social Icons */}
              <div className="flex items-center gap-4">
                <a href="https://facebook.com/pansariin.pk" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition hover:scale-110" aria-label="Facebook">
                  <FaFacebookF className="w-4 h-4" />
                </a>
                <a href="https://instagram.com/pansariin.pk" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition hover:scale-110" aria-label="Instagram">
                  <FaInstagram className="w-4 h-4" />
                </a>
                <a href="https://twitter.com/pansariin" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition hover:scale-110" aria-label="Twitter">
                  <FaTwitter className="w-4 h-4" />
                </a>
                <a href="https://youtube.com/pansariin" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition hover:scale-110" aria-label="YouTube">
                  <FaYoutube className="w-4 h-4" />
                </a>
              </div>

              {/* COL B — Tagline (no bold) */}
              <p className="text-sm flex items-center justify-center gap-2 whitespace-nowrap">
                <FaLeaf className="w-4 h-4" />
                100% Ayurvedic &amp; Herbal Products
              </p>

              {/* COL C — WhatsApp + phone */}
              <a
                href="https://wa.me/923001234567"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-end gap-2 hover:opacity-80 transition"
                aria-label="WhatsApp"
              >
                <FaWhatsapp className="w-4 h-4" />
                <span className="text-sm font-medium whitespace-nowrap">+92 300 1234567</span>
              </a>

            </div>
          </div>
        </div>

        {/* ── MIDDLE BAR ── */}
        <div className="bg-white shadow-sm">
          <div className="w-full max-w-[1600px] mx-auto px-6 py-3">
            <div className={GRID}>

              {/* COL A — Logo */}
              <Link href="/" className="flex-shrink-0" aria-label="Pansariin.pk Home">
                <div className="relative w-44 h-11">
                  <Image
                    src="/images/logo.png"
                    alt="Pansariin.pk Logo"
                    fill
                    className="object-contain object-left"
                    priority
                    sizes="176px"
                  />
                </div>
              </Link>

              {/* COL B — Search bar: same column as nav links, fills their width */}
              <SearchBarWrapper
                placeholder="Search for products..."
                variant="desktop"
                mockProducts={mockProducts}
                className="w-full ml-10"
              />

              {/* COL C — Icon actions */}
           <div className="flex items-center gap-1 flex-shrink-0 whitespace-nowrap">
                <Link
                  href="/track-order"
                  className="flex items-center gap-2 px-3 py-2 rounded-full hover:bg-gray-100 transition group"
                  aria-label="Track Order"
                >
                  <FaTruck className="w-[18px] h-[18px] text-gray-600 group-hover:text-green-700 transition" />
                  <span className="text-sm font-medium text-gray-700 group-hover:text-green-700 transition whitespace-nowrap">
                    Track Order
                  </span>
                </Link>

                <Link
                  href="/login"
                  className="flex items-center gap-2 px-3 py-2 rounded-full hover:bg-gray-100 transition group"
                  aria-label="Sign In"
                >
                  <FaUser className="w-[18px] h-[18px] text-gray-600 group-hover:text-green-700 transition" />
                <span className="text-sm font-medium text-gray-700 group-hover:text-green-700 transition whitespace-nowrap">
  Sign In
</span>
                </Link>

                <button
                  onClick={openCartSidebar}
                  className="flex items-center gap-2 px-3 py-2 rounded-full hover:bg-gray-100 transition group relative"
                  aria-label="Shopping Cart"
                >
                  <div className="relative">
                    <FaShoppingCart className="w-[18px] h-[18px] text-gray-600 group-hover:text-green-700 transition" />
                    {cartCount > 0 && (
                      <span
                        className="absolute -top-2 -right-2 w-5 h-5 bg-green-700 text-white text-xs rounded-full flex items-center justify-center font-bold"
                        aria-label={`${cartCount} items in cart`}
                      >
                        {cartCount > 9 ? '9+' : cartCount}
                      </span>
                    )}
                  </div>
             
<div className="flex flex-col items-start leading-tight flex-shrink-0">
  <span className="text-sm font-medium text-gray-700 group-hover:text-green-700 transition whitespace-nowrap">Cart</span>
                    {cartCount > 0 && (
                      <span className="text-xs text-gray-500">PKR {cartTotal.toLocaleString()}</span>
                    )}
                  </div>
                </button>
              </div>

            </div>
          </div>
        </div>

        {/* ── BOTTOM BAR ── */}
        <div
          className="bg-white border-t border-gray-100 overflow-hidden transition-all duration-300 ease-in-out"
          style={{
            maxHeight: scrolled ? '0px' : '56px',
            opacity: scrolled ? 0 : 1,
            pointerEvents: scrolled ? 'none' : 'auto',
          }}
        >
          <div className="w-full max-w-[1600px] mx-auto px-6 py-3">
            <div className={GRID}>

              {/* COL A — All Categories btn */}
              <button
                onClick={() => setIsCategorySidebarOpen(true)}
                className="flex items-center gap-2 px-5 py-2 bg-green-700 text-white rounded-full hover:bg-green-600 transition font-medium shadow-sm whitespace-nowrap flex-shrink-0"
                aria-label="Browse Categories"
              >
                <FaBars className="w-4 h-4" />
                <span> Categories</span>
                <FaChevronDown className="w-3 h-3" />
              </button>

              {/* COL B — Nav links centered inside same column as search bar */}
              <nav className="flex items-center justify-center gap-4 mr-7" aria-label="Main navigation">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`text-sm font-medium transition whitespace-nowrap ${
                      isActive(link.href)
                        ? 'text-green-700 font-semibold'
                        : 'text-gray-700 hover:text-green-700'
                    }`}
                    aria-current={isActive(link.href) ? 'page' : undefined}
                  >
                    {link.name}
                  </Link>
                ))}
              </nav>

              {/* COL C — Affiliate btn aligned to same column as icon actions */}
              <Link
                href="/affiliate"
                className="flex items-center justify-end gap-2 px-5 py-2 bg-amber-500 text-white rounded-full hover:bg-amber-600 transition font-semibold text-sm shadow-sm hover:shadow-md whitespace-nowrap flex-shrink-0"
                aria-label="Become an Affiliate"
              >
                <FaGift className="w-4 h-4" />
                Become an Affiliate
              </Link>

            </div>
          </div>
        </div>

      </header>

      {/* Category Sidebar */}
      {isCategorySidebarOpen && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/50" onClick={closeCategorySidebar} />
          
          <div className="absolute left-0 top-0 h-full w-80 bg-white shadow-xl transform transition-transform duration-300 overflow-y-auto">
            <div className="bg-green-700 text-white p-5 sticky top-0 z-10">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold flex items-center gap-3">
                  <FaLeaf className="w-5 h-5" />
                  Categories
                </h2>
                <button onClick={closeCategorySidebar} className="p-2 hover:bg-green-600 rounded-full transition" aria-label="Close">
                  <FaTimes className="w-4 h-4" />
                </button>
              </div>
              
              <div className="mt-4 relative">
                <input
                  type="text"
                  value={categorySearch}
                  onChange={(e) => setCategorySearch(e.target.value)}
                  placeholder="Search categories..."
                  className="w-full px-4 py-2.5 pl-10 bg-white/10 text-white placeholder-white/70 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-white/50 border border-white/20"
                />
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/70" />
              </div>

              <button
                onClick={() => handleCategorySelect('all')}
                className={`mt-3 w-full text-left px-4 py-2.5 rounded-lg transition flex items-center justify-between ${
                  !currentCategory ? 'bg-white text-green-700 font-semibold' : 'text-white hover:bg-green-600'
                }`}
              >
                <span>All Categories</span>
                <span className="text-sm opacity-80">({totalProducts})</span>
              </button>
            </div>

            <div className="p-4">
              {filteredCategories.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500 mb-3">No categories found</p>
                  <button onClick={() => setCategorySearch('')} className="text-green-700 hover:text-green-800 font-medium text-sm">
                    Clear search
                  </button>
                </div>
              ) : (
                <div className="space-y-1">
                  {filteredCategories.map((category) => {
                    const isSelected = currentCategory === category.slug;
                    return (
                      <button
                        key={category.slug}
                        onClick={() => handleCategorySelect(category.slug)}
                        className={`w-full flex items-center justify-between p-3 rounded-lg transition text-left group ${
                          isSelected ? 'bg-green-100 text-green-800' : 'hover:bg-green-50 text-gray-700'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            isSelected ? 'bg-green-200' : 'bg-green-100 group-hover:bg-green-200'
                          }`}>
                            <FaLeaf className={`w-4 h-4 ${isSelected ? 'text-green-700' : 'text-green-600'}`} />
                          </div>
                          <span className="font-medium">{category.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`text-sm px-2 py-1 rounded-full ${
                            isSelected ? 'bg-green-200 text-green-800' : 'bg-gray-100 text-gray-600 group-hover:bg-green-100'
                          }`}>
                            {category.count}
                          </span>
                          <FaChevronRight className={`w-3 h-3 ${isSelected ? 'text-green-700' : 'text-gray-400 group-hover:text-green-600'}`} />
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="sticky bottom-0 p-4 border-t bg-white">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Total Categories</span>
                <span className="font-bold text-green-700 bg-green-100 px-3 py-1 rounded-full">
                  {categories.length}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Cart Sidebar */}
      <CartSidebar isOpen={isCartSidebarOpen} onClose={closeCartSidebar} />
    </>
  );
}