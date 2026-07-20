"use client";

import { useState, useEffect } from 'react';
import SafeImage from '@/components/SafeImage';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  RiHeartFill,
  RiShoppingBagLine,
  RiDeleteBinLine,
  RiArrowLeftLine,
  RiShoppingCartLine,
  RiArrowRightLine,
} from 'react-icons/ri';
import { FaStar } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { useCart } from '@/context/CartContext';
import { useWishlist, type WishlistItem } from '@/context/WishList';
import { allProducts } from '../../data/products';

// ── Types ─────────────────────────────────────────────────────────────────────

interface SuggestedProduct {
  id: string | number;
  nameEn: string;
  img: string;
  price: number;
  oldPrice?: number | null;
  rating: number;
  category?: string;
}

// ── Skeleton card ─────────────────────────────────────────────────────────────

function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden animate-pulse">
      <div className="aspect-square bg-gray-200" />
      <div className="p-3 space-y-2">
        <div className="h-3 bg-gray-200 rounded w-3/4" />
        <div className="h-3 bg-gray-200 rounded w-1/2" />
        <div className="h-4 bg-gray-200 rounded w-1/3" />
        <div className="h-8 bg-gray-200 rounded-xl mt-2" />
      </div>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────

export default function WishlistPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [suggested, setSuggested] = useState<SuggestedProduct[]>([]);

  const { addToCart } = useCart();
  const {
    wishlistItems,
    removeFromWishlist,
    isInWishlist,
    toggleWishlist,
    getWishlistCount,
    clearWishlist,
    isWishlistLoading,
  } = useWishlist();

  const count = getWishlistCount();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Build suggestions whenever wishlist changes
  useEffect(() => {
    if (!mounted) return;
    const cats = Array.from(new Set(wishlistItems.map((i) => i.category)));
    const pool =
      wishlistItems.length > 0
        ? allProducts.filter(
            (p) =>
              cats.includes(p.category) &&
              !wishlistItems.some((w) => String(w.id) === String(p.id))
          )
        : allProducts.filter((p) => p.isBestSeller);

    setSuggested(
      pool.slice(0, 4).map((p) => ({
        id: p.id,
        nameEn: p.nameEn,
        img: p.img,
        price: p.price,
        oldPrice: p.oldPrice,
        rating: p.rating,
        category: p.category,
      }))
    );
  }, [wishlistItems, mounted]);

  const handleAddToCart = async (item: WishlistItem) => {
    if (!item.variantId) {
      // No variant stored — send user to the product page to select one
      toast.info('Please select a size/variant on the product page first.');
      router.push(item.slug ? `/products/${item.slug}` : '/shop');
      return;
    }
    try {
      await addToCart({
        id: item.id,
        img: item.img,
        nameEn: item.nameEn,
        nameUr: item.nameUr ?? item.nameEn,
        price: item.price,
        variantId: item.variantId,
        size: item.variantName ?? String(item.variantId),
        category: item.category ?? 'Wishlist',
      });
      await removeFromWishlist(item.id);
    } catch {
      // addToCart already shows a toast on error; no double-toast needed
    }
  };

  // ── Loading skeleton ──────────────────────────────────────────────────────

  if (!mounted || isWishlistLoading) {
    return (
      <div className="min-h-screen bg-gray-50 pb-28 font-poppins">
        <div className="px-4 pt-5 pb-3 flex items-center gap-3">
          <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse" />
          <div className="h-5 w-32 bg-gray-200 rounded animate-pulse" />
        </div>
        <div className="px-4 grid grid-cols-2 gap-3">
          {[...Array(4)].map((_, i) => <SkeletonCard key={i} />)}
        </div>
      </div>
    );
  }

  // ── Empty state ───────────────────────────────────────────────────────────

  if (count === 0) {
    return (
      <div className="min-h-screen bg-gray-50 pb-28 font-poppins flex flex-col">
        {/* Header */}
        <div className="bg-white px-4 pt-5 pb-4 flex items-center gap-3 border-b border-gray-100">
          <button
            onClick={() => router.back()}
            className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center"
            aria-label="Go back"
          >
            <RiArrowLeftLine className="w-4 h-4 text-gray-700" />
          </button>
          <h1 className="text-base font-bold text-gray-900">Your Wishlist</h1>
        </div>

        {/* Empty illustration */}
        <div className="flex-1 flex flex-col items-center justify-center px-8 text-center gap-4">
          <div className="w-20 h-20 rounded-full bg-red-50 flex items-center justify-center">
            <RiHeartFill className="w-10 h-10 text-red-300" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900 mb-1">No saved items yet</h2>
            <p className="text-sm text-gray-500">Tap the heart icon on any product to save it here.</p>
          </div>
          <Link
            href="/shop"
            className="mt-2 px-6 py-3 bg-green-600 text-white text-sm font-semibold rounded-2xl"
          >
            Browse Products
          </Link>
        </div>

        {/* Suggestions */}
        {suggested.length > 0 && (
          <div className="px-4 pb-6">
            <div className="bg-gray-900 rounded-2xl p-4 mb-4">
              <h3 className="text-white font-bold text-sm mb-0.5">Based on your favorites</h3>
              <p className="text-gray-400 text-xs mb-3">Get up to 10% off on matching accessories</p>
              <Link
                href="/shop"
                className="inline-block bg-green-500 text-white text-xs font-semibold px-4 py-2 rounded-xl"
              >
                View Accessories
              </Link>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ── Filled wishlist ───────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-gray-50 pb-28 font-poppins">

      {/* ── Header ── */}
      <div className="bg-white px-4 pt-5 pb-4 flex items-center justify-between border-b border-gray-100">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center"
            aria-label="Go back"
          >
            <RiArrowLeftLine className="w-4 h-4 text-gray-700" />
          </button>
          <div>
            <h1 className="text-base font-bold text-gray-900">Your Wishlist</h1>
            <p className="text-xs text-gray-400">{count} item{count !== 1 ? 's' : ''} saved for later</p>
          </div>
        </div>
        {/* Cart shortcut */}
        <Link href="/cart" className="p-2 text-gray-600" aria-label="Cart">
          <RiShoppingCartLine className="w-5 h-5" />
        </Link>
      </div>

      {/* ── Product grid ── */}
      <div className="px-4 pt-4 grid grid-cols-2 gap-3">
        {wishlistItems.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100"
          >
            {/* Image */}
            <div className="relative aspect-square bg-gray-50">
              <SafeImage
                src={item.img}
                alt={item.nameEn}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 50vw, 200px"
              />
              {/* Heart remove button */}
              <button
                onClick={() => removeFromWishlist(item.id)}
                className="absolute top-2 right-2 w-7 h-7 bg-white rounded-full shadow flex items-center justify-center"
                aria-label={`Remove ${item.nameEn}`}
              >
                <RiHeartFill className="w-4 h-4 text-red-500" />
              </button>
              {/* Out of stock overlay */}
              {item.inStock === false && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <span className="text-white text-[10px] font-bold bg-gray-800 px-2 py-1 rounded-lg">
                    Out of Stock
                  </span>
                </div>
              )}
            </div>

            {/* Details */}
            <div className="p-3">
              {/* Category + rating */}
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] text-gray-400 uppercase tracking-wide truncate max-w-[70%]">
                  {item.category ?? 'Product'}
                </span>
                <div className="flex items-center gap-0.5">
                  <FaStar className="w-2.5 h-2.5 text-yellow-400" />
                  <span className="text-[10px] text-gray-500">{item.rating ?? '4.5'}</span>
                </div>
              </div>

              {/* Name */}
              <p className="text-xs font-semibold text-gray-900 line-clamp-2 mb-1.5 leading-snug">
                {item.nameEn}
              </p>

              {/* Price */}
              <div className="flex items-baseline gap-1.5 mb-3">
                <span className="text-sm font-bold text-green-700">
                  PKR {item.price.toLocaleString()}
                </span>
                {item.oldPrice && (
                  <span className="text-[10px] text-gray-400 line-through">
                    PKR {item.oldPrice.toLocaleString()}
                  </span>
                )}
              </div>

              {/* Add to Cart */}
              {item.variantId ? (
                <button
                  onClick={() => handleAddToCart(item)}
                  disabled={item.inStock === false}
                  className="w-full py-2 bg-green-600 hover:bg-green-500 active:bg-green-700 text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <RiShoppingBagLine className="w-3.5 h-3.5" />
                  Add to Cart
                </button>
              ) : (
                <Link
                  href={item.slug ? `/products/${item.slug}` : '/shop'}
                  className="w-full py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-colors"
                >
                  Select Variant
                  <RiArrowRightLine className="w-3.5 h-3.5" />
                </Link>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* ── Clear wishlist ── */}
      <div className="px-4 mt-4">
        <button
          onClick={clearWishlist}
          className="w-full py-3 border border-red-200 text-red-500 text-sm font-medium rounded-2xl flex items-center justify-center gap-2 bg-white"
        >
          <RiDeleteBinLine className="w-4 h-4" />
          Clear Wishlist
        </button>
      </div>

      {/* ── "Based on your favorites" promo banner ── */}
      {suggested.length > 0 && (
        <div className="px-4 mt-5">
          <div className="bg-gray-900 rounded-2xl p-4 mb-4">
            <h3 className="text-white font-bold text-sm mb-0.5">Based on your favorites</h3>
            <p className="text-gray-400 text-xs mb-3">
              Get up to 10% off on matching accessories and related products
            </p>
            <Link
              href="/shop"
              className="inline-block bg-green-500 text-white text-xs font-semibold px-4 py-2 rounded-xl"
            >
              View Accessories
            </Link>
          </div>

          {/* Suggested products — 2-col grid */}
          <div className="grid grid-cols-2 gap-3">
            {suggested.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100"
              >
                <div className="relative aspect-square bg-gray-50">
                  <SafeImage
                    src={product.img}
                    alt={product.nameEn}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 50vw, 200px"
                  />
                  <button
                    onClick={() =>
                      toggleWishlist({
                        id: product.id,
                        nameEn: product.nameEn,
                        nameUr: product.nameEn,
                        price: product.price,
                        img: product.img,
                        oldPrice: product.oldPrice ?? undefined,
                        category: product.category,
                      })
                    }
                    className="absolute top-2 right-2 w-7 h-7 bg-white rounded-full shadow flex items-center justify-center"
                    aria-label="Toggle wishlist"
                  >
                    <RiHeartFill
                      className={`w-4 h-4 ${
                        isInWishlist(product.id) ? 'text-red-500' : 'text-gray-300'
                      }`}
                    />
                  </button>
                </div>
                <div className="p-3">
                  <p className="text-xs font-semibold text-gray-900 line-clamp-2 mb-1.5 leading-snug">
                    {product.nameEn}
                  </p>
                  <p className="text-sm font-bold text-green-700 mb-2">
                    PKR {product.price.toLocaleString()}
                  </p>
                  <button
                    onClick={() =>
                      addToCart({
                        id: product.id,
                        img: product.img,
                        nameEn: product.nameEn,
                        nameUr: product.nameEn,
                        price: product.price,
                        size: 'default',
                        category: product.category ?? 'Suggested',
                      })
                    }
                    className="w-full py-2 bg-green-600 text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5"
                  >
                    <RiShoppingBagLine className="w-3.5 h-3.5" />
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
