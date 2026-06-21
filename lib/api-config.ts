/**
 * lib/api-config.ts
 *
 * Single source of truth for the Laravel API base URL.
 * Set NEXT_PUBLIC_API_URL in .env.local (dev) or .env.production (deploy).
 */

const PRODUCTION_API_URL = 'https://custom.pansariinn.pk/api';
const DEVELOPMENT_API_URL = 'http://127.0.0.1:8000/api';

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ??
  (process.env.NODE_ENV === 'production' ? PRODUCTION_API_URL : DEVELOPMENT_API_URL);

if (!process.env.NEXT_PUBLIC_API_URL && process.env.NODE_ENV === 'production') {
  console.warn('[api-config] NEXT_PUBLIC_API_URL is not set — using production default.');
}
