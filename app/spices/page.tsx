import type { Metadata } from 'next';
import CategoryPage from '@/components/Desktop/Sections/CategoryPage';

export const metadata: Metadata = {
  title: 'Spices | Pansari Inn',
  description: 'Browse our collection of premium quality spices and seasonings. 100% natural and aromatic spices for your kitchen.',
  keywords: ['spices', 'natural spices', 'aromatic spices', 'seasoning', 'Pakistan'],
  openGraph: {
    title: 'Spices | Pansari Inn',
    description: 'Browse our collection of premium quality spices and seasonings',
    type: 'website',
  },
};

export default function SpicesPage() {
  return <CategoryPage categoryName="Spices" />;
}
