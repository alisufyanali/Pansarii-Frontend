/**
 * Profile route layout
 * ────────────────────
 * The profile page has its own header (back arrow + cart icon built into the page).
 * We suppress the global site header, site footer, and bottom nav here,
 * then render our own BottomNav so the tab bar still shows.
 *
 * This layout is used on BOTH mobile and desktop — on desktop the profile
 * page will still render cleanly (it's a mobile-first design).
 */

import BottomNav from '@/components/Mobile/components/BottomNav';

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <BottomNav />
    </>
  );
}
