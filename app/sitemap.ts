import { allProducts } from '@/data/products';
import { blogPosts } from '@/data/blogposts';
import { toProductSlug } from '@/lib/productSlug';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://pansariinn.com';

export default function sitemap() {
  const productUrls = allProducts.map(p => ({
    url: `${SITE_URL}/products/${toProductSlug(p.nameEn)}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

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
