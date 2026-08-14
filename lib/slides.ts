/**
 * lib/slides.ts
 * Homepage banner slides from Laravel admin.
 */

import { api } from './axios';

export interface ApiSlide {
  id: number;
  image: string;
  video?: string | null;
  title?: string | null;
  description?: string | null;
  badge?: string | null;
  link?: string | null;
  primary_btn_label?: string | null;
  primary_btn_href?: string | null;
  secondary_btn_label?: string | null;
  secondary_btn_href?: string | null;
  /** Device target — 'desktop' or 'mobile'. Filter by this in each device-specific
   *  banner component; the shared fetch layer always returns the full unfiltered array. */
  type?: 'desktop' | 'mobile';
}

export interface BannerSlide {
  id?: number;
  image: string;
  video?: string;
  badge?: string;
  title?: string;
  description?: string;
  subtitle?: string;
  link?: string;
  primaryBtn?: { label: string; href: string };
  secondaryBtn?: { label: string; href: string };
}

/** Single fallback slide — used when API is empty or fails */
export const DEFAULT_SLIDES: BannerSlide[] = [
  {
    image: '/images/final-banner (1).jpeg',
  },
];

/** Mobile fallback banners */
export const DEFAULT_MOBILE_SLIDES: BannerSlide[] = [
  { id: 1, image: '/images/Banner.png',  title: 'Premium Ayurvedic', subtitle: 'Natural & Organic', link: '/shop'       },
  { id: 2, image: '/images/Banner2.png', title: 'Summer Sale',       subtitle: 'Up to 50% OFF',    link: '/offers'     },
  { id: 3, image: '/images/Banner3.png', title: 'New Collection',    subtitle: 'Fresh Arrivals',   link: '/newarrival' },
];

export function mapApiSlideToBanner(slide: ApiSlide): BannerSlide {
  const mapped: BannerSlide = {
    id: slide.id,
    image: slide.image || '/images/final-banner (1).jpeg',
  };

  if (slide.video) mapped.video = slide.video;
  if (slide.badge) mapped.badge = slide.badge;
  if (slide.title) mapped.title = slide.title;
  if (slide.description) mapped.description = slide.description;
  if (slide.link) mapped.link = slide.link;

  if (slide.primary_btn_label && slide.primary_btn_href) {
    mapped.primaryBtn = { label: slide.primary_btn_label, href: slide.primary_btn_href };
  }
  if (slide.secondary_btn_label && slide.secondary_btn_href) {
    mapped.secondaryBtn = { label: slide.secondary_btn_label, href: slide.secondary_btn_href };
  }

  return mapped;
}

export async function getSlides(): Promise<ApiSlide[]> {
  const res = await api.get<{ success: boolean; data: ApiSlide[] }>('/slides');
  return res.data ?? [];
}
