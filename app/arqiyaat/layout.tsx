import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Arqiyaat | Pansari Inn',
  description: 'Explore our premium collection of traditional Arqiyaat (distillates) - pure, natural herbal waters for health and wellness.',
};

export default function Layout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
