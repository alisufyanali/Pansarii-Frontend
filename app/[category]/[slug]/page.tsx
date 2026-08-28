/**
 * app/[category]/[slug]/page.tsx
 *
 * Alternate product detail URL: /{category}/{slug}
 * e.g.  /herb/goldleaf   /beauty-corner/roseoil   /supplements/kalonji
 *
 * Rules:
 *  - The product is fetched by `slug` alone (slugs are globally unique).
 *  - The `category` segment is validated: if it doesn't match the product's
 *    real category (case-insensitive), we 301-redirect to the canonical
 *    /{slug} URL so the correct category is reflected in the URL.
 *  - Canonical <link> always points to /{slug} to prevent duplicate-content
 *    indexing between this URL and the /{slug} variant.
 *  - Static routes at the same first-segment level (e.g. /herb/page.tsx) are
 *    NOT affected — Next.js resolves static segments before dynamic ones, and
 *    that rule applies per-segment-depth.  /herb  →  app/herb/page.tsx
 *    /herb/goldleaf  →  this file (app/[category]/[slug]/page.tsx).
 */

import { notFound, redirect } from 'next/navigation';
import type { Metadata } from 'next';
import ProductDetails from '@/components/Desktop/components/ProductDetails';
import ProductDetailsSection from '@/components/Desktop/Sections/ProductDetailsSection';
import { allProducts } from '@/data/products';
import { findProductBySlug, toProductSlug } from '@/lib/productSlug';
import {
  getProductBySlug as fetchApiProduct,
  getProducts as fetchApiProducts,
} from '@/lib/products';
import type { Product, ProductFeature, LegacyProduct } from '@/types/product';

// Reuse ISR settings identical to the canonical /{slug} route.
export const revalidate  = 60;
export const dynamicParams = true;

// ─── Routing helpers ──────────────────────────────────────────────────────────

/**
 * Convert a category name (from the DB, e.g. "Beauty Corner") to its
 * URL slug form (e.g. "beauty-corner").  Mirrors CATEGORY_SLUG_MAP logic
 * used elsewhere in the app.
 */
function categoryToSlug(name: string): string {
  return name.toLowerCase().replace(/\s+/g, '-');
}

/**
 * Return true if the URL category segment matches the product's real
 * category, tolerating case differences and spaces-vs-hyphens.
 */
function categoryMatches(urlCategory: string, productCategory: string | undefined): boolean {
  if (!productCategory) return true; // no category data — don't reject
  return categoryToSlug(urlCategory) === categoryToSlug(productCategory);
}

// ─── Metadata ─────────────────────────────────────────────────────────────────

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const siteUrl  = process.env.NEXT_PUBLIC_SITE_URL || 'https://pansariinn.com';

  let apiProduct = null;
  try {
    apiProduct = await fetchApiProduct(slug);
  } catch {
    return { title: 'Loading… | Pansari Inn' };
  }

  if (apiProduct) {
    return {
      title: `${apiProduct.name} | Pansari Inn`,
      description: apiProduct.description || `Buy ${apiProduct.name} at Pansari Inn`,
      // Canonical points to the short /{slug} form — prevents duplicate indexing.
      alternates: { canonical: `${siteUrl}/${slug}` },
      openGraph: {
        title: `${apiProduct.name} | Pansari Inn`,
        description: apiProduct.description || `Buy ${apiProduct.name}`,
        url: `${siteUrl}/${slug}`,
        images: apiProduct.thumbnail
          ? [{ url: apiProduct.thumbnail, width: 800, height: 800, alt: apiProduct.name }]
          : [],
        type: 'website',
      },
    };
  }

  const foundProduct = findProductBySlug(slug);
  if (!foundProduct) return { title: 'Product Not Found' };

  return {
    title: `${foundProduct.nameEn} | Pansari Inn`,
    description:
      foundProduct.description ||
      `Buy ${foundProduct.nameEn} - 100% pure and natural herbal product at Pansari Inn.`,
    alternates: { canonical: `${siteUrl}/${slug}` },
    openGraph: {
      title: `${foundProduct.nameEn} | Pansari Inn`,
      description: foundProduct.description || `Buy ${foundProduct.nameEn}`,
      url: `${siteUrl}/${slug}`,
      images: [{ url: foundProduct.img, width: 800, height: 800, alt: foundProduct.nameEn }],
      type: 'website',
    },
  };
}

// ─── Static params ────────────────────────────────────────────────────────────
// Generate the most common category+slug combos at build time.
// All others are served via ISR (dynamicParams = true).

export async function generateStaticParams() {
  const staticParams = allProducts
    .filter(p => p.category)
    .map(p => ({
      category: categoryToSlug(p.category!),
      slug:     toProductSlug(p.nameEn),
    }));

  let apiParams: { category: string; slug: string }[] = [];
  try {
    const res = await fetchApiProducts({ per_page: 50, page: 1 });
    apiParams = res.data
      .filter(p => p.slug && p.category?.name)
      .map(p => ({
        category: categoryToSlug(p.category!.name),
        slug:     p.slug,
      }));
  } catch {
    console.warn('[generateStaticParams /[category]/[slug]] API unavailable — using static slugs only.');
  }

  // Deduplicate by category+slug pair
  const seen = new Set<string>();
  return [...apiParams, ...staticParams].filter(p => {
    const key = `${p.category}/${p.slug}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

// ─── Helpers (identical to /{slug} page) ──────────────────────────────────────

type CatalogProduct = (typeof allProducts)[number];

function getProductBenefits(product: CatalogProduct): string[] {
  const cat = product.category?.toLowerCase() || '';
  if (cat.includes('skin'))
    return ['Provides deep hydration', 'Reduces signs of aging', 'Improves skin elasticity'];
  if (cat.includes('hair'))
    return ['Promotes hair growth', 'Reduces dandruff', 'Strengthens hair follicles'];
  if (cat.includes('oil'))
    return ['Nourishes from within', 'Improves skin texture', 'Boosts overall wellness'];
  return [
    'Helps in hormonal balance',
    'Improves digestion & metabolism',
    'Enhances hair and skin health',
  ];
}

function buildProduct(foundProduct: CatalogProduct): Product {
  return {
    img:    foundProduct.img,
    additionalImages: foundProduct.additionalImages?.length
      ? foundProduct.additionalImages
      : undefined,
    nameEn:      foundProduct.nameEn,
    nameUr:      foundProduct.nameUr || foundProduct.nameEn,
    description: foundProduct.description || '',
    rating:      foundProduct.rating  || 4.5,
    reviews:     foundProduct.reviews || 0,
    price:       foundProduct.price,
    oldPrice:    foundProduct.oldPrice ?? null,
    sale:        foundProduct.sale    ?? null,
    productId:   foundProduct.id,
    id:          foundProduct.id,
    category:    foundProduct.category,
    features:    (foundProduct as unknown as { features?: string[] }).features?.length
      ? (foundProduct as unknown as { features?: string[] }).features
      : [],
    sizes:       (foundProduct as unknown as { sizes?: string[] }).sizes?.length
      ? (foundProduct as unknown as { sizes?: string[] }).sizes
      : [],
    points:      Math.floor(foundProduct.price / 100) || 14,
    benefits:    getProductBenefits(foundProduct),
    infoLines: [
      '100% Ayurvedic & Herbal Product',
      'Free Delivery On All Orders Above PKR 5000',
      'GST Included in Price',
    ],
  };
}

// ─── Page ─────────────────────────────────────────────────────────────────────

interface PageProps {
  params: Promise<{ category: string; slug: string }>;
}

export default async function CategoryProductPage({ params }: PageProps) {
  const { category, slug } = await params;

  // ── API product ────────────────────────────────────────────────────────────
  let apiProduct = null;
  try {
    apiProduct = await fetchApiProduct(slug);
  } catch (err) {
    throw err; // propagate to error.tsx — not a confirmed 404
  }

  if (apiProduct) {
    const productCategory = apiProduct.category?.name;

    // If the category segment doesn't match, 301-redirect to the canonical URL
    // so the user and bots always land on the correct address.
    if (!categoryMatches(category, productCategory)) {
      const correctCategory = productCategory ? categoryToSlug(productCategory) : null;
      redirect(correctCategory ? `/${correctCategory}/${slug}` : `/${slug}`);
    }

    const price = apiProduct.variants?.length
      ? Math.min(...apiProduct.variants.map(v => v.price))
      : (apiProduct.sale_price ?? apiProduct.price);

    const product: Product = {
      id:          apiProduct.id,
      img:         apiProduct.thumbnail || '/images/product.png',
      additionalImages: apiProduct.gallery?.length
        ? apiProduct.gallery
        : ['/images/category.png', '/images/Skincare.png'],
      nameEn:      apiProduct.name,
      nameUr:      apiProduct.name,
      description: apiProduct.description || '',
      rating:      apiProduct.rating       || 4.5,
      reviews:     apiProduct.reviews_count || 0,
      price,
      oldPrice:
        apiProduct.sale_price && apiProduct.price > apiProduct.sale_price
          ? apiProduct.price
          : null,
      sale: apiProduct.sale_price
        ? `${Math.round(((apiProduct.price - apiProduct.sale_price) / apiProduct.price) * 100)}% OFF`
        : null,
      productId: apiProduct.id,
      category:  apiProduct.category?.name,
      sizes:     apiProduct.variants?.length ? apiProduct.variants.map(v => v.name) : undefined,
      variants:  apiProduct.variants,
      features:  undefined,
      points:    Math.floor(price / 100) || 14,
      infoLines: [
        '100% Ayurvedic & Herbal Product',
        'Free Delivery On All Orders Above PKR 5000',
        'GST Included in Price',
      ],
      scientific_name:  apiProduct.scientific_name  ?? undefined,
      long_description: apiProduct.long_description ?? undefined,
    };

    const legacyProduct: LegacyProduct = {
      ...product,
      slug: apiProduct.slug,
      features: undefined,
    };

    const normalizedFeatures: ProductFeature[] = [];

    return (
      <div className="bg-white">
        <ProductDetails product={{ ...product, features: normalizedFeatures }} />
        <ProductDetailsSection product={legacyProduct} />
      </div>
    );
  }

  // ── Static fallback ────────────────────────────────────────────────────────
  const foundProduct = findProductBySlug(slug);
  if (!foundProduct) notFound();

  // Validate category against static data too
  if (!categoryMatches(category, foundProduct!.category)) {
    const correctCategory = foundProduct!.category ? categoryToSlug(foundProduct!.category) : null;
    redirect(correctCategory ? `/${correctCategory}/${slug}` : `/${slug}`);
  }

  const product = buildProduct(foundProduct!);

  const relatedProducts: Product[] = allProducts
    .filter(p => p.category === foundProduct!.category && p.id !== foundProduct!.id)
    .slice(0, 4)
    .map(p => ({
      ...p,
      nameUr:      p.nameUr || p.nameEn,
      description: p.description || '',
      features:    [],
    }));

  const legacyProduct: LegacyProduct = {
    ...product,
    features: (product.features ?? []).map(f =>
      typeof f === 'string' ? f : f.hasCheck ? `✓ ${f.text}` : `○ ${f.text}`,
    ),
    relatedProducts: relatedProducts.map(p => ({
      id:       p.id,
      img:      p.img,
      nameEn:   p.nameEn,
      nameUr:   p.nameUr || p.nameEn,
      price:    p.price,
      oldPrice: p.oldPrice ?? undefined,
      rating:   p.rating,
      sale:     p.sale,
      category: p.category,
    })),
  };

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
