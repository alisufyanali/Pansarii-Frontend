## QA Report — Next.js ↔ Laravel End-to-End

**Scope**: Full connected flow between Next.js frontend (`:3000`) and Laravel backend (`:8000`) per 8 scenarios.

**Environment**
- **Frontend**: Next.js dev server on `http://localhost:3000`
- **Backend**: Laravel API on `http://127.0.0.1:8000/api`
- **Automation**: Playwright (Chromium)

---

## Pre-flight

- **Server status**
  - **Laravel (8000)**: Detected listening on port 8000.
  - **Next.js (3000)**: Started `npm run dev`, detected listening on port 3000.

- **Playwright setup**
  - **Initial issue**: Playwright browsers were missing locally (tests failed with “Executable doesn’t exist … run `npx playwright install`”).
  - **Action**: Installed browsers via `npx playwright install`.

---

## Bugs fixed during QA (blocking E2E)

### 1) Products API wrapper misuse (would break real API fetching)
- **Issue**: `lib/products.ts` treated `api.get(...)` like a raw Axios response (accessing `.data`/`.meta`), but `api.get` already returns the JSON body.
- **Impact**: Product/category API calls could fail and silently fall back to static products → **Scenario 1** not truly testing backend.
- **Fix**: Corrected `getProducts`, `getFeaturedProducts`, `getProductBySlug`, `getCategories` to use wrapper return shape.
- **File**: `lib/products.ts`

### 2) Guest cart merge would skip items (missing `variantId`)
- **Issue**: Shop products constructed from API data did not include `variants`, so `variantId` was often missing in guest cart items.
- **Impact**: After registration/login, merge to API (`POST /cart`) would **skip** items (“Skipping item without variantId”).
- **Fix**: Added `variants?: ProductVariant[]` to `Product` type, and included `variants`/`sizes` in API→UI mappings.
- **Files**:
  - `types/product.ts`
  - `components/Desktop/Sections/shop/index.tsx`
  - `app/products/[slug]/page.tsx`

### 3) Playwright product-detail route mismatch (test suite correctness)
- **Issue**: Existing Playwright suite navigated to `/${slug}` but real route is `/products/[slug]`.
- **Fix**: Updated the suite to use `/products/${slug}` for valid/invalid product routes.
- **File**: `tests/playwright/01-page-load.spec.ts`

---

## Scenario Results (8/8)

> Status meanings:
> - ✅ Passed: Meets scenario expectations
> - ❌ Failed: Reproducible issue (includes exact file to fix)
> - ⚠️ Warning: Works but needs improvement / flaky / environment-dependent

### Scenario 1 — Guest Browsing
- **Status**: ⏳ Pending final automated run
- **Expected screenshots**
  - Home shows “Featured Products” slider populated from API.
  - `/shop` shows “Showing X–Y of Z products” and paging controls.
  - Product detail shows size/variant buttons populated.
  - `/blog` loads posts and `/blog/[slug]` shows content + “Related Articles”.
- **Network expectations**
  - `GET /api/products/featured`
  - `GET /api/products` (with pagination params)
  - `GET /api/blogs`, `GET /api/blogs/{slug}`

### Scenario 2 — Guest Cart & Wishlist
- **Status**: ⏳ Pending final automated run
- **localStorage expectations**
  - `pansari-cart` set/updated
  - `pansari-wishlist` set/updated
- **Network expectations**
  - **No** `POST/PATCH/DELETE /api/cart*`
  - **No** `POST/DELETE /api/wishlist*`

### Scenario 3 — Register & Merge
- **Status**: ⏳ Pending final automated run
- **Network expectations**
  - `POST /api/register`
  - Merge calls after auth:
    - `POST /api/cart`
    - `POST /api/wishlist`
- **localStorage expectations**
  - `pansari-cart` removed
  - `pansari-wishlist` removed

### Scenario 4 — Logged-in Cart & Wishlist
- **Status**: ⏳ Pending final automated run
- **Network expectations**
  - `POST /api/cart`
  - `PATCH /api/cart/{id}`
  - `DELETE /api/cart/{id}`
  - `POST /api/wishlist`
  - `DELETE /api/wishlist/{id}`
- **localStorage expectations**
  - No `pansari-cart` / `pansari-wishlist` usage when authenticated

### Scenario 5 — Checkout Flow
- **Status**: ⏳ Pending final automated run
- **Network expectations**
  - `POST /api/coupons/validate` (valid + invalid)
  - `POST /api/orders`
  - Redirect to `/order-confirmation?orderId=X`
  - `GET /api/orders/{id}` for confirmation display

### Scenario 6 — Orders Page
- **Status**: ⏳ Pending final automated run
- **UI expectations**
  - Recently placed order visible
  - Status badge color: pending = yellow
  - Payment badge color: unpaid = red

### Scenario 7 — Contact Form
- **Status**: ⏳ Pending final automated run
- **Network expectations**
  - Invalid email -> `POST /api/contact` returns 422 with field errors
  - Valid submission -> `POST /api/contact` success, toast shown, form reset

### Scenario 8 — Logout
- **Status**: ⏳ Pending final automated run
- **Network expectations**
  - `POST /api/logout`
- **localStorage expectations**
  - `pansari-auth-token` cleared
- **Navigation expectations**
  - Redirect to `/login`

---

## Console errors & network failures

- **Console errors**: ⏳ Pending final automated run
- **Network failures**: ⏳ Pending final automated run

---

## Final score

**⏳ Pending** — after Playwright connected-flow suite completes.

