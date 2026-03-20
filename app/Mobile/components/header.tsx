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
}

export default function Header({ 
  isMenuOpen, 
  setIsMenuOpen
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
    <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-100">
      {/* First Row: Menu Button, Logo, Icons */}
      <div className="flex items-center justify-between px-4 py-2.5">
        {/* Left: Menu button */}
        <MenuButton 
          onClick={() => setIsMenuOpen(!isMenuOpen)} 
          isOpen={isMenuOpen}
        />

        {/* Center: Logo */}
        <Link href="/" className="flex-shrink-0" aria-label="Home">
          <div className="relative w-28 h-7">
            <Image
              src="/images/logo.png"
              alt="Pansariin.pk"
              fill
              className="object-contain"
              priority
              sizes="112px"
            />
          </div>
        </Link>

        {/* Right: Icons */}
        <IconsSection variant="outline" />
      </div>

      {/* Second Row: Search Bar */}
      <div className="px-4 pb-2.5">
        <SearchBar 
          placeholder="Search products..."
          mockProducts={mockProducts}
        />
      </div>
    </header>
  );
}