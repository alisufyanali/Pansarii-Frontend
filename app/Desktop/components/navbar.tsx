// app/Desktop/components/navbar.tsx
"use client";

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
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

  const isActive = (path: string) => {
    if (path === '/' && pathname === '/') return true;
    if (path !== '/' && pathname.startsWith(path)) return true;
    return false;
  };

  const cartCount = getCartCount();
  const cartTotal = getCartTotal();

  // Open cart sidebar function
  const openCartSidebar = () => {
    setIsCartSidebarOpen(true);
  };

  // Close cart sidebar function
  const closeCartSidebar = () => {
    setIsCartSidebarOpen(false);
  };

  // Close category sidebar
  const closeCategorySidebar = () => {
    setIsCategorySidebarOpen(false);
    setCategorySearch('');
  };

  // Handle category selection - updates URL for shop page
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
  
  // Calculate total products
  const totalProducts = categories.reduce((sum, cat) => sum + cat.count, 0);

  return (
    <>
     <header className="w-full fixed top-0 left-0 z-40">
        {/* Top Header - Green Background */}
        <div className="bg-green-700 text-white py-2">
          <div className="mx-[4%]">
            <div className="flex items-center justify-between">
              {/* Left - Social Icons */}
              <div className="flex items-center gap-4">
                <a 
                  href="https://facebook.com/pansariin.pk" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="hover:opacity-80 transition hover:scale-110"
                  aria-label="Facebook"
                >
                  <FaFacebookF className="w-4 h-4" />
                </a>
                <a 
                  href="https://instagram.com/pansariin.pk" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="hover:opacity-80 transition hover:scale-110"
                  aria-label="Instagram"
                >
                  <FaInstagram className="w-4 h-4" />
                </a>
                <a 
                  href="https://twitter.com/pansariin" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="hover:opacity-80 transition hover:scale-110"
                  aria-label="Twitter"
                >
                  <FaTwitter className="w-4 h-4" />
                </a>
                <a 
                  href="https://youtube.com/pansariin" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="hover:opacity-80 transition hover:scale-110"
                  aria-label="YouTube"
                >
                  <FaYoutube className="w-4 h-4" />
                </a>
              </div>

              {/* Center - Text */}
              <div className="hidden md:block">
                <p className="text-sm font-semibold flex items-center gap-2">
                  <FaLeaf className="w-4 h-4" />
                  100% Ayurvedic & Herbal Products
                </p>
              </div>

              {/* Right - WhatsApp */}
              <a 
                href="https://wa.me/923001234567" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:opacity-80 transition group"
                aria-label="WhatsApp"
              >
                <FaWhatsapp className="w-5 h-5" />
                <span className="text-sm font-medium hidden sm:block">+92 300 1234567</span>
              </a>
            </div>
          </div>
        </div>

        {/* Main Navbar */}
        <div className="bg-white">
          {/* Upper Navbar */}
          <div className="mx-[4%] py-4">
            <div className="flex items-center justify-between gap-6">
              {/* Logo */}
              <Link href="/" className="flex-shrink-0" aria-label="Pansariin.pk Home">
                <div className="relative w-48 h-12">
                  <Image
                    src="/images/logo.png"
                    alt="Pansariin.pk Logo"
                    fill
                    className="object-contain"
                    priority
                    sizes="192px"
                  />
                </div>
              </Link>

              {/* Desktop Search Bar - No onSearch prop needed */}
              <div className="flex-1 max-w-2xl hidden lg:block">
                <SearchBarWrapper 
                  placeholder="Search for products..."
                  variant="desktop"
                  mockProducts={mockProducts}
                  className="w-full"
                />
              </div>

              {/* Right - Cart, Sign In, Track Order */}
              <div className="flex items-center gap-4">
                {/* Track Order */}
                <Link 
                  href="/track-order" 
                  className="hidden xl:flex items-center gap-2 px-4 py-2 rounded-full hover:bg-gray-100 transition group"
                  aria-label="Track Order"
                >
                  <FaTruck className="w-5 h-5" />
                  <span className="text-sm font-medium text-gray-700 group-hover:text-green-700 transition">Track Order</span>
                </Link>

                {/* Sign In */}
                <Link 
                  href="/login" 
                  className="flex items-center gap-2 px-4 py-2 rounded-full hover:bg-gray-100 transition group"
                  aria-label="Sign In"
                >
                  <FaUser className="w-5 h-5" />
                  <span className="hidden lg:block text-sm font-medium text-gray-700 group-hover:text-green-700 transition">Sign In</span>
                </Link>

                {/* Cart Button - Opens Sidebar */}
                <button
                  onClick={openCartSidebar}
                  className="flex items-center gap-2 px-4 py-2 rounded-full hover:bg-gray-100 transition group relative"
                  aria-label="Shopping Cart"
                >
                  <div className="relative">
                    <FaShoppingCart className="w-5 h-5" />
                    {cartCount > 0 && (
                      <span 
                        className="absolute -top-2 -right-2 w-5 h-5 bg-green-700 text-white text-xs rounded-full flex items-center justify-center font-bold"
                        aria-label={`${cartCount} items in cart`}
                      >
                        {cartCount > 9 ? '9+' : cartCount}
                      </span>
                    )}
                  </div>
                  <div className="hidden lg:flex flex-col items-start">
                    <span className="text-sm font-medium text-gray-700 group-hover:text-green-700 transition">Cart</span>
                    {cartCount > 0 && (
                      <span className="text-xs text-gray-500">
                        PKR {cartTotal.toLocaleString()}
                      </span>
                    )}
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* Lower Navbar */}
          <div>
            <div className="mx-[4%] py-3">
              <div className="flex items-center justify-between">
                {/* Left - Categories Button (Opens Sidebar) */}
                <button
                  onClick={() => setIsCategorySidebarOpen(true)}
                  className="flex items-center gap-3 px-6 py-2.5 bg-green-700 text-white rounded-full hover:bg-green-600 transition font-medium shadow-sm"
                  aria-label="Browse Categories"
                >
                  <FaBars className="w-4 h-4" />
                  <span>All Categories</span>
                  <FaChevronDown className="w-3 h-3" />
                </button>

                {/* Center - Navigation Links */}
                <nav className="hidden lg:flex items-center gap-8" aria-label="Main navigation">
                  {navLinks.map((link) => (
                    <Link 
                      key={link.href}
                      href={link.href} 
                      className={`text-sm font-medium transition ${
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

                {/* Right - Become Affiliate Button */}
                <Link 
                  href="/affiliate" 
                  className="hidden lg:flex items-center gap-2 px-6 py-2.5 bg-amber-500 text-white rounded-full hover:bg-amber-600 transition font-semibold text-sm shadow-sm hover:shadow-md group"
                  aria-label="Become an Affiliate"
                >
                  <FaGift className="w-4 h-4" />
                  Become an Affiliate
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Search Bar - No onSearch prop needed */}
        <div className="lg:hidden bg-white px-4 py-3">
          <SearchBarWrapper 
            placeholder="Search for products..."
            variant="mobile"
            mockProducts={mockProducts}
            className="w-full"
          />
        </div>

        {/* Simple Mobile Navigation */}
        <div className="lg:hidden bg-white">
          <div className="mx-[4%] py-2">
            <nav className="flex items-center justify-around" aria-label="Mobile navigation">
              {navLinks.slice(0, 4).map((link) => (
                <Link 
                  key={link.href}
                  href={link.href} 
                  className={`text-xs font-medium transition px-2 py-1 ${
                    isActive(link.href) 
                      ? 'text-green-700' 
                      : 'text-gray-700 hover:text-green-700'
                  }`}
                  aria-current={isActive(link.href) ? 'page' : undefined}
                >
                  {link.name}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </header>

      {/* Simple Category Sidebar - Green Theme Only */}
      {isCategorySidebarOpen && (
        <div className="fixed inset-0 z-50">
          {/* Dark Overlay */}
          <div 
            className="absolute inset-0 bg-black/50"
            onClick={closeCategorySidebar}
          />
          
          {/* Sidebar */}
          <div className="absolute left-0 top-0 h-full w-80 bg-white shadow-xl transform transition-transform duration-300 overflow-y-auto">
            {/* Header - Green */}
            <div className="bg-green-700 text-white p-5 sticky top-0 z-10">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold flex items-center gap-3">
                  <FaLeaf className="w-5 h-5" />
                  Categories
                </h2>
                <button 
                  onClick={closeCategorySidebar}
                  className="p-2 hover:bg-green-600 rounded-full transition"
                  aria-label="Close"
                >
                  <FaTimes className="w-4 h-4" />
                </button>
              </div>
              
              {/* Search Box */}
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

              {/* All Categories Button */}
              <button
                onClick={() => handleCategorySelect('all')}
                className={`mt-3 w-full text-left px-4 py-2.5 rounded-lg transition flex items-center justify-between ${
                  !currentCategory
                    ? 'bg-white text-green-700 font-semibold'
                    : 'text-white hover:bg-green-600'
                }`}
              >
                <span>All Categories</span>
                <span className="text-sm opacity-80">({totalProducts})</span>
              </button>
            </div>

            {/* Categories List */}
            <div className="p-4">
              {filteredCategories.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500 mb-3">No categories found</p>
                  <button
                    onClick={() => setCategorySearch('')}
                    className="text-green-700 hover:text-green-800 font-medium text-sm"
                  >
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
                          isSelected 
                            ? 'bg-green-100 text-green-800' 
                            : 'hover:bg-green-50 text-gray-700'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            isSelected ? 'bg-green-200' : 'bg-green-100 group-hover:bg-green-200'
                          }`}>
                            <FaLeaf className={`w-4 h-4 ${
                              isSelected ? 'text-green-700' : 'text-green-600'
                            }`} />
                          </div>
                          <span className="font-medium">{category.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`text-sm px-2 py-1 rounded-full ${
                            isSelected 
                              ? 'bg-green-200 text-green-800' 
                              : 'bg-gray-100 text-gray-600 group-hover:bg-green-100'
                          }`}>
                            {category.count}
                          </span>
                          <FaChevronRight className={`w-3 h-3 ${
                            isSelected ? 'text-green-700' : 'text-gray-400 group-hover:text-green-600'
                          }`} />
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Footer with Total */}
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

      {/* Cart Sidebar - RIGHT SIDE */}
      <CartSidebar 
        isOpen={isCartSidebarOpen}
        onClose={closeCartSidebar}
      />
    </>
  );
}