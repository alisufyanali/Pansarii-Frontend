import type { Metadata } from 'next';
import CategoryPage from '@/components/Desktop/Sections/CategoryPage';

export const metadata: Metadata = {
  title: 'Dawakhana | Pansari Inn',
  description: 'Explore our Dawakhana collection - traditional herbal medicines and remedies. 100% natural and authentic products.',
  keywords: ['dawakhana', 'herbal medicine', 'traditional medicine', 'ayurvedic', 'Pakistan'],
  openGraph: {
    title: 'Dawakhana | Pansari Inn',
    description: 'Traditional herbal medicines and remedies',
    type: 'website',
  },
};

export default function DawakhanaPage() {
  return <CategoryPage categoryName="Dawakhana" />;
}
