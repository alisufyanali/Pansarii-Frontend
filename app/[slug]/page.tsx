import { notFound } from 'next/navigation';
import ProductDetails from '@/components/Desktop/components/ProductDetails';
import ProductDetailsSection from '@/components/Desktop/Sections/ProductDetailsSection';
import { allProducts } from '@/components/Desktop/data/products';
import { findProductBySlug, toProductSlug } from '@/lib/productSlug';
import type { Product, ProductFeature, LegacyProduct } from '@/types/product';

type CatalogProduct = (typeof allProducts)[number];

function getProductFeatures(product: CatalogProduct): ProductFeature[] {
  const base: ProductFeature[] = [
    { text: '100% Natural & Organic', hasCheck: true },
    { text: 'No Chemical Preservatives', hasCheck: true },
    { text: 'Cruelty Free', hasCheck: true },
    { text: 'Ayurvedic Formulation', hasCheck: true },
    { text: 'Gluten Free', hasCheck: true },
    { text: 'Vegan Friendly', hasCheck: true },
  ];
  const extra: ProductFeature[] = [];
  const cat = product.category?.toLowerCase() || '';
  if (cat.includes('skin')) {
    extra.push(
      { text: 'Anti-Aging Properties', hasCheck: true },
      { text: 'Moisturizing Effect', hasCheck: true },
      { text: 'Brightens Skin Tone', hasCheck: true },
    );
  }
  if (cat.includes('hair')) {
    extra.push(
      { text: 'Promotes Hair Growth', hasCheck: true },
      { text: 'Reduces Hair Fall', hasCheck: true },
      { text: 'Strengthens Hair Roots', hasCheck: true },
    );
  }
  if (cat.includes('oil')) {
    extra.push(
      { text: 'Cold Pressed Extraction', hasCheck: true },
      { text: 'Pure & Unrefined', hasCheck: true },
      { text: 'Rich in Antioxidants', hasCheck: true },
    );
  }
  return [...extra, ...base].slice(0, 8);
}

function getProductBenefits(product: CatalogProduct): string[] {
  const cat = product.category?.toLowerCase() || '';
  if (cat.includes('skin')) {
    return ['Provides deep hydration', 'Reduces signs of aging', 'Improves skin elasticity'];
  }
  if (cat.includes('hair')) {
    return ['Promotes hair growth', 'Reduces dandruff', 'Strengthens hair follicles'];
  }
  if (cat.includes('oil')) {
    return ['Nourishes from within', 'Improves skin texture', 'Boosts overall wellness'];
  }
  return [
    'Helps in hormonal balance',
    'Improves digestion & metabolism',
    'Enhances hair and skin health',
  ];
}

function buildProduct(foundProduct: CatalogProduct): Product {
  return {
    img: foundProduct.img,
    additionalImages: foundProduct.additionalImages || [
      '/images/category.png',
      '/images/Skincare.png',
      '/images/whisk.png',
    ],
    nameEn: foundProduct.nameEn,
    nameUr: foundProduct.nameUr || foundProduct.nameEn,
    description: foundProduct.description || 'Pure ayurvedic product for natural wellness',
    rating: foundProduct.rating || 4.5,
    reviews: foundProduct.reviews || 100,
    price: foundProduct.price,
    oldPrice: foundProduct.oldPrice,
    sale: foundProduct.sale || '20% OFF',
    productId: foundProduct.id,
    id: foundProduct.id,
    category: foundProduct.category,
    features: getProductFeatures(foundProduct),
    sizes: ['15ml', '30ml', '60ml', '120ml', '150ml'],
    points: Math.floor(foundProduct.price / 100) || 14,
    benefits: getProductBenefits(foundProduct),
    infoLines: [
      '100% Ayurvedic & Herbal Product',
      'Free Delivery On All Orders Above ₹399',
      'GST Included in Price',
      'Certified Organic Ingredients',
    ],
  };
}

export async function generateStaticParams() {
  return allProducts.map((p) => ({
    slug: toProductSlug(p.nameEn),
  }));
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params;
  const foundProduct = findProductBySlug(slug);

  if (!foundProduct) {
    notFound();
  }

  const product = buildProduct(foundProduct);

  const relatedProducts: Product[] = allProducts
    .filter((p) => p.category === foundProduct.category && p.id !== foundProduct.id)
    .slice(0, 4)
    .map((p) => ({
      ...p,
      nameUr: p.nameUr || p.nameEn,
      description: p.description || '',
      features: getProductFeatures(p).slice(0, 2),
    }));

  const legacyProduct: LegacyProduct = {
    ...product,
    features: (product.features ?? []).map((f) =>
      typeof f === 'string' ? f : f.hasCheck ? `✓ ${f.text}` : `○ ${f.text}`,
    ),
    relatedProducts: relatedProducts.map((p) => ({
      id: p.id,
      img: p.img,
      nameEn: p.nameEn,
      nameUr: p.nameUr || p.nameEn,
      price: p.price,
      oldPrice: p.oldPrice ?? undefined,
      rating: p.rating,
      sale: p.sale,
      category: p.category,
    })),
  };

  // Normalize features: convert any plain strings to { text, hasCheck: false }
  // so the shape always matches FeatureItem[] expected by ProductDetails.
  const normalizedFeatures = (product.features ?? []).map(
    (f): ProductFeature => (typeof f === 'string' ? { text: f, hasCheck: false } : f),
  );

  return (
    <div className="bg-white">
      <ProductDetails product={{ ...product, features: normalizedFeatures }} />
      <ProductDetailsSection product={legacyProduct} />
    </div>
  );
}
