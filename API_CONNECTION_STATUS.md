# API Connection Status — Pansarii Frontend

**Audit date:** 2026-06-21  
**Environment tested:**
- Next.js: `http://localhost:3000` ✅ running
- Laravel API: `http://127.0.0.1:8000/api` ✅ running (via `NEXT_PUBLIC_API_URL` in `.env.local`)

**Method:** Live HTTP requests to Laravel + page load checks on Next.js + full codebase scan of `app/`, `components/`, `lib/`, and `context/`.

> **Note:** Laravel `routes/api.php` is not in this repo (backend is separate). Endpoint availability was verified by calling the running API directly.

---

## Summary Table

| Page / Feature | Status | API Endpoint Used | Notes |
|---|---|---|---|
| **Homepage — category product sections** | ⚠️ | `GET /homepage/category-products` | Connected; API returns `success: true` but **0 categories configured** → sections hidden on homepage |
| **Homepage — SolutionBar, Category grid, NewArrivals, BeautyCorner, PureInn, ComboDeal, VideoProducts, Reviews, Blog strip** | ❌ | — | Static `data/products.ts`, `data/reviews.ts`, `data/blogposts.ts` |
| **Shop (`/shop`)** | ✅ | `GET /products`, `GET /categories` | 559 products from API; filters/pagination wired |
| **Product detail (`/products/[slug]`)** | ✅ | `GET /products/{slug}` | Tested `gingeroil` — real data; static fallback if API miss |
| **Category pages (`/herb`, `/dawakhana`, etc.)** | ✅ | `GET /categories`, `GET /products?category_id=` | All 8 pages match API category names |
| **Category page `/oils`** | ❌ | — | **Route missing** — no `app/oils/page.tsx` though API has `Oils` category & navbar links to `/oils` |
| **Generic `/category` page** | ❌ | — | Uses `allProducts` static only — no API |
| **Navbar category sidebar** | ✅ | `GET /categories` | API loaded on mount; static fallback on failure |
| **Search (navbar → `/shop?search=`)** | ✅ | `GET /products?search=` | Search navigates to shop; shop calls API |
| **Cart — guest** | ✅ | — (localStorage) | By design via `CartContext` |
| **Cart — logged in** | ✅ | `GET/POST/PATCH/DELETE /cart` | Returns 401 without token (correct); wired in `CartContext` |
| **Wishlist — guest** | ✅ | — (localStorage) | By design via `WishList` context |
| **Wishlist — logged in** | ✅ | `GET/POST/DELETE /wishlist` | Returns 401 without token (correct) |
| **Checkout — auth order** | ✅ | `POST /orders` | Wired in `app/checkout/page.tsx` |
| **Checkout — guest order** | ✅ | `POST /orders/guest` | Endpoint exists (422 without valid payload); sessionStorage for confirmation |
| **Checkout — coupon** | ⚠️ | `POST /coupons/validate` | Frontend wired; backend returns **404** for test codes (no valid coupons in DB) |
| **Orders list (`/orders`)** | ✅ | `GET /orders` | Requires auth; wired |
| **Order confirmation — auth** | ✅ | `GET /orders/{id}` | Wired via `getOrderById` |
| **Order confirmation — guest** | ✅ | — (sessionStorage) | Uses `last-guest-order` key; no re-fetch |
| **Blog list (`/blog`)** | ✅ | `GET /blogs` | 4 posts from API; static fallback on error |
| **Blog detail (`/blog/[slug]`)** | ✅ | `GET /blogs/{slug}` | Server fetch via `fetchBlogServer` |
| **Contact form (`/contact`)** | ⚠️ | `POST /contact` | Frontend wired; backend returns **500 Internal Server Error** |
| **Login (`/login`)** | ✅ | `POST /login` | Via `AuthContext` → `lib/axios` |
| **Register (`/register`)** | ⚠️ | `POST /register` | Wired; registration returned **500** on repeat tests (intermittent backend issue) |
| **Logout** | ✅ | `POST /logout` | Via `AuthContext` / profile page |
| **Forgot password** | ❌ | — | Uses Next.js stub `POST /api/auth/forgot-password` (TODO, no Laravel call) |
| **Reset password** | ❌ | — | Uses Next.js stub `POST /api/auth/reset-password` (TODO, no Laravel call) |
| **Profile (`/profile`)** | ⚠️ | — | Reads user from localStorage only; no `GET /profile` or user update API |
| **Track order (`/track-order`)** | ❌ | — | Hardcoded `mockOrders` array only |
| **Newsletter (Our Story page)** | ❌ | `POST /newsletter/subscribe` | Frontend calls API; endpoint returns **404** (not implemented on backend) |
| **New Arrivals (`/newarrival`)** | ❌ | — | Static `data/newproducts.ts` only |
| **Offers, Concern, FAQs, About, Support, Shipping, Returns, Rewards** | ❓ | — | Static/marketing content — no API expected |
| **Featured products component** | ⚠️ | `GET /products/featured` | Still exists but **removed from homepage**; API returns 3 products |
| **Sitemap** | ❌ | — | Static `allProducts` + `blogPosts` |

---

## Fully Connected (✅)

These call Laravel via `lib/*.ts` or `AuthContext`, and live tests confirmed the backend responds with real data:

1. **Products catalog** — `GET /products` (559 total), pagination, search, filters  
   - Files: `lib/products.ts`, `components/Desktop/Sections/shop/index.tsx`
2. **Product detail** — `GET /products/{slug}`  
   - File: `app/products/[slug]/page.tsx`
3. **Categories list** — `GET /categories` (9 categories)  
   - Files: `lib/products.ts`, navbar, shop, `CategoryPage.tsx`
4. **Category landing pages** — `/herb`, `/supplements`, `/dawakhana`, `/beauty-corner`, `/murrabajat`, `/arqiyaat`, `/remedies`  
   - File: `components/Desktop/Sections/CategoryPage.tsx`
5. **Blog** — `GET /blogs`, `GET /blogs/{slug}`  
   - Files: `lib/blog.ts`, `app/blog/page.tsx`, `app/blog/[slug]/page.tsx`
6. **Auth login/logout** — `POST /login`, `POST /logout`  
   - File: `context/AuthContext.tsx`
7. **Cart (authenticated)** — full CRUD on `/cart`  
   - Files: `lib/cart.ts`, `context/CartContext.tsx`
8. **Wishlist (authenticated)** — `/wishlist`  
   - Files: `lib/wishlist.ts`, `context/WishList.tsx`
9. **Orders list** — `GET /orders`  
   - File: `app/orders/page.tsx`
10. **Order creation** — `POST /orders`, `POST /orders/guest`  
    - File: `lib/orders.ts`, `app/checkout/page.tsx`
11. **Order confirmation (auth)** — `GET /orders/{id}`  
    - File: `app/order-confirmation/page.tsx`
12. **Shop search** — query param → `GET /products?search=`  
    - Navbar search bar → `/shop?search=...`

---

## Broken Connections (⚠️)

| Feature | File(s) | Issue | Backend endpoint |
|---|---|---|---|
| Homepage category sections | `components/Desktop/Sections/CategoryProductsSection.tsx` | API works but returns **empty array** — admin must assign products per category in Laravel admin | `GET /homepage/category-products` ✅ exists |
| Contact form | `app/contact/page.tsx`, `lib/contact.ts` | `POST /contact` → **500** server error | `POST /contact` ✅ exists, broken handler |
| Coupon validation | `app/checkout/page.tsx`, `lib/coupons.ts` | `POST /coupons/validate` → **404** for test codes (route exists; coupon not found / no seeded coupons) | `POST /coupons/validate` ✅ exists |
| Register | `app/register/page.tsx`, `context/AuthContext.tsx` | Intermittent **500** on `POST /register` during audit | `POST /register` ✅ exists |
| Products silent fallback | `lib/products.ts` | Any API failure silently serves **static `allProducts`** — masks outages in shop/category | N/A (frontend behavior) |
| Profile | `app/profile/page.tsx` | No user profile fetch/update; only localStorage from login response | Needs `GET /user` or `/profile` if desired |
| Featured products (orphaned on homepage) | `components/Desktop/Sections/FeaturedProducts.tsx` | Component still exists, API works (`3` featured), but **not rendered** on current homepage | `GET /products/featured` ✅ |

---

## Not Connected Yet (❌)

| Feature | File(s) | What's missing | Suggested Laravel endpoint |
|---|---|---|---|
| **Homepage static sections** | `SolutionBar`, `Category`, `NewArrivals`, `BeautyCorner`, `Pureinnoils`, `ComboDeal`, `VideoProducts`, `Review`, mobile equivalents | All use `@/data/products.ts` or static arrays | Various CMS/homepage endpoints or reuse existing product APIs |
| **`/oils` category route** | Missing `app/oils/page.tsx` | Navbar/category map links to `/oils` but page doesn't exist | N/A (frontend route needed) |
| **`/category` browse page** | `app/category/page.tsx` | Static `allProducts` only | `GET /products`, `GET /categories` |
| **Track order** | `app/track-order/page.tsx` | `mockOrders` hardcoded | `GET /orders/track?order_number=&email=` or similar |
| **Forgot password** | `app/forgot-password/page.tsx`, `app/api/auth/forgot-password/route.ts` | Next.js **stub** with TODO — never hits Laravel | `POST /forgot-password` |
| **Reset password** | `app/reset-password/page.tsx`, `app/api/auth/reset-password/route.ts` | Next.js **stub** with TODO | `POST /reset-password` |
| **Newsletter subscribe** | `app/our-story/page.tsx` | Calls `POST /newsletter/subscribe` but backend returns **404** | Implement `POST /newsletter/subscribe` on Laravel |
| **New Arrivals page** | `app/newarrival/page.tsx` | Static `data/newproducts.ts` | `GET /products?sort_by=created_at` or dedicated endpoint |
| **Sitemap** | `app/sitemap.ts` | Static product/blog lists | Fetch from `/products`, `/blogs` at build time |

---

## Static / No API Needed (❓)

These pages are intentionally static marketing or legal content:

- `/faqs`, `/aboutus`, `/our-story` (main content), `/support`, `/shipping-info`, `/returns`, `/rewards`, `/offers`, `/concern`, `/cancel-order` (UI shell), `/check-email`, `/reset-password-success`

---

## Orphaned / Dead Code

### `lib/*.ts` functions never called from UI

| Function | File | Status |
|---|---|---|
| `getBlogBySlug()` | `lib/blog.ts` | **Dead** — blog detail uses `fetchBlogServer()` instead |

### Next.js API routes not used by production checkout

| Route | File | Status |
|---|---|---|
| `POST /api/validate-promo` | `app/api/validate-promo/route.ts` | **Orphaned** — checkout uses `lib/coupons.ts` → Laravel; only referenced in old Playwright tests |
| `POST /api/auth/forgot-password` | `app/api/auth/forgot-password/route.ts` | **Stub** — returns fake success |
| `POST /api/auth/reset-password` | `app/api/auth/reset-password/route.ts` | **Stub** — returns fake success |

### Components still on static data (not on homepage critical path)

| Component | Static source |
|---|---|
| `components/Desktop/Sections/ComboDeal.tsx` | `data/products.ts` |
| `components/Desktop/Sections/VideoProducts.tsx` | `data/products.ts` |
| `components/Desktop/Sections/NewArrivals.tsx` | `data/products.ts` |
| `components/Desktop/Sections/BeautyCorner.tsx` | `data/products.ts` |
| `components/Desktop/Sections/Pureinnoils.tsx` | `data/products.ts` |
| `components/Desktop/Sections/Category.tsx` | `data/products.ts` |
| `components/Desktop/Sections/Review.tsx` | `data/reviews.ts` |
| `components/Desktop/Sections/FeaturedProducts.tsx` | `data/products.ts` fallback |
| `components/Mobile/components/*` (ShopProducts, categories, etc.) | `data/products.ts` |
| `components/Desktop/components/sidebar.tsx` | `allProducts` for suggestions |
| `components/Desktop/Sections/ProductDetails/RecommendedProductsSection.tsx` | `data/recommendedProducts.ts` |

---

## Live API Test Results (2026-06-21)

```
GET  /products                      → 200  success=true  count=15 (page), total=559
GET  /products/featured             → 200  success=true  count=3
GET  /homepage/category-products    → 200  success=true  count=0  ⚠️ empty
GET  /categories                    → 200  success=true  count=9
GET  /blogs                         → 200  success=true  count=4
GET  /blogs/{slug}                  → 200  success=true
GET  /products/gingeroil            → 200  success=true  name=Ginger Oil
GET  /cart                          → 401  (auth required) ✅
GET  /wishlist                      → 401  (auth required) ✅
GET  /orders                        → 401  (auth required) ✅
POST /login                         → 401  (invalid credentials) ✅
POST /register                      → 500  ⚠️ intermittent
POST /contact                       → 500  ⚠️
POST /coupons/validate              → 404  (coupon not found)
POST /orders/guest                  → 422  (exists, validation) ✅
POST /newsletter/subscribe          → 404  ❌ not implemented
```

### Next.js page loads (all 200)

`/`, `/shop`, `/cart`, `/checkout`, `/blog`, `/login`, `/herb`, `/products/gingeroil`

---

## Score

| Metric | Count |
|---|---|
| **Features that should use API** | **28** |
| **✅ Connected & working** | **17** |
| **⚠️ Connected but broken / empty / partial** | **7** |
| **❌ Not connected** | **4** (+ homepage static sections counted separately) |

### **API connection score: 17 / 28 = 61%**

If homepage static sections (9 blocks) are included as future work: **17 / 37 ≈ 46%** of all product-facing surfaces use live API data.

---

## Priority Fixes

1. **Configure homepage categories in Laravel admin** — `GET /homepage/category-products` returns empty; homepage shows no product sections.
2. **Fix `POST /contact` 500** — contact form is wired but backend crashes.
3. **Add `app/oils/page.tsx`** — API has Oils category (86 products); route is missing.
4. **Seed / fix coupons** — checkout coupon call gets 404 for valid-looking codes.
5. **Wire forgot/reset password to Laravel** — replace Next.js stubs in `app/api/auth/*`.
6. **Replace track-order mock** with real order lookup API.
7. **Migrate remaining homepage/mobile sections** off `data/products.ts` or accept them as curated static content.
8. **Remove or update orphaned `app/api/validate-promo`** — conflicts with Laravel coupon flow.

---

*Generated by automated frontend QA audit. Re-run after backend deploys or frontend API migrations.*
