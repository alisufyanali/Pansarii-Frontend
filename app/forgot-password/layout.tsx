import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Forgot Password',
  description: 'Reset your Pansari Inn account password.',
  robots: { index: false, follow: false },
  openGraph: {
    title: 'Forgot Password | Pansari Inn',
    description: 'Request a password reset link.',
  },
};

export default function ForgotPasswordLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
