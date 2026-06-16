import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Password Reset Successful',
  description: 'Your password has been reset successfully.',
  robots: { index: false, follow: false },
  openGraph: {
    title: 'Password Reset Successful | Pansari Inn',
    description: 'Your account password is now updated.',
  },
};

export default function ResetPasswordSuccessLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
