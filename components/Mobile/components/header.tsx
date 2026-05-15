"use client";

import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState, useRef } from 'react';
import { FiSearch, FiX } from 'react-icons/fi';
import { RiUserLine, RiShoppingCartLine } from 'react-icons/ri';
import { useCart } from '@/context/CartContext';
import { allProducts } from '@/components/Desktop/data/products';

interface HeaderProps {
  isMenuOpen:    boolean;
  setIsMenuOpen: (v: boolean) => void;
}

// ── Search bar ────────────────────────────────────────────────────────────────
function MobileSearchBar() {
  const router   = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState('');
  const [open,  setOpen]  = useState(false);

  const suggestions = query.trim()
    ? allProducts
        .filter(p => p.nameEn.toLowerCase().includes(query.toLowerCase()))
        .slice(0, 5)
    : [];

  const handleSearch = (q: string) => {
    if (!q.trim()) return;
    setQuery('');
    setOpen(false);
    router.push(`/shop?search=${encodeURIComponent(q.trim())}`);
  };

  return (
    <div className="relative px-4 pb-3">
      <form onSubmit={e => { e.preventDefault(); handleSearch(query); }}>
        <div className="flex items-center bg-gray-50 border border-gray-200 rounded-full px-4 py-2.5">
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => { setQuery(e.target.value); setOpen(true); }}
            onFocus={() => setOpen(true)}
            placeholder="Search"
            className="flex-1 bg-transparent text-sm text-gray-700 placeholder-gray-400 outline-none"
          />
          {query ? (
            <button type="button" onClick={() => { setQuery(''); setOpen(false); }}>
              <FiX className="w-4 h-4 text-gray-400" />
            </button>
          ) : (
            <FiSearch className="w-4 h-4 text-gray-400" />
          )}
        </div>
      </form>

      {/* Suggestions */}
      {open && suggestions.length > 0 && (
        <div className="absolute left-4 right-4 top-full mt-1 bg-white rounded-xl shadow-lg border border-gray-100 z-50 overflow-hidden">
          {suggestions.map(p => (
            <button
              key={p.id}
              onClick={() => handleSearch(p.nameEn)}
              className="flex items-center gap-3 w-full px-4 py-2.5 hover:bg-gray-50 text-left"
            >
              <div className="relative w-8 h-8 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                <Image src={p.img} alt={p.nameEn} fill className="object-contain" sizes="32px" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-gray-900 truncate">{p.nameEn}</p>
                <p className="text-[10px] text-gray-400">{p.category}</p>
              </div>
              <span className="text-xs font-semibold text-green-700 flex-shrink-0">PKR {p.price}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Main header ───────────────────────────────────────────────────────────────
export default function Header({ isMenuOpen, setIsMenuOpen }: HeaderProps) {
  const { getCartCount } = useCart();
  const cartCount = getCartCount();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm">

      {/* ── Marquee bar ── */}
      <div className="bg-green-700 py-1.5 overflow-hidden rounded-b-2xl">
        <div className="flex whitespace-nowrap animate-marquee">
          {[...Array(3)].map((_, i) => (
            <span key={i} className="text-white text-xs font-medium px-8">
              100% Ayurvedic &amp; Herbal Products &nbsp;·&nbsp; Free Delivery on orders above PKR 999 &nbsp;·&nbsp; Certified Organic &nbsp;·&nbsp;
            </span>
          ))}
        </div>
      </div>

      {/* ── Logo row — hamburger left, logo absolute center, icons right ── */}
      <div className="relative flex items-center justify-between px-4 py-2">

        {/* Hamburger — left */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="p-1.5 rounded-lg hover:bg-gray-50 active:bg-gray-100 transition"
          aria-label="Menu"
        >
          <div className="w-5 flex flex-col gap-[4px]">
            <span className={`block h-[2px] bg-gray-700 transition-all ${isMenuOpen ? 'rotate-45 translate-y-[6px]' : ''}`} />
            <span className={`block h-[2px] bg-gray-700 transition-all ${isMenuOpen ? 'opacity-0' : ''}`} />
            <span className={`block h-[2px] bg-gray-700 transition-all ${isMenuOpen ? '-rotate-45 -translate-y-[6px]' : ''}`} />
          </div>
        </button>

        {/* Logo — absolutely centered */}
        <Link href="/" aria-label="Home" className="absolute left-1/2 -translate-x-1/2">
          <div className="relative w-28 h-8">
            <Image src="/images/logo.png" alt="Pansari Inn" fill className="object-contain" priority sizes="112px" />
          </div>
        </Link>

        {/* Icons — right */}
        <div className="flex items-center gap-0.5">
          <Link href="/login" className="p-2 text-gray-600 hover:text-green-700 transition-colors" aria-label="Account">
            <RiUserLine className="w-5 h-5" />
          </Link>
          <Link href="/cart" className="relative p-2 text-gray-600 hover:text-green-700 transition-colors" aria-label="Cart">
            <RiShoppingCartLine className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute top-0.5 right-0.5 w-4 h-4 bg-green-700 text-white text-[9px] rounded-full flex items-center justify-center font-bold">
                {cartCount > 9 ? '9+' : cartCount}
              </span>
            )}
          </Link>
        </div>

      </div>

      {/* ── Search bar ── */}
      <MobileSearchBar />

    </header>
  );
}
