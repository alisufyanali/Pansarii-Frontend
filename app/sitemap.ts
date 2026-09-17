import { getProducts } from '@/lib/products';
import { fetchBlogsServer } from '@/lib/blog';
import { blogPosts } from '@/data/blogposts';
import type { MetadataRoute } from 'next';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://pansariinn.com';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // ── Products ─────────────────────────────────────────────────────────────
  // Fetch real API slugs so name-derived slugs are never emitted.
  // Only the canonical /{slug} URL is included — /products/{slug} redirects.
  let productUrls: MetadataRoute.Sitemap = [];
  try {
    const res = await getProducts({ per_page: 500, page: 1 });
    productUrls = res.data
      .filter(p => p.slug)
      .map(p => ({
        url: `${SITE_URL}/${p.slug}`,
        lastModified: new Date('2025-01-01'),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
      }));
  } catch {
    console.error('[sitemap] Failed to fetch product slugs — product URLs omitted.');
  }

  // ── Blog posts ────────────────────────────────────────────────────────────
  // Prefer API data (fresh slugs + real dates); fall back to static blogPosts.
  let blogUrls: MetadataRoute.Sitemap = [];
  try {
    const res = await fetchBlogsServer({ per_page: 200 });
    if (res?.data?.length) {
      blogUrls = res.data.map(p => ({
        url: `${SITE_URL}/blog/${p.slug}`,
        lastModified: p.created_at ? new Date(p.created_at) : new Date('2025-01-01'),
        changeFrequency: 'monthly' as const,
        priority: 0.6,
      }));
    } else {
      throw new Error('No blog posts from API');
    }
  } catch {
    // Static fallback
    blogUrls = blogPosts.map(p => ({
      url: `${SITE_URL}/blog/${p.slug}`,
      lastModified: p.date ? new Date(p.date) : new Date('2025-01-01'),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    }));
  }

  // ── Static / category pages ───────────────────────────────────────────────
  const now = new Date();

  return [
    // Homepage
    { url: SITE_URL,               lastModified: now, changeFrequency: 'daily',   priority: 1.0 },

    // Core shop / discovery
    { url: `${SITE_URL}/shop`,     lastModified: now, changeFrequency: 'daily',   priority: 0.9 },
    { url: `${SITE_URL}/newarrival`,                  changeFrequency: 'weekly',  priority: 0.8 },
    { url: `${SITE_URL}/category`,                    changeFrequency: 'weekly',  priority: 0.7 },

    // Category pages
    { url: `${SITE_URL}/herb`,                        changeFrequency: 'weekly',  priority: 0.8 },
    { url: `${SITE_URL}/oils`,                        changeFrequency: 'weekly',  priority: 0.8 },
    { url: `${SITE_URL}/supplements`,                 changeFrequency: 'weekly',  priority: 0.8 },
    { url: `${SITE_URL}/spices`,                      changeFrequency: 'weekly',  priority: 0.8 },
    { url: `${SITE_URL}/remedies`,                    changeFrequency: 'weekly',  priority: 0.8 },
    { url: `${SITE_URL}/murrabajat`,                  changeFrequency: 'weekly',  priority: 0.7 },
    { url: `${SITE_URL}/arqiyaat`,                    changeFrequency: 'weekly',  priority: 0.7 },
    { url: `${SITE_URL}/beauty-corner`,               changeFrequency: 'weekly',  priority: 0.7 },
    { url: `${SITE_URL}/dawakhana`,                   changeFrequency: 'weekly',  priority: 0.7 },
    { url: `${SITE_URL}/concern`,                     changeFrequency: 'weekly',  priority: 0.7 },

    // Blog listing
    { url: `${SITE_URL}/blog`,                        changeFrequency: 'daily',   priority: 0.8 },

    // Brand / informational
    { url: `${SITE_URL}/aboutus`,                     changeFrequency: 'monthly', priority: 0.6 },
    { url: `${SITE_URL}/our-story`,                   changeFrequency: 'monthly', priority: 0.5 },
    { url: `${SITE_URL}/contact`,                     changeFrequency: 'monthly', priority: 0.6 },
    { url: `${SITE_URL}/our-commitment-to-quality`,   changeFrequency: 'monthly', priority: 0.5 },

    // Policy pages
    { url: `${SITE_URL}/shipping-info`,               changeFrequency: 'monthly', priority: 0.5 },
    { url: `${SITE_URL}/faqs`,                        changeFrequency: 'monthly', priority: 0.6 },
    { url: `${SITE_URL}/pricing-policy`,              changeFrequency: 'monthly', priority: 0.4 },
    { url: `${SITE_URL}/returns`,                     changeFrequency: 'monthly', priority: 0.4 },

    // Dynamic URL blocks
    ...productUrls,
    ...blogUrls,
  ];
}
