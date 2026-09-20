# Pansari Inn — Coding Rules & Conventions

## Conventions Actually Used (verified from code)

### Naming
- **Files**: kebab-case for lib folders (e.g. `lib/laravel-server.ts`), PascalCase for React components (e.g. `ProductDetails.tsx`, `CartContext.tsx`), camelCase for hooks (e.g. `useDeviceDetection.tsx`)
- **Folders**: lowercase, kebab-case for app route segments (`app/order-confirmation/`), PascalCase for component sections (`components/Desktop/Sections/ProductDetails/`)
- **TS Types**: PascalCase prefixed with intended scope — e.g. `ApiProduct`, `ProductVariant`, `PaginatedResponse`, `LaravelValidationError`
- **API response wrappers**: `ApiResponse<T> = { success: boolean; data: T }`, `PaginatedResponse<T> = { data: T[]; meta: PaginatedMeta }` — always use these from `types/api.ts`
- **Environment vars**: `NEXT_PUBLIC_` prefix only when value must be in browser; build/server secrets keep bare (e.g. `BUILD_API_TOKEN` not `NEXT_PUBLIC_BUILD_API_TOKEN`)
- **Context storage keys**: prefix with project name — `pansari-auth-token`, `pansari-auth-user`, `pansari-cart`, `pansari-wishlist`

### Folder Structure (observed, follow it)
```
app/                App Router pages + layout + loading/error/sitemap/robots — route groups, dynamic segments
components/
├─ Desktop/         Desktop-only tree
│  ├─ components/   Reusable: navbar, footer, ProductCard, SearchFilterBar, etc.
│  ├─ Sections/     Page sections (shop, blog, category, ProductDetailsSection…)
│  └─ DesktopHome.tsx + Layout.tsx
├─ Mobile/          Mobile-only tree (header, footer, bottom nav, sections, MobileHome)
└─ Invoice/         Cross-device invoice component
context/            React contexts: AuthContext, CartContext, WishList
data/               Static fallback data (allProducts, bestSellers, blogPosts, reviews)
hooks/              Custom hooks: useDeviceDetection, useCardsToShow, useProductNavigation
lib/                API service layer + pure helpers: axios, products, cart, orders, coupons, cities,
│                   contact, blog, homepage, reviews, slides, validation, stockValidation, productSlug,
│                   wishlist, api-config, social-links, laravel-server
types/              Shared type definitions: api.ts, product.ts
utils/              Pure helpers (filterProducts.ts)
public/images/      Static product/banner/logo image assets
```

### Component Patterns
- **Server vs Client**: Mark `"use client";` at top of any file that uses hooks, browser APIs, or interactivity. Pages themselves can be server components rendering client children.
- **Context hook throw pattern**: Each context exports `useX()` that throws `Error('useX must be used within <XProvider>')` if used outside provider (not returning null).
- **Form validation mix**: Checkout uses controlled state + inline regex patterns; react-hook-form + zod are installed — TODO: confirm migration target (leave alone unless actively modifying checkout/login/register).
- **Empty/skeleton states**: Always render animated skeleton pulse for load times (auth, cart, checkout, blog, order-confirmation). Pattern: `animate-pulse bg-gray-200` placeholder boxes.
- **"use client" home page**: `app/page.tsx` uses device detection → conditional DesktopHome/MobileHome. This is intentional (device viewport is browser-only concept).

### Fetch Helpers
- **Always go through `lib/axios.ts`**: NEVER `fetch(...)` or raw `axios.get(...)` directly in components. Exceptions: only when you intentionally need `{ next: { revalidate: N } }` for App Router caching (lib/blog.ts does this for server pages).
- **Pattern**: wrap each module's functions in try/catch with static fallback + `console.warn` dev-only log (see `getProducts()`, `getFeaturedProducts()`, `getHomepageData()`, `getCategories()`, `getHealthConcerns()`, `getRelatedProducts()`, `getRecommendedProducts()`).
- **Error unwrapping**: use `api.get/post/put/patch/delete/upload<T>()` which already unwrap `.data` so the caller types are clean.

### Error Handling
- **User-facing**: never show raw `err.message` or Axios stack traces. Use:
  - `getApiErrorMessage(err)` — priority: Laravel validation first message → Laravel message → Axios network → generic fallback
  - `toast.error(msg)` / `toast.success(msg)` (react-toastify, configured in root layout)
  - Form field inline errors: red 500 text-xs under input, red border
- **Form backend 422**: use `extractFieldErrors<T>(err)` (AuthContext) to map Laravel `errors: Record<string, string[]>` → field-first-message for display.
- **401 handling**: Global in axios response interceptor — clears auth, redirects to login on non-auth endpoints only (passes through 401 on `/login` / `/register` for wrong-credentials inline message).

### TypeScript Strictness
- `tsconfig.json` → `strict: true`; `skipLibCheck: true`
- Path aliases: `@/* → ./*`; also `@/components`, `@/context`, `@/hooks`, `@/utils`, `@/types`, `@/lib`, `@components/* → ./components/Desktop/components/*`
- All API responses typed: `types/api.ts` has `ApiResponse<T>`, `PaginatedResponse<T>`, `PaginatedMeta`
- Product types: `types/product.ts` has two-layer system: `ApiProduct` (Laravel shape with variants, category sub-object, scientific_name, long_description etc.) → `Product` (legacy UI shape with `nameEn/nameUr/oldPrice/sale/sizes/features`) via `apiProductToLegacy(p)`

---

## HARD RULES (learned from past bugs)

### 1. `generateMetadata` and page MUST use the same cached fetcher (`React.cache()`)
Never make two separate API calls per slug per request. Wrap the getter with `cache()`:
```ts
import { cache } from 'react';
export const getProductBySlug = cache(async (slug: string): Promise<ApiProduct | null> => { /* ... */ });
```
Call this **exact same export** from BOTH `generateMetadata()` AND the page component. Dedupe = half API calls = no 429 storm.

### 2. Always use the API `slug` field, NEVER generate a slug from name
- Name-derived slugs (e.g. `moringa-leaf-powder`) DIFFER from real backend slugs (e.g. `moringapowder`)
- Always: `product.slug` → URL segment; navigation guard: `if (!product.slug) return` (prevents 404 links)
- Static fallback products intentionally drop slug so cards are non-navigable rather than broken

### 3. Products have NO base price — use variant prices only
- The top-level `product.price` / `product.sale_price` can be `0` for variant-based products
- Correct pattern (in types/product.ts → `getDisplayPrice`):
```ts
if (product.variants && product.variants.length > 0) {
  return Math.min(...product.variants.map(v => v.final_price ?? v.price));
}
return product.sale_price ?? product.price;
```
- Search bar suggestions (navbar) do this too — always compute from variants first.

### 4. Variant selector MUST auto-detect the attribute key. NEVER hardcode `attributes.Weight`
Variant attributes map keys vary: `Weight | Volume | Size` (and potentially new ones). Pattern:
```ts
const attrKey = Object.keys(variant.attributes ?? {})[0]; // 'Weight' or 'Volume' or 'Size'
const attrValue = variant.attributes?.[attrKey];
const unit = variant.unit; // 'g', 'ml', 'kg' etc.
```
Label displayed = `${attrValue} ${unit}`. Hardcoding `Weight` breaks oil/volume/size products.

### 5. Pagination / counts / filters come from server API `meta`, NEVER client-side
- Never `Math.ceil(allProducts.length / PER_PAGE)` — always use `meta.last_page`, `meta.current_page`, `meta.total`, `meta.per_page` from the backend `PaginatedMeta` response
- Shop page counts, page numbers, filter counts all come from API. Client only renders them.

### 6. Keep components like `SearchFilterBar` stable — avoid unmount/remount loops
- **Never** define a component inside another component's render body (it re-creates on every render → remounts → lost state + flicker)
- Always use stable `key`s in arrays/maps (`key={item.id}` not index)
- Use `useRef` + effect pattern for passing callbacks instead of listing them in deps (example: `onFilterChangeRef` in SearchFilterBar)
- Device detection (`DesktopHome` vs `MobileHome`): only ONE mount point, switch at the top level, not per-section

### 7. Debounce search input; guard against infinite API loops
- Navbar search bar: `useDebounce(query, 900)` wrapper — never fire `onChange` directly
- All filter/sort changes in `SearchFilterBar`: `debounceTimeoutRef` pattern
- When using `useEffect` that reads + writes a shared state (URL searchParams ↔ local filters), always guard with **initial mount ref** and compare serialized previous vs next value before setting state.

### 8. On build, handle 429 gracefully with limited retry + fallback
- Build time (`NEXT_PHASE === 'phase-production-build'`):
  - Max 2 attempts (not 5)
  - 429 wait capped at 10 s (ignore Retry-After 45–60 s that blocks whole build)
  - Exponential backoff cap 4 s (not 16 s)
  - Final 429 after max attempts → **return null** (falls back to ISR on first real visitor) instead of throwing. NEVER crash a build for one rate-limited product.
- Runtime (SSR/ISR): aggressive policy — 5 attempts, full Retry-After, exponential backoff up to 16 s; then throw.

### 9. Never show raw backend errors to users; show friendly messages AND surface backend validation errors properly in forms
- Toast ALWAYS on submission failure for top-level visibility
- Map backend `errors` to per-field inline red text (use `extractFieldErrors<T>` pattern)
- Top-form `submitError` paragraph + toast BOTH for network/500/stock errors
- Scroll the first invalid field into view smoothly, focus it (50 ms setTimeout so element is in DOM after state render flush)

### 10. Pakistan phone validation client-side (03XXXXXXXXX format)
- Regex: `/^(\+92|0)3[0-9]{9}$/` — clean spaces/dashes/parens first with `.replace(/[\s\-\(\)]/g, '')`
- Used in: checkout guest phone, checkout auth phone. Apply consistently in login/register/profile phone fields too if they have a phone field.
- Always: `cleanPhone` first → then test regex. Display error hint: "e.g. 03XXXXXXXXX"

### 11. Workflow: diagnose first → targeted fix → verification with REAL evidence. Never claim "done" without proof.
Required verification outputs:
- **Build**: run `npm run build` (or `next build`) — show the success exit + page counts + any skipped-product warnings count before/after
- **Type errors**: `npx tsc --noEmit` — show 0 errors line
- **Lint**: `npm run lint`
- **Functional**: Playwright e2e tests OR `dev server` screenshots + browser console network tab that shows:
  - single API call per product slug (no duplicate fetch in metadata + page)
  - product slugs in URLs match API slugs exactly (not derived from name)
  - variant prices correct on cards
  - no "infinite loop" (network tab shows same endpoint fired > 3 times = bug)
- Write the **specific command output lines** + **specific network/console evidence** as proof in PR / task log.
