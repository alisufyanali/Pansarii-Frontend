import type { Metadata } from 'next';
import CategoryPage from '@/components/Desktop/Sections/CategoryPage';

export const metadata: Metadata = {
  title: 'Oils | Pansari Inn',
  description: 'Browse our collection of 100% pure natural oils. Premium cold-pressed oils for health and wellness.',
  keywords: ['oils', 'natural oils', 'cold pressed', 'herbal oils', 'Pakistan'],
  openGraph: {
    title: 'Oils | Pansari Inn',
    description: 'Browse our collection of 100% pure natural oils',
    type: 'website',
  },
};

export default function OilsPage() {
  return <CategoryPage categoryName="Oils" />;
}
