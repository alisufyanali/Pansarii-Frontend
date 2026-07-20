/**
 * Server-side helper for Next.js API routes proxying to Laravel.
 */

import { NextRequest, NextResponse } from 'next/server';
import { API_BASE_URL } from './api-config';

export interface LaravelProxyResult {
  ok: boolean;
  status: number;
  data: { success?: boolean; message?: string; errors?: Record<string, string[]> };
}

// ─── CSRF origin check ────────────────────────────────────────────────────────
// Accepts requests only from the app's own origin. Works for both deployed
// (NEXT_PUBLIC_APP_URL) and local dev (localhost / 127.0.0.1).

function getAllowedOrigins(): string[] {
  const origins: string[] = ['http://localhost:3000', 'http://127.0.0.1:3000'];
  const appUrl = process.env.NEXT_PUBLIC_APP_URL;
  if (appUrl) {
    try { origins.push(new URL(appUrl).origin); } catch { /* ignore bad env value */ }
  }
  return origins;
}

export function validateRequestOrigin(request: NextRequest): NextResponse | null {
  // In development we skip the check so local testing is not blocked.
  if (process.env.NODE_ENV !== 'production') return null;

  const allowed = getAllowedOrigins();
  const origin  = request.headers.get('origin');
  const referer = request.headers.get('referer');

  const source = origin ?? (referer ? new URL(referer).origin : null);

  if (!source || !allowed.some((o) => source.startsWith(o))) {
    return NextResponse.json(
      { success: false, message: 'Forbidden: invalid request origin.' },
      { status: 403 },
    );
  }
  return null;
}

export interface LaravelProxyResult {
  ok: boolean;
  status: number;
  data: { success?: boolean; message?: string; errors?: Record<string, string[]> };
}

export async function laravelPost(path: string, body: Record<string, unknown>): Promise<LaravelProxyResult> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
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
