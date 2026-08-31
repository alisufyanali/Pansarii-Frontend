/**
 * app/[slug]/[productSlug]/page.tsx
 *
 * Alternate product detail URL: /{category}/{productSlug}
 * e.g.  /herb/goldleaf   /beauty-corner/roseoil   /supplements/kalonji
 *
 * The top-level folder is named [slug] (matching app/[slug]/page.tsx) so
 * Next.js does not throw "different slug names for the same dynamic path".
 * At runtime params.slug holds the CATEGORY segment and params.productSlug
 * holds the PRODUCT SLUG segment.
 *
 * Rules:
 *  - The product is fetched by productSlug alone (product slugs are globally unique).
 *  - The category segment is validated: if it doesn't match the product's real
 *    category (case-insensitive) we 301-redirect to the canonical /{productSlug}
 *    URL so the correct category is reflected in the URL.
 *  - Canonical <link> always points to /{productSlug} to prevent duplicate-content
 *    indexing between this URL and the /{productSlug} variant.
 *  - Static routes at the same first-segment level (e.g. /herb/page.tsx) are
 *    NOT affected — Next.js resolves static segments before dynamic ones, and
 *    that rule applies per-segment-depth.
 */

import { notFound, redirect } from 'next/navigation';
import type { Metadata } from 'next';
import ProductDetails from '@/components/Desktop/components/ProductDetails';
import ProductDetailsSection from '@/components/Desktop/Sections/ProductDetailsSection';
import { allProducts } from '@/data/products';
import { findProductBySlug, toProductSlug } from '@/lib/productSlug';
import {
  getProductBySlug as fetchApiProduct,
} from '@/lib/products';
import type { Product, ProductFeature, LegacyProduct } from '@/types/product';

// Reuse ISR settings identical to the canonical /{slug} route.
export const revalidate  = 60;
export const dynamicParams = true;

// ─── Routing helpers ──────────────────────────────────────────────────────────

function categoryToSlug(name: string): string {
  return name.toLowerCase().replace(/\s+/g, '-');
}

function categoryMatches(urlCategory: string, productCategory: string | undefined): boolean {
  if (!productCategory) return true;
  return categoryToSlug(urlCategory) === categoryToSlug(productCategory);
}

// ─── Metadata ─────────────────────────────────────────────────────────────────

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  // params.slug     = category segment  (e.g. "herb")
  // params.productSlug = product slug   (e.g. "goldleaf")
  const { productSlug } = await params;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://pansariinn.com';

  let apiProduct = null;
  try {
    apiProduct = await fetchApiProduct(productSlug);
  } catch {
    return { title: 'Loading… | Pansari Inn' };
  }

  if (apiProduct) {
    return {
      title: `${apiProduct.name} | Pansari Inn`,
      description: apiProduct.description || `Buy ${apiProduct.name} at Pansari Inn`,
      alternates: { canonical: `${siteUrl}/${productSlug}` },
      openGraph: {
        title: `${apiProduct.name} | Pansari Inn`,
        description: apiProduct.description || `Buy ${apiProduct.name}`,
        url: `${siteUrl}/${productSlug}`,
        images: apiProduct.thumbnail
          ? [{ url: apiProduct.thumbnail, width: 800, height: 800, alt: apiProduct.name }]
          : [],
        type: 'website',
      },
    };
  }

  const foundProduct = findProductBySlug(productSlug);
  if (!foundProduct) return { title: 'Product Not Found' };

  return {
    title: `${foundProduct.nameEn} | Pansari Inn`,
    description:
      foundProduct.description ||
      `Buy ${foundProduct.nameEn} - 100% pure and natural herbal product at Pansari Inn.`,
    alternates: { canonical: `${siteUrl}/${productSlug}` },
    openGraph: {
      title: `${foundProduct.nameEn} | Pansari Inn`,
      description: foundProduct.description || `Buy ${foundProduct.nameEn}`,
      url: `${siteUrl}/${productSlug}`,
      images: [{ url: foundProduct.img, width: 800, height: 800, alt: foundProduct.nameEn }],
      type: 'website',
    },
  };
}

// ─── Static params ────────────────────────────────────────────────────────────
// This route (/{category}/{productSlug}) is a secondary SEO-friendly URL.
// Pre-generating all category×product combinations at build time contributed
// ~100 extra pages to the 241-page build, tripling API calls and causing
// 429 rate-limit storms. Since dynamicParams = true, every /{cat}/{slug}
// URL still works correctly on first visit via ISR — it just won't be
// pre-built. The canonical /{slug} route (app/[slug]/page.tsx) continues
// to pre-generate the top-50 API products at build time.
export async function generateStaticParams() {
  return [];
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

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
  params: Promise<{
    slug:        string;  // category segment, e.g. "herb"
    productSlug: string;  // product slug,    e.g. "goldleaf"
  }>;
}

export default async function CategoryProductPage({ params }: PageProps) {
  const { slug: category, productSlug } = await params;

  // ── API product ────────────────────────────────────────────────────────────
  // fetchApiProduct is wrapped with React cache() — deduplicates automatically
  // with the identical call in generateMetadata for the same productSlug.
  const apiProduct = await fetchApiProduct(productSlug);

  if (apiProduct) {
    const productCategory = apiProduct.category?.name;

    if (!categoryMatches(category, productCategory)) {
      const correctCategory = productCategory ? categoryToSlug(productCategory) : null;
      redirect(correctCategory ? `/${correctCategory}/${productSlug}` : `/${productSlug}`);
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
  const foundProduct = findProductBySlug(productSlug);
  if (!foundProduct) notFound();

  if (!categoryMatches(category, foundProduct!.category)) {
    const correctCategory = foundProduct!.category ? categoryToSlug(foundProduct!.category) : null;
    redirect(correctCategory ? `/${correctCategory}/${productSlug}` : `/${productSlug}`);
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
