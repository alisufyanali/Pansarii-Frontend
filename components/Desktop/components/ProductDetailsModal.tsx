"use client";

import Image from 'next/image';
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FaStar, FaCheckCircle, FaShoppingCart, FaTimes, FaMinus, FaPlus } from "react-icons/fa";
import { AiOutlineShopping } from "react-icons/ai";
import { useCart } from "@/context/CartContext";
import { toast } from 'react-toastify';
import type { Product } from '@/types/product';

export default function ProductDetailsModal({
  product,
  onClose,
}: {
  product: Product;
  onClose: () => void;
}) {
  const [selectedImage, setSelectedImage] = useState(product.img);
  const [quantity, setQuantity] = useState(1);
  const [isMobile, setIsMobile] = useState(false);
  const { addToCart } = useCart();
  const router = useRouter();

  // ── Three-tier variant selection ─────────────────────────────────────────────
  // Tier 1 — Rich: variants have attributes (Weight/Volume/Size/… + optional Form)
  // Tier 2 — Named flat: variants have no attributes but have a non-blank name
  // Tier 3 — Price-only: variants have neither attributes nor names (e.g. Ginger Oil)
  //           → synthesize a label from price + unit for the selector button
  const richVariants = ((product as unknown as {
    variants?: Array<{
      id: number; name: string; price: number; is_default?: boolean;
      attributes?: Record<string, string>; unit?: string; final_price?: number;
    }>;
  })?.variants ?? []);

  // Auto-detect the primary dimension key (Weight, Volume, Size, Qty, …).
  // "Form" is reserved as the secondary key; any OTHER non-empty attribute key
  // is treated as primary — handles any future attribute name the admin uses.
  const primaryKey: string | undefined = (() => {
    for (const v of richVariants) {
      const attrs = v.attributes;
      if (!attrs || Array.isArray(attrs)) continue;   // skip empty [] from API
      const keys = Object.keys(attrs).filter(k => k !== 'Form');
      if (keys.length > 0) return keys[0];
    }
    return undefined;
  })();

  const weightOptions = primaryKey
    ? Array.from(
      new Set(richVariants.map(v => {
        const attrs = v.attributes;
        if (!attrs || Array.isArray(attrs)) return undefined;
        return attrs[primaryKey];
      }).filter(Boolean) as string[])
    ).sort((a, b) => Number(a) - Number(b))
    : [];

  const formOptions = Array.from(
    new Set(richVariants.map(v => {
      const attrs = v.attributes;
      if (!attrs || Array.isArray(attrs)) return undefined;
      return attrs.Form;
    }).filter(Boolean) as string[])
  );

  const variantUnit = richVariants[0]?.unit ?? '';
  const hasRichVariants = weightOptions.length > 0;

  // Tier 2: named flat variants (no attributes, but name is a real string)
  const hasNamedVariants = !hasRichVariants && richVariants.some(v => v.name?.trim());
  // Tier 3: price-only variants (no attributes, no names)
  const hasPriceOnlyVariants = !hasRichVariants && !hasNamedVariants && richVariants.length > 0;

  const [selectedWeight, setSelectedWeight] = useState<string>(weightOptions[0] ?? '');
  const [selectedForm, setSelectedForm] = useState<string>(formOptions[0] ?? '');

  // For tier 2 (named) and tier 3 (price-only) we use a single selected-variant index
  const [selectedVariantIdx, setSelectedVariantIdx] = useState<number>(0);

  // Simple flat-size fallback (legacy / non-rich, non-API products from product.sizes[])
  const availableSizes = !hasRichVariants && !hasNamedVariants && !hasPriceOnlyVariants && product.sizes?.length
    ? product.sizes
    : [];
  const [selectedSize, setSelectedSize] = useState(availableSizes[0] ?? '');

  // Matched variant — used for price and variantId
  const matchedVariant = hasRichVariants
    ? richVariants.find(v => {
      const attrs = v.attributes;
      if (!attrs || Array.isArray(attrs)) return false;
      return primaryKey
        && attrs[primaryKey] === selectedWeight
        && (formOptions.length === 0 || attrs.Form === selectedForm);
    })
    : (hasNamedVariants || hasPriceOnlyVariants)
      ? richVariants[selectedVariantIdx]
      : richVariants.find(v => v.name === selectedSize);

  // final_price is authoritative (includes any admin surcharge)
  const displayedPrice: number =
    matchedVariant?.final_price ??
    matchedVariant?.price ??
    product.price ?? 0;

  // Label for tier 3 buttons: "PKR 300" or "PKR 300 / ml" when unit is present
  const priceOnlyLabel = (v: typeof richVariants[number]) =>
    `PKR ${(v.final_price ?? v.price).toLocaleString()}${variantUnit ? ' / ' + variantUnit : ''}`;

  // Label used in cart payload and toast
  const selectedLabel = hasRichVariants
    ? [
      selectedWeight ? `${selectedWeight}${variantUnit ? ' ' + variantUnit : ''}` : '',
      selectedForm,
    ].filter(Boolean).join(' / ')
    : hasNamedVariants
      ? (matchedVariant?.name ?? '')
      : hasPriceOnlyVariants
        ? priceOnlyLabel(matchedVariant ?? richVariants[0])
        : selectedSize;

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  useEffect(() => {
    const y = window.scrollY;
    document.body.style.cssText = `position:fixed;top:-${y}px;width:100%;overflow:hidden`;
    return () => {
      document.body.style.cssText = '';
      window.scrollTo(0, y);
    };
  }, []);

  useEffect(() => {
    const fn = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', fn);
    return () => window.removeEventListener('keydown', fn);
  }, [onClose]);

  const cartPayload = () => ({
    id: product.id!,
    variantId: matchedVariant?.id
      ?? (product as { variants?: Array<{ id: number }> }).variants?.[0]?.id,
    img: product.img,
    nameEn: product.nameEn,
    nameUr: product.nameUr,
    price: displayedPrice,
    size: selectedLabel,
  });

  const handleAddToCart = async () => {
    if (!product.id) return toast.error('Failed to add item to cart!');
    try {
      for (let i = 0; i < quantity; i++) await addToCart(cartPayload());
      toast.success(`Added ${quantity} × ${product.nameEn} (${selectedLabel}) to cart!`);
    } catch { /* error already toasted by context */ }
  };

  const handleBuyNow = async () => {
    if (!product.id) return toast.error('Failed to add item to cart!');
    try {
      for (let i = 0; i < quantity; i++) await addToCart(cartPayload());
      toast.success('Added to cart! Redirecting…', { autoClose: 1500, pauseOnHover: false });
      onClose();
      router.push('/cart');
    } catch { /* error already toasted by context */ }
  };

  // --- NEW: navigate to product detail page ---
  const goToProductDetail = () => {
    if (product.id) {
      onClose(); // close modal first
      router.push(`/${product.slug}`);
    }
  };

  // ── Mobile bottom-sheet ────────────────────────────────────────────────────
  if (isMobile) {
    return (
      <div className="fixed inset-0 z-[9998] flex flex-col justify-end">
        <div className="absolute inset-0 bg-black/50" onClick={onClose} />

        <div className="relative bg-white rounded-t-2xl shadow-2xl animate-slideUp flex flex-col max-h-[92dvh]">

          <div className="flex justify-center pt-3 pb-1 flex-shrink-0">
            <div className="w-10 h-1 bg-gray-300 rounded-full" />
          </div>

          <button
            onClick={onClose}
            className="absolute top-3 right-4 z-10 w-8 h-8 flex items-center justify-center bg-gray-100 rounded-full hover:bg-gray-200 transition"
            aria-label="Close"
          >
            <FaTimes className="w-3.5 h-3.5 text-gray-600" />
          </button>

          <div className="overflow-y-auto flex-1 px-4 pb-4">

            {/* Mobile: Image now clickable */}
            <button
              onClick={goToProductDetail}
              className="relative w-40 h-40 mx-auto my-3 rounded-xl overflow-hidden bg-gray-50 flex-shrink-0 block"
              aria-label="View product details"
            >
              {product.sale && (
                <span className="absolute top-2 left-2 z-10 px-2 py-0.5 bg-red-500 text-white text-[10px] font-bold rounded-full">
                  {product.sale}
                </span>
              )}
              <Image src={selectedImage} alt={product.nameEn} fill className="object-contain p-3" sizes="160px" />
            </button>

            {product.additionalImages && product.additionalImages.length > 0 && (
              <div className="flex gap-2 justify-center mb-3">
                {[product.img, ...product.additionalImages].slice(0, 5).map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(img)}
                    className={`relative w-10 h-10 rounded-lg overflow-hidden border-2 flex-shrink-0 transition ${selectedImage === img ? 'border-green-600' : 'border-gray-200'
                      }`}
                  >
                    <Image src={img} alt="" fill className="object-cover" sizes="40px" />
                  </button>
                ))}
              </div>
            )}

            <div className="space-y-3">

              <div>
                {/* Mobile: Product name now clickable */}
                <button
                  onClick={goToProductDetail}
                  className="text-base font-bold text-gray-900 leading-snug hover:text-green-700 transition text-left block"
                >
                  {product.nameEn}
                </button>
                <p className="text-sm text-gray-500 mt-0.5">{product.nameUr}</p>
                {product.description && (
                  <p className="text-xs text-green-700 mt-1 line-clamp-2">{product.description}</p>
                )}
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  <FaStar className="w-3.5 h-3.5 text-yellow-400" />
                  <span className="text-sm font-semibold text-gray-900">{product.rating}</span>
                </div>
                <div className="flex items-center gap-1">
                  <FaCheckCircle className="w-3.5 h-3.5 text-green-500" />
                  <span className="text-sm text-gray-500">{product.reviews} Reviews</span>
                </div>
              </div>

              <div className="flex items-baseline gap-2">
                <span className="text-xl font-bold text-gray-900">PKR {displayedPrice.toLocaleString()}</span>
                {product.oldPrice && (
                  <span className="text-sm text-gray-400 line-through">PKR {product.oldPrice.toLocaleString()}</span>
                )}
              </div>

              {/* Variant selector — rich (weight+form+unit), named flat, price-only, or legacy sizes */}
              {hasRichVariants ? (
                <div>
                  {/* Weight buttons with unit suffix */}
                  <div className="flex flex-wrap gap-2 mb-2">
                    {weightOptions.map(w => (
                      <button
                        key={w}
                        onClick={() => {
                          setSelectedWeight(w);
                          const available = richVariants
                            .filter(v => {
                              const attrs = v.attributes;
                              return attrs && !Array.isArray(attrs) && primaryKey && attrs[primaryKey] === w;
                            })
                            .map(v => (v.attributes as Record<string, string>)?.Form)
                            .filter(Boolean) as string[];
                          if (formOptions.length > 0 && !available.includes(selectedForm)) {
                            setSelectedForm(available[0] ?? formOptions[0]);
                          }
                        }}
                        className={`px-3 py-1.5 rounded-lg border text-sm font-medium transition ${selectedWeight === w
                            ? 'bg-green-700 text-white border-green-700'
                            : 'border-gray-300 text-gray-700 hover:border-green-600'
                          }`}
                      >
                        {w}{variantUnit ? ` ${variantUnit}` : ''}
                      </button>
                    ))}
                  </div>
                  {formOptions.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {formOptions.map(f => {
                        const available = richVariants
                          .filter(v => {
                            const attrs = v.attributes;
                            return attrs && !Array.isArray(attrs) && primaryKey && attrs[primaryKey] === selectedWeight;
                          })
                          .map(v => (v.attributes as Record<string, string>)?.Form) as string[];
                        const disabled = !available.includes(f);
                        return (
                          <button
                            key={f}
                            onClick={() => !disabled && setSelectedForm(f)}
                            disabled={disabled}
                            className={`px-3 py-1.5 rounded-lg border text-sm font-medium transition ${selectedForm === f
                                ? 'bg-green-700 text-white border-green-700'
                                : disabled
                                  ? 'border-gray-200 text-gray-300 cursor-not-allowed'
                                  : 'border-gray-300 text-gray-700 hover:border-green-600'
                              }`}
                          >
                            {f}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              ) : (hasNamedVariants || hasPriceOnlyVariants) ? (
                /* Tier 2 + 3: named or price-only variants */
                <div>
                  <p className="text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wide">
                    {variantUnit ? `Size (${variantUnit})` : 'Size'}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {richVariants.map((v, idx) => {
                      const label = hasNamedVariants
                        ? `${v.name}${variantUnit ? ' ' + variantUnit : ''}`
                        : priceOnlyLabel(v);
                      return (
                        <button
                          key={v.id ?? idx}
                          onClick={() => setSelectedVariantIdx(idx)}
                          className={`px-3 py-1.5 rounded-lg border text-sm font-medium transition ${selectedVariantIdx === idx
                              ? 'bg-green-700 text-white border-green-700'
                              : 'border-gray-300 text-gray-700 hover:border-green-600'
                            }`}
                        >
                          {label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ) : availableSizes.length > 0 ? (
                <div>
                  <p className="text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wide">Size</p>
                  <div className="flex flex-wrap gap-2">
                    {availableSizes.map(size => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`px-3 py-1.5 rounded-lg border text-sm font-medium transition ${selectedSize === size
                            ? 'bg-green-700 text-white border-green-700'
                            : 'border-gray-300 text-gray-700 hover:border-green-600'
                          }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              ) : null}

              <div>
                <p className="text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wide">Quantity</p>
                <div className="flex items-center gap-4">
                  <div className="flex items-center border border-gray-300 rounded-xl overflow-hidden">
                    <button
                      onClick={() => setQuantity(q => Math.max(1, q - 1))}
                      className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 transition"
                    >
                      <FaMinus className="w-3 h-3 text-gray-600" />
                    </button>
                    <span className="w-10 text-center font-bold text-base border-x border-gray-300">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(q => q + 1)}
                      className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 transition"
                    >
                      <FaPlus className="w-3 h-3 text-gray-600" />
                    </button>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Total</p>
                    <p className="text-base font-bold text-gray-900">PKR {(displayedPrice * quantity).toLocaleString()}</p>
                  </div>
                </div>
              </div>

            </div>
          </div>

          <div className="flex-shrink-0 px-4 py-3 border-t border-gray-100 bg-white flex gap-3">
            <button
              onClick={handleAddToCart}
              className="flex-1 flex items-center justify-center gap-2 bg-green-700 text-white font-semibold py-3 rounded-xl hover:bg-green-800 transition text-sm"
            >
              <FaShoppingCart className="w-4 h-4" />
              Add to Cart
            </button>
            <button
              onClick={handleBuyNow}
              className="flex-1 flex items-center justify-center gap-2 bg-amber-500 text-white font-semibold py-3 rounded-xl hover:bg-amber-600 transition text-sm"
            >
              <AiOutlineShopping className="w-4 h-4" />
              Buy Now
            </button>
          </div>

        </div>
      </div>
    );
  }

  // ── Desktop centered modal ─────────────────────────────────────────────────
  return (
    <div className="fixed inset-0 z-[9998] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">

        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-20 w-9 h-9 flex items-center justify-center bg-white rounded-full shadow-md hover:bg-gray-100 transition"
          aria-label="Close"
        >
          <FaTimes className="w-4 h-4 text-gray-700" />
        </button>

        <div className="flex h-full overflow-y-auto max-h-[90vh]">

          {/* Left: Desktop image now clickable */}
          <div className="w-2/5 p-6 border-r border-gray-100 flex-shrink-0">
            <button
              onClick={goToProductDetail}
              className="relative aspect-square rounded-xl overflow-hidden bg-gray-50 block w-full"
              aria-label="View product details"
            >
              {product.sale && (
                <span className="absolute top-3 right-3 z-10 px-3 py-1 bg-red-500 text-white rounded-full text-sm font-semibold">
                  {product.sale}
                </span>
              )}
              <Image src={selectedImage} alt={product.nameEn} fill className="object-contain p-4" sizes="(max-width: 768px) 50vw, 33vw" />
            </button>
            {product.additionalImages && product.additionalImages.length > 0 && (
              <div className="flex gap-2 mt-3 overflow-x-auto no-scrollbar">
                {[product.img, ...product.additionalImages].map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(img)}
                    className={`relative flex-shrink-0 w-14 h-14 rounded-lg overflow-hidden border-2 transition ${selectedImage === img ? 'border-green-600' : 'border-gray-200'
                      }`}
                  >
                    <Image src={img} alt="" fill className="object-cover" sizes="56px" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Desktop name now clickable */}
          <div className="w-3/5 p-6 flex flex-col">
            <div className="flex-1 space-y-4 overflow-y-auto">

              <div>
                <button
                  onClick={goToProductDetail}
                  className="text-xl font-bold text-gray-900 leading-tight hover:text-green-700 transition text-left"
                >
                  {product.nameEn}
                </button>
                <p className="text-gray-500 text-sm mt-0.5">{product.nameUr}</p>
                {product.description && (
                  <p className="text-green-700 text-sm mt-1">{product.description}</p>
                )}
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <FaStar className="w-4 h-4 text-yellow-400" />
                  <span className="font-semibold text-gray-900 text-sm">{product.rating}</span>
                </div>
                <div className="flex items-center gap-1">
                  <FaCheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-gray-600 text-sm">{product.reviews} Reviews</span>
                </div>
              </div>

              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-gray-900">PKR {displayedPrice.toLocaleString()}</span>
                {product.oldPrice && (
                  <span className="text-gray-400 line-through text-sm">PKR {product.oldPrice.toLocaleString()}</span>
                )}
              </div>

              {product.benefits && product.benefits.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {product.benefits.slice(0, 3).map((b, i) => (
                    <span key={i} className="px-2.5 py-0.5 bg-green-50 text-green-700 rounded-full text-xs font-medium">{b}</span>
                  ))}
                </div>
              )}

              {/* Variant selector — rich (weight+form+unit), named flat, price-only, or legacy sizes */}
              {hasRichVariants ? (
                <div>
                  <p className="text-sm font-semibold text-gray-900 mb-2">
                    {primaryKey
                      ? variantUnit ? `${primaryKey} (${variantUnit})` : primaryKey
                      : 'Size'}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {weightOptions.map(w => (
                      <button
                        key={w}
                        onClick={() => {
                          setSelectedWeight(w);
                          const available = richVariants
                            .filter(v => {
                              const attrs = v.attributes;
                              return attrs && !Array.isArray(attrs) && primaryKey && attrs[primaryKey] === w;
                            })
                            .map(v => (v.attributes as Record<string, string>)?.Form)
                            .filter(Boolean) as string[];
                          if (formOptions.length > 0 && !available.includes(selectedForm)) {
                            setSelectedForm(available[0] ?? formOptions[0]);
                          }
                        }}
                        className={`px-3 py-1.5 rounded-lg border text-sm font-medium transition ${selectedWeight === w
                            ? 'bg-green-700 text-white border-green-700'
                            : 'border-gray-300 hover:border-green-600'
                          }`}
                      >
                        {w}{variantUnit ? ` ${variantUnit}` : ''}
                      </button>
                    ))}
                  </div>
                  {formOptions.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {formOptions.map(f => {
                        const available = richVariants
                          .filter(v => {
                            const attrs = v.attributes;
                            return attrs && !Array.isArray(attrs) && primaryKey && attrs[primaryKey] === selectedWeight;
                          })
                          .map(v => (v.attributes as Record<string, string>)?.Form) as string[];
                        const disabled = !available.includes(f);
                        return (
                          <button
                            key={f}
                            onClick={() => !disabled && setSelectedForm(f)}
                            disabled={disabled}
                            className={`px-3 py-1.5 rounded-lg border text-sm font-medium transition ${selectedForm === f
                                ? 'bg-green-700 text-white border-green-700'
                                : disabled
                                  ? 'border-gray-200 text-gray-300 cursor-not-allowed'
                                  : 'border-gray-300 hover:border-green-600'
                              }`}
                          >
                            {f}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              ) : (hasNamedVariants || hasPriceOnlyVariants) ? (
                <div>
                  <p className="text-sm font-semibold text-gray-900 mb-2">
                    {variantUnit ? `Size (${variantUnit})` : 'Size'}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {richVariants.map((v, idx) => {
                      const label = hasNamedVariants
                        ? `${v.name}${variantUnit ? ' ' + variantUnit : ''}`
                        : priceOnlyLabel(v);
                      return (
                        <button
                          key={v.id ?? idx}
                          onClick={() => setSelectedVariantIdx(idx)}
                          className={`px-3 py-1.5 rounded-lg border text-sm font-medium transition ${selectedVariantIdx === idx
                              ? 'bg-green-700 text-white border-green-700'
                              : 'border-gray-300 hover:border-green-600'
                            }`}
                        >
                          {label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ) : availableSizes.length > 0 ? (
                <div>
                  <p className="text-sm font-semibold text-gray-900 mb-2">Size</p>
                  <div className="flex flex-wrap gap-2">
                    {availableSizes.map(size => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`px-3 py-1.5 rounded-lg border text-sm font-medium transition ${selectedSize === size
                            ? 'bg-green-700 text-white border-green-700'
                            : 'border-gray-300 hover:border-green-600'
                          }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              ) : null}

              {product.features && product.features.length > 0 && (
                <div>
                  <p className="text-sm font-semibold text-gray-900 mb-2">Features</p>
                  <div className="space-y-1.5">
                    {product.features.slice(0, 4).map((f, i) => {
                      const text = typeof f === 'string' ? f.replace('✓', '').trim() : f.text?.replace('✓', '').trim();
                      return (
                        <div key={i} className="flex items-center gap-2 text-gray-600 text-sm">
                          <div className="w-1.5 h-1.5 bg-green-600 rounded-full flex-shrink-0" />
                          <span className="line-clamp-1">{text}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="pt-3 border-t border-gray-100">
                <p className="text-sm font-semibold text-gray-900 mb-2">Quantity</p>
                <div className="flex items-center gap-4">
                  <div className="flex items-center border border-gray-300 rounded-xl overflow-hidden">
                    <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="px-3 py-2 hover:bg-gray-100 transition">
                      <FaMinus className="w-3 h-3 text-gray-600" />
                    </button>
                    <span className="px-5 py-2 border-x border-gray-300 min-w-[50px] text-center font-bold">{quantity}</span>
                    <button onClick={() => setQuantity(q => q + 1)} className="px-3 py-2 hover:bg-gray-100 transition">
                      <FaPlus className="w-3 h-3 text-gray-600" />
                    </button>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Total</p>
                    <p className="text-xl font-bold text-gray-900">PKR {(displayedPrice * quantity).toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-4 pt-4 border-t border-gray-100 flex-shrink-0">
              <button
                onClick={handleAddToCart}
                className="flex-1 flex items-center justify-center gap-2 bg-green-700 text-white font-semibold py-3 rounded-xl hover:bg-green-800 transition"
              >
                <FaShoppingCart className="w-4 h-4" />
                Add to Cart
              </button>
              <button
                onClick={handleBuyNow}
                className="flex-1 flex items-center justify-center gap-2 bg-amber-500 text-white font-semibold py-3 rounded-xl hover:bg-amber-600 transition"
              >
                <AiOutlineShopping className="w-4 h-4" />
                Buy Now
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}