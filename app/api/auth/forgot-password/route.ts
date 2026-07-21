import { NextRequest, NextResponse } from 'next/server';
import { laravelErrorMessage, laravelPost, validateRequestOrigin } from '@/lib/laravel-server';

// ─── In-process rate limiter ──────────────────────────────────────────────────
// Tracks how many password-reset requests each email address has made within
// the current 1-hour sliding window.  Module-level Map persists across
// requests within a single server process instance.
//
// Limits: max 3 requests per email per 60-minute window.
// On serverless/edge with multiple instances this only limits within one
// instance, but it still meaningfully reduces abuse from single clients.

const RATE_LIMIT_MAX    = 3;
const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 hour in ms

interface RateEntry { count: number; windowStart: number }
const rateLimitStore = new Map<string, RateEntry>();

function isRateLimited(email: string): boolean {
  const now   = Date.now();
  const entry = rateLimitStore.get(email);

  if (!entry || now - entry.windowStart > RATE_LIMIT_WINDOW) {
    // First request in this window — create/reset the entry
    rateLimitStore.set(email, { count: 1, windowStart: now });
    return false;
  }

  if (entry.count >= RATE_LIMIT_MAX) return true;

  entry.count += 1;
  return false;
}

interface ForgotPasswordRequestBody {
  email?: string;
}

interface ForgotPasswordApiResponse {
  success: boolean;
  message: string;
}

export async function POST(request: NextRequest): Promise<NextResponse<ForgotPasswordApiResponse>> {
  const csrfError = validateRequestOrigin(request);
  if (csrfError) return csrfError as NextResponse<ForgotPasswordApiResponse>;

  try {
    const body = (await request.json()) as ForgotPasswordRequestBody;
    const email = (body.email ?? '').trim().toLowerCase();

    if (!email) {
      return NextResponse.json(
        { success: false, message: 'Email is required.' },
        { status: 400 },
      );
    }

    // Check rate limit before forwarding to Laravel
    if (isRateLimited(email)) {
      return NextResponse.json(
        { success: false, message: 'Too many requests. Please try again in an hour.' },
        { status: 429 },
      );
    }

    const result = await laravelPost('/forgot-password', { email });

    if (!result.ok) {
      return NextResponse.json(
        {
          success: false,
          message: laravelErrorMessage(result.data, 'Unable to send reset link.'),
        },
        { status: result.status === 404 ? 503 : result.status },
      );
    }

    return NextResponse.json(
      {
        success: result.data.success ?? true,
        message: result.data.message ?? 'Password reset link sent successfully.',
      },
      { status: 200 },
    );
  } catch {
    return NextResponse.json(
      { success: false, message: 'Something went wrong.' },
      { status: 500 },
    );
  }
}
