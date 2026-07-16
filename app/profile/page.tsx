"use client";

import Link from 'next/link';
import SafeImage from '@/components/SafeImage';
import { useRouter } from 'next/navigation';
import {
  RiShoppingBagLine,
  RiHeartLine,
  RiBellLine,
  RiLockPasswordLine,
  RiHeadphoneLine,
  RiMessage2Line,
  RiInformationLine,
  RiLogoutBoxRLine,
  RiStarLine,
  RiTruckLine,
  RiShieldCheckLine,
} from 'react-icons/ri';
import { FiChevronRight, FiPackage, FiHeart, FiAward } from 'react-icons/fi';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAuth } from '@/context/AuthContext';
import { DeviceContent } from '@/hooks/useDeviceDetection';
import ProfileLayout from '@/components/Desktop/Sections/profile/ProfileLayout';

// ── Constants ─────────────────────────────────────────────────────────────────
const APP_VERSION = 'v1.0.0';

// ─────────────────────────────────────────────────────────────────────────────
// SHARED HELPERS (used by both mobile and desktop)
// ─────────────────────────────────────────────────────────────────────────────

function buildInitials(name: string): string {
  return name
    .split(' ')
    .slice(0, 2)
    .map(w => w[0]?.toUpperCase() ?? '')
    .join('');
}

// ─────────────────────────────────────────────────────────────────────────────
// MOBILE-ONLY HELPERS
// ─────────────────────────────────────────────────────────────────────────────

interface MenuRowProps {
  icon: React.ReactNode;
  label: string;
  href?: string;
  badge?: number;
  trailing?: React.ReactNode;
  onClick?: () => void;
}

function MenuRow({ icon, label, href, badge, trailing, onClick }: MenuRowProps) {
  const inner = (
    <div className="flex items-center gap-3 px-4 py-3.5">
      <div className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0">
        {icon}
      </div>
      <span className="flex-1 text-sm font-medium text-gray-800">{label}</span>
      {badge !== undefined && badge > 0 && (
        <span className="w-5 h-5 rounded-full bg-green-600 text-white text-[10px] font-bold flex items-center justify-center mr-1">
          {badge > 9 ? '9+' : badge}
        </span>
      )}
      {trailing && <span className="text-xs text-gray-400 mr-1">{trailing}</span>}
      <FiChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="block hover:bg-gray-50 active:bg-gray-100 transition-colors">
        {inner}
      </Link>
    );
  }
  return (
    <button onClick={onClick} className="w-full text-left hover:bg-gray-50 active:bg-gray-100 transition-colors">
      {inner}
    </button>
  );
}

function MobileDivider() {
  return <div className="h-px bg-gray-100 mx-4" />;
}

function SectionLabel({ text }: { text: string }) {
  return (
    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-4 pt-5 pb-2">
      {text}
    </p>
  );
}

function MobileAvatar({ name, src }: { name: string; src?: string | null }) {
  if (src) {
    return (
      <SafeImage
        src={src}
        alt={name}
        width={80}
        height={80}
        className="w-20 h-20 rounded-full object-cover border-4 border-green-400"
      />
    );
  }
  return (
    <div className="w-20 h-20 rounded-full bg-green-600 border-4 border-green-400 flex items-center justify-center">
      <span className="text-white text-2xl font-bold">{buildInitials(name)}</span>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MOBILE VIEW  (unchanged from original)
// ─────────────────────────────────────────────────────────────────────────────

function MobileProfileView() {
  const router = useRouter();
  const { user, logout } = useAuth();

  if (!user) return null;

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-28 font-poppins">

      {/* Hero */}
      <div
        className="relative flex flex-col items-center pt-10 pb-8 px-4"
        style={{ background: 'linear-gradient(160deg, #0f4c2a 0%, #1a6b3a 60%, #22c55e22 100%)' }}
      >
        <div className="absolute top-4 left-0 right-0 flex items-center justify-between px-4">
          <button
            onClick={() => router.back()}
            className="p-1.5 rounded-full bg-white/10 text-white"
            aria-label="Go back"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 5l-7 7 7 7" />
            </svg>
          </button>
          <Link href="/cart" className="p-1.5 rounded-full bg-white/10 text-white" aria-label="Cart">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 01-8 0" />
            </svg>
          </Link>
        </div>

        <div className="relative mt-4">
          <MobileAvatar name={user.name} src={null} />
          <div className="absolute bottom-0.5 right-0.5 w-6 h-6 rounded-full bg-green-500 border-2 border-white flex items-center justify-center">
            <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
              <path d="M2 6l3 3 5-5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>

        <h1 className="mt-3 text-lg font-bold text-white">{user.name}</h1>
        <p className="text-xs text-green-200 mt-0.5">{user.email}</p>
      </div>

      {/* Menu sections */}
      <div className="px-4 mt-4 space-y-3">
        <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
          <MenuRow icon={<RiShoppingBagLine className="w-4.5 h-4.5 text-green-700" />} label="My Orders" href="/orders" />
          <MobileDivider />
          <MenuRow icon={<RiHeartLine className="w-4.5 h-4.5 text-rose-500" />} label="My Wishlist" href="/wishlist" />
          <MobileDivider />
          <MenuRow
            icon={<RiBellLine className="w-4.5 h-4.5 text-amber-500" />}
            label="Notifications"
            onClick={() => toast.info('Notifications coming soon!')}
          />
        </div>

        <SectionLabel text="Security & Support" />
        <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
          <MenuRow icon={<RiLockPasswordLine className="w-4.5 h-4.5 text-gray-500" />} label="Change Password" href="/change-password" />
          <MobileDivider />
          <MenuRow icon={<RiHeadphoneLine className="w-4.5 h-4.5 text-blue-500" />} label="Contact Support" href="/support" />
          <MobileDivider />
          <MenuRow icon={<RiMessage2Line className="w-4.5 h-4.5 text-purple-500" />} label="Give Feedback" href="/contact" />
        </div>

        <SectionLabel text="Application" />
        <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
          <MenuRow icon={<RiInformationLine className="w-4.5 h-4.5 text-gray-500" />} label="About App" trailing={APP_VERSION} />
        </div>

        <button
          onClick={handleLogout}
          className="w-full mt-2 py-3.5 rounded-2xl border-2 border-red-400 text-red-500 font-semibold text-sm flex items-center justify-center gap-2 bg-white hover:bg-red-50 active:bg-red-100 transition-colors"
        >
          <RiLogoutBoxRLine className="w-4.5 h-4.5" />
          Logout
        </button>
      </div>

      <ToastContainer position="top-right" autoClose={3000} theme="light" />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// DESKTOP VIEW
// ─────────────────────────────────────────────────────────────────────────────

function DesktopProfileView() {
  const { user } = useAuth();

  if (!user) return null;

  const quickLinks = [
    { label: 'My Orders',    sub: 'View order history',    href: '/orders',    Icon: FiPackage, color: 'bg-green-50 text-green-700',  border: 'border-green-100'  },
    { label: 'Wishlist',     sub: 'Saved products',        href: '/wishlist',  Icon: FiHeart,   color: 'bg-rose-50 text-rose-600',    border: 'border-rose-100'   },
    { label: 'Rewards',      sub: 'Points & perks',        href: '/rewards',   Icon: FiAward,   color: 'bg-amber-50 text-amber-600',  border: 'border-amber-100'  },
    { label: 'Track Order',  sub: 'Locate a shipment',     href: '/track-order', Icon: RiTruckLine, color: 'bg-blue-50 text-blue-600', border: 'border-blue-100' },
  ];

  const accountLinks = [
    { label: 'Change Password', href: '/change-password', Icon: RiLockPasswordLine, desc: 'Update your login credentials' },
    { label: 'Contact Support',  href: '/support',         Icon: RiHeadphoneLine,    desc: 'Get help from our team'         },
    { label: 'Give Feedback',    href: '/contact',         Icon: RiMessage2Line,     desc: 'Share your thoughts'            },
  ];

  return (
    <ProfileLayout title="My Profile" subtitle="Manage your account information">
      <div className="space-y-6">

        {/* Profile card */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          {/* Green gradient banner */}
          <div className="h-24 bg-gradient-to-r from-green-700 via-emerald-600 to-teal-600" />
          <div className="px-6 pb-6">
            {/* Avatar overlapping banner */}
            <div className="relative -mt-10 mb-4 flex items-end justify-between">
              <div className="relative">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-green-600 to-emerald-500 border-4 border-white shadow-md flex items-center justify-center">
                  <span className="text-white text-2xl font-bold">{buildInitials(user.name)}</span>
                </div>
                <div className="absolute bottom-0.5 right-0.5 w-5 h-5 rounded-full bg-green-500 border-2 border-white flex items-center justify-center">
                  <RiShieldCheckLine className="w-2.5 h-2.5 text-white" />
                </div>
              </div>
              <Link
                href="/change-password"
                className="text-sm font-semibold text-green-700 hover:text-green-800 border border-green-200 hover:border-green-300 px-4 py-1.5 rounded-full transition-colors bg-green-50 hover:bg-green-100"
              >
                Edit Account
              </Link>
            </div>

            {/* Name, email, phone */}
            <h2 className="text-xl font-bold text-gray-900">{user.name}</h2>
            <p className="text-sm text-gray-500 mt-0.5">{user.email}</p>
            {user.phone && (
              <p className="text-sm text-gray-500 mt-0.5">{user.phone}</p>
            )}
          </div>
        </div>

        {/* Quick-access grid */}
        <div>
          <h3 className="text-sm font-semibold text-gray-500 mb-3">Quick Access</h3>
          <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
            {quickLinks.map(({ label, sub, href, Icon, color, border }) => (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 p-4 bg-white rounded-xl border ${border} shadow-sm hover:shadow-md transition-shadow group`}
              >
                <div className={`w-10 h-10 rounded-xl ${color.split(' ')[0]} flex items-center justify-center flex-shrink-0`}>
                  <Icon className={`w-5 h-5 ${color.split(' ')[1]}`} />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-gray-900 group-hover:text-green-700 transition-colors">{label}</p>
                  <p className="text-xs text-gray-400 truncate">{sub}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Account settings */}
        <div>
          <h3 className="text-sm font-semibold text-gray-500 mb-3">Account Settings</h3>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm divide-y divide-gray-50">
            {accountLinks.map(({ label, href, Icon, desc }) => (
              <Link
                key={href}
                href={href}
                className="flex items-center gap-4 px-5 py-4 hover:bg-gray-50 transition-colors group"
              >
                <div className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0 group-hover:bg-green-50 transition-colors">
                  <Icon className="w-4 h-4 text-gray-500 group-hover:text-green-600 transition-colors" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">{label}</p>
                  <p className="text-xs text-gray-400">{desc}</p>
                </div>
                <FiChevronRight className="w-4 h-4 text-gray-300 group-hover:text-gray-500 transition-colors" />
              </Link>
            ))}
          </div>
        </div>

        {/* App info */}
        <div className="bg-gray-50 rounded-xl border border-gray-100 px-5 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <RiStarLine className="w-4 h-4 text-green-600" />
            <span>Pansari Inn — 100% Ayurvedic &amp; Herbal Products</span>
          </div>
          <span className="text-xs text-gray-400 font-medium">{APP_VERSION}</span>
        </div>

      </div>
    </ProfileLayout>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PAGE EXPORT — DeviceContent routes to the right view
// ─────────────────────────────────────────────────────────────────────────────

export default function ProfilePage() {
  return (
    <>
      <DeviceContent
        mobile={<MobileProfileView />}
        desktop={<DesktopProfileView />}
      />
      {/* ToastContainer for mobile view (desktop uses layout-level one) */}
    </>
  );
}
