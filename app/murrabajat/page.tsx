import type { Metadata } from 'next';
import CategoryPage from '@/components/Desktop/Sections/CategoryPage';

export const metadata: Metadata = {
  title: 'Murrabajat | Pansari Inn',
  description: 'Traditional Murrabajat (herbal preserves) - delicious and healthy herbal jams and preserves made with natural ingredients.',
  keywords: ['murrabajat', 'herbal preserves', 'herbal jam', 'natural sweets', 'Pakistan'],
  openGraph: {
    title: 'Murrabajat | Pansari Inn',
    description: 'Traditional Murrabajat (herbal preserves)',
    type: 'website',
  },
};

export default function MurrabajatPage() {
  return <CategoryPage categoryName="Murrabajat" />;
}
