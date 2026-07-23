/**
 * app/products/[slug]/page.tsx
 *
 * Legacy route — 301 redirect to the canonical /{slug} URL.
 * Preserves SEO equity from any existing external links to /products/{slug}.
 */

import { permanentRedirect } from 'next/navigation';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function ProductsSlugRedirect({ params }: PageProps) {
  const { slug } = await params;
  permanentRedirect(`/${slug}`);
}
