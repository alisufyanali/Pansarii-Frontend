# Pansari Inn — Tasks & Progress

> Legend: ✅ Verified from codebase. ⚠️ Partial / needs evidence. ❌ Not yet started.

---

## DONE ✅

- [x] **Shop / category pagination + filter + sort fixes**
  - Verified: `Pagination.tsx` uses server `meta.last_page / meta.current_page`; `SearchFilterBar.tsx` reads server meta and syncs URL searchParams; filters are server-driven via API query params. ✅

- [x] **Infinite API loop fix (search debounce)**
  - Verified: navbar `searchbar.tsx` uses `useDebounce(query, 900)` with cleanup timer; `SearchFilterBar.tsx` uses `debounceTimeoutRef` pattern; initial-mount ref guards prevent effect loop. ✅

- [x] **SEO URL migration (/{slug}, 308s, sitemap)**
  - Verified: canonical route at `app/[slug]/page.tsx`; legacy `app/products/[slug]/page.tsx` calls `permanentRedirect('/{slug}')`; `sitemap.ts` emits ONLY canonical `/{slug}` URLs per product. ✅

- [x] **Dynamic product detail page**
  - Verified: `app/[slug]/page.tsx` with `revalidate = 60`, `dynamicParams = true`, API fetch via `getProductBySlug` with 429 retry loop, static fallback to `data/products`. ✅

- [x] **Newsletter forms wired**
  - Verified: `components/Desktop/components/footer/Newsletter.tsx` calls `api.post('/newsletter/subscribe', { email })` via axios; validation and success/error toast handlers present. ✅

- [x] **Slug-mismatch fix (name-derived vs API slugs)**
  - Verified: code comments in `lib/products.ts` fallback explicitly drop slug so ProductCard guard `if (!product.slug) return` avoids navigation to name-derived URLs; `useProductNavigation` hook uses slug only. ✅

- [x] **Search bar debounce + price fix**
  - Verified: 900 ms debounce; suggestions price reads `variant.final_price ?? variant.price` for cheapest variant; `Math.min(...variantPrices)` before falling back to product-level price/sale_price. ✅

- [x] **/{category}/{slug} route + folder rename fix**
  - Verified: nested folder structure under `app/[slug]/[productSlug]` shares dynamic segment name; category mismatch triggers `redirect()` to canonical URL; `generateStaticParams()` returns empty array to avoid 429 storms. ✅

- [x] **Variant selector fix**
  - Fully verified ✅: Both `ProductDetails.tsx:L132-L143` and `ProductDetailsModal.tsx:L61-L72` iterate `Object.keys(attributes)` excluding reserved `Form`, return first non-empty key as primary (Weight/Volume/Size). No hardcoded `.Weight` access anywhere. Attribute label = `${attrValue} ${unit}`.

- [x] **Build optimization (React.cache(), static params cap, 429 retries)**
  - Verified: `getProductBySlug = cache(async (slug) => {...})` in `lib/products.ts`; `generateStaticParams()` caps at 50 API products; build-time vs runtime policy split via `NEXT_PHASE === 'phase-production-build'`; 2 attempts + 10 s cap at build; returns null (not throw) for build 429. ✅

- [x] **Static pages — Quality commitment**
  - Verified: `app/our-commitment-to-quality/page.tsx` + layout.tsx exist. ✅

- [x] **Static pages — Pricing Policy**
  - Verified: `app/pricing-policy/page.tsx` + layout.tsx exist. ✅

- [x] **Review count display on product card**
  - Verified ✅: `ProductCard.tsx:L119-L126` renders `· {product.reviews} reviews` grey span when `product.reviews > 0` (right after star count + numeric rating). Nothing missing.

- [x] **Phone login (backend)** — `AuthApiController` accepts `login` key (phone only; last-10-digits match). 5 failed attempts pe lockout (429). Evidence: temp-user tests 03../+92.. → 200; 6th galat attempt → 429. ✅
  - ⚠️ Note: frontend `RegisterPayload.email` still `string` (required) — fixed 2026-09-17 to `email?: string`; login is phone-only, email field optional at registration.

- [x] **must_change_password flow (backend)** — middleware `EnsurePasswordChanged`, change-password endpoint, `api.logout` route. Evidence: login → 403 → change-password 422/200 → same token 200 → old password 401. ✅

---

## IN PROGRESS ⚠️

- [ ] **X-Build-Token in all server-side fetch calls + Vercel env var + fresh build test**
  - Axios interceptor wired correctly (`lib/axios.ts` L88–L110): reads `BUILD_API_TOKEN` server-only; sets `X-Build-Token` header. ✅
  - **PENDING**: `BUILD_API_TOKEN` value set in Vercel dashboard (uncheck "Browser" scope)
  - **PENDING**: Pre-build dry-run confirms 22 previously-skipped products now render at build time (run `npm run build` → compare "Generating static pages" count before/after)

- [ ] **Forced password change (frontend)** — code complete + `tsc --noEmit` exit 0 + guards code-reviewed. **PENDING**: browser test (phone login, /profile /checkout /orders redirect, weak password errors, success flow).

- [ ] **user.phone null in login and /api/user** (imported users ka `users.phone` null) — backend fix pending.

- [ ] **CustomerImportSeeder** — code done, test mode (20 records). **PENDING**: role check, DB backup, `array_slice` ko `is_array` ke neeche, `Customer::whereNull('user_id')->count()`, 20-record run + tinker check, full run, customers ko notify.

- [ ] **Production: must_change_password migration + backend deploy** (frontend se pehle).

---

## PENDING (P0 — ship blocking)

- [ ] **P0 [2026-09-17]: lib/phone.ts + login phone-only + register/checkout normalization**
  - `LoginPayload.login` is phone-only (not email-or-phone); update login page label/placeholder and any "email or phone" hint text.
  - Extract Pakistan phone normalization (`/^(\+92|0)3[0-9]{9}$/` → `03XXXXXXXXX`) into `lib/phone.ts`; replace duplicated inline regexes in login, register, checkout, profile with the shared util.
  - Register: replace generic `/^[0-9]{10,15}$/` with PK pattern; show "e.g. 03XXXXXXXXX" hint.
  - Checkout: confirm `normalizePhone()` call uses lib/phone.ts after extraction.

- [ ] **P0 [2026-09-17]: Checkout email optional + guest-token dead code removal**
  - `RegisterPayload.email` made optional (`email?: string`) — `tsc --noEmit` exit 0 confirmed.
  - Audit checkout page for any remaining `guest_token` generation, storage, or passing to API; remove dead code.
  - Ensure checkout submit does NOT require email for guest orders; backend 422 validation must not reject missing email.

- [ ] **P0 [2026-09-17]: Order-confirmation redirect fix**
  - Bug: after placing an order, user lands on `/order-confirmation` then gets redirected to `/login`.
  - Root cause to verify: axios 401 interceptor in `lib/axios.ts` may redirect globally without a bypass for `/order-confirmation`; order-confirmation page may call an authenticated API endpoint without a guest fallback.
  - Fix required: (1) add `/order-confirmation` and `/track-order` to a `NO_REDIRECT_PATHS` list in the 401 interceptor so those pages handle the 401 inline; (2) persist order lookup key (order_number + phone, or a signed one-time token) in `sessionStorage` immediately after checkout submit; (3) order-confirmation page reads from sessionStorage for guest users rather than making an authenticated API call.
  - Also audit `trackOrder` page for the same 401 redirect issue.

- [ ] **P0 [2026-09-17]: Checkout 422 full field mapping**
  - Currently: toast shows for 422; guest name/email/phone inline errors partially mapped.
  - Task: map Laravel's full `errors` object to EVERY checkout field (street address, city, order note, payment method, items/stock 422); ensure auth-mode fields surface inline errors; verify no field silently swallows a validation message.

- [ ] **P0 [2026-09-17]: Wishlist sync 403 / must_change_password fix**
  - Bug: after login with `must_change_password=true`, a "Failed to sync wishlist" toast appears (sometimes twice).
  - Root cause: `mergeGuestWishlist` catch block fires `toast.error` on any failure including 403; `AuthContext.login()` calls `wishlistMergeRef` unconditionally even when `mustChange=true`; `WishlistProvider` mount effect re-runs the merge on the `/change-password` page after redirect, firing the toast again for users with guest items.
  - Fix required: (1) in `mergeGuestWishlist` catch, suppress toast when HTTP status is 401 or 403 — only toast on network errors and 5xx; (2) in `AuthContext.login()`, skip `wishlistMergeRef.current()` when `mustChange=true`; call the merge instead from `updateMustChangePassword(false)` after the password is successfully changed; (3) in `WishlistProvider` mount effect, read the stored user and skip API sync silently when `must_change_password=true`, falling back to local items; (4) add a `mergedRef` guard so merge runs at most once per login session, reset on `clearWishlist`/logout.

- [ ] **P0: Guest checkout backend validation error display (ALL fields)**
  - Currently: toast shows for 422; guest name/email/phone inline errors mapped; address + city + order note fields have NOT been verified for inline error wiring.
  - Task: Map Laravel's full `errors` object to EVERY checkout field (street address, city, order note, payment method, items stock 422 etc.); ensure auth mode fields surface inline errors too.

- [ ] **P0: Pakistan phone validation everywhere (login / register / profile forms)**
  - Currently: checkout has `/^(\+92|0)3[0-9]{9}$/` pattern. Audit: `/login`, `/register`, `/profile`, `/change-password`, `/forgot-password` phone fields. Apply same pattern.
  - **Note**: Login field ab email ya phone (10-digit check) leta hai, change-password mein phone field nahi.

- [ ] **P0: Add-to-cart toast not showing instantly in Quick View**
  - Reproduce: open ProductDetailsModal → add item → toast timing vs full PDP. Check CartContext.addToCart call path in modal; check ToastContainer z-index (999999 is set); investigate if modal unmount clears toast; ensure `toast.success()` fires BEFORE modal close if at all.

---

## PENDING (P1 — important, not ship-blocking)

- [ ] **P1: Register page phone validator NOT Pakistan-specific**
  - Currently: `register/page.tsx:L80` uses generic `/^[0-9]{10,15}$/` (accepts any 10-15 digits). Checkout uses PK pattern `/^(\+92|0)3[0-9]{9}$/`.
  - Fix: Replace register regex with checkout's PK pattern; add error hint display "e.g. 03XXXXXXXXX". Login has no phone field. Profile has no edit form (confirmed).

- [ ] **P1: Blog category pill counts computed from first-page slice only; tag pills use text search not dedicated param**
  - Root cause confirmed dual: (1) `blog/page.tsx:L173-L186` category/tag count pills aggregate against first-9 posts array only, not backend meta per-category totals → undercounts on page 1, reads 0 on page 2+. (2) `handleTagSearch(tag)` at L235 calls `handleSearch(tag)` folding the tag into text query instead of passing `BlogsParams.tag` string (which `lib/blog.ts L47` already supports).
  - Fix: (1) Aggregate pill counts from a separate uncapped API fetch or backend meta; (2) Call `getBlogs({ ...params, tag: tagName })` directly on tag click instead of text search.

- [ ] **P1: Rewards page earn + redeem UI not fully wired to backend**
  - Audit confirmed (`rewards/page.tsx:L66-L105`):
    - **Earn**: Purchase = correctly reflects GET /rewards response (auto backend). Review = CTA to /shop only. Refer/Share/Birthday/Streak = UI cards only with NO backend hooks.
    - **Redeem**: All 6 options `available: false` with explicit comment at L94-97 "Point redemption API is not yet available". No redeem action wired.
  - Task: Awaiting backend `POST /rewards/redeem` endpoint ship → set `available:true` + wire form. Add CTA-only messaging for Refer/Share if backend not shipping soon.

---

## PENDING (P2 — polish / hygiene)

- [ ] **P2: Banner 812×317 inconsistent sizing**
  - Consistent aspect wrapper + object-cover across breakpoints. Test with real banner images on 390/768/1280/1920 widths. Use `aspect-[812/317]` / computed equivalent.

- [ ] **P2: Fresh Next.js audit**
  - Full checklist:
    - `npm run build` → exit 0, no errors, static generation count correct
    - `npx tsc --noEmit` → 0 errors
    - `npm run lint` → 0 errors
    - Dead code: remove any unused imports, unused lib exports, unused data files no longer needed as fallbacks (keep only if still used)
    - Data consistency audit: 5 random products → API data matches what UI renders (price variants, names, slugs, categories)
    - Performance: Lighthouse home, shop, PDP (mobile + desktop) — note scores, fix >3 s LCP pages
    - Routing: click 10 random links, 404 count = 0; browser back/forward works without stale data

- [ ] **P2: Fresh SEO audit**
  - Metadata: 10 random PDP pages → title/description/canonical correct
  - Sitemap: curl `/sitemap.xml` → all product/blog/category URLs included, no broken hrefs
  - Schema: Product JSON-LD present with correct price/currency/availability fields per variant stock
  - Page speed: Lighthouse SEO category ≥ 95 on home + shop + PDP
  - robots.txt: confirms `/api` and all transactional pages blocked
  - 308 /products/→/{slug}: confirm with `curl -I`

- [ ] **P2: Hostinger VPS deployment decision (backend side)** — merged with BACKEND section below. Track only, no code changes.

---

## BACKEND (tracked here)

- [ ] **Manjistha merge** — naam/thumbnail decision pending; doosre slug ka 308; `order_items` repoint.

- [ ] **fileinfo extension** — cPanel se extension enable, warna `move_uploaded_file` + `getimagesize` fallback.

- [ ] **Hostinger VPS decision** — backend current infra se Hostinger VPS pe migrate karna ya nahi; owner decision pending.

---

## Verification log (per task)

After completing any item above, append:
```
### Task: <task name>
- Verified by: <command/output/evidence link>
- Date: YYYY-MM-DD
- Notes: <anything unexpected>
```

---

### Task: Phone login (backend)
- Verified by: temp-user API tests — 03../+92.. → 200; 6th galat attempt → 429; `AuthApiController` `login` key + last-10-digits match confirmed. Email login NOT supported — login is phone-only.
- Date: 2026-09-21
- Notes: Frontend `login` key bhi update kar diya gaya (AuthContext.tsx + login/page.tsx). "Phone/email login" label was incorrect — corrected to phone-only.

### Task: must_change_password flow (backend)
- Verified by: login → 403 → `POST /api/change-password` 422 (weak) → 200 (strong) → same token → 200; old password → 401. Middleware `EnsurePasswordChanged`, `api.logout` route confirmed.
- Date: 2026-09-21
- Notes: Frontend interceptor (403 loop-guard), ProfileLayout guard, checkout guard, MobileProfileView guard sab code-reviewed. `tsc --noEmit` exit 0.
