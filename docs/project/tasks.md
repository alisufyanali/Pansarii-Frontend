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

---

## IN PROGRESS ⚠️

- [ ] **X-Build-Token in all server-side fetch calls + Vercel env var + fresh build test**
  - Axios interceptor wired correctly (`lib/axios.ts` L88–L110): reads `BUILD_API_TOKEN` server-only; sets `X-Build-Token` header. ✅
  - **PENDING**: `BUILD_API_TOKEN` value set in Vercel dashboard (uncheck "Browser" scope)
  - **PENDING**: Pre-build dry-run confirms 22 previously-skipped products now render at build time (run `npm run build` → compare "Generating static pages" count before/after)

---

## PENDING (P0 — ship blocking)

- [ ] **P0: Guest checkout backend validation error display (ALL fields)**
  - Currently: toast shows for 422; guest name/email/phone inline errors mapped; address + city + order note fields have NOT been verified for inline error wiring.
  - Task: Map Laravel's full `errors` object to EVERY checkout field (street address, city, order note, payment method, items stock 422 etc.); ensure auth mode fields surface inline errors too.

- [ ] **P0: Pakistan phone validation everywhere (login / register / profile forms)**
  - Currently: checkout has `/^(\+92|0)3[0-9]{9}$/` pattern. Audit: `/login`, `/register`, `/profile`, `/change-password`, `/forgot-password` phone fields. Apply same pattern.

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

- [ ] **P2: Hostinger VPS deployment decision (backend side)**
  - Not frontend code task. Status: owner decision pending on whether backend migrates from current infra to Hostinger VPS. Track only, no code changes.

---

## Verification log (per task)

After completing any item above, append:
```
### Task: <task name>
- Verified by: <command/output/evidence link>
- Date: YYYY-MM-DD
- Notes: <anything unexpected>
```
