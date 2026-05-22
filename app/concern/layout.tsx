import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Health Concerns | Pansari Inn',
  description: 'Find natural remedies and herbal solutions for your specific health concerns and wellness needs.',
};

export default function Layout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
