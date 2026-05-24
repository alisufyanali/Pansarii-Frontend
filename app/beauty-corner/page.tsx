import type { Metadata } from 'next';
import CategoryPage from '@/components/Desktop/Sections/CategoryPage';

export const metadata: Metadata = {
  title: 'Beauty Corner | Pansari Inn',
  description: 'Natural beauty and skincare products. 100% pure herbal beauty solutions for glowing skin and healthy hair.',
  keywords: ['beauty products', 'natural skincare', 'herbal beauty', 'organic cosmetics', 'Pakistan'],
  openGraph: {
    title: 'Beauty Corner | Pansari Inn',
    description: 'Natural beauty and skincare products',
    type: 'website',
  },
};

export default function BeautyCornerPage() {
  return <CategoryPage categoryName="Beauty Corner" />;
}
