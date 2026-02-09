// app/home/mobile/page.tsx
"use client";

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { allProducts } from '@/app/Desktop/data/products';
import { useCart } from '@/app/context/CartContext';
import { useWishlist } from '@/app/context/WishList';
import ProductCard from '@/app/Mobile/components/ProductCard';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaHeart } from 'react-icons/fa';

export default function MobileHomePage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [activeTab, setActiveTab] = useState('all');
  const tabScrollRef = useRef<HTMLDivElement>(null);
  
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  // Hero Banners
  const banners = [
    {
      id: 1,
      title: 'Premium Ayurvedic',
      subtitle: 'Natural & Organic',
      color: 'from-green-600 to-emerald-500',
      link: '/shop'
    },
    {
      id: 2,
      title: 'Summer Sale',
      subtitle: 'Up to 50% OFF',
      color: 'from-orange-600 to-red-500',
      link: '/offers'
    },
    {
      id: 3,
      title: 'New Collection',
      subtitle: 'Fresh Arrivals',
      color: 'from-purple-600 to-pink-500',
      link: '/new-arrivals'
    },
  ];

  // Menu Tabs (Simple & Clean)
  const menuTabs = [
    { id: 'all', label: 'All' },
    { id: 'new', label: 'New In' },
    { id: 'bestsellers', label: 'Best Sellers' },
    { id: 'Oils & Ghee', label: 'Oils' },
    { id: 'Herbs & Spices', label: 'Herbs' },
    { id: 'Honey & Sweeteners', label: 'Honey' },
    { id: 'Beauty & Skincare', label: 'Beauty' },
    { id: 'Tea & Beverages', label: 'Tea' },
  ];

  // Filter products based on active tab
  const getFilteredProducts = () => {
    switch(activeTab) {
      case 'all':
        return allProducts.slice(0, 12);
      case 'new':
        return allProducts.filter(p => p.isNew).slice(0, 12);
      case 'bestsellers':
        return allProducts.filter(p => p.isBestSeller).slice(0, 12);
      default:
        return allProducts.filter(p => p.category === activeTab).slice(0, 12);
    }
  };

  const filteredProducts = getFilteredProducts();

  // Convert products to ProductCard format
  const productCards = filteredProducts.map(product => ({
    id: product.id.toString(),
    name: product.nameEn,
    image: product.img || "/images/default-product.png",
    features: [
      product.category || "General",
      product.rating ? `${product.rating}★` : "New",
      product.sale || "Premium"
    ].filter(Boolean),
    price: product.price,
    currency: "PKR",
    productData: product // Store full product data for cart
  }));

  // Handle Add to Cart
  const handleAddToCart = (productId: string) => {
    const product = allProducts.find(p => p.id.toString() === productId);
    
    if (!product) {
      toast.error('Product not found!', {
        position: "top-center",
        autoClose: 2000,
      });
      return;
    }

    // Add to cart
    addToCart({
      id: product.id,
      img: product.img,
      nameEn: product.nameEn,
      nameUr: product.nameUr || product.nameEn,
      price: product.price,
      oldPrice: product.oldPrice,
      category: product.category,
      size: 'Standard',
    });

    // Show success toast
    toast.success(
      <div className="flex items-center gap-2">
        <span className="text-2xl">✓</span>
        <div>
          <div className="font-semibold">Added to cart!</div>
          <div className="text-xs opacity-90">{product.nameEn}</div>
        </div>
      </div>,
      {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: true,
        closeButton: false,
        style: {
          background: '#15803d',
          color: 'white',
        }
      }
    );
  };

  // Auto-slide banners
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [banners.length]);

  // Scroll to active tab
  useEffect(() => {
    if (tabScrollRef.current) {
      const activeElement = tabScrollRef.current.querySelector(`[data-tab="${activeTab}"]`);
      activeElement?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
  }, [activeTab]);

  return (
    <>
      {/* Toast Container */}
      <ToastContainer />
      
      <div className="pb-6">
        {/* Hero Banner Slider */}
        <div className="relative h-48 overflow-hidden bg-gray-100 rounded-2xl mx-4 mt-4">
          {banners.map((banner, index) => (
            <Link
              key={banner.id}
              href={banner.link}
              className={`absolute inset-0 transition-opacity duration-700 ${
                index === currentSlide ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <div className={`w-full h-full bg-gradient-to-br ${banner.color} flex flex-col items-center justify-center text-white px-6`}>
                <h2 className="text-2xl font-bold mb-1">{banner.title}</h2>
                <p className="text-sm opacity-90">{banner.subtitle}</p>
              </div>
            </Link>
          ))}
          
          {/* Dots */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
            {banners.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`h-1.5 rounded-full transition-all ${
                  idx === currentSlide ? 'w-6 bg-white' : 'w-1.5 bg-white/60'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-4 gap-3 px-4 mt-4">
          <Link href="/shop" className="flex flex-col items-center gap-2 p-3 bg-gray-50 rounded-xl active:scale-95 transition">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-xl">
              🛍️
            </div>
            <span className="text-xs font-medium text-gray-700">Shop All</span>
          </Link>
          <Link href="/offers" className="flex flex-col items-center gap-2 p-3 bg-gray-50 rounded-xl active:scale-95 transition">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center text-xl">
              🏷️
            </div>
            <span className="text-xs font-medium text-gray-700">Offers</span>
          </Link>
          <Link href="/new-arrivals" className="flex flex-col items-center gap-2 p-3 bg-gray-50 rounded-xl active:scale-95 transition">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center text-xl">
              ✨
            </div>
            <span className="text-xs font-medium text-gray-700">New</span>
          </Link>
          <Link href="/category" className="flex flex-col items-center gap-2 p-3 bg-gray-50 rounded-xl active:scale-95 transition">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-xl">
              📦
            </div>
            <span className="text-xs font-medium text-gray-700">Categories</span>
          </Link>
        </div>

        {/* Simple Menu Tabs */}
        <div className="sticky top-16 z-20 bg-white border-y border-gray-200 mt-4">
          <div 
            ref={tabScrollRef}
            className="flex gap-2 overflow-x-auto px-4 py-3 scrollbar-hide"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {menuTabs.map((tab) => (
              <button
                key={tab.id}
                data-tab={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-full whitespace-nowrap text-sm font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-green-700 text-white'
                    : 'bg-gray-100 text-gray-700 active:scale-95'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        <div className="px-4 pt-4">
          {/* Section Header */}
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900">
              {menuTabs.find(t => t.id === activeTab)?.label || 'All'} Products
            </h2>
            <Link href="/shop" className="text-sm text-green-700 font-medium">
              View All →
            </Link>
          </div>

          {/* Products */}
          {productCards.length > 0 ? (
            <div className="grid grid-cols-2 gap-3">
              {productCards.map((product) => (
                <ProductCard
                  key={product.id}
                  {...product}
                  onAddToCart={handleAddToCart}
                  className="shadow-sm hover:shadow-md transition-shadow"
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="text-5xl mb-3">🔍</div>
              <p className="text-gray-500 text-sm">No products found</p>
            </div>
          )}

          {/* Load More */}
          {productCards.length > 0 && (
            <div className="text-center mt-6">
              <Link
                href={`/shop${activeTab !== 'all' ? `?category=${activeTab}` : ''}`}
                className="inline-block px-8 py-3 bg-green-700 text-white font-medium rounded-lg hover:bg-green-600 transition-colors active:scale-95"
              >
                View All Products
              </Link>
            </div>
          )}
        </div>

        {/* Featured Categories */}
        <div className="px-4 mt-8">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Shop by Category</h2>
          <div className="grid grid-cols-3 gap-3">
            {[
              { name: 'Oils & Ghee', icon: '🛢️', color: 'from-amber-400 to-orange-500' },
              { name: 'Herbs & Spices', icon: '🌿', color: 'from-green-400 to-emerald-500' },
              { name: 'Honey', icon: '🍯', color: 'from-yellow-400 to-amber-500' },
              { name: 'Beauty', icon: '💄', color: 'from-pink-400 to-rose-500' },
              { name: 'Tea', icon: '🍵', color: 'from-teal-400 to-cyan-500' },
              { name: 'Supplements', icon: '💊', color: 'from-blue-400 to-indigo-500' },
            ].map((category) => (
              <Link
                key={category.name}
                href={`/shop?category=${category.name}`}
                className="relative aspect-square rounded-xl overflow-hidden group active:scale-95 transition-transform"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-90 group-active:opacity-100 transition-opacity`} />
                <div className="relative h-full flex flex-col items-center justify-center text-white p-3">
                  <span className="text-3xl mb-2">{category.icon}</span>
                  <span className="text-xs font-medium text-center">{category.name}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Trust Badges */}
        <div className="px-4 mt-8">
          <div className="bg-gray-50 rounded-xl p-4">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl mb-1">✓</div>
                <p className="text-xs font-medium text-gray-700">100% Natural</p>
              </div>
              <div>
                <div className="text-2xl mb-1">🚚</div>
                <p className="text-xs font-medium text-gray-700">Free Shipping</p>
              </div>
              <div>
                <div className="text-2xl mb-1">⭐</div>
                <p className="text-xs font-medium text-gray-700">Top Rated</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CSS for hiding scrollbar */}
      <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </>
  );
}