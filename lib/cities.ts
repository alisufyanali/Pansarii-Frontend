/**
 * lib/cities.ts
 *
 * Fetch cities with per-city shipping charges.
 * Tries GET /api/cities first; falls back to the static list below when
 * the endpoint is unavailable (404 / network error).
 *
 * Forward-compatible: once the backend deploys /api/cities the frontend
 * switches automatically with no code changes required.
 */

import { api, isAxiosError } from './axios';
import type { ApiResponse } from '@/types/api';

export interface City {
  id: number;
  name: string;
  shipping_charge: number;
}

// ─── Static fallback ──────────────────────────────────────────────────────────
// Shipping charges are estimates; real values will come from the API once deployed.

const STATIC_CITIES: City[] = [
  { id: 1,  name: 'Karachi',       shipping_charge: 150 },
  { id: 2,  name: 'Lahore',        shipping_charge: 200 },
  { id: 3,  name: 'Islamabad',     shipping_charge: 250 },
  { id: 4,  name: 'Rawalpindi',    shipping_charge: 250 },
  { id: 5,  name: 'Faisalabad',    shipping_charge: 250 },
  { id: 6,  name: 'Multan',        shipping_charge: 300 },
  { id: 7,  name: 'Gujranwala',    shipping_charge: 250 },
  { id: 8,  name: 'Sialkot',       shipping_charge: 250 },
  { id: 9,  name: 'Bahawalpur',    shipping_charge: 300 },
  { id: 10, name: 'Sargodha',      shipping_charge: 300 },
  { id: 11, name: 'Hyderabad',     shipping_charge: 200 },
  { id: 12, name: 'Sukkur',        shipping_charge: 300 },
  { id: 13, name: 'Larkana',       shipping_charge: 350 },
  { id: 14, name: 'Nawabshah',     shipping_charge: 300 },
  { id: 15, name: 'Peshawar',      shipping_charge: 300 },
  { id: 16, name: 'Mardan',        shipping_charge: 350 },
  { id: 17, name: 'Abbottabad',    shipping_charge: 350 },
  { id: 18, name: 'Swat',          shipping_charge: 400 },
  { id: 19, name: 'Nowshera',      shipping_charge: 350 },
  { id: 20, name: 'Quetta',        shipping_charge: 400 },
  { id: 21, name: 'Gwadar',        shipping_charge: 400 },
  { id: 22, name: 'Turbat',        shipping_charge: 400 },
  { id: 23, name: 'Muzaffarabad',  shipping_charge: 350 },
  { id: 24, name: 'Mirpur',        shipping_charge: 350 },
];

// Default shipping charge used when no city is selected
export const DEFAULT_SHIPPING = 200;

let _cache: City[] | null = null;

/**
 * Returns an ordered city list with shipping charges.
 * Uses a one-shot in-memory cache (per page load) to avoid repeated fetches.
 */
export async function getCities(): Promise<City[]> {
  if (_cache) return _cache;

  try {
    const res = await api.get<ApiResponse<City[]>>('/cities');
    // Normalise: backend may return data as array directly or wrapped
    const raw = Array.isArray(res) ? res : (res as { data?: City[] }).data;
    if (Array.isArray(raw) && raw.length > 0) {
      _cache = raw;
      return _cache;
    }
  } catch (err) {
    // 404 = not deployed yet; any other error = treat as unavailable
    if (process.env.NODE_ENV === 'development') {
      const status = isAxiosError(err) ? err.response?.status : 'network';
      console.warn(`[cities] API unavailable (${status}), using static fallback`);
    }
  }

  _cache = STATIC_CITIES;
  return _cache;
}
