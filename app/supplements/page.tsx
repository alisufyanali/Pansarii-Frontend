import type { Metadata } from 'next';
import CategoryPage from '@/components/Desktop/Sections/CategoryPage';

export const metadata: Metadata = {
  title: 'Supplements | Pansari Inn',
  description: '100% natural herbal supplements for health and wellness. Premium quality vitamins, minerals, and herbal supplements.',
  keywords: ['supplements', 'herbal supplements', 'natural vitamins', 'health supplements', 'Pakistan'],
  openGraph: {
    title: 'Supplements | Pansari Inn',
    description: '100% natural herbal supplements for health and wellness',
    type: 'website',
  },
};

export default function SupplementsPage() {
  return <CategoryPage categoryName="Supplements" />;
}
