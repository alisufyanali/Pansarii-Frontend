/**
 * Wishlist route layout
 * ─────────────────────
 * Suppresses the global site header/footer.
 * The wishlist page has its own back-arrow header built in.
 * BottomNav is still rendered so tab bar stays visible.
 */

import BottomNav from '@/components/Mobile/components/BottomNav';

export default function WishlistLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <BottomNav />
    </>
  );
}
