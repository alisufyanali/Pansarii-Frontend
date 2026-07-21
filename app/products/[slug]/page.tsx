import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import ProductDetails from '@/components/Desktop/components/ProductDetails';
import ProductDetailsSection from '@/components/Desktop/Sections/ProductDetailsSection';
import { allProducts } from '@/data/products';
import { findProductBySlug, toProductSlug } from '@/lib/productSlug';
import { getProductBySlug as fetchApiProduct, getProducts as fetchApiProducts } from '@/lib/products';
import type { Product, ProductFeature, LegacyProduct } from '@/types/product';

type CatalogProduct = (typeof allProducts)[number];

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;

  // Try API first
  const apiProduct = await fetchApiProduct(slug);
  if (apiProduct) {
    return {
      title: `${apiProduct.name} | Pansari Inn`,
      description: apiProduct.description || `Buy ${apiProduct.name} at Pansari Inn`,
      openGraph: {
        title: `${apiProduct.name} | Pansari Inn`,
        description: apiProduct.description || `Buy ${apiProduct.name}`,
        images: apiProduct.thumbnail ? [{ url: apiProduct.thumbnail, width: 800, height: 800, alt: apiProduct.name }] : [],
        type: 'website',
      },
    };
  }

  // Fallback to static
  const foundProduct = findProductBySlug(slug);
  if (!foundProduct) return { title: 'Product Not Found' };
  return {
    title: `${foundProduct.nameEn} | Pansari Inn`,
    description: foundProduct.description || `Buy ${foundProduct.nameEn} - 100% pure and natural herbal product at Pansari Inn. Premium quality at PKR ${foundProduct.price.toLocaleString()}.`,
    keywords: [foundProduct.nameEn, foundProduct.nameUr, foundProduct.category, 'herbal', 'natural', 'ayurvedic', 'Pakistan'],
    openGraph: {
      title: `${foundProduct.nameEn} | Pansari Inn`,
      description: foundProduct.description || `Buy ${foundProduct.nameEn} - 100% pure and natural herbal product`,
      images: [
        {
          url: foundProduct.img,
          width: 800,
          height: 800,
          alt: foundProduct.nameEn,
        },
      ],
      type: 'website',
    },
  };
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
    additionalImages: foundProduct.additionalImages?.length
      ? foundProduct.additionalImages
      : undefined,
    nameEn: foundProduct.nameEn,
    nameUr: foundProduct.nameUr || foundProduct.nameEn,
    description: foundProduct.description || '',
    rating: foundProduct.rating || 4.5,
    reviews: foundProduct.reviews || 0,
    price: foundProduct.price,
    oldPrice: foundProduct.oldPrice ?? null,
    // Only show a real sale badge — never fabricate '20% OFF'
    sale: foundProduct.sale ?? null,
    productId: foundProduct.id,
    id: foundProduct.id,
    category: foundProduct.category,
    // Only expose features if the static product actually has them defined
    features: foundProduct.features?.length ? foundProduct.features : [],
    // Only expose sizes if the static product actually has them defined
    sizes: foundProduct.sizes?.length ? foundProduct.sizes : [],
    points: Math.floor(foundProduct.price / 100) || 14,
    benefits: getProductBenefits(foundProduct),
    infoLines: [
      '100% Ayurvedic & Herbal Product',
      'Free Delivery On All Orders Above PKR 5000',
      'GST Included in Price',
    ],
  };
}

export async function generateStaticParams() {
  const staticSlugs = allProducts.map((p) => toProductSlug(p.nameEn));

  let apiSlugs: string[] = [];
  try {
    // Fetch all products from the API (up to 500) to collect their slugs.
    // This runs at build time only, so a single large fetch is acceptable.
    const res = await fetchApiProducts({ per_page: 500, page: 1 });
    apiSlugs = res.data.map((p) => p.slug).filter(Boolean);
  } catch {
    // API unavailable at build time — fall back to static slugs only.
  }

  const merged = Array.from(new Set([...apiSlugs, ...staticSlugs]));
  return merged.map((slug) => ({ slug }));
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params;

  // Try API first
  const apiProduct = await fetchApiProduct(slug);

  if (apiProduct) {
    const price = apiProduct.variants?.length
      ? Math.min(...apiProduct.variants.map(v => v.price))
      : (apiProduct.sale_price ?? apiProduct.price);

    const product: Product = {
      id: apiProduct.id,
      img: apiProduct.thumbnail || '/images/product.png',
      additionalImages: apiProduct.gallery?.length ? apiProduct.gallery : ['/images/category.png', '/images/Skincare.png'],
      nameEn: apiProduct.name,
      nameUr: apiProduct.name,
      description: apiProduct.description || '',
      rating: apiProduct.rating || 4.5,
      reviews: apiProduct.reviews_count || 0,
      price,
      oldPrice: apiProduct.sale_price && apiProduct.price > apiProduct.sale_price ? apiProduct.price : null,
      sale: apiProduct.sale_price ? `${Math.round(((apiProduct.price - apiProduct.sale_price) / apiProduct.price) * 100)}% OFF` : null,
      productId: apiProduct.id,
      category: apiProduct.category?.name,
      sizes: apiProduct.variants?.length
        ? apiProduct.variants.map(v => v.name)
        : undefined,
      variants: apiProduct.variants,
      // Only expose features if the API product actually provides them.
      // The API currently does not return a features field, so we leave this
      // undefined — the ProductDetails component skips the section when empty.
      features: undefined,
      points: Math.floor(price / 100) || 14,
      infoLines: [
        '100% Ayurvedic & Herbal Product',
        'Free Delivery On All Orders Above PKR 5000',
        'GST Included in Price',
      ],
    };

    const legacyProduct: LegacyProduct = {
      ...product,
      slug: apiProduct.slug,
      features: undefined,
    };

    const normalizedFeatures: import('@/types/product').ProductFeature[] = [];

    return (
      <div className="bg-white">
        <ProductDetails product={{ ...product, features: normalizedFeatures }} />
        <ProductDetailsSection product={legacyProduct} />
      </div>
    );
  }

  // Fallback to static data
  const foundProduct = findProductBySlug(slug);

  if (!foundProduct) {
    notFound();
  }

  const product = buildProduct(foundProduct!);

  const relatedProducts: Product[] = allProducts
    .filter((p) => p.category === foundProduct!.category && p.id !== foundProduct!.id)
    .slice(0, 4)
    .map((p) => ({
      ...p,
      nameUr: p.nameUr || p.nameEn,
      description: p.description || '',
      features: [],
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
