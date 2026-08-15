"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  FaFacebook,
  FaLinkedin,
  FaWhatsapp,
  FaArrowLeft,
  FaShare,
} from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

interface SocialShare {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  color: string;
  href: string;
}



/**
 * Thin client wrapper for the two interactive elements on the blog detail page:
 *  1. "Back to Blog" button (needs useRouter)
 *  2. Mobile share dropdown (needs useState)
 *
 * Everything else on the page is rendered server-side.
 */
export function BackButton() {
  const router = useRouter();
  return (
    <button
      onClick={() => router.back()}
      className="flex items-center gap-2 text-gray-600 hover:text-[#197B33] transition-colors text-sm font-medium"
    >
      <FaArrowLeft className="text-xs" />
      <span>Back to Blog</span>
    </button>
  );
}

export function MobileShareButton({ title }: { title: string }) {
  const [open, setOpen] = useState(false);

  // Build share URLs client-side where window is available
  const url = typeof window !== "undefined" ? window.location.href : "";

  const shares: SocialShare[] = [
    {
      icon: FaFacebook,
      label: "Facebook",
      color: "bg-blue-600",
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    },
    {
      icon: FaXTwitter,
      label: "X",
      color: "bg-black",
      href: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
    },
    {
      icon: FaLinkedin,
      label: "LinkedIn",
      color: "bg-blue-700",
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
    },
    {
      icon: FaWhatsapp,
      label: "WhatsApp",
      color: "bg-green-600",
      href: `https://wa.me/?text=${encodeURIComponent(`${title} ${url}`)}`,
    },
  ];

  return (
    <div className="relative sm:hidden">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 px-3 py-1.5 bg-green-50 text-[#197B33] rounded-full text-xs font-semibold"
        aria-label="Share this article"
        aria-expanded={open}
      >
        <FaShare className="text-xs" />
        Share
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 bg-white rounded-xl shadow-xl border p-3 flex gap-2 z-20">
          {shares.map((s) => (
            <a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Share on ${s.label}`}
              className={`w-8 h-8 ${s.color} text-white rounded-full flex items-center justify-center hover:opacity-90 transition-opacity`}
            >
              <s.icon className="text-xs" />
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

/** Desktop share bar — static links, no state needed, but kept here
 *  alongside MobileShareButton so share URL logic stays in one place. */
export function DesktopShareBar({ title }: { title: string }) {
  const url = typeof window !== "undefined" ? window.location.href : "";

  const shares: SocialShare[] = [
    {
      icon: FaFacebook,
      label: "Facebook",
      color: "bg-blue-600",
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    },
    {
      icon: FaXTwitter,
      label: "X",
      color: "bg-black",
      href: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
    },
    {
      icon: FaLinkedin,
      label: "LinkedIn",
      color: "bg-blue-700",
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
    },
    {
      icon: FaWhatsapp,
      label: "WhatsApp",
      color: "bg-green-600",
      href: `https://wa.me/?text=${encodeURIComponent(`${title} ${url}`)}`,
    },
  ];

  return (
    <div className="hidden sm:flex items-center gap-2">
      <span className="text-xs text-gray-400 mr-1">Share:</span>
      {shares.map((s) => (
        <a
          key={s.label}
          href={s.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Share on ${s.label}`}
          className={`w-8 h-8 ${s.color} text-white rounded-full flex items-center justify-center hover:opacity-90 transition-opacity`}
        >
          <s.icon className="text-xs" />
        </a>
      ))}
    </div>
  );
}
