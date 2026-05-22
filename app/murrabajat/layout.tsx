import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Murrabajat | Pansari Inn',
  description: 'Traditional Murrabajat (herbal preserves) - delicious and nutritious herbal jams for health and vitality.',
};

export default function Layout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
