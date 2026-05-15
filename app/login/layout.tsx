import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Login',
  description: 'Sign in to your Pansari Inn account to track orders, manage your wishlist, and checkout faster.',
  robots: { index: false, follow: false },
  openGraph: {
    title: 'Login | Pansari Inn',
    description: 'Sign in to your Pansari Inn account.',
  },
};

export default function LoginLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
