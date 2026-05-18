# Design Document

## Overview

This document describes the design for the QA Testing Suite for the Pansari Inn Next.js e-commerce website. The suite is implemented as a set of automated test scripts using Playwright (end-to-end browser automation) and Jest (unit/integration tests for pure logic). Tests are organized into modules matching the nine requirement areas. The final deliverable is a structured test report written to `qa-report.md`.

## Architecture

### Technology Stack

- **Playwright** (`@playwright/test`) — browser automation for all UI, navigation, cart, checkout, auth, responsiveness, and performance tests. Chosen because it supports multiple viewports, network throttling simulation, console/network monitoring, and screenshot capture out of the box.
- **Jest** — unit tests for CartContext logic (quantity guards, total calculations) and the `/api/validate-promo` route handler.
- **Node.js `fs` module** — report writer that aggregates results into `qa-report.md`.

### Test Organization

```
tests/
  playwright/
    01-page-load.spec.ts        # Req 1: Page Load & Navigation
    02-cart.spec.ts             # Req 2: Cart Functionality
    03-checkout.spec.ts         # Req 3: Checkout Flow
    04-auth.spec.ts             # Req 4: User Authentication
    05-search-filter.spec.ts    # Req 5: Search, Filter, Sorting
    06-responsiveness.spec.ts   # Req 6: Responsiveness & UI
    07-performance.spec.ts      # Req 7: Performance & Error Monitoring
    08-edge-cases.spec.ts       # Req 8: Edge Cases
  unit/
    cart-context.test.ts        # CartContext pure logic
    validate-promo.test.ts      # /api/validate-promo handler
  report/
    generate-report.ts          # Req 9: Test Reporting
playwright.config.ts
jest.config.ts
qa-report.md                    # Generated output
```

### Report Data Model

Each test records a result object:

```typescript
interface TestResult {
  module: string;           // e.g. "Page Load & Navigation"
  testName: string;
  status: 'pass' | 'fail' | 'skip';
  severity?: 'Critical' | 'High' | 'Medium' | 'Low';
  page: string;             // e.g. "/cart"
  issueDescription?: string;
  stepsToReproduce?: string[];
  viewport?: string;        // e.g. "1280x800"
  browser?: string;
  duration?: number;        // ms
}
```

The report generator reads Playwright's JSON reporter output and Jest results, then writes `qa-report.md` with:
1. Report header (browser, OS, resolution, date)
2. Issue Summary Table
3. Overall Feedback Report (Performance Issues / UI/UX Problems / Functional Bugs)

## Component Design

### Module 1 — Page Load & Navigation (`01-page-load.spec.ts`)

**Approach:** Playwright navigates to each route and asserts:
- No JS console errors (`page.on('console', ...)` filtering for `error` type)
- Page title / key selector visible within 3 000 ms
- Internal links resolve to correct destinations (no 404)
- `/not-found` route renders custom 404 page
- Loading skeletons appear then disappear on `/cart` and `/checkout`
- Valid slug renders product detail; invalid slug renders 404

**Routes under test:** `/`, `/shop`, `/cart`, `/checkout`, `/login`, `/register`, `/blog`, `/about`, `/contact`, `/wishlist`, `/order-confirmation`, `/[valid-slug]`, `/[invalid-slug]`

### Module 2 — Cart Functionality (`02-cart.spec.ts`)

**Approach:** Playwright navigates to a product detail page, interacts with add-to-cart, then navigates to `/cart` to assert quantities, totals, and shipping thresholds.

**Key scenarios:**
- Add product → header count increments
- Increase quantity → subtotal recalculates
- Decrease to 1 then click `−` → item removed
- Trash icon → item removed
- Subtotal < 5 000 → shipping progress bar + PKR 200 fee
- Subtotal ≥ 5 000 → free shipping banner + PKR 0
- Empty cart → empty state with Browse Products link
- Cart persists across navigation (localStorage)

### Module 3 — Checkout Flow (`03-checkout.spec.ts`)

**Approach:** Playwright fills the checkout form programmatically, submits, and asserts redirects and localStorage state.

**Key scenarios:**
- All fields filled → order stored in localStorage, cart cleared, redirect to `/order-confirmation`
- Missing required field → validation error shown, no redirect
- Valid promo code (SAVE10, SAVE20, WELCOME, FREESHIP) → discount applied
- Invalid promo code → error message, total unchanged
- COD selected → `paymentMethod` = "Cash on Delivery" in stored order
- Empty cart → empty state, no form rendered
- Submit button disabled + spinner during submission

### Module 4 — User Authentication (`04-auth.spec.ts`)

**Approach:** Playwright fills login/register forms with valid and invalid data and asserts error messages and redirects.

**Key scenarios (login):**
- Valid credentials → redirect (mocked API response)
- Empty email → "Email is required"
- Malformed email → "Email is invalid"
- Password < 6 chars → "Password must be at least 6 characters"
- API error → error banner shown, no redirect
- Password visibility toggle → input type changes

**Key scenarios (register):**
- All valid → redirect to `/login`
- Mismatched passwords → "Passwords do not match"
- Terms unchecked → native browser validation prevents submit
- Name = 1 char → "Name must be at least 2 characters"

### Module 5 — Search, Filter, Sorting (`05-search-filter.spec.ts`)

**Approach:** Playwright navigates to `/shop`, interacts with search input and filter controls, and asserts the product grid contents.

**Key scenarios:**
- Search term matching products → only matching products shown
- Search term with no matches → zero results + message
- Category filter → only that category shown
- Price range filter → only in-range products shown
- Sort "Price: Low to High" → ascending price order
- Clear filters → full list restored
- Combined filters → intersection of conditions

### Module 6 — Responsiveness & UI (`06-responsiveness.spec.ts`)

**Approach:** Playwright sets viewport to 1280, 768, and 375 px widths and asserts layout elements.

**Key scenarios:**
- 1280px: full nav header visible, multi-column grid, two-column cart layout
- 768px: nav collapses, no horizontal overflow
- 375px: MobileHome served, touch targets ≥ 44px
- Product images: no broken src, fallback to `/images/product.png`
- Form inputs: no overlap/clipping at any viewport
- Cart on mobile: order summary below items (single column)

### Module 7 — Performance & Error Monitoring (`07-performance.spec.ts`)

**Approach:** Playwright uses `page.goto` with `waitUntil: 'networkidle'` and measures elapsed time. Console errors are captured via `page.on('console')`. Network failures are captured via `page.on('requestfailed')`.

**Key scenarios:**
- Home, Shop, Product Detail, Cart pages load ≤ 3 000 ms on Fast 3G simulation
- Zero unhandled JS errors on any page
- Zero failed network requests for `/api/validate-promo` with valid code
- Zero failed network requests for `POST /auth/login` with valid credentials

### Module 8 — Edge Cases (`08-edge-cases.spec.ts`)

**Approach:** Playwright and direct CartContext unit tests cover boundary inputs.

**Key scenarios:**
- Out-of-stock product → add blocked, message shown
- Negative quantity via direct manipulation → CartContext clamps to current valid value
- Direct navigation to `/checkout` with empty cart → empty state, no form
- Login with whitespace-only email → "Email is required"
- Register with 1-char name → "Name must be at least 2 characters"
- Checkout with empty phone → prevented, phone required
- Promo applied then removed → total restored, success message cleared
- 500+ char street address → accepted, stored in order data

### Module 9 — Test Reporting (`report/generate-report.ts`)

**Approach:** Node.js script reads Playwright JSON output and Jest JSON output, aggregates `TestResult[]`, and writes `qa-report.md`.

**Report structure:**
```
# QA Test Report — Pansari Inn
## Test Session
Browser | Version | OS | Resolution | Date

## Issue Summary Table
| Page/Feature | Issue Description | Severity | Steps to Reproduce |

## Overall Feedback Report
### Performance Issues
### UI/UX Problems
### Functional Bugs
```

## Data Flow

```
Playwright tests run
  → JSON reporter → playwright-results.json
Jest tests run
  → JSON reporter → jest-results.json
generate-report.ts
  → reads both JSON files
  → filters failures
  → writes qa-report.md
```

## Key Design Decisions

1. **Playwright over Cypress** — Playwright has first-class support for network throttling (CDPSession), multiple browser contexts, and viewport simulation without plugins.

2. **Separate unit tests for CartContext** — The `updateQuantity` function uses `Math.max(1, newQuantity)` which means it never removes an item when quantity goes to 0 via `updateQuantity`. The `−` button in the cart UI calls `removeFromCart` when `quantity <= 1`. These two behaviors need separate unit tests to verify the guard logic independently of the UI.

3. **Mocked API for auth tests** — The backend (`POST /auth/login`) may not be running in CI. Playwright's `page.route()` is used to intercept and mock the auth endpoint so login flow tests are deterministic.

4. **Static product data** — Products are sourced from `components/Desktop/data/products`. Tests reference known product slugs from this data to avoid flakiness.

5. **Report written to `qa-report.md`** — A markdown file is the most portable format for stakeholder review and can be committed to the repository.
