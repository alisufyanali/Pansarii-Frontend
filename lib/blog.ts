/**
 * lib/blog.ts
 * API service functions for blogs.
 * Client-side (uses axios). For server components, use fetchBlogServer / fetchBlogsServer.
 */

import apiClient from './axios';
import { API_BASE_URL } from './api-config';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ApiBlogTag {
  id: number;
  name: string;
  color?: string;
}

export interface ApiBlogCategory {
  id: number;
  name: string;
  slug: string;
}

export interface ApiBlog {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  thumbnail: string | null;
  category: ApiBlogCategory;
  tags: ApiBlogTag[];
  created_at: string;
}

export interface ApiBlogDetail extends ApiBlog {
  content: string;
  meta_title?: string;
  meta_desc?: string;
}

export interface BlogsResponse {
  success: boolean;
  data: ApiBlog[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

export interface BlogsParams {
  search?: string;
  category_id?: number;
  tag?: string;
  per_page?: number;
  page?: number;
}

// ─── Client-side API functions ────────────────────────────────────────────────

export const getBlogs = async (params?: BlogsParams): Promise<BlogsResponse> => {
  const res = await apiClient.get<BlogsResponse>('/blogs', { params });
  return res.data;
};

// ─── Server-safe fetchers (use in Server Components / generateMetadata) ───────

export async function fetchBlogsServer(params?: BlogsParams): Promise<BlogsResponse | null> {
  try {
    const query = params
      ? '?' + new URLSearchParams(Object.entries(params).filter(([, v]) => v !== undefined).map(([k, v]) => [k, String(v)])).toString()
      : '';
    const res = await fetch(`${API_BASE_URL}/blogs${query}`, { next: { revalidate: 60 } });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export async function fetchBlogServer(slug: string): Promise<ApiBlogDetail | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/blogs/${slug}`, { next: { revalidate: 60 } });
    if (!res.ok) return null;
    const json = await res.json();
    return json.data ?? null;
  } catch {
    return null;
  }
}
