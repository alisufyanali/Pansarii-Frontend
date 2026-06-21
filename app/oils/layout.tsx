import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Oils | Pansari Inn',
  description: 'Premium quality pure oils — cold-pressed and natural for health, cooking, and wellness.',
};

export default function Layout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
