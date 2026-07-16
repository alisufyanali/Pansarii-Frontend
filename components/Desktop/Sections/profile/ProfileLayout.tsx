"use client";

/**
 * ProfileLayout — Desktop sidebar + main content wrapper for all profile pages.
 *
 * Usage:
 *   import ProfileLayout from '@/components/Desktop/Sections/profile/ProfileLayout';
 *   <ProfileLayout activeSection="orders">{children}</ProfileLayout>
 *
 * The mobile view of each page is handled by the page component itself;
 * this layout is only rendered when !isMobile via DeviceContent.
 */

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import {
  RiShoppingBagLine,
  RiHeartLine,
  RiStarLine,
  RiLockPasswordLine,
  RiHeadphoneLine,
  RiLogoutBoxRLine,
  RiUserLine,
  RiTruckLine,
} from 'react-icons/ri';
import { useAuth } from '@/context/AuthContext';

// ─── Nav items ────────────────────────────────────────────────────────────────

const NAV_SECTIONS = [
  {
    label: 'Account',
    items: [
      { id: 'profile',   label: 'My Profile',    href: '/profile',    Icon: RiUserLine        },
      { id: 'orders',    label: 'My Orders',     href: '/orders',     Icon: RiShoppingBagLine },
      { id: 'wishlist',  label: 'Wishlist',      href: '/wishlist',   Icon: RiHeartLine       },
      { id: 'rewards',   label: 'Rewards',       href: '/rewards',    Icon: RiStarLine        },
      { id: 'track',     label: 'Track an Order',href: '/track-order',Icon: RiTruckLine       },
    ],
  },
  {
    label: 'Settings',
    items: [
      { id: 'password', label: 'Change Password', href: '/change-password', Icon: RiLockPasswordLine },
      { id: 'support',  label: 'Support & Help',  href: '/support',         Icon: RiHeadphoneLine    },
    ],
  },
];

// ─── Avatar initials helper ───────────────────────────────────────────────────

function Initials({ name }: { name: string }) {
  const letters = name
    .split(' ')
    .slice(0, 2)
    .map(w => w[0]?.toUpperCase() ?? '')
    .join('');
  return (
    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-600 to-emerald-500 flex items-center justify-center flex-shrink-0 shadow-sm">
      <span className="text-white font-bold text-base leading-none">{letters}</span>
    </div>
  );
}

// ─── Sidebar ──────────────────────────────────────────────────────────────────

interface ProfileLayoutProps {
  children: React.ReactNode;
  /** Page title shown in the content header */
  title: string;
  /** Subtitle / description shown under the title */
  subtitle?: string;
}

export default function ProfileLayout({ children, title, subtitle }: ProfileLayoutProps) {
  const pathname = usePathname();
  const router   = useRouter();
  const { user, isAuthenticated, isLoading, logout } = useAuth();

  // Auth guard — redirect to login when rehydration completes and user is not signed in
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace(`/login?returnTo=${encodeURIComponent(pathname)}`);
    }
  }, [isLoading, isAuthenticated, pathname, router]);

  // Don't flash content while loading auth state
  if (isLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-2 border-green-600 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-[1920px] mx-auto px-[4%] py-8 lg:py-12">
        <div className="flex gap-8 xl:gap-10 items-start">

          {/* ── Sidebar ─────────────────────────────────────────────────── */}
          <aside className="w-64 xl:w-72 flex-shrink-0 sticky top-36">

            {/* User card */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-4">
              <div className="flex items-center gap-3 mb-4">
                <Initials name={user?.name ?? 'User'} />
                <div className="min-w-0">
                  <p className="font-bold text-gray-900 text-sm truncate">{user?.name}</p>
                  <p className="text-xs text-gray-400 truncate">{user?.email}</p>
                </div>
              </div>
              {/* Thin green divider */}
              <div className="h-px bg-gradient-to-r from-green-500 to-emerald-400 rounded-full" />
            </div>

            {/* Nav sections */}
            {NAV_SECTIONS.map(section => (
              <div key={section.label} className="bg-white rounded-2xl border border-gray-100 shadow-sm mb-3 overflow-hidden">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-4 pt-3.5 pb-2">
                  {section.label}
                </p>
                {section.items.map(({ id, label, href, Icon }) => {
                  // Match exact path or sub-path (e.g. /orders/123 highlights 'orders')
                  const isActive = pathname === href || pathname.startsWith(href + '/');
                  return (
                    <Link
                      key={id}
                      href={href}
                      className={`flex items-center gap-3 px-4 py-2.5 text-sm font-medium transition-colors group ${
                        isActive
                          ? 'bg-green-50 text-green-700'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                    >
                      <Icon
                        className={`w-4 h-4 flex-shrink-0 transition-colors ${
                          isActive ? 'text-green-600' : 'text-gray-400 group-hover:text-gray-600'
                        }`}
                      />
                      {label}
                      {isActive && (
                        <span className="ml-auto w-1.5 h-1.5 rounded-full bg-green-500" />
                      )}
                    </Link>
                  );
                })}
              </div>
            ))}

            {/* Logout */}
            <button
              onClick={() => logout()}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-red-500 hover:bg-red-50 hover:text-red-600 transition-colors rounded-2xl border border-red-100 bg-white shadow-sm"
            >
              <RiLogoutBoxRLine className="w-4 h-4 flex-shrink-0" />
              Sign Out
            </button>
          </aside>

          {/* ── Main content ─────────────────────────────────────────────── */}
          <main className="flex-1 min-w-0">
            {/* Page header */}
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
              {subtitle && (
                <p className="text-sm text-gray-500 mt-0.5">{subtitle}</p>
              )}
            </div>
            {children}
          </main>

        </div>
      </div>
    </div>
  );
}
