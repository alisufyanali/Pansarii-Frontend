"use client";

import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';
import { FiSearch, FiX } from 'react-icons/fi';
import { RiUserLine, RiShoppingCartLine } from 'react-icons/ri';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { API_BASE_URL } from '@/lib/api-config';

interface HeaderProps {
  isMenuOpen: boolean;
  setIsMenuOpen: (v: boolean) => void;
}

// ── Search bar ────────────────────────────────────────────────────────────────
function MobileSearchBar() {
  const router   = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query,       setQuery]       = useState('');
  const [suggestions, setSuggestions] = useState<Array<{
    id: string; name: string; slug: string;
    price: number; salePrice?: number;
    image?: string; category?: string;
  }>>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [open,      setOpen]      = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Fetch suggestions from the real API — same pattern as desktop navbar/searchbar.tsx
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!query.trim()) { setSuggestions([]); return; }

    debounceRef.current = setTimeout(async () => {
      setIsLoading(true);
      try {
        const baseUrl = API_BASE_URL;
        const params  = new URLSearchParams({ search: query.trim(), per_page: '5' });
        const res     = await fetch(`${baseUrl}/products?${params}`, {
          headers: { Accept: 'application/json' },
        });
        if (res.ok) {
          const data = await res.json();
          setSuggestions(
            (data.data ?? []).map((p: {
              id: number; name: string; slug: string;
              price: number; sale_price?: number | null;
              thumbnail?: string | null;
              category?: { name?: string };
            }) => ({
              id:        String(p.id),
              name:      p.name,
              slug:      p.slug,               // real API slug — never name-derived
              price:     p.price,
              salePrice: p.sale_price ?? undefined,
              image:     p.thumbnail ?? undefined,
              category:  p.category?.name,
            }))
          );
          setOpen(true);
        }
      } catch {
        // silently ignore — suggestions are not critical
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [query]);

  const handleSearch = (q: string) => {
    if (!q.trim()) return;
    setQuery('');
    setOpen(false);
    setSuggestions([]);
    router.push(`/shop?search=${encodeURIComponent(q.trim())}`);
  };

  return (
    <div className="relative px-4 pb-3">
      <form onSubmit={e => { e.preventDefault(); handleSearch(query); }}>
        <label htmlFor="mobile-search" className="sr-only">Search products</label>
        <div className="flex items-center bg-gray-50 border border-gray-200 rounded-full px-4 py-2.5">
          <input
            id="mobile-search"
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => { setQuery(e.target.value); setOpen(true); }}
            onFocus={() => setOpen(true)}
            placeholder="Search"
            className="flex-1 bg-transparent text-sm text-gray-700 placeholder-gray-400 outline-none"
            aria-label="Search products"
            autoComplete="off"
          />
          {query ? (
            <button type="button" onClick={() => { setQuery(''); setOpen(false); setSuggestions([]); }} aria-label="Clear search">
              <FiX className="w-4 h-4 text-gray-400" aria-hidden="true" />
            </button>
          ) : (
            <FiSearch className="w-4 h-4 text-gray-400" aria-hidden="true" />
          )}
        </div>
      </form>

      {/* Suggestions dropdown */}
      {open && query.trim() && (
        <div className="absolute left-4 right-4 top-full mt-1 bg-white rounded-xl shadow-lg border border-gray-100 z-50 overflow-hidden">
          {isLoading && (
            <div className="flex items-center justify-center gap-2 px-4 py-3 text-xs text-gray-400">
              <div className="w-3.5 h-3.5 border-2 border-green-600 border-t-transparent rounded-full animate-spin" />
              Searching…
            </div>
          )}
          {!isLoading && suggestions.length > 0 && suggestions.map(p => (
            <button
              key={p.id}
              onClick={() => {
                setOpen(false);
                setQuery('');
                setSuggestions([]);
                // Use real API slug — never derive from name (fixes 404 bug)
                router.push(`/${p.slug}`);
              }}
              className="flex items-center gap-3 w-full px-4 py-2.5 hover:bg-gray-50 text-left"
            >
              <div className="relative w-8 h-8 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                {p.image ? (
                  <Image src={p.image} alt={p.name} fill className="object-contain" sizes="32px" />
                ) : (
                  <div className="w-full h-full bg-gray-200" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-gray-900 truncate">{p.name}</p>
                {p.category && <p className="text-[10px] text-gray-400">{p.category}</p>}
              </div>
              <div className="flex-shrink-0 text-right">
                {p.salePrice ? (
                  <>
                    <p className="text-xs font-semibold text-green-700">PKR {p.salePrice.toLocaleString()}</p>
                    <p className="text-[10px] text-gray-400 line-through">PKR {p.price.toLocaleString()}</p>
                  </>
                ) : (
                  <span className="text-xs font-semibold text-green-700">PKR {p.price.toLocaleString()}</span>
                )}
              </div>
            </button>
          ))}
          {!isLoading && suggestions.length === 0 && (
            <div className="px-4 py-3 text-xs text-gray-400 text-center">No products found</div>
          )}
          {/* View all results link */}
          {!isLoading && (
            <button
              onClick={() => handleSearch(query)}
              className="w-full px-4 py-2.5 text-xs font-semibold text-green-700 hover:bg-green-50 text-center border-t border-gray-100"
            >
              See all results for &ldquo;{query}&rdquo;
            </button>
          )}
        </div>
      )}
    </div>
  );
}

// ── Main header ───────────────────────────────────────────────────────────────
export default function Header({ isMenuOpen, setIsMenuOpen }: HeaderProps) {
  const { getCartCount } = useCart();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [currentPath, setCurrentPath] = useState('');

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      setMounted(true);
      setCurrentPath(window.location.pathname);
    });
    return () => cancelAnimationFrame(frame);
  }, []);

  const cartCount = mounted ? getCartCount() : 0;

  // While auth is loading or not mounted, show a neutral grey icon.
  // Once resolved: green icon → /profile if authenticated, grey → /login?returnTo=<path>
  const profileHref = mounted && !authLoading && isAuthenticated
    ? '/profile'
    : `/login${currentPath && currentPath !== '/login' ? `?returnTo=${encodeURIComponent(currentPath)}` : ''}`;

  const profileIconColor = mounted && !authLoading && isAuthenticated
    ? 'text-green-700'
    : 'text-gray-600';

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm">

      {/* ── Fixed Bar ── */}
      <div className="bg-green-700 py-1.5 rounded-b-2xl text-center">
        <div className="text-white text-xs font-medium px-8">
          100% Ayurvedic & Herbal Products
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
            <Image src="/images/logo.png" alt="Pansari Inn" fill className="object-contain" priority sizes="112px" fetchPriority="high" />
          </div>
        </Link>

        {/* Icons — right */}
        <div className="flex items-center gap-0.5">
          <Link href={profileHref} className="p-2 text-gray-600 hover:text-green-700 transition-colors" aria-label="Account">
            <RiUserLine className={`w-5 h-5 ${profileIconColor}`} />
          </Link>
          <Link href="/cart" className="relative p-2 text-gray-600 hover:text-green-700 transition-colors" aria-label="Cart">
            <RiShoppingCartLine className="w-5 h-5" />
            {mounted && cartCount > 0 && (
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
