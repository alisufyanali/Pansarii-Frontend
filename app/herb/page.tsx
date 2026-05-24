import type { Metadata } from 'next';
import CategoryPage from '@/components/Desktop/Sections/CategoryPage';

export const metadata: Metadata = {
  title: 'Herbs | Pansari Inn',
  description: 'Browse our collection of 100% pure natural herbs. Premium quality herbal products for health and wellness.',
  keywords: ['herbs', 'natural herbs', 'herbal products', 'ayurvedic herbs', 'Pakistan'],
  openGraph: {
    title: 'Herbs | Pansari Inn',
    description: 'Browse our collection of 100% pure natural herbs',
    type: 'website',
  },
};

export default function HerbPage() {
  return <CategoryPage categoryName="Herb" />;
}
