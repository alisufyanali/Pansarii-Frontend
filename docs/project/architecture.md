# Pansari Inn — Project Architecture

## Stack

| Layer | Choice | Version | Verified |
|-------|--------|---------|----------|
| Framework | Next.js App Router | 16.2.6 | `package.json` ✅ |
| UI Library | React | 19.2.3 | `package.json` ✅ |
| Language | TypeScript | ^5 (strict) | `tsconfig.json` `strict: true` ✅ |
| Styling | Tailwind CSS v4 | ^4.1.18 | `package.json` + `@import "tailwindcss"` in globals.css ✅ |
| HTTP Client | Axios | 1.7.9 | `lib/axios.ts` ✅ |
| Forms | react-hook-form + zod (installed, used partially) | ^7.79.0 / ^4.4.3 | `package.json` ✅; `/change-password` ONLY uses react-hook-form + zodResolver. All other forms use controlled-state pattern (login, register, checkout, blog, profile). Migration NOT scheduled. Only migrate when modifying a form. (confirmed: [change-password/page.tsx](file:///d:/laragon/www/Pansarii-Frontend/app/change-password/page.tsx#L6-L43)) |
| Toasts | react-toastify | ^11.0.5 | Root layout + all forms ✅ |
| Phone input | react-phone-number-input + libphonenumber-js | ^3.4.14 / ^1.12.36 | Checkout page ✅ |
| Icons | react-icons | ^5.5.0 | `next.config.ts` optimizePackageImports ✅ |
| Icons (alt) | Fi, Fa, Hi, Bs icon sets | — | Used across components |
| HTML sanitizer | isomorphic-dompurify | 3.14.0 | `package.json` ✅; used ONLY at `app/blog/[slug]/page.tsx` L8 to sanitize blog body content HTML (`DOMPurify.sanitize(post.content)`). (confirmed: [blog/[slug]/page.tsx](file:///d:/laragon/www/Pansarii-Frontend/app/blog/%5Bslug%5D/page.tsx#L8)) |
| Tests (e2e) | Playwright | ^1.49.1 | `playwright.config.ts` ✅ |
| Tests (unit) | Jest + ts-jest | ^29.7.0 / ^29.2.5 | `jest.config.ts` ✅ |
| Build output | Next.js standalone | — | `next.config.ts` `output: 'standalone'` ✅ |

---

## App Router Folder Map

```
app/
├─ layout.tsx              Root layout: Poppins font, Auth→Cart→Wishlist providers, JSON-LD, ToastContainer
├─ page.tsx                Home entry: client; useDeviceDetection → DesktopHome / MobileHome
├─ globals.css             Tailwind import + CSS vars + custom utilities + animations
├─ loading.tsx             Global loading fallback
├─ error.tsx               Global error boundary
├─ not-found.tsx           404 page
├─ sitemap.ts              Dynamic sitemap (pages + product slugs + blog slugs)
├─ robots.ts               robots.txt with SITE_URL, disallow lists for tx/account pages
│
├─ (home)/                  Route group
│  ├─ desktop/page.tsx      (redirected to / permanently in next.config.redirects)
│  └─ mobile/page.tsx       (redirected to / permanently in next.config.redirects)
│
├─ [slug]/page.tsx          CANONICAL PRODUCT DETAIL → /{productSlug}
│  ├─ loading.tsx
│  └─ [productSlug]/page.tsx CATEGORY-PRODUCT URL → /{category}/{productSlug}
│
├─ products/[slug]/page.tsx LEGACY → permanentRedirect to /{slug} (SEO equity)
│
├─ shop/page.tsx            Full product browse (SearchFilterBar + ProductGrid + Pagination)
│  └─ loading.tsx
├─ category/                Category listing
├─ herb/, oils/, supplements/, spices/, remedies/, murrabajat/,
│  arqiyaat/, beauty-corner/, dawakhana/, concern/, newarrival/, offers/
│                            Static category-specific pages (each has layout + loading)
│
├─ blog/page.tsx            Blog listing (9/post page, filters, pagination)
│  ├─ layout.tsx, loading.tsx
│  └─ [slug]/               Blog detail
│     ├─ page.tsx (server)  fetchBlogServer + generateMetadata + generateStaticParams. gSP returns API's top-100 per_page slugs or static fallback. generateMetadata and page body BOTH call fetchBlogServer independently — NOT deduped via cache(). (confirmed: [blog/[slug]/page.tsx](file:///d:/laragon/www/Pansarii-Frontend/app/blog/%5Bslug%5D/page.tsx#L22-L98))
│     ├─ BlogDetailClient.tsx, layout.tsx, loading.tsx
│
├─ cart/page.tsx            Client cart (stock validation, free-shipping progress, proceed to checkout)
├─ checkout/page.tsx        Client checkout (auth/guest mode, cities, coupon, payment methods, order submit)
├─ order-confirmation/      Post-checkout invoice + timeline + WhatsApp CTA
│
├─ login/, register/, forgot-password/, check-email/, reset-password/,
│  reset-password-success/, change-password/  Auth flows (protected: change-password)
│
├─ profile/, orders/, wishlist/, rewards/, cancel-order/
│                            Protected account pages (middleware)
├─ track-order/             Unauthenticated order tracker
│
├─ aboutus/, our-story/, contact/, support/, faqs/,
│  shipping-info/, returns/, our-commitment-to-quality/, pricing-policy/
│                            Static / info pages
│
├─ reviews/                 All product reviews listing
├─ affiliate/               Affiliate sign-up form
│
└─ api/                     App Router API routes (server-side)
   └─ auth/
      ├─ forgot-password/route.ts
      └─ reset-password/route.ts
```

---

## Route Map with Rendering Strategy

| Route | File | Strategy | Notes |
|-------|------|----------|-------|
| `/` | `app/page.tsx` | Client (device detection) | DesktopHome / MobileHome |
| `/{slug}` | `app/[slug]/page.tsx` | **ISR 60 s**, `dynamicParams: true` | `generateStaticParams()` → top 50 API products + static slugs. Fetches via `cache()`-wrapped `getProductBySlug()` (shared with `generateMetadata`). Runtime retry + uncached fallback. |
| `/{category}/{productSlug}` | `app/[slug]/[productSlug]/page.tsx` | **ISR 60 s**, `dynamicParams: true` | `generateStaticParams() → []` (ISR on first visit). Category mismatch → 308 to canonical. |
| `/products/{slug}` | `app/products/[slug]/page.tsx` | **308 permanentRedirect** | Legacy route. No rendering. |
| `/shop` | `app/shop/page.tsx` | Server page → `<Shop />` client component | metadata static |
| `/category` | `app/category/page.tsx` | Server → layout + client components | — |
| `/blog` | `app/blog/page.tsx` | Client | `getBlogs()` API, fallback to static blogposts |
| `/blog/{slug}` | `app/blog/[slug]/page.tsx` | Server + client | `fetchBlogServer(slug)` `revalidate: 60`; generateMetadata calls fetchBlogServer INDEPENDENTLY of page body (no `cache()` wrapper) → 2 API calls per view. VIOLATES hard rule #1. Needs cache() wrapping. (confirmed: [blog/[slug]/page.tsx](file:///d:/laragon/www/Pansarii-Frontend/app/blog/%5Bslug%5D/page.tsx#L41) and L98) |
| `/cart`, `/checkout`, `/order-confirmation` | Client components | CSR only | `"use client"` throughout |
| `/login`, `/register`, `/forgot-password` etc. | Server pages wrapping client forms | — | Auth flows; middleware does NOT intercept |
| Protected: `/profile`, `/orders`, `/wishlist`, `/rewards`, `/change-password`, `/cancel-order` | — | CSR + **middleware redirect** | Edge middleware checks `pansari-auth-token` cookie → redirects to `/login?returnTo=` |
| Info pages (`/aboutus`, `/pricing-policy`, …) | Server pages ('use client') | SSG — hardcoded JS arrays in-page | Content stored as TS objects: `pageData` (aboutus), `sections` array (quality), `policyPoints` array (pricing policy), page-specific lists. No CMS. (confirmed: [aboutus/page.tsx](file:///d:/laragon/www/Pansarii-Frontend/app/aboutus/page.tsx#L9-L78), [our-commitment-to-quality/page.tsx](file:///d:/laragon/www/Pansarii-Frontend/app/our-commitment-to-quality/page.tsx#L6-L22), [pricing-policy/page.tsx](file:///d:/laragon/www/Pansarii-Frontend/app/pricing-policy/page.tsx#L6-L10)) |
| `/api/auth/forgot-password`, `/api/auth/reset-password` | Route handlers | Server | Both wired. `POST /api/auth/forgot-password` → `laravelPost('/forgot-password', { email })` + in-memory 3-per-hour sliding-window rate limit per email. `POST /api/auth/reset-password` → `laravelPost('/reset-password', { token, email, password, password_confirmation })` + CSRF origin validate on both. (confirmed: [forgot-password/route.ts](file:///d:/laragon/www/Pansarii-Frontend/app/api/auth/forgot-password/route.ts#L41), [reset-password/route.ts](file:///d:/laragon/www/Pansarii-Frontend/app/api/auth/reset-password/route.ts#L41-L46)) |

---

## Data Fetching Layer

### API Base Resolution
- **Source of truth**: `lib/api-config.ts`
- Resolution order:
  1. `process.env.API_URL` (non-`NEXT_PUBLIC_`, server-first)
  2. `process.env.NEXT_PUBLIC_API_URL` (shared client/server)
  3. Hardcoded fallback: `PRODUCTION_API_URL = 'https://custom.pansariinn.pk/api'` or dev `http://127.0.0.1:8000/api`
- All callers go through the single `API_BASE_URL` export; never hardcode the URL anywhere else.

### Shared Axios Instance — `lib/axios.ts`
- Base: `axios.create({ baseURL: API_BASE_URL, timeout: 15_000 })`
- Request interceptor:
  - Attaches `Authorization: Bearer <token>` from `localStorage['pansari-auth-token']` (client only)
  - **Attaches `X-Build-Token: <BUILD_API_TOKEN>`** on server only (guarded by `typeof window === 'undefined'` + non-NEXT_PUBLIC env var)
- Response interceptor:
  - 401 on non-auth endpoints → `clearAuthData()` + browser `window.location.href = /login?returnTo=…`
  - 401 on `/login` or `/register` → falls through to caller (wrong credentials, inline error)
- Helpers exported:
  - `api.get/post/put/patch/delete/upload<T>()` (unwrap `.data`)
  - `isAxiosError()`, `getApiErrorMessage()` (priority: Laravel validation → message → Axios error → generic)
  - `setAuthData / clearAuthData / getAuthToken / getStoredUser / isAuthenticated`

### React `cache()` Wrappers
- `lib/products.ts` → `export const getProductBySlug = cache(async (slug) => { … })`
  - **Called by both `generateMetadata` and `app/[slug]/page.tsx` page** → dedupes to 1 network call per slug per render pass
  - Includes 429 / 5xx retry loop with build-time-vs-runtime policies
- Also: `fetchProductBySlugUncached()` (runtime-only single-shot bypass for transient errors)

### Blog Server-Safe Fetchers (separate, native fetch)
- `lib/blog.ts` → `fetchBlogsServer(params)`, `fetchBlogServer(slug)`
- Uses native `fetch(url, { next: { revalidate: 60 } })` directly
- **NOT cache()-wrapped**. `app/blog/[slug]/page.tsx` generateMetadata + page body call fetchBlogServer(slug) INDEPENDENTLY → 2 API calls per view. **VIOLATES hard rule #1**. Wrap fetchBlogServer/fetchBlogsServer in `cache()` immediately with build-time-vs-runtime retry pattern to match products.ts. (confirmed: [blog.ts](file:///d:/laragon/www/Pansarii-Frontend/lib/blog.ts#L61-L82), [blog/[slug]/page.tsx](file:///d:/laragon/www/Pansarii-Frontend/app/blog/%5Bslug%5D/page.tsx#L41) and L98)

### Homepage Aggregator
- `lib/homepage.ts` → `getHomepageData()` → single GET `/homepage`
- Replaces 6+ separate section calls (banners, cats, cat-products, featured, video-products, reviews, blogs, new-arrivals)

### Static Fallback Pattern
- Every API function has a `try/catch` with dev-console warn and `data/*` static fallback (`allProducts`, `bestSellers`, `blogPosts`)
- Static fallback products intentionally **omit `slug`** so `ProductCard` navigation guard (`if (!product.slug) return`) makes them non-navigable rather than 404ing

---

## State Management (Client)

### Context Providers (root: `app/layout.tsx`)
```
<AuthProvider>
  <CartProvider>
    <CartAuthBridge />            ← injects mergeGuestCart callback into AuthContext
    <WishlistProvider>
      <WishlistAuthBridge />      ← injects mergeGuestWishlist callback
      <DeviceDetector>{children}</DeviceDetector>
      <ToastContainer />
    </WishlistProvider>
  </CartProvider>
</AuthProvider>
```

### AuthContext (`context/AuthContext.tsx`)
- **State**: `user: AuthUser | null`, `isLoading: boolean`
- **Storage**: token in `localStorage['pansari-auth-token']`, user JSON in `localStorage['pansari-auth-user']` + mirror cookie `pansari-auth-token=1` (SameSite=Lax, Secure prod-only) for middleware
- **Actions**: `login / register / logout` → each calls `setAuthData()` then triggers injected cart + wishlist merge callbacks (non-blocking try/catch)
- **Extract field errors**: `extractFieldErrors<T>(err)` → maps Laravel 422 to field messages

### CartContext (`context/CartContext.tsx`)
- **State**: `cartItems: CartItem[]`, `isCartLoading: boolean`
- **Dual storage**:
  - Guest: localStorage `pansari-cart` (persisted on every change)
  - Auth: backend `GET /cart` + `POST /cart` (variant_id + qty) + PATCH / DELETE per item
- **Mount behavior**: if token restored from storage AND pending guest items, merge → API first, then sync back, only clear localStorage after confirmed sync
- **Derived helpers**: `getCartTotal / getCartCount / getItemCount`

### WishlistContext (`context/WishList.tsx`)
- Analogous dual storage pattern to cart (localStorage `pansari-wishlist` + API)

### DeviceDetector Hook
- `hooks/useDeviceDetection.tsx` → returns `{ isMobile }` based on `window.innerWidth`
- Desktop/Mobile layout switch is the **only place** a component condition mounts on device type — keep stable, no remount loops

---

## API Endpoints Consumed (grouped)

### Auth
| Method | Path | Purpose |
|--------|------|---------|
| POST | `/login` | Credentials → { token, user } |
| POST | `/register` | Create user → { token, user } |
| POST | `/logout` | Invalidate server-side token |
| POST | `/forgot-password` | App Router route handler → Laravel endpoint `POST /forgot-password` via `laravelPost()`. Sends { email }. Applies 3-request-per-email-per-1-hour sliding window rate limit in-process. Backend endpoint name confirmed by route handler call. |
| POST | `/reset-password` | App Router route handler → Laravel endpoint `POST /reset-password` via `laravelPost()`. Sends { token, email, password, password_confirmation }. Backend endpoint name confirmed by route handler call. |

### Products
| Method | Path | Purpose |
|--------|------|---------|
| GET | `/products?per_page&page&search&category_id&health_concern_id&featured&min_price&max_price&sort_by&sort_order` | Paginated listing with filters (meta returns totals/counts) |
| GET | `/products/{slug}` | Single product (variants, gallery, ingredients, how_to_use, benefits, key_features, scientific_name, long_description) |
| GET | `/products/featured` | Featured / best-sellers |
| GET | `/products/recommended?exclude_id&per_page` | Best-selling recommendations |
| GET | `/products/{slug}/related` | Same-category / health-concern related products |
| GET | `/products/with-video` | Products with video assets |
| POST | `/products/check-stock` | `{ variant_ids: [...] }` → stock / in_stock per variant |
| GET | `/categories` | All categories with products_count |
| GET | `/health-concerns` | Health concerns list |

### Homepage
| Method | Path | Purpose |
|--------|------|---------|
| GET | `/homepage` | Aggregated: banners, cats, cat-products, featured, video-products, reviews, blogs, new-arrivals |
| GET | `/homepage/category-products` | Category-wise product rows (also available as direct endpoint fallback) |

### Cart (auth only)
| Method | Path | Purpose |
|--------|------|---------|
| GET | `/cart` | Current user cart items |
| POST | `/cart` | `{ product_variant_id, quantity }` → add item |
| PATCH | `/cart/{cartItemId}` | Update quantity |
| DELETE | `/cart/{cartItemId}` | Remove item |
| DELETE | `/cart` | Clear entire cart |

### Wishlist (auth only)
| Method | Path | Purpose |
|--------|------|---------|
| GET | `/wishlist` | List all wishlist items. Returns `ApiWishlistItem[]` with nested product + variant. (confirmed: [lib/wishlist.ts](file:///d:/laragon/www/Pansarii-Frontend/lib/wishlist.ts#L34-L37)) |
| POST | `/wishlist` | Add product (body: `{ product_id, product_variant_id? }`). Returns `{ id: number }`. (confirmed: [lib/wishlist.ts](file:///d:/laragon/www/Pansarii-Frontend/lib/wishlist.ts#L39-L48)) |
| DELETE | `/wishlist/{id}` | Remove by wishlist row id. (confirmed: [lib/wishlist.ts](file:///d:/laragon/www/Pansarii-Frontend/lib/wishlist.ts#L50-L52)) |

### Orders
| Method | Path | Purpose |
|--------|------|---------|
| POST | `/orders` | Auth order create (items, address, city_id, payment, shipping, discount, coupon) |
| POST | `/orders/guest` | Guest order with name/email/phone; may set `account_created: true` |
| GET | `/orders?page&per_page` | Auth user order history |
| GET | `/orders/{id}` | Single order detail |
| PATCH | `/orders/{id}/cancel` | `{ reason, comment? }` → cancel order |
| GET | `/orders/track` | Unauthenticated: `{ order_number, email }` → order |

### Coupons / Cities / Newsletter / Contact / Reviews / Slides / Blog
| Method | Path | Purpose |
|--------|------|---------|
| POST | `/coupons/validate` | `{ code, amount, product_id? }` → discount |
| GET | `/cities` | City list with shipping_charge per city |
| POST | `/newsletter/subscribe` | `{ email }` → opt-in |
| POST | `/contact` | Contact form: `{ name, email, phone?, subject?, message }` |
| GET | `/blogs?per_page&page&search&category_id&tag` | Paginated blog listing |
| GET | `/blogs/{slug}` | Single blog post (content + meta_title/desc) |
| GET | `/slides` / GET `/homepage/reviews` | Banners and homepage reviews. **Dual pattern**: (1) Aggregated via `GET /homepage` → returns `banners + reviews` under one roof (used by default homepage). (2) Separate standalone endpoints: `GET /slides` (banners only, lib/slides.ts) + `GET /reviews` (reviews only w/ query params + submit via lib/reviews.ts POST). Standalone lib files still shipped as fallback / for non-home consumers. (confirmed: [homepage.ts](file:///d:/laragon/www/Pansarii-Frontend/lib/homepage.ts#L8-L40), [slides.ts](file:///d:/laragon/www/Pansarii-Frontend/lib/slides.ts#L75), [reviews.ts](file:///d:/laragon/www/Pansarii-Frontend/lib/reviews.ts#L80-L164)) |

---

## SEO Setup

### Global Metadata — `app/layout.tsx`
- `metadataBase: https://pansariinn.com`
- Title template: `%s \| Pansari Inn`, default title + description + keywords
- OpenGraph + Twitter card with `/images/Banner.png` (1200×630)
- Icons: `/favicon.ico`, `/apple-touch-icon.png`

### Per-Page Metadata
- `generateMetadata()` in product routes uses the same `cache()`-wrapped `getProductBySlug(slug)` as the page
- Canonical URL: `/{slug}` always (also set as `<link rel="canonical">` via metadata API)
- OpenGraph image = product thumbnail 800×800

### Product JSON-LD
- Inline `<script type="application/ld+json">` rendered by `app/[slug]/page.tsx`
- Types: `Product` + `Offer` + `AggregateRating` (when rating + reviews_count present)
- Fields: name, description, image, sku, brand=Pansari Inn, price (PKR), availability (based on variant stock > 0), seller

### Site-Wide JSON-LD
- Rendered in `app/layout.tsx`: `Organization` + `WebSite` with `SearchAction` pointing to `/shop?search={search_term_string}`
- ContactPoint + sameAs (FB, IG, Twitter, YT) + logo + email + telephone

### Sitemap — `app/sitemap.ts`
- **Product URLs**: fetched via `getProducts({ per_page: 500, page: 1 })`, filtered by `p.slug`
- **Blog URLs**: API first (`fetchBlogsServer` 200 items), fallback to `data/blogposts`
- **Static pages**: home, shop, newarrival, category, 10 category routes, blog, aboutus, our-story, contact, quality commitment, shipping-info, faqs, pricing-policy, returns
- Priority weighting: home 1.0, shop 0.9, products 0.8, blog listing 0.8, categories 0.7–0.8, policies 0.4–0.6
- Change frequencies: home/shop daily, products/categories weekly, blog monthly, policies monthly

### Robots.txt — `app/robots.ts`
- Allow: `/`
- Disallow: `/api/`, `/checkout/`, `/cart/`, `/profile/`, `/orders/`, `/wishlist/`, `/rewards/`, `/change-password/`, `/cancel-order/`, `/track-order/`, `/order-confirmation/`, `/login/`, `/register/`, `/forgot-password/`, `/reset-password/`, `/reset-password-success/`, `/check-email/`, `/affiliate/`
- Sitemap: `${SITE_URL}/sitemap.xml`
- Host: `SITE_URL`

### 308 Redirects from `/products/{slug}`
- `app/products/[slug]/page.tsx` → `permanentRedirect(\`/${slug}\`)`
- Additional: `next.config.redirects` → `/desktop` → `/`, `/mobile` → `/` (both permanent: true)

---

## Environment Variables

| Variable Name | Purpose (one line, NO VALUES) |
|---------------|-------------------------------|
| `NEXT_PUBLIC_API_URL` | Default Laravel API base URL (public, readable in browser) |
| `API_URL` | Server-side override for API base (preferred over NEXT_PUBLIC_ variant; used by api-config.ts) |
| `NEXT_PUBLIC_SITE_URL` | Canonical site URL used in metadataBase fallback, sitemap, robots, canonical links |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | Phone number used in order-confirmation WhatsApp deep-link |
| `NEXT_PUBLIC_FACEBOOK_URL` | Social link — Facebook |
| `NEXT_PUBLIC_INSTAGRAM_URL` | Social link — Instagram |
| `NEXT_PUBLIC_TWITTER_URL` | Social link — Twitter / X |
| `NEXT_PUBLIC_YOUTUBE_URL` | Social link — YouTube |
| `NEXT_PUBLIC_GOOGLE_MAPS_EMBED_URL` | Google Maps iframe embed for contact page |
| `PROMO_CODES_JSON` | Server-side hardcoded promo codes JSON (NOT exposed to browser) |
| `BUILD_API_TOKEN` | **Build-time rate-limit bypass secret**. Server-only. Sent as `X-Build-Token` header in axios interceptor. Never NEXT_PUBLIC_. Never commit. |

---

## Vercel Deployment + Build Settings — TODO: confirm with actual Vercel dashboard

### Based on code evidence
- **Build command**: `next build` (scripts.build)
- **Output**: standalone mode (`next.config.ts` → `output: 'standalone'`) — small Docker/self-host footprint
- **CSP in production next.config.headers**: `default-src 'self'`; `connect-src 'self' https://custom.pansariinn.pk`; Google Fonts allowed; `img-src 'self' data: https:`
- **Headers**: `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy: camera/mic/geo=()`, `Cache-Control: 1 year immutable for images`
- **Image formats**: avif + webp; remote patterns: `*.amazonaws.com/**`, `custom.pansariinn.pk/storage/**`, dev local `localhost:8000/storage` + `127.0.0.1:8000/storage`

### Build Time History
- Past build times: **7–8 minutes** (before optimizations)
- After: **~2 minutes** (top-50 static params, React.cache() dedupe → half API calls, 429 graceful skip at build → ISR fallbacks)
- **Remaining action**: confirm `BUILD_API_TOKEN` set in Vercel env var (non-browser) so all remaining 22 products pre-render without 429s

### X-Build-Token Wiring Status
- **Backend**: DONE — backend checks `X-Build-Token` header and exempts from 60-req/min rate limit
- **Frontend**: Partial (axios interceptor wired + env var read server-only)
- **PENDING action**: set `BUILD_API_TOKEN` env var value in Vercel → fresh build test → confirm 22 previously-skipped products now pre-build

---

## Known Constraints

| Constraint | Detail | Evidence |
|------------|--------|----------|
| Backend rate limit | ~10–60 req/min (varies) | Retry loops in lib/products.ts; build-vs-runtime policies, X-Build-Token bypass |
| Build 429 handling | Limited retry (2 attempts, 10 s cap) + fallback to null → ISR serves on first visit | `NEXT_PHASE === 'phase-production-build'` branch |
| Product slugs | Product `slug` field from API MUST be used; name-derived slugs differ (e.g. "moringa-leaf-powder" vs actual "moringapowder") | Comment in lib/products.ts fallback |
| No base price | Products have `price: 0` sometimes; ALWAYS use variant prices (`final_price ?? v.price`), take the `Math.min()` for display | `getDisplayPrice()` in types/product.ts |
| Auth storage | Token in localStorage; middleware reads companion **cookie** (NOT HttpOnly) — trade-off: allows JS to clear on logout | Cookie write path in `setAuthData()` + middleware |
| Middleware token cookie | Cookie is `=1` (presence-only), not the token value — no risk of token exfil via cookie | `document.cookie = TOKEN_KEY=1` |
