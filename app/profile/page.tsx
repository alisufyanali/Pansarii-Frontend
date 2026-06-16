"use client";

import Link from 'next/link';
import Image from 'next/image';
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
} from 'react-icons/ri';
import { FiChevronRight } from 'react-icons/fi';
import { clearAuthData, getStoredUser, api } from '@/lib/axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// ── User type ─────────────────────────────────────────────────────────────────
interface User {
  name: string;
  email: string;
  avatar?: string | null;
}

// ── App constants ─────────────────────────────────────────────────────────────
const APP_VERSION = 'v1.0.0';
// Notifications feature coming in v2
const DEFAULT_NOTIFICATION_COUNT = 0;

// ── Menu row ──────────────────────────────────────────────────────────────────

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
      {/* Icon box */}
      <div className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0">
        {icon}
      </div>

      {/* Label */}
      <span className="flex-1 text-sm font-medium text-gray-800">{label}</span>

      {/* Badge */}
      {badge !== undefined && badge > 0 && (
        <span className="w-5 h-5 rounded-full bg-green-600 text-white text-[10px] font-bold flex items-center justify-center mr-1">
          {badge > 9 ? '9+' : badge}
        </span>
      )}

      {/* Trailing (version text etc.) */}
      {trailing && (
        <span className="text-xs text-gray-400 mr-1">{trailing}</span>
      )}

      {/* Chevron */}
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

function Divider() {
  return <div className="h-px bg-gray-100 mx-4" />;
}

// ── Section label ─────────────────────────────────────────────────────────────

function SectionLabel({ text }: { text: string }) {
  return (
    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-4 pt-5 pb-2">
      {text}
    </p>
  );
}

// ── Avatar ────────────────────────────────────────────────────────────────────

function Avatar({ name, src }: { name: string; src: string | null | undefined }) {
  if (src) {
    return (
      <Image
        src={src}
        alt={name}
        width={80}
        height={80}
        className="w-20 h-20 rounded-full object-cover border-4 border-green-400"
      />
    );
  }

  // Initials fallback
  const initials = name
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? '')
    .join('');

  return (
    <div className="w-20 h-20 rounded-full bg-green-600 border-4 border-green-400 flex items-center justify-center">
      <span className="text-white text-2xl font-bold">{initials}</span>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function ProfilePage() {
  const router = useRouter();
  
  // Get user from localStorage (set during login)
  const user = getStoredUser<User>();
  
  // Notifications feature coming in v2
  const notificationCount = DEFAULT_NOTIFICATION_COUNT;

  const handleLogout = async () => {
    try {
      await api.post('/logout');
    } catch {
      // Ignore — token may already be expired
    }
    clearAuthData();
    router.push('/login');
  };

  // Redirect to login if not authenticated
  if (!user) {
    // During SSR/static pre-render `user` is null and Next's router
    // internals may touch `location` (browser-only). Guard to avoid
    // "ReferenceError: location is not defined" during build.
    if (typeof window !== 'undefined') {
      router.push('/login');
    }
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-28 font-poppins">

      {/* ── Hero / profile header ── */}
      <div
        className="relative flex flex-col items-center pt-10 pb-8 px-4"
        style={{
          background: 'linear-gradient(160deg, #0f4c2a 0%, #1a6b3a 60%, #22c55e22 100%)',
        }}
      >
        {/* Back arrow + cart icon row */}
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

        {/* Avatar with verified badge */}
        <div className="relative mt-4">
          <Avatar name={user.name} src={user.avatar} />
          {/* Verified checkmark */}
          <div className="absolute bottom-0.5 right-0.5 w-6 h-6 rounded-full bg-green-500 border-2 border-white flex items-center justify-center">
            <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
              <path d="M2 6l3 3 5-5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>

        {/* Name + email */}
        <h1 className="mt-3 text-lg font-bold text-white">{user.name}</h1>
        <p className="text-xs text-green-200 mt-0.5">{user.email}</p>
      </div>

      {/* ── Menu sections ── */}
      <div className="px-4 mt-4 space-y-3">

        {/* Account section */}
        <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
          <MenuRow
            icon={<RiShoppingBagLine className="w-4.5 h-4.5 text-green-700" />}
            label="My Orders"
            href="/orders"
          />
          <Divider />
          <MenuRow
            icon={<RiHeartLine className="w-4.5 h-4.5 text-rose-500" />}
            label="My Wishlist"
            href="/wishlist"
          />
          <Divider />
          <MenuRow
            icon={<RiBellLine className="w-4.5 h-4.5 text-amber-500" />}
            label="Notifications"
            badge={notificationCount}
            onClick={() => toast.info('Notifications coming soon!')}
          />
        </div>

        {/* Security & Support */}
        <SectionLabel text="Security & Support" />
        <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
          <MenuRow
            icon={<RiLockPasswordLine className="w-4.5 h-4.5 text-gray-500" />}
            label="Change Password"
            href="/change-password"
          />
          <Divider />
          <MenuRow
            icon={<RiHeadphoneLine className="w-4.5 h-4.5 text-blue-500" />}
            label="Contact Support"
            href="/support"
          />
          <Divider />
          <MenuRow
            icon={<RiMessage2Line className="w-4.5 h-4.5 text-purple-500" />}
            label="Give Feedback"
            href="/contact"
          />
        </div>

        {/* Application */}
        <SectionLabel text="Application" />
        <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
          <MenuRow
            icon={<RiInformationLine className="w-4.5 h-4.5 text-gray-500" />}
            label="About App"
            trailing={APP_VERSION}
          />
        </div>

        {/* Logout button */}
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
