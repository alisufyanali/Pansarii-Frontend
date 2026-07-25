/**
 * lib/api-config.ts
 *
 * Single source of truth for the Laravel API base URL.
 * Set NEXT_PUBLIC_API_URL in .env.local (dev) or .env.production (deploy).
 */

const PRODUCTION_API_URL = 'https://custom.pansariinn.pk/api';
const DEVELOPMENT_API_URL = 'http://127.0.0.1:8000/api';

const rawUrl = process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL;
const isLocalhost = (url?: string) =>
  url ? (url.includes('localhost') || url.includes('127.0.0.1')) : false;

export const API_BASE_URL = (() => {
  if (process.env.NODE_ENV === 'production') {
    if (rawUrl && !isLocalhost(rawUrl)) {
      return rawUrl;
    }
    return PRODUCTION_API_URL;
  }
  return rawUrl ?? DEVELOPMENT_API_URL;
})();

if (!rawUrl && process.env.NODE_ENV === 'production') {
  console.warn('[api-config] API_URL / NEXT_PUBLIC_API_URL is not set — using production default.');
}

