# Pansari Inn — Product Requirements Document (PRD)

## Purpose

- **Product**: Pansari Inn storefront — a Pakistani herbal / ayurvedic e-commerce platform
- **Primary domain**: `pansariinn.com` (live, in production)
- **Legacy domain**: `pansariinn.pk` (being retired; SEO redirects in progress — TODO: confirm 301/308 setup at DNS/CDN level)
- **Value prop**: 100% pure ayurvedic & herbal products (oils, supplements, herbs, spices, remedies, skincare etc.) sold direct-to-consumer across Pakistan

---

## Target Users

### 1. Customer (authenticated)
- Browses, searches, filters, adds to cart/wishlist
- Checks out as logged-in user
- Tracks orders, views order history, manages profile/password
- Earns and redeems reward points
- Writes product reviews

### 2. Guest (unauthenticated)
- Full browse/search/filter capability
- Add-to-cart (stored in `localStorage` under key `pansari-cart`)
- Add-to-wishlist (stored in `localStorage` under key `pansari-wishlist`)
- Guest checkout flow (name + email + phone) — backend auto-creates account optionally
- Cannot access: `/orders`, `/wishlist`, `/profile`, `/rewards`, `/change-password`, `/cancel-order` (redirected to `/login` via middleware)

### 3. Affiliate
- `/affiliate` page is "Coming Soon" landing page only — WhatsApp CTA for program inquiries. No affiliate sign-up form, no referral tracking, no payouts dashboard yet. (confirmed: [affiliate/page.tsx](file:///d:/laragon/www/Pansarii-Frontend/app/affiliate/page.tsx#L6-L48))

---

## Storefront Features by Page

### Home
- Device-detected split render: `DesktopHome` (≥ breakpoint) or `MobileHome` (< breakpoint)
- Hero banner carousel (API endpoint `/homepage` → `banners`)
- Solution / health-concern quick-bar (horizontal scroll)
- Category grid with thumbnail cards
- Featured products section (`/products/featured` fallback: `data/products.bestSellers`)
- Category-wise product rows (API endpoint `/homepage/category-products`)
- New arrivals section
- Combo deal / offers row: Coupons + `/offers` page fully wired via `mapApiOffer()` from `/coupons`? endpoint, supports `discount_type: percentage / fixed / freeship / bogo / flash / seasonal / bundle`. Filterable by offer-type tabs, countdown timers on flash sales, coupon code copy buttons. (confirmed: [offers/page-main.tsx](file:///d:/laragon/www/Pansarii-Frontend/app/offers/page-main.tsx#L50-L79))
- Video products section (`/products/with-video`)
- Customer reviews carousel
- Blog highlights
- Why-choose-us section

### Shop (`/shop`)
- Product grid (server-paginated via API `meta`: `current_page`, `last_page`, `total`, `per_page`)
- SearchFilterBar: search query, min/max price, category filter, sort options, sale toggle, in-stock toggle
- Filters come from server API meta — never client-side computed
- Pagination component (reads `meta.last_page`, `meta.current_page`)
- Grid/list view toggle — Fully implemented. Shop SearchFilterBar and CategoryPage both expose `onViewModeChange` handler; `ProductGrid` L38 branches `if (viewMode === 'list')` with a horizontal-card layout (description, save badge, expanded details). Toggle UI present. (confirmed: [CategoryPage.tsx](file:///d:/laragon/www/Pansarii-Frontend/components/Desktop/Sections/CategoryPage.tsx#L348), [ShopContent.tsx](file:///d:/laragon/www/Pansarii-Frontend/components/Desktop/Sections/shop/ShopContent.tsx#L99), [ProductGrid.tsx](file:///d:/laragon/www/Pansarii-Frontend/components/Desktop/Sections/shop/ProductGrid.tsx#L38))
- Debounced search input (900 ms) to prevent API spam

### Category (`/category` + static category routes: `/herb`, `/oils`, `/supplements`, `/spices`, `/remedies`, `/murrabajat`, `/arqiyaat`, `/beauty-corner`, `/dawakhana`, `/concern`)
- Category listing page with product grid
- Per-category static pages exist as route folders with individual layout.tsx + loading.tsx
- URL query parameter `?category=` used for category filter deep-links

### Product Detail — canonical `/{slug}`
- Main route: `app/[slug]/page.tsx`
- ISR 60 s, `dynamicParams = true`
- Top-50 products pre-generated via `generateStaticParams()` (to stay under rate limit)
- Price = cheapest variant price (product has **no base price**)
- Variant/weight selector (auto-detect attribute key — Weight / Volume / Size)
- Gallery + thumbnail images
- Add to cart, add to wishlist, share, quantity controls
- Product JSON-LD schema.org markup (Product, Offer, AggregateRating)
- Description / Key Features / How to Use / Benefits tabs
- Infinite scrolling reviews section
- Recommended / related products section
- Video products row
- Scientific name subtitle when present

### Product Detail — secondary `/{category}/{productSlug}`
- Route: `app/[slug]/[productSlug]/page.tsx` (folder shares parent dynamic segment name to appease Next.js)
- 308 redirect to canonical `/{slug}` (or correct category) when category segment does not match product's real category
- Canonical `<link>` always points to `/{slug}` to avoid duplicate SEO
- `generateStaticParams()` returns `[]` — ISR on first visit only (prevents 429 build storms)

### Quick View
- `ProductDetailsModal` opened from ProductCard "Quick Add" button
- Known issue: `handleAddToCart` awaits `addToCart()` then fires `toast.success()` AFTER async resolves; for auth users this includes a backend POST so toast appears 300–800 ms later; guest users (localStorage only) see instant toast. Suggestion: optimistic toast pre-call, undo on error. (confirmed: [ProductDetailsModal.tsx](file:///d:/laragon/www/Pansarii-Frontend/components/Desktop/components/ProductDetailsModal.tsx#L189-L196))

### Search
- Navbar search bar with debounced suggestions (900 ms, live product lookups)
- Shows: image, name, price (cheapest variant `final_price`), category, best-seller badge
- Recent searches stored in localStorage
- Full results redirect to `/shop?search=<query>`

### Cart (`/cart`)
- Stock validation on mount (hits `/products/check-stock`) — adjusts qty / removes items and shows warning banner
- Free-shipping progress bar (unlocks at PKR 5,000 subtotal)
- Quantity +/− controls, per-item remove
- Estimated total: subtotal + flat PKR 200 shipping (0 when > 5000)
- Proceed to Checkout CTA → `/checkout`

### Checkout (`/checkout`)
- Two modes: `auth` (signed-in) or `guest` (modal prompts choice → continue-as-guest or login)
- Fields: name, email, phone, street address, city (searchable combobox loaded from `/cities`), order note
- Pakistani phone validation pattern: checkout uses `/^(\+92|0)3[0-9]{9}$/` (PK-specific). Login: NO phone field (email only). Register: uses GENERIC regex `/^[0-9]{10,15}$/` — NOT PK-specific, accepts any 10–15 digit phone. Profile: NO edit form, phone not editable from frontend. (confirmed: [checkout/page.tsx](file:///d:/laragon/www/Pansarii-Frontend/app/checkout/page.tsx), [register/page.tsx](file:///d:/laragon/www/Pansarii-Frontend/app/register/page.tsx#L80), [login/page.tsx](file:///d:/laragon/www/Pansarii-Frontend/app/login/page.tsx#L48-L110))
- Coupon code input (POST `/coupons/validate`) — supports percentage / fixed / freeship types
- Payment methods: COD (default), Online (card + JazzCash + EasyPaisa), Bank Transfer
- Stock re-validation immediately before order submission
- Auth users: POST `/orders`
- Guest users: POST `/orders/guest` — backend may auto-create account (phone becomes password)
- Backend 422 validation errors: **INCOMPLETE inline wiring**. GUEST mode: only `name/email/phone` surfaced inline (checkout/page.tsx:L472–L481 explicit whitelist `['name','email','phone']`); `street_address / city_id / order_note / payment_method / items.*.stock` errors → top-level toast only. AUTH mode: only `phone` inline (L506–L522); everything else toast-only. `GuestFields interface` declares ONLY 3 fields (L132–L136) — no address/city typed keys.

### Guest Checkout
- Separate API endpoint `/orders/guest` with `{ name, email, phone, ...order }`
- Customer info + items persisted to `sessionStorage.last-guest-order` for the confirmation page (API response does not echo full detail back)

### Order Confirmation + WhatsApp (`/order-confirmation?orderId=<id>`)
- Success banner with order #
- Invoice component (downloadable / printable via new window + print())
- Confirm via WhatsApp deep-link to `wa.me/NEXT_PUBLIC_WHATSAPP_NUMBER` with prefilled message
- Download Invoice, View My Orders, Continue Shopping CTAs
- Order status timeline (pending → processing → shipped → delivered) driven by `order.status`
- Guest: reads from sessionStorage; auth: GET `/orders/{id}`

### Account
- `/login` — email + password (POST `/login`); success:false guard even on HTTP 200
- `/register` — name + email + password + confirm + phone (POST `/register`)
- `/forgot-password` → `/check-email` → `/reset-password` → `/reset-password-success`  (pages exist, `/api/auth/forgot-password` and `/api/auth/reset-password` routes exist)
- `/profile` — protected (middleware redirect); DASHBOARD ONLY: menu links to My Orders / Wishlist / Rewards / Change Password / Contact / Feedback. NO profile edit form (no name/email/phone edit fields rendered anywhere in mobile or desktop views). Profile data fields can only be changed from backend currently. (confirmed: [profile/page.tsx](file:///d:/laragon/www/Pansarii-Frontend/app/profile/page.tsx#L120-L248))
- `/orders` — protected, paginated order list (GET `/orders`)
- `/change-password` — protected
- `/cancel-order` — protected, reason + comment (PATCH `/orders/{id}/cancel`)
- `/track-order` — unprotected form: order # + email → GET `/orders/track`

### Rewards (`/rewards`) — protected
- Tier system UI: Seedling / Bloom / Herb Master / Royal Healer (static config in page)
- Points balance, tier progress
- Earn ways grid: Purchase (auto-credited on backend), Review (CTA to /shop, no backend call for review-click points), Refer a Friend (UI card only — no backend endpoint hooked yet), Share on Social (UI card only — no share dialog / backend ping), plus Birthday Bonus + Monthly Streak (both informational only). Historical transactions loaded from `GET /rewards` endpoint. (confirmed: [rewards/page.tsx](file:///d:/laragon/www/Pansarii-Frontend/app/rewards/page.tsx#L66-L91))
- Redeem section: ALL 6 options explicitly marked `available: false` with comment L94–97 "Point redemption API is not yet available… When the backend redemption endpoint ships, set available: true + wire POST /rewards/redeem". All cards show "Coming Soon" lock state. (confirmed: [rewards/page.tsx](file:///d:/laragon/www/Pansarii-Frontend/app/rewards/page.tsx#L94-L105))
- Transaction history table

### Blog
- `/blog` listing — 9 posts per page, search box, category sidebar chips, tag pills, pagination
- API: `fetchBlogsServer({ per_page, page, category_id, tag, search })` with 60-s revalidate, fallback to `data/blogposts`
- `/blog/[slug]` detail — loaded via `fetchBlogServer(slug)` (60-s revalidate) — uses `isomorphic-dompurify` for content HTML sanitization
- Known issues: (1) Category count pills on sidebar show counts computed from first page of posts only (not `meta.total` per category) → displayed numbers are wrong for categories not represented on page #1. (2) Tag pills are folded into `searchQuery` text search via `handleTagSearch(tag)` instead of sending the API's dedicated `tag` parameter (lib/blog.ts L47 `BlogsParams.tag` exists but client never uses it) → tag click does substring search across title/excerpt instead of proper tag filter, often returning 0 articles. (confirmed: [blog/page.tsx](file:///d:/laragon/www/Pansarii-Frontend/app/blog/page.tsx#L173-L186) and L235)

### Newsletter
- Footer Newsletter component wired to `POST /newsletter/subscribe`
- Email validation via `lib/validation.isValidEmail()`
- Success state: green check panel (resets after 5 s); errors shown inline + toast

### Health Concerns (`/concern`)
- Fully implemented. Concern grid: 12 predefined concern slugs with client-side icon map + gradient + background/border classes; calls `GET /health-concerns` for name/slug. Clicking a concern loads filtered products via `getProducts({ concernId })`, with search query box above product grid. Desktop renders `<ProductCard>`, mobile renders `<MobileProductCard>`. (confirmed: [concern/page.tsx](file:///d:/laragon/www/Pansarii-Frontend/app/concern/page.tsx#L24-L156))

### Static Pages
- `/aboutus` — content page
- `/our-story` — brand story
- `/contact` — contact form (POST `/contact` via `lib/contact.submitContact`)
- `/our-commitment-to-quality` — Quality page (static) ✅ verified: route file exists
- `/pricing-policy` — Pricing Policy page (static) ✅ verified: route file exists
- `/faqs` — FAQ page
- `/shipping-info` — shipping policy
- `/returns` — return policy
- `/affiliate` — affiliate sign-up form
- `/support` — customer support page
- `/newarrival` — new-arrivals listing
- `/offers` — deals / promo page
- `/reviews` — all reviews listing

---

## What is Done / Partial / Missing

| Area | Status | Evidence |
|------|--------|----------|
| Home page + all sections | Done | `getHomepageData()`, all sections present in DesktopHome/MobileHome |
| Product listing / shop pagination | Done | API `meta` used, `Pagination.tsx` present |
| Category filter + sort + search | Done | `SearchFilterBar.tsx` reads server meta |
| Infinite API loop (searchbar debounce) | Done | 900 ms `useDebounce` in searchbar |
| SEO URL migration `/{slug}` | Done | canonical route; `/products/{slug}` uses `permanentRedirect()` |
| 308 redirects from `/products/{slug}` | Done | `app/products/[slug]/page.tsx` → `permanentRedirect` |
| Dynamic product detail | Done | `[slug]/page.tsx` with ISR + API + fallback |
| Newsletter forms wired | Done | `Newsletter.tsx` → POST `/newsletter/subscribe` |
| Slug-mismatch fix | Done | `useProductNavigation` + guard on `product.slug` before navigation |
| `/{category}/{slug}` route + folder rename | Done | Route exists; category mismatch → redirect |
| Variant selector fix | Done | Auto-detect primary key: loops `Object.keys(attributes)`, excludes reserved `Form` (secondary), takes first non-empty found key as primary (Weight/Volume/Size/Qty/anything). Implemented in BOTH full PDP and quick-view modal. (confirmed: [ProductDetails.tsx](file:///d:/laragon/www/Pansarii-Frontend/components/Desktop/components/ProductDetails.tsx#L132-L143), [ProductDetailsModal.tsx](file:///d:/laragon/www/Pansarii-Frontend/components/Desktop/components/ProductDetailsModal.tsx#L61-L72)) |
| Build optimization (cache, static params, retries) | Done | `React.cache()` wrapper, 429 retry loops, top-50 pre-generate |
| Static pages Quality + Pricing Policy | Done | Routes exist: `/our-commitment-to-quality`, `/pricing-policy`; content hardcoded JS arrays in-page |
| Static page content source | Done | All info pages (`aboutus`, `quality`, `pricing-policy`) use in-file JS arrays — no CMS. (confirmed: [our-commitment-to-quality/page.tsx](file:///d:/laragon/www/Pansarii-Frontend/app/our-commitment-to-quality/page.tsx#L6-L79), [pricing-policy/page.tsx](file:///d:/laragon/www/Pansarii-Frontend/app/pricing-policy/page.tsx#L6-L71), [aboutus/page.tsx](file:///d:/laragon/www/Pansarii-Frontend/app/aboutus/page.tsx#L9-L100)) |
| X-Build-Token in axios interceptor | Partial | Wired in `lib/axios.ts`; `BUILD_API_TOKEN` env var used **only server-side**; TODO: confirm token value set on Vercel and 22 previously skipped products now pre-build |
| Forgot / reset password routes | Done | Wired via `laravelPost('/forgot-password')` and `laravelPost('/reset-password')`; CSRF origin validation + 3-per-email-per-hour rate limit on forgot; in-memory sliding window. (confirmed: [forgot-password/route.ts](file:///d:/laragon/www/Pansarii-Frontend/app/api/auth/forgot-password/route.ts), [reset-password/route.ts](file:///d:/laragon/www/Pansarii-Frontend/app/api/auth/reset-password/route.ts#L41-L46)) |
| Guest checkout backend validation display | Partial | **PARTIAL (not all fields)**. GUEST: only `name/email/phone` inline — explicit 3-key whitelist at checkout L477–L481. AUTH: only `phone` inline at L508–L510. ALL OTHER backend keys (`street_address`, `city`, `order_note`, `payment_method`, `items.* stock 422`): top-level error toast + global submitError paragraph only (L470 + L530–L531), NO per-field inline red text. Expand `GuestFields interface` (L132) and remove the 3-key whitelist to fix. (confirmed: [checkout/page.tsx](file:///d:/laragon/www/Pansarii-Frontend/app/checkout/page.tsx#L472-L531)) |
| Pakistan phone validation | Partial | Checkout: PK regex `/^(\+92|0)3[0-9]{9}$/` ✅. Register: GENERIC 10–15 digit (not PK-specific) ❌. Login: no phone field. Profile: no edit form. (confirmed: [register/page.tsx](file:///d:/laragon/www/Pansarii-Frontend/app/register/page.tsx#L80)) |
| Add-to-cart toast quick-view | Partial | Guest (localStorage): instant. Auth: awaits backend POST then toasts → 300–800 ms delay. Suggestion: optimistic toast pre-call, undo on error. (confirmed: [ProductDetailsModal.tsx](file:///d:/laragon/www/Pansarii-Frontend/components/Desktop/components/ProductDetailsModal.tsx#L189-L196)) |
| Review count on product card | Done | `· {product.reviews} reviews` rendered next to FaStar stars when `product.reviews > 0`. (confirmed: [ProductCard.tsx](file:///d:/laragon/www/Pansarii-Frontend/components/Desktop/components/ProductCard.tsx#L119-L126)) |
| Blog category/tag 0 articles | Missing / Root cause confirmed | Category: visible count pills computed from first-9 posts slice only, NOT per-category meta totals → wrong numbers. Tag: pills mapped into `searchQuery` text search via `handleTagSearch()` instead of sending dedicated `tag` API param (which `lib/blog.ts` does support). Fix: pass `tag` separately; aggregate category counts from meta. (confirmed: [blog/page.tsx](file:///d:/laragon/www/Pansarii-Frontend/app/blog/page.tsx#L173-L186) and L235) |
| Footer category links filter vs product | Done | "Shop" column links target static route pages `/herb`, `/beauty-corner`, `/oils`, `/supplements` (each has page.tsx, layouts, and renders real product grids via API); NOT query-only filter URLs. (confirmed: [footer/LinkColumns.tsx](file:///d:/laragon/www/Pansarii-Frontend/components/Desktop/components/footer/LinkColumns.tsx#L15-L22)) |
| Rewards page 2 sections not working | Partial | Earn: transactions historical log works from `/rewards`. Redeem: all 6 options `available: false` per explicit comment "Point redemption API is not yet available". Placeholder status. Backend POST `/rewards/redeem` pending. (confirmed: [rewards/page.tsx](file:///d:/laragon/www/Pansarii-Frontend/app/rewards/page.tsx#L94-L105)) |
| Banner 812×317 inconsistent sizing | Missing / Code confirmed absent | `aspect-[812/317]` wrapper (or `aspect-[2.56/1]` equivalent) NOT present anywhere in codebase. Enforce in PageBanner + hero carousel. (confirmed: grep for 812, 317, aspect across TSX — only 812/317 in the task docs themselves; real aspect classes are `aspect-[9/14]` video, `aspect-[4/3]` reviews, `aspect-[17/12]` category skeleton) |

---

## Non-Goals

- No multi-language full UI (Urdu product names stored and shown as `nameUr`, but navigation / chrome is English only)
- No multi-currency (PKR only)
- No customer-side product comparison feature
- No B2B / wholesale tiered pricing in current scope
- No subscription / auto-replenishment flow
- Admin dashboard is out of scope (lives in separate Laravel backend repo `pansarin-inn`)
