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
  featured_products?: ApiProduct[];
  video_products: ApiProduct[];
  reviews: HomepageReview[];
  blogs: ApiBlog[];
  /** Undefined only before the homepage request resolves (initial EMPTY_HOMEPAGE). */
  new_arrivals?: ApiProduct[];
}

/** Empty payload — lets every section fall back to its DEFAULT_* constants. */
export const EMPTY_HOMEPAGE: HomepageData = {
  banners: [],
  categories: [],
  category_products: [],
  featured_products: undefined,
  video_products: [],
  reviews: [],
  blogs: [],
  new_arrivals: undefined,
};

export async function getHomepageData(): Promise<HomepageData> {
  try {
    const res = await api.get<{ success: boolean; data: HomepageData }>('/homepage');
    const data = res.data ?? EMPTY_HOMEPAGE;
    return {
      ...EMPTY_HOMEPAGE,
      ...data,
      new_arrivals:     data.new_arrivals     ?? [],
      featured_products: data.featured_products ?? [],
    };
  } catch (err) {
    console.error('[homepage] getHomepageData failed, falling back to empty:', err);
    return { ...EMPTY_HOMEPAGE, new_arrivals: [], featured_products: [] };
  }
}
