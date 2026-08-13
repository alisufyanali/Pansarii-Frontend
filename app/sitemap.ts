import { blogPosts } from '@/data/blogposts';
import { getProducts } from '@/lib/products';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://pansariinn.com';

export default async function sitemap() {
  // Fetch real slugs from the API — name-derived slugs (e.g. "grape-vinegar")
  // do not match actual API slugs (e.g. "grapevinegar") and would generate
  // wrong URLs that get indexed by search engines as 404s.
  let productUrls: { url: string; lastModified: Date; changeFrequency: 'weekly'; priority: number }[] = [];
  try {
    // Fetch up to 500 products in one request to cover the full catalogue.
    const res = await getProducts({ per_page: 500, page: 1 });
    productUrls = res.data
      .filter(p => p.slug)   // only include products with a real API slug
      .map(p => ({
        url: `${SITE_URL}/${p.slug}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
      }));
  } catch {
    // API unavailable at sitemap generation time — emit an empty product list
    // rather than wrong name-derived URLs. Bots will re-crawl on the next
    // successful build.
    console.error('[sitemap] Failed to fetch product slugs from API — product URLs omitted.');
  }

  const blogUrls = blogPosts.map(p => ({
    url: `${SITE_URL}/blog/${p.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  return [
    { url: SITE_URL, priority: 1.0 },
    { url: `${SITE_URL}/shop`, priority: 0.9 },
    ...productUrls,
    ...blogUrls,
  ];
}
