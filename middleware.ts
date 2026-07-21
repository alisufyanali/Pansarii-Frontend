import { type NextRequest, NextResponse } from 'next/server';

/**
 * Protected routes — users who are not authenticated are redirected
 * to /login with a `returnTo` query param so they can come back after
 * signing in.
 *
 * This runs on the Edge before any page renders, so there is no
 * client-side flash of the protected content.
 */

const PROTECTED_PATHS = [
  '/orders',
  '/wishlist',
  '/profile',
  '/rewards',
  '/change-password',
  '/cancel-order',
];

// The token key must match the one used in lib/axios.ts
const TOKEN_KEY = 'pansari-auth-token';

function getTokenFromCookies(request: NextRequest): string | null {
  // The app stores the token in localStorage (not cookies), so it is
  // not directly readable in middleware. We use a companion cookie that
  // the client sets on login and clears on logout as a presence signal.
  // If the cookie is absent we treat the user as unauthenticated.
  return request.cookies.get(TOKEN_KEY)?.value ?? null;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isProtected = PROTECTED_PATHS.some(
    (path) => pathname === path || pathname.startsWith(path + '/'),
  );

  if (!isProtected) return NextResponse.next();

  const token = getTokenFromCookies(request);

  if (!token) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('returnTo', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/orders/:path*',
    '/wishlist/:path*',
    '/profile/:path*',
    '/rewards/:path*',
    '/change-password/:path*',
    '/cancel-order/:path*',
  ],
};
