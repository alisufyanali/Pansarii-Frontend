/**
 * Server-side helper for Next.js API routes proxying to Laravel.
 */

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000/api';

export interface LaravelProxyResult {
  ok: boolean;
  status: number;
  data: { success?: boolean; message?: string; errors?: Record<string, string[]> };
}

export async function laravelPost(path: string, body: Record<string, unknown>): Promise<LaravelProxyResult> {
  const res = await fetch(`${API_BASE}${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(body),
  });

  let data: LaravelProxyResult['data'] = {};
  try {
    data = (await res.json()) as LaravelProxyResult['data'];
  } catch {
    data = {};
  }

  return { ok: res.ok, status: res.status, data };
}

export function laravelErrorMessage(data: LaravelProxyResult['data'], fallback: string): string {
  if (data.errors) {
    const first = Object.values(data.errors)[0];
    if (first?.[0]) return first[0];
  }
  return data.message ?? fallback;
}
