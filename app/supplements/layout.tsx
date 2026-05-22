import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Supplements | Pansari Inn',
  description: 'Natural herbal supplements and nutritional products for optimal health and wellness support.',
};

export default function Layout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
