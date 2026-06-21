// types/product.ts
// Shared Product type used across the entire application

// ─── API Product types (from Laravel) ────────────────────────────────────────

export interface ProductVariant {
  id: number;
  name: string;
  sku: string;
  price: number;
  stock: number;
  is_default: boolean;
}

export interface ApiCategory {
  id: number;
  name: string;
  slug: string;
  products_count?: number;
  children?: ApiCategory[];
}

export interface ApiProduct {
  id: number;
  name: string;
  slug: string;
  sku?: string;
  price: number;
  sale_price: number | null;
  unit?: string;
  featured?: boolean;
  thumbnail: string | null;
  description?: string;
  category: ApiCategory;
  variants: ProductVariant[];
  gallery?: string[];
  video?: string | null;
  rating?: number;
  reviews_count?: number;
}

// Helper: get display price from ApiProduct (cheapest variant or sale_price or price)
export function getDisplayPrice(product: ApiProduct): number {
  if (product.variants && product.variants.length > 0) {
    return Math.min(...product.variants.map(v => v.price));
  }
  return product.sale_price ?? product.price;
}

// Helper: convert ApiProduct to legacy Product shape for existing components
export function apiProductToLegacy(p: ApiProduct): Product {
  const price = getDisplayPrice(p);
  return {
    id: p.id,
    slug: p.slug,
    img: p.thumbnail || '/images/product.png',
    nameEn: p.name,
    nameUr: p.name,
    description: p.description || '',
    rating: p.rating || 4.5,
    reviews: p.reviews_count || 0,
    price,
    oldPrice: p.sale_price && p.price > p.sale_price ? p.price : null,
    sale: p.sale_price ? `${Math.round(((p.price - p.sale_price) / p.price) * 100)}% OFF` : null,
    category: p.category?.name,
    inStock: p.variants?.some(v => v.stock > 0) ?? true,
    isBestSeller: p.featured,
    variants: p.variants,
    sizes: p.variants?.length ? p.variants.map(v => v.name) : undefined,
  };
}

// ─── Core Product types ───────────────────────────────────────────────────────

export interface ProductFeature {
  text: string;
  hasCheck: boolean;
}

export interface Product {
  id: string | number;
  /** Laravel slug — used for /products/{slug} links when present */
  slug?: string;
  img: string;
  hoverImg?: string;
  nameEn: string;
  nameUr: string;
  description: string;
  rating: number;
  reviews: number;
  price: number;
  oldPrice?: number | null;
  sale?: string | null;
  category?: string;
  inStock?: boolean;
  isNew?: boolean;
  isBestSeller?: boolean;
  tags?: string[];
  additionalImages?: string[];
  /** API variants (present when product comes from Laravel). */
  variants?: ProductVariant[];
  // Product detail page fields — accepts both plain strings (legacy) and structured objects
  features?: ProductFeature[] | string[];
  sizes?: string[];
  points?: number;
  benefits?: string[];
  infoLines?: string[];
  productId?: string | number;
}

// Cart-specific product shape (extends Product with quantity)
export interface CartProduct extends Product {
  quantity: number;
  size: string;
}

// Legacy product shape used in ProductDetailsSection
export interface LegacyProduct extends Omit<Product, 'features'> {
  features?: string[];
  relatedProducts?: Array<{
    id: string | number;
    img: string;
    nameEn: string;
    nameUr: string;
    price: number;
    oldPrice?: number | null;
    rating: number;
    sale?: string | null;
    category?: string;
  }>;
}
