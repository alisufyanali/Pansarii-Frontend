/**
 * lib/homepage.ts
 * Combined homepage endpoint — replaces the ~6 separate
 * section API calls with a single GET /api/homepage request.
 */

import { api } from './axios';
import type { ApiSlide } from './slides';
import type { ApiCategory, ApiProduct } from '@/types/product';
import type { HomepageCategorySection } from './products';
import type { HomepageReview } from './reviews';
import type { ApiBlog } from './blog';

export interface HomepageData {
  banners: ApiSlide[];
  categories: ApiCategory[];
  category_products: HomepageCategorySection[];
  video_products: ApiProduct[];
  reviews: HomepageReview[];
  blogs: ApiBlog[];
}

/** Empty payload — lets every section fall back to its DEFAULT_* constants. */
export const EMPTY_HOMEPAGE: HomepageData = {
  banners: [],
  categories: [],
  category_products: [],
  video_products: [],
  reviews: [],
  blogs: [],
};

export async function getHomepageData(): Promise<HomepageData> {
  try {
    const res = await api.get<{ success: boolean; data: HomepageData }>('/homepage');
    return res.data ?? EMPTY_HOMEPAGE;
  } catch (err) {
    if (process.env.NODE_ENV === 'development') {
      console.warn('[homepage] API unavailable, using static fallbacks:', err);
    }
    return EMPTY_HOMEPAGE;
  }
}
