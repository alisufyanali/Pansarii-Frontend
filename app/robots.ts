import type { MetadataRoute } from 'next';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://pansariinn.com';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          // Transactional / account pages — no SEO value
          '/api/',
          '/checkout/',
          '/cart/',
          '/profile/',
          '/orders/',
          '/wishlist/',
          '/rewards/',
          '/change-password/',
          '/cancel-order/',
          '/track-order/',
          '/order-confirmation/',
          // Auth flows
          '/login/',
          '/register/',
          '/forgot-password/',
          '/reset-password/',
          '/reset-password-success/',
          '/check-email/',
          // Internal / utility
          '/affiliate/',   // affiliate sign-up form — not a content page
        ],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
