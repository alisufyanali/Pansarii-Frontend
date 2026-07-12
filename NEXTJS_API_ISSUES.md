# Next.js Frontend — API Integration Audit

Scope: full frontend API integration (data fetching, error handling, loading, type safety,
duplicate calls, env config, auth/cart edge cases, race conditions, pagination, image
fallbacks, SEO metadata).

Severity legend: 🔴 Critical · 🟠 High · 🟡 Medium · 🟢 Low

> Note: a previous task consolidated the homepage to a single `GET /api/homepage` call
> (`lib/homepage.ts`) — that is no longer a duplicate-call problem and is excluded below.

---

## 🔴 CRITICAL

### C1 — Guest cart/wishlist merge can silently DROP items (data loss)
❌ Issue
When merging a guest cart/wishlist into the API after login, each item is added in a loop.
If an individual `addToCartApi` / `addToWishlistApi` call fails, the failure is only
**logged/toasted and the loop continues**, then `clearLocalCart()` / `clearLocalWishlist()`
is called **unconditionally**. Any item that failed to merge is therefore permanently lost,
and the local copy is wiped regardless of outcome. There is also no transaction/rollback:
if the final `syncFromApi()` fails, the user can end up with an empty cart.

📁 File
- `context/CartContext.tsx:222-238` (`mergeGuestCart`) — `clearLocalCart()` at line 235
- `context/CartContext.tsx:146-154` (mount-time merge) — `clearLocalCart()` at line 154
- `context/WishList.tsx:230-241` (`mergeGuestWishlist`) — `clearLocalWishlist()` at line 239

🔧 Suggested fix
- Only `clearLocalCart()` **after** a successful `syncFromApi()`, and only for items that
  were confirmed merged (track successes; keep failed items in localStorage for retry).
- On per-item failure, retry once, then keep the item locally with a non-blocking warning
  instead of dropping it.
- Wrap the whole merge in a transaction-like guard: clear local state only when
  `syncFromApi()` resolves successfully.

### C2 — Guest merge discards everything if the final sync fails
❌ Issue
`mergeGuestCart` clears local storage first (line 235) then awaits `syncFromApi()`
(line 236). `syncFromApi` catches its own error and leaves `cartItems` empty. So a network
blip during the final sync = guest items gone AND server items not loaded → empty cart.

📁 File
- `context/CartContext.tsx:235-237`
- `context/WishList.tsx:239-240`

🔧 Suggested fix
Reverse the order: `await syncFromApi()` first; clear local storage only on success. Keep a
fallback snapshot in memory until the sync is confirmed.

---

## 🟠 HIGH

### H1 — Categories fetched separately in 5 places with no caching
❌ Issue
`getCategories()` hits `GET /categories` independently on every page that needs it. There is
no `React.cache()` (server) or shared client cache/SWR, so navigating between pages refetches
the same near-static list repeatedly. On mobile the menu even refetches each time it opens.

📁 File
- `components/Desktop/components/navbar.tsx:89-102`
- `components/Mobile/components/MenuModal.tsx:53-66`
- `app/category/page.tsx:102-104`
- `components/Desktop/Sections/shop/index.tsx:131-132`
- `components/Desktop/Sections/CategoryPage.tsx:333`

🔧 Suggested fix
- Server: wrap `getCategories` in React `cache()` and reuse in server components.
- Client: memoize with SWR/`useSWR` (or a module-level promise singleton) so the first call
  is shared across components for the session.
- Categories rarely change — add a short TTL / revalidate (e.g. 60s).

### H2 — Missing image fallbacks on most API-sourced `next/image`
❌ Issue
Only **6** of **~61** `next/image` usages have an `onError` fallback. Product/cart/wishlist/
review thumbnails come from the API and can be `null` or 404. With `next/image`, a null/
broken `src` renders as a broken-image placeholder (or throws for `undefined` src), hurting UX
across cart, wishlist, reviews, product cards, blog cards, search results, etc.

📁 File (no `onError`, API-sourced)
- `components/Desktop/components/ProductCard.tsx:41`
- `components/Mobile/components/ProductCard.tsx:39`
- `components/Desktop/components/ReviewCard.tsx:82` (`review.productImage` / `review.img`)
- `components/Desktop/components/BlogCard.tsx:28`
- `app/cart/page.tsx`, `app/wishlist/page.tsx`, `app/orders/page.tsx`, `app/profile/page.tsx`
- `components/Desktop/components/navbar/searchbar.tsx:308`, `sidebar.tsx`, search UIs

🔧 Suggested fix
- Add a shared `<SafeImage>` wrapper around `next/image` that renders a default
  (`/images/product.png`) on `onError` and coerces empty/`null` URLs to the default before
  render (so `next/image` never receives `undefined`).
- Replace the bare `<Image>` usages above with `<SafeImage>`.

---

## 🟡 MEDIUM

### M1 — No request cancellation → stale/race data on pagination & search
❌ Issue
Paginated/searchable lists fire a new request on every page/filter/keyword change but never
abort the previous one. If a slower earlier response arrives after a faster later one, the
UI shows the **wrong page/filter result** (out-of-order resolution). No `AbortController`.

📁 File
- `app/blog/page.tsx:158-218` (`fetchPosts`)
- `app/category/page.tsx:122-156` (`fetchProducts`)
- `components/Desktop/Sections/shop/index.tsx` (product fetch effect)

🔧 Suggested fix
Attach an `AbortController` per fetch and abort it in the effect cleanup; ignore resolved
responses whose controller was aborted.

### M2 — `generateMetadata` + page fetch the same resource twice (server)
❌ Issue
For product & blog detail pages, the API is called once in `generateMetadata` and again in the
page component (and `generateStaticParams` calls it a third time for blogs). That is 2–3
identical requests per render with no memoization.

📁 File
- `app/products/[slug]/page.tsx:16` + `:152` (`fetchApiProduct`)
- `app/blog/[slug]/page.tsx:25,39,78,84` (`fetchBlogServer` / `fetchBlogsServer`)

🔧 Suggested fix
Fetch once in the page (or a cached server helper) and reuse for metadata via
`React.cache()`; for static generation, cache the list so `generateMetadata` reads from it.

### M3 — Raw `apiClient` calls have no try/catch (throw-to-caller pattern)
❌ Issue
`cart.ts`, `wishlist.ts`, `coupons.ts`, `contact.ts`, `orders.ts` call the raw `apiClient`
with **no try/catch** — they always throw. Callers (CartContext, WishList, checkout, profile)
mostly catch, but there is no centralized fallback/normalization and one missed `await` swallows
the error silently. Inconsistent with the `api` wrapper used elsewhere (which is also
try/catch-less but returns the body).

📁 File
- `lib/cart.ts`, `lib/wishlist.ts`, `lib/coupons.ts`, `lib/contact.ts`, `lib/orders.ts`

🔧 Suggested fix
- Centralize: add small wrappers (`getOrThrow` + a `safe*` variant) or standardize on one
  client. Provide a single normalized error shape and a default user-facing message so every
  caller shows consistent UI.

### M4 — API response types are inline & duplicated, not centralized
❌ Issue
Response shapes like `{ success: boolean; data: ... }` are re-declared inline at every call
site (`products.ts`, `reviews.ts`, `slides.ts`, `blog.ts`, `orders.ts`, `coupons.ts`, …).
`types/product.ts` holds domain types but **not** the API envelope/response contracts, so
drift is likely and there is no single source of truth for `ApiProduct`, `ApiOrder`, etc.
No `any` was found in app code (good), but the duplication is a maintenance/type-safety risk.

📁 File
- `lib/products.ts`, `lib/reviews.ts`, `lib/slides.ts`, `lib/blog.ts`, `lib/orders.ts`,
  `lib/coupons.ts`, `types/product.ts`

🔧 Suggested fix
Introduce `types/api.ts` with a generic `ApiResponse<T>` envelope and explicit `Api*`
response interfaces; have each lib function import them instead of redefining inline.

---

## 🟢 LOW

### L1 — Silent API errors in navbar / mobile menu (no toast)
❌ Issue
`getCategories()` failures in the navbar and mobile menu are swallowed with an empty
`.catch(() => {})` and only fall back to static categories. No user-facing message.
Acceptable because a static fallback exists, but failures are invisible.

📁 File
- `components/Desktop/components/navbar.tsx:101`
- `components/Mobile/components/MenuModal.tsx:65`

🔧 Suggested fix
Optionally `console.warn` in dev only (already done elsewhere) — low priority since UI
degrades gracefully.

### L2 — Homepage fetch failure has no user-facing UI
❌ Issue
`getHomepageData()` (`lib/homepage.ts`) only `console.warn`s on failure and returns
`EMPTY_HOMEPAGE`, so every section silently shows its `DEFAULT_*` static fallback. No toast.
This is acceptable (graceful degradation) but the user isn't told the live data failed.

📁 File
- `lib/homepage.ts:28-40`

🔧 Suggested fix
Optional: surface a single non-blocking "Showing offline content" toast in dev/staging.

### L3 — `next.config.ts` CSP whitelists localhost/127.0.0.1 in production
❌ Issue
`images.remotePatterns` includes `localhost` and `127.0.0.1`, and the CSP `connect-src`
allows `http://localhost:8000` and `http://127.0.0.1:8000`. These ship in the production
build, leaking dev endpoints and weakening the CSP.

📁 File
- `next.config.ts:21,27,56`

🔧 Suggested fix
Drive image hosts and CSP via env (e.g. derive from `process.env.NEXT_PUBLIC_API_URL`);
exclude `localhost`/`127.0.0.1` when `NODE_ENV === 'production'`.
(`lib/api-config.ts:9` hardcodes the dev URL too, but it is only used when
`NEXT_PUBLIC_API_URL` is unset **and** not production — acceptable.)

### L4 — 401 interceptor hard-redirects mid-session
❌ Issue
The axios response interceptor (`lib/axios.ts:91-112`) redirects to `/login?returnTo=…` on
**any** 401, including background fetches. This is correct for expired sessions but can
interrupt the user abruptly (e.g. while viewing a page) and is not a soft "session expired"
banner.

📁 File
- `lib/axios.ts:91-112`

🔧 Suggested fix
Keep the redirect, but consider excluding non-critical GETs or showing a dismissible
"Session expired" banner before bouncing; ensure in-flight requests don't double-redirect.

### L5 — Pagination tolerates no negative/zero page from URL
❌ Issue
Shop, blog, and category pages reset to page 1 on filter change (✅ good) and disable
prev/next at bounds (✅). However they read page from internal state, not the URL, so a
hand-crafted `?page=-5` is not reachable via the UI — low risk. Category page passes
`currentPage` straight to the API without clamping if it ever exceeds `totalPages` (possible
only via code paths, not the UI).

📁 File
- `app/category/page.tsx:139` (page sent to API), `:193-194`

🔧 Suggested fix
Clamp `currentPage` to `[1, totalPages]` before sending; harmless defensive guard.

---

## Summary by priority

| # | Issue | Priority |
|---|-------|----------|
| C1 | Guest cart/wishlist merge drops failed items | 🔴 Critical |
| C2 | Guest merge clears local storage before confirming sync | 🔴 Critical |
| H1 | Categories fetched 5× with no caching | 🟠 High |
| H2 | Missing image fallbacks on ~55/61 API `next/image` | 🟠 High |
| M1 | No AbortController → race on pagination/search | 🟡 Medium |
| M2 | `generateMetadata` + page duplicate fetches | 🟡 Medium |
| M3 | Raw `apiClient` calls unguarded (throw-to-caller) | 🟡 Medium |
| M4 | API response types inline/duplicated, not centralized | 🟡 Medium |
| L1 | Silent category errors (navbar/menu) | 🟢 Low |
| L2 | Homepage failure has no user-facing UI | 🟢 Low |
| L3 | localhost/127 whitelisted in prod CSP | 🟢 Low |
| L4 | 401 interceptor hard redirect mid-session | 🟢 Low |
| L5 | No page clamp before API call | 🟢 Low |

### Positive notes (verified)
- No `any` types in application API code (only in Playwright specs).
- Auth token interceptor handles 401 consistently and redirects to login.
- Blog/shop/category all reset to page 1 on filter/search change.
- `generateMetadata` for product & blog details fall back to static data and do **not** crash.
- Homepage is now a single combined call with per-section `DEFAULT_*` fallbacks.
- Cart/wishlist add/remove/update paths show toasts and roll back optimistic updates.
