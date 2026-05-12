// types/product.ts
// Shared Product type used across the entire application

export interface ProductFeature {
  text: string;
  hasCheck: boolean;
}

export interface Product {
  id: string | number;
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
  // Product detail page fields
  features?: ProductFeature[];
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
    oldPrice?: number;
    rating: number;
    sale?: string | null;
    category?: string;
  }>;
}
