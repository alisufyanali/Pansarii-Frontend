// app/Desktop/components/navbar.tsx
"use client";

import Link from 'next/link';
import Image from 'next/image';
import { Suspense, useState, useEffect } from 'react';
import { usePathname, useSearchParams, useRouter } from 'next/navigation';
import SearchBarWrapper from './navbar/SearchBarWrapper';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { SOCIAL_LINKS } from '@/lib/social-links';

import {
  FaFacebookF, FaInstagram, FaYoutube, FaWhatsapp,
  FaShoppingCart, FaUser, FaTruck, FaBars, FaLeaf, FaGift,
  FaChevronDown, FaTimes, FaChevronRight, FaSearch,
} from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';

import { getCategoriesCached } from '@/lib/products';

// ── helpers ──────────────────────────────────────────────────────────────────

const CATEGORY_SLUG_MAP: Record<string, string> = {
  'Herb':          'herb',
  'Oils':          'oils',
  'Supplements':   'supplements',
  'Beauty Corner': 'beauty-corner',
  'Dawakhana':     'dawakhana',
  'Remedies':      'remedies',
  'Murrabajat':    'murrabajat',
  'Arqiyaat':      'arqiyaat',
  'Spices':        'spices',
};

const navLinks = [
  { name: 'Home',       href: '/'         },
  { name: 'Shop',       href: '/shop'     },
  { name: 'By Concern', href: '/concern'  },
  { name: 'Category',   href: '/category' },
  { name: 'New Arrival',   href: '/newarrival' },
  { name: 'Offers',     href: '/offers'   },
  { name: 'Rewards',    href: '/rewards'  },
  { name: 'Blog',       href: '/blog'     },
  { name: 'Reviews',       href: '/reviews'     },
];

// Shared container — full width, max 1920px, responsive horizontal padding
const CONTAINER = "w-full max-w-[1920px] mx-auto px-[4%]";

// 3-col grid: logo | search (max 480px) | actions
const GRID = "grid grid-cols-[auto_minmax(280px,480px)_auto] items-center gap-x-6";

// ── component ─────────────────────────────────────────────────────────────────

export default function Navbar() {
  return (
    <Suspense fallback={<div className="h-32 bg-white" />}>
      <NavbarContent />
    </Suspense>
  );
}

function NavbarContent() {
  const router       = useRouter();
  const pathname     = usePathname();
  const searchParams = useSearchParams();
  const { getCartCount, getCartTotal } = useCart();
  const { isAuthenticated, user, logout, isLoading: authLoading } = useAuth();

  const [isCategorySidebarOpen, setIsCategorySidebarOpen] = useState(false);
  const [categorySearch,        setCategorySearch]        = useState('');
  const [scrolled,              setScrolled]              = useState(false);

  const [categories, setCategories] = useState<Array<{
    id: number;
    name: string;
    slug: string;
    count?: number;
  }>>([]);

  useEffect(() => {
    getCategoriesCached().then(cats => {
      if (cats.length > 0) {
        setCategories(cats.map(c => ({
          id: c.id,
          name: c.name,
          slug: CATEGORY_SLUG_MAP[c.name] || c.slug,
          count: typeof c.products_count === 'number' && c.products_count > 0
            ? c.products_count
            : undefined,
        })));
      }
    }).catch(() => {/* keep static fallback */});
  }, []);
  const currentCategory   = searchParams.get('category');
  const filteredCategories = categories.filter(c =>
    c.name.toLowerCase().includes(categorySearch.toLowerCase())
  );
  // No static mockProducts — the SearchBar fetches from the real API
  // using GET /api/products?search=query so slugs are always correct.
  const mockProducts: never[] = [];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const isActive = (path: string) =>
    path === '/' ? pathname === '/' : pathname.startsWith(path);

  const cartCount    = getCartCount();
  const cartTotal    = getCartTotal();
  const totalProducts = categories.reduce((s, c) => s + (c.count ?? 0), 0);
  const showTotalProducts = totalProducts > 0;

  const closeCategorySidebar = () => { setIsCategorySidebarOpen(false); setCategorySearch(''); };

  const handleCategorySelect = (slug: string) => {
    if (slug === 'all') {
      router.push('/category');
    } else {
      const urlSlug = CATEGORY_SLUG_MAP[slug] || slug.toLowerCase().replace(/\s+/g, '-');
      router.push(`/${urlSlug}`);
    }
    closeCategorySidebar();
  };

  // ── render ──────────────────────────────────────────────────────────────────
  return (
    <>
      <header className="w-full fixed top-0 left-0 z-40">

        {/* ── TOP BAR ── */}
        <div className={`bg-green-700 text-white overflow-hidden transition-all duration-300 ease-in-out ${scrolled ? 'max-h-0 opacity-0 pointer-events-none' : 'max-h-[34px] opacity-100'}`}>
          <div className={CONTAINER}>
            <div className="grid grid-cols-3 items-center py-1">

              {/* Social icons */}
              <div className="flex items-center gap-3">
                {[
                  { href: SOCIAL_LINKS.facebook,  Icon: FaFacebookF, label: 'Facebook'  },
                  { href: SOCIAL_LINKS.instagram, Icon: FaInstagram, label: 'Instagram' },
                  { href: SOCIAL_LINKS.twitter,   Icon: FaXTwitter,  label: 'X'         },
                  { href: SOCIAL_LINKS.youtube,   Icon: FaYoutube,   label: 'YouTube'   },
                ].map(({ href, Icon, label }) => (
                  <a key={label} href={href} target="_blank" rel="noopener noreferrer"
                    className="hover:opacity-70 transition hover:scale-110" aria-label={label}>
                    <Icon className="w-3 h-3" />
                  </a>
                ))}
              </div>

              {/* Tagline */}
              <p className="text-[11px] flex items-center justify-center gap-1.5 whitespace-nowrap">
                <FaLeaf className="w-3 h-3" />
                100% Ayurvedic &amp; Herbal Products
              </p>

              {/* WhatsApp */}
              <a href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}`} target="_blank" rel="noopener noreferrer"
                className="flex items-center justify-end gap-1.5 hover:opacity-70 transition"
                aria-label="WhatsApp">
                <FaWhatsapp className="w-3 h-3" />
                <span className="text-[11px] font-medium whitespace-nowrap">+92 304 5779900</span>
              </a>

            </div>
          </div>
        </div>

        {/* ── MIDDLE BAR ── */}
        <div className="bg-white shadow-sm">
          <div className={CONTAINER}>
            <div className={`${GRID} py-2.5`}>

              {/* Logo */}
              <Link href="/" className="flex-shrink-0" aria-label="pansariinn.pk Home">
                <div className="relative w-36 h-9">
                  <Image src="/images/logo.png" alt="pansariinn.pk Logo" fill
                    className="object-contain object-left" priority sizes="144px" fetchPriority="high" />
                </div>
              </Link>

              {/* Search — grows to fill available space */}
              <SearchBarWrapper
                placeholder="Search for products..."
                variant="desktop"
                mockProducts={mockProducts}
                className="w-full"
              />

              {/* Icon actions */}
              <div className="flex items-center gap-1 flex-shrink-0 justify-end">

                <Link href="/track-order"
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full hover:bg-gray-100 transition group"
                  aria-label="Track Order">
                  <FaTruck className="w-4 h-4 text-gray-600 group-hover:text-green-700 transition" />
                  <span className="text-[13px] font-medium text-gray-700 group-hover:text-green-700 whitespace-nowrap hidden xl:inline">
                    Track Order
                  </span>
                </Link>

                {/* Auth — waits for rehydration to avoid flash of wrong state */}
                {!authLoading && (
                  isAuthenticated ? (
                    <div className="relative group">
                      <button
                        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full hover:bg-gray-100 transition"
                        aria-label="Account menu"
                      >
                        <FaUser className="w-4 h-4 text-green-700" />
                        <span className="text-[13px] font-medium text-green-700 whitespace-nowrap hidden xl:inline">
                          {user?.name?.split(' ')[0] ?? 'Account'}
                        </span>
                      </button>
                      {/* Dropdown */}
                      <div className="absolute right-0 top-full mt-1 w-44 bg-white border border-gray-200 rounded-xl shadow-lg py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                        <Link href="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-green-700">
                          My Profile
                        </Link>
                        <Link href="/orders" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-green-700">
                          My Orders
                        </Link>
                        <Link href="/wishlist" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-green-700">
                          Wishlist
                        </Link>
                        <hr className="my-1 border-gray-100" />
                        <button
                          onClick={() => logout()}
                          className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                        >
                          Sign Out
                        </button>
                      </div>
                    </div>
                  ) : (
                    <Link href="/login"
                      className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full hover:bg-gray-100 transition group"
                      aria-label="Sign In">
                      <FaUser className="w-4 h-4 text-gray-600 group-hover:text-green-700 transition" />
                      <span className="text-[13px] font-medium text-gray-700 group-hover:text-green-700 whitespace-nowrap hidden xl:inline">
                        Sign In
                      </span>
                    </Link>
                  )
                )}

                <Link href="/cart"
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full hover:bg-gray-100 transition group relative"
                  aria-label="Shopping Cart">
                  <div className="relative">
                    <FaShoppingCart className="w-4 h-4 text-gray-600 group-hover:text-green-700 transition" />
                    {cartCount > 0 && (
                      <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-green-700 text-white text-[10px] rounded-full flex items-center justify-center font-bold">
                        {cartCount > 9 ? '9+' : cartCount}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-col items-start leading-tight flex-shrink-0 hidden xl:flex">
                    <span className="text-[13px] font-medium text-gray-700 group-hover:text-green-700 whitespace-nowrap">Cart</span>
                    {cartCount > 0 && (
                      <span className="text-[11px] text-gray-500">PKR {cartTotal.toLocaleString()}</span>
                    )}
                  </div>
                </Link>

              </div>
            </div>
          </div>
        </div>

        {/* ── BOTTOM BAR ── */}
        <div className={`bg-white border-t border-gray-100 overflow-hidden transition-all duration-300 ease-in-out ${scrolled ? 'max-h-0 opacity-0 pointer-events-none' : 'max-h-[46px] opacity-100'}`}>
          <div className={CONTAINER}>
            <div className="grid grid-cols-[auto_1fr_auto] items-center gap-x-6 py-2">

              {/* Categories button */}
              <button
                onClick={() => setIsCategorySidebarOpen(true)}
                className="flex items-center gap-1.5 px-4 py-1.5 bg-green-700 text-white rounded-full hover:bg-green-600 transition shadow-sm whitespace-nowrap flex-shrink-0"
                aria-label="Browse Categories"
              >
                <FaBars className="w-3.5 h-3.5" />
                <span className="text-[13px] font-medium">Categories</span>
                <FaChevronDown className="w-2.5 h-2.5" />
              </button>

              {/* Nav links — centered in the middle column */}
              <nav className="flex items-center justify-center gap-4 lg:gap-6" aria-label="Main navigation">
                {navLinks.map(link => (
                  <Link key={link.href} href={link.href}
                    className={`text-[13px] font-medium transition whitespace-nowrap ${
                      isActive(link.href)
                        ? 'text-green-700 font-semibold'
                        : 'text-gray-700 hover:text-green-700'
                    }`}
                    aria-current={isActive(link.href) ? 'page' : undefined}>
                    {link.name}
                  </Link>
                ))}
              </nav>

              {/* Affiliate button */}
              <Link href="/affiliate"
                className="flex items-center gap-1.5 px-4 py-1.5 bg-amber-500 text-white rounded-full hover:bg-amber-600 transition font-semibold text-[13px] shadow-sm hover:shadow-md whitespace-nowrap flex-shrink-0"
                aria-label="Become an Affiliate">
                <FaGift className="w-3.5 h-3.5" />
                Become an Affiliate
              </Link>

            </div>
          </div>
        </div>

      </header>

      {/* ── CATEGORY SIDEBAR ── */}
      {isCategorySidebarOpen && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/50" onClick={closeCategorySidebar} />

          <div className="absolute left-0 top-0 h-full w-72 bg-white shadow-xl overflow-y-auto">

            {/* Sidebar header */}
            <div className="bg-green-700 text-white p-4 sticky top-0 z-10">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-bold flex items-center gap-2">
                  <FaLeaf className="w-3.5 h-3.5" />
                  Categories
                </h2>
                <button onClick={closeCategorySidebar}
                  className="p-1.5 hover:bg-green-600 rounded-full transition" aria-label="Close">
                  <FaTimes className="w-3 h-3" />
                </button>
              </div>

              <div className="mt-3 relative">
                <label htmlFor="category-search" className="sr-only">Search categories</label>
                <input 
                  id="category-search"
                  type="text" 
                  value={categorySearch}
                  onChange={e => setCategorySearch(e.target.value)}
                  placeholder="Search categories..."
                  className="w-full px-3 py-2 pl-8 bg-white/10 text-white placeholder-white/70 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-white/50 border border-white/20" 
                  aria-label="Search categories"
                />
                <FaSearch className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-white/70" />
              </div>

              <button onClick={() => handleCategorySelect('all')}
                className={`mt-2.5 w-full text-left px-3 py-1.5 rounded-lg transition flex items-center justify-between text-xs ${
                  !currentCategory ? 'bg-white text-green-700 font-semibold' : 'text-white hover:bg-green-600'
                }`}>
                <span>All Categories</span>
                {showTotalProducts && <span className="opacity-75">({totalProducts})</span>}
              </button>
            </div>

            {/* Category list */}
            <div className="p-3">
              {filteredCategories.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-xs text-gray-500 mb-3">No categories found</p>
                  <button onClick={() => setCategorySearch('')}
                    className="text-green-700 hover:text-green-800 font-medium text-xs">
                    Clear search
                  </button>
                </div>
              ) : (
                <div className="space-y-0.5">
                  {filteredCategories.map(category => {
                    const isSelected = currentCategory === category.slug;
                    return (
                      <button key={category.slug} onClick={() => handleCategorySelect(category.slug)}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition text-left group ${
                          isSelected ? 'bg-green-100 text-green-800' : 'hover:bg-green-50 text-gray-700'
                        }`}>
                        <div className="flex items-center gap-2">
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                            isSelected ? 'bg-green-200' : 'bg-green-100 group-hover:bg-green-200'
                          }`}>
                            <FaLeaf className={`w-3 h-3 ${isSelected ? 'text-green-700' : 'text-green-600'}`} />
                          </div>
                          <span className="text-[13px] font-medium">
                            {category.name}
                            {category.count != null && category.count > 0 && (
                              <span className="text-gray-400 font-normal ml-1">({category.count})</span>
                            )}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          {category.count != null && category.count > 0 && (
                          <span className={`text-[11px] px-1.5 py-0.5 rounded-full ${
                            isSelected
                              ? 'bg-green-200 text-green-800'
                              : 'bg-gray-100 text-gray-600 group-hover:bg-green-100'
                          }`}>
                            {category.count}
                          </span>
                          )}
                          <FaChevronRight className={`w-2.5 h-2.5 ${
                            isSelected ? 'text-green-700' : 'text-gray-400 group-hover:text-green-600'
                          }`} />
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Sidebar footer */}
            <div className="sticky bottom-0 p-3 border-t bg-white">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-600">Total Categories</span>
                <span className="text-xs font-bold text-green-700 bg-green-100 px-2.5 py-1 rounded-full">
                  {categories.length}
                </span>
              </div>
            </div>

          </div>
        </div>
      )}

    </>
  );
}
