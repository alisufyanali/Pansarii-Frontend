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
- `/affiliate` page hosts a sign-up form — TODO: confirm full affiliate program scope (tracking, payouts, dashboard)

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
- Combo deal / offers row — TODO: confirm combo deal API wiring
- Video products section (`/products/with-video`)
- Customer reviews carousel
- Blog highlights
- Why-choose-us section

### Shop (`/shop`)
- Product grid (server-paginated via API `meta`: `current_page`, `last_page`, `total`, `per_page`)
- SearchFilterBar: search query, min/max price, category filter, sort options, sale toggle, in-stock toggle
- Filters come from server API meta — never client-side computed
- Pagination component (reads `meta.last_page`, `meta.current_page`)
- Grid/list view toggle — TODO: confirm list view fully implemented
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
- TODO: confirm add-to-cart toast shows **instantly** on quick-view add-to-cart (reported not showing instantly)

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
- Pakistani phone validation pattern: `/^(\+92|0)3[0-9]{9}$/` (client-side + TODO: confirm backend 422 errors surface for auth mode phone field)
- Coupon code input (POST `/coupons/validate`) — supports percentage / fixed / freeship types
- Payment methods: COD (default), Online (card + JazzCash + EasyPaisa), Bank Transfer
- Stock re-validation immediately before order submission
- Auth users: POST `/orders`
- Guest users: POST `/orders/guest` — backend may auto-create account (phone becomes password)
- TODO: confirm backend validation 422 errors display correctly under each form field for ALL fields (guest name/email/phone partially wired, auth phone partially wired, address + city unknown)

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
- `/profile` — protected (middleware redirect); TODO: confirm profile edit form wiring
- `/orders` — protected, paginated order list (GET `/orders`)
- `/change-password` — protected
- `/cancel-order` — protected, reason + comment (PATCH `/orders/{id}/cancel`)
- `/track-order` — unprotected form: order # + email → GET `/orders/track`

### Rewards (`/rewards`) — protected
- Tier system UI: Seedling / Bloom / Herb Master / Royal Healer (static config in page)
- Points balance, tier progress
- Earn ways grid: Purchase (1 pt/PKR 10), Review (+50), Refer a Friend (+200), Share on Social (+25) — **TODO: confirm these 4 earn actions are all wired to backend API calls**
- Redeem section: discount coupons / free products — **TODO: confirm redeem section 2nd section not working (per task list)**
- Transaction history table

### Blog
- `/blog` listing — 9 posts per page, search box, category sidebar chips, tag pills, pagination
- API: `fetchBlogsServer({ per_page, page, category_id, tag, search })` with 60-s revalidate, fallback to `data/blogposts`
- `/blog/[slug]` detail — loaded via `fetchBlogServer(slug)` (60-s revalidate) — includes `BlogDetailClient` component
- TODO: confirm clicking blog category / tag pill returns correct article count (reported showing 0 articles)

### Newsletter
- Footer Newsletter component wired to `POST /newsletter/subscribe`
- Email validation via `lib/validation.isValidEmail()`
- Success state: green check panel (resets after 5 s); errors shown inline + toast

### Health Concerns (`/concern`)
- Route + layout/loading exist; powered by `GET /health-concerns`
- TODO: confirm full implementation (listing, filtering by concern)

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
| Variant selector fix | Done | TODO: confirm auto-detection of attribute key (Weight/Volume/Size) — need to read variant selector component |
| Build optimization (cache, static params, retries) | Done | `React.cache()` wrapper, 429 retry loops, top-50 pre-generate |
| Static pages Quality + Pricing Policy | Done | Routes exist: `/our-commitment-to-quality`, `/pricing-policy` |
| X-Build-Token in axios interceptor | Partial | Wired in `lib/axios.ts`; `BUILD_API_TOKEN` env var used **only server-side**; TODO: confirm token value set on Vercel and 22 previously skipped products now pre-build |
| Guest checkout backend validation display | Partial | Toast + inline errors for 422 guest name/email/phone; TODO: confirm ALL backend fields surface inline |
| Pakistan phone validation | Partial | Regex pattern present in checkout; TODO: confirm consistent in login/register/profile forms |
| Add-to-cart toast quick-view | Partial | TODO: confirm not showing instantly in quick-view modal |
| Review count on product card | Missing / Partial | ProductCard shows FaStar count; TODO: confirm `reviews` number displayed on card |
| Blog category/tag 0 articles | Missing | TODO: confirm filter returns 0 when clicked |
| Footer category links filter vs product | Missing | TODO: confirm footer category links correctly land on product list not filter-only |
| Rewards page 2 sections not working | Missing | TODO: confirm earn actions + redeem section both call backend |
| Banner 812x317 inconsistent sizing | Missing | TODO: confirm banner CSS enforces aspect ratio correctly |

---

## Non-Goals

- No multi-language full UI (Urdu product names stored and shown as `nameUr`, but navigation / chrome is English only)
- No multi-currency (PKR only)
- No customer-side product comparison feature
- No B2B / wholesale tiered pricing in current scope
- No subscription / auto-replenishment flow
- Admin dashboard is out of scope (lives in separate Laravel backend repo `pansarin-inn`)
