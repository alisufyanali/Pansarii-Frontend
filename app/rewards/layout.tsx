import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Rewards | Pansari Inn',
  description: 'Join our rewards program and earn points on every purchase. Exclusive benefits for loyal customers.',
};

export default function Layout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
