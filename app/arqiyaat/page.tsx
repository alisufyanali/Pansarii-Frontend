import type { Metadata } from 'next';
import CategoryPage from '@/components/Desktop/Sections/CategoryPage';

export const metadata: Metadata = {
  title: 'Arqiyaat | Pansari Inn',
  description: 'Premium Arqiyaat (herbal distillates) collection. Pure and natural herbal waters for health and wellness.',
  keywords: ['arqiyaat', 'herbal distillates', 'herbal water', 'natural remedies', 'Pakistan'],
  openGraph: {
    title: 'Arqiyaat | Pansari Inn',
    description: 'Premium Arqiyaat (herbal distillates) collection',
    type: 'website',
  },
};

export default function ArqiyaatPage() {
  return <CategoryPage categoryName="Arqiyaat" />;
}
