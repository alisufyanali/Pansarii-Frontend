import { allProducts } from '@/data/products';
import { blogPosts } from '@/data/blogposts';

export default function sitemap() {
  const productUrls = allProducts.map(p => ({
    url: `https://pansariinn.com/products/${p.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  const blogUrls = blogPosts.map(p => ({
    url: `https://pansariinn.com/blog/${p.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  return [
    { url: 'https://pansariinn.com', priority: 1.0 },
    { url: 'https://pansariinn.com/shop', priority: 0.9 },
    ...productUrls,
    ...blogUrls,
  ];
}
