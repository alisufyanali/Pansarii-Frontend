// app/Mobile/components/Header.tsx
"use client";

import Link from 'next/link';
import Image from 'next/image';
import MenuButton from './header/MenuButton';
import IconsSection from './header/IconSection';
import SearchBar from './header/SearchBar';
import { ProductSuggestion } from './header/SearchBar';
import { allProducts } from '@/app/Desktop/data/products';

interface HeaderProps {
  isMenuOpen: boolean;
  setIsMenuOpen: (isOpen: boolean) => void;
  isSearchOpen: boolean;
  setIsSearchOpen: (isOpen: boolean) => void;
}

export default function Header({ 
  isMenuOpen, 
  setIsMenuOpen, 
  isSearchOpen, 
  setIsSearchOpen 
}: HeaderProps) {
  // Format products for search suggestions
  const mockProducts: ProductSuggestion[] = allProducts.map(product => ({
    id: product.id.toString(),
    name: product.nameEn,
    slug: product.nameEn.toLowerCase().replace(/\s+/g, '-'),
    price: product.price,
    salePrice: product.oldPrice || undefined,
    image: product.img,
    category: product.category,
    rating: product.rating,
    isBestSeller: product.isBestSeller || false,
  }));

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm">
      {/* First Row: Menu Button, Logo, Icons */}
      <div className="flex items-center justify-between px-4 py-3">
        {/* Left: Three lines menu button */}
        <MenuButton 
          onClick={() => setIsMenuOpen(!isMenuOpen)} 
          isOpen={isMenuOpen}
        />

        {/* Center: Logo */}
        <Link href="/" className="flex-shrink-0 mx-2" aria-label="Home">
          <div className="relative w-32 h-8">
            <Image
              src="/images/logo.png"
              alt="Logo"
              fill
              className="object-contain"
              priority
              sizes="128px"
            />
          </div>
        </Link>

        {/* Right: Icons (Cart, Track Order, Profile) */}
        <IconsSection variant="outline" />
      </div>

      {/* Second Row: Search Bar (Always visible or conditional) */}
      <div className="px-4 pb-3 border-b border-gray-100">
        <SearchBar 
          placeholder="Search for products, brands, categories..."
          mockProducts={mockProducts}
          isOpen={isSearchOpen}
          onSearchOpen={setIsSearchOpen}
        />
      </div>
    </header>
  );
}