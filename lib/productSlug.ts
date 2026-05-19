import { allProducts } from '@/data/products';

export function toProductSlug(nameEn: string): string {
  return nameEn.toLowerCase().replace(/\s+/g, '-');
}

export function findProductBySlug(slug: string) {
  return allProducts.find(
    (p) => toProductSlug(p.nameEn) === slug || p.id.toString() === slug,
  );
}
