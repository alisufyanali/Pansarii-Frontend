# Pansari Inn — Project Context & Memory

## Owner & Working Style
- **Owner**: "Master dev" (referred to as the stakeholder/engineer working on this repo)
- **Workflow**: Claude prompts are pasted directly into **Cursor IDE** for execution → output is code changes
- **Communication style**: Hinglish + concise English; short answers preferred, no fluffy paragraphs
- **Code review expectations**: Systematic technical audit presented in tables; explicit architectural decision points BEFORE implementation starts; never commit without verification evidence (command output lines, network tab proof, screenshots)

---

## Decisions Made & Why

| Decision | Reasoning / Context |
|----------|---------------------|
| Dual codebase split: Desktop + Mobile components (not responsive CSS) | Existing design assets were delivered separately for desktop/mobile with different layouts; less refactor risk, faster initial delivery |
| `/{slug}` as canonical product URL (migrating from `/products/{slug}`) | Shorter URLs, SEO equity preserved via permanentRedirect in old route folder |
| `/{category}/{productSlug}` kept as SECONDARY route only | Human-readable category URLs for SEO; canonical `<link>` always points to `/{slug}` so no duplicate-content penalty |
| Top-50 products only pre-generated at build time (not all 500+) | Backend rate limit (60 req/min) would cause 429 storm and fail build; `dynamicParams=true` + ISR serves remaining 450+ on first visit, revalidates every 60 s |
| `React.cache()` wrapper around `getProductBySlug` shared between `generateMetadata` and page | 1 network call per slug instead of 2 → cuts API calls in half → critical for avoiding 429 |
| Build-time 429 policy: 2 attempts, 10 s cap, then `return null` (not throw) | A single rate-limited product must NOT block the entire build; better: ISR serves it on first real visitor (sub-1 s delay for one user vs 7–8 min build fail for everyone) |
| `X-Build-Token` header (server-only, non-NEXT_PUBLIC_) | Backend checks this header to exempt build server from 60-req/min rate limit, so all products can pre-render without 429 |
| Token stored in localStorage (not HttpOnly cookie) + companion cookie presence indicator for middleware | Allows `clearAuthData()` to be fully client-side JS (no backend logout endpoint call required); middleware just needs "has auth?" yes/no signal, not the actual token value |
| Guest cart merged → API cart AFTER successful login (not before) | Preserves all user work; merge loop attempts each item individually so one out-of-stock item doesn't block the rest |
| Laravel validation 422 response ALWAYS surfaced to toast + inline per-field | Prevents user confusion when fields silently fail (was a major UX complaint before) |
| Pakistan phone regex: `/^(\+92|0)3[0-9]{9}$/` | Pattern matches JazzCash / EasyPaisa / Telenor / Zong standard 03XXXXXXXXX format; allows `+92` country code too |
| Order confirmation uses WhatsApp deep-link instead of backend SMS | Cheaper, no SMS gateway needed; users already familiar with WhatsApp for customer service in PK |

---

## Known Gotchas (Watch Out)

1. **Slug mismatch bug — name-derived slugs ≠ API slugs.**
   - e.g. product name "Moringa Leaf Powder" → someone on the team once computed slug `moringa-leaf-powder`. Backend API slug is actually `moringapowder`. Any link using name-derived slug → 404.
   - Rule: always read `p.slug` from API. Static fallback data intentionally omits slug so cards don't route at all.

2. **Product price 0 trap.**
   - Top-level `product.price` field from API OFTEN equals `0` for variant-based products. If you show `product.price` on a card, the customer sees "PKR 0" → adds to cart → correct price at checkout.
   - Rule: always `Math.min(...variants.map(v => v.final_price ?? v.price))` first, fall back to `sale_price ?? price`.

3. **429 at build time ≠ failure.**
   - A 429 from API during `next build` → our code logs a warning, returns null, continues. The page is still served (just not pre-rendered at build time). ISR will pick it up on first visit.
   - If you see `[products] Product "X" still rate-limited after 2 attempts` — check if `BUILD_API_TOKEN` is set (the X-Build-Token bypass should eliminate these).

4. **Middleware can't read localStorage directly.**
   - Middleware runs on the Edge. Token lives in localStorage (browser). Middleware only checks companion cookie `pansari-auth-token=1` (presence-only, not the real token).
   - If user logs out on one tab but cookie isn't cleared on another: subsequent server navs to protected routes → 307 to login. Expected behavior.

5. **`useEffect` infinite loops on filter + searchParams sync.**
   - Any component that reads URL searchParams AND writes them via router MUST guard against self-triggering with:
     a. `isInitialMount.current` flag that skips effect on pass #1
     b. Serialized equality check before calling setState (e.g. `JSON.stringify(prev) === JSON.stringify(next)`)
   - Not doing this → re-renders every 50 ms and the API endpoint gets hammered → triggers 429 backend rate limit.

6. **`cartItems.find` for auth users must match by `cartItemId`, never by `id + size`.**
   - Two different cart row IDs can theoretically share `product_id + size` if the backend has duplicates; the API row id is the only source of truth for PATCH/DELETE.

7. **Banner image sizing 812×317 ratio.**
   - Design assets delivered at 812 px wide × 317 px tall (~2.56:1 aspect). Uploaded images vary → CSS stretches/crops unevenly. Need to enforce `aspect-[812/317]` wrapper with `object-cover` to match design.

---

## Data Issues Discovered

| Issue | Details | Status |
|-------|---------|--------|
| Urdu name fallback | Some products have `urdu_name === ""` or `null → English name` was filling it, causing duplicate same text. Rule: only show Urdu field when non-empty AND `!== nameEn`. | Fixed in `apiProductToLegacy()` ✅ |
| API product `price` field is `0` for variant products | Variant-based products only price via variants → top-level price is 0. Display layer must read variants first. | See rules.md #3. All known call sites updated ✅ / TODO: audit remaining 3rd-party. |
| Manjistha product merge | Name in English + Urdu + thumbnail image not finalized yet. Backend may have 2 records for it (Manjistha v2 / old name). Merge pending name confirmation from owner. | **Open decision: Manjistha — name / thumbnail TODO: confirm with owner** |
| Static fallback `data/products.ts` slugs omitted | Intentionally done. Cards are non-navigable offline rather than routing to 404 URLs.  | Intended behavior ✅ |
| 22 products skipped at build (pre-X-Build-Token era) | Before build-token was wired, during 429 storms about 22 products ended up ISR-only. Once BUILD_API_TOKEN env var is set + fresh build run, all products should pre-render without issue. | Pending: env var + fresh build test in tasks.md |

---

## Open Decisions

1. **Hostinger VPS deployment (backend side)** — owner is evaluating moving backend from current host → Hostinger VPS. Frontend is unaffected (API URL stays same via env var) unless backend also moves to new domain, which requires `NEXT_PUBLIC_API_URL` change + redeploy. **Status: pending owner confirmation.**

2. **Manjistha product merge (name / thumbnail)** — product name in Urdu/English and primary thumbnail not finalized by owner. When backend merges / creates the canonical record, frontend needs: a) re-run build to pick up new slug in sitemap and static params; b) verify PDP renders the urdu_name correct. **Status: owner pending input.**

3. **Form library migration (react-hook-form + zod)** — packages installed (`@hookform/resolvers`, `react-hook-form`, `zod`) but checkout/login/register currently use controlled state pattern. Migrate or leave? **Status: no decision yet. Only migrate if modifying the form heavily; leave alone for trivial changes.**

4. **Legacy `pansariinn.pk` retirement + 301s** — TODO: confirm whether 301s from `.pk` domain to `.com` are set up at DNS/CDN level. Frontend can't do cross-domain redirects.

---

## Backend Dependencies

- **Frontend depends on backend repo `pansarin-inn` (Laravel)** — owner maintains this. Frontend-only devs: never assume an API endpoint exists without testing against live/dev backend.
- API contract changes: when backend adds a new field (e.g. `final_price`, `scientific_name`, `long_description`, `how_to_use`, `ingredients`, `benefits`, `key_features`), backend MUST confirm field name + type → frontend type updates in `types/product.ts` → component updates accordingly.

### Backend docs: see pansarin-inn/docs/project/
(TODO: add path to backend docs folder once confirmed — expected pattern: sibling folder `../pansarin-inn/docs/project/` or owner-specified location)

---

## Session Log

> Format: `YYYY-MM-DD — <one-liner of what was learned/decided/done>`

- 2026-09-20 — Knowledge base created: prd, architecture, rules, design, tasks, memory. Audited app routes, lib/ API layer, contexts, components, next.config, middleware, sitemap/robots, env vars, and types. Identified X-Build-Token frontend env+build test as the main P0 remaining.
- 2026-09-20 — Phase 2 code audit resolved 28 code-answerable TODO:confirm items across prd/arch/rules/design/tasks docs. Confirmed 12 specific facts: variant selector auto-detects attr key (Weight/Volume/Size), ProductCard renders review count, footer category routes are real /herb etc. static pages, quick-view toast delays because `addToCart()` awaited before firing, register page uses generic phone regex (not PK), blog 0-articles dual root cause (first-page-only pill counts + tag folded to text search), rewards earn/redeem status (Purchase=live, Redeem=awaiting backend), banner aspect-ratio wrapper absent from code, blog detail page breaks hard rule #1 (cache() dedupe missing on fetchBlogServer — 2 API calls per view), profile page has NO name/email/phone edit form, health concerns page fully implements 12 slugs with icons, static pages (About/Quality/Pricing) use in-page hardcoded JS arrays (not CMS). Removed stale tasks.md PENDING items confirmed already working.
