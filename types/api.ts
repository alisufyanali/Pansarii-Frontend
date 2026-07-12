/**
 * types/api.ts
 * Shared API response envelopes used across all lib service files.
 */

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface PaginatedMeta {
  current_page: number;
  last_page: number;
  total: number;
  per_page?: number;
  from?: number;
  to?: number;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  meta: PaginatedMeta;
}
