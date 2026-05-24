import type { Metadata } from 'next';
import CategoryPage from '@/components/Desktop/Sections/CategoryPage';

export const metadata: Metadata = {
  title: 'Remedies | Pansari Inn',
  description: 'Natural herbal remedies for common health concerns. 100% pure ayurvedic solutions for wellness and healing.',
  keywords: ['remedies', 'herbal remedies', 'natural healing', 'ayurvedic medicine', 'Pakistan'],
  openGraph: {
    title: 'Remedies | Pansari Inn',
    description: 'Natural herbal remedies for common health concerns',
    type: 'website',
  },
};

export default function RemediesPage() {
  return <CategoryPage categoryName="Remedies" />;
}
