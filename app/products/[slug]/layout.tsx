import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { findProductBySlug } from '@/lib/productSlug';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = findProductBySlug(slug);

  if (!product) {
    return {
      title: 'Product Not Found',
      description: 'The product you are looking for could not be found.',
    };
  }

  return {
    title: product.nameEn,
    description:
      product.description ||
      `Buy ${product.nameEn} — 100% pure Ayurvedic & herbal product from Pansari Inn.`,
    openGraph: {
      title: `${product.nameEn} | Pansari Inn`,
      description:
        product.description || `Buy ${product.nameEn} from Pansari Inn.`,
      images: product.img ? [{ url: product.img, alt: product.nameEn }] : [],
    },
  };
}

export default function ProductLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
