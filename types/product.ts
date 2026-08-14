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
  /** Structured attribute map, e.g. { Weight: "50", Form: "Powder" } */
  attributes?: Record<string, string>;
  /** Unit label for the Weight attribute, e.g. "g", "ml", "kg" */
  unit?: string;
  /**
   * Final customer-facing price — already includes any additional charge.
   * Always use this for display. Never compute price + additional on the frontend.
   */
  final_price?: number;
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
  hover_image?: string | null;
  description?: string;
  /** Extended description for the Description tab */
  long_description?: string | null;
  /** Latin/scientific name shown as a subtitle under the product name */
  scientific_name?: string | null;
  category: ApiCategory;
  variants: ProductVariant[];
  gallery?: string[];
  video?: string | null;
  rating?: number;
  reviews_count?: number;
  urdu_name?: string | null;
  ingredients?: Array<{ label: string; value: string }>;
  how_to_use?: { steps: string[]; notes: string[] };
  benefits?: string[];
  key_features?: Array<{ icon: string; title: string; sub: string; color: string }>;
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
  // Only use urdu_name when it's a real non-empty string — never fall back to
  // the English name. Showing the English name in the Urdu field looks doubled
  // and is visually confusing. Components guard with `nameUr && nameUr !== nameEn`.
  const nameUr = (p.urdu_name && p.urdu_name.trim()) ? p.urdu_name.trim() : '';
  return {
    id: p.id,
    slug: p.slug,
    img: p.thumbnail || '/images/product.png',
    hoverImg: p.hover_image || undefined,
    nameEn: p.name,
    nameUr,
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
    ingredients: p.ingredients,
    how_to_use: p.how_to_use,
    benefits: p.benefits,
    key_features: p.key_features,
    scientific_name: p.scientific_name,
    long_description: p.long_description,
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
  ingredients?: Array<{ label: string; value: string }>;
  how_to_use?: { steps: string[]; notes: string[] };
  key_features?: Array<{ icon: string; title: string; sub: string; color: string }>;
  /** Latin/scientific name shown as italic subtitle under product name */
  scientific_name?: string | null;
  /** Full extended description for the Description tab */
  long_description?: string | null;
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