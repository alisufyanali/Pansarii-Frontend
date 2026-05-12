"use client";

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { notFound } from 'next/navigation';
import ProductDetails from '@/components/Desktop/components/ProductDetails';
import ProductDetailsSection from '@/components/Desktop/Sections/ProductDetailsSection';
import { allProducts } from '@/components/Desktop/data/products';
import { FaHome, FaStore } from 'react-icons/fa';
import { Product, ProductFeature, LegacyProduct } from '../../types/product';

export default function ProductPage() {
  const params = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const slug = params.slug as string;
    const productName = slug.replace(/-/g, ' ');

    const foundProduct = allProducts.find(p =>
      p.nameEn.toLowerCase().includes(productName.toLowerCase()) ||
      p.id.toString() === slug
    );

    if (foundProduct) {
      const transformedProduct: Product = {
        img: foundProduct.img,
        additionalImages: foundProduct.additionalImages || [
          '/images/category.png',
          '/images/Skincare.png',
          '/images/whisk.png',
        ],
        nameEn: foundProduct.nameEn,
        nameUr: foundProduct.nameUr || foundProduct.nameEn,
        description: foundProduct.description || "Pure ayurvedic product for natural wellness",
        rating: foundProduct.rating || 4.5,
        reviews: foundProduct.reviews || 100,
        price: foundProduct.price,
        oldPrice: foundProduct.oldPrice,
        sale: foundProduct.sale || "20% OFF",
        productId: foundProduct.id,
        id: foundProduct.id,
        features: getProductFeatures(foundProduct),
        sizes: ["15ml", "30ml", "60ml", "120ml", "150ml"],
        points: Math.floor(foundProduct.price / 100) || 14,
        benefits: getProductBenefits(foundProduct),
        infoLines: [
          "100% Ayurvedic & Herbal Product",
          "Free Delivery On All Orders Above ₹399",
          "GST Included in Price",
          "Certified Organic Ingredients",
        ],
      };

      setProduct(transformedProduct);

      const related = allProducts
        .filter(p => p.category === foundProduct.category && p.id !== foundProduct.id)
        .slice(0, 4)
        .map(p => ({ ...p, features: getProductFeatures(p).slice(0, 2) }));

      setRelatedProducts(related);
    } else {
      notFound();
    }

    setLoading(false);
  }, [params.slug, router]);

  const getProductFeatures = (product: Product): ProductFeature[] => {
    const base: ProductFeature[] = [
      { text: "100% Natural & Organic",        hasCheck: true },
      { text: "No Chemical Preservatives",      hasCheck: true },
      { text: "Cruelty Free",                   hasCheck: true },
      { text: "Ayurvedic Formulation",          hasCheck: true },
      { text: "Gluten Free",                    hasCheck: true },
      { text: "Vegan Friendly",                 hasCheck: true },
    ];
    const extra: ProductFeature[] = [];
    const cat = product.category?.toLowerCase() || '';
    if (cat.includes('skin')) extra.push(
      { text: "Anti-Aging Properties",  hasCheck: true },
      { text: "Moisturizing Effect",    hasCheck: true },
      { text: "Brightens Skin Tone",    hasCheck: true },
    );
    if (cat.includes('hair')) extra.push(
      { text: "Promotes Hair Growth",   hasCheck: true },
      { text: "Reduces Hair Fall",      hasCheck: true },
      { text: "Strengthens Hair Roots", hasCheck: true },
    );
    if (cat.includes('oil')) extra.push(
      { text: "Cold Pressed Extraction", hasCheck: true },
      { text: "Pure & Unrefined",        hasCheck: true },
      { text: "Rich in Antioxidants",    hasCheck: true },
    );
    return [...extra, ...base].slice(0, 8);
  };

  const getProductBenefits = (product: Product): string[] => {
    const cat = product.category?.toLowerCase() || '';
    if (cat.includes('skin')) return ["Provides deep hydration", "Reduces signs of aging", "Improves skin elasticity"];
    if (cat.includes('hair')) return ["Promotes hair growth", "Reduces dandruff", "Strengthens hair follicles"];
    if (cat.includes('oil'))  return ["Nourishes from within", "Improves skin texture", "Boosts overall wellness"];
    return ["Helps in hormonal balance", "Improves digestion & metabolism", "Enhances hair and skin health"];
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center" style={{ minHeight: '60vh' }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-14 w-14 border-b-2 border-green-700 mx-auto" />
          <p className="text-green-700 mt-4 text-sm font-medium">Loading product details...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex items-center justify-center" style={{ minHeight: '60vh' }}>
        <div className="text-center max-w-md p-8">
          <div className="text-5xl mb-4">😕</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Product Not Found</h2>
          <p className="text-gray-500 text-sm mb-6">This product doesn&apos;t exist or may have been moved.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button onClick={() => router.push('/')}
              className="px-6 py-2.5 bg-green-700 text-white text-sm font-semibold rounded-full hover:bg-green-600 transition flex items-center justify-center gap-2">
              <FaHome className="w-4 h-4" /> Back to Home
            </button>
            <button onClick={() => router.push('/shop')}
              className="px-6 py-2.5 border-2 border-green-700 text-green-700 text-sm font-semibold rounded-full hover:bg-green-50 transition flex items-center justify-center gap-2">
              <FaStore className="w-4 h-4" /> Browse Products
            </button>
          </div>
        </div>
      </div>
    );
  }

  const legacyProduct: LegacyProduct = {
    ...product,
    features: (product.features ?? []).map((f: ProductFeature) => f.hasCheck ? `✓ ${f.text}` : `○ ${f.text}`),
    relatedProducts: relatedProducts.map(p => ({
      id: p.id, img: p.img, nameEn: p.nameEn,
      nameUr: p.nameUr || p.nameEn, price: p.price,
      oldPrice: p.oldPrice ?? undefined, rating: p.rating,
      sale: p.sale, category: p.category,
    })),
  };

  return (
    // ✅ No min-h-screen, no gradient wrapper — removes the big gap
    <div className="bg-white">
      <ProductDetails product={product} />
      <ProductDetailsSection product={legacyProduct} />
    </div>
  );
}
