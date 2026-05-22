import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Herbs | Pansari Inn',
  description: 'Premium quality herbs and botanical ingredients - sourced naturally for your health and wellness.',
};

export default function Layout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
